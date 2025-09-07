<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AccountBalanceController extends Controller
{
    //** Generate & simpan Laporan Perubahan Modal */
    public function generate(Request $r)
    {
        $period = $r->input('period', now()->format('Y-m'));   // default bulan ini
        [$year, $month] = array_map('intval', explode('-', $period));

        $start = Carbon::create($year, $month, 1)->toDateString();
        $end   = Carbon::create($year, $month, 1)->endOfMonth()->toDateString();

        // Modal awal: saldo akun ekuitas (3xx) sebelum periode
        $openingEquity = DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->where('acc.date','<',$start)
            ->where('a.reff','LIKE','3%')
            ->sum(DB::raw('acc.credit - acc.debit'));

        // Setoran modal (301)
        $ownerContrib = DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date',[$start,$end])
            ->where('a.reff','301')
            ->sum(DB::raw('acc.credit - acc.debit'));

        // Prive (302)
        $ownerDraw = DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date',[$start,$end])
            ->where('a.reff','302')
            ->sum(DB::raw('acc.debit - acc.credit'));

        // Laba bersih: 4xx – (5xx–7xx)
        $netIncome = DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date',[$start,$end])
            ->sum(DB::raw("
                CASE 
                  WHEN a.reff LIKE '4%' THEN (acc.credit - acc.debit)
                  WHEN a.reff LIKE '5%' OR a.reff LIKE '6%' OR a.reff LIKE '7%' THEN (acc.debit - acc.credit)
                  ELSE 0
                END
            "));

        $closingEquity = $openingEquity + $ownerContrib - $ownerDraw + $netIncome;

        // simpan / update
        $row = AccountBalance::updateOrCreate(
            ['period_month' => $period],
            [
                'opening_equity'    => round($openingEquity,2),
                'owner_contribution'=> round($ownerContrib,2),
                'owner_draw'        => round($ownerDraw,2),
                'net_income'        => round($netIncome,2),
                'closing_equity'    => round($closingEquity,2),
                'user_id'           => auth()->id() ?? 1,
            ]
        );

        return response()->json($row);
    }

    public function show(Request $r)
    {
        // period=YYYY-MM (contoh: 2025-08)
        $period = $r->input('period', now()->format('Y-m'));
        [$Y, $M] = array_map('intval', explode('-', $period));
        $start = Carbon::create($Y, $M, 1)->toDateString();
        $end   = Carbon::create($Y, $M, 1)->endOfMonth()->toDateString();

        // helper sum
        $sum = fn($sql) => (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date', [$start, $end])
            ->whereRaw($sql)
            ->sum(DB::raw('acc.credit - acc.debit')); // positif = normal kredit

        $sumDeb = fn($sql) => (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date', [$start, $end])
            ->whereRaw($sql)
            ->sum(DB::raw('acc.debit - acc.credit')); // positif = normal debit

        // ------------- PENDAPATAN -------------
        $salesGross   = $sum("a.reff = '401'");                 // Penjualan
        $salesReturn  = $sumDeb("a.reff = '402'");              // Retur & Potongan Penjualan (opsional)
        $salesDisc    = $sumDeb("a.reff = '403'");              // Diskon Penjualan (opsional)
        $salesNet     = $salesGross - $salesReturn - $salesDisc;

        // ------------- HPP (PERPETUAL) -------------
        $hpp = $sumDeb("a.reff = '501'"); // debit - credit akun 501

        // ------------- FREIGHT-IN (jika ada) -------------
        $freightIn = $sumDeb("a.reff = '502'");

        // ------------- PERSEDIAAN AWAL & AKHIR (akun 114) -------------
        // saldo bersih persediaan s/d H-1
        $openingInv = (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->where('acc.date','<',$start)->where('a.reff','114')
            ->sum(DB::raw('acc.debit - acc.credit')); // normal debit

        // saldo bersih persediaan s/d tgl akhir
        $closingInv = (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->where('acc.date','<=',$end)->where('a.reff','114')
            ->sum(DB::raw('acc.debit - acc.credit'));

        // ------------- “Periodic style” derivation -------------
        $netPurchases = $hpp - $freightIn + $closingInv - $openingInv;

        // Kalau kamu punya akun detail pembelian, ini akan memperkaya tampilan (opsional)
        $has504 = DB::table('account')->where('reff','504')->exists(); // Retur Pembelian
        $has505 = DB::table('account')->where('reff','505')->exists(); // Potongan Pembelian
        $purchaseReturns = $has504 ? $sum("a.reff = '504'") : 0;       // normal kredit
        $purchaseDisc    = $has505 ? $sum("a.reff = '505'") : 0;

        // estimasi Pembelian Kotor dari pembelian bersih + retur + potongan
        $grossPurchases = $netPurchases + $purchaseReturns + $purchaseDisc;

        // ------------- BEBAN OPERASIONAL -------------
        $opex = (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date',[$start,$end])
            ->where(function($q){
                $q->where('a.reff','LIKE','6%'); // 6xx beban penjualan & adm
            })
            ->sum(DB::raw('acc.debit - acc.credit'));

        // Penyusutan bisa 607/608 → sudah termasuk 6xx di atas
        // Beban lain-lain contoh 2xx/7xx/9xx sesuaikan:
        $otherExpense = (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date',[$start,$end])
            ->where(function($q){
                $q->where('a.reff','LIKE','7%')
                  ->orWhere('a.reff','901'); // contoh: rugi aset
            })
            ->sum(DB::raw('acc.debit - acc.credit'));

        // Pajak penghasilan bila dicatat di 7xx/9xx tertentu, tinggal tambahkan/refactor.

        // ------------- RINGKASAN -------------
        $grossProfit = $salesNet - $hpp;
        $operatingIncome = $grossProfit - $opex;
        $profitBeforeTax  = $operatingIncome - $otherExpense;
        // jika punya akun pajak penghasilan (mis. 703 untuk pajak), ambil dari sana:
        $incomeTax = (float) DB::table('accounting as acc')
            ->join('account as a','a.id','=','acc.account_id')
            ->whereBetween('acc.date',[$start,$end])
            ->where('a.reff','703')
            ->sum(DB::raw('acc.debit - acc.credit'));
        $netIncome = $profitBeforeTax - $incomeTax;

    // kirim ke view
    return Inertia::render('Reporting/AllReport', [
            'period'         => $period,
            'salesGross'     => $salesGross,
            'salesReturn'    => $salesReturn,
            'salesDisc'      => $salesDisc,
            'salesNet'       => $salesNet,
            'openingInv'     => $openingInv,
            'grossPurchases' => $grossPurchases,
            'purchaseReturns'=> $purchaseReturns,
            'purchaseDisc'   => $purchaseDisc,
            'freightIn'      => $freightIn,
            'netPurchases'   => $netPurchases,
            'goodsAvail'     => $openingInv + $netPurchases + $freightIn,
            'closingInv'     => $closingInv,
            'hpp'            => $hpp,
            'grossProfit'    => $grossProfit,
            'opex'           => $opex,
            'operatingIncome'=> $operatingIncome,
            'otherExpense'   => $otherExpense,
            'profitBeforeTax'=> $profitBeforeTax,
            'incomeTax'      => $incomeTax,
            'netIncome'      => $netIncome,
        ]);
    }
}

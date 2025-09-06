<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
}

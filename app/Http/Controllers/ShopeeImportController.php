<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;   // composer require phpoffice/phpspreadsheet
use App\Models\Account;
use App\Models\Accounting;
use App\Services\GeminiService;           // service wrapper (contoh di bawah)

class ShopeeImportController extends Controller
{
    /** PREVIEW: upload file, baca beberapa baris, minta konfirmasi user */
    public function preview(Request $req)
    {
        $data = $req->validate([
            'file'    => 'required|file|mimes:xls,xlsx',
            // mapping head col -> nama kolom di sheet Shopee
            'map.order_no'     => 'required|string',
            'map.completed_at' => 'required|string',
            'map.gross_amount' => 'required|string',
            'map.admin_fee'    => 'required|string',
            'map.shipping_fee' => 'required|string',
            'map.product_cost' => 'nullable|string', // HPP (opsional)
        ]);

        // simpan file—NANTI path ini akan ditanam ke kolom NOTE pada setiap baris jurnal
        $storedPath = $req->file('file')->store('imports/shopee');

        $sheet = IOFactory::load(Storage::path($storedPath))->getSheetByName('orders');
        if (!$sheet) $sheet = IOFactory::load(Storage::path($storedPath))->getActiveSheet();

        $rows = $sheet->toArray(null, true, true, true);
        $header = array_map(fn($v) => trim(strtolower((string)$v)), array_shift($rows));
        $ix = fn($name) => array_search(trim(strtolower($name)), $header, true);

        $col = [
            'order_no'     => $ix($data['map']['order_no']),
            'completed_at' => $ix($data['map']['completed_at']),
            'gross'        => $ix($data['map']['gross_amount']),
            'admin'        => $ix($data['map']['admin_fee']),
            'ship'         => $ix($data['map']['shipping_fee']),
            'cost'         => isset($data['map']['product_cost']) ? $ix($data['map']['product_cost']) : null,
        ];

        $preview = [];
        $sum = ['gross'=>0,'admin'=>0,'ship'=>0,'net'=>0,'cost'=>0];
        foreach (array_slice($rows, 0, 50) as $r) {
            $gross = self::toAmount($r[$col['gross']] ?? 0);
            $admin = self::toAmount($r[$col['admin']] ?? 0);
            $ship  = self::toAmount($r[$col['ship']] ?? 0);
            $cost  = $col['cost'] !== null ? self::toAmount($r[$col['cost']] ?? 0) : 0.0;
            $net   = $gross - $admin - $ship;

            $preview[] = [
                'order_no'     => (string)($r[$col['order_no']] ?? ''),
                'date'         => Carbon::parse((string)($r[$col['completed_at']] ?? now()))->toDateString(),
                'gross'        => $gross,
                'admin_fee'    => $admin,
                'shipping_fee' => $ship,
                'net'          => $net,
                'hpp'          => $cost,
            ];

            $sum['gross'] += $gross; $sum['admin'] += $admin; $sum['ship'] += $ship; $sum['net'] += $net; $sum['cost'] += $cost;
        }

        // === Analisis GEMINI (opsional) ===
        $insights = app(GeminiService::class)->analyzeShopeePreview($preview, $sum);

        // token idempotensi
        $token = Str::uuid()->toString();
        cache()->put("shopee_import:$token", [
            'path'    => $storedPath,
            'map'     => $data['map'],
            'user_id' => $req->user()->id ?? 1,
        ], now()->addHours(2));

        return response()->json([
            'token'   => $token,
            'file'    => $storedPath,   // akan disimpan ke kolom NOTE saat commit
            'sample'  => $preview,
            'summary' => $sum,
            'insights'=> $insights,
        ]);
    }

    /** COMMIT: baca ulang file dari storage, hitung jurnal & simpan ke DB */
    public function commit(Request $req)
    {
        $data = $req->validate([
            'token'         => 'required|string',

            // map COA pakai kode reff (biar fleksibel di tiap environment)
            'coa.bank'      => 'required|string', // ex: '102'
            'coa.sales'     => 'required|string', // ex: '401'
            'coa.admin_exp' => 'required|string', // ex: '609'
            'coa.ship_exp'  => 'required|string', // ex: '604'
            'coa.hpp'       => 'required|string', // ex: '501'
            'coa.inventory' => 'required|string', // ex: '114'
        ]);

        $state = cache()->pull("shopee_import:{$data['token']}");
        if (!$state) {
            return response()->json(['message' => 'Token tidak valid/kedaluwarsa. Jalankan preview ulang.'], 422);
        }

        // reff → id
        $acc = Account::query()->pluck('id', 'reff');  // ['101'=>1, ...]
        foreach ($data['coa'] as $k => $reff) {
            if (!isset($acc[$reff])) {
                return response()->json(['message'=>"COA {$k} ($reff) belum ada."], 422);
            }
        }

        $fullPath = Storage::path($state['path']);
        $sheet    = IOFactory::load($fullPath)->getSheetByName('orders');
        if (!$sheet) $sheet = IOFactory::load($fullPath)->getActiveSheet();
        $rows     = $sheet->toArray(null, true, true, true);

        $header = array_map(fn($v) => trim(strtolower((string)$v)), array_shift($rows));
        $ix = fn($name) => array_search(trim(strtolower($name)), $header, true);

        $col = [
            'order_no'     => $ix($state['map']['order_no']),
            'completed_at' => $ix($state['map']['completed_at']),
            'gross'        => $ix($state['map']['gross_amount']),
            'admin'        => $ix($state['map']['admin_fee']),
            'ship'         => $ix($state['map']['shipping_fee']),
            'cost'         => isset($state['map']['product_cost']) ? $ix($state['map']['product_cost']) : null,
        ];

        $userId = $state['user_id'] ?? 1;
        $noteFile = $state['path']; // ← disimpan ke kolom NOTE (permintaanmu)
        $descBase = 'Penjualan di Shopee'; // ← kolom description

        DB::transaction(function () use ($rows, $col, $acc, $data, $userId, $noteFile, $descBase) {

            // gabungkan per order agar tidak dobel jika 1 order punya banyak SKU
            $orders = [];

            foreach ($rows as $r) {
                $orderNo = trim((string)($r[$col['order_no']] ?? ''));
                if ($orderNo === '') continue;

                $date  = Carbon::parse((string)($r[$col['completed_at']] ?? now()))->toDateString();
                $gross = self::toAmount($r[$col['gross']] ?? 0);
                $admin = self::toAmount($r[$col['admin']] ?? 0);
                $ship  = self::toAmount($r[$col['ship']] ?? 0);
                $cost  = $col['cost'] !== null ? self::toAmount($r[$col['cost']] ?? 0) : 0.0;

                $key = $orderNo.'|'.$date;
                if (!isset($orders[$key])) {
                    $orders[$key] = ['order'=>$orderNo,'date'=>$date,'gross'=>0,'admin'=>0,'ship'=>0,'cost'=>0];
                }
                $orders[$key]['gross'] += $gross;
                $orders[$key]['admin'] += $admin;
                $orders[$key]['ship']  += $ship;
                $orders[$key]['cost']  += $cost;
            }

            foreach ($orders as $o) {
                $net = $o['gross'] - $o['admin'] - $o['ship'];
                $desc = "{$descBase} #{$o['order']}";

                // Debit: Bank/Kas (net)
                self::postRow($o['date'], $noteFile, $desc, $acc[$data['coa']['bank']],  $userId, $debit=$net, $credit=0);
                // Debit: Beban admin
                if ($o['admin'] != 0) {
                    self::postRow($o['date'], $noteFile, "Biaya admin Shopee #{$o['order']}", $acc[$data['coa']['admin_exp']], $userId, $debit=$o['admin'], $credit=0);
                }
                // Debit: Beban ongkir
                if ($o['ship'] != 0) {
                    self::postRow($o['date'], $noteFile, "Beban ongkir Shopee #{$o['order']}", $acc[$data['coa']['ship_exp']], $userId, $debit=$o['ship'], $credit=0);
                }
                // Kredit: Penjualan (gross)
                self::postRow($o['date'], $noteFile, $desc, $acc[$data['coa']['sales']], $userId, $debit=0, $credit=$o['gross']);

                // HPP
                if ($o['cost'] > 0) {
                    self::postRow($o['date'], $noteFile, "HPP Shopee #{$o['order']}", $acc[$data['coa']['hpp']], $userId, $debit=$o['cost'], $credit=0);
                    self::postRow($o['date'], $noteFile, "HPP Shopee #{$o['order']}", $acc[$data['coa']['inventory']], $userId, $debit=0, $credit=$o['cost']);
                }
            }
        });

        return response()->json(['message' => 'Data Shopee berhasil diimpor & diposting.']);
    }

    /** Insert baris jurnal sesuai skema tabel: note=path excel, image=null, date dari shopee */
    private static function postRow(string $date, string $noteFile, string $desc, int $accountId, int $userId, float $debit, float $credit): void
    {
        Accounting::create([
            'description' => $desc,            // ← “Penjualan di Shopee …”
            'debit'       => round($debit, 2),
            'credit'      => round($credit, 2),
            'image'       => null,             // ← dikosongkan
            'note'        => $noteFile,        // ← simpan path Excel di NOTE
            'date'        => $date,            // ← DATE (Y-m-d) dari file Shopee
            'account_id'  => $accountId,
            'user_id'     => $userId,
        ]);
    }

    /** Normalisasi angka: dukung format 1.234,56 dan 1,234.56 */
    private static function toAmount($v): float
    {
        $s = trim((string)$v);
        // hapus spasi & currency
        $s = preg_replace('/[^0-9,.\-]/', '', $s) ?? '0';
        // jika ada koma & titik, tebak pemisah ribuan vs desimal
        if (strpos($s, ',') !== false && strpos($s, '.') !== false) {
            // anggap format ID (1.234,56)
            $s = str_replace('.', '', $s);
            $s = str_replace(',', '.', $s);
        } elseif (strpos($s, ',') !== false && strpos($s, '.') === false) {
            // 123,45 → 123.45
            $s = str_replace(',', '.', $s);
        }
        return (float)$s;
    }
}

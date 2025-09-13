<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Account;
use App\Models\Accounting;

class ShopeeImportController extends Controller
{
    /** PREVIEW: upload file, baca header & beberapa row */
    public function preview(Request $req)
    {
        $data = $req->validate([
            'file' => 'required|file|mimes:xls,xlsx,csv',
        ]);

        $storedPath = $req->file('file')->store('imports/shopee');

        $spreadsheet = IOFactory::load(Storage::path($storedPath));
        $sheet = $spreadsheet->getSheetByName('orders') ?: $spreadsheet->getActiveSheet();

        $rows = $sheet->toArray(null, true, false, false);

        $header = array_map(fn($v) => trim((string)$v), array_shift($rows));
        $sample = array_slice($rows, 0, 10);

        $token = Str::uuid()->toString();
        cache()->put("shopee_import:$token", [
            'path'          => $storedPath,
            'original_name' => $req->file('file')->getClientOriginalName(),
            'user_id'       => $req->user()->id ?? 1,
        ], now()->addHours(2));

        return response()->json([
            'token'  => $token,
            'file'   => $storedPath,
            'header' => $header,
            'sample' => $sample,
        ]);
    }

    /** COMMIT: simpan ke DB */
    public function commit(Request $req)
    {
        $data = $req->validate([
            'token'            => 'required|string',
            'map.order_no'     => 'required|string',
            'map.completed_at' => 'required|string',
            'map.gross_amount' => 'required|string',
            'map.admin_fee'    => 'required|string',
            'map.shipping_fee' => 'required|string',
            'map.product_cost' => 'nullable|string',
            'coa.bank'         => 'required|string',
            'coa.sales'        => 'required|string',
            'coa.admin_exp'    => 'required|string',
            'coa.ship_exp'     => 'required|string',
            'coa.hpp'          => 'required|string',
            'coa.inventory'    => 'required|string',
        ]);

        $state = cache()->pull("shopee_import:{$data['token']}");
        if (!$state) {
            return response()->json(['message' => 'Token tidak valid/kedaluwarsa. Jalankan preview ulang.'], 422);
        }

        $fullPath = Storage::path($state['path']);
        $spreadsheet = IOFactory::load($fullPath);
        $sheet = $spreadsheet->getSheetByName('orders') ?: $spreadsheet->getActiveSheet();

        $rows = $sheet->toArray(null, true, false, false);

        $header = array_map(fn($v) => trim(strtolower((string)$v)), array_shift($rows));

        // helper cari index kolom
        $ix = function ($name) use ($header) {
            $pos = array_search(trim(strtolower($name)), $header, true);
            if ($pos === false) {
                throw new \RuntimeException("Kolom '{$name}' tidak ditemukan di file.");
            }
            return $pos;
        };

        $col = [
            'order_no'     => $ix($data['map']['order_no']),
            'completed_at' => $ix($data['map']['completed_at']),
            'gross'        => $ix($data['map']['gross_amount']),
            'admin'        => $ix($data['map']['admin_fee']),
            'ship'         => $ix($data['map']['shipping_fee']),
            'cost'         => isset($data['map']['product_cost']) ? $ix($data['map']['product_cost']) : null,
        ];

        // validate COA
        $acc = Account::query()->pluck('id', 'reff');
        foreach ($data['coa'] as $k => $reff) {
            if (!isset($acc[$reff])) {
                return response()->json(['message' => "COA {$k} ($reff) belum ada."], 422);
            }
        }

        $userId   = $state['user_id'] ?? 1;
        $noteFile = $state['original_name'] ?? $state['path'];
        $descBase = 'Shopee Order';

        try {
            DB::transaction(function () use ($rows, $col, $acc, $data, $userId, $noteFile, $descBase) {
                $orders = [];

                foreach ($rows as $r) {
                    $orderNo = trim((string)($r[$col['order_no']] ?? ''));
                    if ($orderNo === '') continue;

                    $dateRaw = (string)($r[$col['completed_at']] ?? '');
                    $date = Carbon::parse($dateRaw ?: now())->toDateString();

                    $gross = self::toAmount($r[$col['gross']] ?? 0);
                    $admin = self::toAmount($r[$col['admin']] ?? 0);
                    $ship  = self::toAmount($r[$col['ship']] ?? 0);
                    $cost  = $col['cost'] !== null ? self::toAmount($r[$col['cost']] ?? 0) : 0.0;

                    $key = $orderNo . '|' . $date;
                    if (!isset($orders[$key])) {
                        $orders[$key] = ['order' => $orderNo, 'date' => $date, 'gross' => 0, 'admin' => 0, 'ship' => 0, 'cost' => 0];
                    }
                    $orders[$key]['gross'] += $gross;
                    $orders[$key]['admin'] += $admin;
                    $orders[$key]['ship']  += $ship;
                    $orders[$key]['cost']  += $cost;
                }

                foreach ($orders as $o) {
                    $net = $o['gross'] - $o['admin'] - $o['ship'];
                    $desc = "{$descBase} #{$o['order']}";

                    // Bank (debit)
                    self::postRow($o['date'], $noteFile, $desc, $acc[$data['coa']['bank']], $userId, $net, 0);

                    // Admin fee
                    if ($o['admin'] != 0) {
                        self::postRow($o['date'], $noteFile, "Biaya Admin #{$o['order']}", $acc[$data['coa']['admin_exp']], $userId, $o['admin'], 0);
                    }

                    // Shipping cost
                    if ($o['ship'] != 0) {
                        self::postRow($o['date'], $noteFile, "Beban Ongkir #{$o['order']}", $acc[$data['coa']['ship_exp']], $userId, $o['ship'], 0);
                    }

                    // Sales
                    self::postRow($o['date'], $noteFile, $desc, $acc[$data['coa']['sales']], $userId, 0, $o['gross']);

                    // HPP & Inventory
                    if ($o['cost'] > 0) {
                        self::postRow($o['date'], $noteFile, "HPP #{$o['order']}", $acc[$data['coa']['hpp']], $userId, $o['cost'], 0);
                        self::postRow($o['date'], $noteFile, "Persediaan #{$o['order']}", $acc[$data['coa']['inventory']], $userId, 0, $o['cost']);
                    }
                }
            });

            return response()->json(['message' => 'Data Shopee berhasil diimpor & diposting.']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Gagal import: ' . $e->getMessage()], 500);
        }
    }

    private static function postRow(string $date, string $noteFile, string $desc, int $accountId, int $userId, float $debit, float $credit): void
    {
        Accounting::create([
            'description' => $desc,
            'debit'       => round($debit, 2),
            'credit'      => round($credit, 2),
            'image'       => null,
            'note'        => $noteFile,
            'date'        => $date,
            'account_id'  => $accountId,
            'user_id'     => $userId,
        ]);
    }

    private static function toAmount($v): float
    {
        $s = trim((string)$v);
        $s = preg_replace('/[^0-9,.\-]/', '', $s) ?? '0';

        $hasDot = strpos($s, '.') !== false;
        $hasComma = strpos($s, ',') !== false;

        if ($hasDot && $hasComma) {
            $s = str_replace('.', '', $s);
            $s = str_replace(',', '.', $s);
        } elseif ($hasDot && !$hasComma) {
            $s = str_replace('.', '', $s);
        } elseif ($hasComma && !$hasDot) {
            $s = str_replace(',', '.', $s);
        }

        return (float)$s;
    }
}

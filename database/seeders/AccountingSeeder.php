<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\Accounting;
use App\Models\Account; 

class AccountingSeeder extends Seeder
{
/** Peta account_id persis seperti di tabel-mu (gambar). */
    private const ACC = [
        'KAS'                    => 1,   // 101
        'BANK'                   => 2,   // 102
        'PIUTANG'                => 3,   // 103
        'CADANGAN_PIUTANG'       => 4,   // 104 (kontra)
        'PERSEDIAAN'             => 5,   // 114
        'UANG_MUKA_PEMBELIAN'    => 6,   // 115
        'BEBAN_DIBAYAR_DIMUKA'   => 7,   // 116
        'PPN_MASUKAN'            => 8,   // 117
        'PERALATAN'              => 9,   // 121
        'KENDARAAN'              => 10,  // 122
        'AKUM_PERALATAN'         => 11,  // 123 (kontra)
        'AKUM_KENDARAAN'         => 12,  // 124 (kontra)
        'UTANG_USAHA'            => 13,  // 201
        'UTANG_GAJI'             => 14,  // 202
        'UTANG_BUNGA'            => 15,  // 203
        'PEND_DITERIMA_DIMUKA'   => 16,  // 204
        'UTANG_BANK'             => 17,  // 205
        'PPN_KELUARAN'           => 18,  // 206
        'UTANG_PAJAK_LAIN'       => 19,  // 207
        'MODAL'                  => 20,  // 301
        'PRIVE'                  => 21,  // 302
        'LABA_DITAHAN'           => 22,  // 303
        'PENJUALAN'              => 23,  // 401
        'RETUR_PENJUALAN'        => 24,  // 402 (kontra)
        'DISKON_PENJUALAN'       => 25,  // 403 (kontra)
        // Tambahkan akun beban/biaya lain kalau sudah ada id-nya
        // misal: 605 Utilitas, 606 Sewa, 602 Iklan, 609 Admin Bank, dst.
    ];

    /** helper untuk insert baris jurnal */
    private function line(Carbon $date, string $jv, string $desc, int $accountId, float $debit = 0, float $credit = 0): void
    {
        Accounting::factory()->create([
            'description' => $desc,
            'debit'       => $debit,
            'credit'      => $credit,
            'image'       => null,
            'note'        => $jv,            // nomor JV sebagai pengelompokan
            'account_id'  => $accountId,
            'user_id'     => 1,
            'created_at'  => $date,
            'updated_at'  => $date,
        ]);
    }

    public function run(): void
    {
        // === atur bulan Agustus “kemarin” (ubah tahun jika perlu) ===
        $year  = (int) now()->subMonth()->format('Y');   // contoh dinamis
        $month = 8;                                      // fix Agustus

        // 1) 01 Aug – Setoran modal tunai Rp50.000.000
        $d = Carbon::create($year, $month, 1);
        $jv = 'JV-'.$d->format('Ymd').'-001';
        $this->line($d, $jv, 'Setoran modal tunai', self::ACC['KAS'],   50000000, 0);
        $this->line($d, $jv, 'Setoran modal tunai', self::ACC['MODAL'], 0, 50000000);

        // 2) 02 Aug – Pembelian persediaan tunai Rp15.000.000
        $d = Carbon::create($year, $month, 2);
        $jv = 'JV-'.$d->format('Ymd').'-001';
        $this->line($d, $jv, 'Pembelian persediaan tunai', self::ACC['PERSEDIAAN'], 15000000, 0);
        $this->line($d, $jv, 'Pembelian persediaan tunai', self::ACC['KAS'],        0, 15000000);

        // 3) 03 Aug – Beli etalase kredit Rp5.000.000
        $d = Carbon::create($year, $month, 3);
        $jv = 'JV-'.$d->format('Ymd').'-001';
        $this->line($d, $jv, 'Pembelian etalase kredit', self::ACC['PERALATAN'], 5000000, 0);
        $this->line($d, $jv, 'Pembelian etalase kredit', self::ACC['UTANG_USAHA'], 0, 5000000);

        // 4) 05 Aug – Penjualan tunai Rp6.000.000 (HPP Rp3.000.000)
        $d = Carbon::create($year, $month, 5);
        $jv1 = 'JV-'.$d->format('Ymd').'-001'; // pengakuan pendapatan
        $this->line($d, $jv1, 'Penjualan tunai', self::ACC['KAS'],       6000000, 0);
        $this->line($d, $jv1, 'Penjualan tunai', self::ACC['PENJUALAN'], 0, 6000000);
        $jv2 = 'JV-'.$d->format('Ymd').'-002'; // HPP
        // untuk HPP & persediaan, gunakan id yang ada: PERSEDIAAN (5). HPP belum ada di daftar gambar.
        // Jika kamu sudah punya akun HPP (mis. id=??), ganti '???' di bawah dengan ID HPP-mu.
        $HPP_ID = 0; // <-- GANTI dengan account_id HPP yang sebenarnya (misal 26).
        if ($HPP_ID > 0) {
            $this->line($d, $jv2, 'HPP penjualan tunai', $HPP_ID,             3000000, 0);
            $this->line($d, $jv2, 'HPP penjualan tunai', self::ACC['PERSEDIAAN'], 0, 3000000);
        }

        // 5) 10 Aug – Penjualan kredit Rp4.000.000 (HPP Rp2.000.000)
        $d = Carbon::create($year, $month, 10);
        $jv1 = 'JV-'.$d->format('Ymd').'-001';
        $this->line($d, $jv1, 'Penjualan kredit', self::ACC['PIUTANG'],  4000000, 0);
        $this->line($d, $jv1, 'Penjualan kredit', self::ACC['PENJUALAN'],0, 4000000);
        $jv2 = 'JV-'.$d->format('Ymd').'-002';
        if ($HPP_ID > 0) {
            $this->line($d, $jv2, 'HPP penjualan kredit', $HPP_ID,              2000000, 0);
            $this->line($d, $jv2, 'HPP penjualan kredit', self::ACC['PERSEDIAAN'], 0, 2000000);
        }

        // 6) 15 Aug – Pelunasan piutang Rp3.000.000 ke Bank
        $d = Carbon::create($year, $month, 15);
        $jv = 'JV-'.$d->format('Ymd').'-001';
        $this->line($d, $jv, 'Pelunasan piutang via bank', self::ACC['BANK'],   3000000, 0);
        $this->line($d, $jv, 'Pelunasan piutang via bank', self::ACC['PIUTANG'],0, 3000000);

        // 7) 25 Aug – Bayar sebagian utang pemasok Rp2.000.000 tunai
        $d = Carbon::create($year, $month, 25);
        $jv = 'JV-'.$d->format('Ymd').'-001';
        $this->line($d, $jv, 'Pembayaran utang ke pemasok', self::ACC['UTANG_USAHA'], 2000000, 0);
        $this->line($d, $jv, 'Pembayaran utang ke pemasok', self::ACC['KAS'],         0, 2000000);
    }
}
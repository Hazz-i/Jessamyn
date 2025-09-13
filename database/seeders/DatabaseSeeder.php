<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Account; 
use App\Models\ProductVariant;
use Illuminate\Support\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Jessamyn',
            'email' => 'jessamyncompany@gmail.com',
            'password' => bcrypt('jessamyn123_'),
            'role' => 'admin',
        ]);

        $now = Carbon::now();

        // ============================
        // CHART OF ACCOUNTS – BABY OIL
        // Kode: 1 Aset, 2 Liabilitas, 3 Ekuitas, 4 Pendapatan,
        //       5 HPP, 6 Beban Penjualan & Admin, 7 Beban Umum, 8/9 Lain-lain
        // ============================
        $coa = [
            // 1xx A S E T   L A N C A R
            ['101','Kas','Kas kecil/laci kas toko'],
            ['102','Bank','Rekening giro/tabungan operasional'],
            ['103','Piutang Usaha','Tagihan penjualan kredit ke pelanggan'],
            ['104','Cadangan Kerugian Piutang','Akun kontra aset (-)'],
            ['114','Persediaan Barang Dagang','Persediaan baby oil untuk dijual'],
            ['115','Uang Muka Pembelian','DP ke pemasok'],
            ['116','Beban Dibayar Dimuka','Sewa/asuransi dibayar di muka'],
            ['117','PPN Masukan','PPN Masukan atas pembelian (jika PKP)'],

            // 12x A S E T   T E T A P
            ['121','Peralatan Toko','Etalase, rak, timbangan, alat display'],
            ['122','Kendaraan Operasional','Motor/van pengiriman'],
            ['123','Akumulasi Penyusutan Peralatan','Kontra aset (-)'],
            ['124','Akumulasi Penyusutan Kendaraan','Kontra aset (-)'],

            // 2xx L I A B I L I T A S
            ['201','Utang Usaha','Kewajiban ke pemasok'],
            ['202','Utang Gaji','Gaji karyawan yang masih terutang'],
            ['203','Utang Bunga','Bunga pinjaman terutang'],
            ['204','Pendapatan Diterima Dimuka','Uang diterima sebelum penyerahan'],
            ['205','Utang Bank/Pinjaman Jangka Pendek','Pinjaman modal kerja'],
            ['206','PPN Keluaran','PPN atas penjualan (jika PKP)'],
            ['207','Utang Pajak Lain','PPh/PPH 21/23, dll.'],

            // 3xx E K U I T A S
            ['301','Modal Pemilik','Setoran pemilik'],
            ['302','Prive','Pengambilan oleh pemilik (- Ekuitas)'],
            ['303','Laba Ditahan','Akumulasi laba/rugi periode lalu'],

            // 4xx P E N D A P A T A N
            ['401','Penjualan','Penjualan baby oil'],
            ['402','Retur & Potongan Penjualan','Kontra pendapatan ()'],
            ['403','Diskon Penjualan','Kontra pendapatan ()'],
            ['404','Pendapatan Lain-lain','Bunga bank, dll.'],

            // 5xx H P P / B I A Y A   P O K O K
            ['501','Harga Pokok Penjualan','Biaya pokok barang terjual'],
            ['502','Biaya Angkut Pembelian (Freight-in)','Menambah nilai persediaan (periodik)'],
            ['503','Penyesuaian Persediaan','Selisih/opname'],

            // 6xx B E B A N   P E N J U A L A N  &  A D M I N
            ['601','Beban Gaji Karyawan Toko','Gaji kasir/pramuniaga'],
            ['602','Beban Iklan & Promosi','Iklan, diskon promosi'],
            ['603','Beban Kemasan & Label','Plastik, bubble wrap, stiker'],
            ['604','Beban Pengiriman (Freight-out)','Ongkir ke pelanggan'],
            ['605','Beban Listrik, Air & Internet','Utilitas toko'],
            ['606','Beban Sewa Toko','Sewa tempat'],
            ['607','Beban Penyusutan Peralatan','Penyusutan periodik peralatan'],
            ['608','Beban Penyusutan Kendaraan','Penyusutan kendaraan'],
            ['609','Beban Administrasi Bank','Biaya admin/merchant fee'],
            ['610','Beban Telepon & Komunikasi','Pulsa/WA Business'],

            // 7xx B E B A N   U M U M  &  L A I N
            ['701','Beban Perbaikan & Pemeliharaan','Servis etalase/kendaraan'],
            ['702','Beban Asuransi','Premi asuransi'],
            ['703','Beban Pajak','Pajak lain diakui sebagai beban'],
            ['704','Beban Rupa-rupa','Lain-lain kecil'],
            ['705','Beban Kerugian Piutang','Write-off piutang tak tertagih'],

            // 8xx P E N D A P A T A N  L A I N
            ['801','Pendapatan Bunga','Bunga rekening/ deposito'],

            // 9xx B E B A N  /  K E R U G I A N  L A I N
            ['901','Rugi Penjualan Aset','Selisih rugi jual aset tetap'],
        ];

        foreach ($coa as [$code,$name,$desc]) {
            Account::factory()->create([
                'name'        => $name,
                'description' => $desc,
                'status'      => true,
                'reff'        => $code,
                'user_id'     => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ]);
        }

        $this->call([
        AccountingSeeder::class,     
    ]);

    }
}

import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ProductOrder = () => {
    const { product, order } = usePage().props as any;

    // State untuk dropdown alamat
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');

    // Fetch provinces saat mount
    useEffect(() => {
        fetch('/provinces')
            .then((res) => res.json())
            .then((data) => setProvinces(data));
    }, []);

    // Fetch cities saat province berubah
    useEffect(() => {
        if (selectedProvince) {
            fetch(`/cities/${selectedProvince}`)
                .then((res) => res.json())
                .then((data) => setCities(data));
            setSelectedCity('');
            setDistricts([]);
            setSelectedDistrict('');
        }
    }, [selectedProvince]);

    // Fetch districts saat city berubah
    useEffect(() => {
        if (selectedCity) {
            fetch(`/districts/${selectedCity}`)
                .then((res) => res.json())
                .then((data) => setDistricts(data));
            setSelectedDistrict('');
        }
    }, [selectedCity]);

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <h1 className="mb-6 text-center text-2xl font-bold">Checkout</h1>

            {/* Ringkasan Produk */}
            <div className="mb-6 rounded-lg border bg-white p-4 shadow">
                <h2 className="mb-2 text-lg font-semibold">Ringkasan Produk</h2>
                <div className="flex items-center gap-4">
                    <img src={product?.image} alt={product?.name} className="h-20 w-20 rounded border object-cover" />
                    <div>
                        <div className="font-bold text-primary">{order?.name}</div>
                        <div className="text-sm text-gray-500">Varian: {order?.variant || '-'}</div>
                        <div className="text-sm text-gray-500">Jumlah: {order?.qty}</div>
                        <div className="text-sm text-gray-500">Harga Satuan: Rp {Number(order?.price).toLocaleString('id-ID')}</div>
                        <div className="mt-2 font-semibold text-green-700">Total: Rp {Number(order?.total).toLocaleString('id-ID')}</div>
                    </div>
                </div>
            </div>

            {/* Form Alamat Pengiriman */}
            <div className="mb-6 rounded-lg border bg-white p-4 shadow">
                <h2 className="mb-2 text-lg font-semibold">Address </h2>
                <form className="grid gap-4">
                    <input type="text" name="nama" placeholder="Nama Penerima" className="rounded border px-3 py-2" required />
                    <input type="text" name="alamat" placeholder="Alamat Lengkap" className="rounded border px-3 py-2" required />
                    <input type="text" name="telepon" placeholder="No. Telepon" className="rounded border px-3 py-2" required />

                    {/* Dropdown Provinsi */}
                    <select
                        name="province"
                        className="rounded border px-3 py-2"
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        required
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((prov: any) => (
                            <option key={prov.province_id || prov.id} value={prov.province_id || prov.id}>
                                {prov.province || prov.name}
                            </option>
                        ))}
                    </select>

                    {/* Dropdown Kota */}
                    <select
                        name="city"
                        className="rounded border px-3 py-2"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        required
                        disabled={!selectedProvince}
                    >
                        <option value="">Pilih Kota/Kabupaten</option>
                        {cities.map((city: any) => (
                            <option key={city.city_id || city.id} value={city.city_id || city.id}>
                                {city.city_name || city.name}
                            </option>
                        ))}
                    </select>

                    {/* Dropdown Kecamatan */}
                    <select
                        name="district"
                        className="rounded border px-3 py-2"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        required
                        disabled={!selectedCity}
                    >
                        <option value="">Pilih Kecamatan</option>
                        {districts.map((dist: any) => (
                            <option key={dist.district_id || dist.id} value={dist.district_id || dist.id}>
                                {dist.district_name || dist.name}
                            </option>
                        ))}
                    </select>
                </form>
            </div>

            {/* Metode Pembayaran */}
            <div className="mb-6 rounded-lg border bg-white p-4 shadow">
                <h2 className="mb-2 text-lg font-semibold">Metode Pembayaran</h2>
                <form className="grid gap-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="metode" value="transfer" defaultChecked />
                        <span>Transfer Bank</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="metode" value="ewallet" />
                        <span>E-Wallet</span>
                    </label>
                </form>
            </div>

            {/* Tombol Checkout */}
            <div className="flex justify-center">
                <button className="rounded-lg bg-primary px-6 py-2 font-semibold text-white shadow transition hover:bg-primary-foreground">
                    Bayar Sekarang
                </button>
            </div>
        </div>
    );
};

export default ProductOrder;

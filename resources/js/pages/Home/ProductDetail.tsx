import AppFooter from '@/components/app-footer';
import AppNavbar from '@/components/app-navbar';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

type VariantType = {
  id: number;
  variant: string;
  price: number;
  stock_qty: number;
};

type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  sub_image?: string | null;
  description: string | null;
  condition: string | null;
  category?: string | null;
  stock?: number;
  variants?: VariantType[];
};

const ProductDetail = () => {
  const { product: initialProduct } = usePage().props as { product?: ProductType };

  if (!initialProduct) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Produk tidak ditemukan.</p>
      </div>
    );
  }

  const [product] = useState(initialProduct);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'detail' | 'info'>('detail');

  // kumpulkan gambar utama + sub_image
  const images = useMemo(() => {
    const arr: string[] = [];
    if (product?.image) arr.push(product.image);
    if (product?.sub_image) arr.push(product.sub_image);
    return arr;
  }, [product]);

  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    } else {
      setMainImage(null);
    }
  }, [images]);

  // handle variant
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants || selectedVariantId == null) return null;
    return product.variants.find((v) => v.id === selectedVariantId) ?? null;
  }, [product, selectedVariantId]);

  // Harga yang ditampilkan
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : product.price ?? 0;

  // Stock yang ditampilkan
  const displayStock = selectedVariant?.stock_qty ?? product?.stock ?? 0;

  // Total harga = harga × qty
  const totalPrice = displayPrice * qty;

  // Handle beli
  const handleBuy = () => {
    if (displayStock <= 0) return;
    router.post(route('cart.add'), {
      product_id: product.id,
      variant_id: selectedVariantId,
      qty: qty,
    });
  };

  return (
    <div className="container mx-auto min-h-screen">
      <AppNavbar />

      <div className="p-8">
        {/* Back ke daftar produk */}
        <Link
          href={route('products')}
          className="mb-6 inline-flex items-center rounded-lg border px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-100"
          preserveScroll
        >
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left - Images */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative aspect-square w-72 md:w-[28rem] overflow-hidden rounded-xl border bg-white shadow">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`h-20 w-20 rounded-md border overflow-hidden transition ${
                      mainImage === img
                        ? 'border-green-600 ring-2 ring-green-400'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">{product?.name}</h1>

            {/* Price */}
            <div>
              <p className="text-2xl font-semibold text-green-600">
                Rp. {displayPrice.toLocaleString('id-ID')}
              </p>
              {qty > 1 && (
                <p className="text-sm text-gray-500">Total: Rp. {totalPrice.toLocaleString('id-ID')}</p>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b">
              <button
                onClick={() => setTab('detail')}
                className={`px-4 py-2 transition ${
                  tab === 'detail'
                    ? 'border-b-2 border-green-600 font-semibold text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Detail
              </button>
              <button
                onClick={() => setTab('info')}
                className={`px-4 py-2 transition ${
                  tab === 'info'
                    ? 'border-b-2 border-green-600 font-semibold text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Info Penting
              </button>
            </div>

            {tab === 'detail' && (
              <div className="text-gray-700 leading-relaxed">
                <p><span className="font-semibold">Kondisi:</span> {product.condition || 'Tidak diketahui'}</p>
                <p className="mt-2"><span className="font-semibold">Kategori:</span> {product.category || '-'}</p>
                <p className="mt-2 whitespace-pre-line">{product.description || 'Tidak ada deskripsi.'}</p>
              </div>
            )}

            {tab === 'info' && (
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-2">📦 Estimasi pengiriman 1-3 hari kerja.</p>
                <p className="mb-2">🔄 Barang dapat ditukar jika ada kerusakan (syarat & ketentuan berlaku).</p>
                <p className="mb-2">💳 Pembayaran aman via transfer bank & e-wallet.</p>
              </div>
            )}

            {/* Stock */}
            <div>
              <p className="text-sm text-gray-500">Stock tersedia:</p>
              <p className="font-medium">{displayStock}</p>
            </div>

            {/* Variants */}
            {product?.variants && product.variants.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Pilih Varian</h2>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = v.id === selectedVariantId;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        aria-pressed={active}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          active ? 'border-green-600 bg-green-600 text-white' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedVariantId(v.id)}
                      >
                        {v.variant}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Buy */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rounded-lg border px-3 py-1 text-lg hover:bg-gray-100"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="rounded-lg border px-3 py-1 text-lg hover:bg-gray-100"
              >
                +
              </button>
              <button
                onClick={handleBuy}
                disabled={qty < 1 || displayStock <= 0}
                className={`ml-4 rounded-lg px-6 py-2 font-semibold shadow transition ${
                  qty < 1 || displayStock <= 0
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {displayStock <= 0 ? 'Out of Stock' : 'Buy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default ProductDetail;

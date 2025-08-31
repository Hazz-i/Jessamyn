import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import EditProduct from './Edit';
import CreateProductVariant from './Variants/Create';
import EditProductVariant from './Variants/Edit';

export default function ProductDetails() {
  const { product: initialProduct } = usePage().props as any;

  // simpan product ke state biar bisa diupdate tanpa reload
  const [product, setProduct] = useState(initialProduct);

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = useMemo(
    () => [
      { title: 'Product', href: route('product.index') },
      {
        title: 'Product Details',
        href: product?.id ? route('product.show', product.id) : '/product-details',
      },
    ],
    [product],
  );

  // Kumpulkan gambar utama + sub gambar
  const images = useMemo(() => {
    const arr: string[] = [];
    if (product?.image) arr.push(product.image);
    if (product?.sub_image) arr.push(product.sub_image);
    return arr;
  }, [product]);

  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 0) setMainImage(images[0]);
  }, [images]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    } else {
      setSelectedVariantId(null);
    }
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants || selectedVariantId == null) return null;
    return product.variants.find((v: any) => v.id === selectedVariantId) ?? null;
  }, [product, selectedVariantId]);

  // handler update variant setelah edit
  const handleVariantUpdate = (updatedVariant: any) => {
    setProduct((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: any) =>
        v.id === updatedVariant.id ? updatedVariant : v
      ),
    }));
    setEditOpen(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Product Details" />

      <div className="mt-6 flex h-full flex-1 flex-col items-center rounded-xl p-4">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="flex flex-col items-center gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-72 md:w-[28rem] overflow-hidden rounded-xl border bg-white shadow">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Product"
                  className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`h-20 w-20 rounded-md border overflow-hidden transition ${
                      mainImage === img
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-start gap-6">
            {/* Title */}
            <span className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold md:text-4xl">
                {product?.name}
              </h1>
              <EditProduct product={product} />
            </span>

            {/* Description */}
            <div>
              <h2 className="mb-1 text-lg font-semibold">Description</h2>
              <p className="text-sm whitespace-pre-line text-foreground/90">
                {product?.description ?? 'No description.'}
              </p>
            </div>

            {/* Category */}
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">Category:</p>
              <p className="text-sm">{product?.category ?? '-'}</p>
            </div>

            {/* Stock */}
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">Stock:</p>
              <p className="text-sm">
                {selectedVariant?.stock_qty ?? product?.stock ?? 0}
              </p>
            </div>

            {/* Variants */}
            <div className="grid gap-2">
              <span className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Variants</h2>

                <div className="flex items-center gap-2">
                  <CreateProductVariant
                    product={product}
                    setOpen={setOpen}
                    open={open}
                  />

                  {product?.variants?.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="bx bx-edit cursor-pointer text-xl text-primary" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="min-w-[12rem] z-50"
                      >
                        {product.variants.map((v: any) => (
                          <DropdownMenuItem
                            key={v.id}
                            onClick={() => {
                              setSelectedVariantId(v.id);
                              setEditOpen(true);
                            }}
                          >
                            {v.variant}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </span>

              {/* Variant Buttons */}
              {product?.variants?.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {product.variants.map((v: any) => {
                    const active = v.id === selectedVariantId;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        aria-pressed={active}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setSelectedVariantId(v.id)}
                      >
                        {v.variant}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No variants.</p>
              )}

              {/* Edit Variant Modal */}
              {editOpen && selectedVariant && (
                <EditProductVariant
                  withTrigger={false}
                  open={editOpen}
                  setOpen={setEditOpen}
                  productId={product.id}
                  variant={selectedVariant}
                  onSuccess={handleVariantUpdate} // ⬅️ update state product langsung
                />
              )}
            </div>

            {/* Price */}
            <div>
              <h2 className="mb-1 text-lg font-semibold">Price</h2>
              {selectedVariant ? (
                <p className="text-xl font-medium text-primary">
                  Rp {Number(selectedVariant.price).toLocaleString('id-ID')}
                </p>
              ) : product?.price ? (
                <p className="text-xl font-medium text-primary">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Rp. 0</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

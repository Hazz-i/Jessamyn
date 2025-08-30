import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import EditProduct from './Edit';
import CreateProductVariant from './Variants/Create';
import EditProductVariant from './Variants/Edit';

export default function ProductDetails() {
    const { product } = usePage().props as any;
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: 'Product', href: route('product.index') },
            { title: 'Product Details', href: product?.id ? route('product.show', product.id) : '/product-details' },
        ],
        [product],
    );

    const images = useMemo(() => {
        const arr: string[] = [];
        if (product?.image) arr.push(product.image);
        if (product?.sub_image) arr.push(product.sub_image);
        return arr;
    }, [product]);

    const [slide, setSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (images.length <= 1 || isHovered) return;
        const id = setInterval(() => {
            setSlide((i) => (i + 1) % images.length);
        }, 4000);
        return () => clearInterval(id);
    }, [images.length, isHovered]);

    useEffect(() => {
        if (images.length > 0 && slide >= images.length) setSlide(0);
    }, [images.length, slide]);

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

    // Stock logic
    const stockValue =
        product?.category === 'Bundle'
            ? product?.stock ?? 0
            : selectedVariant?.stock_qty ?? product?.stock ?? 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Details" />
            <div className="flex min-h-screen items-center justify-center bg-[#f6f7f9]">
                <div className="flex flex-col md:flex-row gap-12 p-10 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
                    {/* Images Section */}
                    <div className="flex flex-col items-center w-full md:w-[400px]">
                        <div
                            className="relative h-72 w-72 md:h-96 md:w-96 overflow-hidden rounded-xl border bg-gray-100 flex items-center justify-center mb-4"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {images.length > 0 ? (
                                <img
                                    key={images[slide]}
                                    src={images[slide]}
                                    alt={`${product?.name} - ${slide + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
                            )}
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Previous image"
                                        className="absolute top-1/2 left-4 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white p-2 text-green-700 shadow"
                                        onClick={() => setSlide((i) => (i - 1 + images.length) % images.length)}
                                    >
                                        <i className="bx bx-chevron-left text-3xl"></i>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        className="absolute top-1/2 right-4 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white p-2 text-green-700 shadow"
                                        onClick={() => setSlide((i) => (i + 1) % images.length)}
                                    >
                                        <i className="bx bx-chevron-right text-3xl"></i>
                                    </button>
                                    <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                                        {images.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`h-2 w-2 rounded-full ${idx === slide ? 'bg-green-600' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-2 mt-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`h-16 w-16 rounded border ${slide === idx ? 'border-green-600' : ''}`}
                                    onClick={() => setSlide(idx)}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 flex flex-col gap-6 justify-center">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold">{product?.name}</h1>
                            <EditProduct
                                product={product}
                                trigger={
                                    <button
                                        className="flex items-center gap-2 px-5 py-2 bg-green-200 text-green-900 rounded-lg text-base font-semibold hover:bg-green-300 transition"
                                        type="button"
                                    >
                                        <i className="bx bx-edit text-xl"></i>
                                        Edit
                                    </button>
                                }
                            />
                        </div>
                        <div className="text-lg">
                            <p className="mb-1"><span className="font-semibold">Kategori:</span> {product?.category ?? '-'}</p>
                            <p className="mb-1"><span className="font-semibold">Stok:</span> {stockValue}</p>
                            <p className="mb-1"><span className="font-semibold">Deskripsi:</span></p>
                            <p className="whitespace-pre-line">{product?.description ?? 'Tidak ada deskripsi.'}</p>
                        </div>

                        {/* Variants */}
                        <div className="grid gap-2 mt-2">
                            <span className="flex gap-3 items-center">
                                <h2 className="text-lg font-semibold">Variants</h2>
                                <CreateProductVariant productId={product.id} setOpen={setOpen} open={open} />
                                {product?.variants && product.variants.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center text-green-700 bg-green-100 rounded px-2 py-1 hover:bg-green-200 transition">
                                                <i className="bx bx-edit text-lg"></i>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="min-w-[12rem]">
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
                            </span>
                            {product?.variants && product.variants.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {product.variants.map((v: any) => {
                                        const active = v.id === selectedVariantId;
                                        return (
                                            <button
                                                key={v.id}
                                                type="button"
                                                aria-pressed={active}
                                                className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                                                    active
                                                        ? 'bg-green-600 text-white border-green-600'
                                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-100'
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
                            {/* Edit Variant Dialog controlled from dropdown selection */}
                            {editOpen && selectedVariant && (
                                <EditProductVariant
                                    withTrigger={false}
                                    open={editOpen}
                                    setOpen={setEditOpen}
                                    productId={product.id}
                                    variant={selectedVariant}
                                    onSuccess={() => setEditOpen(false)} // Add this prop and call setEditOpen(false) in EditProductVariant on success
                                />
                            )}
                        </div>
                        {/* Price */}
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold">Price</h2>
                            <p className="text-xl text-green-700 font-bold">
                                Rp {Number(selectedVariant?.price ?? product?.price ?? 0).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

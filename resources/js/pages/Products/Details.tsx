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

    // console.log('Product details page product:', product);

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Product',
                href: route('product.index'),
            },
            {
                title: 'Product Details',
                href: product?.id ? route('product.show', product.id) : '/product-details',
            },
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

    // Auto-advance carousel when there are multiple images; pause on hover
    useEffect(() => {
        if (images.length <= 1 || isHovered) return;
        const id = setInterval(() => {
            setSlide((i) => (i + 1) % images.length);
        }, 4000);
        return () => clearInterval(id);
    }, [images.length, isHovered]);

    // Ensure slide index stays within bounds if images change
    useEffect(() => {
        if (images.length > 0 && slide >= images.length) {
            setSlide(0);
        }
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Details" />

            <div className="mt-10 flex h-full flex-1 flex-col items-center gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Images */}
                    <div className="mx-auto w-full max-w-[20rem]">
                        <div
                            className="relative h-72 w-72 overflow-hidden rounded-xl border md:h-[30rem] md:w-[30rem]"
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
                                        className="absolute top-1/2 left-2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white p-1 text-black"
                                        onClick={() => setSlide((i) => (i - 1 + images.length) % images.length)}
                                    >
                                        <i className="bx bx-chevron-left text-xl"></i>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        className="absolute top-1/2 right-2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white p-1 text-black"
                                        onClick={() => setSlide((i) => (i + 1) % images.length)}
                                    >
                                        <i className="bx bx-chevron-right text-xl"></i>
                                    </button>
                                    <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                aria-label={`Go to image ${idx + 1}`}
                                                onClick={() => setSlide(idx)}
                                                className={`h-2 w-2 rounded-full ${idx === slide ? 'bg-white' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-10 justify-between">
                        <span className="flex gap-2">
                            <h1 className="text-2xl md:text-5xl font-semibold">{product?.name}</h1>
                            <EditProduct product={product} />
                        </span>

                        <span className="grid gap-2">
                            <div>
                                <h2 className="mb-1 text-lg font-semibold">Description</h2>
                                <p className="text-sm whitespace-pre-line text-foreground/90">{product?.description ?? 'No description.'}</p>
                            </div>

                            <div className="flex gap-2">
                                <p className="text-sm text-muted-foreground">Category:</p>
                                <p className="text-center text-sm">{product?.category ?? '-'}</p>
                            </div>

                            <div className="flex gap-2">
                                <p className="text-sm text-muted-foreground">Stock:</p>
                                <p className="text-center text-sm">
                                    {selectedVariant?.stock_qty ? selectedVariant.stock_qty : product?.stock ? product.stock : 0}
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <span className="flex gap-3">
                                    <h2 className="text-lg font-semibold">Variants</h2>

                                    <div className="flex items-center gap-2">
                                        <CreateProductVariant productId={product.id} setOpen={setOpen} open={open} />

                                        {product?.variants && product.variants.length > 0 && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="bx bx-edit cursor-pointer text-xl text-primary" />
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
                                    </div>
                                </span>
                                {product?.variants && product.variants.length > 0 ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {product.variants.map((v: any) => {
                                            const active = v.id === selectedVariantId;
                                            return (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    aria-pressed={active}
                                                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                                                        active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
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
                                    />
                                )}
                            </div>

                            <div className="mt-4">
                                <h2 className="text-lg font-semibold">Price</h2>
                                {selectedVariant ? (
                                    <p className="text-xl text-primary-foreground">Rp {Number(selectedVariant.price).toLocaleString('id-ID')}</p>
                                ) : product?.price ? (
                                    <p className="text-xl text-primary-foreground">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Rp. 0;</p>
                                )}
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

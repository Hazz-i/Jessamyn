import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditProduct from '@/pages/Products/Edit';
import CreateProductVariant from '@/pages/Products/Variants/Create';
import EditProductVariant from '@/pages/Products/Variants/Edit';
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const ProductDetailsCard = ({ product, auth }: any) => {
    const [isAuth, setIsAuth] = useState(!!auth?.user);

    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

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

    // Price and stock
    const displayPrice = selectedVariant ? selectedVariant.price : (product.price ?? 0);
    const displayStock = selectedVariant?.stock_qty ?? product?.stock ?? 0;
    const [qty, setQty] = useState(1);

    return (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* Images */}
            <div className="flex flex-col items-center gap-4">
                {/* Main Image */}
                <div className="relative aspect-square w-72 overflow-hidden rounded-xl border bg-white shadow md:w-[28rem]">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt="Product"
                            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
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
                                className={`h-20 w-20 overflow-hidden rounded-md border transition ${
                                    mainImage === img ? 'border-primary ring-2 ring-primary/50' : 'border-gray-200 hover:border-primary/40'
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-contain" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-start gap-6">
                {/* Title */}
                <span className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold md:text-4xl">{product?.name}</h1>
                    {isAuth && <EditProduct product={product} />}
                </span>

                {/* Description */}
                <div>
                    <h2 className="mb-1 text-lg font-semibold">Description</h2>
                    <p className="text-sm whitespace-pre-line text-foreground/90">{product?.description ?? 'No description.'}</p>
                </div>

                {/* Category */}
                <div className="flex gap-2">
                    <p className="text-sm text-muted-foreground">Category:</p>
                    <p className="text-sm">{product?.category ?? '-'}</p>
                </div>

                {/* Stock */}
                <div className="flex gap-2">
                    <p className="text-sm text-muted-foreground">Stock:</p>
                    <p className="text-sm">{displayStock}</p>
                </div>

                {/* Variants */}
                <div className="grid gap-2">
                    <span className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Variants</h2>

                        {isAuth ? (
                            <div className="flex items-center gap-2">
                                <CreateProductVariant product={product} setOpen={setOpen} open={open} />
                                {product?.variants?.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="bx bx-edit cursor-pointer text-xl text-primary" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="z-50 min-w-[12rem]">
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
                        ) : null}
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
                                        className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${
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

                    {/* Edit Variant Modal */}
                    {isAuth && editOpen && selectedVariant && (
                        <EditProductVariant
                            withTrigger={false}
                            open={editOpen}
                            setOpen={setEditOpen}
                            productId={product.id}
                            variant={selectedVariant}
                        />
                    )}
                </div>

                {/* Price */}
                <div>
                    <h2 className="mb-1 text-lg font-semibold">Price</h2>
                    <p className="text-xl font-medium text-primary">Rp {Number(displayPrice).toLocaleString('id-ID')}</p>
                </div>

                {!isAuth && (
                    <div className="mt-6 flex items-center gap-3">
                        <button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="cursor-pointer rounded-lg border px-3 py-1 text-lg hover:bg-gray-100"
                            disabled={qty <= 1}
                        >
                            -
                        </button>
                        <span className="min-w-[2rem] text-center">{qty}</span>
                        <button
                            onClick={() => setQty((q) => Math.min(displayStock, q + 1))}
                            className="cursor-pointer rounded-lg border px-3 py-1 text-lg hover:bg-gray-100"
                            disabled={qty >= displayStock}
                        >
                            +
                        </button>
                        <button
                            disabled={qty < 1 || displayStock <= 0}
                            onClick={() => {
                                router.get(`/product-order/${product.id}`, {
                                    name: product.name,
                                    price: displayPrice,
                                    variant: selectedVariant?.variant ?? '',
                                    qty,
                                    total: displayPrice * qty,
                                });
                            }}
                            className={`ml-4 cursor-pointer rounded-lg px-6 py-2 font-semibold shadow transition ${
                                qty < 1 || displayStock <= 0
                                    ? 'cursor-not-allowed bg-gray-400 text-white'
                                    : 'bg-primary text-white hover:bg-primary-foreground'
                            }`}
                        >
                            {displayStock <= 0 ? 'Out of Stock' : 'Buy'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsCard;

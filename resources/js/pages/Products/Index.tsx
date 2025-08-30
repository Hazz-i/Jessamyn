import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CreateProduct from './Create';

import toast, { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/product',
    },
];

export default function Product() {
    const { products, openVariantModal, productForVariant } = usePage().props as any;

    // Normalize products to a simple array for rendering (handles paginator objects)
    const productArray: any[] = Array.isArray(products) ? products : ((products as any)?.data ?? []);
    const totalProducts: number = Array.isArray(products) ? products.length : Number((products as any)?.total ?? 0);
    const totalBundles: number = productArray.filter((p) => p.category === 'bundle').length;
    const totalStocks: number = productArray.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);

    const currentPage: number = Number((products as any)?.current_page ?? 1);
    const lastPage: number = Number((products as any)?.last_page ?? 1);
    const basePath: string = (products as any)?.path ?? '';
    const prevUrl: string | null = (products as any)?.prev_page_url ?? null;
    const nextUrl: string | null = (products as any)?.next_page_url ?? null;

    const [open, setOpen] = useState(false);
    const [variantOpen, setVariantOpen] = useState(false);
    const [variantProduct, setVariantProduct] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        if (openVariantModal && productForVariant) {
            setVariantProduct(productForVariant);
            setVariantOpen(true);
        }
    }, [openVariantModal, productForVariant]);

    // component-level toasts handle errors; no global pageErrors toast to avoid duplicates

    const getPageItems = (current: number, last: number): Array<number | '...'> => {
        const items: Array<number | '...'> = [];
        if (last <= 7) {
            for (let i = 1; i <= last; i++) items.push(i);
            return items;
        }
        items.push(1);
        if (current > 3) {
            items.push(2);
            if (current > 4) items.push('...');
        }
        const start = Math.max(3, current - 1);
        const end = Math.min(last - 2, current + 1);
        for (let i = start; i <= end; i++) items.push(i);
        if (current < last - 2) {
            if (current < last - 3) items.push('...');
            items.push(last - 1);
        }
        items.push(last);
        return items;
    };

    const truncate = (str: string, max = 120) => {
        if (typeof str !== 'string') return '';
        const s = str.trim();
        return s.length > max ? s.slice(0, max) + '…' : s;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Toaster position="top-right" reverseOrder={false} />
                {/* Product Summary */}
                <span className="grid gap-2">
                    <div className="grid gap-1">
                        <h1 className="text-xl font-medium">Product Summary</h1>
                        <p className="text-sm text-[#B5B5B5]">Summary of product</p>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col items-start gap-5 py-10 md:flex-row md:items-center md:justify-center md:gap-[10rem]">
                        <span className="flex gap-2">
                            <div className="flex items-center justify-center rounded-lg border px-4">
                                <i className="bx bx-user text-lg" />
                            </div>

                            <div className="grid">
                                <p className="text-sm font-bold text-[#B5B5B5]">Total Products</p>
                                {totalProducts > 0 ? (
                                    <span className="flex items-end gap-1">
                                        <span className="text-lg font-medium">{totalProducts}</span>
                                        <p className="mb-1 text-sm font-semibold">Products</p>
                                    </span>
                                ) : (
                                    <span className="text-gray-400">No products</span>
                                )}
                            </div>
                        </span>

                        <span className="flex gap-2">
                            <div className="flex items-center justify-center rounded-lg border px-4">
                                <i className="bx bx-package text-lg" />
                            </div>

                            <div className="grid">
                                <p className="text-sm font-bold text-[#B5B5B5]">Total Bundles</p>
                                {totalBundles > 0 ? (
                                    <span className="flex items-end gap-1">
                                        <span className="text-lg font-medium">{totalBundles}</span>
                                        <p className="mb-1 text-sm font-semibold">Bundles</p>
                                    </span>
                                ) : (
                                    <span className="text-gray-400">No bundles</span>
                                )}
                            </div>
                        </span>

                        <span className="flex gap-2">
                            <div className="flex items-center justify-center rounded-lg border px-4">
                                <i className="bx bx-user text-lg text-primary-foreground" />
                            </div>

                            <div className="grid">
                                <p className="text-sm font-bold text-[#B5B5B5]">Total Stocks</p>
                                {totalStocks > 0 ? (
                                    <span className="flex items-end gap-1">
                                        <span className="text-lg font-medium">{totalStocks}</span>
                                        <p className="mb-1 text-sm font-semibold text-primary-foreground">Stocks</p>
                                    </span>
                                ) : (
                                    <span className="text-gray-400">No stocks</span>
                                )}
                            </div>
                        </span>
                    </div>
                </span>

                {/* Product List */}
                <span className="grid gap-2">
                    <span className="flex items-center justify-between">
                        <div className="grid gap-1">
                            <h1 className="text-xl font-medium">Product List</h1>
                            <p className="text-sm text-[#B5B5B5]">List of product</p>
                        </div>

                        <div className="me-1 flex items-center justify-center gap-2">
                            <p className="text-sm font-semibold text-primary">Add Product</p>
                            <CreateProduct open={open} setOpen={setOpen} onSuccess={(msg) => toast.success(msg ?? 'New Product Created')} />
                        </div>
                    </span>

                    {/* Table */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox />
                                    </TableHead>
                                    <TableHead className="w-[150px] text-center">Product Name</TableHead>
                                    <TableHead className="text-center">Description</TableHead>
                                    <TableHead className="text-center">Category</TableHead>
                                    <TableHead className="text-center">Stock</TableHead>
                                    <TableHead className="text-center">Price</TableHead>
                                    <TableHead className="w-[100px] text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productArray.length > 0 ? (
                                    productArray.map((product: any) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className="flex items-center gap-5 text-center font-medium">
                                                <span className="h-10 w-10 overflow-hidden rounded-sm">
                                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                </span>
                                                <p className="text-primary">{product.name}</p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.description ? (
                                                    <span
                                                        className="inline-block max-w-[40ch] overflow-hidden align-middle text-ellipsis whitespace-nowrap"
                                                        title={product.description}
                                                    >
                                                        {truncate(String(product.description), 120)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">No description</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.category ? (
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        <span className="text-muted-foreground">{product.category}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Category Not Found</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.stock != null ? (
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        <span className="rounded bg-accent px-2 py-1 text-xs">{`${product.stock} Available`}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Stock Not Found</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.price != null ? (
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        <span className="rounded bg-accent px-2 py-1 text-xs">
                                                            {`Rp ${Number(product.price).toLocaleString('id-ID')}`}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Rp. 0;</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link href={route('product.show', product.id)} className="text-lg text-primary">
                                                    <i className="bx bx-file"></i>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400">
                                            No products available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <nav className="mt-3 flex items-center justify-center gap-2" aria-label="Pagination">
                            {/* Prev */}
                            {prevUrl ? (
                                <Link
                                    href={prevUrl}
                                    preserveScroll
                                    preserveState
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-accent"
                                    aria-label="Previous page"
                                >
                                    <i className="bx bx-chevron-left text-lg" />
                                </Link>
                            ) : (
                                <span className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md border text-sm text-muted-foreground/50">
                                    <i className="bx bx-chevron-left text-lg" />
                                </span>
                            )}

                            {getPageItems(currentPage, lastPage).map((item, idx) =>
                                item === '...' ? (
                                    <span
                                        key={`ellipsis-${idx}`}
                                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm text-muted-foreground"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <Link
                                        key={item}
                                        href={`${basePath}?page=${item}`}
                                        preserveScroll
                                        preserveState
                                        className={
                                            `inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-3 text-sm ` +
                                            (item === currentPage ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent')
                                        }
                                        aria-current={item === currentPage ? 'page' : undefined}
                                    >
                                        {item}
                                    </Link>
                                ),
                            )}

                            {/* Next */}
                            {nextUrl ? (
                                <Link
                                    href={nextUrl}
                                    preserveScroll
                                    preserveState
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-accent"
                                    aria-label="Next page"
                                >
                                    <i className="bx bx-chevron-right text-lg" />
                                </Link>
                            ) : (
                                <span className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md border text-sm text-muted-foreground/50">
                                    <i className="bx bx-chevron-right text-lg" />
                                </span>
                            )}
                        </nav>
                    )}
                </span>
            </div>
        </AppLayout>
    );
}

import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/product',
    },
];

export default function Product() {
    const { products } = usePage().props;

    // Normalize products to a simple array for rendering (handles paginator objects)
    const productArray: any[] = Array.isArray(products) ? products : ((products as any)?.data ?? []);
    const totalProducts: number = Array.isArray(products) ? products.length : Number((products as any)?.total ?? 0);
    const currentPage: number = Number((products as any)?.current_page ?? 1);
    const lastPage: number = Number((products as any)?.last_page ?? 1);
    const basePath: string = (products as any)?.path ?? '';
    const prevUrl: string | null = (products as any)?.prev_page_url ?? null;
    const nextUrl: string | null = (products as any)?.next_page_url ?? null;

    // Build compact page list like: 1 2 ... (curr-1) curr (curr+1) ... (last-1) last
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

    // Modal state
    const [showModal, setShowModal] = useState(false);

    // Form state
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        status: true,
        image: null, // Add image field
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('image', e.target.files?.[0] ?? null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('status', data.status ? '1' : '0');
        if (data.image) {
            formData.append('image', data.image);
        }

        post(route('product.store'), {
            data: formData,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />

            {/* Add Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-bold">Add Product</h2>
                        <form onSubmit={handleSubmit} className="grid gap-3">
                            <input
                                type="text"
                                placeholder="Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="rounded border px-3 py-2"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}

                            <textarea
                                placeholder="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="rounded border px-3 py-2"
                            />
                            {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}

                            <input
                                type="number"
                                placeholder="Price"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="rounded border px-3 py-2"
                            />
                            {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}

                            <input
                                type="number"
                                placeholder="Stock"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                className="rounded border px-3 py-2"
                            />
                            {errors.stock && <span className="text-xs text-red-500">{errors.stock}</span>}

                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.status} onChange={(e) => setData('status', e.target.checked)} />
                                Active
                            </label>

                            {/* Image upload field with button and file name display */}
                            <div>
                                <label
                                    htmlFor="image-upload"
                                    className="inline-flex cursor-pointer items-center rounded bg-primary px-4 py-2 text-white"
                                >
                                    <i className="bx bx-upload mr-2"></i>
                                    {data.image ? 'Change Image' : 'Upload Image'}
                                </label>
                                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                {data.image && (
                                    <span className="mt-2 block text-sm text-gray-700">
                                        Selected file: {typeof data.image === 'string' ? data.image : data.image.name}
                                    </span>
                                )}
                                {errors.image && <span className="text-xs text-red-500">{errors.image}</span>}
                            </div>

                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded bg-gray-200 px-4 py-2"
                                    onClick={() => setShowModal(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="rounded bg-primary px-4 py-2 text-white" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Product Summary */}
                <span className="grid gap-2">
                    <div className="grid gap-1">
                        <h1 className="text-xl font-medium">Product Summary</h1>
                        <p className="text-sm text-[#B5B5B5]">Summary of product</p>
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-center gap-[10rem] py-10">
                        <span className="flex gap-2">
                            <div className="flex items-center justify-center rounded-lg border px-4">
                                <i className="bx bx-user text-lg" />
                            </div>

                            <div className="grid">
                                <p className="text-sm font-bold text-[#B5B5B5]">Total Products</p>
                                <span className="flex items-end gap-1">
                                    <span className="text-lg font-medium">{totalProducts}</span>
                                    <p className="mb-1 text-sm font-semibold">Products</p>
                                </span>
                            </div>
                        </span>

                        <span className="flex gap-2">
                            <div className="flex items-center justify-center rounded-lg border px-4">
                                <i className="bx bx-package text-lg" />
                            </div>

                            <div className="grid">
                                <p className="text-sm font-bold text-[#B5B5B5]">Total Bundles</p>
                                <span className="flex items-end gap-1">
                                    <span className="text-lg font-medium">100</span>
                                    <p className="mb-1 text-sm font-semibold">Products</p>
                                </span>
                            </div>
                        </span>

                        <span className="flex gap-2">
                            <div className="flex items-center justify-center rounded-lg bg-primary px-4">
                                <i className="bx bx-user text-lg text-primary-foreground" />
                            </div>

                            <div className="grid">
                                <p className="text-sm font-bold text-[#B5B5B5]">Total Stocks</p>
                                <span className="flex items-end gap-1">
                                    <span className="text-lg font-medium">100</span>
                                    <p className="mb-1 text-sm font-semibold text-primary-foreground">Stocks</p>
                                </span>
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
                            <button
                                className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-2"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bx bx-plus text-xl text-white" />
                            </button>
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
                                    <TableHead className="w-[100px] text-center">Product Name</TableHead>
                                    <TableHead className="text-center">Description</TableHead>
                                    <TableHead className="text-center">Price</TableHead>
                                    <TableHead className="text-center">Stock</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="w-[100px] text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productArray.length > 0 ? (
                                    productArray.map((p: any) => (
                                        <TableRow key={p.id}>
                                            <TableCell>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className="flex items-center gap-2 text-center font-medium">
                                                <span className="h-10 w-10 overflow-hidden rounded-sm">
                                                    <img
                                                        src={p.image ? `/storage/${p.image.replace(/^public\//, '')}` : '/default-image.png'}
                                                        alt={p.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </span>
                                                {p.name}
                                            </TableCell>
                                            <TableCell className="text-center">{p.description}</TableCell>
                                            <TableCell className="text-center">Rp. {Number(p.price).toLocaleString('id-ID')}</TableCell>
                                            <TableCell className="text-center">{p.stock} Available</TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={`rounded-sm px-3 py-2 font-medium ${p.status ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'}`}
                                                >
                                                    {p.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="items-center space-x-5">
                                                <button className="cursor-pointer text-sm text-primary">
                                                    <i className="bx bx-edit text-xl"></i>
                                                </button>
                                                <button className="cursor-pointer text-sm text-destructive">
                                                    <i className="bx bx-trash text-xl"></i>
                                                </button>
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

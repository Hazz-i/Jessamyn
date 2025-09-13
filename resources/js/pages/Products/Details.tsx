import ProductDetailsCard from '@/components/product-details';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export default function ProductDetails() {
    const { product, auth } = usePage().props as any;

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Details" />

            <div className="mt-6 flex h-full flex-1 flex-col items-center rounded-xl p-4">
                <ProductDetailsCard product={product} auth={auth} />
            </div>
        </AppLayout>
    );
}

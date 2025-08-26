import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Buku Besar',
        href: '/buku-besar',
    },
];

export default function BukuBesar() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buku Besar " />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Product Summary */}
                <span className="grid gap-1">
                    <h1 className="text-xl font-medium">Buku Besar</h1>
                    <p className="text-sm text-[#B5B5B5]">
                        Buku besar adalah kumpulan akun yang digunakan untuk mengklasifikasikan dan merangkum transaksi yang telah dicatat dalam
                        jurnal umum. Dari buku besar inilah nantinya disusun laporan keuangan.
                    </p>
                </span>

                {/* Product List */}
                <span className="grid gap-2">
                    <h1 className="text-xl font-medium">Buku Besar Details</h1>

                    {/* Table */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </span>
            </div>
        </AppLayout>
    );
}

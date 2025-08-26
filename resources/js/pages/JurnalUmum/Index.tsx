import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jurnal Umum',
        href: '/jurnal-umum',
    },
];

export default function JurnalUmum() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jurnal Umum" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Product Summary */}
                <span className="grid gap-1">
                    <h1 className="text-xl font-medium">Jurnal Umum</h1>
                    <p className="text-sm text-[#B5B5B5]">
                        Jurnal umum adalah catatan kronologis pertama dari setiap transaksi keuangan perusahaan. Semua transaksi dicatat secara
                        berurutan berdasarkan tanggal kejadian, lengkap dengan akun yang didebit dan dikredit.
                    </p>
                </span>

                {/* Product List */}
                <span className="grid gap-2">
                    <h1 className="text-xl font-medium">Jurnal Umum Details</h1>

                    {/* Table */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </span>
            </div>
        </AppLayout>
    );
}

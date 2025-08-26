import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaction',
        href: '/transaction',
    },
];

export default function Transaction() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Transaction Report */}
                <span className="grid gap-2">
                    <div className="grid gap-1">
                        <h1 className="text-xl font-medium">Transaction Report</h1>
                        <p className="text-sm text-[#B5B5B5]">Reporting transaction details</p>
                    </div>

                    {/* Report */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </span>

                {/* Transaction List */}
                <span className="grid gap-2">
                    <div className="grid gap-1">
                        <h1 className="text-xl font-medium">Transaction List</h1>
                        <p className="text-sm text-[#B5B5B5]">List of transaction</p>
                    </div>

                    {/* Table */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </span>
            </div>
        </AppLayout>
    );
}

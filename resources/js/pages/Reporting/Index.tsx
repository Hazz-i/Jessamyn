import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Buku Besar',
        href: '/buku-besar',
    },
];

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const account = ['Utang Usaha', 'Piutang Usaha', 'Modal', 'Pendapatan', 'Beban'];

export default function BukuBesar() {
    const [isMonth, setIsMonth] = useState<string>(month[new Date().getMonth()]);
    const [isAccount, setIsAccount] = useState<string>(account[0]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buku Besar " />

            <div className="flex h-full flex-1 flex-col gap-10 overflow-x-auto rounded-xl p-4">
                {/* Product Summary */}
                <span className="grid gap-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-xl font-medium sm:text-2xl">Reporting</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    {isMonth}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {month.map((m) => (
                                    <DropdownMenuItem key={m}>
                                        <button type="button" onClick={() => setIsMonth(m)}>
                                            {m}
                                        </button>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="text-sm text-[#B5B5B5]">
                        Buku besar adalah kumpulan akun yang digunakan untuk mengklasifikasikan dan merangkum transaksi yang telah dicatat dalam
                        jurnal umum. Dari buku besar inilah nantinya disusun laporan keuangan.
                    </p>
                </span>

                {/* Product List */}
                <span className="grid gap-5">
                    {/* Content */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {/* Buku Besar */}
                        <span className="grid gap-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Buku Besar</h2>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full py-1 sm:w-auto">
                                            {isAccount}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {account.map((a) => (
                                            <DropdownMenuItem key={a}>
                                                <button type="button" onClick={() => setIsAccount(a)}>
                                                    {a}
                                                </button>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"></div>
                        </span>

                        {/* Neraca */}
                        <span className="grid gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Neraca {isMonth}</h2>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </span>

                        {/* Laba/Rugi */}
                        <span className="grid gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Laba/Rugi {isMonth}</h2>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </span>
                    </div>

                    {/* Kertas Kerja */}
                    <div className="grid gap-5">
                        <h2 className="text-lg font-medium sm:text-xl">{isMonth} Reporting Details</h2>
                        <div className="relative aspect-video flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </span>
            </div>
        </AppLayout>
    );
}

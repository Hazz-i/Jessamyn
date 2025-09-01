import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CreateAccount from './Create';
import DeleteAccount from './Delete';
import EditAccount from './Edit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Account',
        href: '/account',
    },
];

type AccountType = {
    id: number;
    name: string;
    description: string | null;
    status: boolean;
    reff: string;
};

type PageProps = {
    accounts: AccountType[] | { data: AccountType[] };
    flash?: { success?: string; error?: string };
};

export default function Account() {
    const { accounts, flash } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const paginator: any = accounts as any;
    const accountArray: AccountType[] = Array.isArray(accounts) ? (accounts as AccountType[]) : (paginator?.data ?? []);
    const currentPage: number = Array.isArray(accounts) ? 1 : Number(paginator?.current_page ?? 1);
    const lastPage: number = Array.isArray(accounts) ? 1 : Number(paginator?.last_page ?? 1);
    const basePath: string = Array.isArray(accounts) ? '/account' : (paginator?.path ?? '/account');
    const prevUrl: string | null = Array.isArray(accounts) ? null : (paginator?.prev_page_url ?? null);
    const nextUrl: string | null = Array.isArray(accounts) ? null : (paginator?.next_page_url ?? null);
    const totalAccounts: number = Array.isArray(accounts) ? accountArray.length : Number(paginator?.total ?? accountArray.length);

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

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Toaster position="top-right" reverseOrder={false} />
                {/* Product Summary */}
                <span className="grid gap-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-medium">Account</h1>

                        <a
                            href="http://jurnal.id/id/blog/mempelajari-klasifikasi-sistem-kode-akuntansi-chart-of-account/"
                            className="text-xl text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bx bx-help-circle"></i>
                        </a>
                    </div>
                    <p className="text-sm text-[#B5B5B5]">
                        Akun adalah catatan sistematis yang digunakan untuk menggolongkan dan mencatat perubahan (mutasi) pada setiap jenis aset,
                        kewajiban, modal, pendapatan, maupun beban dalam suatu periode tertentu. Setiap akun menunjukkan saldo dan perubahan yang
                        terjadi akibat transaksi keuangan, misalnya: kas, piutang usaha, persediaan, utang dagang, modal, penjualan, dan beban gaji.
                    </p>
                </span>

                {/* Product List */}
                <span className="grid gap-2">
                    <span className="flex items-center justify-between">
                        <div className="grid gap-1">
                            <span className="flex items-center gap-2">
                                <h1 className="text-xl font-medium">Account List</h1>
                                <small className="text-foreground">({totalAccounts} accounts)</small>
                            </span>
                            <p className="text-sm text-[#B5B5B5]">Daftar Akun</p>
                        </div>

                        <div className="me-1 flex items-center justify-center gap-2">
                            <p className="text-sm font-semibold text-primary">Add Account</p>
                            <CreateAccount open={open} setOpen={setOpen} />
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
                                    <TableHead className="w-[100px] text-center">Account Name</TableHead>
                                    <TableHead className="text-center">Description</TableHead>
                                    <TableHead className="text-center">Reff</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="w-[100px] text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accountArray.length > 0 ? (
                                    accountArray.map((account: AccountType) => (
                                        <TableRow key={account.id}>
                                            <TableCell className="py-4">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{account.name}</TableCell>
                                            <TableCell className="text-center">
                                                {account.description ? (
                                                    <span>{account.description}</span>
                                                ) : (
                                                    <span className="text-gray-400">No description</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{account.reff}</TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={`rounded-sm px-3 py-2 font-medium ${account.status ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'}`}
                                                >
                                                    {account.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex w-[5rem] items-center justify-center">
                                                <EditAccount account={account} setOpen={setIsUpdate} open={isUpdate} />
                                                <DeleteAccount account={account} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400">
                                            No Account Available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </span>
            </div>
            {/* Pagination */}
            {lastPage > 1 && (
                <nav className="mb-3 flex items-center justify-center gap-2" aria-label="Pagination">
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
        </AppLayout>
    );
}

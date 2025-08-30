import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CreateAccount from './Create';

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
};

export default function Account() {
    const { accounts } = usePage<AccountType>().props;
    const [open, setOpen] = useState(false);

    const accountArray: AccountType[] = Array.isArray(accounts) ? accounts : ((accounts as any)?.data ?? []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Product Summary */}
                <span className="grid gap-1">
                    <h1 className="text-xl font-medium">Account</h1>
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
                            <h1 className="text-xl font-medium">Account List</h1>
                            <p className="text-sm text-[#B5B5B5]">List of account</p>
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
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="w-[100px] text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accountArray.length > 0 ? (
                                    accountArray.map((p: AccountType) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="py-4">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{p.name}</TableCell>
                                            <TableCell className="text-center">
                                                {p.description ? <span>{p.description}</span> : <span className="text-gray-400">No description</span>}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={`rounded-sm px-3 py-2 font-medium ${p.status ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'}`}
                                                >
                                                    {p.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="items-center space-x-5">
                                                {/* <EditProduct product={p} /> */}
                                                {/* <DeleteProduct id={p.id} name={p.name} /> */}
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
        </AppLayout>
    );
}

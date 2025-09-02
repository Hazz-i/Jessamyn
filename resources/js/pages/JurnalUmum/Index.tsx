import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CreateJurnalUmum from './Create';
import DeleteRecord from './Delete';
import EditRecord from './Edit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jurnal Umum',
        href: '/jurnal-umum',
    },
];

type JurnalUmumProps = {
    accountings: any;
    accounts: any;
    flash?: { success?: string; error?: string };
};

export default function JurnalUmum({ accountings, accounts, flash }: JurnalUmumProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const totalRecords = accountings.length;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jurnal Umum" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Toaster position="top-right" reverseOrder={false} />
                {/* Jurnal Umum Head */}
                <span className="grid gap-1">
                    <h1 className="text-xl font-medium">Jurnal Umum</h1>
                    <p className="text-sm text-[#B5B5B5]">
                        Jurnal umum adalah catatan kronologis pertama dari setiap transaksi keuangan perusahaan. Semua transaksi dicatat secara
                        berurutan berdasarkan tanggal kejadian, lengkap dengan akun yang didebit dan dikredit.
                    </p>
                </span>
                {/* Product List */}
                <span className="grid gap-2">
                    <span className="flex items-center justify-between">
                        <div className="grid gap-1">
                            <span className="flex items-center gap-2">
                                <h1 className="text-xl font-medium">Jurnal Umum Details</h1>
                                <small className="text-xs text-foreground">({totalRecords} records)</small>
                            </span>
                            <p className="text-sm text-[#B5B5B5]">Daftar Jurnal Umum</p>
                        </div>

                        <div className="me-1 flex items-center justify-center gap-2">
                            <p className="text-sm font-semibold text-primary">Add Record</p>
                            <CreateJurnalUmum open={open} setOpen={setOpen} accounts={accounts} />
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
                                    <TableHead className="w-[100px] text-center">Description</TableHead>
                                    <TableHead className="text-center">Account</TableHead>
                                    <TableHead className="text-center">Debits</TableHead>
                                    <TableHead className="text-center">Credits</TableHead>
                                    <TableHead className="text-center">Proof</TableHead>
                                    <TableHead className="w-[100px] text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accountings.length > 0 ? (
                                    accountings.map((record: any) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="py-4">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{record.description}</TableCell>
                                            <TableCell className="text-center">
                                                {record.account?.name ? (
                                                    <span>{record.account.name}</span>
                                                ) : record.account_id ? (
                                                    <span className="text-gray-400">#{record.account_id}</span>
                                                ) : (
                                                    <span className="text-gray-400">No account</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {record.debit ? (
                                                    <span>Rp {Number(record.debit).toLocaleString('id-ID')}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {record.credit ? (
                                                    <span>Rp {Number(record.credit).toLocaleString('id-ID')}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {record.image ? <span>{record.image}</span> : <span>{record.note}</span>}
                                            </TableCell>
                                            <TableCell className="flex items-center justify-center gap-2">
                                                <EditRecord record={record} accounts={accounts} />
                                                <DeleteRecord record={record} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400">
                                            No Record Available.
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

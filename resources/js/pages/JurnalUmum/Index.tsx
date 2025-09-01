import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CreateJurnalUmum from './Create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jurnal Umum',
        href: '/jurnal-umum',
    },
];

export default function JurnalUmum() {
    const { data } = usePage<any>().props;
    const [open, setOpen] = useState(false);

    const dataArray = data || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jurnal Umum" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                            <h1 className="text-xl font-medium">Jurnal Umum Detail</h1>
                            <p className="text-sm text-[#B5B5B5]">Daftar Jurnal Umum</p>
                        </div>

                        <div className="me-1 flex items-center justify-center gap-2">
                            <p className="text-sm font-semibold text-primary">Add Record</p>
                            <CreateJurnalUmum open={open} setOpen={setOpen} />
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
                                    <TableHead className="text-center">Date</TableHead>
                                    <TableHead className="w-[100px] text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataArray.length > 0 ? (
                                    dataArray.map((p: any) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="py-4">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{p.description}</TableCell>
                                            <TableCell className="text-center">
                                                {p.account ? <span>{p.account}</span> : <span className="text-gray-400">No account</span>}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {p.debits ? <span>{p.debits}</span> : <span className="text-gray-400">-</span>}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {p.credits ? <span>{p.credits}</span> : <span className="text-gray-400">-</span>}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {p.date ? <span>{p.date}</span> : <span className="text-gray-400">No date</span>}
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

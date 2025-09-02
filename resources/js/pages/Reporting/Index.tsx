import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reporting',
        href: '/reporting',
    },
];

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Reporting({ records, accounts }: any) {
    const [isMonth, setIsMonth] = useState<string>(month[new Date().getMonth()]);

    // Compute records for the selected month only
    const monthIndex = useMemo(() => month.indexOf(isMonth), [isMonth]);
    const monthRecords = useMemo(() => {
        const recs = Array.isArray(records) ? records : [];
        if (monthIndex < 0) return recs;
        return recs.filter((r: any) => {
            const created = r?.created_at ? new Date(r.created_at) : null;
            return created instanceof Date && !isNaN(created as any) && created.getMonth() === monthIndex;
        });
    }, [records, monthIndex]);

    // Derive accounts that actually have data (in the selected month)
    const accountsWithData = useMemo(() => {
        const idsWithData = new Set(
            monthRecords
                .map((r: any) => r?.account_id ?? r?.account?.id)
                .filter((id: any) => id !== null && id !== undefined)
                .map((id: any) => String(id)),
        );
        const list = Array.isArray(accounts) ? accounts : [];
        return list.filter((a: any) => idsWithData.has(String(a.id)));
    }, [accounts, monthRecords]);

    // Keep the full selected account object to filter records reliably
    const [selectedAccount, setSelectedAccount] = useState<any>(null);

    // Ensure a valid default is selected when data changes
    useEffect(() => {
        if (!accountsWithData?.length) {
            setSelectedAccount(null);
            return;
        }
        if (!selectedAccount || !accountsWithData.find((a: any) => String(a.id) === String(selectedAccount.id))) {
            setSelectedAccount(accountsWithData[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountsWithData]);

    // Filter records to match the selected account
    const filteredRecords = (monthRecords ?? []).filter((record: any) => {
        if (!selectedAccount) return true;
        const recAccountId = record?.account_id ?? record?.account?.id;
        return String(recAccountId) === String(selectedAccount.id);
    });

    // Neraca: filter by account.reff code starting with 1, 2, 3
    const neracaRecords = useMemo(() => {
        return monthRecords.filter((r: any) => {
            const code: string | undefined = r?.account?.reff ?? accounts?.find?.((a: any) => String(a.id) === String(r.account_id))?.reff;
            if (!code) return false;
            return code.startsWith('1') || code.startsWith('2') || code.startsWith('3');
        });
    }, [monthRecords, accounts]);

    // Laba/Rugi: accounts with reff starting 4, 5, 6, or 7
    const labaRugiRecords = useMemo(() => {
        return monthRecords.filter((r: any) => {
            const code: string | undefined = r?.account?.reff ?? accounts?.find?.((a: any) => String(a.id) === String(r.account_id))?.reff;
            if (!code) return false;
            return code.startsWith('4') || code.startsWith('5') || code.startsWith('6') || code.startsWith('7');
        });
    }, [monthRecords, accounts]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reporting" />

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
                                    <DropdownMenuItem key={m} onClick={() => setIsMonth(m)}>
                                        {m}
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
                        <span className="grid gap-2">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Buku Besar</h2>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full py-1 sm:w-auto">
                                            {selectedAccount?.name ?? 'Select account'}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {accountsWithData?.length ? (
                                            accountsWithData.map((account: any) => (
                                                <DropdownMenuItem key={account.id} onClick={() => setSelectedAccount(account)}>
                                                    {account.name}
                                                </DropdownMenuItem>
                                            ))
                                        ) : (
                                            <DropdownMenuItem disabled>No accounts</DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px] text-center">Account</TableHead>
                                            <TableHead className="text-center">Debits</TableHead>
                                            <TableHead className="text-center">Credits</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRecords.length > 0 ? (
                                            filteredRecords.map((record: any) => (
                                                <TableRow key={record.id}>
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

                        {/* Neraca */}
                        <span className="grid gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Neraca {isMonth}</h2>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px] text-center">Account</TableHead>
                                            <TableHead className="text-center">Debits</TableHead>
                                            <TableHead className="text-center">Credits</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {neracaRecords.length > 0 ? (
                                            neracaRecords.map((record: any) => (
                                                <TableRow key={record.id}>
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

                        {/* Laba/Rugi */}
                        <span className="grid gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Laba/Rugi {isMonth}</h2>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px] text-center">Account</TableHead>
                                            <TableHead className="text-center">Debits</TableHead>
                                            <TableHead className="text-center">Credits</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {labaRugiRecords.length > 0 ? (
                                            labaRugiRecords.map((record: any) => (
                                                <TableRow key={record.id}>
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

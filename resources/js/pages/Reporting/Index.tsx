import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Label for headings
    const monthLabel = useMemo(() => {
        const d = new Date(selectedDate);
        if (!(d instanceof Date) || isNaN(d as any)) return '';
        return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }, [selectedDate]);

    // Compute records for the selected year & month only
    const monthRecords = useMemo(() => {
        const recs = Array.isArray(records) ? records : [];
        const d = new Date(selectedDate);
        if (!(d instanceof Date) || isNaN(d as any)) return recs;
        const selYear = d.getFullYear();
        const selMonth = d.getMonth();
        return recs.filter((r: any) => {
            const created = r?.created_at ? new Date(r.created_at) : null;
            return created instanceof Date && !isNaN(created as any) && created.getFullYear() === selYear && created.getMonth() === selMonth;
        });
    }, [records, selectedDate]);

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

    // Totals for Buku Besar
    const bukuBesarTotals = useMemo(() => {
        return filteredRecords.reduce(
            (acc: { debit: number; credit: number }, r: any) => {
                acc.debit += Number(r?.debit ?? 0);
                acc.credit += Number(r?.credit ?? 0);
                return acc;
            },
            { debit: 0, credit: 0 },
        );
    }, [filteredRecords]);

    // Neraca Saldo: accumulate per account (sum debit - sum credit). Positive -> Debit, Negative -> Credit. Only for reff 1,2,3
    const neracaSaldoRecords = useMemo(() => {
        const accMap = new Map<string, { account_id: string; name: string; debitSum: number; creditSum: number }>();
        (monthRecords ?? []).forEach((r: any) => {
            const code: string | undefined = r?.account?.reff ?? accounts?.find?.((a: any) => String(a.id) === String(r.account_id))?.reff;
            if (!code) return;
            if (!(code.startsWith('1') || code.startsWith('2') || code.startsWith('3'))) return;
            const accountId = String(r?.account_id ?? r?.account?.id ?? '');
            if (!accountId) return;
            const name = r?.account?.name ?? accounts?.find?.((a: any) => String(a.id) === accountId)?.name ?? `#${accountId}`;
            const curr = accMap.get(accountId) ?? { account_id: accountId, name, debitSum: 0, creditSum: 0 };
            curr.debitSum += Number(r?.debit ?? 0);
            curr.creditSum += Number(r?.credit ?? 0);
            accMap.set(accountId, curr);
        });
        return Array.from(accMap.values()).map((row) => {
            const net = row.debitSum - row.creditSum; // positive => debit, negative => credit
            return {
                account_id: row.account_id,
                name: row.name,
                debitAmount: net > 0 ? net : 0,
                creditAmount: net < 0 ? Math.abs(net) : 0,
            };
        });
    }, [monthRecords, accounts]);

    const neracaSaldoTotals = useMemo(() => {
        return neracaSaldoRecords.reduce(
            (acc: { debit: number; credit: number }, r: any) => {
                acc.debit += Number(r?.debitAmount ?? 0);
                acc.credit += Number(r?.creditAmount ?? 0);
                return acc;
            },
            { debit: 0, credit: 0 },
        );
    }, [neracaSaldoRecords]);

    // Laba/Rugi Saldo: accumulate per account (sum debit - sum credit). Positive -> Debit, Negative -> Credit. Only for reff 4,5,6,7
    const labaRugiSaldoRecords = useMemo(() => {
        const accMap = new Map<string, { account_id: string; name: string; debitSum: number; creditSum: number }>();
        (monthRecords ?? []).forEach((r: any) => {
            const code: string | undefined = r?.account?.reff ?? accounts?.find?.((a: any) => String(a.id) === String(r.account_id))?.reff;
            if (!code) return;
            if (!(code.startsWith('4') || code.startsWith('5') || code.startsWith('6') || code.startsWith('7'))) return;
            const accountId = String(r?.account_id ?? r?.account?.id ?? '');
            if (!accountId) return;
            const name = r?.account?.name ?? accounts?.find?.((a: any) => String(a.id) === accountId)?.name ?? `#${accountId}`;
            const curr = accMap.get(accountId) ?? { account_id: accountId, name, debitSum: 0, creditSum: 0 };
            curr.debitSum += Number(r?.debit ?? 0);
            curr.creditSum += Number(r?.credit ?? 0);
            accMap.set(accountId, curr);
        });
        return Array.from(accMap.values()).map((row) => {
            const net = row.debitSum - row.creditSum; // positive => debit, negative => credit
            return {
                account_id: row.account_id,
                name: row.name,
                debitAmount: net > 0 ? net : 0,
                creditAmount: net < 0 ? Math.abs(net) : 0,
            };
        });
    }, [monthRecords, accounts]);

    const labaRugiTotals = useMemo(() => {
        return labaRugiSaldoRecords.reduce(
            (acc: { debit: number; credit: number }, r: any) => {
                acc.debit += Number(r?.debitAmount ?? 0);
                acc.credit += Number(r?.creditAmount ?? 0);
                return acc;
            },
            { debit: 0, credit: 0 },
        );
    }, [labaRugiSaldoRecords]);

    // Kertas Kerja (Worksheet) — simplified to three sections
    // Columns: Neraca Saldo, Laba/Rugi, Neraca (each with Debit/Kredit)
    const worksheetRows = useMemo(() => {
        const map = new Map<string, { id: string; reff: string; name: string; tbNet: number }>();
        (monthRecords ?? []).forEach((r: any) => {
            const id = String(r?.account_id ?? r?.account?.id ?? '');
            if (!id) return;
            const accObj = r?.account ?? accounts?.find?.((a: any) => String(a.id) === id);
            const name = accObj?.name ?? `#${id}`;
            const reff = accObj?.reff ?? '';
            const debit = Number(r?.debit ?? 0);
            const credit = Number(r?.credit ?? 0);
            const curr = map.get(id) ?? { id, reff, name, tbNet: 0 };
            curr.tbNet += debit - credit; // positive => debit; negative => credit
            map.set(id, curr);
        });

        return Array.from(map.values())
            .sort((a, b) => (a.reff || '').localeCompare(b.reff || ''))
            .map((row) => {
                const nsSaldoDebit = row.tbNet > 0 ? row.tbNet : 0;
                const nsSaldoCredit = row.tbNet < 0 ? Math.abs(row.tbNet) : 0;

                const reff = row.reff ?? '';
                const isLR = reff.startsWith('4') || reff.startsWith('5') || reff.startsWith('6') || reff.startsWith('7');
                const isNeraca = reff.startsWith('1') || reff.startsWith('2') || reff.startsWith('3');

                const lrDebit = isLR ? nsSaldoDebit : 0;
                const lrCredit = isLR ? nsSaldoCredit : 0;
                const neracaDebit = isNeraca ? nsSaldoDebit : 0;
                const neracaCredit = isNeraca ? nsSaldoCredit : 0;

                return {
                    reff: row.reff,
                    name: row.name,
                    nsSaldoDebit,
                    nsSaldoCredit,
                    lrDebit,
                    lrCredit,
                    neracaDebit,
                    neracaCredit,
                };
            });
    }, [monthRecords, accounts]);

    const worksheetTotals = useMemo(() => {
        return (worksheetRows ?? []).reduce(
            (
                acc: {
                    nsSaldoDebit: number;
                    nsSaldoCredit: number;
                    lrDebit: number;
                    lrCredit: number;
                    neracaDebit: number;
                    neracaCredit: number;
                },
                r: any,
            ) => {
                acc.nsSaldoDebit += Number(r.nsSaldoDebit || 0);
                acc.nsSaldoCredit += Number(r.nsSaldoCredit || 0);
                acc.lrDebit += Number(r.lrDebit || 0);
                acc.lrCredit += Number(r.lrCredit || 0);
                acc.neracaDebit += Number(r.neracaDebit || 0);
                acc.neracaCredit += Number(r.neracaCredit || 0);
                return acc;
            },
            { nsSaldoDebit: 0, nsSaldoCredit: 0, lrDebit: 0, lrCredit: 0, neracaDebit: 0, neracaCredit: 0 },
        );
    }, [worksheetRows]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reporting" />

            <div className="flex h-full flex-1 flex-col gap-10 overflow-x-auto rounded-xl p-4">
                {/* Product Summary */}
                <span className="grid gap-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-xl font-medium sm:text-2xl">Reporting</h1>
                        <div className="flex items-center gap-2">
                            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-[10rem]" />
                            <a
                                href={route('reporting.export.worksheet', { date: selectedDate }) as unknown as string}
                                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-accent"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Export Excel
                            </a>
                        </div>
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
                                            <>
                                                {filteredRecords.map((record: any) => (
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
                                                ))}
                                                <TableRow>
                                                    <TableCell className="text-right font-medium">Total</TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        Rp {bukuBesarTotals.debit.toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        Rp {bukuBesarTotals.credit.toLocaleString('id-ID')}
                                                    </TableCell>
                                                </TableRow>
                                            </>
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
                                <h2 className="text-lg font-medium sm:text-xl">Neraca {monthLabel}</h2>
                            </div>
                            <div className="relative aspect-video overflow-y-scroll rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px] text-center">Account</TableHead>
                                            <TableHead className="text-center">Debits</TableHead>
                                            <TableHead className="text-center">Credits</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {neracaSaldoRecords.length > 0 ? (
                                            <>
                                                {neracaSaldoRecords.map((row: any) => (
                                                    <TableRow key={row.account_id}>
                                                        <TableCell className="text-center">
                                                            {row.name ? <span>{row.name}</span> : <span className="text-gray-400">No account</span>}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {row.debitAmount ? (
                                                                <span>Rp {Number(row.debitAmount).toLocaleString('id-ID')}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {row.creditAmount ? (
                                                                <span>Rp {Number(row.creditAmount).toLocaleString('id-ID')}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell className="text-right font-medium">Total</TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        Rp {neracaSaldoTotals.debit.toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        Rp {neracaSaldoTotals.credit.toLocaleString('id-ID')}
                                                    </TableCell>
                                                </TableRow>
                                            </>
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
                                <h2 className="text-lg font-medium sm:text-xl">Laba/Rugi {monthLabel}</h2>
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
                                        {labaRugiSaldoRecords.length > 0 ? (
                                            <>
                                                {labaRugiSaldoRecords.map((row: any) => (
                                                    <TableRow key={row.account_id}>
                                                        <TableCell className="text-center">
                                                            {row.name ? <span>{row.name}</span> : <span className="text-gray-400">No account</span>}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {row.debitAmount ? (
                                                                <span>Rp {Number(row.debitAmount).toLocaleString('id-ID')}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {row.creditAmount ? (
                                                                <span>Rp {Number(row.creditAmount).toLocaleString('id-ID')}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell className="text-right font-medium">Total</TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        Rp {labaRugiTotals.debit.toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        Rp {labaRugiTotals.credit.toLocaleString('id-ID')}
                                                    </TableCell>
                                                </TableRow>
                                            </>
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
                        <h2 className="text-lg font-medium sm:text-xl">Kertas Kerja {monthLabel}</h2>
                        <div className="relative overflow-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[90px] text-center">Reff</TableHead>
                                        <TableHead className="min-w-[180px]">Akun</TableHead>
                                        {/* Neraca Saldo */}
                                        <TableHead className="bg-yellow-400/20 text-center" colSpan={2}>
                                            Neraca Saldo
                                        </TableHead>
                                        {/* Laba/Rugi */}
                                        <TableHead className="bg-red-400/20 text-center" colSpan={2}>
                                            Laba/Rugi
                                        </TableHead>
                                        {/* Neraca */}
                                        <TableHead className="bg-green-400/20 text-center" colSpan={2}>
                                            Neraca
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead></TableHead>
                                        <TableHead className="text-center">Debit</TableHead>
                                        <TableHead className="text-center">Kredit</TableHead>
                                        <TableHead className="text-center">Debit</TableHead>
                                        <TableHead className="text-center">Kredit</TableHead>
                                        <TableHead className="text-center">Debit</TableHead>
                                        <TableHead className="text-center">Kredit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {worksheetRows.length > 0 ? (
                                        <>
                                            {worksheetRows.map((r: any, idx: number) => (
                                                <TableRow key={`${r.reff}-${idx}`}>
                                                    <TableCell className="text-center">{r.reff || '-'}</TableCell>
                                                    <TableCell className="">{r.name}</TableCell>
                                                    <TableCell className="text-center">
                                                        {r.nsSaldoDebit ? `Rp ${Number(r.nsSaldoDebit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {r.nsSaldoCredit ? `Rp ${Number(r.nsSaldoCredit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {r.lrDebit ? `Rp ${Number(r.lrDebit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {r.lrCredit ? `Rp ${Number(r.lrCredit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {r.neracaDebit ? `Rp ${Number(r.neracaDebit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {r.neracaCredit ? `Rp ${Number(r.neracaCredit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-right font-semibold">
                                                    Jumlah
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    Rp {worksheetTotals.nsSaldoDebit.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    Rp {worksheetTotals.nsSaldoCredit.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    Rp {worksheetTotals.lrDebit.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    Rp {worksheetTotals.lrCredit.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    Rp {worksheetTotals.neracaDebit.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    Rp {worksheetTotals.neracaCredit.toLocaleString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-gray-400">
                                                No Record Available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </span>
            </div>
        </AppLayout>
    );
}

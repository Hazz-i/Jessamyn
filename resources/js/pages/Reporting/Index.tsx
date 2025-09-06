import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import ReportingTable from '@/components/ui/reporting-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reporting',
        href: '/reporting',
    },
];

export default function Reporting({ records, accounts, reporting }: any) {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const period = reporting?.period as string | undefined;
        if (period && /^\d{4}-\d{2}$/.test(period)) return period;
        const d = new Date();
        const m = `${d.getMonth() + 1}`.padStart(2, '0');
        return `${d.getFullYear()}-${m}`; // YYYY-MM for type="month"
    });

    useEffect(() => {
        const period = reporting?.period as string | undefined;
        if (period && /^\d{4}-\d{2}$/.test(period) && period !== selectedDate) {
            setSelectedDate(period);
        }
    }, [reporting?.period]);

    // Label for headings
    const monthLabel = useMemo(() => {
        const d = new Date(`${selectedDate}-01`);
        if (!(d instanceof Date) || isNaN(d as any)) return '';
        return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }, [selectedDate]);

    // Records already filtered by server for the selected month
    const monthRecords = useMemo(() => (Array.isArray(records) ? records : []), [records]);

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

    // Buku Besar rows adapted for ReportingTable
    const bukuBesarRows = useMemo(() => {
        return (filteredRecords ?? []).map((r: any) => ({
            account_id: r?.account_id ?? r?.account?.id,
            name: r?.account?.name ?? (r?.account_id ? `#${r.account_id}` : undefined),
            // Pass undefined for 0 to render '-' like the original table
            debitAmount: r?.debit ? Number(r.debit) : undefined,
            creditAmount: r?.credit ? Number(r.credit) : undefined,
        }));
    }, [filteredRecords]);

    // Use server-provided datasets
    const neracaRecords = useMemo(() => (Array.isArray(reporting?.neraca) ? reporting.neraca : []), [reporting?.neraca]);
    const labaRugiSaldoRecords = useMemo(() => (Array.isArray(reporting?.laba_rugi) ? reporting.laba_rugi : []), [reporting?.laba_rugi]);

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
                            <Input
                                type="month"
                                value={selectedDate}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedDate(val);
                                    router.visit(route('reporting.index', { date: val }) as unknown as string, {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    });
                                }}
                                className="w-[11rem]"
                            />
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
                                <ReportingTable data={bukuBesarRows} />
                            </div>
                        </span>

                        {/* Neraca */}
                        <span className="grid gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Neraca Saldo</h2>
                            </div>
                            <div className="relative aspect-video overflow-y-scroll rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <ReportingTable data={neracaRecords} />
                            </div>
                        </span>

                        {/* Laba/Rugi */}
                        <span className="grid gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium sm:text-xl">Laba/Rugi</h2>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <ReportingTable data={labaRugiSaldoRecords} />
                            </div>
                        </span>
                    </div>

                    {/* Kertas Kerja */}
                    <div className="grid gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium sm:text-xl">Work Paper {monthLabel}</h2>
                            <a
                                href={route('reporting.export.worksheet', { date: selectedDate }) as unknown as string}
                                className="inline-flex items-center justify-center rounded-md border bg-primary px-3 py-2 text-sm text-primary-foreground transition-all duration-300 ease-in-out hover:bg-primary/80"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Export Excel
                            </a>
                        </div>

                        <div className="relative min-h-[20rem] overflow-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <Table className="min-h-[20rem]">
                                <TableHeader className='bg-muted'>
                                    <TableRow>
                                        <TableHead className="w-[90px] text-center">Reff</TableHead>
                                        <TableHead className="min-w-[180px]">Akun</TableHead>
                                        {/* Neraca Saldo */}
                                        <TableHead className="text-center" colSpan={2}>
                                            Neraca Saldo
                                        </TableHead>
                                        {/* Laba/Rugi */}
                                        <TableHead className="text-center" colSpan={2}>
                                            Laba/Rugi
                                        </TableHead>
                                        {/* Neraca */}
                                        <TableHead className="text-center" colSpan={2}>
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

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type Props = {
    period: string;
    salesGross: number;
    salesReturn: number;
    salesDisc: number;
    salesNet: number;
    openingInv: number;
    grossPurchases: number;
    purchaseReturns: number;
    purchaseDisc: number;
    freightIn: number;
    netPurchases: number;
    goodsAvail: number;
    closingInv: number;
    hpp: number;
    grossProfit: number;
    opex: number;
    operatingIncome: number;
    otherExpense: number;
    profitBeforeTax: number;
    incomeTax: number;
    netIncome: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reporting',
        href: route('reporting.index'),
    },
    {
        title: 'All Report',
        href: route('reporting.all'),
    },
];

const currency = (n?: number) => {
    if (n === undefined || n === null || isNaN(n as any)) return '-';
    const v = Number(n);
    const abs = Math.abs(v);
    const txt = abs.toLocaleString('id-ID');
    return v < 0 ? `(${txt})` : txt;
};

const title = (t: string) => <div className="mt-6 text-[15px] font-semibold text-pink-500 sm:text-base">{t}</div>;

export default function AllReport(props: Props) {
    const {
        period,
        salesNet,
        salesGross,
        salesReturn,
        salesDisc,
        openingInv,
        grossPurchases,
        purchaseReturns,
        purchaseDisc,
        freightIn,
        netPurchases,
        goodsAvail,
        closingInv,
        hpp,
        grossProfit,
        opex,
        operatingIncome,
        otherExpense,
        profitBeforeTax,
        incomeTax,
        netIncome,
    } = props as Props;

    // Pretty month label
    const monthLabel = (() => {
        try {
            const d = new Date(`${period}-01`);
            return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        } catch {
            return period;
        }
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Laba Rugi" />

            <div className="mx-auto w-full max-w-4xl p-6">
                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="text-[12px] font-semibold tracking-wide text-pink-500 sm:text-sm">CONTOH LAPORAN LABA RUGI</div>
                    <div className="text-sm font-semibold tracking-wide text-pink-500 sm:text-base">PERUSAHAAN DAGANG</div>
                    <div className="mt-1 text-xs text-muted-foreground">Periode: {monthLabel}</div>
                </div>

                {/* Table-like layout */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background px-4 py-5 text-sm dark:border-sidebar-border">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 border-b pb-2 text-[13px] font-medium">
                        <div>Keterangan</div>
                        <div className="text-right">Jumlah (Rp)</div>
                    </div>

                    {/* Penjualan Bersih */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-2">
                        <div className="font-semibold text-pink-500">Penjualan Bersih</div>
                        <div className="text-right font-semibold text-pink-500">{currency(salesNet)}</div>
                    </div>

                    {/* HPP Section */}
                    {title('Dikurangi: Harga Pokok Penjualan (HPP)')}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Persediaan Awal Barang Dagang</div>
                        <div className="text-right">{currency(openingInv)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Pembelian</div>
                        <div className="text-right">{currency(grossPurchases)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Return Pembelian</div>
                        <div className="text-right">
                            {purchaseReturns > 0 ? `(${purchaseReturns.toLocaleString('id-ID')})` : currency(purchaseReturns)}
                        </div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Potongan Pembelian</div>
                        <div className="text-right">{purchaseDisc > 0 ? `(${purchaseDisc.toLocaleString('id-ID')})` : currency(purchaseDisc)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Biaya Angkut Pembelian</div>
                        <div className="text-right">{currency(freightIn)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-2">
                        <div className="font-semibold text-pink-500">Pembelian Bersih</div>
                        <div className="text-right font-semibold text-pink-500">{currency(netPurchases)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Barang Tersedia untuk Dijual</div>
                        <div className="text-right">{currency(goodsAvail)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Persediaan Akhir Barang Dagang</div>
                        <div className="text-right">{closingInv > 0 ? `(${closingInv.toLocaleString('id-ID')})` : currency(closingInv)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-2">
                        <div className="font-semibold text-pink-500">Harga Pokok Penjualan (HPP)</div>
                        <div className="text-right font-semibold text-pink-500">{currency(hpp)}</div>
                    </div>

                    {/* Laba Kotor */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-3">
                        <div className="font-semibold text-pink-500">Laba Kotor</div>
                        <div className="text-right font-semibold text-pink-500">{currency(grossProfit)}</div>
                    </div>

                    {/* Opex */}
                    {title('Dikurangi: Beban Operasional')}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Total Beban Operasional</div>
                        <div className="text-right">{currency(opex)}</div>
                    </div>

                    {/* Laba Usaha */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-3">
                        <div className="font-semibold text-pink-500">Laba Usaha</div>
                        <div className="text-right font-semibold text-pink-500">{currency(operatingIncome)}</div>
                    </div>

                    {/* Other Expense */}
                    {title('Dikurangi: Beban Lain-lain')}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Beban Lain-lain</div>
                        <div className="text-right">{currency(otherExpense)}</div>
                    </div>

                    {/* Profit Before Tax */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-3">
                        <div className="font-semibold text-pink-500">Laba Sebelum Pajak</div>
                        <div className="text-right font-semibold text-pink-500">{currency(profitBeforeTax)}</div>
                    </div>

                    {/* Income Tax */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-1">
                        <div>Dikurangi: Pajak Penghasilan</div>
                        <div className="text-right">{currency(incomeTax)}</div>
                    </div>

                    {/* Net Income */}
                    <div className="grid grid-cols-[1fr,160px] gap-4 py-3">
                        <div className="font-semibold text-pink-500">Laba Bersih</div>
                        <div className="text-right font-semibold text-pink-500">{currency(netIncome)}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

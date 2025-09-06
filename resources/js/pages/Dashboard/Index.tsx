import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<string>(() => {
        const d = new Date();
        const m = `${d.getMonth() + 1}`.padStart(2, '0');
        return `${d.getFullYear()}-${m}`;
    });
    const [equity, setEquity] = useState<null | {
        period_month: string;
        opening_equity: number;
        owner_contribution: number;
        owner_draw: number;
        net_income: number;
        closing_equity: number;
    }>(null);

    async function generateReport() {
        try {
            setLoading(true);
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const resp = await fetch(route('equity.generate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token ?? '',
                },
                body: JSON.stringify({ period }),
            });
            if (!resp.ok) throw new Error('Failed to generate report');
            const data = await resp.json();
            setEquity(data);
        } catch (e) {
            console.error(e);
            alert('Gagal generate laporan.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <span className="flex items-center justify-between">
                    <span className="grid gap-1">
                        <h1 className="text-xl font-medium">Welcome Back</h1>
                        <p className="text-sm text-[#B5B5B5]">Welcome to dashboard</p>
                    </span>
                    <input
                        id="period"
                        type="month"
                        className="rounded-md border px-2 py-1 text-sm dark:bg-transparent"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    />
                </span>

                {/* Laporan Perubahan Modal (Equity) */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    {/* BALANCE */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70">
                            <div className="flex h-full flex-col justify-between p-4">
                                <h2 className="mb-2 text-lg font-semibold">Laporan Perubahan Modal</h2>

                                {equity ? (
                                    <div className="text-center text-sm">
                                        <div className="flex justify-between">
                                            <span>Modal Awal</span>
                                            <span>{equity.opening_equity.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Setoran Modal</span>
                                            <span>{equity.owner_contribution.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Prive</span>
                                            <span>{equity.owner_draw.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Laba Bersih</span>
                                            <span>{equity.net_income.toLocaleString()}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Modal Akhir</span>
                                            <span>{equity.closing_equity.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-muted-foreground">No record</p>
                                )}
                                <span className="w-ful flex items-center justify-end">
                                    <Button size="sm" onClick={generateReport} disabled={loading}>
                                        {loading ? 'Generating' : 'Generate Laporan'}
                                    </Button>
                                </span>
                            </div>
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>

                    {/* Recent Transaction */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    {/* Product Sales */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    {/* Neraca */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

type EditRecordProps = {
    record: {
        id: number;
        description: string;
        note?: string | null;
        account_id: number | string;
        debit?: string | number | null;
        credit?: string | number | null;
        image?: string | null;
    };
    accounts: Array<{ id: number; name: string }>;
};

export default function EditRecord({ record, accounts }: EditRecordProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'put' as const,
        description: record.description ?? '',
        note: record.note ?? '',
        account_id: String(record.account_id ?? ''),
        amount: String(record.debit ?? record.credit ?? ''),
        side: record.debit && Number(record.debit) > 0 ? 'debit' : 'credit',
        image: null as File | null,
        date: (record as any).date ? String((record as any).date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    });

    const accountLabel = (id: string) => {
        if (!id) return 'Select account';
        const acc = accounts?.find((a) => String(a.id) === String(id));
        return acc?.name ?? 'Select account';
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as any, value);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('jurnal-umum.update', { accounting: record.id }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                clearErrors();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex cursor-pointer items-center justify-center p-2">
                    <i className="bx bx-edit text-xl text-primary" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>Edit Journal Record</DialogTitle>
                <DialogDescription>Update this journal record.</DialogDescription>
                <form onSubmit={onSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <textarea
                            name="description"
                            className="min-h-[100px] rounded-md border p-3 text-sm"
                            value={data.description}
                            onChange={handleInput}
                            required
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" name="date" value={(data as any).date} onChange={handleInput} />
                        {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Account</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" className="min-w-[200px] justify-between border-input">
                                    {accountLabel(data.account_id)}
                                    <i className="bx bx-chevron-down ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="max-h-60 min-w-[12rem] overflow-auto">
                                {accounts?.map((a) => (
                                    <DropdownMenuItem key={a.id} onClick={() => setData('account_id', String(a.id))}>
                                        {a.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {errors.account_id && <p className="text-sm text-destructive">{errors.account_id}</p>}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Side</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={data.side === 'debit' ? 'default' : 'outline'}
                                    onClick={() => setData('side', 'debit')}
                                >
                                    Debit
                                </Button>
                                <Button
                                    type="button"
                                    variant={data.side === 'credit' ? 'default' : 'outline'}
                                    onClick={() => setData('side', 'credit')}
                                >
                                    Credit
                                </Button>
                            </div>
                            {errors.side && <p className="text-sm text-destructive">{errors.side}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Amount</Label>
                            <Input type="number" name="amount" step="0.01" min="0" value={data.amount} onChange={handleInput} required />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Note</Label>
                        <textarea name="note" className="min-h-[80px] rounded-md border p-3 text-sm" value={data.note} onChange={handleInput} />
                        {errors.note && <p className="text-sm text-destructive">{errors.note}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Proof (Image)</Label>
                        <Input id="image" name="image" type="file" accept="image/*" onChange={handleFile} />
                        {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

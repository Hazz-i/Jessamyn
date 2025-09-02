import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

// Form state aligned with accounting table
type JournalForm = {
    description: string;
    note: string;
    // Multiple debit lines, each with account and amount
    debits: Array<{ account_id: string; amount: string }>;
    // Multiple credit lines, each with account and amount
    credits: Array<{ account_id: string; amount: string }>;
    image: File | null;
};

type CreateJurnalUmumProps = {
    setOpen: (open: boolean) => void;
    open: boolean;
    accounts: Array<{ id: number; name: string }>;
};

export default function CreateJurnalUmum({ setOpen, open, accounts }: CreateJurnalUmumProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<JournalForm>({
        description: '',
        note: '',
        debits: [{ account_id: '', amount: '' }],
        credits: [{ account_id: '', amount: '' }],
        image: null,
    });

    const fieldError = (key: string): string | undefined => {
        return (errors as unknown as Record<string, string | undefined>)[key];
    };

    const accountLabel = (id: string) => {
        if (!id) return 'Select account';
        const acc = accounts?.find((a) => String(a.id) === String(id));
        return acc?.name ?? 'Select account';
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as keyof JournalForm, value as any);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
    };

    const handleDebitChange = (index: number, field: 'account_id' | 'amount', value: string) => {
        const next = [...data.debits];
        next[index] = { ...next[index], [field]: value } as any;
        setData('debits', next);
    };

    const addDebitLine = () => {
        setData('debits', [...data.debits, { account_id: '', amount: '' }]);
    };

    const removeDebitLine = (index: number) => {
        const next = data.debits.filter((_, i) => i !== index);
        setData('debits', next.length ? next : [{ account_id: '', amount: '' }]);
    };

    const handleCreditChange = (index: number, field: 'account_id' | 'amount', value: string) => {
        const next = [...data.credits];
        next[index] = { ...next[index], [field]: value } as any;
        setData('credits', next);
    };

    const addCreditLine = () => {
        setData('credits', [...data.credits, { account_id: '', amount: '' }]);
    };

    const removeCreditLine = (index: number) => {
        const next = data.credits.filter((_, i) => i !== index);
        setData('credits', next.length ? next : [{ account_id: '', amount: '' }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('jurnal-umum.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(e) => {
                setOpen(e);
                if (!e) {
                    reset();
                    clearErrors();
                }
            }}
        >
            <DialogTrigger asChild>
                <button className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-2">
                    <i className="bx bx-plus text-xl text-white" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>Create Journal Entry</DialogTitle>
                <DialogDescription>Fill in the journal entry details below.</DialogDescription>
                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleInput}
                            className="min-h-[100px] rounded-md border p-3 text-sm"
                            required
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    {/* Debit */}
                    <span className="flex flex-col items-start justify-center gap-2">
                        <Label>Debit</Label>
                        <div className="grid w-full gap-4">
                            {data.debits.map((line, idx) => (
                                <div key={idx} className="flex items-end justify-center gap-2">
                                    <div className="grid gap-2 flex-1">
                                        <Label>Account</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" variant="outline" className="min-w-[200px] justify-between border-input">
                                                    {accountLabel(line.account_id)}
                                                    <i className="bx bx-chevron-down ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="max-h-60 min-w-[12rem] overflow-auto">
                                                {accounts?.map((a) => (
                                                    <DropdownMenuItem key={a.id} onClick={() => handleDebitChange(idx, 'account_id', String(a.id))}>
                                                        {a.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {fieldError(`debits.${idx}.account_id`) && (
                                            <p className="text-sm text-destructive">{fieldError(`debits.${idx}.account_id`)}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Amount</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={line.amount}
                                            onChange={(e) => handleDebitChange(idx, 'amount', e.target.value)}
                                            required
                                        />
                                        {fieldError(`debits.${idx}.amount`) && (
                                            <p className="text-sm text-destructive">{fieldError(`debits.${idx}.amount`)}</p>
                                        )}
                                    </div>
                                    {data.debits.length > 1 && (
                                        <div className="sm:col-span-2">
                                            <button
                                                type="button"
                                                className="cursor-pointer py-2 text-xl text-destructive"
                                                onClick={() => removeDebitLine(idx)}
                                            >
                                                <i className="bx bx-x"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" className="w-full" onClick={addDebitLine}>
                            add more debit
                        </Button>
                    </span>

                    {/* Credit */}
                    <span className="flex flex-col items-start justify-center gap-2">
                        <Label>Credit</Label>
                        <div className="grid gap-4 w-full">
                            {data.credits.map((line, idx) => (
                                <div key={idx} className="flex items-end justify-center gap-2">
                                    <div className="grid gap-2 flex-1">
                                        <Label>Account</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" variant="outline" className="min-w-[200px] justify-between border-input">
                                                    {accountLabel(line.account_id)}
                                                    <i className="bx bx-chevron-down ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="max-h-60 min-w-[12rem] overflow-auto">
                                                {accounts?.map((a) => (
                                                    <DropdownMenuItem key={a.id} onClick={() => handleCreditChange(idx, 'account_id', String(a.id))}>
                                                        {a.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {fieldError(`credits.${idx}.account_id`) && (
                                            <p className="text-sm text-destructive">{fieldError(`credits.${idx}.account_id`)}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Amount</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={line.amount}
                                            onChange={(e) => handleCreditChange(idx, 'amount', e.target.value)}
                                            required
                                        />
                                        {fieldError(`credits.${idx}.amount`) && (
                                            <p className="text-sm text-destructive">{fieldError(`credits.${idx}.amount`)}</p>
                                        )}
                                    </div>
                                    {data.credits.length > 1 && (
                                        <div className="sm:col-span-2">
                                            <button
                                                type="button"
                                                className="cursor-pointer py-2 text-xl text-destructive"
                                                onClick={() => removeCreditLine(idx)}
                                            >
                                                <i className="bx bx-x"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" className="w-full" onClick={addCreditLine}>
                            add more credit
                        </Button>
                    </span>

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
                            {processing ? 'Saving' : 'Save Record'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

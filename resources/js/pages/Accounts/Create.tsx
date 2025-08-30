import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

// Modal + Form state for creating product
type AccountForm = {
    name: string;
    description: string;
    status: string; // '1' | '0'
};

type CreateAccountProps = {
    setOpen: (open: boolean) => void;
    open: boolean;
    // onSuccess: () => void;
};

export default function CreateAccount({ setOpen, open }: CreateAccountProps) {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<AccountForm>({
        name: '',
        description: '',
        status: '1',
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as any, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((d) => ({
            ...d,
            status: (d.status === '1') as unknown as string,
        }));
        post(route('accounts.store'), {
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
                <DialogTitle>Create Account</DialogTitle>
                <DialogDescription>Fill in the account details below.</DialogDescription>
                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Account Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={handleInput} required />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleInput}
                            className="min-h-[100px] rounded-md border p-3 text-sm"
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" name="status" value={data.status} onChange={handleInput} className="h-10 rounded-md border px-3 text-sm">
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving.' : 'Save Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

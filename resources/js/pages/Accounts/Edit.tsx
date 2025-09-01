import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

// Modal + Form state for creating product
type AccountForm = {
    name: string;
    description: string;
    status: string;
    reff: string;
};

type EditAccountProps = {
    setOpen: (open: boolean) => void;
    open: boolean;
    account: any;
};

export default function EditAccount({ setOpen, open, account }: EditAccountProps) {
    console.log(account);

    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<AccountForm>({
        name: account.name,
        description: account.description,
        status: account.status ? '1' : '0',
        reff: account.reff,
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
        put(route('accounts.update', account.id), {
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
                <button className="flex cursor-pointer items-center justify-center p-2">
                    <i className="bx bx-edit text-xl text-primary" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>Edit Account</DialogTitle>
                <DialogDescription>Update the account details below.</DialogDescription>
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

                    <div className="flex items-center justify-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={handleInput}
                                className="h-10 rounded-md border px-3 text-sm"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reff">Account Reff</Label>
                            <Input id="reff" name="reff" value={data.reff} onChange={handleInput} required />
                            {errors.reff && <p className="text-sm text-destructive">{errors.reff}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating' : 'Update Account'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';

type DeleteProps = {
    account: {
        id: number;
        name: string;
        description: string | null;
        status: boolean;
        reff: string;
    };
};

export default function DeleteAccount({ account }: DeleteProps) {
    const { delete: destroy, processing } = useForm({});

    const onConfirm = () => {
        destroy(route('accounts.destroy', account.id), {
            preserveScroll: true,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex cursor-pointer items-center justify-center p-2">
                    <i className="bx bx-trash text-xl text-destructive" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete {account.name ? <b>{account.name}</b> : 'this account'}? This action cannot be undone.
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" disabled={processing} onClick={onConfirm}>
                        {processing ? 'Deleting' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

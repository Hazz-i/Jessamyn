import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';

type Props = {
    productId: number | string;
    id: number | string;
    name?: string;
    onSuccess?: () => void;
    useDialog?: boolean; // when false, render inline confirm (no nested Dialog)
};

export default function DeleteProductVariant({ productId, id, name, onSuccess, useDialog = true }: Props) {
    const { delete: destroy, processing } = useForm({});
    const [open, setOpen] = useState(false);

    const performDelete = () => {
        destroy(route('product.variants.destroy', [productId, id]), {
            preserveScroll: true,
            onSuccess: () => {
                // close local dialog if any, then notify parent
                setOpen(false);
                if (onSuccess) onSuccess();
            },
            onError: () => {
                // ensure dialog closed on error to avoid stuck overlay
                setOpen(false);
            },
        });
    };

    // Inline confirm mode (no Dialog) - safe to render inside another dialog
    if (!useDialog) {
        return (
            <Button
                variant="destructive"
                type="button"
                disabled={processing}
                onClick={() => {
                    // simple native confirm to avoid any overlay components
                    const ok = window.confirm(`Delete variant ${name ?? ''}? This action cannot be undone.`);
                    if (ok) performDelete();
                }}
            >
                {processing ? 'Deleting...' : 'Delete'}
            </Button>
        );
    }

    // Standalone Dialog mode (original behavior)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={processing}>
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Variant</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete {name ? <b>{name}</b> : 'this variant'}? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" type="button" disabled={processing} onClick={performDelete}>
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

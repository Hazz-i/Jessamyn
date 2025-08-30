import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

type Props = {
    id: number | string;
    name?: string;
};

export default function DeleteProduct({ id, name }: Props) {
    const { delete: destroy, processing } = useForm({});

    const onConfirm = () => {
        destroy(route('product.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Product successfully deleted');
            },
            onError: () => {
                toast.error('Failed to delete product');
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'destructive'} disabled={processing}>
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete product</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete {name ? <b>{name}</b> : 'this product'}? This action cannot be undone.
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

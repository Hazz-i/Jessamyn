import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';

type Props = {
    productId: number | string;
    id: number | string;
    name?: string;
};

export default function DeleteProductVariant({ productId, id, name }: Props) {
    const { delete: destroy, processing } = useForm({});

    const onConfirm = () => {
        destroy(route('product.variants.destroy', [productId, id]), {
            preserveScroll: true,
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
                <DialogTitle>Delete variant</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete {name ? <b>{name}</b> : 'this variant'}? This action cannot be undone.
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

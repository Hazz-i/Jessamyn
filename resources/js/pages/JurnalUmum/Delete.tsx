import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';

type DeleteRecordProps = {
    record: {
        id: number;
        description?: string;
        note?: string | null;
        image?: string | null;
    };
};

export default function DeleteRecord({ record }: DeleteRecordProps) {
    const { delete: destroy, processing } = useForm({});

    const onConfirm = () => {
        destroy(route('jurnal-umum.destroy', { accounting: record.id }), {
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
                <DialogTitle>Delete Record</DialogTitle>
                <DialogDescription>Are you sure you want to delete this record? This action cannot be undone.</DialogDescription>
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

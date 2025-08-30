import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import DeleteProductVariant from './Delete';

type Variant = {
    id: number | string;
    variant: string;
    price: number | string;
    stock_qty: number | string;
    product_id?: number | string;
};

type VariantForm = {
    variant: string;
    stock_qty: number;
    price: number;
};

export default function EditProductVariant({
    variant,
    productId,
    open: externalOpen,
    setOpen: setExternalOpen,
    withTrigger = true,
}: {
    variant: Variant;
    productId: number | string;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    withTrigger?: boolean;
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = externalOpen ?? internalOpen;
    const setOpen = setExternalOpen ?? setInternalOpen;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<VariantForm>({
        variant: String(variant.variant ?? ''),
        price: Number(variant.price ?? 0),
        stock_qty: Number(variant.stock_qty ?? 0),
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as any, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((d) => ({
            ...d,
        }));
        put(route('product.variants.update', [productId, variant.id]), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
            },
        });
    };

    const handleDelete = () => {
        // Add your delete logic here
        setShowDeleteConfirm(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) {
                    reset();
                    clearErrors();
                }
            }}
        >
            {withTrigger && (
                <DialogTrigger asChild>
                    <button className="cursor-pointer text-sm text-primary" aria-label="Edit variant">
                        <i className="bx bx-edit text-xl"></i>
                    </button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-[20rem] p-4">
                <DialogTitle>Edit Variant</DialogTitle>
                <DialogDescription>Update the product variant below.</DialogDescription>
                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="variant">Variant</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" className="justify-between">
                                    {data.variant ? data.variant : 'Select Variant'}
                                    <i className="bx bx-chevron-down ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[12rem]">
                                <DropdownMenuItem onClick={() => setData('variant', 'Single')}>Single</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setData('variant', 'Bundling')}>Bundling</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {errors.variant && <p className="text-sm text-destructive">{errors.variant}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="stock_qty">Stock</Label>
                        <Input id="stock_qty" name="stock_qty" type="number" value={data.stock_qty} onChange={handleInput} required />
                        {errors.stock_qty && <p className="text-sm text-destructive">{errors.stock_qty}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" name="price" type="number" value={data.price} onChange={handleInput} required />
                        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>

                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                        {/* Render inline confirm delete (no nested Dialog) */}
                        <DeleteProductVariant
                            productId={productId}
                            id={variant.id}
                            name={variant.variant}
                            onSuccess={() => {
                                // close parent edit dialog after delete
                                setOpen(false);
                            }}
                            useDialog={false} // IMPORTANT: inline confirm, no overlay
                        />
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white p-6 rounded shadow">
                        <p>Are you sure you want to delete this variant?</p>
                        <div className="flex gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    );
}
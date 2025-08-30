import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

// Modal + Form state for creating product
type ProductForm = {
    variant: string;
    stock_qty: number;
    price: number;
};

type CreateProductProps = {
    productId: number | string;
    setOpen: (open: boolean) => void;
    open: boolean;
};

export default function CreateProductVariant({ productId, setOpen, open }: CreateProductProps) {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<ProductForm>({
        variant: '',
        price: 0,
        stock_qty: 0,
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
        post(route('product.variants.store', productId), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Let Inertia redirect to variant form; modal close optional
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
                <button className="bx bx-plus cursor-pointer text-xl text-primary" />
            </DialogTrigger>
            <DialogContent className="max-w-[20rem] p-4">
                <DialogTitle>Create Product Variant</DialogTitle>
                <DialogDescription>Fill in the product variants below.</DialogDescription>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4 py-2">
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
                                <DropdownMenuItem onClick={() => setData('variant', '25ml')}>25ml</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setData('variant', '60ml')}>60ml</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setData('variant', '100ml')}>100ml</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setData('variant', '120ml')}>120ml</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setData('variant', '250ml')}>250ml</DropdownMenuItem>
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
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving' : 'Save Variant'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

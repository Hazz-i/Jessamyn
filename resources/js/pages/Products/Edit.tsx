import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import DeleteProduct from './Delete';

type Product = {
    id: number | string;
    name: string;
    image?: string | null;
    sub_image?: string | null;
    description?: string | null;
};

type ProductForm = {
    name: string;
    image: File | null;
    sub_image: File | null;
    description: string;
};

export default function EditProduct({ product }: { product: Product }) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<ProductForm>({
        name: String(product.name ?? ''),
        image: null,
        sub_image: null,
        description: String(product.description ?? ''),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [subImagePreview, setSubImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const subImageInputRef = useRef<HTMLInputElement | null>(null);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as keyof ProductForm, value);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        const file = files?.[0] ?? null;
        setData(name as keyof ProductForm, file);

        if (name === 'image') {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(file ? URL.createObjectURL(file) : null);
        }
        if (name === 'sub_image') {
            if (subImagePreview) URL.revokeObjectURL(subImagePreview);
            setSubImagePreview(file ? URL.createObjectURL(file) : null);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            if (subImagePreview) URL.revokeObjectURL(subImagePreview);
        };
    }, [imagePreview, subImagePreview]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((d) => ({
            ...d,
        }));
        put(route('product.update', product.id), {
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
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) {
                    reset();
                    clearErrors();
                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                    if (subImagePreview) URL.revokeObjectURL(subImagePreview);
                    setImagePreview(null);
                    setSubImagePreview(null);
                    if (imageInputRef.current) imageInputRef.current.value = '';
                    if (subImageInputRef.current) subImageInputRef.current.value = '';
                }
            }}
        >
            <DialogTrigger asChild>
                <button className="cursor-pointer text-sm text-primary" aria-label="Edit product">
                    <i className="bx bx-edit text-xl"></i>
                </button>
            </DialogTrigger>
            <DialogContent className="w-[92vw] max-w-[560px] p-4 sm:max-w-[640px] sm:p-6 md:max-w-[700px]">
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Update the product details below.</DialogDescription>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor={`name-${product.id}`}>Name</Label>
                        <Input id={`name-${product.id}`} name="name" value={data.name} onChange={handleInput} required />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    {/* Images (responsive grid) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Primary Image */}
                        <div className="grid gap-2">
                            <Label htmlFor={`image-${product.id}`}>Image</Label>
                            <input
                                ref={imageInputRef}
                                id={`image-${product.id}`}
                                name="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                            />
                            {imagePreview || product.image ? (
                                <div className="flex flex-col gap-2">
                                    <img
                                        src={imagePreview ?? product.image ?? undefined}
                                        alt="Preview"
                                        className="h-36 w-full rounded-md object-cover"
                                    />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                                            Change
                                        </Button>
                                        {imagePreview && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => {
                                                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                                                    setImagePreview(null);
                                                    setData('image', null);
                                                    if (imageInputRef.current) imageInputRef.current.value = '';
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Button type="button" variant="outline" className="justify-center" onClick={() => imageInputRef.current?.click()}>
                                    Choose Image
                                </Button>
                            )}
                            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                        </div>

                        {/* Sub Image */}
                        <div className="grid gap-2">
                            <Label htmlFor={`sub_image-${product.id}`}>Sub Image (optional)</Label>
                            <input
                                ref={subImageInputRef}
                                id={`sub_image-${product.id}`}
                                name="sub_image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                            />
                            {subImagePreview || product.sub_image ? (
                                <div className="flex flex-col gap-2">
                                    <img
                                        src={subImagePreview ?? product.sub_image ?? undefined}
                                        alt="Preview"
                                        className="h-36 w-full rounded-md object-cover"
                                    />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => subImageInputRef.current?.click()}>
                                            Change
                                        </Button>
                                        {subImagePreview && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => {
                                                    if (subImagePreview) URL.revokeObjectURL(subImagePreview);
                                                    setSubImagePreview(null);
                                                    setData('sub_image', null);
                                                    if (subImageInputRef.current) subImageInputRef.current.value = '';
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Button type="button" variant="outline" className="justify-center" onClick={() => subImageInputRef.current?.click()}>
                                    Choose Sub Image
                                </Button>
                            )}
                            {errors.sub_image && <p className="text-sm text-destructive">{errors.sub_image}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor={`description-${product.id}`}>Description</Label>
                        <textarea
                            id={`description-${product.id}`}
                            name="description"
                            value={data.description}
                            onChange={handleInput}
                            className="min-h-[100px] rounded-md border p-3 text-sm"
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <DeleteProduct id={product.id} name={product.name} />
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

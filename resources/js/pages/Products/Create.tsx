import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Modal + Form state for creating product
type ProductForm = {
    name: string;
    image: File | null;
    sub_image: File | null;
    category: string;
    description: string;
};

type CreateProductProps = {
    setOpen: (open: boolean) => void;
    open: boolean;
    onSuccess?: (message?: string) => void;
};

export default function CreateProduct({ setOpen, open, onSuccess }: CreateProductProps) {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<ProductForm>({
        name: '',
        image: null,
        sub_image: null,
        category: '',
        description: '',
    });

    // Image previews + refs
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [subImagePreview, setSubImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const subImageInputRef = useRef<HTMLInputElement | null>(null);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as any, value);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        const file = files?.[0] ?? null;
        setData(name as any, file);

        // set preview
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
        transform((d) => {
            const payload: Record<string, any> = {
                ...d,
                category: d.category ? d.category : (null as unknown as string),
            };
            if (!d.sub_image) delete payload.sub_image;
            return payload;
        });
        post(route('product.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
                onSuccess?.('Product successfully added');
            },
            onError: (errs) => {
                const messages: string[] = [];
                Object.values(errs ?? {}).forEach((v) => {
                    if (Array.isArray(v)) {
                        v.forEach((m) => typeof m === 'string' && messages.push(m));
                    } else if (typeof v === 'string') {
                        messages.push(v);
                    }
                });
                if (messages.length === 0) messages.push('Failed to save product');
                messages.forEach((m) => toast.error(m));
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
                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                    if (subImagePreview) URL.revokeObjectURL(subImagePreview);
                    setImagePreview(null);
                    setSubImagePreview(null);
                }
            }}
        >
            <DialogTrigger asChild>
                <button className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-2">
                    <i className="bx bx-plus text-xl text-white" />
                </button>
            </DialogTrigger>
            <DialogContent className="w-[92vw] max-w-[560px] p-4 sm:max-w-[640px] sm:p-6 md:max-w-[700px]">
                <DialogTitle>Create Product</DialogTitle>
                <DialogDescription>Fill in the product details below.</DialogDescription>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={handleInput} required />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    {/* Images (responsive grid) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Primary Image */}
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image</Label>
                            <input
                                ref={imageInputRef}
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                                required
                            />
                            {imagePreview ? (
                                <div className="flex flex-col gap-2">
                                    <img src={imagePreview} alt="Preview" className="h-36 w-full rounded-md object-cover" />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                                            Change
                                        </Button>
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
                            <Label htmlFor="sub_image">Sub Image</Label>
                            <input
                                ref={subImageInputRef}
                                id="sub_image"
                                name="sub_image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                            />
                            {subImagePreview ? (
                                <div className="flex flex-col gap-2">
                                    <img src={subImagePreview} alt="Preview" className="h-36 w-full rounded-md object-cover" />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => subImageInputRef.current?.click()}>
                                            Change
                                        </Button>
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
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            required
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleInput}
                            className="min-h-[100px] rounded-md border p-3 text-sm"
                        />
                        <div className="text-right text-xs text-muted-foreground">{data.description?.length ?? 0} chars</div>
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving' : 'Save Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

const UploadFile = ({ open, setOpen }: any) => {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{ file: File | null; token?: string; coa?: any }>({
        file: null,
    });

    const [preview, setPreview] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
    };

    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shopee.preview'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (resp: any) => {
                setPreview(resp.props); // inertia kirim balik props, atau cek di resp.data kalau pakai axios
                setToken(resp.props.token);
            },
        });
    };

    const handleCommit = () => {
        if (!token) return;
        setData('token', token);
        setData('coa', {
            bank: '102',
            sales: '401',
            admin_exp: '609',
            ship_exp: '604',
            hpp: '501',
            inventory: '114',
        });
        post(route('shopee.commit'), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
                setPreview(null);
                setToken(null);
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
                    setPreview(null);
                    setToken(null);
                }
            }}
        >
            <DialogTrigger asChild>
                <button className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-2 text-sm font-medium text-white">
                    Upload File
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogTitle>Import Penjualan Shopee</DialogTitle>
                <DialogDescription>Upload file export Shopee (.xlsx/.csv) untuk di-preview sebelum disimpan.</DialogDescription>

                {!preview ? (
                    // Step 1: Upload
                    <form onSubmit={handlePreview} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="file">File</Label>
                            <Input id="file" name="file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} required />
                            {errors.file && <p className="text-sm text-destructive">{String(errors.file)}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Processing' : 'Preview'}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    // Step 2: Preview & Commit
                    <div className="grid gap-4">
                        <h3 className="text-md font-medium">Preview Data</h3>
                        <pre className="max-h-64 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(preview.sample, null, 2)}</pre>
                        <h4 className="text-sm font-semibold">Insights (Gemini)</h4>
                        <ul className="list-disc pl-6 text-sm">
                            {preview.insights?.alerts?.map((a: string, i: number) => (
                                <li key={i}>{a}</li>
                            ))}
                        </ul>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button onClick={handleCommit} disabled={processing}>
                                {processing ? 'Saving' : 'Commit & Save'}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UploadFile;

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useState, useMemo } from "react";

const UploadFile = ({ open, setOpen }: any) => {
  const { data, setData, processing, errors, reset, clearErrors } = useForm<{
    file: File | null;
  }>({
    file: null,
  });

  const [header, setHeader] = useState<string[]>([]);
  const [sample, setSample] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // mapping kolom
  const [map, setMap] = useState<any>({
    order_no: "",
    completed_at: "",
    gross_amount: "",
    admin_fee: "",
    shipping_fee: "",
    product_cost: "",
  });

  // pilih file
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setData("file", file);
  };

  // preview
  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.file) return;

    const formData = new FormData();
    formData.append("file", data.file);

    try {
      const resp = await axios.post(route("shopee.preview"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setHeader(resp.data.header ?? []);
      setSample(resp.data.sample ?? []);
      setToken(resp.data.token ?? null);
    } catch (err) {
      console.error("Preview error", err);
    }
  };

  // commit ke backend
  const handleCommit = async () => {
    if (!token) return;

    const payload = {
      token,
      coa: {
        bank: "102",
        sales: "401",
        admin_exp: "609",
        ship_exp: "604",
        hpp: "501",
        inventory: "114",
      },
      map,
    };

    try {
      const resp = await axios.post(route("shopee.commit"), payload);
      console.log("✅ Commit sukses:", resp.data);

      setOpen(false);
      reset();
      clearErrors();
      setHeader([]);
      setSample([]);
      setToken(null);
      setMap({});
    } catch (err: any) {
      console.error("Commit error", err.response?.data || err.message);
    }
  };

  // pastikan header array
  const headerArray: string[] = Array.isArray(header)
    ? header
    : Object.values(header ?? {});

  // parser angka
  const parseNumber = (v: any) => {
    if (v === null || v === undefined) return 0;
    let s = String(v).trim();
    if (!s) return 0;

    s = s.replace(/[^\d,.\-]/g, "");

    if (s.includes(".") && s.includes(",")) {
      s = s.replace(/\./g, "");
      s = s.replace(",", ".");
    } else if (s.includes(".") && !s.includes(",")) {
      if (/\.\d{3}(?:\.|$)/.test(s)) {
        s = s.replace(/\./g, "");
      }
    } else if (s.includes(",") && !s.includes(".")) {
      s = s.replace(",", ".");
    }

    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
  };

  // summary otomatis
  const summary = useMemo(() => {
    if (!headerArray.length || !sample.length) return null;

    const getColIndex = (name: string) =>
      headerArray.findIndex((h) =>
        h.toLowerCase().includes(name.toLowerCase())
      );

    const jumlahIdx = getColIndex("Jumlah");
    const ongkirIdx = getColIndex("Ongkir");
    const adminIdx = getColIndex("Biaya Admin");
    const costIdx = getColIndex("Harga Pokok");

    const totalJumlah = sample.reduce(
      (acc, row) => acc + parseNumber(row[jumlahIdx]),
      0
    );
    const totalOngkir = sample.reduce(
      (acc, row) => acc + parseNumber(row[ongkirIdx]),
      0
    );
    const totalAdmin = sample.reduce(
      (acc, row) => acc + parseNumber(row[adminIdx]),
      0
    );
    const totalCost = sample.reduce(
      (acc, row) => acc + parseNumber(row[costIdx]),
      0
    );

    return {
      count: sample.length,
      totalJumlah,
      totalOngkir,
      totalAdmin,
      totalCost,
    };
  }, [headerArray, sample]);

  // render cell
  const renderCell = (header: string, value: any) => {
    if (header.toLowerCase().includes("status") && value) {
      const status = String(value).toLowerCase();
      const color = status.includes("selesai")
        ? "bg-green-100 text-green-700"
        : status.includes("batal")
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
          {value}
        </span>
      );
    }
    return value ?? "";
  };

  // helper render dropdown mapping
  const renderMapSelect = (label: string, field: string) => (
    <div className="grid gap-1">
      <Label>{label}</Label>
      <select
        className="border rounded p-2 text-sm"
        value={map[field] || ""}
        onChange={(e) => setMap({ ...map, [field]: e.target.value })}
      >
        <option value="">-- Pilih kolom --</option>
        {headerArray.map((h, i) => (
          <option key={i} value={h}>
            {h}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        if (!e) {
          reset();
          clearErrors();
          setHeader([]);
          setSample([]);
          setToken(null);
          setMap({});
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-2 text-sm font-medium text-white">
          Upload File
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogTitle>Import Penjualan Shopee</DialogTitle>
        <DialogDescription>
          Upload file export Shopee (.xlsx/.csv) untuk di-preview sebelum
          disimpan.
        </DialogDescription>

        {!token ? (
          <form onSubmit={handlePreview} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFile}
                required
              />
              {errors.file && (
                <p className="text-sm text-destructive">
                  {String(errors.file)}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={processing}>
                {processing ? "Processing..." : "Preview"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="grid gap-4">
            <h3 className="text-md font-medium">Mapping Kolom</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderMapSelect("Nomor Pesanan", "order_no")}
              {renderMapSelect("Tanggal Selesai", "completed_at")}
              {renderMapSelect("Jumlah (Gross)", "gross_amount")}
              {renderMapSelect("Biaya Admin", "admin_fee")}
              {renderMapSelect("Ongkir", "shipping_fee")}
              {renderMapSelect("Harga Pokok (Cost)", "product_cost")}
            </div>

            <h3 className="text-md font-medium mt-4">Preview Data</h3>

            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-2">
                <div className="p-2 rounded bg-blue-50">
                  <p className="font-medium">Total Pesanan (sample)</p>
                  <p>{summary.count}</p>
                </div>
                <div className="p-2 rounded bg-green-50">
                  <p className="font-medium">Total Jumlah (sample)</p>
                  <p>Rp {summary.totalJumlah.toLocaleString("id-ID")}</p>
                </div>
                <div className="p-2 rounded bg-yellow-50">
                  <p className="font-medium">Total Ongkir (sample)</p>
                  <p>Rp {summary.totalOngkir.toLocaleString("id-ID")}</p>
                </div>
                <div className="p-2 rounded bg-red-50">
                  <p className="font-medium">Total Biaya Admin (sample)</p>
                  <p>Rp {summary.totalAdmin.toLocaleString("id-ID")}</p>
                </div>
                <div className="p-2 rounded bg-purple-50">
                  <p className="font-medium">Total Harga Pokok (sample)</p>
                  <p>Rp {summary.totalCost.toLocaleString("id-ID")}</p>
                </div>
              </div>
            )}

            <div className="overflow-auto max-h-96 border rounded">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    {headerArray.map((h, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 text-left font-semibold border-b"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sample.map((row, idx) => (
                    <tr
                      key={idx}
                      className="odd:bg-background even:bg-muted/30 hover:bg-accent"
                    >
                      {headerArray.map((h, i) => (
                        <td key={i} className="px-3 py-2 border-b">
                          {renderCell(h, row[i])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleCommit}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? "Saving..." : "✅ Commit & Save"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;

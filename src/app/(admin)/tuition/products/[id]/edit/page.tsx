"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    payment_type: "monthly",
    coa: "",
  });

  useEffect(() => {
    fetch(`/api/tuition/products/${id}`)
      .then((r) => r.json())
      .then((res) => {
        setForm({
          name: res.name,
          payment_type: res.payment_type,
          coa: res.coa || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data produk");
        router.push("/tuition/products");
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/tuition/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Produk biaya berhasil diperbarui");
      router.push("/tuition/products");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui produk biaya");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <>
      <FormHeader 
        title="Edit Produk / Biaya" 
        subtitle={`Mengubah informasi untuk ${form.name}`}
        backHref="/tuition/products"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Nama Produk / Biaya">
            <input 
              className={inputClass} 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </Field>
          
          <Field label="Tipe Pembayaran">
            <select 
              className={inputClass} 
              value={form.payment_type} 
              onChange={(e) => setForm({ ...form, payment_type: e.target.value })}
              required
            >
              <option value="monthly">Bulanan</option>
              <option value="installment">Cicilan</option>
              <option value="one_time">Sekali Bayar</option>
            </select>
          </Field>

          <Field label="Kode Akun (COA)">
            <input 
              className={inputClass} 
              value={form.coa} 
              onChange={(e) => setForm({ ...form, coa: e.target.value })} 
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-[14px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-slate-800 text-white text-[14px] font-bold rounded-2xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </FormContainer>
    </>
  );
}

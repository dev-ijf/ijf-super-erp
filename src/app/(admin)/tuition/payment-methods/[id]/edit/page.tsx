"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    coa: "",
  });

  useEffect(() => {
    fetch(`/api/tuition/payment-methods/${id}`)
      .then((r) => r.json())
      .then((res) => {
        setForm({
          name: res.name,
          code: res.code,
          category: res.category,
          coa: res.coa || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data metode pembayaran");
        router.push("/tuition/payment-methods");
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/tuition/payment-methods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Metode pembayaran berhasil diperbarui");
      router.push("/tuition/payment-methods");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui metode pembayaran");
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
        title="Edit Metode Pembayaran" 
        subtitle={`Mengubah konfigurasi untuk ${form.name}`}
        backHref="/tuition/payment-methods"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Nama Metode Pembayaran">
            <input 
              className={inputClass} 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </Field>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Kode Unik">
              <input 
                className={inputClass} 
                value={form.code} 
                onChange={(e) => setForm({ ...form, code: e.target.value })} 
                required 
              />
            </Field>
            
            <Field label="Kategori">
              <select 
                className={inputClass} 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Pilih Kategori...</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="e_wallet">e-Wallet</option>
                <option value="cash">Tunai (Internal)</option>
                <option value="other">Lainnya</option>
              </select>
            </Field>
          </div>

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

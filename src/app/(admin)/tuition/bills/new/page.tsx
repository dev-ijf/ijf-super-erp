"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function NewBillPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    total_amount: "",
    status: "unpaid",
    student_id: 1, // Mock value, should be from select
    product_id: 1, // Mock value, should be from select
    academic_year_id: 2, // Mock value
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/tuition/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Tagihan berhasil ditambahkan");
      router.push("/tuition/bills");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan tagihan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FormHeader 
        title="Tambah Tagihan Baru" 
        subtitle="Buat tagihan SPP atau biaya lainnya untuk siswa"
        backHref="/tuition/bills"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Judul Tagihan">
            <input 
              className={inputClass} 
              placeholder="Contoh: SPP Oktober 2025" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              required 
            />
          </Field>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Jumlah (Rp)">
              <input 
                type="number" 
                className={inputClass} 
                placeholder="0"
                value={form.total_amount} 
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })} 
                required 
              />
            </Field>
            
            <Field label="Status Awal">
              <select 
                className={inputClass} 
                value={form.status} 
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="unpaid">Belum Bayar</option>
                <option value="partial">Parsial</option>
                <option value="paid">Lunas</option>
              </select>
            </Field>
          </div>

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
              className="px-8 py-3 bg-slate-800 text-white text-[14px] font-bold rounded-2xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm shadow-slate-200"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Tagihan
            </button>
          </div>
        </form>
      </FormContainer>
    </>
  );
}

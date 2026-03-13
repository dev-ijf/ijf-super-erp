"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function NewSchoolPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/core/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Data sekolah berhasil ditambahkan");
      router.push("/core/schools");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan data sekolah");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FormHeader 
        title="Tambah Sekolah Baru" 
        subtitle="Daftarkan instansi sekolah baru ke dalam sistem"
        backHref="/core/schools"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Nama Sekolah">
            <input 
              className={inputClass} 
              placeholder="Contoh: SMA Kreativa" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </Field>
          
          <Field label="Alamat">
            <textarea 
              className={`${inputClass} min-h-[100px] resize-none`}
              placeholder="Alamat lengkap sekolah..."
              value={form.address} 
              onChange={(e) => setForm({ ...form, address: e.target.value })} 
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
              Simpan Data
            </button>
          </div>
        </form>
      </FormContainer>
    </>
  );
}

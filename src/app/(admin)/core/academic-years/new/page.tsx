"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function NewAcademicYearPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    is_active: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/core/academic-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Tahun ajaran berhasil ditambahkan");
      router.push("/core/academic-years");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan tahun ajaran");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FormHeader 
        title="Tambah Tahun Ajaran Baru" 
        subtitle="Buat periode akademik baru dalam sistem"
        backHref="/core/academic-years"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Nama Tahun Ajaran">
            <input 
              className={inputClass} 
              placeholder="Contoh: 2025/2026" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </Field>
          
          <Field label="Status Aktif">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.is_active ? "bg-slate-800 border-slate-800" : "border-slate-200 group-hover:border-slate-300"}`}>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={form.is_active} 
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })} 
                />
                {form.is_active && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in-50 duration-200" />}
              </div>
              <span className="text-[14px] font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                Tandai sebagai tahun ajaran aktif saat ini
              </span>
            </label>
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

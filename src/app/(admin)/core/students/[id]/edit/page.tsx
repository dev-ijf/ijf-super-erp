"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    nis: "",
    nisn: "",
    gender: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetch(`/api/core/students/${id}`)
      .then((r) => r.json())
      .then((res) => {
        setForm({
          full_name: res.full_name,
          nis: res.nis,
          nisn: res.nisn || "",
          gender: res.gender || "",
          phone: res.phone || "",
          email: res.email || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data siswa");
        router.push("/core/students");
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/core/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Data siswa berhasil diperbarui");
      router.push("/core/students");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui data siswa");
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
        title="Edit Profil Siswa" 
        subtitle={`Mengubah informasi identitas ${form.full_name}`}
        backHref="/core/students"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Nama Lengkap">
            <input 
              className={inputClass} 
              value={form.full_name} 
              onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
              required 
            />
          </Field>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="NIS">
              <input 
                className={inputClass} 
                value={form.nis} 
                onChange={(e) => setForm({ ...form, nis: e.target.value })} 
                required 
              />
            </Field>
            
            <Field label="NISN">
              <input 
                className={inputClass} 
                value={form.nisn} 
                onChange={(e) => setForm({ ...form, nisn: e.target.value })} 
              />
            </Field>
          </div>

          <Field label="Jenis Kelamin">
            <select 
              className={inputClass} 
              value={form.gender} 
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              required
            >
              <option value="">Pilih...</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nomor Telepon">
              <input 
                className={inputClass} 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </Field>
            
            <Field label="Alamat Email">
              <input 
                type="email"
                className={inputClass} 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
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

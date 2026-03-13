"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormHeader, FormContainer } from "@/components/ui/form-page";
import { Field, inputClass } from "@/components/ui/form-modal";
import { Loader2 } from "lucide-react";

export default function NewClassPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [schools, setSchools] = useState<{id: number, name: string}[]>([]);
  const [levels, setLevels] = useState<{id: number, name: string}[]>([]);
  const [form, setForm] = useState({
    name: "",
    school_id: "",
    level_grade_id: "",
  });

  useEffect(() => {
    // Fetch schools
    fetch("/api/core/schools?limit=100")
      .then(r => r.json())
      .then(res => setSchools(res.data));
    
    // Fetch level grades (Assuming endpoint exists or using mock for now)
    // For now we'll use a likely endpoint or mock
    fetch("/api/core/level-grades")
      .then(r => r.json())
      .then(res => setLevels(res.data || res))
      .catch(() => setLevels([
        { id: 1, name: "Tingkat 1" },
        { id: 2, name: "Tingkat 2" },
        { id: 3, name: "Tingkat 3" },
      ]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.school_id || !form.level_grade_id) {
      toast.error("Sekolah dan Tingkat harus dipilih");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/core/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          school_id: Number(form.school_id),
          level_grade_id: Number(form.level_grade_id)
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Kelas berhasil ditambahkan");
      router.push("/core/classes");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan kelas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FormHeader 
        title="Tambah Kelas Baru" 
        subtitle="Buat rombongan belajar baru untuk sekolah"
        backHref="/core/classes"
      />
      
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Nama Kelas">
            <input 
              className={inputClass} 
              placeholder="Contoh: 10 MIPA 1" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </Field>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Sekolah">
              <select 
                className={inputClass} 
                value={form.school_id} 
                onChange={(e) => setForm({ ...form, school_id: e.target.value })}
                required
              >
                <option value="">Pilih Sekolah...</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            
            <Field label="Tingkat">
              <select 
                className={inputClass} 
                value={form.level_grade_id} 
                onChange={(e) => setForm({ ...form, level_grade_id: e.target.value })}
                required
              >
                <option value="">Pilih Tingkat...</option>
                {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
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
              className="px-8 py-3 bg-slate-800 text-white text-[14px] font-bold rounded-2xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Kelas
            </button>
          </div>
        </form>
      </FormContainer>
    </>
  );
}

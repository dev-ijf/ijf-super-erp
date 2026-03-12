"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface Student {
  id: number; full_name: string; nis: string; nisn: string | null;
  gender: string | null; phone: string | null; email: string | null;
  school_name: string | null; class_name: string | null; level_name: string | null;
}

const COLUMNS: Column<Student>[] = [
  { key: "nis", label: "NIS", render: (r) => <span className="text-[13px] font-mono text-slate-400 font-medium">{r.nis}</span> },
  { key: "full_name", label: "Nama Lengkap", render: (r) => (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-semibold text-sm">{r.full_name.charAt(0)}</div>
      <div>
        <p className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.full_name}</p>
        {r.nisn && <p className="text-[11px] text-slate-400 mt-0.5">NISN: {r.nisn}</p>}
      </div>
    </div>
  )},
  { key: "class_name", label: "Kelas", render: (r) => r.class_name ? <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[12px] font-semibold rounded-lg">{r.class_name}</span> : <span className="text-slate-300">—</span> },
  { key: "school_name", label: "Sekolah", render: (r) => <span className="text-[14px] text-slate-500">{r.school_name || "—"}</span> },
  { key: "gender", label: "JK", render: (r) => (
    <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg ${r.gender === "L" ? "bg-sky-50 text-sky-600" : r.gender === "P" ? "bg-pink-50 text-pink-600" : "bg-slate-50 text-slate-400"}`}>
      {r.gender === "L" ? "Laki-laki" : r.gender === "P" ? "Perempuan" : "—"}
    </span>
  )},
];

export default function StudentsPage() {
  const [data, setData] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", nis: "", nisn: "", gender: "", phone: "", email: "" });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/core/students?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ full_name: "", nis: "", nisn: "", gender: "", phone: "", email: "" }); setModalOpen(true); };
  const openEdit = (r: Student) => { setEditing(r); setForm({ full_name: r.full_name, nis: r.nis, nisn: r.nisn || "", gender: r.gender || "", phone: r.phone || "", email: r.email || "" }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/core/students/${editing.id}` : "/api/core/students";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, school_id: 1 }) });
    toast.success(editing ? "Data siswa diperbarui" : "Siswa berhasil ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/core/students/${deleting.id}`, { method: "DELETE" });
    toast.success("Siswa berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Buku Induk Siswa</h2>
          <p className="text-[14px] text-slate-400">Data lengkap seluruh siswa di bawah yayasan</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah Siswa
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable columns={COLUMNS} data={data} pagination={pagination} loading={loading} onPageChange={fetchData} onEdit={openEdit} onDelete={(r) => setDeleting(r)} rowKey={(r) => r.id} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Siswa" : "Tambah Siswa"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Nama Lengkap"><input className={inputClass} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="NIS"><input className={inputClass} value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} required /></Field>
          <Field label="NISN"><input className={inputClass} value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} /></Field>
        </div>
        <Field label="Jenis Kelamin">
          <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">Pilih...</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telepon"><input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Email"><input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        </div>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.full_name ?? ""} />
    </>
  );
}

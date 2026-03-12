"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface ClassRow { id: number; name: string; school_name: string | null; level_name: string | null; }

const COLUMNS: Column<ClassRow>[] = [
  { key: "id", label: "ID", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.id}</span> },
  { key: "name", label: "Nama Kelas", render: (r) => <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.name}</span> },
  { key: "level_name", label: "Tingkat", render: (r) => <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[12px] font-semibold rounded-lg">{r.level_name || "—"}</span> },
  { key: "school_name", label: "Sekolah", render: (r) => <span className="text-[14px] text-slate-500">{r.school_name || "—"}</span> },
];

export default function ClassesPage() {
  const [data, setData] = useState<ClassRow[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const [deleting, setDeleting] = useState<ClassRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", school_id: 1, level_grade_id: 1 });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/core/classes?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ name: "", school_id: 1, level_grade_id: 1 }); setModalOpen(true); };
  const openEdit = (r: ClassRow) => { setEditing(r); setForm({ name: r.name, school_id: 1, level_grade_id: 1 }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/core/classes/${editing.id}` : "/api/core/classes";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success(editing ? "Kelas diperbarui" : "Kelas berhasil ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/core/classes/${deleting.id}`, { method: "DELETE" });
    toast.success("Kelas berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Data Kelas</h2>
          <p className="text-[14px] text-slate-400">Daftar kelas per sekolah dan tingkat</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah Kelas
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable columns={COLUMNS} data={data} pagination={pagination} loading={loading} onPageChange={fetchData} onEdit={openEdit} onDelete={(r) => setDeleting(r)} rowKey={(r) => r.id} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Kelas" : "Tambah Kelas"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Nama Kelas"><input className={inputClass} placeholder="Contoh: 11 IPA 1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

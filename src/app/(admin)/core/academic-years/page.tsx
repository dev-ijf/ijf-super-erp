"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface AcademicYear { id: number; name: string; is_active: boolean; }

const COLUMNS: Column<AcademicYear>[] = [
  { key: "id", label: "ID", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.id}</span> },
  { key: "name", label: "Tahun Ajaran", render: (r) => <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.name}</span> },
  { key: "is_active", label: "Status", render: (r) => (
    <span className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl tracking-widest ${r.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
      {r.is_active ? "Aktif" : "Nonaktif"}
    </span>
  )},
];

export default function AcademicYearsPage() {
  const [data, setData] = useState<AcademicYear[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicYear | null>(null);
  const [deleting, setDeleting] = useState<AcademicYear | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", is_active: false });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/core/academic-years?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ name: "", is_active: false }); setModalOpen(true); };
  const openEdit = (r: AcademicYear) => { setEditing(r); setForm({ name: r.name, is_active: r.is_active }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/core/academic-years/${editing.id}` : "/api/core/academic-years";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success(editing ? "Data berhasil diperbarui" : "Data berhasil ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/core/academic-years/${deleting.id}`, { method: "DELETE" });
    toast.success("Data berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Tahun Ajaran</h2>
          <p className="text-[14px] text-slate-400">Kelola periode tahun ajaran akademik</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable columns={COLUMNS} data={data} pagination={pagination} loading={loading} onPageChange={fetchData} onEdit={openEdit} onDelete={(r) => setDeleting(r)} rowKey={(r) => r.id} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Nama Tahun Ajaran">
          <input className={inputClass} placeholder="Contoh: 2025/2026" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Status Aktif">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
            <span className="text-[14px] text-slate-600">Tandai sebagai tahun ajaran aktif</span>
          </label>
        </Field>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { School, MapPin, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface SchoolRow {
  id: number;
  name: string;
  address: string | null;
}

const COLUMNS: Column<SchoolRow>[] = [
  {
    key: "id",
    label: "ID",
    render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.id}</span>,
  },
  {
    key: "name",
    label: "Nama Sekolah",
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><School size={16} /></div>
        <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.name}</span>
      </div>
    ),
  },
  {
    key: "address",
    label: "Alamat",
    render: (r) => (
      <div className="flex items-center gap-2 text-slate-400">
        <MapPin size={14} />
        <span className="text-[14px]">{r.address || "—"}</span>
      </div>
    ),
  },
];

export default function SchoolsPage() {
  const [data, setData] = useState<SchoolRow[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolRow | null>(null);
  const [deleting, setDeleting] = useState<SchoolRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", address: "" });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/core/schools?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ name: "", address: "" }); setModalOpen(true); };
  const openEdit = (r: SchoolRow) => { setEditing(r); setForm({ name: r.name, address: r.address || "" }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/core/schools/${editing.id}` : "/api/core/schools";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success(editing ? "Data berhasil diperbarui" : "Data berhasil ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    await fetch(`/api/core/schools/${deleting.id}`, { method: "DELETE" });
    toast.success("Data berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Data Sekolah</h2>
          <p className="text-[14px] text-slate-400">Kelola daftar sekolah di bawah yayasan</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah Sekolah
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          data={data}
          pagination={pagination}
          loading={loading}
          onPageChange={fetchData}
          onEdit={openEdit}
          onDelete={(r) => setDeleting(r)}
          rowKey={(r) => r.id}
        />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Sekolah" : "Tambah Sekolah"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Nama Sekolah">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Alamat">
          <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </Field>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface PaymentMethod { id: number; name: string; code: string; category: string; coa: string | null; is_active: boolean; }

const COLUMNS: Column<PaymentMethod>[] = [
  { key: "id", label: "ID", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.id}</span> },
  { key: "name", label: "Nama", render: (r) => <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.name}</span> },
  { key: "code", label: "Kode", render: (r) => <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-mono font-bold rounded-lg">{r.code}</span> },
  { key: "category", label: "Kategori", render: (r) => <span className="text-[14px] text-slate-500">{r.category}</span> },
  { key: "coa", label: "COA", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.coa || "—"}</span> },
  { key: "is_active", label: "Status", render: (r) => (
    <span className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl tracking-widest ${r.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
      {r.is_active ? "Aktif" : "Nonaktif"}
    </span>
  )},
];

export default function PaymentMethodsPage() {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [deleting, setDeleting] = useState<PaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", category: "", coa: "" });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/tuition/payment-methods?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ name: "", code: "", category: "", coa: "" }); setModalOpen(true); };
  const openEdit = (r: PaymentMethod) => { setEditing(r); setForm({ name: r.name, code: r.code, category: r.category, coa: r.coa || "" }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/tuition/payment-methods/${editing.id}` : "/api/tuition/payment-methods";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success(editing ? "Metode pembayaran diperbarui" : "Metode pembayaran ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/tuition/payment-methods/${deleting.id}`, { method: "DELETE" });
    toast.success("Metode pembayaran dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Metode Pembayaran</h2>
          <p className="text-[14px] text-slate-400">Daftar metode pembayaran yang tersedia</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah Metode
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable columns={COLUMNS} data={data} pagination={pagination} loading={loading} onPageChange={fetchData} onEdit={openEdit} onDelete={(r) => setDeleting(r)} rowKey={(r) => r.id} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Metode" : "Tambah Metode"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Nama"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kode"><input className={inputClass} placeholder="GOPAY" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></Field>
          <Field label="Kategori"><input className={inputClass} placeholder="e-Wallet" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></Field>
        </div>
        <Field label="COA"><input className={inputClass} value={form.coa} onChange={(e) => setForm({ ...form, coa: e.target.value })} /></Field>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

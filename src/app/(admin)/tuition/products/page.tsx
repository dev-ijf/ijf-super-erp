"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface Product { id: number; name: string; payment_type: string; coa: string | null; school_name: string | null; }

const TYPE_MAP: Record<string, { label: string; cls: string }> = {
  monthly: { label: "Bulanan", cls: "bg-blue-50 text-blue-600" },
  installment: { label: "Cicilan", cls: "bg-amber-50 text-amber-600" },
  one_time: { label: "Sekali Bayar", cls: "bg-emerald-50 text-emerald-600" },
};

const COLUMNS: Column<Product>[] = [
  { key: "id", label: "ID", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.id}</span> },
  { key: "name", label: "Nama Produk", render: (r) => <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.name}</span> },
  { key: "payment_type", label: "Tipe", render: (r) => { const t = TYPE_MAP[r.payment_type] ?? { label: r.payment_type, cls: "bg-slate-50 text-slate-400" }; return <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg ${t.cls}`}>{t.label}</span>; }},
  { key: "coa", label: "COA", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.coa || "—"}</span> },
  { key: "school_name", label: "Sekolah", render: (r) => <span className="text-[14px] text-slate-500">{r.school_name || "—"}</span> },
];

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", payment_type: "monthly", coa: "", school_id: 1 });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/tuition/products?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ name: "", payment_type: "monthly", coa: "", school_id: 1 }); setModalOpen(true); };
  const openEdit = (r: Product) => { setEditing(r); setForm({ name: r.name, payment_type: r.payment_type, coa: r.coa || "", school_id: 1 }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/tuition/products/${editing.id}` : "/api/tuition/products";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success(editing ? "Produk diperbarui" : "Produk berhasil ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/tuition/products/${deleting.id}`, { method: "DELETE" });
    toast.success("Produk berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Produk / Biaya</h2>
          <p className="text-[14px] text-slate-400">Jenis biaya yang ditagihkan kepada siswa</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable columns={COLUMNS} data={data} pagination={pagination} loading={loading} onPageChange={fetchData} onEdit={openEdit} onDelete={(r) => setDeleting(r)} rowKey={(r) => r.id} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Produk" : "Tambah Produk"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Nama Produk"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <Field label="Tipe Pembayaran">
          <select className={inputClass} value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value })}>
            <option value="monthly">Bulanan</option>
            <option value="installment">Cicilan</option>
            <option value="one_time">Sekali Bayar</option>
          </select>
        </Field>
        <Field label="COA"><input className={inputClass} placeholder="Contoh: 4101.01.000" value={form.coa} onChange={(e) => setForm({ ...form, coa: e.target.value })} /></Field>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

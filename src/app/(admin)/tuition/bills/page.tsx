"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { FormModal, DeleteConfirm, Field, inputClass } from "@/components/ui/form-modal";

interface Bill {
  id: number; title: string; total_amount: string; paid_amount: string; status: string;
  student_name: string | null; nis: string | null; product_name: string | null;
}

function formatRp(val: string | number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(val));
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  paid: { label: "Lunas", cls: "bg-emerald-50 text-emerald-600" },
  unpaid: { label: "Belum Bayar", cls: "bg-red-50 text-red-500" },
  partial: { label: "Parsial", cls: "bg-blue-50 text-blue-600" },
};

const COLUMNS: Column<Bill>[] = [
  { key: "student_name", label: "Siswa", render: (r) => (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold text-sm">{r.student_name?.charAt(0) ?? "?"}</div>
      <div>
        <p className="text-[14px] font-semibold text-slate-700 tracking-tight">{r.student_name}</p>
        <p className="text-[11px] text-slate-400">{r.nis}</p>
      </div>
    </div>
  )},
  { key: "title", label: "Tagihan", render: (r) => (
    <div>
      <p className="text-[14px] font-semibold text-slate-700 tracking-tight">{r.title}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{r.product_name}</p>
    </div>
  )},
  { key: "total_amount", label: "Jumlah", render: (r) => <span className="text-[14px] font-semibold text-slate-700">{formatRp(r.total_amount)}</span> },
  { key: "paid_amount", label: "Terbayar", render: (r) => <span className="text-[14px] text-slate-500">{formatRp(r.paid_amount)}</span> },
  { key: "status", label: "Status", render: (r) => { const s = STATUS_MAP[r.status] ?? { label: r.status, cls: "bg-slate-50 text-slate-400" }; return <span className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl tracking-widest ${s.cls}`}>{s.label}</span>; }},
];

export default function BillsPage() {
  const [data, setData] = useState<Bill[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);
  const [deleting, setDeleting] = useState<Bill | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", total_amount: "", status: "unpaid", student_id: 1, product_id: 1, academic_year_id: 2 });

  const fetchData = useCallback((page: number) => {
    setLoading(true);
    fetch(`/api/tuition/bills?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ title: "", total_amount: "", status: "unpaid", student_id: 1, product_id: 1, academic_year_id: 2 }); setModalOpen(true); };
  const openEdit = (r: Bill) => { setEditing(r); setForm({ title: r.title, total_amount: String(r.total_amount), status: r.status, student_id: 1, product_id: 1, academic_year_id: 2 }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/tuition/bills/${editing.id}` : "/api/tuition/bills";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success(editing ? "Tagihan diperbarui" : "Tagihan berhasil ditambahkan");
    setSaving(false); setModalOpen(false); fetchData(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/tuition/bills/${deleting.id}`, { method: "DELETE" });
    toast.success("Tagihan berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-1">Tagihan SPP</h2>
          <p className="text-[14px] text-slate-400">Monitor seluruh tagihan siswa dan status pembayaran</p>
        </div>
        <button onClick={openCreate} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Tambah Tagihan
        </button>
      </div>

      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable columns={COLUMNS} data={data} pagination={pagination} loading={loading} onPageChange={fetchData} onEdit={openEdit} onDelete={(r) => setDeleting(r)} rowKey={(r) => r.id} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Tagihan" : "Tambah Tagihan"} onSubmit={handleSubmit} loading={saving}>
        <Field label="Judul Tagihan"><input className={inputClass} placeholder="SPP Oktober 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
        <Field label="Jumlah (Rp)"><input type="number" className={inputClass} value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} required /></Field>
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="unpaid">Belum Bayar</option>
            <option value="partial">Parsial</option>
            <option value="paid">Lunas</option>
          </select>
        </Field>
      </FormModal>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.title ?? ""} />
    </>
  );
}

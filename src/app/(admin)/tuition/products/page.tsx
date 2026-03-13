"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { DeleteConfirm } from "@/components/ui/form-modal";

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
  const router = useRouter();
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/tuition/products?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/tuition/products/${deleting.id}`, { method: "DELETE" });
    toast.success("Produk berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Produk / Biaya</h2>
          <p className="text-[14px] text-slate-400 font-medium tracking-tight">Jenis biaya yang ditagihkan kepada siswa</p>
        </div>
        <Link 
          href="/tuition/products/new" 
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all"
        >
          <PlusCircle size={16} /> Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable 
          columns={COLUMNS} 
          data={data} 
          pagination={pagination} 
          loading={loading} 
          onPageChange={(page) => fetchData(page)} 
          onLimitChange={(limit) => fetchData(1, limit)}
          onEdit={(r) => router.push(`/tuition/products/${r.id}/edit`)} 
          onDelete={(r) => setDeleting(r)} 
          rowKey={(r) => r.id} 
        />
      </div>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

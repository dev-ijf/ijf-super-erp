"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { DeleteConfirm } from "@/components/ui/form-modal";

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
  const router = useRouter();
  const [data, setData] = useState<Bill[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Bill | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/tuition/bills?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        setPagination({
          page: res.page,
          limit: res.limit,
          total: res.total,
          totalPages: res.totalPages,
        });
      })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/tuition/bills/${deleting.id}`, { method: "DELETE" });
    toast.success("Tagihan berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Tagihan SPP</h2>
          <p className="text-[14px] text-slate-400 font-medium tracking-tight">Monitor seluruh tagihan siswa dan status pembayaran</p>
        </div>
        <Link 
          href="/tuition/bills/new" 
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all"
        >
          <PlusCircle size={16} /> Tambah Tagihan
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
          onEdit={(r) => router.push(`/tuition/bills/${r.id}/edit`)} 
          onDelete={(r) => setDeleting(r)} 
          rowKey={(r) => r.id} 
        />
      </div>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.title ?? ""} />
    </>
  );
}

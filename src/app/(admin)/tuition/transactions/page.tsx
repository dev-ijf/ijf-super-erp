"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";

interface Transaction {
  id: number; reference_no: string; total_amount: string; status: string;
  payment_date: string | null; user_name: string | null; payment_method_name: string | null;
}

function formatRp(val: string | number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(val));
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  success: { label: "Sukses", cls: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Menunggu", cls: "bg-amber-50 text-amber-600" },
  failed: { label: "Gagal", cls: "bg-red-50 text-red-500" },
};

const COLUMNS: Column<Transaction>[] = [
  { key: "reference_no", label: "Referensi", render: (r) => <span className="text-[13px] font-mono text-slate-400 font-medium tracking-tighter">{r.reference_no}</span> },
  { key: "user_name", label: "Pembayar", render: (r) => <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.user_name || "—"}</span> },
  { key: "total_amount", label: "Jumlah", render: (r) => <span className="text-[14px] font-semibold text-slate-700">{formatRp(r.total_amount)}</span> },
  { key: "payment_method_name", label: "Metode", render: (r) => r.payment_method_name ? <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">{r.payment_method_name}</span> : <span className="text-slate-300">—</span> },
  { key: "payment_date", label: "Tanggal", render: (r) => <span className="text-[13px] text-slate-400">{formatDate(r.payment_date)}</span> },
  { key: "status", label: "Status", render: (r) => { const s = STATUS_MAP[r.status] ?? { label: r.status, cls: "bg-slate-50 text-slate-400" }; return <span className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl tracking-widest ${s.cls}`}>{s.label}</span>; }},
];

export default function TransactionsPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/tuition/transactions?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  return (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Transaksi Pembayaran</h2>
        <p className="text-[14px] text-slate-400 font-medium tracking-tight">Riwayat seluruh transaksi pembayaran siswa</p>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/50 overflow-hidden">
        <DataTable 
          columns={COLUMNS} 
          data={data} 
          pagination={pagination} 
          loading={loading} 
          onPageChange={(page) => fetchData(page)} 
          onLimitChange={(limit) => fetchData(1, limit)}
          rowKey={(r) => r.id} 
        />
      </div>
    </>
  );
}

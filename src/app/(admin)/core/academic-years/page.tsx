"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { DeleteConfirm } from "@/components/ui/form-modal";

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
  const router = useRouter();
  const [data, setData] = useState<AcademicYear[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<AcademicYear | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/core/academic-years?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/core/academic-years/${deleting.id}`, { method: "DELETE" });
    toast.success("Data berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Tahun Ajaran</h2>
          <p className="text-[14px] text-slate-400 font-medium tracking-tight">Kelola periode tahun ajaran akademik</p>
        </div>
        <Link 
          href="/core/academic-years/new" 
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all"
        >
          <PlusCircle size={16} /> Tambah Tahun Ajaran
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
          onEdit={(r) => router.push(`/core/academic-years/${r.id}/edit`)} 
          onDelete={(r) => setDeleting(r)} 
          rowKey={(r) => r.id} 
        />
      </div>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

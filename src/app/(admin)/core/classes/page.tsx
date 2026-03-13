"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { DeleteConfirm } from "@/components/ui/form-modal";

interface ClassRow { id: number; name: string; school_name: string | null; level_name: string | null; }

const COLUMNS: Column<ClassRow>[] = [
  { key: "id", label: "ID", render: (r) => <span className="text-[13px] font-mono text-slate-400">{r.id}</span> },
  { key: "name", label: "Nama Kelas", render: (r) => <span className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.name}</span> },
  { key: "level_name", label: "Tingkat", render: (r) => <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[12px] font-semibold rounded-lg">{r.level_name || "—"}</span> },
  { key: "school_name", label: "Sekolah", render: (r) => <span className="text-[14px] text-slate-500">{r.school_name || "—"}</span> },
];

export default function ClassesPage() {
  const router = useRouter();
  const [data, setData] = useState<ClassRow[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<ClassRow | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/core/classes?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/core/classes/${deleting.id}`, { method: "DELETE" });
    toast.success("Kelas berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Data Kelas</h2>
          <p className="text-[14px] text-slate-400 font-medium tracking-tight">Daftar kelas per sekolah dan tingkat</p>
        </div>
        <Link 
          href="/core/classes/new" 
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all"
        >
          <PlusCircle size={16} /> Tambah Kelas
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
          onEdit={(r) => router.push(`/core/classes/${r.id}/edit`)} 
          onDelete={(r) => setDeleting(r)} 
          rowKey={(r) => r.id} 
        />
      </div>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

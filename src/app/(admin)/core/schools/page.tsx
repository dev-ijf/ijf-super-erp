"use client";

import { useEffect, useState, useCallback } from "react";
import { School, MapPin, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { DeleteConfirm } from "@/components/ui/form-modal";

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
  const router = useRouter();
  const [data, setData] = useState<SchoolRow[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<SchoolRow | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/core/schools?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    await fetch(`/api/core/schools/${deleting.id}`, { method: "DELETE" });
    toast.success("Data berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Data Sekolah</h2>
          <p className="text-[14px] text-slate-400 font-medium tracking-tight">Kelola daftar sekolah di bawah yayasan</p>
        </div>
        <Link 
          href="/core/schools/new" 
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all"
        >
          <PlusCircle size={16} /> Tambah Sekolah
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
          onEdit={(r) => router.push(`/core/schools/${r.id}/edit`)}
          onDelete={(r) => setDeleting(r)}
          rowKey={(r) => r.id}
        />
      </div>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.name ?? ""} />
    </>
  );
}

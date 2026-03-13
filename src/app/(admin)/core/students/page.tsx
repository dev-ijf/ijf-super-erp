"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type Column, type PaginationInfo } from "@/components/ui/data-table";
import { DeleteConfirm } from "@/components/ui/form-modal";

interface Student {
  id: number; full_name: string; nis: string; nisn: string | null;
  gender: string | null; phone: string | null; email: string | null;
  school_name: string | null; class_name: string | null; level_name: string | null;
}

const COLUMNS: Column<Student>[] = [
  { key: "nis", label: "NIS", render: (r) => <span className="text-[13px] font-mono text-slate-400 font-medium">{r.nis}</span> },
  { key: "full_name", label: "Nama Lengkap", render: (r) => (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-semibold text-sm">{r.full_name.charAt(0)}</div>
      <div>
        <p className="text-[15px] font-semibold text-slate-700 tracking-tight">{r.full_name}</p>
        {r.nisn && <p className="text-[11px] text-slate-400 mt-0.5">NISN: {r.nisn}</p>}
      </div>
    </div>
  )},
  { key: "class_name", label: "Kelas", render: (r) => r.class_name ? <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[12px] font-semibold rounded-lg">{r.class_name}</span> : <span className="text-slate-300">—</span> },
  { key: "school_name", label: "Sekolah", render: (r) => <span className="text-[14px] text-slate-500">{r.school_name || "—"}</span> },
  { key: "gender", label: "JK", render: (r) => (
    <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg ${r.gender === "L" ? "bg-sky-50 text-sky-600" : r.gender === "P" ? "bg-pink-50 text-pink-600" : "bg-slate-50 text-slate-400"}`}>
      {r.gender === "L" ? "Laki-laki" : r.gender === "P" ? "Perempuan" : "—"}
    </span>
  )},
];

export default function StudentsPage() {
  const router = useRouter();
  const [data, setData] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback((page: number, limit: number = pagination.limit) => {
    setLoading(true);
    fetch(`/api/core/students?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data); setPagination({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages }); })
      .finally(() => setLoading(false));
  }, [pagination.limit]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleting) return; setSaving(true);
    await fetch(`/api/core/students/${deleting.id}`, { method: "DELETE" });
    toast.success("Siswa berhasil dihapus");
    setSaving(false); setDeleting(null); fetchData(pagination.page);
  };

  return (
    <>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Buku Induk Siswa</h2>
          <p className="text-[14px] text-slate-400 font-medium tracking-tight">Data lengkap seluruh siswa di bawah yayasan</p>
        </div>
        <Link 
          href="/core/students/new" 
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-700 shadow-sm transition-all"
        >
          <PlusCircle size={16} /> Tambah Siswa
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
          onEdit={(r) => router.push(`/core/students/${r.id}/edit`)} 
          onDelete={(r) => setDeleting(r)} 
          rowKey={(r) => r.id} 
        />
      </div>

      <DeleteConfirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving} itemName={deleting?.full_name ?? ""} />
    </>
  );
}

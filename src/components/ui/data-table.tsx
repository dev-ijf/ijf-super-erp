"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Trash2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────
export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowKey: (row: T) => string | number;
}

// ─── Component ──────────────────────────────────
export function DataTable<T>({
  columns,
  data,
  pagination,
  loading,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  rowKey,
}: DataTableProps<T>) {
  const hasActions = !!onEdit || !!onDelete;

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-wide text-right">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-8 py-16 text-center text-slate-400 text-[14px]"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-8 py-5 text-[14px] text-slate-600">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-transparent hover:border-red-600 shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-8 py-5 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="text-[13px] text-slate-400 font-medium whitespace-nowrap">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
            </span>
            –
            <span className="font-bold text-slate-700">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">
              {pagination.total}
            </span>{" "}
            data
          </p>

          {onLimitChange && (
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4 ml-2">
              <span className="text-[13px] text-slate-400 font-medium">Baris:</span>
              <select 
                className="bg-slate-50 border-none text-[13px] font-bold text-slate-600 rounded-lg py-1 px-2 cursor-pointer outline-none focus:ring-1 focus:ring-slate-200"
                value={pagination.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
              >
                {[10, 20, 50, 100].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.page <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman Pertama"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all mr-1"
            title="Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === pagination.totalPages ||
                Math.abs(p - pagination.page) <= 1
            )
            .reduce<(number | "dots")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                acc.push("dots");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "dots" ? (
                <span key={`d${i}`} className="w-9 h-9 flex items-center justify-center text-slate-300 font-bold">
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all ${
                    p === pagination.page
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700 border border-transparent hover:border-slate-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-1"
            title="Berikutnya"
          >
            <ChevronRight size={16} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.page >= pagination.totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman Terakhir"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

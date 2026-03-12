"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
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
  onEdit,
  onDelete,
  rowKey,
}: DataTableProps<T>) {
  const hasActions = !!onEdit || !!onDelete;

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
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
                    <td key={col.key} className="px-8 py-5">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
      <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-between">
        <p className="text-[13px] text-slate-400">
          Menampilkan{" "}
          <span className="font-semibold text-slate-600">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>
          –
          <span className="font-semibold text-slate-600">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-slate-600">
            {pagination.total}
          </span>{" "}
          data
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                <span key={`d${i}`} className="px-1 text-slate-300">
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 rounded-xl text-[13px] font-semibold transition-all ${
                    p === pagination.page
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

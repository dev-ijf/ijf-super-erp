"use client";

import React, { type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
  children: React.ReactNode;
}

export function FormModal({
  open,
  onClose,
  title,
  onSubmit,
  loading,
  children,
}: FormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[28px] shadow-2xl border border-slate-100 w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <h3 className="text-lg font-semibold text-slate-800 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[13px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-800 text-white text-[13px] font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Reusable Form Field ────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Styled input ───────────────────────────────
export const inputClass =
  "w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 text-[14px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-200 focus:shadow-sm transition-all";

// ─── Delete confirmation ────────────────────────
interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  itemName: string;
}

export function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  loading,
  itemName,
}: DeleteConfirmProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[28px] shadow-2xl border border-slate-100 w-full max-w-sm mx-4 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <X size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Hapus Data?
        </h3>
        <p className="text-[14px] text-slate-400 mb-6">
          Yakin ingin menghapus <strong className="text-slate-600">{itemName}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 text-white text-[13px] font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

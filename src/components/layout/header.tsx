"use client";

import { Menu, Search, Bell } from "lucide-react";
import type { ModuleDefinition } from "@/components/layout/module-config";

interface HeaderProps {
  pageTitle: string;
  activeModule: ModuleDefinition;
  onToggleSidebar: () => void;
}

export function Header({
  pageTitle,
  activeModule,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight leading-none mb-1.5">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${activeModule.color}`}
            />
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.15em]">
              {activeModule.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative group hidden md:block">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-400 transition-colors"
            size={16}
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Cari data..."
            className="bg-slate-50/50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-5 text-[14px] focus:outline-none focus:bg-white focus:border-slate-200 focus:shadow-sm transition-all w-64 placeholder:text-slate-300"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}

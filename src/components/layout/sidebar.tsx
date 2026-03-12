"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, LogOut } from "lucide-react";
import {
  MODULES,
  MENUS,
  type ModuleDefinition,
} from "@/components/layout/module-config";

interface SidebarProps {
  isOpen: boolean;
  activeModule: ModuleDefinition;
  onModuleChange: (mod: ModuleDefinition) => void;
}

export function Sidebar({ isOpen, activeModule, onModuleChange }: SidebarProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const pathname = usePathname();
  const currentMenus = MENUS[activeModule.id] ?? [];

  const switchModule = (mod: ModuleDefinition) => {
    onModuleChange(mod);
    setIsSwitcherOpen(false);
  };

  return (
    <aside
      className={`${isOpen ? "w-72" : "w-20"} ${activeModule.color} text-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 shadow-2xl shadow-indigo-900/10 shrink-0`}
    >
      {/* Logo */}
      <div className={`${isOpen ? "p-8" : "p-5"} flex items-center gap-3.5`}>
        <div className="w-10 h-10 bg-white/15 backdrop-blur-xl rounded-[14px] flex items-center justify-center text-white shrink-0 border border-white/20 shadow-sm">
          <GraduationCap size={22} strokeWidth={1.5} />
        </div>
        {isOpen && (
          <div className="flex flex-col">
            <span className="font-semibold text-[22px] tracking-tight leading-none italic">
              Kreativa
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] opacity-50 mt-1">
              GLOBAL SCHOOL
            </span>
          </div>
        )}
      </div>

      {/* Module Switcher */}
      <div className={`${isOpen ? "px-6" : "px-3"} mb-8`}>
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border bg-white/10 border-white/5 hover:bg-white/15 cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="p-2 bg-white rounded-xl text-slate-600 shadow-md shrink-0">
                <activeModule.icon size={16} />
              </div>
              {isOpen && (
                <div className="text-left overflow-hidden">
                  <p className="text-[10px] uppercase font-bold opacity-40 leading-none mb-1 tracking-widest">
                    Layanan
                  </p>
                  <p className="text-[15px] font-semibold truncate tracking-tight">
                    {activeModule.name}
                  </p>
                </div>
              )}
            </div>
            {isOpen && (
              <ChevronDown
                size={14}
                className={`opacity-40 transition-transform duration-300 ${isSwitcherOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {/* Dropdown */}
          {isSwitcherOpen && (
            <div className="absolute left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 p-2.5">
              <p className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1.5">
                Ganti Modul Aplikasi
              </p>
              {MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => switchModule(mod)}
                  className={`w-full flex items-center gap-4 p-3 rounded-[16px] mb-1 transition-all ${
                    activeModule.id === mod.id
                      ? "bg-slate-50 text-slate-800 font-semibold"
                      : "hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <div
                    className={`p-2 ${mod.color} text-white rounded-xl shadow-sm scale-90`}
                  >
                    <mod.icon size={18} />
                  </div>
                  <span className="text-[14px] tracking-tight">{mod.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menus */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {currentMenus.map((menu) => {
          const isActive =
            pathname === menu.href ||
            (menu.href !== "/" && pathname.startsWith(menu.href));
          const Icon = menu.icon;
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive
                  ? "bg-white text-slate-800 shadow-lg shadow-black/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className={`shrink-0 transition-all ${isActive ? "scale-110" : "opacity-80 group-hover:opacity-100"}`}
              >
                <Icon size={18} />
              </span>
              {isOpen && (
                <span
                  className={`text-[15px] tracking-tight ${isActive ? "font-semibold" : "font-normal"}`}
                >
                  {menu.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className={`${isOpen ? "p-6" : "p-3"}`}>
        <div
          className={`bg-black/10 rounded-[24px] p-3.5 flex items-center shadow-inner ${isOpen ? "gap-4" : "justify-center"}`}
        >
          <div className="w-10 h-10 rounded-[16px] bg-white flex items-center justify-center text-slate-600 font-semibold shadow-sm text-sm shrink-0">
            S
          </div>
          {isOpen && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-[14px] font-semibold truncate tracking-tight text-white/95">
                  Superadmin
                </p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">
                  superadmin
                </p>
              </div>
              <LogOut
                size={14}
                className="text-white/20 cursor-pointer hover:text-white transition-colors"
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

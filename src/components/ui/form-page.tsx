"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export function FormHeader({ title, subtitle, backHref }: FormHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-300 rounded-xl transition-all shadow-sm group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[14px] text-slate-400 mt-0.5 font-medium tracking-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100/50 p-8 lg:p-10">
        {children}
      </div>
    </div>
  );
}

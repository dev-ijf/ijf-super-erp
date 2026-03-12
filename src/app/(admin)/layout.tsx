"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MODULES, MENUS, type ModuleDefinition } from "@/components/layout/module-config";

function getPageTitle(pathname: string, moduleId: string): string {
  const menus = MENUS[moduleId] ?? [];
  const match = menus.find(
    (m) => m.href === pathname || (m.href !== "/" && pathname.startsWith(m.href))
  );
  return match?.name ?? "Dashboard";
}

function detectModule(pathname: string): ModuleDefinition {
  if (pathname.startsWith("/tuition")) return MODULES[1];
  return MODULES[0]; // default core
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<ModuleDefinition>(() =>
    detectModule(pathname)
  );

  const pageTitle = getPageTitle(pathname, activeModule.id);

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-600 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          pageTitle={pageTitle}
          activeModule={activeModule}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 p-8 lg:p-10 overflow-y-auto bg-[#FAFBFC]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

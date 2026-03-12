import {
  LayoutDashboard,
  School,
  Calendar,
  Users,
  GraduationCap,
  Banknote,
  Wallet,
  CreditCard,
  Receipt,
  type LucideIcon,
} from "lucide-react";

export interface ModuleDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  activeColor: string;
}

export interface MenuItemDefinition {
  name: string;
  href: string;
  icon: LucideIcon;
}

// ─── Modules ─────────────────────────────────────
export const MODULES: ModuleDefinition[] = [
  {
    id: "core",
    name: "Master Data",
    icon: GraduationCap,
    color: "bg-[#1E40AF]",
    hoverColor: "hover:bg-[#1D4ED8]",
    activeColor: "bg-[#2563EB]",
  },
  {
    id: "tuition",
    name: "Keuangan SPP",
    icon: Banknote,
    color: "bg-[#065F46]",
    hoverColor: "hover:bg-[#047857]",
    activeColor: "bg-[#059669]",
  },
];

// ─── Menus per module ────────────────────────────
export const MENUS: Record<string, MenuItemDefinition[]> = {
  core: [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Sekolah", href: "/core/schools", icon: School },
    { name: "Tahun Ajaran", href: "/core/academic-years", icon: Calendar },
    { name: "Buku Induk Siswa", href: "/core/students", icon: Users },
    { name: "Data Kelas", href: "/core/classes", icon: GraduationCap },
  ],
  tuition: [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Produk / Biaya", href: "/tuition/products", icon: Wallet },
    { name: "Metode Bayar", href: "/tuition/payment-methods", icon: CreditCard },
    { name: "Tagihan SPP", href: "/tuition/bills", icon: Receipt },
    { name: "Transaksi", href: "/tuition/transactions", icon: Banknote },
  ],
};

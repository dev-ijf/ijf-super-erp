import {
  Users,
  TrendingUp,
  Calendar,
  UserPlus,
  Banknote,
  Receipt,
  CreditCard,
  AlertCircle,
} from "lucide-react";

// ─── Stat Card ──────────────────────────────────
function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  colorClass: string;
}) {
  return (
    <div className="bg-white p-7 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-slate-400 text-[12px] font-semibold uppercase tracking-[0.1em]">
          {title}
        </h3>
        <div
          className={`p-2.5 bg-slate-50 rounded-2xl ${colorClass} group-hover:bg-opacity-80 transition-all`}
        >
          <Icon size={20} />
        </div>
      </div>
      <span className="text-3xl font-semibold text-slate-700 tracking-tight">
        {value}
      </span>
    </div>
  );
}

// ─── Activity Row Data ──────────────────────────
const RECENT_ACTIVITIES = [
  {
    ref: "#TRX-0001",
    desc: "Pembayaran SPP Oktober — Ahmad Santoso",
    sub: "Kasir Manual oleh Finance SMA",
    status: "success" as const,
  },
  {
    ref: "#BIL-0012",
    desc: "Generate Tagihan 12 Bulan — Kelas 11 IPA 1",
    sub: "Sistem otomatis",
    status: "success" as const,
  },
  {
    ref: "#STU-0002",
    desc: "Pendaftaran Siswa Baru — Aisyah Santoso",
    sub: "Finance SMP",
    status: "success" as const,
  },
  {
    ref: "#BIL-0004",
    desc: "Tagihan SPP November — Ahmad Santoso",
    sub: "Menunggu pembayaran",
    status: "pending" as const,
  },
  {
    ref: "#BIL-0003",
    desc: "Building Fee SMA — Ahmad Santoso",
    sub: "Pembayaran parsial Rp 5.000.000",
    status: "partial" as const,
  },
];

// ─── Dashboard Page ─────────────────────────────
export default function DashboardPage() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Welcome */}
      <div className="mb-10 flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-slate-800 tracking-tight mb-2">
            Halo, Selamat Datang Kembali
          </h2>
          <p className="text-[15px] text-slate-400 font-normal tracking-tight">
            Monitor aktivitas sekolah Anda hari ini, {today}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Siswa"
          value="2"
          icon={Users}
          colorClass="text-indigo-500"
        />
        <StatCard
          title="Tagihan Lunas"
          value="1"
          icon={TrendingUp}
          colorClass="text-emerald-500"
        />
        <StatCard
          title="Tunggakan"
          value="3"
          icon={AlertCircle}
          colorClass="text-rose-500"
        />
        <StatCard
          title="Staf Aktif"
          value="3"
          icon={UserPlus}
          colorClass="text-amber-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Activity Table */}
        <div className="xl:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg text-slate-800 tracking-tight">
                Log Aktivitas Terakhir
              </h3>
              <p className="text-[12px] text-slate-400 mt-0.5 italic">
                Data diperbarui secara realtime
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Referensi
                  </th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Keterangan
                  </th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_ACTIVITIES.map((act) => (
                  <tr
                    key={act.ref}
                    className="hover:bg-slate-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-8 py-6 text-[13px] font-mono text-slate-400 font-medium tracking-tighter">
                      {act.ref}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[15px] font-semibold text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {act.desc}
                      </p>
                      <p className="text-[12px] text-slate-400 mt-1 italic">
                        {act.sub}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl inline-block tracking-widest ${
                          act.status === "success"
                            ? "bg-emerald-50 text-emerald-600"
                            : act.status === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {act.status === "success"
                          ? "Lunas"
                          : act.status === "pending"
                            ? "Menunggu"
                            : "Parsial"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-8">
          {/* Module Summary */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100/50">
            <h4 className="font-semibold text-slate-800 mb-6 tracking-tight">
              Ringkasan Modul
            </h4>
            <div className="space-y-6">
              {[
                {
                  label: "Tingkat Kelunasan",
                  val: "25%",
                  color: "bg-emerald-500",
                },
                {
                  label: "Data Siswa Lengkap",
                  val: "100%",
                  color: "bg-indigo-500",
                },
                {
                  label: "Tagihan Terbuat",
                  val: "80%",
                  color: "bg-amber-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[13px] mb-2 font-medium">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-slate-800 font-semibold">
                      {item.val}
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full transition-all duration-1000 rounded-full`}
                      style={{ width: item.val }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-[#1E40AF] p-8 rounded-[32px] shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">
                Quick Actions
              </p>
              <div className="space-y-3 mb-6">
                <QuickAction
                  icon={Receipt}
                  label="Generate Tagihan SPP"
                  href="/tuition/bills"
                />
                <QuickAction
                  icon={CreditCard}
                  label="Kasir Pembayaran"
                  href="/tuition/transactions"
                />
                <QuickAction
                  icon={Users}
                  label="Daftarkan Siswa"
                  href="/core/students"
                />
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all border border-white/5"
    >
      <Icon size={16} className="opacity-70" />
      <span className="text-[13px] font-semibold tracking-tight">{label}</span>
    </a>
  );
}

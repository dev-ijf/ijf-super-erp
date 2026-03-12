import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  BookOpen, 
  Ticket, 
  CreditCard, 
  Settings, 
  ChevronDown, 
  Search, 
  Bell,
  ScanLine,
  GraduationCap,
  Banknote,
  LogOut,
  Menu,
  PlusCircle,
  TrendingUp,
  UserPlus,
  ChevronRight
} from 'lucide-react';

// --- DATA DEFINITIONS ---

const MODULES = [
  { id: 'event', name: 'Event Management', icon: <Ticket size={18} />, color: 'bg-[#5B21B6]', hover: 'hover:bg-[#6D28D9]', active: 'bg-[#7C3AED]', text: 'text-purple-100' },
  { id: 'academic', name: 'Akademik', icon: <BookOpen size={18} />, color: 'bg-[#1E40AF]', hover: 'hover:bg-[#1D4ED8]', active: 'bg-[#2563EB]', text: 'text-blue-100' },
  { id: 'finance', name: 'Keuangan', icon: <Banknote size={18} />, color: 'bg-[#065F46]', hover: 'hover:bg-[#047857]', active: 'bg-[#059669]', text: 'text-emerald-100' },
  { id: 'master', name: 'Master Data', icon: <Users size={18} />, color: 'bg-[#9A3412]', hover: 'hover:bg-[#C2410C]', active: 'bg-[#EA580C]', text: 'text-orange-100' },
];

const MENUS = {
  event: [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Events & Tickets', icon: <Calendar size={18} /> },
    { name: 'Orders', icon: <CreditCard size={18} /> },
    { name: 'Tickets', icon: <Ticket size={18} /> },
    { name: 'Scan QR', icon: <ScanLine size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> },
  ],
  academic: [
    { name: 'Dashboard Guru', icon: <LayoutDashboard size={18} /> },
    { name: 'Jadwal Pelajaran', icon: <Calendar size={18} /> },
    { name: 'Daftar Siswa', icon: <Users size={18} /> },
    { name: 'Input Nilai', icon: <GraduationCap size={18} /> },
    { name: 'Laporan Rapor', icon: <BookOpen size={18} /> },
  ],
  finance: [
    { name: 'Dashboard Finance', icon: <LayoutDashboard size={18} /> },
    { name: 'Tagihan SPP', icon: <Wallet size={18} /> },
    { name: 'Kasir / Bayar', icon: <CreditCard size={18} /> },
    { name: 'Laporan Keuangan', icon: <TrendingUp size={18} /> },
  ],
  master: [
    { name: 'Buku Induk Siswa', icon: <UserPlus size={18} /> },
    { name: 'Data Kelas', icon: <LayoutDashboard size={18} /> },
    { name: 'Data Guru/Staff', icon: <Users size={18} /> },
    { name: 'Profil Sekolah', icon: <Settings size={18} /> },
  ]
};

// --- COMPONENTS ---

const DashboardCard = ({ title, value, icon, colorClass = "text-slate-400" }) => (
  <div className="bg-white p-7 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
    <div className="flex justify-between items-start mb-5">
      <h3 className="text-slate-400 text-[12px] font-semibold uppercase tracking-[0.1em]">{title}</h3>
      <div className={`p-2.5 bg-slate-50 rounded-2xl ${colorClass} group-hover:bg-opacity-80 transition-all`}>
        {icon}
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-semibold text-slate-700 tracking-tight">{value}</span>
    </div>
  </div>
);

export default function App() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState('superadmin');

  // Inject Google Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const currentMenus = MENUS[activeModule.id];

  const switchModule = (mod) => {
    setActiveModule(mod);
    setActiveMenu(MENUS[mod.id][0].name);
    setIsSwitcherOpen(false);
  };

  const fontStyle = { 
    fontFamily: "'Source Sans Pro', sans-serif",
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-600 overflow-hidden" style={fontStyle}>
      
      {/* SIDEBAR */}
      <aside 
        className={`${sidebarOpen ? 'w-72' : 'w-24'} ${activeModule.color} text-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 shadow-2xl shadow-indigo-900/10`}
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-xl rounded-[14px] flex items-center justify-center text-white shrink-0 border border-white/20 shadow-sm">
            <GraduationCap size={22} strokeWidth={1.5} />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-semibold text-[22px] tracking-tight leading-none italic">Kreativa</span>
              <span className="text-[9px] font-bold tracking-[0.2em] opacity-50 mt-1">GLOBAL SCHOOL</span>
            </div>
          )}
        </div>

        {/* CONTEXT SWITCHER */}
        <div className="px-6 mb-8">
          <div className="relative">
            <button 
              onClick={() => role === 'superadmin' && setIsSwitcherOpen(!isSwitcherOpen)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border ${
                role === 'superadmin' 
                ? 'bg-white/10 border-white/5 hover:bg-white/15 cursor-pointer shadow-sm' 
                : 'bg-black/5 border-transparent cursor-default'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="p-2 bg-white rounded-xl text-slate-600 shadow-md shrink-0">
                  {React.cloneElement(activeModule.icon, { size: 16 })}
                </div>
                {sidebarOpen && (
                  <div className="text-left overflow-hidden">
                    <p className="text-[10px] uppercase font-bold opacity-40 leading-none mb-1 tracking-widest">Layanan</p>
                    <p className="text-[15px] font-semibold truncate tracking-tight">{activeModule.name}</p>
                  </div>
                )}
              </div>
              {sidebarOpen && role === 'superadmin' && (
                <ChevronDown size={14} className={`opacity-40 transition-transform duration-300 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Dropdown Panel */}
            {isSwitcherOpen && (
              <div className="absolute left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 p-2.5 animate-in fade-in slide-in-from-top-2">
                <p className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1.5">Ganti Modul Aplikasi</p>
                {MODULES.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => switchModule(mod)}
                    className={`w-full flex items-center gap-4 p-3 rounded-[16px] mb-1 transition-all ${
                      activeModule.id === mod.id 
                      ? 'bg-slate-50 text-slate-800 font-semibold' 
                      : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`p-2 ${mod.color} text-white rounded-xl shadow-sm scale-90`}>
                      {mod.icon}
                    </div>
                    <span className="text-[14px] tracking-tight">{mod.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR MENUS */}
        <nav className="flex-1 px-6 space-y-1 overflow-y-auto scrollbar-hide">
          {currentMenus.map((menu) => {
            const isActive = activeMenu === menu.name;
            return (
              <button
                key={menu.name}
                onClick={() => setActiveMenu(menu.name)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                  isActive 
                    ? 'bg-white text-slate-800 shadow-lg shadow-black/5' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`shrink-0 transition-all ${isActive ? 'scale-110' : 'opacity-80 group-hover:opacity-100'}`}>
                  {menu.icon}
                </span>
                {sidebarOpen && <span className={`text-[15px] tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>{menu.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-6">
          <div className={`bg-black/10 rounded-[24px] p-3.5 flex items-center shadow-inner ${sidebarOpen ? 'gap-4' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-[16px] bg-white flex items-center justify-center text-slate-600 font-semibold shadow-sm text-sm">
              D
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-[14px] font-semibold truncate tracking-tight text-white/95">Dev Indonesia</p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">{role}</p>
              </div>
            )}
            {sidebarOpen && <LogOut size={14} className="text-white/20 cursor-pointer hover:text-white transition-colors" />}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <div>
               <h1 className="text-xl font-semibold text-slate-800 tracking-tight leading-none mb-1.5">{activeMenu}</h1>
               <div className="flex items-center gap-2">
                 <span className={`w-1.5 h-1.5 rounded-full ${activeModule.color.replace('bg-', 'bg-')}`}></span>
                 <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.15em]">{activeModule.name}</p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center bg-slate-50/80 p-1.5 rounded-2xl gap-1 border border-slate-100/50">
              {['superadmin', 'guru', 'finance'].map((r) => (
                <button 
                  key={r}
                  onClick={() => {
                    setRole(r);
                    if(r === 'guru') switchModule(MODULES[1]);
                    if(r === 'finance') switchModule(MODULES[2]);
                    if(r === 'superadmin') switchModule(MODULES[0]);
                  }}
                  className={`px-4 py-2 text-[10px] font-bold uppercase rounded-[12px] transition-all tracking-wider ${role === r ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-400 transition-colors" size={16} strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="bg-slate-50/50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-5 text-[14px] focus:outline-none focus:bg-white focus:border-slate-200 focus:shadow-sm transition-all w-64 placeholder:text-slate-300"
              />
            </div>
            
            <button className="relative p-2.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-10 overflow-y-auto bg-[#FAFBFC]">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-semibold text-slate-800 tracking-tight mb-2">
                   Halo, Selamat Datang Kembali
                </h2>
                <p className="text-[15px] text-slate-400 font-normal tracking-tight">Monitor aktivitas sekolah Anda hari ini, Rabu 12 Maret 2026</p>
              </div>
              <button className={`${activeModule.color} text-white px-6 py-3.5 rounded-2xl font-semibold text-[13px] uppercase tracking-[0.1em] flex items-center gap-3 shadow-xl shadow-indigo-200/50 hover:translate-y-[-2px] active:translate-y-[0px] transition-all`}>
                <PlusCircle size={18} strokeWidth={2} />
                <span>Tambah Entri</span>
              </button>
            </div>

            {/* DYNAMIC STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {activeModule.id === 'event' ? (
                <>
                  <DashboardCard title="Total Events" value="4" icon={<Calendar size={20} />} colorClass="text-purple-500" />
                  <DashboardCard title="Total Customers" value="1.733" icon={<Users size={20} />} colorClass="text-pink-500" />
                  <DashboardCard title="Total Orders" value="475" icon={<CreditCard size={20} />} colorClass="text-blue-500" />
                  <DashboardCard title="Total Revenue" value="Rp 92.834k" icon={<Banknote size={20} />} colorClass="text-emerald-500" />
                </>
              ) : (
                <>
                  <DashboardCard title="Total Siswa" value="1.240" icon={<Users size={20} />} colorClass="text-indigo-500" />
                  <DashboardCard title="Rata-rata Nilai" value="84.5" icon={<TrendingUp size={20} />} colorClass="text-amber-500" />
                  <DashboardCard title="Kehadiran" value="98%" icon={<Calendar size={20} />} colorClass="text-emerald-500" />
                  <DashboardCard title="Staf Aktif" value="42" icon={<UserPlus size={20} />} colorClass="text-rose-500" />
                </>
              )}
            </div>

            {/* MAIN DATA SECTION */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* TABLE AREA */}
              <div className="xl:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 tracking-tight">Log Aktivitas Terakhir</h3>
                    <p className="text-[12px] text-slate-400 mt-0.5 italic">Data diperbarui secara realtime</p>
                  </div>
                  <button className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Eksport PDF</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/30">
                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Referensi</th>
                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Keterangan</th>
                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-slate-50/40 transition-colors cursor-pointer group">
                          <td className="px-8 py-6 text-[13px] font-mono text-slate-400 font-medium tracking-tighter">#REF-0240{i}</td>
                          <td className="px-8 py-6">
                            <p className="text-[15px] font-semibold text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">
                              {activeModule.id === 'event' ? `Pendaftaran Tiket Konser Sekolah #${i}` : `Update Nilai Akhir Semester Ganjil #${i}`}
                            </p>
                            <p className="text-[12px] text-slate-400 mt-1 font-normal italic">Diproses oleh Sistem Otomatis</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl inline-block tracking-widest ${i === 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {i === 3 ? 'Pending' : 'Success'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SIDE INFOGRAPHIC AREA */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100/50">
                   <h4 className="font-semibold text-slate-800 mb-6 tracking-tight">Ringkasan Modul</h4>
                   <div className="space-y-6">
                      {[
                        { label: 'Kapasitas Server', val: '85%', color: 'bg-indigo-500' },
                        { label: 'Data Sinkron', val: '100%', color: 'bg-emerald-500' },
                        { label: 'Eror Log', val: '0', color: 'bg-slate-200' }
                      ].map((item, idx) => (
                        <div key={idx}>
                           <div className="flex justify-between text-[13px] mb-2 font-medium">
                              <span className="text-slate-500">{item.label}</span>
                              <span className="text-slate-800 font-semibold">{item.val}</span>
                           </div>
                           <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                              <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: item.val }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className={`${activeModule.color} p-8 rounded-[32px] shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden group`}>
                   <div className="relative z-10">
                     <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">Butuh Bantuan?</p>
                     <p className="text-[17px] font-semibold leading-relaxed tracking-tight italic mb-6">
                       "Typography is the craft of endowing human language with a durable visual form."
                     </p>
                     <button className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-white/30 transition-all border border-white/10">
                        Hubungi Support
                     </button>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
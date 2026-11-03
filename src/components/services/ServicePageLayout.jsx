import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  FileCheck2,
  FolderArchive,
  Boxes,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Users,
  Headphones,
  Globe,
  ShoppingBag,
  LogOut,
  Search,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const allServices = [
  {
    id: 'par',
    title: 'PAR (Program Approval Request)',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    icon: FileCheck2,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
  },
  {
    id: 'archive',
    title: 'Digitalisasi E-Arsip & Persuratan',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    icon: FolderArchive,
    color: 'text-blue-600 bg-blue-50 border-blue-200/80',
  },
  {
    id: 'asset',
    title: 'Digitalisasi Aset & Inventaris',
    category: 'Operasional & Aset',
    badge: 'Modul Inti',
    icon: Boxes,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80',
  },
  {
    id: 'finance',
    title: 'Kas & Reimbursement Anggaran',
    category: 'Keuangan & Anggaran',
    badge: 'Tersedia',
    icon: Receipt,
    color: 'text-teal-600 bg-teal-50 border-teal-200/80',
  },
  {
    id: 'attendance',
    title: 'Presensi Digital QR Code & Notula',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    icon: ClipboardCheck,
    color: 'text-purple-600 bg-purple-50 border-purple-200/80',
  },
  {
    id: 'timeline',
    title: 'Master Timeline & Kalender Kerja',
    category: 'Perencanaan Proker',
    badge: 'Tersedia',
    icon: CalendarRange,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200/80',
  },
  {
    id: 'hr',
    title: 'Database Anggota & Struktur SDM',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    icon: Users,
    color: 'text-violet-600 bg-violet-50 border-violet-200/80',
  },
  {
    id: 'helpdesk',
    title: 'Pubdok & Request Desain Medinfo',
    category: 'Publikasi & Dokumentasi',
    badge: 'Modul Divisi',
    icon: Headphones,
    color: 'text-rose-600 bg-rose-50 border-rose-200/80',
  },
  {
    id: 'humas',
    title: 'Humas & Media Partner Gateway',
    category: 'Hubungan Masyarakat',
    badge: 'Modul Divisi',
    icon: Globe,
    color: 'text-sky-600 bg-sky-50 border-sky-200/80',
  },
  {
    id: 'kkm',
    title: 'Kreativitas & Kewirausahaan (KKM)',
    category: 'Unit Usaha & Bisnis',
    badge: 'Modul Divisi',
    icon: ShoppingBag,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80',
  },
];

const ServicePageLayout = ({
  serviceId,
  title,
  category,
  badge,
  icon: Icon,
  onBackToPortal,
  onBackToLanding,
  onSelectService,
  authUser,
  onLogout,
  children,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. LEFT SIDEBAR: MODERN SAAS NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200/80 shrink-0 hidden lg:flex flex-col justify-between p-5 min-h-screen sticky top-0 h-screen z-20 overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo-teramedia.png"
                alt="Logo TERAMEDIA"
                className="w-9 h-9 object-contain drop-shadow-xs shrink-0"
              />
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                  TeraDesk
                </span>
                <span className="text-[10px] font-semibold text-blue-600 font-mono tracking-wider uppercase">
                  Layanan Workspace
                </span>
              </div>
            </div>
            <button
              onClick={onBackToLanding}
              className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Kembali ke Beranda Landing"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-5">
            
            {/* SECTION 1: HUB WORKSPACE */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                WORKSPACE
              </p>
              <div className="space-y-1">
                <button
                  onClick={onBackToPortal}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid size={16} className="text-slate-400" />
                    <span>Katalog Semua Layanan</span>
                  </div>
                </button>
              </div>
            </div>

            {/* SECTION 2: 8 AVAILABLE SERVICES */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                MODUL TERSEDIA (10 MODUL)
              </p>
              <div className="space-y-1">
                {allServices.map((svc) => {
                  const SvcIcon = svc.icon;
                  const isActive = svc.id === serviceId;

                  return (
                    <button
                      key={svc.id}
                      onClick={() => onSelectService && onSelectService(svc.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <SvcIcon size={16} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                        <span className="truncate">{svc.title.split('(')[0].trim()}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: KONTROL ADMIN */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                ADMINISTRASI
              </p>
              <div className="space-y-1">
                <button
                  onClick={onBackToLanding}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <ShieldCheck size={16} className="text-slate-400" />
                  <span>Kembali ke Beranda</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Profile Card */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {authUser?.name || 'Alif Fikri'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {authUser?.role || 'Demisioner Ketua Umum'}
                </p>
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 mb-2"
            >
              <LogOut size={13} />
              <span>Keluar Sesi</span>
            </button>
          )}

          <p className="text-[10px] text-center text-slate-400 font-medium">
            © 2026 TERAMEDIA / TeraDesk
          </p>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          {/* Left: Breadcrumbs & Search */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
              <button
                onClick={onBackToLanding}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Beranda
              </button>
              <ChevronRight size={13} className="text-slate-300" />
              <button
                onClick={onBackToPortal}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Workspace Hub
              </button>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="text-slate-600">{category}</span>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="text-blue-600 font-bold truncate max-w-[180px]">{title}</span>
            </div>

            <div className="relative w-64 md:hidden">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Cari..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden"
              />
            </div>
          </div>

          {/* Right: Quick Switcher Dropdown & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Quick Switcher Dropdown (Accessible on all screens) */}
            <div className="relative">
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <LayoutGrid size={14} className="text-blue-600" />
                <span className="hidden sm:inline">Pindah Layanan</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSwitcherOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSwitcherOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Katalog 8 Layanan Organisasi
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                      {allServices.map((svc) => {
                        const SvcIcon = svc.icon;
                        const isActive = svc.id === serviceId;

                        return (
                          <button
                            key={svc.id}
                            onClick={() => {
                              setIsSwitcherOpen(false);
                              if (onSelectService) onSelectService(svc.id);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-slate-900 text-white font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${svc.color}`}>
                              <SvcIcon size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate">{svc.title.split('(')[0].trim()}</p>
                              <p className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                                {svc.category}
                              </p>
                            </div>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {authUser?.name || 'Alif Fikri'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-none">
                  {authUser?.role || 'Demisioner'}
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* 3. HERO BANNER FOR ACTIVE SERVICE (CLEAN WHITE SAAS CARD) */}
        <div className="p-6 lg:p-8 pb-0">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs shrink-0">
                <Icon size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {category}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>{badge || 'Modul Aktif'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {serviceId}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onBackToPortal}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LayoutGrid size={13} />
                <span>Semua Layanan</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. MAIN SERVICE CONTENT CONTAINER (SCOPED SAAS LIGHT THEME) */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8">
          <div className="saas-service-content space-y-6">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};

export default ServicePageLayout;

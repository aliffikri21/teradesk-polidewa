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
  Headphones
} from 'lucide-react';

const allServices = [
  {
    id: 'par',
    title: 'PAR (Program Approval Request)',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    icon: FileCheck2,
    color: 'emerald',
  },
  {
    id: 'archive',
    title: 'Digitalisasi Arsip & Persuratan',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    icon: FolderArchive,
    color: 'blue',
  },
  {
    id: 'asset',
    title: 'Digitalisasi Aset & Inventaris',
    category: 'Operasional & Aset',
    badge: 'Modul Inti',
    icon: Boxes,
    color: 'amber',
  },
  {
    id: 'finance',
    title: 'Kas & Reimbursement Anggaran',
    category: 'Keuangan & Anggaran',
    badge: 'Tersedia',
    icon: Receipt,
    color: 'purple',
  },
  {
    id: 'attendance',
    title: 'Presensi Digital & QR Code Acara',
    category: 'Operasional & Aset',
    badge: 'Tersedia',
    icon: ClipboardCheck,
    color: 'teal',
  },
  {
    id: 'timeline',
    title: 'Master Timeline & Kalender Kerja',
    category: 'Operasional & Aset',
    badge: 'Tersedia',
    icon: CalendarRange,
    color: 'cyan',
  },
  {
    id: 'hr',
    title: 'Database Anggota & Tata Kelola SDM',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    icon: Users,
    color: 'indigo',
  },
  {
    id: 'helpdesk',
    title: 'Helpdesk Internal & Request Desain',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    icon: Headphones,
    color: 'rose',
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
  children,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#060D25] text-white flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060D25]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Back & Breadcrumb Navigation */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              title="Kembali ke Katalog Layanan"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Workspace</span>
            </button>

            {/* Breadcrumb Trail */}
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <button
                onClick={onBackToLanding}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Beranda
              </button>
              <ChevronRight size={13} className="text-gray-600" />
              <button
                onClick={onBackToPortal}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Workspace Hub
              </button>
              <ChevronRight size={13} className="text-gray-600" />
              <span className="text-gray-300">{category}</span>
              <ChevronRight size={13} className="text-gray-600" />
              <span className="text-amber-300 font-semibold truncate max-w-[200px]">{title}</span>
            </div>
          </div>

          {/* Right: Quick Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              <LayoutGrid size={15} className="text-amber-400" />
              <span className="hidden sm:inline">Pindah Layanan</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSwitcherOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-[#0c132c] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 mb-1">
                    Katalog Layanan Organisasi
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
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-blue-600/30 text-white border border-blue-500/40'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <SvcIcon size={14} className="text-amber-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">{svc.title}</p>
                            <p className="text-[10px] text-gray-400 truncate">{svc.category}</p>
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

        </div>
      </header>

      {/* Hero Header for Active Service */}
      <div className="bg-linear-to-b from-[#0a1233] to-[#060D25] border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shrink-0">
              <Icon size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {badge || 'Modul Aktif'}
                </span>
                <span className="text-[11px] text-gray-400">
                  ID: <code className="text-gray-300 font-mono">{serviceId}</code>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Lihat Modul Lain
            </button>
          </div>
        </div>
      </div>

      {/* Main Service Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  );
};

export default ServicePageLayout;

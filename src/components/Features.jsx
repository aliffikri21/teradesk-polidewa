import React from 'react';
import {
  FileCheck2,
  FolderArchive,
  LayoutDashboard,
  Users,
  BellRing,
  Workflow,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: FileCheck2,
    tag: 'Modul Utama',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: 'Sistem Persetujuan Program (PAR)',
    description:
      'Ajukan dan verifikasi proposal kegiatan secara digital dengan alur bertingkat, live review, dan tanda tangan digital.',
  },
  {
    icon: FolderArchive,
    tag: 'Modul Utama',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'bg-blue-50 text-blue-600 border-blue-100',
    title: 'Digitalisasi Arsip & Persuratan',
    description:
      'Penyimpanan terpusat untuk SK, proposal, LPJ, dan generator penomoran surat otomatis yang mencegah bentrok nomor surat.',
  },
  {
    icon: LayoutDashboard,
    tag: 'Operasional',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-100',
    title: 'Dashboard Monitoring Kegiatan',
    description:
      'Pantau progres eksekusi program kerja dan performa kepengurusan secara real-time melalui dashboard visual yang informatif.',
  },
  {
    icon: Users,
    tag: 'Tata Kelola SDM',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-100',
    title: 'Manajemen Anggota & Panitia',
    description:
      'Kelola hierarki organisasi, peran divisi, database anggota aktif, dan riwayat penugasan kepanitiaan secara terpadu.',
  },
  {
    icon: BellRing,
    tag: 'Notifikasi',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'bg-rose-50 text-rose-600 border-rose-100',
    title: 'Pemberitahuan Otomatis & SLA',
    description:
      'Dapatkan notifikasi langsung terkait batas waktu persetujuan proposal, disposisi surat, dan status peminjaman inventaris.',
  },
  {
    icon: Workflow,
    tag: 'Efisiensi',
    tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconColor: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    title: 'Otomatisasi Alur Birokrasi',
    description:
      'Pangkas rantai birokrasi manual yang lambat menjadi alur kerja digital terstruktur yang menghemat waktu hingga 75%.',
  },
  {
    icon: CalendarDays,
    tag: 'Jadwal',
    tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
    iconColor: 'bg-teal-50 text-teal-600 border-teal-100',
    title: 'Master Timeline & Kalender Kerja',
    description:
      'Petakan timeline acara seluruh divisi kepengurusan dalam satu kalender induk untuk mendeteksi tabrakan jadwal sejak awal.',
  },
  {
    icon: ShieldCheck,
    tag: 'Keamanan',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    title: 'Akses Berjenjang (RBAC)',
    description:
      'Proteksi dokumen dan hak akses data organisasi berdasarkan peran kepengurusan (Ketua, Sekretaris, Bendahara, Anggota).',
  },
];

const Features = ({ onNavigateToPortal }) => {
  return (
    <section id="fitur" className="w-full bg-[#F8FAFC] text-slate-900 py-20 px-4 sm:px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Section Category Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200/60 px-3.5 py-1 rounded-full mb-3 shadow-xs">
            Solusi Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Fitur Cerdas untuk Efisiensi Organisasi Modern
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Kelola pengajuan proposal, repositori arsip surat dinas, serta inventaris aset organisasi Anda dalam satu antarmuka yang rapi dan terukur.
          </p>
        </div>

        {/* 8 Feature Cards Grid (4 columns on lg, 2 on sm, 1 on xs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-14">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${item.iconColor} group-hover:scale-105 transition-transform duration-200`}>
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2.5 min-h-[40px] group-hover:text-blue-700 transition-colors duration-150">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Action Link */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={onNavigateToPortal}
                    className="w-full text-xs font-bold text-slate-700 group-hover:text-blue-700 flex items-center justify-between py-1 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-lg"
                  >
                    <span>Buka Alur Kerja</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-150" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Impact CTA Banner to Features Portal */}
        <div className="w-full bg-[#08112c] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="max-w-xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={14} />
              <span>Workspace & Command Center</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Siap Menerapkan Alur Kerja Digital Bebas Hambatan?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Masuk ke halaman katalog portal lengkap untuk mencoba simulasi alur <strong>PAR (Program Approval Request)</strong>, generator nomor surat otomatis, dan booking <strong>Digitalisasi Aset</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1">✓ 100% Paperless</span>
              <span className="flex items-center gap-1">✓ Approval &lt; 24 Jam</span>
              <span className="flex items-center gap-1">✓ Bebas Konflik Aset</span>
            </div>
          </div>

          <button
            onClick={onNavigateToPortal}
            className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0 z-10 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            Buka Portal Fitur Lengkap
          </button>
        </div>

      </div>
    </section>
  );
};

export default Features;

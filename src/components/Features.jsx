import React from 'react';
import {
  CheckCircle2,
  FolderArchive,
  LayoutDashboard,
  Users,
  Bell,
  Send,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

const featuresData = [
  {
    serviceId: 'par',
    icon: CheckCircle2,
    title: 'Sistem Persetujuan Program (Program Approval Request)',
    description:
      'Ajukan dan setujui program kerja secara digital dengan alur verifikasi bertingkat yang transparan dan efisien.',
  },
  {
    serviceId: 'archive',
    icon: FolderArchive,
    title: 'Arsip Digital Terpusat',
    description:
      'Simpan dan kelola seluruh dokumen organisasi, SK, proposal, dan LPJ dalam satu tempat yang aman dan mudah diakses.',
  },
  {
    serviceId: 'asset',
    icon: LayoutDashboard,
    title: 'Dashboard Monitoring',
    description:
      'Pantau progres program kerja, status persetujuan, dan metrik kinerja organisasi secara real-time melalui visualisasi data.',
  },
  {
    serviceId: 'hr',
    icon: Users,
    title: 'Manajemen Anggota',
    description:
      'Kelola data kader, kepengurusan, dan distribusi peran divisi dengan struktur hierarki yang jelas dan terorganisir.',
  },
  {
    serviceId: 'helpdesk',
    icon: Bell,
    title: 'Notifikasi Pintar',
    description:
      'Dapatkan pengingat otomatis untuk tenggat waktu persetujuan, agenda mendatang, dan pembaruan status program kerja.',
  },
  {
    serviceId: 'finance',
    icon: Send,
    title: 'Otomatisasi Alur Kerja',
    description:
      'Otomatiskan proses persuratan, penomoran dokumen, dan alur disposisi untuk mempercepat administrasi harian.',
  },
  {
    serviceId: 'timeline',
    icon: Calendar,
    title: 'Timeline & Perencanaan Kegiatan',
    description:
      'Susun jadwal kegiatan tahunan organisasi dalam timeline interaktif agar tidak terjadi tumpang tindih agenda.',
  },
  {
    serviceId: 'attendance',
    icon: Lock,
    title: 'Akses & Keamanan Data',
    description:
      'Kontrol hak akses berbasis peran (RBAC) memastikan dokumen sensitif hanya dapat diakses oleh pihak yang berwenang.',
  },
];

const Features = ({ onNavigateToPortal }) => {
  return (
    <section id="fitur" className="w-full bg-[#F0F4F8] text-slate-900 py-20 px-4 sm:px-6 md:px-12 border-t border-gray-100 scroll-mt-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Section Category Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mb-14">
          <span className="text-xs font-semibold text-[#4338CA] bg-[#E0E7FF] px-5 py-1.5 rounded-full mb-4 inline-block">
            Fitur Unggulan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Solusi Lengkap untuk Manajemen <br className="hidden sm:inline" />
            Organisasi Modern
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Kelola program kerja, administrasi, dan kolaborasi tim dalam satu platform digital yang terintegrasi.
          </p>
        </div>

        {/* 8 Feature Cards Grid (4 columns on lg, 2 on sm, 1 on xs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {featuresData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => onNavigateToPortal && onNavigateToPortal(item.serviceId)}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Circular Icon Container */}
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-3 min-h-[44px] group-hover:text-blue-700 transition-colors duration-150">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Action Link: Pelajari Lebih Lanjut */}
                <div className="pt-3 border-t border-slate-100 flex items-center">
                  <span className="text-[#4F46E5] group-hover:text-blue-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors">
                    <span>Pelajari Lebih Lanjut</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-150" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;

import React from 'react';
import {
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
  ArrowRight
} from 'lucide-react';

const featuresData = [
  {
    serviceId: 'par',
    icon: FileCheck2,
    division: 'Kesekretariatan & BPH',
    title: 'Persetujuan Program Kerja (PAR)',
    description:
      'Alur pengajuan dan verifikasi proposal kegiatan bertingkat (Panitia ➔ Kadiv ➔ BPH ➔ Pembina) secara digital dan paperless.',
  },
  {
    serviceId: 'archive',
    icon: FolderArchive,
    division: 'Divisi Kesekretariatan',
    title: 'Digitalisasi Arsip & E-Surat',
    description:
      'Penyimpanan cloud terpusat Surat Masuk/Keluar, SK, LPJ, serta generator nomor surat resmi organisasi otomatis anti-bentrok.',
  },
  {
    serviceId: 'asset',
    icon: Boxes,
    division: 'Logistik & Operasional',
    title: 'Digitalisasi Aset & Inventaris',
    description:
      'Katalog inventaris alat multimedia (kamera, lighting, mic, proyektor) dengan tracking ketersediaan dan form peminjaman terpadu.',
  },
  {
    serviceId: 'finance',
    icon: Receipt,
    division: 'Bendahara & Keuangan',
    title: 'Kas & Reimbursement Anggaran',
    description:
      'Pencatatan kas masuk/keluar organisasi, pengajuan klaim reimbursement nota via foto smartphone, dan monitoring pagu anggaran divisi.',
  },
  {
    serviceId: 'attendance',
    icon: ClipboardCheck,
    division: 'Tata Kelola Rapat & SDM',
    title: 'Presensi QR & Notula Rapat',
    description:
      'Absensi rapat dan kegiatan menggunakan scan kode QR kilat terintegrasi format notula digital dan pembagian action items PIC.',
  },
  {
    serviceId: 'timeline',
    icon: CalendarRange,
    division: 'Manajemen Agenda BPH',
    title: 'Master Timeline & Kalender Proker',
    description:
      'Kalender induk terpadu jadwal kegiatan seluruh divisi secara simultan untuk memetakan roadmap dan mencegah bentrok tanggal acara.',
  },
  {
    serviceId: 'hr',
    icon: Users,
    division: 'Divisi Kaderisasi',
    title: 'Database Anggota & Kaderisasi',
    description:
      'Direktori data kader dan kepengurusan aktif, histori kepanitiaan, rekam keaktifan anggota, serta penerbitan sertifikat digital.',
  },
  {
    serviceId: 'helpdesk',
    icon: Headphones,
    division: 'Divisi Pubdok',
    title: 'Helpdesk & Tiket Desain Pubdok',
    description:
      'Sistem tiket request materi publikasi dengan spesifikasi canvas (Feed/Story/A3/Banner), brief terstandar, dan estimasi pengerjaan.',
  },
  {
    serviceId: 'humas',
    icon: Globe,
    division: 'Divisi Humas',
    title: 'Humas & Media Partner Gateway',
    description:
      'Portal permohonan kerja sama media partner, kurasi paket barter promosi medsos, serta direktori kontak relasi BEM/UKM kampus.',
  },
  {
    serviceId: 'kkm',
    icon: ShoppingBag,
    division: 'Divisi KKM',
    title: 'Kreativitas & Kewirausahaan (KKM)',
    description:
      'Manajemen pre-order merchandise resmi UKM (hoodie, lanyard), persewaan alat multimedia, dan pembukuan laba-rugi divisi usaha.',
  },
];

const Features = ({ onNavigateToPortal }) => {
  return (
    <section id="fitur" className="w-full bg-[#F0F4F8] text-slate-900 py-20 px-4 sm:px-6 md:px-12 border-t border-gray-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
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
            Kelola program kerja, administrasi, aset, dan kolaborasi per divisi dalam satu platform digital terpadu UKM TERAMEDIA.
          </p>
        </div>

        {/* 10 Feature Cards Grid (5 columns on xl, 3 on lg, 2 on sm, 1 on xs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6 w-full">
          {featuresData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => onNavigateToPortal && onNavigateToPortal(item.serviceId)}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400/60 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer select-none"
              >
                <div>
                  {/* Top: Circular Icon & Division Tag */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#4F46E5] group-hover:text-white transition-all duration-200 shadow-2xs shrink-0">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/80 text-right leading-tight">
                      {item.division}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-2.5 min-h-[44px] group-hover:text-blue-700 transition-colors duration-150">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs leading-relaxed mb-5 font-normal line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Action Link: Pelajari Lebih Lanjut */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[#4F46E5] group-hover:text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <span>Pelajari Lebih Lanjut</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-150" />
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

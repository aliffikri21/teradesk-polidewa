import React, { useState } from 'react';
import {
  ArrowLeft,
  FolderArchive,
  Boxes,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Users,
  Search,
  ArrowRight,
  Check,
  Headphones,
  FileCheck2,
  Hash,
  X
} from 'lucide-react';

const featuresData = [
  {
    id: 'par',
    title: 'PAR (Program Approval Request)',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: FileCheck2,
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    description:
      'Alur pengajuan dan persetujuan proposal program kerja bertingkat (Ketua Panitia ➔ Kadiv ➔ BPH ➔ Pembina). Dilengkapi revisi live dan tanda tangan digital.',
    longDescription:
      'Modul PAR (Program Approval Request) mengeliminasi kerumitan mencetak proposal fisik berkali-kali. Seluruh alur tinjauan dokumen, pencatatan catatan revisi dari ketua divisi atau pembina, hingga penerbitan lembar pengesahan ber-barcode dilakukan secara paperless dalam satu alur terpusat.',
    benefits: [
      'Memangkas waktu approval proposal dari hitungan minggu menjadi < 24 jam',
      'Pemberitahuan otomatis ke WhatsApp/Email saat proposal butuh revisi atau disetujui',
      'Arsip digital otomatis setelah kegiatan disahkan tanpa risiko berkas hilang',
      'SLA tracking transparan untuk memantau pihak mana yang sedang meninjau proposal',
    ],
    primaryAction: 'Buka Alur PAR',
  },
  {
    id: 'archive',
    title: 'Digitalisasi Arsip (E-Arsip & Surat)',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FolderArchive,
    iconColor: 'bg-blue-50 text-blue-600 border-blue-200',
    description:
      'Repositori cloud terpusat untuk Surat Masuk/Keluar, SK Kepengurusan, Proposal, dan LPJ dengan generator penomoran surat otomatis anti-bentrok.',
    longDescription:
      'Digitalisasi Arsip memastikan memori organisasi tidak hilang saat pergantian periode kepengurusan. Dilengkapi sistem penomoran surat otomatis berbasis kode baku organisasi, pencarian berkas cerdas berbasis metadata, dan proteksi hak akses dokumen per divisi.',
    benefits: [
      'Generator nomor surat otomatis (tanpa risiko bentrok nomor urut antar divisi)',
      'Pencarian dokumen kilat (cari berdasarkan nomor, divisi, tanggal, atau kata kunci)',
      'Aman saat regenerasi kepengurusan baru karena seluruh arsip tersimpan rapi di cloud',
      'Preview langsung di browser tanpa perlu mengunduh file berkali-kali',
    ],
    primaryAction: 'Jelajahi E-Arsip',
  },
  {
    id: 'asset',
    title: 'Digitalisasi Aset & Inventaris',
    category: 'Operasional & Aset',
    badge: 'Modul Inti',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Boxes,
    iconColor: 'bg-amber-50 text-amber-600 border-amber-200',
    description:
      'Katalog inventaris organisasi (kamera, proyektor, mic, ruang rapat) dengan tracking ketersediaan real-time dan form booking peminjaman alat terpadu.',
    longDescription:
      'Kelola seluruh aset fisik organisasi tanpa takut barang tercecer atau hilang tanpa penanggung jawab. Anggota dapat melihat jadwal ketersediaan peralatan, mengajukan peminjaman secara digital, dan mencatat riwayat pemeliharaan kondisi barang.',
    benefits: [
      'Mengetahui ketersediaan alat dan ruangan secara langsung sebelum kegiatan',
      'Pencatatan jelas identitas peminjam, waktu kembali, dan tujuan kegiatan',
      'Mencegah bentrok jadwal pemakaian ruangan sekretariat atau proyektor di hari-H',
      'Riwayat kondisi fisik barang (sehat/rusak) untuk acuan pengadaan berkala',
    ],
    primaryAction: 'Kelola Aset & Pinjam',
  },
  {
    id: 'finance',
    title: 'Kas & Reimbursement Anggaran',
    category: 'Keuangan & Anggaran',
    badge: 'Tersedia',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Receipt,
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
    description:
      'Pencatatan kas masuk/keluar organisasi, pengajuan reimbursement nota kegiatan via foto, serta monitoring alokasi pagu anggaran setiap divisi.',
    longDescription:
      'Bendahara organisasi dapat bekerja jauh lebih mudah tanpa menumpuk struk belanja fisik. Panitia kegiatan cukup memotret nota pembelian, menginput rincian, dan bendahara dapat menyetujui reimbursement secara transparan.',
    benefits: [
      'Unggah foto nota langsung dari smartphone panitia saat belanja kebutuhan proker',
      'Rekapitulasi otomatis laporan kas bulanan dan semesteran',
      'Transparansi saldo kas bagi seluruh pengurus tanpa curiga keuangan',
      'Peringatan otomatis saat realisasi anggaran proker mendekati batas pagu',
    ],
    primaryAction: 'Buka Buku Kas & Reimburse',
  },
  {
    id: 'attendance',
    title: 'Presensi QR & Notula Rapat Digital',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: ClipboardCheck,
    iconColor: 'bg-teal-50 text-teal-600 border-teal-200',
    description:
      'Absensi rapat pengurus menggunakan scan kode QR cepat, terintegrasi dengan pembuat notula otomatis dan pembagian action items langsung ke PIC.',
    longDescription:
      'Tingkatkan kedisiplinan dan akuntabilitas rapat organisasi. Tidak ada lagi anggota yang bertanya "kemarin rapat bahas apa?" karena ringkasan notula dan daftar tugas langsung tersinkronisasi ke dashboard masing-masing.',
    benefits: [
      'Presensi kilat via scan QR code di layar proyektor rapat',
      'Format notula baku dengan pembagian tugas (action items) yang jelas',
      'Notifikasi otomatis ke anggota yang mendapatkan tanggung jawab baru',
      'Data statistik kehadiran pengurus terakumulasi untuk evaluasi keaktifan',
    ],
    primaryAction: 'Buka Presensi & Notula',
  },
  {
    id: 'timeline',
    title: 'Master Timeline & Kalender Proker',
    category: 'Operasional & Aset',
    badge: 'Tersedia',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: CalendarRange,
    iconColor: 'bg-rose-50 text-rose-600 border-rose-200',
    description:
      'Kalender induk terpadu untuk memetakan jadwal kegiatan seluruh divisi secara simultan, mencegah bentrokan tanggal acara dan waktu persiapan.',
    longDescription:
      'Visualisasikan roadmap kepengurusan selama satu periode dalam tampilan kalender dan Gantt chart terintegrasi. Sistem memberi sinyal jika ada dua divisi yang merencanakan acara besar pada pekan yang sama.',
    benefits: [
      'Deteksi dini bentrok tanggal pelaksanaan program kerja antar departemen',
      'Reminder otomatis H-7 dan H-1 menjelang tanggal krusial kegiatan',
      'Dapat disinkronisasikan ke Google Calendar seluruh pengurus organisasi',
      'Membantu ketua umum memantau ritme kerja organisasi secara makro',
    ],
    primaryAction: 'Lihat Timeline Proker',
  },
  {
    id: 'hr',
    title: 'Database Anggota & Struktur Pengurus',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Users,
    iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    description:
      'Direktori data pengurus lengkap dengan struktur hirarki, penugasan kepanitiaan, serta portofolio sertifikat digital kepengurusan.',
    longDescription:
      'Kelola data keanggotaan organisasi secara profesional. Ketahui keahlian masing-masing anggota (desain, publik speaking, logistik) untuk penugasan kepanitiaan yang paling tepat sasaran.',
    benefits: [
      'Database kontak dan profil keahlian anggota yang mudah dicari',
      'Histori partisipasi kepanitiaan dan rekam jejak kontribusi selama menjabat',
      'Penerbitan e-sertifikat kepengurusan dan kepanitiaan secara otomatis',
      'Manajemen hak akses sistem (Role-Based Access Control) berjenjang',
    ],
    primaryAction: 'Buka Database Pengurus',
  },
  {
    id: 'helpdesk',
    title: 'Helpdesk & Request Layanan Antar-Divisi',
    category: 'Administrasi & Legalitas',
    badge: 'Tersedia',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Headphones,
    iconColor: 'bg-sky-50 text-sky-600 border-sky-200',
    description:
      'Sistem tiket permohonan bantuan antar divisi: request materi publikasi ke Medinfo, permintaan logistik ke Perlengkapan, dan surat tugas ke Kesekretariatan.',
    longDescription:
      'Hindari permintaan dadakan di chat pribadi yang sering terlupakan. Dengan sistem tiket layanan internal, setiap request memiliki batas waktu penyelesaian yang disepakati bersama.',
    benefits: [
      'Alur request desain publikasi dengan brief yang jelas sejak awal',
      'Menghilangkan miss-komunikasi antar divisi dalam persiapan kegiatan',
      'Antrean kerja terorganisir untuk divisi pelayanan seperti Medinfo & Logistik',
      'Status pengerjaan transparan (Diajukan ➔ Sedang Dikerjakan ➔ Selesai)',
    ],
    primaryAction: 'Buka Layanan Tiket',
  },
];

const FeaturesPortal = ({ onBackToLanding, onOpenContact, onSelectService }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = [
    { label: 'Semua', count: featuresData.length },
    { label: 'Administrasi & Legalitas', count: featuresData.filter(f => f.category === 'Administrasi & Legalitas').length },
    { label: 'Operasional & Aset', count: featuresData.filter(f => f.category === 'Operasional & Aset').length },
    { label: 'Keuangan & Anggaran', count: featuresData.filter(f => f.category === 'Keuangan & Anggaran').length },
    { label: 'Tata Kelola SDM', count: featuresData.filter(f => f.category === 'Tata Kelola SDM').length },
  ];

  const filteredFeatures = featuresData.filter((feat) => {
    const matchCat = selectedCategory === 'Semua' || feat.category === selectedCategory;
    const matchSearch =
      feat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenFeature = (feature) => {
    if (onSelectService) {
      onSelectService(feature.id);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
  };

  return (
    <div className="w-full min-h-screen bg-[#060D25] text-white flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060D25]/95 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left: Brand & Back to Landing */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-full border border-white/10 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-blue-400/50 flex items-center justify-center bg-blue-950/60 shadow-sm">
                <span className="text-white text-xs">⚛</span>
              </div>
              <span className="text-base font-bold tracking-wide text-white">TeraDesk</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Workspace Hub
              </span>
            </div>
          </div>

          {/* Right: Quick CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 font-bold px-5 py-2 rounded-full text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
            >
              Konsultasi & Kontak
            </button>
          </div>

        </div>
      </header>

      {/* Hero Portal Header */}
      <section className="relative w-full pt-10 pb-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091334] to-[#060D25] border-b border-white/10">
        <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-5 font-medium">
            <button onClick={onBackToLanding} className="hover:text-white transition-colors cursor-pointer">
              Beranda
            </button>
            <span>/</span>
            <span className="text-amber-300">Portal Fitur Organisasi</span>
          </nav>

          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            Ekosistem Efisiensi Kerja Organisasi Modern
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Katalog Fitur & Solusi Digital <br className="hidden sm:inline" />
            <span className="text-amber-300">
              Tingkatkan Produktivitas Pengurus Organisasi
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-3xl mb-8 leading-relaxed font-normal">
            Satu platform terintegrasi untuk menangani alur persetujuan program kerja (PAR), digitalisasi surat dan dokumen arsip, serta peminjaman aset inventaris organisasi secara transparan.
          </p>

          {/* Key Stat Cards - solid clean surfaces */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
            <div className="bg-[#0b1536] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400">8 Modul</div>
              <div className="text-[11px] text-gray-300 mt-0.5 font-medium">Siap Digunakan</div>
            </div>
            <div className="bg-[#0b1536] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">&lt; 24 Jam</div>
              <div className="text-[11px] text-gray-300 mt-0.5 font-medium">Siklus Approval PAR</div>
            </div>
            <div className="bg-[#0b1536] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-black text-blue-400">100%</div>
              <div className="text-[11px] text-gray-300 mt-0.5 font-medium">E-Arsip Cloud Aman</div>
            </div>
            <div className="bg-[#0b1536] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-black text-purple-400">0 Konflik</div>
              <div className="text-[11px] text-gray-300 mt-0.5 font-medium">Peminjaman Aset</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area: Light / Clean Workspace Look */}
      <main className="w-full bg-[#F8FAFC] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 grow">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Quick Actions Shortcuts Bar (Semantic SVGs, accessible micro-interactions) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-sm text-slate-900">Aksi Cepat Harian (Quick Actions)</h3>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">Paling sering digunakan pengurus</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => onSelectService && onSelectService('par')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 hover:-translate-y-0.5 transition-all duration-150 text-left cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform duration-150">
                  <FileCheck2 size={20} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Ajukan PAR Baru</div>
                  <div className="text-[11px] text-slate-500">Proposal program kerja</div>
                </div>
              </button>

              <button
                onClick={() => onSelectService && onSelectService('archive')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 hover:-translate-y-0.5 transition-all duration-150 text-left cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform duration-150">
                  <Hash size={20} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Nomor Surat Otomatis</div>
                  <div className="text-[11px] text-slate-500">Generator nomor resmi</div>
                </div>
              </button>

              <button
                onClick={() => onSelectService && onSelectService('asset')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 hover:-translate-y-0.5 transition-all duration-150 text-left cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform duration-150">
                  <Boxes size={20} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Pinjam Aset / Ruangan</div>
                  <div className="text-[11px] text-slate-500">Kamera, proyektor, aula</div>
                </div>
              </button>

              <button
                onClick={() => onSelectService && onSelectService('finance')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 hover:-translate-y-0.5 transition-all duration-150 text-left cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-105 transition-transform duration-150">
                  <Receipt size={20} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Kas & Reimbursement</div>
                  <div className="text-[11px] text-slate-500">Klaim nota belanja divisi</div>
                </div>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Section with Counts and Reset */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Input with Clear Button */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, surat dinas, alur kerja..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
                    aria-label="Bersihkan pencarian"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Status counter */}
              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <strong className="text-slate-900">{filteredFeatures.length}</strong> dari {featuresData.length} modul
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0" role="tablist">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    role="tab"
                    aria-selected={isActive}
                    className={`text-xs px-4 py-2.5 rounded-2xl font-bold transition-all duration-150 cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                      isActive
                        ? 'bg-[#060D25] text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Features Grid or Empty State */}
          {filteredFeatures.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Search size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-900">Modul Tidak Ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tidak ada fitur atau modul yang cocok dengan kata kunci "{searchQuery}".
              </p>
              <button
                onClick={handleClearSearch}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenFeature(item)}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400/60 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Icon & Category/Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.iconColor} group-hover:scale-105 transition-transform duration-200`}>
                          <Icon size={24} strokeWidth={2.2} />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors duration-150">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-slate-600 text-xs leading-relaxed mb-5 font-normal">
                        {item.description}
                      </p>

                      {/* Highlights Points */}
                      <div className="space-y-1.5 mb-6 pt-3 border-t border-slate-100">
                        {item.benefits.slice(0, 2).map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                            <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Primary Action Button */}
                    <button
                      onClick={() => handleOpenFeature(item)}
                      className="w-full bg-[#060D25] hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-150 shadow-sm active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                    >
                      <span>{item.primaryAction}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-150" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comparison Matrix Section */}
          <div className="bg-[#08112c] text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl">
            <div className="max-w-3xl mb-8">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Efisiensi Nyata Organisasi
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                Perbandingan: Alur Kerja Tradisional vs Menggunakan TeraDesk
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Traditional Way */}
              <div className="bg-white/5 border border-rose-500/25 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Cara Lama (Manual & Tercecer)</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Proposal dicetak berlembar-lembar, tanda tangan fisik memakan waktu 2-3 minggu.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Nomor surat sering ganda karena anggota mencatat di buku tulis atau chat WA.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Peminjaman kamera & alat tidak tercatat, barang rawan hilang tanpa penanggung jawab.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Arsip dan LPJ hilang saat pergantian kepengurusan periode berikutnya.</span>
                  </li>
                </ul>
              </div>

              {/* With TeraDesk */}
              <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Dengan TeraDesk (Efisien & Terpusat)</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Alur PAR digital berjenjang selesai dalam hitungan jam dengan e-signature legal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Generator nomor surat otomatis anti-bentrok, format langsung sesuai standar organisasi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Tracking status ketersediaan inventaris dan tanggal pengembalian aset 100% transparan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Cloud E-Arsip teratur abadi, memudahkan regenerasi kepengurusan baru.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FeaturesPortal;

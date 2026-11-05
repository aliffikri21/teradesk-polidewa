import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Users,
  Eye,
  CheckCircle2,
  Download,
  X,
  Trophy
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const initialActivities = [
  {
    id: 'ACT-2026-001',
    title: 'Workshop Desain Grafis & Creative Media SMK Negeri 1 Palopo',
    date: '18 Februari 2026',
    division: 'Divisi Publikasi dan Dokumentasi',
    category: 'Edukasi & Workshop',
    location: 'Lab Komputer & Multimedia SMKN 1 Palopo',
    participants: 85,
    budgetUsed: 'Rp 2.450.000',
    pic: 'Muhammad Farhan (Ketua Panitia)',
    status: 'Selesai & LPJ Disahkan',
    photo: '/images/img1.JPG',
    summary:
      'Pelatihan intensif pengenalan dasar desain grafis, ilustrasi vektor, dan workflow creative slicing untuk siswa SMK sebagai program pengabdian multimedia tahunan.',
    outcomes: [
      '85 siswa memperoleh sertifikat kompetensi dasar desain grafis',
      'Terjalin MoU kemitraan magang media sekolah dengan TERAMEDIA',
      'Pameran mini 24 karya poster kreatif siswa di akhir sesi workshop',
      'Tingkat kepuasan peserta mencapai 96.4% dari kuesioner evaluasi'
    ],
    lpjFile: 'LPJ_Workshop_Desain_2026_Approved.pdf',
    documentationUrl: '#'
  },
  {
    id: 'ACT-2026-002',
    title: 'Latihan Dasar Kepemimpinan (LDK) Kader Muda Angkatan VI',
    date: '25 Januari 2026',
    division: 'Divisi Kaderisasi & SDM',
    category: 'Kaderisasi',
    location: 'Bumi Perkemahan Wisata Alam Dewantara',
    participants: 124,
    budgetUsed: 'Rp 4.800.000',
    pic: 'Bagas Aditya (Kadiv Kaderisasi)',
    status: 'Selesai & LPJ Disahkan',
    photo: '/images/about/img2.webp',
    summary:
      'Pendidikan dan pelatihan karakter kepemimpinan, loyalitas organisasi, pemecahan masalah (problem solving), dan kebersamaan untuk kader baru TERAMEDIA.',
    outcomes: [
      '124 kader muda resmi dibaiat menjadi anggota aktif',
      'Penetapan pakta integritas dan komitmen keaktifan organisasi',
      'Simulasi manajemen sidang organisasi dan dasar advokasi mahasiswa'
    ],
    lpjFile: 'LPJ_LDK_Angkatan_VI_2026.pdf',
    documentationUrl: '#'
  },
  {
    id: 'ACT-2026-003',
    title: 'Musyawarah Besar (MUBES) Ke-V TERAMEDIA Politeknik Dewantara',
    date: '10 Januari 2026',
    division: 'BPH (Badan Pengurus Harian)',
    category: 'Musyawarah & Legalitas',
    location: 'Auditorium Kampus Politeknik Dewantara',
    participants: 156,
    budgetUsed: 'Rp 3.200.000',
    pic: 'Alif Fikri Haykal (Ketua Presidium)',
    status: 'Selesai & LPJ Disahkan',
    photo: '/images/about/img1.webp',
    summary:
      'Forum musyawarah tertinggi organisasi mahasiswa TERAMEDIA dalam rangka laporan pertanggungjawaban kepengurusan, amandemen AD/ART, dan pemilihan pengurus baru.',
    outcomes: [
      'Pengesahan LPJ kepengurusan periode sebelumnya dengan predikat diterima utuh',
      'Penyempurnaan 6 bab AD/ART keorganisasian digital terpadu',
      'Penetapan Ketua Umum dan formatur BPH periode 2026/2027'
    ],
    lpjFile: 'LPJ_MUBES_V_TERAMEDIA_Final.pdf',
    documentationUrl: '#'
  },
  {
    id: 'ACT-2026-004',
    title: 'Media Visit & Audiensi Publikasi ke Studio TVRI Sulawesi Selatan',
    date: '04 Maret 2026',
    division: 'Divisi Humas',
    category: 'Humas & Eksternal',
    location: 'Studio Utama TVRI Stasiun Sulsel, Makassar',
    participants: 35,
    budgetUsed: 'Rp 1.850.000',
    pic: 'Sarah Anggraini (Kadiv Humas)',
    status: 'Selesai & LPJ Disahkan',
    photo: '/images/about/img3.webp',
    summary:
      'Kunjungan studi industri penyiaran pertelevisian dan media digital, audiensi program magang mahasiswa multimedia, serta penjajakan kerja sama siaran kampus.',
    outcomes: [
      'Studi langsung alur kerja studio siaran multi-kamera & master control room',
      'Mendapatkan slot peliputan kegiatan kampus di segmen Berita Kampus TVRI',
      'Peluang kuota magang industri bersertifikat untuk 5 mahasiswa terpilih'
    ],
    lpjFile: 'LPJ_Media_Visit_TVRI_2026.pdf',
    documentationUrl: '#'
  },
  {
    id: 'ACT-2026-005',
    title: 'Peluncuran Pre-Order Official Merchandise & Jaket Angkatan KKM',
    date: '14 Februari 2026',
    division: 'Divisi KKM (Kewirausahaan)',
    category: 'Unit Bisnis & Usaha',
    location: 'Stand KKM Gazebo Multimedia',
    participants: 92,
    budgetUsed: 'Rp 6.100.000',
    pic: 'Rian Pratama (Kadiv KKM)',
    status: 'Selesai & LPJ Disahkan',
    photo: '/images/about/img4.webp',
    summary:
      'Produksi dan distribusi atribut resmi keorganisasian (jaket bomber, lanyard, ID card holder) sebagai sumber pendanaan mandiri kas divisi kewirausahaan.',
    outcomes: [
      '92 paket merchandise terdistribusi tepat waktu ke pengurus dan anggota',
      'Menghasilkan surplus laba bersih organisasi sebesar Rp 2.850.000',
      'Membangun identitas visual seragam kebanggaan anggota TERAMEDIA'
    ],
    lpjFile: 'LPJ_Merchandise_Batch1_2026.pdf',
    documentationUrl: '#'
  },
  {
    id: 'ACT-2026-006',
    title: 'Rapat Kerja Tahunan (Raker) & Sinkronisasi Timeline Master 2026',
    date: '20 Januari 2026',
    division: 'BPH & Kesekretariatan',
    category: 'Musyawarah & Legalitas',
    location: 'Ruang Rapat Bersama Lt. 2',
    participants: 48,
    budgetUsed: 'Rp 950.000',
    pic: 'Sekretariat Jenderal BPH',
    status: 'Selesai & LPJ Disahkan',
    photo: '/images/about/img5.webp',
    summary:
      'Penyusunan dan sinkronisasi 18 program kerja divisi, penentuan kalender roadmap, plotting anggaran kas, dan kesepakatan target capaian periode kepengurusan.',
    outcomes: [
      'Pengesahan Master Timeline 18 program kerja tahun 2026',
      'Alokasi pagu anggaran resmi masing-masing 6 divisi organisasi',
      'Penerbitan SK Program Kerja oleh Pembina Organisasi'
    ],
    lpjFile: 'LPJ_Raker_Tahunan_2026.pdf',
    documentationUrl: '#'
  }
];

const ActivityArchiveServicePage = (props) => {
  const [activities, setActivities] = useState(initialActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    date: '',
    division: 'BPH (Badan Pengurus Harian)',
    category: 'Edukasi & Workshop',
    location: '',
    participants: '',
    budgetUsed: '',
    pic: '',
    summary: '',
    outcomes: ''
  });

  const divisions = [
    'Semua',
    'BPH (Badan Pengurus Harian)',
    'Divisi Publikasi dan Dokumentasi',
    'Divisi Humas',
    'Divisi Kaderisasi & SDM',
    'Divisi KKM (Kewirausahaan)',
    'BPH & Kesekretariatan'
  ];

  const categories = [
    'Semua',
    'Edukasi & Workshop',
    'Kaderisasi',
    'Musyawarah & Legalitas',
    'Humas & Eksternal',
    'Unit Bisnis & Usaha'
  ];

  const filteredActivities = activities.filter((act) => {
    const matchDiv = selectedDivision === 'Semua' || act.division === selectedDivision;
    const matchCat = selectedCategory === 'Semua' || act.category === selectedCategory;
    const matchSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDiv && matchCat && matchSearch;
  });

  const totalParticipants = activities.reduce((sum, act) => sum + (act.participants || 0), 0);

  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.date) return;

    const outcomesArray = newActivity.outcomes
      ? newActivity.outcomes.split('\n').filter((line) => line.trim().length > 0)
      : ['Kegiatan terlaksana dengan baik sesuai proposal'];

    const created = {
      id: `ACT-2026-00${activities.length + 1}`,
      title: newActivity.title,
      date: newActivity.date,
      division: newActivity.division,
      category: newActivity.category,
      location: newActivity.location || 'Kampus Politeknik Dewantara',
      participants: parseInt(newActivity.participants, 10) || 40,
      budgetUsed: newActivity.budgetUsed || 'Rp 1.000.000',
      pic: newActivity.pic || (props.authUser?.name || 'Pengurus Terdaftar'),
      status: 'Selesai & LPJ Disahkan',
      photo: '/images/about/img1.webp',
      summary: newActivity.summary || 'Dokumentasi arsip kegiatan terlaksana.',
      outcomes: outcomesArray,
      lpjFile: `LPJ_${newActivity.title.slice(0, 15).replace(/\s+/g, '_')}_2026.pdf`,
      documentationUrl: '#'
    };

    setActivities([created, ...activities]);
    setIsAddModalOpen(false);
    setNewActivity({
      title: '',
      date: '',
      division: 'BPH (Badan Pengurus Harian)',
      category: 'Edukasi & Workshop',
      location: '',
      participants: '',
      budgetUsed: '',
      pic: '',
      summary: '',
      outcomes: ''
    });
  };

  return (
    <ServicePageLayout
      serviceId="activity"
      title="Arsip Kegiatan & Dokumentasi Terlaksana"
      category="Semua Divisi & Lintas Organisasi"
      badge="Akses Terbuka Semua Divisi"
      icon={CalendarCheck}
      {...props}
    >
      {/* =========================================================================
          KEY STATS CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Kegiatan Terlaksana</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {activities.length} Agenda
          </div>
          <p className="text-[11px] text-slate-400">Tercatat dalam arsip digital 2026</p>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Total Peserta & Audiens</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-1">
            {totalParticipants}+ Orang
          </div>
          <p className="text-[11px] text-slate-400">Kader, mahasiswa & mitra</p>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">LPJ Resmi Disahkan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mb-1">
            100%
          </div>
          <p className="text-[11px] text-slate-400">BPH, Pembina & Pengawas</p>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Akses Kolaboratif</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mb-1">
            Semua Divisi
          </div>
          <p className="text-[11px] text-slate-400">Setiap pengurus dapat meninjau</p>
        </div>
      </div>

      {/* =========================================================================
          CONTROLS: Search, Filters, & Add Activity Button
          ========================================================================= */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kegiatan, lokasi, panitia, atau kata kunci..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Tambah Arsip Kegiatan</span>
          </button>
        </div>

        {/* Category & Division Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Filter size={13} />
              <span>Kategori:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <span>Divisi:</span>
            </span>
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDivision === div
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ACTIVITIES GRID (Clean Cards with Photo & Details)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredActivities.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
            <CalendarCheck size={40} className="mx-auto text-slate-400 mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">Tidak Ada Arsip Kegiatan Ditemukan</h4>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau bersihkan filter divisi.</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white border border-slate-200/80 hover:border-blue-400/50 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between group shadow-xs"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="w-full h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={act.photo}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">
                    {act.category}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 size={12} />
                    <span>{act.status}</span>
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-bold text-blue-600 mb-1">{act.division}</div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                    {act.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 my-3 font-normal">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span>{act.date}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-slate-400 shrink-0" />
                      <span>{act.participants} Partisipan Terdata</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {act.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100">
                <button
                  onClick={() => setSelectedActivity(act)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eye size={14} />
                  <span>Lihat Detail Kegiatan</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================================
          MODAL DETAIL KEGIATAN TERLAKSANA
          ========================================================================= */}
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-slate-900 max-h-[90vh] overflow-y-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Tutup detail kegiatan"
            >
              <X size={16} />
            </button>

            {/* Modal Header Image */}
            <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden relative mb-5 bg-slate-100 border border-slate-200">
              <img
                src={selectedActivity.photo}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-xs font-bold text-white shadow-md">
                  {selectedActivity.category}
                </span>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                  <CheckCircle2 size={13} />
                  <span>{selectedActivity.status}</span>
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="text-xs font-bold text-blue-600 mb-1">{selectedActivity.division}</div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 leading-snug">
              {selectedActivity.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs mb-5">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Waktu Pelaksanaan</span>
                <span className="font-bold text-slate-900">{selectedActivity.date}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Lokasi Kegiatan</span>
                <span className="font-bold text-slate-900 truncate block">{selectedActivity.location}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Total Partisipan</span>
                <span className="font-bold text-blue-600">{selectedActivity.participants} Orang</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Realisasi Biaya</span>
                <span className="font-bold text-emerald-600">{selectedActivity.budgetUsed}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Ringkasan Pelaksanaan Kegiatan
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {selectedActivity.summary}
              </p>
            </div>

            {/* Outcomes & Capaian */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" />
                <span>Pencapaian & Output Utama</span>
              </h4>
              <ul className="space-y-2">
                {selectedActivity.outcomes.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer LPJ & PIC */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                <span className="block text-[11px] font-medium">Penanggung Jawab / PIC:</span>
                <span className="font-bold text-slate-900">{selectedActivity.pic}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh berkas resmi: ${selectedActivity.lpjFile}`)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
                >
                  <Download size={14} />
                  <span>Unduh Dokumen LPJ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL TAMBAH ARSIP KEGIATAN BARU
          ========================================================================= */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-slate-900 select-none max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                Formulir Arsip Digital
              </span>
              <h3 className="text-xl font-black text-slate-900">Catat Kegiatan Terlaksana</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tambahkan dokumentasi kegiatan divisi yang sudah selesai agar dapat diakses semua pengurus.
              </p>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Kegiatan</label>
                <input
                  type="text"
                  required
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="Contoh: Diskusi Panel Multimedia & Industri Kreatif"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    required
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    placeholder="Contoh: 12 April 2026"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori Kegiatan</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  >
                    <option value="Edukasi & Workshop">Edukasi & Workshop</option>
                    <option value="Kaderisasi">Kaderisasi</option>
                    <option value="Musyawarah & Legalitas">Musyawarah & Legalitas</option>
                    <option value="Humas & Eksternal">Humas & Eksternal</option>
                    <option value="Unit Bisnis & Usaha">Unit Bisnis & Usaha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Divisi Penyelenggara</label>
                  <select
                    value={newActivity.division}
                    onChange={(e) => setNewActivity({ ...newActivity, division: e.target.value })}
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  >
                    <option value="BPH (Badan Pengurus Harian)">BPH (Badan Pengurus Harian)</option>
                    <option value="Divisi Publikasi dan Dokumentasi">Divisi Publikasi dan Dokumentasi</option>
                    <option value="Divisi Humas">Divisi Humas</option>
                    <option value="Divisi Kaderisasi & SDM">Divisi Kaderisasi & SDM</option>
                    <option value="Divisi KKM (Kewirausahaan)">Divisi KKM (Kewirausahaan)</option>
                    <option value="BPH & Kesekretariatan">BPH & Kesekretariatan</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={newActivity.location}
                    onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                    placeholder="Contoh: Gedung Multimedia"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jumlah Partisipan</label>
                  <input
                    type="number"
                    value={newActivity.participants}
                    onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
                    placeholder="Contoh: 65"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Realisasi Biaya</label>
                  <input
                    type="text"
                    value={newActivity.budgetUsed}
                    onChange={(e) => setNewActivity({ ...newActivity, budgetUsed: e.target.value })}
                    placeholder="Contoh: Rp 1.500.000"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ringkasan Pelaksanaan</label>
                <textarea
                  rows={2}
                  value={newActivity.summary}
                  onChange={(e) => setNewActivity({ ...newActivity, summary: e.target.value })}
                  placeholder="Ceritakan gambaran alur dan keberhasilan kegiatan..."
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Output / Capaian (Pisahkan Baris)</label>
                <textarea
                  rows={2}
                  value={newActivity.outcomes}
                  onChange={(e) => setNewActivity({ ...newActivity, outcomes: e.target.value })}
                  placeholder="Contoh:&#10;- 65 Peserta menguasai materi&#10;- Sertifikat ber-barcode terbit"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-3"
              >
                Simpan ke Arsip Kegiatan
              </button>
            </form>
          </div>
        </div>
      )}
    </ServicePageLayout>
  );
};

export default ActivityArchiveServicePage;

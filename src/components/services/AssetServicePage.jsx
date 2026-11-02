import React, { useState } from 'react';
import {
  Boxes,
  Search,
  CheckCircle2,
  Clock,
  Send,
  MapPin,
  Tag,
  Filter,
  Check,
  RotateCcw,
  Building
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const initialAssets = [
  {
    id: 'AST-001',
    name: 'Kamera Mirrorless Sony A7 Mark III',
    category: 'Multimedia & Dokumentasi',
    code: 'AST/MED/CAM-01',
    status: 'Tersedia',
    condition: 'Sangat Baik (100%)',
    location: 'Lemari Inventaris Medinfo',
    borrower: null,
    returnDate: null,
  },
  {
    id: 'AST-002',
    name: 'Proyektor Epson EB-X500 3600 Lumens',
    category: 'Peralatan Acara',
    code: 'AST/LOG/PRJ-02',
    status: 'Dipinjam',
    condition: 'Baik',
    location: 'Gedung Serbaguna',
    borrower: 'Farhan (Panitia Workshop)',
    returnDate: 'Besok, 18:00 WIB',
  },
  {
    id: 'AST-003',
    name: 'Wireless Microphone Set (2 Mic + Receiver)',
    category: 'Sound System',
    code: 'AST/LOG/MIC-05',
    status: 'Tersedia',
    condition: 'Normal',
    location: 'Kotak Audio Sekretariat',
    borrower: null,
    returnDate: null,
  },
  {
    id: 'AST-004',
    name: 'Ruang Rapat Utama Sekretariat',
    category: 'Fasilitas & Ruangan',
    code: 'AST/FAC/ROOM-01',
    status: 'Tersedia',
    condition: 'Kapasitas 25 Orang, AC Dingin',
    location: 'Sekretariat Pusat Lantai 2',
    borrower: null,
    returnDate: null,
  },
  {
    id: 'AST-005',
    name: 'Gimbal Stabilizer DJI Ronin-SC',
    category: 'Multimedia & Dokumentasi',
    code: 'AST/MED/GMB-03',
    status: 'Dipinjam',
    condition: 'Baik',
    location: 'Studio Media',
    borrower: 'Gilang (Divisi Humas)',
    returnDate: 'Hari Ini, 20:00 WIB',
  },
  {
    id: 'AST-006',
    name: 'Portable Speaker Active 15 Inch + Stand',
    category: 'Sound System',
    code: 'AST/LOG/SPK-01',
    status: 'Tersedia',
    condition: 'Sangat Baik',
    location: 'Gudang Perlengkapan',
    borrower: null,
    returnDate: null,
  },
  {
    id: 'AST-007',
    name: 'Lighting Studio Godox SL60W + Softbox',
    category: 'Multimedia & Dokumentasi',
    code: 'AST/MED/LGT-02',
    status: 'Dalam Perawatan',
    condition: 'Penggantian Kabel Power',
    location: 'Service Center',
    borrower: null,
    returnDate: null,
  },
];

const AssetServicePage = (props) => {
  const [activeTab, setActiveTab] = useState('katalog'); // 'katalog' | 'booking' | 'log' | 'jadwal'
  const [assets, setAssets] = useState(initialAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    assetId: initialAssets[0].id,
    borrowerName: '',
    division: 'Divisi Media & Informasi',
    purpose: '',
    startDate: '',
    endDate: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const categories = [
    'Semua',
    'Multimedia & Dokumentasi',
    'Peralatan Acara',
    'Sound System',
    'Fasilitas & Ruangan',
  ];

  const filteredAssets = assets.filter((item) => {
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.borrowerName || !bookingForm.purpose) return;

    // Update asset status to 'Dipinjam'
    setAssets((prev) =>
      prev.map((ast) =>
        ast.id === bookingForm.assetId
          ? {
              ...ast,
              status: 'Dipinjam',
              borrower: `${bookingForm.borrowerName} (${bookingForm.division})`,
              returnDate: bookingForm.endDate || 'Besok',
            }
          : ast
      )
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveTab('log');
      setBookingForm({
        assetId: initialAssets[0].id,
        borrowerName: '',
        division: 'Divisi Media & Informasi',
        purpose: '',
        startDate: '',
        endDate: '',
      });
    }, 1200);
  };

  const handleReturnAsset = (assetId) => {
    setAssets((prev) =>
      prev.map((ast) =>
        ast.id === assetId
          ? {
              ...ast,
              status: 'Tersedia',
              borrower: null,
              returnDate: null,
            }
          : ast
      )
    );
  };

  const handleStartBooking = (assetId) => {
    setBookingForm((prev) => ({ ...prev, assetId }));
    setActiveTab('booking');
  };

  const borrowedAssets = assets.filter((ast) => ast.status === 'Dipinjam');

  return (
    <ServicePageLayout
      serviceId="asset"
      title="Digitalisasi Aset & Inventaris"
      category="Operasional & Aset"
      badge="Modul Inti"
      icon={Boxes}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Total Aset Organisasi</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {assets.length + 41}
          </div>
          <p className="text-[11px] text-gray-400">Tercatat dengan kode barcode fisik</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Aset Tersedia (Siap Pakai)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            {assets.filter((a) => a.status === 'Tersedia').length + 35}
          </div>
          <p className="text-[11px] text-gray-400">Siap dipinjam via portal</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Sedang Dipinjam</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-1">
            {borrowedAssets.length}
          </div>
          <p className="text-[11px] text-gray-400">Dalam masa pinjam aktif</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Perawatan / Servis</span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mb-1">
            {assets.filter((a) => a.status === 'Dalam Perawatan').length}
          </div>
          <p className="text-[11px] text-gray-400">Dalam jadwal pemeliharaan</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'katalog'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Boxes size={16} />
          <span>Katalog & Ketersediaan Aset</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'booking'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send size={16} />
          <span>Formulir Peminjaman Alat</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'log'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <RotateCcw size={16} />
          <span>Log Pinjam & Pengembalian ({borrowedAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'jadwal'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building size={16} />
          <span>Jadwal Ruang Rapat</span>
        </button>
      </div>

      {/* Tab 1: Katalog */}
      {activeTab === 'katalog' && (
        <div className="space-y-6">
          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama aset, kode inventaris, atau lokasi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <Filter size={15} className="text-gray-400 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((ast) => {
              const isAvailable = ast.status === 'Tersedia';
              const isInRepair = ast.status === 'Dalam Perawatan';

              return (
                <div
                  key={ast.id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {ast.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isInRepair
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {ast.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {ast.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">{ast.category}</p>

                    <div className="space-y-2 text-xs text-gray-300 border-t border-white/5 pt-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} className="text-amber-400 shrink-0" />
                        <span className="truncate">{ast.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Tag size={14} className="text-blue-400 shrink-0" />
                        <span className="truncate">Kondisi: {ast.condition}</span>
                      </div>
                      {ast.borrower && (
                        <div className="flex items-center gap-2 text-amber-300 font-medium">
                          <Clock size={14} className="shrink-0" />
                          <span className="truncate">Dipinjam: {ast.borrower}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {isAvailable ? (
                      <button
                        onClick={() => handleStartBooking(ast.id)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        <span>Ajukan Peminjaman</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-white/5 text-gray-400 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-not-allowed border border-white/10"
                      >
                        {isInRepair ? 'Sedang Diservis' : 'Sedang Dipakai'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="py-12 text-center text-gray-400 bg-white/5 border border-white/10 rounded-3xl">
              <Boxes size={36} className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm font-semibold">Tidak ditemukan aset yang cocok dengan filter Anda.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Formulir Booking */}
      {activeTab === 'booking' && (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Formulir Peminjaman Aset & Ruangan Organisasi
            </h2>
            <p className="text-xs text-gray-400">
              Setiap peminjaman wajib mencantumkan penanggung jawab dan tujuan kegiatan demi akuntabilitas inventaris.
            </p>
          </div>

          {bookingSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Booking Aset Berhasil Diterbitkan!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Status barang telah diperbarui ke sistem dan penanggung jawab inventaris telah diberitahu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Pilih Aset yang Ingin Dipinjam <span className="text-rose-400">*</span>
                </label>
                <select
                  value={bookingForm.assetId}
                  onChange={(e) => setBookingForm({ ...bookingForm, assetId: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {assets
                    .filter((a) => a.status === 'Tersedia' || a.id === bookingForm.assetId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.code}) - {a.location}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nama Peminjam (Penanggung Jawab) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Farhan"
                    value={bookingForm.borrowerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, borrowerName: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Divisi / Panitia
                  </label>
                  <select
                    value={bookingForm.division}
                    onChange={(e) => setBookingForm({ ...bookingForm, division: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Divisi Media & Informasi">Divisi Media & Informasi</option>
                    <option value="Divisi Kaderisasi & SDM">Divisi Kaderisasi & SDM</option>
                    <option value="Divisi Minat & Bakat">Divisi Minat & Bakat</option>
                    <option value="Panitia LDK 2026">Panitia LDK 2026</option>
                    <option value="Panitia Dies Natalis">Panitia Dies Natalis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Tanggal & Waktu Mulai Pakai
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 15 Nov 2026, 08:00 WIB"
                    value={bookingForm.startDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Estimasi Tanggal Pengembalian
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 17 Nov 2026, 18:00 WIB"
                    value={bookingForm.endDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Tujuan Penggunaan & Nama Kegiatan <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Digunakan untuk peliputan video aftermovie kegiatan LDK di Aula Kampus..."
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('katalog')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Check size={16} />
                  <span>Konfirmasi Peminjaman Aset</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Log Pinjam Aktif */}
      {activeTab === 'log' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Log Peminjaman Aset yang Sedang Berjalan</h3>
                <p className="text-xs text-gray-400">Tekan tombol kembalikan saat alat telah selesai dipakai dan diperiksa fisiknya.</p>
              </div>
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full font-semibold">
                {borrowedAssets.length} Unit Aktif Dipinjam
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">Kode & Nama Aset</th>
                    <th className="py-4 px-6">Peminjam (PIC)</th>
                    <th className="py-4 px-6">Tenggat Waktu Kembali</th>
                    <th className="py-4 px-6">Kondisi Alat</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {borrowedAssets.map((ast) => (
                    <tr key={ast.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-amber-300">{ast.code}</span>
                        <p className="font-bold text-white text-xs sm:text-sm mt-0.5">{ast.name}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-200 font-semibold">
                        {ast.borrower || 'Panitia Acara'}
                      </td>
                      <td className="py-4 px-6 text-amber-300 font-mono font-medium">
                        {ast.returnDate || 'Besok'}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {ast.condition}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleReturnAsset(ast.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold transition-all text-xs cursor-pointer border border-emerald-500/30"
                        >
                          Tandai Telah Kembali
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {borrowedAssets.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Semua aset telah berada di tempat penyimpanan!</p>
                <p className="text-xs text-gray-400 mt-1">Tidak ada peminjaman yang tertunda saat ini.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Jadwal Ruang Rapat */}
      {activeTab === 'jadwal' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Building size={22} className="text-amber-400" />
              <span>Jadwal Penggunaan Ruang Rapat Sekretariat</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Mencegah tabrakan jadwal rapat antar divisi dengan plotting visual transparan.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-semibold">
                    14:00 - 16:30 WIB
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">Rapat Koordinasi BPH Terbatas</h4>
                  <p className="text-xs text-gray-400">Penanggung Jawab: Sekretaris Umum</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold">Sedang Berlangsung</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                    19:00 - 21:00 WIB
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">Briefing Panitia Pelaksana LDK 2026</h4>
                  <p className="text-xs text-gray-400">Penanggung Jawab: Fajar (Ketupat)</p>
                </div>
                <span className="text-xs text-amber-300 font-bold">Terjadwal Hari Ini</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </ServicePageLayout>
  );
};

export default AssetServicePage;

import React, { useState, useEffect } from 'react';
import {
  X,
  Boxes,
  Search,
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  MapPin,
  Tag
} from 'lucide-react';

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
    code: 'FAC/SEKR-01',
    status: 'Dipinjam',
    condition: 'AC Normal / Kapasitas 25 Orang',
    location: 'Lantai 2 Gedung Student Center',
    borrower: 'BPH (Rapat Evaluasi Triwulan)',
    returnDate: 'Hari Ini, 20:00 WIB',
  },
  {
    id: 'AST-005',
    name: 'Tripod Video Heavy Duty Takara',
    category: 'Multimedia & Dokumentasi',
    code: 'AST/MED/TRP-01',
    status: 'Tersedia',
    condition: 'Sangat Baik',
    location: 'Lemari Inventaris Medinfo',
    borrower: null,
    returnDate: null,
  },
  {
    id: 'AST-006',
    name: 'Roll Banner & Backwall Frame Portable',
    category: 'Dekorasi & Display',
    code: 'AST/LOG/BNR-03',
    status: 'Maintenance',
    condition: 'Kaitan Bawah Perlu Diperbaiki',
    location: 'Gudang Logistik',
    borrower: null,
    returnDate: null,
  },
];

const AssetModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('katalog'); // 'katalog' | 'pinjam'
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['Semua', 'Multimedia & Dokumentasi', 'Peralatan Acara', 'Sound System', 'Fasilitas & Ruangan'];

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

    // Update asset status
    setAssets((prev) =>
      prev.map((ast) => {
        if (ast.id === bookingForm.assetId) {
          return {
            ...ast,
            status: 'Dipinjam',
            borrower: `${bookingForm.borrowerName} (${bookingForm.division})`,
            returnDate: bookingForm.endDate || 'Selesai Kegiatan',
          };
        }
        return ast;
      })
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveTab('katalog');
    }, 1500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-modal-title"
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-[#070B19] text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Boxes size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="asset-modal-title" className="font-bold text-lg text-white">Digitalisasi Aset & Inventaris</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold px-2 py-0.5 rounded-full">
                  Tracking Real-time
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Pencatatan ketersediaan barang, peminjaman alat kegiatan, dan kontrol kondisi aset organisasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 sm:px-8 pt-4 pb-2 bg-gray-50 border-b border-gray-200 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'katalog'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            📦 Katalog Aset & Ruangan ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('pinjam')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'pinjam'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            + Form Pengajuan Peminjaman Alat
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grow space-y-5">
          
          {/* TAB 1: KATALOG ASET */}
          {activeTab === 'katalog' && (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama barang, kode inventaris, atau lokasi..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssets.map((asset) => {
                  const isAvailable = asset.status === 'Tersedia';
                  const isBorrowed = asset.status === 'Dipinjam';

                  return (
                    <div
                      key={asset.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Status Badge & Code */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            {asset.code}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : isBorrowed
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}
                          >
                            {asset.status}
                          </span>
                        </div>

                        {/* Title */}
                        <h5 className="font-bold text-sm text-slate-900 mb-1">{asset.name}</h5>
                        <p className="text-xs text-blue-700 font-semibold mb-3">{asset.category}</p>

                        {/* Meta info */}
                        <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="text-gray-400 shrink-0" />
                            <span>Lokasi: <strong>{asset.location}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag size={13} className="text-gray-400 shrink-0" />
                            <span>Kondisi: {asset.condition}</span>
                          </div>
                          {isBorrowed && (
                            <div className="flex items-center gap-2 text-amber-800 font-medium">
                              <Clock size={13} className="shrink-0" />
                              <span>Dipinjam: {asset.borrower} (Kembali: {asset.returnDate})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div>
                        {isAvailable ? (
                          <button
                            onClick={() => {
                              setBookingForm({ ...bookingForm, assetId: asset.id });
                              setActiveTab('pinjam');
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Ajukan Peminjaman Aset Ini
                          </button>
                        ) : (
                          <div className="text-center py-1.5 text-xs text-gray-400 font-medium">
                            {isBorrowed ? 'Sedang Digunakan' : 'Perbaikan / Maintenance'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 2: FORM PINJAM */}
          {activeTab === 'pinjam' && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {bookingSuccess ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">Permohonan Peminjaman Terkirim!</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Kunci/alat dapat diambil di divisi Logistik setelah menunjukkan kode bukti persetujuan ini.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-blue-900 leading-relaxed">
                      Sistem inventaris digital mencatat penanggung jawab peminjaman secara transparan. Segala kerusakan atau keterlambatan pengembalian akan terlacak pada log anggota.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Pilih Aset / Ruangan *</label>
                      <select
                        value={bookingForm.assetId}
                        onChange={(e) => setBookingForm({ ...bookingForm, assetId: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-medium"
                      >
                        {assets.map((item) => (
                          <option key={item.id} value={item.id} disabled={item.status !== 'Tersedia'}>
                            {item.name} {item.status !== 'Tersedia' ? `(${item.status})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Peminjam (PIC) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dimas Aditya"
                        value={bookingForm.borrowerName}
                        onChange={(e) => setBookingForm({ ...bookingForm, borrowerName: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Divisi Pemohon</label>
                      <select
                        value={bookingForm.division}
                        onChange={(e) => setBookingForm({ ...bookingForm, division: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-medium"
                      >
                        <option>Divisi Media & Informasi</option>
                        <option>Divisi Kaderisasi & SDM</option>
                        <option>Divisi Minat & Bakat</option>
                        <option>Divisi Humas & Eksternal</option>
                        <option>BPH & Kesekretariatan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Batas Pengembalian *</label>
                      <input
                        type="datetime-local"
                        value={bookingForm.endDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Keperluan & Nama Acara *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Jelaskan untuk kegiatan apa alat ini digunakan (contoh: Liputan Pelantikan Pengurus Baru)..."
                      value={bookingForm.purpose}
                      onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-medium"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('katalog')}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Send size={15} />
                      <span>Ajukan Peminjaman</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 shrink-0">
          <span>Pengembalian tepat waktu menjaga kelancaran proker divisi lain.</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssetModal;

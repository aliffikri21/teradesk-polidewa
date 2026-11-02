import React, { useState, useEffect } from 'react';
import {
  X,
  FolderArchive,
  Search,
  Download,
  Eye,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react';

const sampleDocs = [
  {
    id: 'DOC-01',
    number: '001/SK-BPH/TERA/I/2026',
    title: 'Surat Keputusan Struktur Kepengurusan Periode 2026/2027',
    category: 'SK & Legalitas',
    author: 'Ketua Umum & Sekjen',
    date: '10 Jan 2026',
    size: '1.4 MB',
    type: 'PDF',
  },
  {
    id: 'DOC-02',
    number: '042/UND-EKST/TERA/III/2026',
    title: 'Surat Undangan Kolaborasi Studi Banding BEM Se-Kota',
    category: 'Surat Keluar',
    author: 'Divisi Humas',
    date: '18 Mar 2026',
    size: '420 KB',
    type: 'PDF',
  },
  {
    id: 'DOC-03',
    number: '015/TOR-PROG/KDR/2026',
    title: 'Proposal & Silabus Latihan Dasar Kepemimpinan (LDK)',
    category: 'Proposal & TOR',
    author: 'Divisi Kaderisasi',
    date: '02 Apr 2026',
    size: '3.1 MB',
    type: 'DOCX',
  },
  {
    id: 'DOC-04',
    number: '088/LPJ-FIN/BEND/2026',
    title: 'Laporan Pertanggungjawaban (LPJ) Akhir Semester Ganjil',
    category: 'LPJ & Keuangan',
    author: 'Bendahara Umum',
    date: '15 Mei 2026',
    size: '5.2 MB',
    type: 'PDF',
  },
  {
    id: 'DOC-05',
    number: '022/NOTULA/BPH/VI/2026',
    title: 'Notula Rapat Koordinasi Tengah Tahun & Evaluasi Kinerja',
    category: 'Notula Rapat',
    author: 'Sekretaris 1',
    date: '20 Jun 2026',
    size: '680 KB',
    type: 'PDF',
  },
];

const ArchiveModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'generator'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [copied, setCopied] = useState(false);

  // Auto Numbering State
  const [generatorData, setGeneratorData] = useState({
    docType: 'UND', // Surat Undangan
    division: 'BEM',
    month: 'XI',
    year: '2026',
    customSeq: '043',
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['Semua', 'SK & Legalitas', 'Surat Keluar', 'Proposal & TOR', 'LPJ & Keuangan', 'Notula Rapat'];

  const filteredDocs = sampleDocs.filter((doc) => {
    const matchesCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const generatedCode = `${generatorData.customSeq}/${generatorData.docType}-${generatorData.division}/TERA/${generatorData.month}/${generatorData.year}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        aria-labelledby="archive-modal-title"
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-[#070B19] text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FolderArchive size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="archive-modal-title" className="font-bold text-lg text-white">Digitalisasi Arsip dan Persuratan</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold px-2 py-0.5 rounded-full">
                  E-Arsip Terpusat
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Penyimpanan aman surat, proposal, LPJ, dan generator penomoran surat otomatis
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
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            📁 Repositori Arsip Dokumen
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            ⚡ Generator Nomor Surat Otomatis
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grow space-y-5">
          
          {/* TAB 1: EXPLORER ARSIP */}
          {activeTab === 'explorer' && (
            <>
              {/* Search & Categories */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul arsip, nomor surat, atau penanggung jawab..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {categories.slice(0, 4).map((cat) => (
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

              {/* Documents List */}
              <div className="space-y-3">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    Tidak ada dokumen arsip yang cocok dengan pencarian.
                  </div>
                ) : (
                  filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                          {doc.type}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                              {doc.number}
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              {doc.category}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {doc.title}
                          </h5>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Diunggah oleh: <strong className="text-gray-700">{doc.author}</strong> • Tanggal: {doc.date} • Ukuran: {doc.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => alert(`Membuka preview dokumen ${doc.title}`)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => alert(`Mengunduh dokumen ${doc.number}`)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* TAB 2: GENERATOR NOMOR SURAT */}
          {activeTab === 'generator' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={14} />
                  <span>Solusi Bebas Bentrok Nomor Surat</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Penomoran Surat Baku Organisasi Otomatis</h4>
                <p className="text-xs text-gray-200 leading-relaxed max-w-xl">
                  Anggota divisi tidak perlu lagi menanyakan nomor surat berikutnya ke Sekretaris secara manual di chat WhatsApp. Sistem secara otomatis mencatat dan mengunci urutan nomor.
                </p>
              </div>

              {/* Generator Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Jenis Surat</label>
                  <select
                    value={generatorData.docType}
                    onChange={(e) => setGeneratorData({ ...generatorData, docType: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-medium"
                  >
                    <option value="UND">Surat Undangan (UND)</option>
                    <option value="ST">Surat Tugas (ST)</option>
                    <option value="PMH">Surat Permohonan (PMH)</option>
                    <option value="SK">Surat Keputusan (SK)</option>
                    <option value="KTR">Surat Keterangan (KTR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Divisi / Instansi</label>
                  <select
                    value={generatorData.division}
                    onChange={(e) => setGeneratorData({ ...generatorData, division: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-medium"
                  >
                    <option value="BEM">BPH / Pusat (BEM)</option>
                    <option value="KDR">Divisi Kaderisasi (KDR)</option>
                    <option value="MED">Media dan Info (MED)</option>
                    <option value="HMS">Humas dan Jaringan (HMS)</option>
                    <option value="DANUS">Dana Usaha (DANUS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Bulan (Romawi)</label>
                  <select
                    value={generatorData.month}
                    onChange={(e) => setGeneratorData({ ...generatorData, month: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-medium"
                  >
                    <option value="I">I (Januari)</option>
                    <option value="II">II (Februari)</option>
                    <option value="III">III (Maret)</option>
                    <option value="IV">IV (April)</option>
                    <option value="V">V (Mei)</option>
                    <option value="VI">VI (Juni)</option>
                    <option value="VII">VII (Juli)</option>
                    <option value="VIII">VIII (Agustus)</option>
                    <option value="IX">IX (September)</option>
                    <option value="X">X (Oktober)</option>
                    <option value="XI">XI (November)</option>
                    <option value="XII">XII (Desember)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Nomor Urut Terakhir</label>
                  <input
                    type="text"
                    value={generatorData.customSeq}
                    onChange={(e) => setGeneratorData({ ...generatorData, customSeq: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Generated Result Box */}
              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                    Format Nomor Surat Ter-Generate
                  </span>
                  <div className="text-lg sm:text-xl font-mono font-black text-slate-900 tracking-wide">
                    {generatedCode}
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Nomor Surat'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 shrink-0">
          <span>Hak akses dokumen dikunci sesuai perizinan divisi masing-masing.</span>
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

export default ArchiveModal;

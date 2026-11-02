import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Download,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  UploadCloud,
  Hash,
  Filter,
  BookOpen
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

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
  {
    id: 'DOC-06',
    number: '012/ST-DELEG/TERA/VII/2026',
    title: 'Surat Tugas Delegasi Kongres Mahasiswa Nasional',
    category: 'Surat Keluar',
    author: 'Sekretariat BPH',
    date: '05 Jul 2026',
    size: '510 KB',
    type: 'PDF',
  },
];

const ArchiveServicePage = (props) => {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'generator' | 'upload' | 'struktur'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [copied, setCopied] = useState(false);
  const [docList, setDocList] = useState(sampleDocs);

  // Auto Numbering State
  const [generatorData, setGeneratorData] = useState({
    docType: 'UND',
    division: 'BEM',
    month: 'XI',
    year: '2026',
    customSeq: '043',
    purpose: '',
  });

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Surat Keluar',
    author: '',
    number: '',
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    'Semua',
    'SK & Legalitas',
    'Surat Keluar',
    'Proposal & TOR',
    'LPJ & Keuangan',
    'Notula Rapat',
  ];

  const filteredDocs = docList.filter((doc) => {
    const matchesCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const generatedCode = `${generatorData.customSeq}/${generatorData.docType}-${generatorData.division}/TERA/${generatorData.month}/${generatorData.year}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.title) return;

    const newDoc = {
      id: `DOC-0${docList.length + 1}`,
      number: uploadForm.number || generatedCode,
      title: uploadForm.title,
      category: uploadForm.category,
      author: uploadForm.author || 'Sekretariat',
      date: 'Hari ini',
      size: '1.2 MB',
      type: 'PDF',
    };

    setDocList([newDoc, ...docList]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('explorer');
      setUploadForm({
        title: '',
        category: 'Surat Keluar',
        author: '',
        number: '',
      });
    }, 1200);
  };

  return (
    <ServicePageLayout
      serviceId="archive"
      title="Digitalisasi Arsip & Persuratan"
      category="Administrasi & Legalitas"
      badge="Modul Inti"
      icon={FolderArchive}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Total Dokumen E-Arsip</span>
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            1.240
          </div>
          <p className="text-[11px] text-gray-400">Tersimpan aman di cloud terenkripsi</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Surat Keluar 2026</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">
            184
          </div>
          <p className="text-[11px] text-gray-400">Tercatat di generator nomor</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">SK & Sertifikasi</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            42
          </div>
          <p className="text-[11px] text-gray-400">Memiliki barcode verifikasi</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Akurasi Penomoran</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            100%
          </div>
          <p className="text-[11px] text-gray-400">Nol insiden nomor surat ganda</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'explorer'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderArchive size={16} />
          <span>Repositori E-Arsip Dokumen</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Hash size={16} />
          <span>Generator Nomor Surat Otomatis</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <UploadCloud size={16} />
          <span>Unggah / Catat Arsip Baru</span>
        </button>

        <button
          onClick={() => setActiveTab('struktur')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'struktur'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen size={16} />
          <span>Format Baku Penomoran</span>
        </button>
      </div>

      {/* Tab 1: Explorer */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor surat, judul dokumen, atau nama pembuat..."
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

          {/* Documents Table */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">Nomor Dokumen & Judul</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Pembuat / Divisi</th>
                    <th className="py-4 px-6">Tanggal & Ukuran</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {doc.number}
                        </span>
                        <p className="font-bold text-white text-xs sm:text-sm mt-1">{doc.title}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[11px] bg-white/10 text-gray-200 px-2.5 py-1 rounded-full font-medium">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300 font-medium">
                        {doc.author}
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-[11px]">
                        <p>{doc.date}</p>
                        <p className="font-mono text-gray-500">{doc.size} ({doc.type})</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Pratinjau Dokumen"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            title="Unduh Berkas"
                            className="p-2 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocs.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <FolderArchive size={36} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-semibold">Tidak ditemukan berkas arsip yang cocok.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Generator Penomoran Surat */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Generator Form */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white mb-1">
                Generator Penomoran Surat Resmi
              </h2>
              <p className="text-xs text-gray-400">
                Sistem menghitung nomor urut terakhir secara otomatis sehingga nomor surat tidak akan tumpang tindih antar divisi.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Jenis Surat
                  </label>
                  <select
                    value={generatorData.docType}
                    onChange={(e) => setGeneratorData({ ...generatorData, docType: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UND">Surat Undangan (UND)</option>
                    <option value="ST">Surat Tugas (ST)</option>
                    <option value="SPH">Surat Permohonan (SPH)</option>
                    <option value="SKET">Surat Keterangan (SKET)</option>
                    <option value="SK">Surat Keputusan (SK)</option>
                    <option value="PENG">Pengumuman (PENG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Divisi Pengaju
                  </label>
                  <select
                    value={generatorData.division}
                    onChange={(e) => setGeneratorData({ ...generatorData, division: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BEM">BPH / Pusat (BEM)</option>
                    <option value="KDR">Divisi Kaderisasi (KDR)</option>
                    <option value="MED">Media dan Info (MED)</option>
                    <option value="HMS">Humas dan Jaringan (HMS)</option>
                    <option value="DANUS">Dana Usaha (DANUS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nomor Urut
                  </label>
                  <input
                    type="text"
                    value={generatorData.customSeq}
                    onChange={(e) => setGeneratorData({ ...generatorData, customSeq: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Bulan (Romawi)
                  </label>
                  <select
                    value={generatorData.month}
                    onChange={(e) => setGeneratorData({ ...generatorData, month: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
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
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={generatorData.year}
                    onChange={(e) => setGeneratorData({ ...generatorData, year: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Perihal / Tujuan Surat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Undangan Narasumber Seminar Nasional"
                  value={generatorData.purpose}
                  onChange={(e) => setGeneratorData({ ...generatorData, purpose: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Generator Preview Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                <Hash size={18} className="text-cyan-400" />
                <span>Nomor Surat Resmi Dihasilkan</span>
              </h3>

              <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 mb-5 text-center">
                <p className="text-[11px] text-gray-400 mb-2">Kode Baku TeraDesk</p>
                <div className="font-mono text-base sm:text-lg font-bold text-cyan-300 tracking-wider break-all bg-white/5 py-3 px-2 rounded-xl border border-white/10">
                  {generatedCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Salin Nomor Surat</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Nomor Urut:</span>
                  <span className="font-mono text-white">{generatorData.customSeq}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Kode Klasifikasi:</span>
                  <span className="font-mono text-white">{generatorData.docType}-{generatorData.division}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Instansi Induk:</span>
                  <span className="font-mono text-white">TERA</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Periode / Tahun:</span>
                  <span className="font-mono text-white">{generatorData.month} / {generatorData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Upload New Doc */}
      {activeTab === 'upload' && (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Registrasi & Unggah Berkas Arsip Digital
            </h2>
            <p className="text-xs text-gray-400">
              Simpan berkas surat masuk, surat keluar, SK, atau laporan pertanggungjawaban ke dalam brankas cloud organisasi.
            </p>
          </div>

          {uploadSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Dokumen Berhasil Diarsipkan!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Berkas telah tersimpan dan metadata nomor surat telah didaftarkan ke repositori E-Arsip TeraDesk.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Judul Berkas / Surat <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Surat Kerjasama Kemitraan Sponsorship Dies Natalis"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Kategori Dokumen
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Surat Keluar">Surat Keluar</option>
                    <option value="Surat Masuk">Surat Masuk</option>
                    <option value="SK & Legalitas">SK & Legalitas</option>
                    <option value="Proposal & TOR">Proposal & TOR</option>
                    <option value="LPJ & Keuangan">LPJ & Keuangan</option>
                    <option value="Notula Rapat">Notula Rapat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nomor Surat Resmi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 043/UND-BEM/TERA/XI/2026"
                    value={uploadForm.number}
                    onChange={(e) => setUploadForm({ ...uploadForm, number: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Divisi / Pengunggah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sekretariat BEM / Divisi Media"
                  value={uploadForm.author}
                  onChange={(e) => setUploadForm({ ...uploadForm, author: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                <UploadCloud size={32} className="mx-auto text-blue-400 mb-2" />
                <p className="text-xs font-bold text-white">
                  Tarik & letakkan berkas PDF / DOCX di sini
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Maksimal ukuran file: 20 MB</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('explorer')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <UploadCloud size={16} />
                  <span>Simpan ke E-Arsip</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: Struktur Penomoran */}
      {activeTab === 'struktur' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={22} className="text-cyan-400" />
              <span>Pedoman Kode Baku Penomoran Surat TeraDesk</span>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 font-mono text-cyan-300 text-sm">
                [NOMOR_URUT] / [KODE_SURAT] - [DIVISI] / TERA / [BULAN_ROMAWI] / [TAHUN]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-1">Kode Jenis Surat:</h4>
                  <ul className="space-y-1 text-gray-400 text-xs">
                    <li>• <strong className="text-white">UND</strong>: Surat Undangan Acara</li>
                    <li>• <strong className="text-white">ST</strong>: Surat Tugas Delegasi</li>
                    <li>• <strong className="text-white">SPH</strong>: Surat Permohonan Bantuan/Tempat</li>
                    <li>• <strong className="text-white">SK</strong>: Surat Keputusan Pengurus</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-1">Kode Divisi:</h4>
                  <ul className="space-y-1 text-gray-400 text-xs">
                    <li>• <strong className="text-white">BEM</strong>: Badan Pengurus Harian</li>
                    <li>• <strong className="text-white">KDR</strong>: Divisi Kaderisasi & SDM</li>
                    <li>• <strong className="text-white">MED</strong>: Divisi Media & Informasi</li>
                    <li>• <strong className="text-white">HMS</strong>: Divisi Hubungan Masyarakat</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </ServicePageLayout>
  );
};

export default ArchiveServicePage;

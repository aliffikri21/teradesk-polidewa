import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UploadCloud,
  Send,
  UserCheck,
  ChevronRight,
  Search,
  Filter,
  ShieldCheck,
  Info
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const ParServicePage = (props) => {
  const [activeTab, setActiveTab] = useState('simulasi'); // 'simulasi' | 'daftar' | 'form' | 'sop'
  const [approvalStep, setApprovalStep] = useState(2); // 1: Pengaju, 2: Kadiv, 3: BPH, 4: Pembina/Ketum
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const [submissions, setSubmissions] = useState([
    {
      id: 'PAR-2026-001',
      title: 'Latihan Dasar Kepemimpinan (LDK) 2026',
      division: 'Divisi Kaderisasi dan SDM',
      budget: 'Rp 8.500.000',
      date: '15 - 17 Nov 2026',
      status: 'Review BPH',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      step: 3,
      pic: 'Fajar Nugraha',
      slaRemaining: '18 Jam',
    },
    {
      id: 'PAR-2026-002',
      title: 'Workshop Desain Grafis dan UI/UX Multimedia',
      division: 'Divisi Media dan Informasi',
      budget: 'Rp 3.200.000',
      date: '28 Nov 2026',
      status: 'Disetujui',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      step: 4,
      pic: 'Nadia Safitri',
      slaRemaining: 'Selesai',
    },
    {
      id: 'PAR-2026-003',
      title: 'Turnamen Futsal dan E-Sport Antar Angkatan',
      division: 'Divisi Minat dan Bakat',
      budget: 'Rp 5.400.000',
      date: '05 Des 2026',
      status: 'Perlu Revisi',
      statusColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      step: 2,
      pic: 'Rian Pratama',
      slaRemaining: 'Menunggu Revisi PIC',
    },
    {
      id: 'PAR-2026-004',
      title: 'Seminar Kewirausahaan dan Inkubasi Bisnis Mahasiswa',
      division: 'Divisi Dana Usaha',
      budget: 'Rp 4.750.000',
      date: '12 Des 2026',
      status: 'Review Kadiv',
      statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      step: 2,
      pic: 'Annisa Putri',
      slaRemaining: '24 Jam',
    },
    {
      id: 'PAR-2026-005',
      title: 'Bakti Sosial dan Donor Darah Peduli Sesama',
      division: 'Divisi Pengabdian Masyarakat',
      budget: 'Rp 6.100.000',
      date: '20 Des 2026',
      status: 'Disetujui',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      step: 4,
      pic: 'Dimas Wicaksono',
      slaRemaining: 'Selesai',
    },
  ]);

  const [formState, setFormState] = useState({
    title: '',
    division: 'Divisi Kaderisasi dan SDM',
    budget: '',
    date: '',
    description: '',
    pic: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNextStep = () => {
    if (approvalStep < 4) setApprovalStep(approvalStep + 1);
  };

  const handleResetStep = () => {
    setApprovalStep(1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.title || !formState.budget) return;

    const newPar = {
      id: `PAR-2026-00${submissions.length + 1}`,
      title: formState.title,
      division: formState.division,
      budget: formState.budget.startsWith('Rp') ? formState.budget : `Rp ${formState.budget}`,
      date: formState.date || 'Desember 2026',
      status: 'Review Kadiv',
      statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      step: 2,
      pic: formState.pic || 'Ketua Panitia',
      slaRemaining: '24 Jam',
    };

    setSubmissions([newPar, ...submissions]);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('daftar');
      setFormState({
        title: '',
        division: 'Divisi Kaderisasi dan SDM',
        budget: '',
        date: '',
        description: '',
        pic: '',
      });
    }, 1200);
  };

  const steps = [
    {
      id: 1,
      title: 'Pengajuan Proposal',
      role: 'Ketua Panitia Proker',
      time: 'Hari ke-0 (Terkirim)',
      desc: 'Pengunggahan berkas proposal, susunan panitia, dan RAB terinci ke portal.',
      user: 'Fajar Nugraha (Ketua Panitia)',
    },
    {
      id: 2,
      title: 'Review Kadiv Terkait',
      role: 'Ketua Divisi',
      time: 'Maks. 24 Jam',
      desc: 'Pengecekan keselarasan konsep acara dengan program kerja divisi tahunan.',
      user: 'Bagas Aditya (Kadiv Kaderisasi)',
    },
    {
      id: 3,
      title: 'Verifikasi BPH dan Anggaran',
      role: 'Sekjen & Bendahara Umum',
      time: 'Maks. 24 Jam',
      desc: 'Pengecekan nomor surat, tanggal pemakaian ruangan, dan validasi pagu anggaran kas.',
      user: 'Nisa Salsabila (Sekjen) & Reza (Bendum)',
    },
    {
      id: 4,
      title: 'Pengesahan dan Tanda Tangan',
      role: 'Ketua Umum / Pembina',
      time: 'Maks. 12 Jam',
      desc: 'Persetujuan akhir, pembubuhan QR Code pengesahan resmi, dan penerbitan izin acara.',
      user: 'Dr. Hendra Wijaya (Pembina Organisasi)',
    },
  ];

  const filteredSubmissions = submissions.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.division.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'Semua' || item.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <ServicePageLayout
      serviceId="par"
      title="PAR (Program Approval Request)"
      category="Administrasi & Legalitas"
      badge="Modul Inti"
      icon={FileCheck2}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Total Proposal</span>
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {submissions.length + 9}
          </div>
          <p className="text-[11px] text-gray-400">Periode Kepengurusan 2026/2027</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Menunggu Tinjauan</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">
            {submissions.filter(s => s.status.includes('Review')).length}
          </div>
          <p className="text-[11px] text-gray-400">Dalam batas SLA &lt; 24 jam</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Disetujui dan Diterbitkan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            {submissions.filter(s => s.status === 'Disetujui').length + 7}
          </div>
          <p className="text-[11px] text-gray-400">QR Code pengesahan terbit</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Perlu Revisi</span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mb-1">
            {submissions.filter(s => s.status === 'Perlu Revisi').length}
          </div>
          <p className="text-[11px] text-gray-400">Catatan pengulas tersedia</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('simulasi')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'simulasi'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock size={16} />
          <span>Simulasi Alur Approval Live</span>
        </button>

        <button
          onClick={() => setActiveTab('daftar')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'daftar'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={16} />
          <span>Daftar Proposal Aktif ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send size={16} />
          <span>Buat Pengajuan PAR Baru</span>
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'sop'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Info size={16} />
          <span>Pedoman dan SOP Pengesahan</span>
        </button>
      </div>

      {/* Tab 1: Simulasi Stepper */}
      {activeTab === 'simulasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stepper Timeline Visual */}
          <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  Simulasi Peninjauan Proposal Proker
                </h2>
                <p className="text-xs text-gray-400">
                  Klik tombol aksi di bawah untuk mensimulasikan pergerakan lembar pengesahan dari Kadiv hingga Pembina.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetStep}
                  className="px-3.5 py-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer"
                >
                  Ulangi Simulasi
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={approvalStep === 4}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                    approvalStep === 4
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-md'
                  }`}
                >
                  {approvalStep === 4 ? 'Telah Disahkan Penuh' : 'Teruskan ke Step Berikutnya'}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Stepper Progress Steps */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[19px] sm:before:left-[27px] before:top-3 before:bottom-3 before:w-0.5 before:bg-white/15">
              {steps.map((s) => {
                const isPassed = approvalStep > s.id;
                const isCurrent = approvalStep === s.id;

                return (
                  <div key={s.id} className="relative flex items-start gap-4 sm:gap-6">
                    {/* Step Icon Badge */}
                    <div
                      className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                          : isCurrent
                          ? 'bg-blue-500 text-white ring-4 ring-blue-500/25 animate-pulse'
                          : 'bg-slate-800 text-gray-400 border border-white/10'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={18} /> : s.id}
                    </div>

                    {/* Step Content */}
                    <div
                      className={`flex-1 p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-500/10 border-blue-500/30 shadow-md'
                          : isPassed
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-white/5 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-white">{s.title}</h3>
                          <span className="text-[10px] bg-white/10 text-gray-300 font-semibold px-2 py-0.5 rounded-full">
                            {s.role}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{s.time}</span>
                      </div>

                      <p className="text-xs text-gray-300 mb-3">{s.desc}</p>

                      <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs">
                        <div className="flex items-center gap-2 text-gray-400">
                          <UserCheck size={14} className="text-amber-400" />
                          <span>{s.user}</span>
                        </div>
                        {isPassed && (
                          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 size={13} /> Selesai Diverifikasi
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-blue-400 font-bold text-[11px] flex items-center gap-1">
                            <Clock size={13} /> Menunggu Tindakan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Proposal Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Status Dokumen Terpilih</span>
              </h3>

              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 mb-5">
                <span className="text-[10px] font-mono text-gray-400">PAR-2026-001</span>
                <h4 className="font-bold text-white text-sm mt-0.5 mb-2">
                  Latihan Dasar Kepemimpinan (LDK) 2026
                </h4>
                <div className="space-y-1.5 text-xs text-gray-300">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Divisi:</span>
                    <span className="font-semibold text-white">Kaderisasi dan SDM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Estimasi Anggaran:</span>
                    <span className="font-semibold text-emerald-400">Rp 8.500.000</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Waktu Acara:</span>
                    <span className="font-semibold text-white">15 - 17 Nov 2026</span>
                  </p>
                </div>
              </div>

              {/* Barcode dan Verification Badge */}
              <div className="border border-white/10 bg-white/5 rounded-2xl p-4 text-center">
                <div className="w-16 h-16 bg-white mx-auto rounded-xl p-1 mb-2 flex items-center justify-center">
                  <div className="w-full h-full border-2 border-black border-dashed flex items-center justify-center text-[9px] font-mono font-bold text-black text-center leading-tight">
                    QR-VERIFIED
                  </div>
                </div>
                <p className="text-[11px] font-bold text-white">Lembar Pengesahan Digital</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  ID Hash: <code className="text-amber-300 font-mono">0x7B9E...D41A</code>
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Sah Sesuai AD/ART Organisasi</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
              <h4 className="font-bold text-xs text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>Ketentuan SLA Review</span>
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Setiap reviewer (Kadiv, BPH, Pembina) memiliki batas waktu respon maksimal 24 jam. Jika melewati batas waktu, sistem otomatis mengirimkan pengingat bot via WhatsApp/Email ke pejabat berwenang.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Submissions Table */}
      {activeTab === 'daftar' && (
        <div className="space-y-6">
          {/* Search dan Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proposal, nomor PAR, atau nama divisi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter size={15} className="text-gray-400 shrink-0" />
              {['Semua', 'Review Kadiv', 'Review BPH', 'Disetujui', 'Perlu Revisi'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">ID dan Judul Proker</th>
                    <th className="py-4 px-6">Divisi dan PIC</th>
                    <th className="py-4 px-6">Anggaran</th>
                    <th className="py-4 px-6">Jadwal Acara</th>
                    <th className="py-4 px-6">Status Alur</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {sub.id}
                        </span>
                        <p className="font-bold text-white text-xs sm:text-sm mt-1">{sub.title}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-200 font-semibold">{sub.division}</p>
                        <p className="text-gray-400 text-[11px]">PIC: {sub.pic}</p>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-emerald-400">
                        {sub.budget}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {sub.date}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sub.statusColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setActiveTab('simulasi')}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-xs"
                        >
                          Lihat Alur
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <FileText size={36} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-semibold">Tidak ditemukan proposal yang sesuai kriteria pencarian.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Submission Form */}
      {activeTab === 'form' && (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Formulir Pengajuan Program Approval Request (PAR)
            </h2>
            <p className="text-xs text-gray-400">
              Isi parameter kegiatan organisasi di bawah ini. Proposal akan langsung diteruskan ke Ketua Divisi Anda untuk ditinjau.
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Pengajuan PAR Berhasil Didaftarkan!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Proposal telah dialokasikan nomor registrasi antrean dan notifikasi otomatis telah dikirim ke Ketua Divisi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Nama Program Kerja / Kegiatan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskusi Publik Peran AI dalam Tata Kelola Kampus"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Divisi Penyelenggara
                  </label>
                  <select
                    value={formState.division}
                    onChange={(e) => setFormState({ ...formState, division: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Divisi Kaderisasi dan SDM">Divisi Kaderisasi dan SDM</option>
                    <option value="Divisi Media dan Informasi">Divisi Media dan Informasi</option>
                    <option value="Divisi Humas dan Hubungan Luar">Divisi Humas dan Hubungan Luar</option>
                    <option value="Divisi Minat dan Bakat">Divisi Minat dan Bakat</option>
                    <option value="Divisi Dana Usaha">Divisi Dana Usaha</option>
                    <option value="Divisi Pengabdian Masyarakat">Divisi Pengabdian Masyarakat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Estimasi Pagu Anggaran (RAB) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 4.500.000"
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Target Tanggal Pelaksanaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 20 - 22 Desember 2026"
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap dan Nomor WhatsApp"
                    value={formState.pic}
                    onChange={(e) => setFormState({ ...formState, pic: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Ringkasan Latar Belakang dan Urgensi Proker
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan secara singkat sasaran proker, target peserta, dan korelasi dengan visi kepengurusan..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Upload Document Box */}
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                <UploadCloud size={32} className="mx-auto text-blue-400 mb-2" />
                <p className="text-xs font-bold text-white">
                  Tarik dan letakkan berkas Proposal / RAB (PDF atau DOCX) di sini
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Maksimal ukuran file: 25 MB</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('daftar')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Kirimkan Pengajuan PAR</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: SOP & Guidelines */}
      {activeTab === 'sop' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info size={22} className="text-blue-400" />
              <span>Standar Operasional Prosedur (SOP) Alur PAR</span>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <h3 className="font-bold text-white mb-1">1. Batas Waktu Pengajuan (H-14 Acara)</h3>
                <p className="text-gray-400">
                  Seluruh proposal proker wajib diajukan melalui portal minimal 14 hari kalender sebelum tanggal pelaksanaan agar alur review bertingkat berjalan tanpa terburu-buru.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <h3 className="font-bold text-white mb-1">2. Catatan Revisi dan Verifikasi Anggaran</h3>
                <p className="text-gray-400">
                  Jika Ketua Divisi atau Bendahara Umum memberikan catatan revisi, PIC proker akan menerima notifikasi dan wajib mengunggah dokumen perbaikan dalam waktu maksimal 2x24 jam.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <h3 className="font-bold text-white mb-1">3. Penerbitan QR Lembar Pengesahan Digital</h3>
                <p className="text-gray-400">
                  Setelah Ketua Umum / Pembina membubuhkan persetujuan digital, lembar pengesahan resmi ber-QR Code otomatis terbit dan dapat diunduh tanpa perlu tanda tangan basah fisik.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </ServicePageLayout>
  );
};

export default ParServicePage;

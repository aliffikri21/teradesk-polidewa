import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  FileText,
  UploadCloud,
  Send,
  UserCheck,
  ChevronRight
} from 'lucide-react';

const ParModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('simulasi'); // 'simulasi' | 'form' | 'daftar'
  const [approvalStep, setApprovalStep] = useState(2); // 1: Pengaju, 2: Kadiv, 3: BPH, 4: Pembina/Ketum
  const [submissions, setSubmissions] = useState([
    {
      id: 'PAR-2026-001',
      title: 'Latihan Dasar Kepemimpinan (LDK) 2026',
      division: 'Divisi Kaderisasi & SDM',
      budget: 'Rp 8.500.000',
      date: '15 - 17 Nov 2026',
      status: 'Review BPH',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      step: 3,
    },
    {
      id: 'PAR-2026-002',
      title: 'Workshop Desain Grafis & UI/UX Multimedia',
      division: 'Divisi Media & Informasi',
      budget: 'Rp 3.200.000',
      date: '28 Nov 2026',
      status: 'Disetujui',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      step: 4,
    },
    {
      id: 'PAR-2026-003',
      title: 'Turnamen Futsal & E-Sport Antar Angkatan',
      division: 'Divisi Minat & Bakat',
      budget: 'Rp 5.400.000',
      date: '05 Des 2026',
      status: 'Perlu Revisi',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-200',
      step: 2,
    },
  ]);

  // Form states
  const [formState, setFormState] = useState({
    title: '',
    division: 'Divisi Kaderisasi & SDM',
    budget: '',
    date: '',
    description: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      step: 2,
    };

    setSubmissions([newPar, ...submissions]);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('daftar');
      setFormState({
        title: '',
        division: 'Divisi Kaderisasi & SDM',
        budget: '',
        date: '',
        description: '',
      });
    }, 1500);
  };

  const steps = [
    {
      id: 1,
      title: '1. Pengajuan Proposal',
      role: 'Ketua Panitia / Penanggung Jawab',
      desc: 'Mengunggah TOR kegiatan, RAB, dan jadwal pelaksanaan.',
      user: 'Rian Pratama (Ketua Pelaksana)',
    },
    {
      id: 2,
      title: '2. Review & Verifikasi Divisi',
      role: 'Ketua Divisi Terkait',
      desc: 'Memvalidasi kelayakan substansi kegiatan dan kesiapan panitia.',
      user: 'Siti Rahmawati (Kepala Divisi)',
    },
    {
      id: 3,
      title: '3. Verifikasi Birokrasi & Anggaran',
      role: 'Sekretaris Jenderal & Bendahara Umum',
      desc: 'Pengecekan ketersediaan kas organisasi dan format administrasi baku.',
      user: 'Ahmad Fauzi (BPH / Sekjen)',
    },
    {
      id: 4,
      title: '4. Persetujuan Akhir & SK',
      role: 'Ketua Umum / Pembina Organisasi',
      desc: 'Tanda tangan digital pengesahan dan penerbitan izin eksekusi proker.',
      user: 'Dr. Hendra Wijaya (Pembina / Ketum)',
    },
  ];

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
        aria-labelledby="par-modal-title"
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-[#070B19] text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="par-modal-title" className="font-bold text-lg text-white">PAR (Program Approval Request)</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full">
                  Live Flow
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Sistem Alur Persetujuan Bertingkat Program Kerja Organisasi
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
        <div className="px-6 sm:px-8 pt-4 pb-2 bg-gray-50 border-b border-gray-200 flex gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulasi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            Simulasi Alur Persetujuan
          </button>
          <button
            onClick={() => setActiveTab('daftar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'daftar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            Daftar Pengajuan ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            + Buat Pengajuan PAR Baru
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grow">
          
          {/* TAB 1: SIMULASI ALUR */}
          {activeTab === 'simulasi' && (
            <div className="space-y-6">
              {/* Proposal Highlight Card */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-blue-800 bg-blue-200/60 px-2.5 py-0.5 rounded-md">
                      PAR-2026-001
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Diajukan 2 hari lalu</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    Latihan Dasar Kepemimpinan (LDK) Mahasiswa 2026
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Divisi Kaderisasi & SDM • Anggaran: <span className="font-semibold text-slate-800">Rp 8.500.000</span> • Lokasi: Villa Agrowisata
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    {approvalStep === 4 ? 'Disetujui Sepenuhnya 🎉' : `Tahap ${approvalStep} dari 4`}
                  </span>
                </div>
              </div>

              {/* Stepper Progress */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-gray-200 space-y-8">
                {steps.map((st) => {
                  const isDone = approvalStep > st.id;
                  const isCurrent = approvalStep === st.id;

                  return (
                    <div key={st.id} className="relative group">
                      {/* Step Circle Indicator */}
                      <div
                        className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : st.id}
                      </div>

                      {/* Content */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-200'
                            : isDone
                            ? 'bg-gray-50/80 border-gray-200'
                            : 'bg-gray-50/40 border-gray-100 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <h5 className="font-bold text-sm sm:text-base text-slate-900">
                            {st.title}
                          </h5>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md w-fit ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCurrent
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {isDone ? 'Selesai & Disetujui' : isCurrent ? 'Menunggu Aksi' : 'Menunggu Alur'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{st.desc}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <UserCheck size={14} className="text-blue-600" />
                          <span>Reviewer: <strong>{st.user}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Simulation Box */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Simulasi Aksi Reviewer
                  </div>
                  <p className="text-xs text-gray-300">
                    {approvalStep < 4
                      ? `Anda bertindak sebagai ${steps[approvalStep - 1]?.role}. Klik tombol untuk menyetujui tahap ini.`
                      : 'Semua tahapan PAR telah disetujui! Surat Keputusan (SK) terbit otomatis.'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {approvalStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                      <span>Setujui Tahap {approvalStep}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleResetStep}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Ulangi Simulasi Alur
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAFTAR PENGAJUAN */}
          {activeTab === 'daftar' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-slate-800">Riwayat Pengajuan Proposal Organisasi</h4>
                <span className="text-xs text-gray-500">Menampilkan {submissions.length} permohonan</span>
              </div>

              <div className="grid gap-3">
                {submissions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-slate-900">{item.title}</h5>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>{item.division}</span>
                        <span>•</span>
                        <span>Anggaran: <strong className="text-slate-800">{item.budget}</strong></span>
                        <span>•</span>
                        <span>Jadwal: {item.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setApprovalStep(item.step);
                        setActiveTab('simulasi');
                      }}
                      className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Lihat Detail Alur</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FORM PENGAJUAN BARU */}
          {activeTab === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {formSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">Pengajuan PAR Berhasil Dibuat!</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Proposal Anda telah masuk ke sistem antrean alur persetujuan. Notifikasi otomatis telah dikirimkan ke Kepala Divisi terkait.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <FileText className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Pengajuan PAR menggantikan formulir kertas fisik. Sistem akan secara otomatis melacak waktu persetujuan (SLA) dan memberi tahu penanggung jawab jika ada catatan revisi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Nama Program Kerja / Kegiatan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Seminar Nasional AI & Masa Depan Organisasi"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Divisi Penanggung Jawab
                      </label>
                      <select
                        value={formState.division}
                        onChange={(e) => setFormState({ ...formState, division: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                      >
                        <option>Divisi Kaderisasi & SDM</option>
                        <option>Divisi Media & Informasi (Medinfo)</option>
                        <option>Divisi Hubungan Masyarakat (Humas)</option>
                        <option>Divisi Minat & Bakat</option>
                        <option>Divisi Kewirausahaan & Dana Usaha</option>
                        <option>Sekretariat Jenderal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Estimasi Anggaran yang Diajukan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 4.500.000"
                        value={formState.budget}
                        onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Rencana Tanggal Pelaksanaan
                      </label>
                      <input
                        type="date"
                        value={formState.date}
                        onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Ringkasan Sasaran & Target Output Kegiatan
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan secara singkat tujuan proker, target peserta, dan korelasi dengan visi kepengurusan..."
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    ></textarea>
                  </div>

                  {/* Dummy Upload */}
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                    <UploadCloud className="mx-auto text-blue-500 mb-2" size={28} />
                    <p className="text-xs font-semibold text-slate-800">
                      Tarik & letakkan file Proposal / RAB (PDF atau DOCX) di sini
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">Maksimal ukuran file: 15 MB</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('daftar')}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Send size={15} />
                      <span>Kirim Pengajuan PAR</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Semua riwayat persetujuan tersimpan abadi di audit log TeraDesk.</span>
          </div>
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

export default ParModal;

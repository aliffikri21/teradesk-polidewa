import React, { useState } from 'react';
import {
  Headphones,
  Search,
  Plus,
  CheckCircle2,
  Send,
  AlertCircle,
  Filter,
  Eye,
  X,
  Copy
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';
import { initialDefaultTickets, sortTicketsNewestFirst } from '../../data/defaultTickets';

const HelpdeskServicePage = (props) => {
  const {
    tickets: propTickets,
    onAddTicket,
    authUser,
  } = props;

  const [activeTab, setActiveTab] = useState('tiket'); // 'tiket' | 'buat' | 'panduan'
  const [localTickets, setLocalTickets] = useState(initialDefaultTickets);
  const tickets = (propTickets && propTickets.length > 0) ? propTickets : localTickets;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form State
  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: 'Desain Grafis / Poster',
    requester: authUser?.name || '',
    targetDate: '',
    brief: '',
  });
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.requester) return;

    const now = new Date();
    const newTkt = {
      id: `PUB-2026-${Date.now().toString().slice(-4)}`,
      title: ticketForm.title.trim(),
      category: ticketForm.category,
      canvas: ticketForm.category,
      requester: ticketForm.requester.trim(),
      division: authUser?.division || 'Divisi Pemohon',
      targetDate: ticketForm.targetDate || '3 Hari Lagi',
      deadline: ticketForm.targetDate || '3 Hari Lagi',
      assignedTo: 'Antrean Tim Pubdok',
      designer: 'Antrean Tim Pubdok',
      status: 'Diajukan',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      brief: ticketForm.brief?.trim() || '-',
      createdAt: now.toISOString(),
      createdTimestamp: Date.now(),
    };

    if (onAddTicket) {
      onAddTicket(newTkt);
    } else {
      setLocalTickets((prev) => sortTicketsNewestFirst([newTkt, ...prev]));
    }

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('tiket');
      setTicketForm({
        title: '',
        category: 'Desain Grafis / Poster',
        requester: authUser?.name || '',
        targetDate: '',
        brief: '',
      });
    }, 1200);
  };

  const sortedTickets = sortTicketsNewestFirst(tickets);
  const filteredTickets = sortedTickets.filter((t) => {
    const matchCat = filterCategory === 'Semua' || t.category === filterCategory;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <ServicePageLayout
      serviceId="helpdesk"
      title="Helpdesk Internal & Request Desain"
      category="Tata Kelola SDM"
      badge="Modul Aktif"
      icon={Headphones}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Total Tiket Request</span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {tickets.length + 28}
          </div>
          <p className="text-[11px] text-gray-400">Permintaan desain & publikasi</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Sedang Dikerjakan</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-1">
            {tickets.filter((t) => t.status === 'Sedang Dikerjakan').length}
          </div>
          <p className="text-[11px] text-gray-400">Proses pengerjaan tim media</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Selesai Tepat Waktu</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            {tickets.filter((t) => t.status === 'Selesai').length + 26}
          </div>
          <p className="text-[11px] text-gray-400">Aset siap dipublikasikan</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Kecepatan Respons</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">
            &lt; 2 Jam
          </div>
          <p className="text-[11px] text-gray-400">Penugasan desainer cepat</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('tiket')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tiket'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Headphones size={16} />
          <span>Daftar Tiket Request ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buat')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'buat'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={16} />
          <span>Buat Tiket Permintaan Baru</span>
        </button>

        <button
          onClick={() => setActiveTab('panduan')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'panduan'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <AlertCircle size={16} />
          <span>Ketentuan & SLA Layanan</span>
        </button>
      </div>

      {/* Tab 1: Daftar Tiket */}
      {activeTab === 'tiket' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tiket, nama pemohon, atau ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter size={15} className="text-gray-400 shrink-0" />
              {['Semua', 'Desain Grafis / Poster', 'Publikasi Media Sosial', 'Liputan Foto / Video'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">ID & Uraian Permintaan</th>
                    <th className="py-4 px-6">Jenis Bantuan</th>
                    <th className="py-4 px-6">Pemohon (PIC)</th>
                    <th className="py-4 px-6">Target Selesai</th>
                    <th className="py-4 px-6">Pekerja (Assigned)</th>
                    <th className="py-4 px-6">Status Pengerjaan</th>
                    <th className="py-4 px-6 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {t.id}
                        </span>
                        <p className="font-bold text-white text-xs sm:text-sm mt-1 group-hover:text-blue-400 transition-colors">{t.title}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {t.category}
                      </td>
                      <td className="py-4 px-6 text-gray-200 font-semibold">
                        {t.requester}
                      </td>
                      <td className="py-4 px-6 font-mono text-amber-300">
                        {t.targetDate || t.deadline}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {t.assignedTo || t.designer}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${t.statusColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Buka Detail Pesanan"
                        >
                          <Eye size={13} />
                          <span>Lihat</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Buat Tiket */}
      {activeTab === 'buat' && (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Formulir Permintaan Bantuan Desain & Publikasi
            </h2>
            <p className="text-xs text-gray-400">
              Ajukan brief visual ke Divisi Media & Informasi agar materi promosi program kerja Anda selesai tepat waktu.
            </p>
          </div>

          {formSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Tiket Permintaan Berhasil Dibuat!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Notifikasi telah diteruskan ke Ketua Divisi Media & Informasi untuk penugasan desainer/tim liputan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Judul Permintaan / Nama Acara <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Desain Banner Spanduk Panggung & Sertifikat LDK 2026"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Jenis Bantuan yang Dibutuhkan
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Desain Grafis / Poster">Desain Grafis / Poster / Feed IG</option>
                    <option value="Publikasi Media Sosial">Siaran Pers / Publikasi Akun Resmi</option>
                    <option value="Liputan Foto / Video">Liputan Dokumentasi & Video Aftermovie</option>
                    <option value="Bantuan Sound & Logistik">Bantuan Teknis Audio & Operator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Target Tanggal Kebutuhan (Deadline) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 12 Nov 2026 (Minimal H-5)"
                    value={ticketForm.targetDate}
                    onChange={(e) => setTicketForm({ ...ticketForm, targetDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Nama Pemohon & Nomor WhatsApp <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fajar (Panitia LDK) - 08123456789"
                  value={ticketForm.requester}
                  onChange={(e) => setTicketForm({ ...ticketForm, requester: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Brief Spesifikasi & Referensi Desain
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan teks headline, warna tema, logo sponsor yang wajib dicantumkan, ukuran (misal: 3x1 meter), atau link Google Drive materi..."
                  value={ticketForm.brief}
                  onChange={(e) => setTicketForm({ ...ticketForm, brief: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('tiket')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Kirimkan Tiket Permintaan</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Panduan SLA */}
      {activeTab === 'panduan' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={22} className="text-rose-400" />
              <span>Ketentuan & SLA Permintaan Layanan Media & Logistik</span>
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <h4 className="font-bold text-white mb-1">1. Batas Pengajuan Desain (Minimal H-5)</h4>
                <p className="text-gray-400">
                  Permintaan desain poster, spanduk panggung, dan materi promosi wajib diajukan minimal 5 hari sebelum kebutuhan cetak agar tim desainer memiliki waktu riset visual dan revisi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <h4 className="font-bold text-white mb-1">2. Publikasi Media Sosial Resmi (Minimal H-2)</h4>
                <p className="text-gray-400">
                  Materi postingan Instagram/TikTok yang sudah siap (beserta caption lengkap) wajib dikirimkan minimal 2 hari sebelum jadwal penayangan yang diinginkan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <h4 className="font-bold text-white mb-1">3. Permintaan Liputan Foto & Video (H-7)</h4>
                <p className="text-gray-400">
                  Untuk penugasan fotografer dan videografer hari-H acara, mohon ajukan permohonan minimal 7 hari sebelumnya agar jadwal staf peliput tidak bentrok dengan perkuliahan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP: DETAIL PESANAN TIKET DESAIN */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between bg-white/5">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-md">
                    {selectedTicket.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200 text-xs font-semibold">
                    {selectedTicket.category || selectedTicket.canvas}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedTicket.statusColor}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {selectedTicket.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
              {/* Card Identitas Pengaju */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                  Identitas Pengaju Permohonan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400 block text-xs">Nama Pemohon (PIC):</span>
                    <span className="font-bold text-white">{selectedTicket.requester}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Divisi / Asal Pemohon:</span>
                    <span className="font-bold text-white">{selectedTicket.division || 'Divisi Pemohon'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Waktu Pengajuan:</span>
                    <span className="font-mono text-gray-300">
                      {selectedTicket.createdAt ? String(selectedTicket.createdAt).slice(0, 10) : 'Tercatat di sistem'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Target Kebutuhan (Deadline):</span>
                    <span className="font-bold text-amber-300">{selectedTicket.targetDate || selectedTicket.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Card Rincian Kebutuhan Desain */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Rincian Kebutuhan & Brief Desain
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Jenis Bantuan / Layanan:</span>
                    <span className="font-semibold text-white">{selectedTicket.category}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Desainer / Pekerja (PIC Pubdok):</span>
                    <span className="font-semibold text-white">{selectedTicket.assignedTo || selectedTicket.designer || 'Tim Pubdok'}</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-gray-400 block text-xs font-medium mb-1.5">
                    Instruksi Khusus & Uraian Brief:
                  </span>
                  <p className="text-xs text-gray-200 whitespace-pre-line leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-white/10">
                    {selectedTicket.brief && selectedTicket.brief !== '-'
                      ? selectedTicket.brief
                      : 'Tidak ada instruksi brief khusus. Silakan konfirmasi lebih lanjut ke pihak pemohon.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const text = `[Tiket ${selectedTicket.id}] ${selectedTicket.title}\nPengaju: ${selectedTicket.requester} (${selectedTicket.division || '-'})\nDeadline: ${selectedTicket.targetDate || selectedTicket.deadline}\nBrief: ${selectedTicket.brief}`;
                  navigator.clipboard?.writeText(text);
                  alert(`Informasi tiket ${selectedTicket.id} berhasil disalin ke clipboard!`);
                }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy size={13} />
                <span>Salin Info Tiket</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </ServicePageLayout>
  );
};

export default HelpdeskServicePage;

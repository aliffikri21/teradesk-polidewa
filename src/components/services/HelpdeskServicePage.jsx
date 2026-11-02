import React, { useState } from 'react';
import {
  Headphones,
  Search,
  Plus,
  CheckCircle2,
  Send,
  AlertCircle,
  Filter
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const sampleTickets = [
  {
    id: 'REQ-2026-081',
    title: 'Desain Poster Utama & Feed Instagram Acara LDK 2026',
    category: 'Desain Grafis / Poster',
    requester: 'Fajar Nugraha (Kaderisasi)',
    targetDate: '10 Nov 2026',
    assignedTo: 'Nadia (Medinfo)',
    status: 'Sedang Dikerjakan',
    statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'REQ-2026-080',
    title: 'Publikasi Siaran Pers Kerjasama BEM Se-Kota',
    category: 'Publikasi Media Sosial',
    requester: 'Siti Aminah (Humas)',
    targetDate: '05 Nov 2026',
    assignedTo: 'Gilang (Medinfo)',
    status: 'Sedang Dikerjakan',
    statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'REQ-2026-079',
    title: 'Dokumentasi Video Teaser Turnamen Futsal',
    category: 'Liputan Foto / Video',
    requester: 'Rian Pratama (Mikat)',
    targetDate: '25 Okt 2026',
    assignedTo: 'Budi (Medinfo)',
    status: 'Selesai',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'REQ-2026-078',
    title: 'Desain Sertifikat Peserta Webinar AI Kampus',
    category: 'Desain Grafis / Poster',
    requester: 'Annisa (Dana Usaha)',
    targetDate: '20 Okt 2026',
    assignedTo: 'Nadia (Medinfo)',
    status: 'Selesai',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
];

const HelpdeskServicePage = ({ onBackToPortal, onBackToLanding, onSelectService }) => {
  const [activeTab, setActiveTab] = useState('tiket'); // 'tiket' | 'buat' | 'panduan'
  const [tickets, setTickets] = useState(sampleTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  // Form State
  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: 'Desain Grafis / Poster',
    requester: '',
    targetDate: '',
    brief: '',
  });
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.requester) return;

    const newTkt = {
      id: `REQ-2026-0${tickets.length + 82}`,
      title: ticketForm.title,
      category: ticketForm.category,
      requester: ticketForm.requester,
      targetDate: ticketForm.targetDate || '3 Hari Lagi',
      assignedTo: 'Tim Medinfo / Logistik',
      status: 'Diajukan',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    };

    setTickets([newTkt, ...tickets]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('tiket');
      setTicketForm({
        title: '',
        category: 'Desain Grafis / Poster',
        requester: '',
        targetDate: '',
        brief: '',
      });
    }, 1200);
  };

  const filteredTickets = tickets.filter((t) => {
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
      onBackToPortal={onBackToPortal}
      onBackToLanding={onBackToLanding}
      onSelectService={onSelectService}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {t.id}
                        </span>
                        <p className="font-bold text-white text-xs sm:text-sm mt-1">{t.title}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {t.category}
                      </td>
                      <td className="py-4 px-6 text-gray-200 font-semibold">
                        {t.requester}
                      </td>
                      <td className="py-4 px-6 font-mono text-amber-300">
                        {t.targetDate}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {t.assignedTo}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${t.statusColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {t.status}
                        </span>
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

    </ServicePageLayout>
  );
};

export default HelpdeskServicePage;

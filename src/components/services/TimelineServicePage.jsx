import React, { useState } from 'react';
import {
  CalendarRange,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  Users,
  MapPin,
  Send
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const sampleEvents = [
  {
    id: 'EVT-01',
    title: 'Latihan Dasar Kepemimpinan (LDK) 2026',
    division: 'Divisi Kaderisasi & SDM',
    date: '15 - 17 Nov 2026',
    location: 'Villa Wisata Kaliurang & Kampus',
    pic: 'Fajar Nugraha',
    target: '120 Peserta',
    status: 'Persiapan H-13',
    color: 'emerald',
  },
  {
    id: 'EVT-02',
    title: 'Workshop Multimedia: Desain Grafis & UI/UX',
    division: 'Divisi Media & Informasi',
    date: '28 Nov 2026',
    location: 'Laboratorium Komputer 3',
    pic: 'Nadia Safitri',
    target: '60 Peserta',
    status: 'Proposal Disetujui',
    color: 'blue',
  },
  {
    id: 'EVT-03',
    title: 'Turnamen Futsal & E-Sport Antar Angkatan',
    division: 'Divisi Minat & Bakat',
    date: '05 Des 2026',
    location: 'Gelanggang Olahraga Remaja',
    pic: 'Rian Pratama',
    target: '200 Peserta',
    status: 'Revisi Anggaran',
    color: 'amber',
  },
  {
    id: 'EVT-04',
    title: 'Inkubasi Bisnis Mahasiswa & Bazar Kewirausahaan',
    division: 'Divisi Dana Usaha',
    date: '12 - 13 Des 2026',
    location: 'Plaza Gedung Pusat',
    pic: 'Annisa Putri',
    target: '500 Pengunjung',
    status: 'Tahap Sponsorship',
    color: 'purple',
  },
  {
    id: 'EVT-05',
    title: 'Bakti Sosial & Donor Darah Peduli Kampus',
    division: 'Divisi Pengabdian Masyarakat',
    date: '20 Des 2026',
    location: 'Lobi Auditorium Utama',
    pic: 'Dimas Wicaksono',
    target: '150 Kantong Darah',
    status: 'Koordinasi PMI',
    color: 'rose',
  },
];

const TimelineServicePage = (props) => {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'agenda' | 'tambah'
  const [events, setEvents] = useState(sampleEvents);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    division: 'Divisi Kaderisasi & SDM',
    date: '',
    location: '',
    pic: '',
    target: '',
  });
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;

    const newEvt = {
      id: `EVT-0${events.length + 1}`,
      title: eventForm.title,
      division: eventForm.division,
      date: eventForm.date,
      location: eventForm.location || 'Sekretariat / Kampus',
      pic: eventForm.pic || 'PIC Terdaftar',
      target: eventForm.target || '50 Peserta',
      status: 'Terjadwal Baru',
      color: 'blue',
    };

    setEvents([...events, newEvt]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('agenda');
      setEventForm({
        title: '',
        division: 'Divisi Kaderisasi & SDM',
        date: '',
        location: '',
        pic: '',
        target: '',
      });
    }, 1200);
  };

  const filteredEvents = events.filter((evt) =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ServicePageLayout
      serviceId="timeline"
      title="Master Timeline & Kalender Kerja"
      category="Operasional & Aset"
      badge="Modul Aktif"
      icon={CalendarRange}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Program Kerja Tahunan</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            18 Proker
          </div>
          <p className="text-[11px] text-gray-400">Tersusun dalam GBHPK Organisasi</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Proker Bulan Ini (Nov 2026)</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-1">
            2 Acara
          </div>
          <p className="text-[11px] text-gray-400">LDK 2026 & Workshop UI/UX</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Konflik Jadwal</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            0 Bentrok
          </div>
          <p className="text-[11px] text-gray-400">Sinkronisasi waktu lintas divisi aman</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Proker Sukses Terlaksana</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            12 Proker
          </div>
          <p className="text-[11px] text-gray-400">LPJ telah diterima BPH</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <CalendarRange size={16} />
          <span>Roadmap Bulanan Proker</span>
        </button>

        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'agenda'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock size={16} />
          <span>Agenda Acara Mendatang ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tambah')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tambah'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={16} />
          <span>Tambah Jadwal Proker</span>
        </button>
      </div>

      {/* Tab 1: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">Visualisasi Roadmap Periode Q4 2026</h3>
                <p className="text-xs text-gray-400">Pemetaan waktu pelaksanaan kegiatan agar persiapan logistik berjalan terencana.</p>
              </div>
            </div>

            {/* Timeline Bars */}
            <div className="space-y-4">
              {events.map((evt) => (
                <div key={evt.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                    <div>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                        {evt.division}
                      </span>
                      <h4 className="font-bold text-white text-sm sm:text-base mt-1">{evt.title}</h4>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-gray-200">
                      {evt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Calendar size={14} /> {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {evt.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> PIC: {evt.pic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Agenda */}
      {activeTab === 'agenda' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari agenda proker atau nama divisi..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-300">{evt.date}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      {evt.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{evt.title}</h4>
                  <p className="text-xs text-gray-400 mb-4">{evt.division}</p>

                  <div className="space-y-2 text-xs text-gray-300 border-t border-white/5 pt-3">
                    <p className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-amber-400 shrink-0" />
                      <span>{evt.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-400">
                      <Users size={14} className="text-blue-400 shrink-0" />
                      <span>PIC: {evt.pic} ({evt.target})</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tambah Jadwal */}
      {activeTab === 'tambah' && (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Tambahkan Agenda Acara ke Master Timeline
            </h2>
            <p className="text-xs text-gray-400">
              Mendaftarkan tanggal kegiatan ke kalender organisasi untuk mengamankan slot waktu dan fasilitas ruangan.
            </p>
          </div>

          {formSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Jadwal Berhasil Ditambahkan ke Master Timeline!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Kegiatan telah tersinkronisasi dan dapat dilihat oleh seluruh pengurus divisi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Nama Acara / Program Kerja <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskusi Terbuka Isu Kebijakan Kampus"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Divisi Penyelenggara
                  </label>
                  <select
                    value={eventForm.division}
                    onChange={(e) => setEventForm({ ...eventForm, division: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Divisi Kaderisasi & SDM">Divisi Kaderisasi & SDM</option>
                    <option value="Divisi Media & Informasi">Divisi Media & Informasi</option>
                    <option value="Divisi Minat & Bakat">Divisi Minat & Bakat</option>
                    <option value="Divisi Dana Usaha">Divisi Dana Usaha</option>
                    <option value="Divisi Humas & Jaringan">Divisi Humas & Jaringan</option>
                    <option value="Divisi Pengabdian Masyarakat">Divisi Pengabdian Masyarakat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Tanggal Pelaksanaan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 18 Desember 2026"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Lokasi Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Gedung Serbaguna Kampus"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ahmad Rizki"
                    value={eventForm.pic}
                    onChange={(e) => setEventForm({ ...eventForm, pic: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('agenda')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Daftarkan ke Master Timeline</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

    </ServicePageLayout>
  );
};

export default TimelineServicePage;

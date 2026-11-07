import React, { useState } from 'react';
import {
  Globe,
  Handshake,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Send,
  Building2,
  MessageCircle,
  Check
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const HumasServicePage = (props) => {
  const { humasMedparts: propMedparts, onAddHumasMedpart, onApproveMedpart: propApproveMedpart } = props;
  const [activeTab, setActiveTab] = useState('medpart'); // 'medpart' | 'relasi' | 'form'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Media Partner Requests Data
  const [localMedpartList, setLocalMedpartList] = useState([
    {
      id: 'MP-2026-001',
      eventName: 'Seminar Nasional AI & Creative Tech',
      organizer: 'BEM Fakultas Ilmu Komputer',
      packageType: 'Paket Gold (Feed + Reels + Story)',
      eventDate: '18 Nov 2026',
      picName: 'Dimas Setiawan',
      picContact: '0812-9876-5432',
      status: 'Menunggu Tinjauan',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'MP-2026-002',
      eventName: 'Porseni Mahasiswa Se-Kota',
      organizer: 'DEMA Universitas',
      packageType: 'Paket Silver (Story + Logo Backdrop)',
      eventDate: '24 Nov 2026',
      picName: 'Rina Anggraini',
      picContact: '0857-1122-3344',
      status: 'Disetujui',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'MP-2026-003',
      eventName: 'Workshop UI/UX Career Accelerator',
      organizer: 'GDSC Kampus Chapter',
      packageType: 'Paket Barter Media',
      eventDate: '02 Des 2026',
      picName: 'Kevin Wijaya',
      picContact: '0813-5566-7788',
      status: 'Tayang di Medsos',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ]);
  const medpartList = propMedparts || localMedpartList;

  // Form State for New Medpart Request
  const [formEventName, setFormEventName] = useState('');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formPackage, setFormPackage] = useState('Paket Silver (Story + Logo)');
  const [formDate, setFormDate] = useState('');
  const [formPic, setFormPic] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Mitra & Alumni Directory
  const partnerDirectory = [
    {
      id: 1,
      name: 'BEM Universitas Terbuka',
      category: 'Lembaga Kampus',
      contact: 'Aditya Pratama (Ketua BEM)',
      phone: '0812-3456-7890',
      lastCollab: 'Pekan Raya Mahasiswa 2026',
    },
    {
      id: 2,
      name: 'UKM Fotografi & Audio Visual',
      category: 'UKM Sahabat',
      contact: 'Sarah Melinda (Ketua UKM)',
      phone: '0856-7890-1234',
      lastCollab: 'Pameran Karya Multimedia',
    },
    {
      id: 3,
      name: 'Alumni TERAMEDIA Angkatan 2021',
      category: 'Jaringan Alumni',
      contact: 'Fauzan Hidayat, S.Kom. (Senior Designer)',
      phone: '0811-2233-4455',
      lastCollab: 'Pemateri Upgrading Internal',
    },
    {
      id: 4,
      name: 'Media Partner Kampus Update',
      category: 'Media Luar',
      contact: 'Admin Redaksi',
      phone: '0877-6655-4433',
      lastCollab: 'Publikasi Open Recruitment',
    },
  ];

  const handleApproveMedpart = (id) => {
    if (propApproveMedpart) {
      propApproveMedpart(id);
    } else {
      setLocalMedpartList((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'Disetujui', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
            : item
        )
      );
    }
  };

  const handleCreateMedpart = (e) => {
    e.preventDefault();
    if (!formEventName.trim() || !formOrganizer.trim()) return;

    const newMedpart = {
      id: `MP-2026-00${medpartList.length + 1}`,
      eventName: formEventName.trim(),
      organizer: formOrganizer.trim(),
      packageType: formPackage,
      eventDate: formDate || '2026-11-20',
      picName: formPic || 'Perwakilan Mitra',
      picContact: formPhone || '0812-0000-0000',
      status: 'Menunggu Tinjauan',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    if (onAddHumasMedpart) {
      onAddHumasMedpart(newMedpart);
    } else {
      setLocalMedpartList([newMedpart, ...medpartList]);
    }
    setFormSubmitted(true);
    setFormEventName('');
    setFormOrganizer('');
    setFormDate('');
    setFormPic('');
    setFormPhone('');

    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('medpart');
    }, 1500);
  };

  const filteredMedpart = medpartList.filter((item) => {
    const matchSearch =
      item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.picName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'Semua' || item.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <ServicePageLayout
      serviceId="humas"
      title="Divisi Hubungan Masyarakat (Humas)"
      category="Jaringan & Komunikasi Eksternal"
      badge="Modul Divisi Resmi"
      icon={Globe}
      {...props}
    >
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Mitra & Kolaborasi</span>
            <Building2 size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">18 Lembaga</p>
          <p className="text-[11px] text-slate-400 mt-1">BEM, UKM & Sponsor Kampus</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Review Medpart</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
            {medpartList.filter((m) => m.status === 'Menunggu Tinjauan').length} Event
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Permohonan promosi masuk</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Medpart Aktif</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
            {medpartList.filter((m) => m.status !== 'Menunggu Tinjauan').length} Event
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tayang di media sosial UKM</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Jangkauan</span>
            <Users size={16} className="text-indigo-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">12.5K+</p>
          <p className="text-[11px] text-slate-400 mt-1">Audiens kanal publikasi</p>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200/70 flex flex-wrap gap-1.5 mb-6">
        <button
          onClick={() => setActiveTab('medpart')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'medpart'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Handshake size={15} className="text-blue-600" />
          <span>Permohonan Media Partner ({medpartList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('relasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'relasi'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 size={15} className="text-indigo-600" />
          <span>Buku Kontak Mitra & Alumni</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus size={15} className="text-emerald-600" />
          <span>Input Kerjasama Baru</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'medpart' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Search & Filter */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari acara atau lembaga mitra..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Tinjauan">Menunggu Tinjauan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Tayang di Medsos">Tayang di Medsos</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                  <th className="py-3 px-4">KODE & EVENT</th>
                  <th className="py-3 px-4">LEMBAGA / PIC</th>
                  <th className="py-3 px-4">PAKET PROMO</th>
                  <th className="py-3 px-4">JADWAL</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">AKSI HUMAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredMedpart.map((mp) => (
                  <tr key={mp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">{mp.id}</span>
                      <span className="font-bold text-slate-900">{mp.eventName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="block font-semibold text-slate-800">{mp.organizer}</span>
                      <span className="text-[11px] text-slate-400">PIC: {mp.picName} ({mp.picContact})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{mp.packageType}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{mp.eventDate}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${mp.statusColor}`}>
                        {mp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {mp.status === 'Menunggu Tinjauan' ? (
                        <button
                          onClick={() => handleApproveMedpart(mp.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Setujui Medpart
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                          <Check size={12} /> Diteruskan ke Pubdok
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'relasi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partnerDirectory.map((partner) => (
            <div key={partner.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                    {partner.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Mitra Aktif</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{partner.name}</h3>
                <p className="text-xs text-slate-600 mt-1">Kontak: <span className="font-semibold text-slate-800">{partner.contact}</span></p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{partner.phone}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Kolaborasi: {partner.lastCollab}</span>
                <a
                  href={`https://wa.me/${partner.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  <MessageCircle size={13} />
                  <span>Hubungi WA</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'form' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Pendaftaran Permohonan Media Partner</h2>
          <p className="text-xs text-slate-500 mb-6">Input berkas permohonan kerjasama publikasi dari lembaga kampus eksternal.</p>

          <form onSubmit={handleCreateMedpart} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nama Acara / Kegiatan</label>
              <input
                type="text"
                value={formEventName}
                onChange={(e) => setFormEventName(e.target.value)}
                placeholder="Contoh: Festival Film Dokumenter Mahasiswa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Lembaga Penyelenggara</label>
                <input
                  type="text"
                  value={formOrganizer}
                  onChange={(e) => setFormOrganizer(e.target.value)}
                  placeholder="Contoh: Himpunan Mahasiswa D3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Paket Barter Media</label>
                <select
                  value={formPackage}
                  onChange={(e) => setFormPackage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500 bg-white"
                >
                  <option value="Paket Silver (Story + Logo)">Paket Silver (Story + Logo)</option>
                  <option value="Paket Gold (Feed + Reels + Story)">Paket Gold (Feed + Reels + Story)</option>
                  <option value="Paket Barter Media">Paket Barter Media</option>
                  <option value="Sponsorship & Liputan Khusus">Sponsorship & Liputan Khusus</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tanggal Acara</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nama PIC Mitra</label>
                <input
                  type="text"
                  value={formPic}
                  onChange={(e) => setFormPic(e.target.value)}
                  placeholder="Nama Panitia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">No. WhatsApp PIC</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {formSubmitted && (
              <p className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                Data permohonan kerjasama Media Partner berhasil disimpan!
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Send size={14} />
                <span>Simpan Permohonan Medpart</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </ServicePageLayout>
  );
};

export default HumasServicePage;

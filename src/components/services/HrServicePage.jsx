import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Award,
  Filter,
  Building2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Download
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const sampleMembers = [
  {
    id: 'MEM-001',
    name: 'Dr. Hendra Wijaya',
    role: 'Pembina Organisasi',
    division: 'Dewan Pembina',
    email: 'hendra.w@kampus.ac.id',
    phone: '0812-3456-7890',
    status: 'Aktif',
    initials: 'HW',
  },
  {
    id: 'MEM-002',
    name: 'Muhammad Farhan',
    role: 'Ketua Umum (Ketum)',
    division: 'Badan Pengurus Harian (BPH)',
    email: 'farhan.ketum@teramedia.org',
    phone: '0813-8899-1122',
    status: 'Aktif',
    initials: 'MF',
  },
  {
    id: 'MEM-003',
    name: 'Nisa Salsabila',
    role: 'Sekretaris Jenderal',
    division: 'Badan Pengurus Harian (BPH)',
    email: 'nisa.sekjen@teramedia.org',
    phone: '0812-7766-3344',
    status: 'Aktif',
    initials: 'NS',
  },
  {
    id: 'MEM-004',
    name: 'Reza Fahrezi',
    role: 'Bendahara Umum',
    division: 'Badan Pengurus Harian (BPH)',
    email: 'reza.bendum@teramedia.org',
    phone: '0815-4433-2211',
    status: 'Aktif',
    initials: 'RF',
  },
  {
    id: 'MEM-005',
    name: 'Bagas Aditya',
    role: 'Ketua Divisi (Kadiv)',
    division: 'Divisi Kaderisasi & SDM',
    email: 'bagas.kader@teramedia.org',
    phone: '0819-2233-4455',
    status: 'Aktif',
    initials: 'BA',
  },
  {
    id: 'MEM-006',
    name: 'Nadia Safitri',
    role: 'Ketua Divisi (Kadiv)',
    division: 'Divisi Media & Informasi',
    email: 'nadia.medinfo@teramedia.org',
    phone: '0857-1122-3344',
    status: 'Aktif',
    initials: 'NS',
  },
  {
    id: 'MEM-007',
    name: 'Fajar Nugraha',
    role: 'Staff Ahli Kaderisasi',
    division: 'Divisi Kaderisasi & SDM',
    email: 'fajar.sdm@teramedia.org',
    phone: '0878-9900-1122',
    status: 'Aktif',
    initials: 'FN',
  },
  {
    id: 'MEM-008',
    name: 'Rian Pratama',
    role: 'Ketua Divisi (Kadiv)',
    division: 'Divisi Minat & Bakat',
    email: 'rian.mikat@teramedia.org',
    phone: '0821-4455-6677',
    status: 'Aktif',
    initials: 'RP',
  },
];

const HrServicePage = (props) => {
  const { accounts = [] } = props;
  const [activeTab, setActiveTab] = useState('direktori'); // 'direktori' | 'struktur' | 'kinerja'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiv, setSelectedDiv] = useState('Semua');
  const [downloadToast, setDownloadToast] = useState(null);

  // Sinkronisasi data Akun Terdaftar Admin Dashboard ke direktori SDM
  const allMembers = useMemo(() => {
    // 1. Format semua akun terdaftar di sistem
    const accountMembers = (accounts || []).map((acc) => {
      const nameFormatted = acc.name
        ? acc.name
            .split(' ')
            .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
            .join(' ')
        : 'Pengurus TeraDesk';

      const initials = acc.name
        ? acc.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('')
        : 'TD';

      const divisionFormatted =
        acc.division === 'BPH'
          ? 'Badan Pengurus Harian (BPH)'
          : acc.division && acc.division.startsWith('Divisi')
          ? acc.division
          : `Divisi ${acc.division || 'BPH'}`;

      const roleFormatted = acc.role
        ? acc.role.charAt(0).toUpperCase() + acc.role.slice(1)
        : 'Staff Pengurus';

      return {
        id: `ACC-${acc.nim}`,
        nim: acc.nim,
        name: nameFormatted,
        role: roleFormatted,
        division: divisionFormatted,
        email: `${acc.nim}@teramedia.org`,
        phone: '0821-4040-5300',
        status: 'Aktif',
        initials,
        isRegisteredAccount: true,
        canAccessAdmin: Boolean(acc.canAccessAdmin),
        isDefault: Boolean(acc.isDefault),
      };
    });

    // 2. Gabungkan akun terdaftar dengan sampleMembers (tanpa duplikasi nama)
    const registeredNames = new Set(accountMembers.map((a) => a.name.toLowerCase()));
    const remainingSample = sampleMembers.filter(
      (s) => !registeredNames.has(s.name.toLowerCase())
    );

    return [...accountMembers, ...remainingSample];
  }, [accounts]);

  // Daftar divisi dinamis dari data gabungan
  const divisions = useMemo(() => {
    const list = [
      'Semua',
      'Badan Pengurus Harian (BPH)',
      'Divisi Kaderisasi & SDM',
      'Divisi Media & Informasi',
      'Divisi Minat & Bakat',
      'Dewan Pembina',
    ];
    allMembers.forEach((m) => {
      if (m.division && !list.includes(m.division)) {
        list.push(m.division);
      }
    });
    return list;
  }, [allMembers]);

  const filteredMembers = allMembers.filter((m) => {
    const matchDiv = selectedDiv === 'Semua' || m.division === selectedDiv;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.division.toLowerCase().includes(q) ||
      (m.nim && m.nim.toLowerCase().includes(q));
    return matchDiv && matchSearch;
  });

  const handleDownloadCert = (memberName, role) => {
    setDownloadToast(`E-Sertifikat resmi ${role} a.n. ${memberName} berhasil diunduh.`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  return (
    <ServicePageLayout
      serviceId="hr"
      title="Database Anggota & Tata Kelola SDM"
      category="Tata Kelola SDM"
      badge="Modul Aktif"
      icon={Users}
      {...props}
    >
      {/* Download Certificate Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="text-xs font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Pengurus & Anggota Aktif</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {allMembers.length} Orang
          </div>
          <p className="text-[11px] text-gray-400">Terdaftar di Direktori & Database Akun</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Divisi Kepengurusan</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">
            {divisions.filter((d) => d !== 'Semua').length} Divisi
          </div>
          <p className="text-[11px] text-gray-400">Struktur organisasi lengkap</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Akun TeraDesk Aktif</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            {accounts.length} Akun
          </div>
          <p className="text-[11px] text-gray-400">Akses login portal terverifikasi</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Pakta Integritas</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">
            100% Sah
          </div>
          <p className="text-[11px] text-gray-400">Terverifikasi sistem organisasi</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('direktori')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'direktori'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          <span>Direktori Pengurus ({allMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('struktur')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'struktur'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 size={16} />
          <span>Bagan Struktur Organisasi</span>
        </button>

        <button
          onClick={() => setActiveTab('kinerja')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'kinerja'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award size={16} />
          <span>Sertifikasi & Penilaian Kinerja</span>
        </button>
      </div>

      {/* Tab 1: Direktori */}
      {activeTab === 'direktori' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama pengurus, NIM, jabatan, atau divisi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <Filter size={15} className="text-gray-400 shrink-0" />
              {divisions.map((div) => (
                <button
                  key={div}
                  onClick={() => setSelectedDiv(div)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDiv === div
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className={`bg-white/5 border rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  m.isRegisteredAccount
                    ? 'border-blue-500/40 shadow-lg shadow-blue-950/20 hover:border-blue-400'
                    : 'border-white/10 hover:border-indigo-400/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-base">
                      {m.initials}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {m.isRegisteredAccount && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                          <ShieldCheck size={10} /> Akun
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-0.5 flex items-center gap-1.5">
                    <span>{m.name}</span>
                    {m.canAccessAdmin && (
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Admin
                      </span>
                    )}
                  </h4>
                  {m.nim && (
                    <p className="text-[10px] font-mono text-cyan-300/80 mb-1">NIM: {m.nim}</p>
                  )}
                  <p className="text-xs text-indigo-300 font-semibold mb-1">{m.role}</p>
                  <p className="text-[11px] text-gray-400 mb-4">{m.division}</p>

                  <div className="space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-3">
                    <p className="flex items-center gap-2 text-gray-400 truncate">
                      <Mail size={13} className="text-gray-500 shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-400">
                      <Phone size={13} className="text-gray-500 shrink-0" />
                      <span>{m.phone}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Struktur Organisasi */}
      {activeTab === 'struktur' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2">Bagan Hierarki Kepengurusan Periode 2026/2027</h3>
            <p className="text-xs text-gray-400 mb-8">Pohon koordinasi rantai komando organisasi dari Pembina hingga staf pelaksana.</p>

            <div className="space-y-6 text-center">
              {/* Level 1: Pembina */}
              <div className="inline-block bg-slate-900 border-2 border-amber-400/40 rounded-2xl p-4 max-w-xs shadow-lg">
                <span className="text-[10px] text-amber-300 font-mono">Level 1 - Pengarah & Pembina</span>
                <h4 className="font-bold text-white text-sm mt-0.5">Dr. Hendra Wijaya</h4>
                <p className="text-xs text-gray-400">Pembina Organisasi</p>
              </div>

              <div className="w-0.5 h-6 bg-white/20 mx-auto"></div>

              {/* Level 1.5: Dewan Kehormatan / Demisioner Ketum */}
              <div className="inline-block bg-slate-900 border-2 border-indigo-400/40 rounded-2xl p-4 max-w-sm shadow-lg">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-indigo-300 font-mono mb-0.5">
                  <Sparkles size={11} />
                  <span>Dewan Kehormatan & Pengembang Sistem</span>
                </div>
                <h4 className="font-bold text-white text-sm">Alif Fikri Haykal</h4>
                <p className="text-xs text-gray-400">Demisioner Ketua Umum • Lead Architect TeraDesk (NIM: 23404053)</p>
              </div>

              <div className="w-0.5 h-6 bg-white/20 mx-auto"></div>

              {/* Level 2: Ketum */}
              <div className="inline-block bg-slate-900 border-2 border-blue-400/40 rounded-2xl p-4 max-w-xs shadow-lg">
                <span className="text-[10px] text-blue-300 font-mono">Level 2 - Pucuk Pimpinan</span>
                <h4 className="font-bold text-white text-sm mt-0.5">Muhammad Farhan</h4>
                <p className="text-xs text-gray-400">Ketua Umum BEM</p>
              </div>

              <div className="w-0.5 h-6 bg-white/20 mx-auto"></div>

              {/* Level 3: BPH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-teal-300 font-mono">Sekretariat</span>
                  <h4 className="font-bold text-white text-sm">Nisa Salsabila</h4>
                  <p className="text-xs text-gray-400">Sekretaris Jenderal</p>
                </div>
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-emerald-300 font-mono">Keuangan</span>
                  <h4 className="font-bold text-white text-sm">Reza Fahrezi</h4>
                  <p className="text-xs text-gray-400">Bendahara Umum</p>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-white/20 mx-auto"></div>

              {/* Level 4: Kadiv */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
                  <h5 className="font-bold text-white text-xs">Divisi Kaderisasi & SDM</h5>
                  <p className="text-[11px] text-gray-400 mt-1">Bagas Aditya (Kadiv)</p>
                </div>
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
                  <h5 className="font-bold text-white text-xs">Divisi Media & Info</h5>
                  <p className="text-[11px] text-gray-400 mt-1">Nadia Safitri (Kadiv)</p>
                </div>
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
                  <h5 className="font-bold text-white text-xs">Divisi Minat & Bakat</h5>
                  <p className="text-[11px] text-gray-400 mt-1">Rian Pratama (Kadiv)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Kinerja */}
      {activeTab === 'kinerja' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2">Penilaian Kinerja & Sertifikasi Kepengurusan</h3>
            <p className="text-xs text-gray-400 mb-6">Penghitungan skor kontribusi proker dan pencetakan e-sertifikat kepengurusan resmi.</p>

            <div className="space-y-4">
              {/* Prioritaskan Akun Terdaftar (Alif Fikri dkk) + Pengurus Utama */}
              {[
                { name: 'Alif Fikri Haykal', role: 'Demisioner Ketua Umum & Lead Dev', score: 99, cert: 'E-Sertifikat Demisioner Terbit', nim: '23404053' },
                { name: 'Muhammad Farhan', role: 'Ketua Umum', score: 98, cert: 'E-Sertifikat Ketum Terbit' },
                { name: 'Nisa Salsabila', role: 'Sekretaris Jenderal', score: 96, cert: 'E-Sertifikat Sekjen Terbit' },
                { name: 'Reza Fahrezi', role: 'Bendahara Umum', score: 95, cert: 'E-Sertifikat Bendum Terbit' },
                { name: 'Bagas Aditya', role: 'Kadiv Kaderisasi', score: 94, cert: 'E-Sertifikat Kadiv Terbit' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      {item.nim && (
                        <span className="text-[10px] font-mono text-cyan-300">NIM: {item.nim}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Skor KPI: {item.score}/100
                    </span>
                    <button
                      onClick={() => handleDownloadCert(item.name, item.role)}
                      className="text-xs font-semibold text-blue-300 hover:text-white bg-blue-600/30 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Unduh E-Sertifikat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </ServicePageLayout>
  );
};

export default HrServicePage;

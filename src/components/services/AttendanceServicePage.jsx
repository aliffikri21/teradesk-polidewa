import React, { useState } from 'react';
import {
  ClipboardCheck,
  QrCode,
  Users,
  Clock,
  CheckCircle2,
  Download,
  Search,
  RefreshCw,
  MapPin,
  KeyRound
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const sampleAttendanceList = [
  { id: 'ATT-01', name: 'Ahmad Fauzi', division: 'Divisi Kaderisasi & SDM', role: 'Staff', time: '13:54 WIB', status: 'Tepat Waktu' },
  { id: 'ATT-02', name: 'Nadia Safitri', division: 'Divisi Media & Informasi', role: 'Kadiv', time: '13:58 WIB', status: 'Tepat Waktu' },
  { id: 'ATT-03', name: 'Reza Fahrezi', division: 'Bendahara Umum', role: 'BPH', time: '14:01 WIB', status: 'Tepat Waktu' },
  { id: 'ATT-04', name: 'Bagas Aditya', division: 'Divisi Kaderisasi & SDM', role: 'Kadiv', time: '14:05 WIB', status: 'Tepat Waktu' },
  { id: 'ATT-05', name: 'Rian Pratama', division: 'Divisi Minat & Bakat', role: 'Staff', time: '14:18 WIB', status: 'Terlambat (18m)' },
  { id: 'ATT-06', name: 'Siti Aminah', division: 'Divisi Humas & Jaringan', role: 'Staff', time: '14:02 WIB', status: 'Tepat Waktu' },
];

const AttendanceServicePage = (props) => {
  const { attendanceList: propAttendance, onAddAttendanceRecord } = props;
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'log' | 'rekap'
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionActive] = useState(true);
  const [qrToken, setQrToken] = useState('TERA-QR-98214');
  const [pinCode, setPinCode] = useState('782910');
  const [localAttendance, setLocalAttendance] = useState(sampleAttendanceList);
  const attendanceList = propAttendance || localAttendance;
  const [checkinSuccess, setCheckinSuccess] = useState('');

  const handleRefreshQr = () => {
    const randomToken = `TERA-QR-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomPin = `${Math.floor(100000 + Math.random() * 900000)}`;
    setQrToken(randomToken);
    setPinCode(randomPin);
  };

  const handleSelfCheckin = () => {
    const user = props.authUser || { name: 'Alif Fikri Haykal', division: 'BPH & Presidium', role: 'Demisioner Ketum' };
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const newRecord = {
      id: `ATT-0${attendanceList.length + 1}`,
      name: user.name,
      division: user.division || 'BPH & Kesekretariatan',
      role: user.role || 'Pengurus',
      time: timeStr,
      status: 'Tepat Waktu (Check-In Live)',
    };
    if (onAddAttendanceRecord) {
      onAddAttendanceRecord(newRecord);
    } else {
      setLocalAttendance((prev) => [newRecord, ...prev]);
    }
    setCheckinSuccess(`Check-in presensi sukses untuk ${user.name} (${timeStr})!`);
    setTimeout(() => setCheckinSuccess(''), 4000);
  };

  const filteredList = attendanceList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ServicePageLayout
      serviceId="attendance"
      title="Presensi Digital & QR Code Acara"
      category="Operasional & Aset"
      badge="Modul Aktif"
      icon={ClipboardCheck}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Total Anggota Terdaftar</span>
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            124
          </div>
          <p className="text-[11px] text-gray-400">Database kepengurusan 2026</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Rata-rata Kehadiran</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            94.2%
          </div>
          <p className="text-[11px] text-gray-400">Sepanjang 12 agenda rapat</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Sesi Presensi Aktif</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            {sessionActive ? '1 Sesi' : '0 Sesi'}
          </div>
          <p className="text-[11px] text-gray-400">Rapat Pleno Koordinasi LDK</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Verifikasi Lokasi (GPS)</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">
            100%
          </div>
          <p className="text-[11px] text-gray-400">Geofence radius 50m aktif</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode size={16} />
          <span>Generator QR Code Sesi Aktif</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'log'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock size={16} />
          <span>Live Log Kehadiran ({attendanceList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'rekap'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          <span>Rekap Kehadiran Divisi</span>
        </button>
      </div>

      {/* Tab 1: QR Generator */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
            <span className="text-[11px] font-bold text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30 mb-3">
              SESI AKTIF: Rapat Pleno Koordinasi LDK 2026
            </span>
            <h3 className="text-xl font-bold text-white mb-2">Scan QR Code untuk Presensi</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-6">
              Anggota cukup membuka kamera HP atau browser TeraDesk untuk check-in otomatis tanpa antre tanda tangan.
            </p>

            {/* Simulated Dynamic QR Code */}
            <div className="p-5 bg-white rounded-3xl shadow-2xl mb-4 border-4 border-slate-900">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <QrCode size={160} className="text-white" />
                <div className="absolute inset-x-0 bottom-2 text-center text-[9px] font-mono text-amber-300 bg-black/60 py-0.5">
                  {qrToken}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRefreshQr}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Perbarui Token QR</span>
              </button>
              <button
                onClick={handleSelfCheckin}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Simulasi Check-In Saya</span>
              </button>
            </div>

            {checkinSuccess && (
              <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>{checkinSuccess}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                <KeyRound size={18} className="text-amber-400" />
                <span>Metode Backup: PIN Manual 6 Digit</span>
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Jika kamera smartphone anggota mengalami kendala teknis atau kendala pencahayaan, anggota dapat menginput PIN manual ini:
              </p>
              <div className="font-mono text-3xl font-extrabold tracking-widest text-center text-amber-300 bg-slate-900 py-4 rounded-2xl border border-white/10">
                {pinCode}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-teal-400" />
                <span>Validasi Lokasi (Geofencing GPS)</span>
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                <p className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Titik Koordinat Acara:</span>
                  <span className="font-mono text-white">-6.200000, 106.816666</span>
                </p>
                <p className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Radius Diizinkan:</span>
                  <span className="font-semibold text-emerald-400">Maksimal 50 Meter</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-gray-400">Tenggat Waktu Check-In:</span>
                  <span className="font-semibold text-white">14:15 WIB (Lewat = Terlambat)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Log */}
      {activeTab === 'log' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama anggota atau divisi..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">Nama Anggota</th>
                    <th className="py-4 px-6">Divisi & Jabatan</th>
                    <th className="py-4 px-6">Waktu Presensi</th>
                    <th className="py-4 px-6">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-white text-xs sm:text-sm">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        <p>{item.division}</p>
                        <span className="text-[10px] text-gray-400">{item.role}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-gray-300">
                        {item.time}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            item.status.includes('Tepat')
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {item.status}
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

      {/* Tab 3: Rekap Kehadiran */}
      {activeTab === 'rekap' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Rekapitulasi Persentase Partisipasi Divisi</h3>
                <p className="text-xs text-gray-400">Akumulasi seluruh kehadiran rapat kerja semester berjalan.</p>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md">
                <Download size={15} />
                <span>Unduh Rekap Spreadsheet (XLSX)</span>
              </button>
            </div>

            <div className="space-y-4">
              {[
                { div: 'BPH / Sekretariat & Bendahara', percent: 98, total: 6 },
                { div: 'Divisi Kaderisasi & SDM', percent: 96, total: 18 },
                { div: 'Divisi Media & Informasi', percent: 94, total: 14 },
                { div: 'Divisi Dana Usaha', percent: 92, total: 12 },
                { div: 'Divisi Minat & Bakat', percent: 90, total: 16 },
                { div: 'Divisi Humas & Jaringan', percent: 91, total: 15 },
              ].map((row, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-xs sm:text-sm truncate">{row.div}</p>
                    <p className="text-[11px] text-gray-400">{row.total} Pengurus Aktif</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-emerald-400">{row.percent}%</span>
                    <p className="text-[10px] text-gray-500">Tingkat Kehadiran</p>
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

export default AttendanceServicePage;

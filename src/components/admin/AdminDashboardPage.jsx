import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  FolderArchive,
  Boxes,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Headphones,
  Search,
  Bell,
  Plus,
  Calendar,
  Filter,
  Download,
  Info,
  MoreHorizontal,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Check,
  Copy,
  Trash2,
  Edit2,
  KeyRound,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Sparkles,
  LogOut,
  X,
  Upload,
  ShieldCheck,
  Clock,
  Database,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

const divisionsList = [
  'Semua Divisi',
  'BPH',
  'Medinfo',
  'Kaderisasi',
  'Minat & Bakat',
  'Dana Usaha',
  'Humas & Jaringan',
  'Inventaris & Logistik',
];

const availableServices = [
  {
    id: 'par',
    title: 'PAR (Program Approval Request)',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    icon: FileCheck2,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
    description: 'Verifikasi proposal bertingkat digital, SLA tracking, dan tanda tangan resmi lembar pengesahan.',
    pic: 'BPH & Pembina',
    activeCount: '12 Proposal',
  },
  {
    id: 'archive',
    title: 'Digitalisasi E-Arsip & Persuratan',
    category: 'Administrasi & Legalitas',
    badge: 'Modul Inti',
    icon: FolderArchive,
    color: 'text-blue-600 bg-blue-50 border-blue-200/80',
    description: 'Repositori SK, generator kode nomor surat dinas otomatis, dan brankas penyimpanan berkas LPJ.',
    pic: 'Kesekretariatan',
    activeCount: '148 Surat',
  },
  {
    id: 'asset',
    title: 'Digitalisasi Aset & Inventaris',
    category: 'Operasional & Aset',
    badge: 'Modul Inti',
    icon: Boxes,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80',
    description: 'Pencatatan inventaris alat multimedia (kamera, mic, sound), booking ruang rapat, dan audit fisik.',
    pic: 'Inventaris & Logistik',
    activeCount: '24 Alat Terdata',
  },
  {
    id: 'finance',
    title: 'Kas & Reimbursement Anggaran',
    category: 'Keuangan & Anggaran',
    badge: 'Tersedia',
    icon: Receipt,
    color: 'text-teal-600 bg-teal-50 border-teal-200/80',
    description: 'Pencatatan mutasi kas masuk/keluar serta verifikasi klaim nota belanja kegiatan panitia via foto.',
    pic: 'Bendahara Umum',
    activeCount: 'Rp 18.450.000',
  },
  {
    id: 'attendance',
    title: 'Presensi Digital QR Code & Notula',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    icon: ClipboardCheck,
    color: 'text-purple-600 bg-purple-50 border-purple-200/80',
    description: 'Check-in rapat pleno dan proker via scan QR code instan dengan rekapitulasi kehadiran real-time.',
    pic: 'Kaderisasi & SDM',
    activeCount: '94% Kehadiran',
  },
  {
    id: 'timeline',
    title: 'Master Timeline & Kalender Kerja',
    category: 'Perencanaan Proker',
    badge: 'Tersedia',
    icon: CalendarRange,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200/80',
    description: 'Sinkronisasi agenda kegiatan seluruh divisi kepengurusan untuk mencegah jadwal bentrok.',
    pic: 'Ketua Umum & BPH',
    activeCount: '16 Agenda',
  },
  {
    id: 'hr',
    title: 'Database Anggota & Struktur Pengurus',
    category: 'Tata Kelola SDM',
    badge: 'Tersedia',
    icon: Users,
    color: 'text-violet-600 bg-violet-50 border-violet-200/80',
    description: 'Direktori kader aktif, struktur hierarki divisi, dan riwayat penugasan kepanitiaan organisasi.',
    pic: 'Kaderisasi',
    activeCount: '48 Kader Aktif',
  },
  {
    id: 'helpdesk',
    title: 'Helpdesk & Request Desain Medinfo',
    category: 'Layanan Kreatif',
    badge: 'Tersedia',
    icon: Headphones,
    color: 'text-rose-600 bg-rose-50 border-rose-200/80',
    description: 'Tiket bantuan teknis operasional dan alur permohonan materi visual ke Divisi Medinfo.',
    pic: 'Media & Informasi',
    activeCount: '6 Tiket Aktif',
  },
];

const getTimestamp = () => new Date().toLocaleTimeString('id-ID');
const getDateStamp = () => new Date().toISOString().split('T')[0];

const AdminDashboardPage = ({
  onBackToLanding,
  onNavigateToPortal,
  onNavigateToService,
  accounts,
  onAddAccount,
  onUpdatePassword,
  onDeleteAccount,
  onResetAccounts,
  onImpersonate,
  onForceDestroySession,
  authUser,
}) => {
  // Navigation View:
  // 'dashboard' | 'par' | 'archive' | 'asset' | 'finance' | 'attendance' | 'timeline' | 'hr' | 'helpdesk' |
  // 'students' | 'session' | 'backup' | 'logs' | 'settings'
  const [currentNav, setCurrentNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua Divisi');
  const [dateRangeFilter, setDateRangeFilter] = useState('Semester Ganjil 2026/2027');
  const [timeframeFilter, setTimeframeFilter] = useState('Bulan Ini');

  // Form State for Adding Student
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [formNim, setFormNim] = useState('');
  const [formName, setFormName] = useState('');
  const [formDivision, setFormDivision] = useState('Medinfo');
  const [formRole, setFormRole] = useState('Anggota Aktif');
  const [formPassword, setFormPassword] = useState('password123');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Password Visibility toggles per row
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Inline Password Edit State
  const [editingNim, setEditingNim] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Selected Checkboxes in Table
  const [selectedRows, setSelectedRows] = useState([]);

  // Copy Feedback state
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedNim, setCopiedNim] = useState(null);

  // Import JSON State
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  // Notifications popup toggle
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Module active state toggles (simulation)
  const [moduleStatuses, setModuleStatuses] = useState({
    par: true,
    archive: true,
    asset: true,
    finance: true,
    attendance: true,
    timeline: true,
    hr: true,
    helpdesk: true,
  });

  // Mock PAR Submissions
  const [parSubmissions, setParSubmissions] = useState([
    {
      id: 'PAR-2026-001',
      title: 'Latihan Dasar Kepemimpinan (LDK) 2026',
      division: 'Kaderisasi',
      budget: 'Rp 8.500.000',
      date: '15 - 17 Nov 2026',
      status: 'Review BPH',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      pic: 'Fajar Nugraha',
    },
    {
      id: 'PAR-2026-002',
      title: 'Workshop Desain Grafis & UI/UX Multimedia',
      division: 'Medinfo',
      budget: 'Rp 3.200.000',
      date: '28 Nov 2026',
      status: 'Disetujui',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pic: 'Nadia Safitri',
    },
    {
      id: 'PAR-2026-003',
      title: 'Turnamen Futsal Antar Angkatan TeraCup',
      division: 'Minat & Bakat',
      budget: 'Rp 5.400.000',
      date: '05 Des 2026',
      status: 'Perlu Revisi',
      statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
      pic: 'Rian Pratama',
    },
    {
      id: 'PAR-2026-004',
      title: 'Seminar Kewirausahaan & Inkubasi Bisnis',
      division: 'Dana Usaha',
      budget: 'Rp 4.750.000',
      date: '12 Des 2026',
      status: 'Review Kadiv',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      pic: 'Ilham Ramadhan',
    },
  ]);

  // Activity Logs
  const [logs, setLogs] = useState([
    { id: 1, time: '14:50:12', event: 'Sistem inisialisasi database kredensial TeraDesk', type: 'info' },
    { id: 2, time: '14:52:40', event: 'Audit Session Guard: Auto-destroy on refresh diaktifkan', type: 'success' },
    { id: 3, time: '15:00:15', event: 'Kredensial resmi Alif Fikri (23404053) dimuat ke memori', type: 'info' },
  ]);

  const addLog = (event, type = 'info') => {
    const time = getTimestamp();
    setLogs((prev) => [{ id: Date.now(), time, event, type }, ...prev.slice(0, 24)]);
  };

  const togglePasswordVisibility = (nim) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [nim]: !prev[nim],
    }));
  };

  const handleGenerateRandomPass = () => {
    const randomPass = 'tera' + Math.floor(1000 + Math.random() * 9000);
    setFormPassword(randomPass);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const cleanNim = formNim.trim();
    const cleanName = formName.trim();
    const cleanPass = formPassword.trim();
    const cleanRole = formRole.trim();

    if (!cleanNim) {
      setFormError('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }

    if (accounts.some((acc) => acc.nim === cleanNim)) {
      setFormError(`NIM ${cleanNim} sudah terdaftar.`);
      return;
    }

    if (!cleanName) {
      setFormError('Nama lengkap mahasiswa wajib diisi.');
      return;
    }

    if (cleanPass.length < 4) {
      setFormError('Kata sandi minimal 4 karakter.');
      return;
    }

    const newAccount = {
      nim: cleanNim,
      name: cleanName,
      division: formDivision,
      role: cleanRole,
      password: cleanPass,
      createdAt: getDateStamp(),
      isDefault: false,
    };

    onAddAccount(newAccount);
    addLog(`Akun mahasiswa baru ditambahkan: ${cleanName} (${cleanNim})`, 'success');

    setFormSuccess(`Akun ${cleanName} (${cleanNim}) berhasil didaftarkan!`);
    setFormNim('');
    setFormName('');
    setFormPassword('password123');

    setTimeout(() => {
      setFormSuccess('');
      setIsAddFormOpen(false);
    }, 1500);
  };

  const handleStartEditPassword = (acc) => {
    setEditingNim(acc.nim);
    setNewPasswordVal(acc.password);
  };

  const handleSavePassword = (nim) => {
    if (!newPasswordVal.trim() || newPasswordVal.trim().length < 4) {
      alert('Kata sandi minimal 4 karakter.');
      return;
    }
    onUpdatePassword(nim, newPasswordVal.trim());
    addLog(`Kata sandi NIM ${nim} berhasil diperbarui`, 'info');
    setEditingNim(null);
    setNewPasswordVal('');
  };

  const handleDelete = (nim, name) => {
    if (window.confirm(`Hapus akun mahasiswa ${name} (${nim}) dari database?`)) {
      onDeleteAccount(nim);
      addLog(`Akun mahasiswa dihapus: ${name} (${nim})`, 'warning');
      setSelectedRows((prev) => prev.filter((id) => id !== nim));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Hapus ${selectedRows.length} akun mahasiswa yang dipilih?`)) {
      selectedRows.forEach((nim) => onDeleteAccount(nim));
      addLog(`${selectedRows.length} akun mahasiswa dihapus massal`, 'warning');
      setSelectedRows([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAccounts.map((acc) => acc.nim));
    }
  };

  const handleToggleSelectRow = (nim) => {
    setSelectedRows((prev) =>
      prev.includes(nim) ? prev.filter((id) => id !== nim) : [...prev, nim]
    );
  };

  const handleCopyNim = (nim) => {
    navigator.clipboard.writeText(nim);
    setCopiedNim(nim);
    setTimeout(() => setCopiedNim(null), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(accounts, null, 2));
    setCopiedJson(true);
    addLog('Data akun JSON disalin ke clipboard', 'info');
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(accounts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'teradesk_registered_accounts.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('File teradesk_registered_accounts.json diunduh', 'info');
  };

  const handleImportJson = () => {
    setImportStatus(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        setImportStatus({ ok: false, msg: 'Format JSON harus berupa Array daftar akun.' });
        return;
      }
      let addedCount = 0;
      parsed.forEach((item) => {
        if (item.nim && item.password && !accounts.some((a) => a.nim === item.nim)) {
          onAddAccount({
            nim: String(item.nim),
            name: item.name || 'Mahasiswa',
            division: item.division || 'BPH',
            role: item.role || 'Anggota',
            password: String(item.password),
            createdAt: item.createdAt || getDateStamp(),
            isDefault: false,
          });
          addedCount++;
        }
      });
      addLog(`Import JSON: ${addedCount} akun baru ditambahkan`, 'success');
      setImportStatus({ ok: true, msg: `Berhasil mengimpor ${addedCount} akun baru ke sistem!` });
      setImportJsonText('');
    } catch {
      setImportStatus({ ok: false, msg: 'Sintaks JSON tidak valid. Periksa tanda koma dan kurung kurawal.' });
    }
  };

  const toggleModuleStatus = (modId) => {
    setModuleStatuses((prev) => {
      const updated = !prev[modId];
      addLog(`Status modul ${modId.toUpperCase()} diubah menjadi ${updated ? 'AKTIF' : 'MAINTENANCE'}`, 'info');
      return { ...prev, [modId]: updated };
    });
  };

  const handleApproveProposal = (id) => {
    setParSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? { ...sub, status: 'Disetujui', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
          : sub
      )
    );
    addLog(`Proposal ${id} disetujui oleh Administrator Alif Fikri`, 'success');
  };

  // Filtered accounts based on search query and division
  const filteredAccounts = accounts.filter((acc) => {
    const matchDivision =
      selectedDivision === 'Semua Divisi' || acc.division === selectedDivision;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      acc.nim.toLowerCase().includes(q) ||
      acc.name.toLowerCase().includes(q) ||
      acc.role.toLowerCase().includes(q) ||
      acc.division.toLowerCase().includes(q);
    return matchDivision && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. LEFT SIDEBAR: REAL TERADESK SERVICES & MANAGEMENT TABS */}
      <aside className="w-64 bg-white border-r border-slate-200/80 shrink-0 hidden lg:flex flex-col justify-between p-5 min-h-screen sticky top-0 h-screen z-20 overflow-y-auto">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo-teramedia.png"
                alt="Logo TERAMEDIA"
                className="w-9 h-9 object-contain drop-shadow-xs shrink-0"
              />
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                  TeraDesk
                </span>
                <span className="text-[10px] font-semibold text-blue-600 font-mono tracking-wider uppercase">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={onBackToLanding}
              className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Kembali ke Beranda Landing"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-5">
            
            {/* SECTION 1: UTAMA */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                MENU UTAMA
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentNav('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'dashboard'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={16} className={currentNav === 'dashboard' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Ringkasan Dashboard</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentNav('students')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'students'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={16} className={currentNav === 'students' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Data Mahasiswa & Akun</span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    currentNav === 'students' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {accounts.length}
                  </span>
                </button>
              </div>
            </div>

            {/* SECTION 2: TAB LAYANAN ASLI TERADESK */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                LAYANAN WORKSPACE (8 MODUL)
              </p>
              <div className="space-y-1">
                {availableServices.map((svc) => {
                  const Icon = svc.icon;
                  const isActive = currentNav === svc.id;

                  return (
                    <button
                      key={svc.id}
                      onClick={() => setCurrentNav(svc.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <Icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                        <span className="truncate">{svc.title.split('(')[0].trim()}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${moduleStatuses[svc.id] ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: KONTROL SISTEM */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                KONTROL & SISTEM
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentNav('session')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'session'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className={currentNav === 'session' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Sesi & Keamanan</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>

                <button
                  onClick={() => setCurrentNav('backup')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'backup'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database size={16} className={currentNav === 'backup' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Cadangan JSON</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentNav('logs')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'logs'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className={currentNav === 'logs' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Log Aktivitas</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                    {logs.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav('settings')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'settings'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal size={16} className={currentNav === 'settings' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Pengaturan Sistem</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Zero-Trust Destroy Session Button */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {authUser?.name || 'Alif Fikri'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {authUser?.role || 'Demisioner Ketua Umum'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onForceDestroySession}
            className="w-full py-2 px-3 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 mb-2"
          >
            <LogOut size={13} />
            <span>Hancurkan Sesi</span>
          </button>

          <p className="text-[10px] text-center text-slate-400 font-medium">
            © 2026 TERAMEDIA / TeraDesk
          </p>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10">
          {/* Search Bar for TeraDesk */}
          <div className="relative w-72 lg:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Layanan, Proposal, atau NIM..."
              className="w-full pl-9 pr-14 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200/80 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
              Ctrl + K
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToPortal}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Buka Portal Hub</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer relative"
                title="Notifikasi Audit"
              >
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <p className="text-xs font-bold text-slate-900">Jejak Audit Real-Time</p>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Tandai Dibaca</span>
                  </div>
                  <div className="space-y-2">
                    {logs.slice(0, 3).map((l) => (
                      <div key={l.id} className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700">
                        <span className="font-mono text-[9px] text-slate-400 block">{l.time}</span>
                        {l.event}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Add Student Button */}
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Mahasiswa</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {authUser?.name || 'Alif Fikri'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-none">
                  {authUser?.role || 'Demisioner Ketua Umum'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* TAB 1: EXECUTIVE DASHBOARD (TERADESK METRICS & VISUALIZATIONS) */}
          {currentNav === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Header Title + Semester Filter & Export JSON */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Dashboard Eksekutif Organisasi
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Monitoring terpusat aktivitas 8 modul digitalisasi TeraDesk TERAMEDIA.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                  <button
                    onClick={() => setDateRangeFilter((prev) => (prev.includes('Ganjil') ? 'Semester Genap 2026/2027' : 'Semester Ganjil 2026/2027'))}
                    className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 shadow-xs cursor-pointer hover:bg-slate-50"
                  >
                    <Calendar size={14} className="text-slate-400" />
                    <span>{dateRangeFilter}</span>
                  </button>

                  <div className="relative">
                    <select
                      value={timeframeFilter}
                      onChange={(e) => setTimeframeFilter(e.target.value)}
                      className="bg-white px-3 py-2 pr-7 rounded-xl border border-slate-200 text-slate-700 shadow-xs appearance-none cursor-pointer focus:outline-hidden hover:bg-slate-50"
                    >
                      <option value="Bulan Ini">Bulan Ini</option>
                      <option value="Minggu Ini">Minggu Ini</option>
                      <option value="Semester Ini">Semester Ini</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Download size={13} className="text-slate-400" />
                    <span>Ekspor JSON</span>
                  </button>
                </div>
              </div>

              {/* ROW 1: 3 KPI CARDS (Real TeraDesk Project Data) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* KPI 1: PAR Proposals */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <FileCheck2 size={16} className="text-indigo-500" />
                      <span>Proposal Kegiatan (PAR)</span>
                    </div>
                    <button onClick={() => setCurrentNav('par')} className="text-slate-300 hover:text-slate-600">
                      <Info size={14} />
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      12 Proposal
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      +15.8% ↗
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    10 Disetujui • 2 Dalam Review BPH
                  </p>
                </div>

                {/* KPI 2: Finance & Kas */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Receipt size={16} className="text-teal-500" />
                      <span>Realisasi Kas & Anggaran</span>
                    </div>
                    <button onClick={() => setCurrentNav('finance')} className="text-slate-300 hover:text-slate-600">
                      <Info size={14} />
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      Rp 18.450.000
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      34.0% <ArrowDownRight size={12} />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Saldo Kas Aktif Organisasi Periode 2026
                  </p>
                </div>

                {/* KPI 3: Asset Availability */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Boxes size={16} className="text-amber-500" />
                      <span>Ketersediaan Aset Multimedia</span>
                    </div>
                    <button onClick={() => setCurrentNav('asset')} className="text-slate-300 hover:text-slate-600">
                      <Info size={14} />
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      86.5%
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      24.2% <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    21 dari 24 Alat Siap Pakai di Sekretariat
                  </p>
                </div>
              </div>

              {/* ROW 2: REAL TERADESK ACTIVITY CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT CARD (60%): Statistik Aktivitas Modul Organisasi (Ribbon Flow Chart) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Layers size={16} className="text-blue-500" />
                        <span>Statistik Aktivitas Modul Organisasi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentNav('logs')}
                          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer"
                        >
                          <Filter size={11} className="text-slate-400" />
                          <span>Audit Log</span>
                        </button>
                        <button
                          onClick={() => setCurrentNav('students')}
                          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        9,258 Mutasi Layanan
                      </span>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                        <span className="text-emerald-600 font-bold inline-flex items-center">
                          15.8% ↗
                        </span>
                        <span>+ 143 aktivitas verifikasi minggu ini</span>
                      </p>
                    </div>
                  </div>

                  {/* SVG Connected Ribbon Chart for Real TeraDesk Services */}
                  <div className="w-full h-56 relative flex items-center justify-center">
                    <svg viewBox="0 0 520 220" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="ribbonHelpdesk" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.35" />
                        </linearGradient>
                        <linearGradient id="ribbonPresensi" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="ribbonKas" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="ribbonArsip" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="ribbonPar" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#312E81" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#312E81" stopOpacity="0.35" />
                        </linearGradient>
                      </defs>

                      {/* Ribbons: Okt -> Nov */}
                      <path d="M 132,96 C 186,96 186,118 240,118 L 240,128 C 186,128 186,108 132,108 Z" fill="url(#ribbonHelpdesk)" />
                      <path d="M 132,111 C 186,111 186,131 240,131 L 240,143 C 186,143 186,125 132,125 Z" fill="url(#ribbonPresensi)" />
                      <path d="M 132,128 C 186,128 186,146 240,146 L 240,160 C 186,160 186,144 132,144 Z" fill="url(#ribbonKas)" />
                      <path d="M 132,147 C 186,147 186,163 240,163 L 240,179 C 186,179 186,165 132,165 Z" fill="url(#ribbonArsip)" />
                      <path d="M 132,168 C 186,168 186,182 240,182 L 240,204 C 186,204 186,194 132,194 Z" fill="url(#ribbonPar)" />

                      {/* Ribbons: Nov -> Des */}
                      <path d="M 290,118 C 344,118 344,48 398,48 L 398,66 C 344,66 344,128 290,128 Z" fill="url(#ribbonHelpdesk)" />
                      <path d="M 290,131 C 344,131 344,69 398,69 L 398,89 C 344,89 344,143 290,143 Z" fill="url(#ribbonPresensi)" />
                      <path d="M 290,146 C 344,146 344,92 398,92 L 398,116 C 344,116 344,160 290,160 Z" fill="url(#ribbonKas)" />
                      <path d="M 290,163 C 344,163 344,119 398,119 L 398,147 C 344,147 344,179 290,179 Z" fill="url(#ribbonArsip)" />
                      <path d="M 290,182 C 344,182 344,150 398,150 L 398,188 C 344,188 344,204 290,204 Z" fill="url(#ribbonPar)" />

                      {/* Column 1: Okt */}
                      <text x="107" y="86" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                        2,988 Hits
                      </text>
                      <rect x="82" y="96" width="50" height="12" rx="4" fill="#2DD4BF" />
                      <rect x="82" y="111" width="50" height="14" rx="4" fill="#38BDF8" />
                      <rect x="82" y="128" width="50" height="16" rx="4" fill="#818CF8" />
                      <rect x="82" y="147" width="50" height="18" rx="4" fill="#6366F1" />
                      <rect x="82" y="168" width="50" height="26" rx="4" fill="#312E81" />
                      <text x="107" y="214" textAnchor="middle" className="text-[11px] font-medium fill-slate-400">
                        Okt
                      </text>

                      {/* Column 2: Nov */}
                      <text x="265" y="108" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                        1,765 Hits
                      </text>
                      <rect x="240" y="118" width="50" height="10" rx="4" fill="#2DD4BF" />
                      <rect x="240" y="131" width="50" height="12" rx="4" fill="#38BDF8" />
                      <rect x="240" y="146" width="50" height="14" rx="4" fill="#818CF8" />
                      <rect x="240" y="163" width="50" height="16" rx="4" fill="#6366F1" />
                      <rect x="240" y="182" width="50" height="22" rx="4" fill="#312E81" />
                      <text x="265" y="214" textAnchor="middle" className="text-[11px] font-medium fill-slate-400">
                        Nov
                      </text>

                      {/* Column 3: Des */}
                      <text x="423" y="38" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                        4,005 Hits
                      </text>
                      <rect x="398" y="48" width="50" height="18" rx="4" fill="#2DD4BF" />
                      <rect x="398" y="69" width="50" height="20" rx="4" fill="#38BDF8" />
                      <rect x="398" y="92" width="50" height="24" rx="4" fill="#818CF8" />
                      <rect x="398" y="119" width="50" height="28" rx="4" fill="#6366F1" />
                      <rect x="398" y="150" width="50" height="38" rx="4" fill="#312E81" />
                      <text x="423" y="214" textAnchor="middle" className="text-[11px] font-medium fill-slate-400">
                        Des
                      </text>
                    </svg>
                  </div>

                  {/* Legend: Real Services */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#312E81]"></span> PAR Proposal
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]"></span> E-Arsip
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#818CF8]"></span> Kas Anggaran
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]"></span> Presensi QR
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#2DD4BF]"></span> Helpdesk Desain
                    </span>
                  </div>
                </div>

                {/* RIGHT CARD (40%): Kehadiran & Akses Rapat Mingguan */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <ClipboardCheck size={16} className="text-purple-500" />
                        <span>Presensi & Akses Rapat Mingguan</span>
                      </div>
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        Rapat Pleno
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        1,473 Kehadiran
                      </span>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                        <span className="text-emerald-600 font-bold inline-flex items-center">
                          8.3% ↗
                        </span>
                        <span>+ 84 pengurus hadir pekan ini</span>
                      </p>
                    </div>
                  </div>

                  {/* Bar Chart: Tuesday Pleno Highlighted */}
                  <div className="w-full h-56 flex items-end justify-between px-2 pt-8 pb-2">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 sm:w-7 bg-slate-100 rounded-md h-16"></div>
                      <span className="text-[11px] font-medium text-slate-400">Min</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 sm:w-7 bg-slate-100 rounded-md h-24"></div>
                      <span className="text-[11px] font-medium text-slate-400">Sen</span>
                    </div>

                    {/* Tuesday Pleno Highlight */}
                    <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                      <span className="text-[10px] font-bold text-slate-800 tracking-tight">
                        387
                      </span>
                      <div className="w-6 sm:w-7 bg-gradient-to-t from-violet-700 to-indigo-500 rounded-md h-36 shadow-sm shadow-indigo-200"></div>
                      <span className="text-[11px] font-bold text-slate-900">Sel</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 sm:w-7 bg-slate-100 rounded-md h-28"></div>
                      <span className="text-[11px] font-medium text-slate-400">Rab</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 sm:w-7 bg-slate-100 rounded-md h-18"></div>
                      <span className="text-[11px] font-medium text-slate-400">Kam</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 sm:w-7 bg-slate-100 rounded-md h-22"></div>
                      <span className="text-[11px] font-medium text-slate-400">Jum</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 sm:w-7 bg-slate-100 rounded-md h-14"></div>
                      <span className="text-[11px] font-medium text-slate-400">Sab</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: DIVISI DISTRIBUTION & INTEGRATED SERVICES TABLE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT CARD (40%): Distribusi Anggota per Divisi */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Users size={16} className="text-indigo-500" />
                        <span>Distribusi Anggota per Divisi</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">48 Kader Aktif</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-left mb-4">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> BPH & Medinfo
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">15 Kader (35%)</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Kaderisasi & Bakat
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">22 Kader (45%)</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Logistik & Danus
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">11 Kader (20%)</p>
                      </div>
                    </div>
                  </div>

                  {/* Half-Donut Gauge SVG */}
                  <div className="w-full flex items-center justify-center pt-2">
                    <svg viewBox="0 0 240 130" className="w-48 overflow-visible">
                      <path
                        d="M 30,120 A 90,90 0 0,1 210,120"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="24"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 120,30 A 90,90 0 0,1 210,120"
                        fill="none"
                        stroke="#2DD4BF"
                        strokeWidth="24"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 30,120 A 90,90 0 0,1 125,30"
                        fill="none"
                        stroke="#5C46E5"
                        strokeWidth="24"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* RIGHT CARD (60%): Daftar Layanan Workspace Terintegrasi */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Boxes size={16} className="text-blue-500" />
                        <span>Status 8 Modul Layanan Terintegrasi</span>
                      </div>
                      <button
                        onClick={onNavigateToPortal}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                      >
                        <span>Lihat Semua Katalog</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                            <th className="py-2.5 px-3">LAYANAN WORKSPACE</th>
                            <th className="py-2.5 px-3">KATEGORI</th>
                            <th className="py-2.5 px-3">PENGGUNAAN</th>
                            <th className="py-2.5 px-3 text-right">AKSI CEPAT</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                          {availableServices.slice(0, 4).map((svc) => {
                            const Icon = svc.icon;
                            return (
                              <tr key={svc.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${svc.color}`}>
                                      <Icon size={14} />
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 block leading-tight">
                                        {svc.title.split('(')[0].trim()}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {svc.activeCount}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-slate-500 text-[11px]">{svc.category}</td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="w-[85%] h-full bg-blue-600 rounded-full"></div>
                                    </div>
                                    <button
                                      onClick={() => toggleModuleStatus(svc.id)}
                                      className={`text-[10px] font-mono font-bold cursor-pointer hover:underline ${
                                        moduleStatuses[svc.id] ? 'text-emerald-600' : 'text-slate-400'
                                      }`}
                                      title="Klik untuk ubah status online / maintenance"
                                    >
                                      {moduleStatuses[svc.id] ? 'Online' : 'Maint.'}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    onClick={() => setCurrentNav(svc.id)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                                  >
                                    Kelola Tab
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: PAR (PROGRAM APPROVAL REQUEST) */}
          {currentNav === 'par' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <FileCheck2 size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      PAR (Program Approval Request)
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Verifikasi proposal bertingkat digital, SLA review, dan disposisi anggaran panitia.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('par')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman PAR Penuh</span>
                </button>
              </div>

              {/* Submissions Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Daftar Pengajuan Proposal Terbaru
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Total: {parSubmissions.length} Berkas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                        <th className="py-3 px-4">KODE & PROPOSAL</th>
                        <th className="py-3 px-4">DIVISI / PIC</th>
                        <th className="py-3 px-4">ANGGARAN</th>
                        <th className="py-3 px-4">JADWAL</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">AKSI REVIEW</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {parSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono text-[10px] text-indigo-600 font-bold block">{sub.id}</span>
                            <span className="font-bold text-slate-900">{sub.title}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="block font-semibold text-slate-800">{sub.division}</span>
                            <span className="text-[11px] text-slate-400">PIC: {sub.pic}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{sub.budget}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{sub.date}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${sub.statusColor}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {sub.status !== 'Disetujui' ? (
                              <button
                                onClick={() => handleApproveProposal(sub.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Setujui
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                                <Check size={12} /> Tuntas
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ARCHIVE (DIGITALISASI E-ARSIP & PERSURATAN) */}
          {currentNav === 'archive' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                    <FolderArchive size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Digitalisasi E-Arsip & Persuratan
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Repositori cloud SK kepengurusan, generator nomor surat resmi, dan brankas LPJ.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('archive')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman E-Arsip Penuh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Generator Nomor Surat</span>
                  <p className="text-lg font-bold text-slate-900 mt-2 font-mono">019/UND/MEDINFO/XI/2026</p>
                  <p className="text-xs text-slate-500 mt-1">Kode otomatis anti-bentrok divisi</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Surat Masuk & Keluar</span>
                  <p className="text-lg font-bold text-slate-900 mt-2">148 Dokumen Tersimpan</p>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">Semua dokumen terenkripsi</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">LPJ Kegiatan Terarsip</span>
                  <p className="text-lg font-bold text-slate-900 mt-2">8 Berkas Disahkan</p>
                  <p className="text-xs text-slate-500 mt-1">Siap untuk Musyawarah Besar</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ASSET (DIGITALISASI ASET & INVENTARIS) */}
          {currentNav === 'asset' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <Boxes size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Digitalisasi Aset & Inventaris
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Pencatatan inventaris fisik multimedia, jadwal peminjaman alat, dan kondisi perlengkapan.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('asset')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman Aset Penuh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Tersedia</span>
                  <h3 className="font-bold text-slate-900 mt-2 text-sm">Sony Mirrorless A6400</h3>
                  <p className="text-xs text-slate-500 mt-1">Kit Lensa 16-50mm • Medinfo</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Sedang Dipinjam</span>
                  <h3 className="font-bold text-slate-900 mt-2 text-sm">Mic Wireless Boya BY-M1</h3>
                  <p className="text-xs text-slate-500 mt-1">Dipinjam Panitia LDK (Fajar)</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Tersedia</span>
                  <h3 className="font-bold text-slate-900 mt-2 text-sm">Proyektor Epson EB-E500</h3>
                  <p className="text-xs text-slate-500 mt-1">3300 Lumens • Inventaris</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Booking Aktif</span>
                  <h3 className="font-bold text-slate-900 mt-2 text-sm">Ruang Rapat Sekretariat</h3>
                  <p className="text-xs text-slate-500 mt-1">Rapat BPH Pukul 16.00 WIB</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCE (KAS & REIMBURSEMENT) */}
          {currentNav === 'finance' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
                    <Receipt size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Kas & Reimbursement Anggaran
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Pencatatan kas masuk/keluar organisasi serta verifikasi nota belanja belanja proker.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('finance')}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman Kas Penuh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Saldo Kas Operasional</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-2">Rp 18.450.000</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">Sehat & Transparan</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Klaim Nota Menunggu Review</span>
                  <p className="text-xl font-extrabold text-amber-600 mt-2">4 Nota Belanja</p>
                  <p className="text-xs text-slate-500 mt-1">Total klaim: Rp 1.910.000</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pagu Anggaran Terealisasi</span>
                  <p className="text-xl font-extrabold text-blue-600 mt-2">34.0% Terpakai</p>
                  <p className="text-xs text-slate-500 mt-1">Tersisa 66% hingga akhir periode</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ATTENDANCE (PRESENSI QR & NOTULA) */}
          {currentNav === 'attendance' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                    <ClipboardCheck size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Presensi Digital QR Code & Notula
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Absensi rapat pleno dan proker via kode QR dengan pembuatan notula otomatis.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('attendance')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman Presensi Penuh</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-purple-600 uppercase">Sesi Presensi Aktif</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Rapat Pleno Paruh Periode 2026</h3>
                    <p className="text-xs text-slate-500">Selasa, 03 November 2026 • 42 dari 48 Pengurus Hadir (93%)</p>
                  </div>
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-xs font-mono font-bold">
                    [QR CODE]
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMELINE (MASTER TIMELINE & KALENDER) */}
          {currentNav === 'timeline' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
                    <CalendarRange size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Master Timeline & Kalender Kerja
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Sinkronisasi agenda kegiatan seluruh divisi kepengurusan untuk mencegah jadwal bentrok.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('timeline')}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman Timeline Penuh</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-700 font-mono text-xs font-bold rounded-lg border border-blue-200">
                      05 - 07 Nov
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Workshop UI/UX & Creative Media</h4>
                      <p className="text-xs text-slate-500">Divisi Media & Informasi • Lab Multimedia</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Jadwal Aman</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-mono text-xs font-bold rounded-lg border border-indigo-200">
                      15 - 17 Nov
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Latihan Dasar Kepemimpinan (LDK) 2026</h4>
                      <p className="text-xs text-slate-500">Divisi Kaderisasi & SDM • Villa Pusdiklat</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Jadwal Aman</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HR (DATABASE ANGGOTA & SDM) */}
          {currentNav === 'hr' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Database Anggota & Tata Kelola SDM
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Direktori profil pengurus, keahlian khusus, dan histori penugasan kepanitiaan.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('hr')}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman SDM Penuh</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-slate-900">48</p>
                  <p className="text-xs text-slate-500 mt-1">Kader Aktif</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-blue-600">7</p>
                  <p className="text-xs text-slate-500 mt-1">Divisi Struktural</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">100%</p>
                  <p className="text-xs text-slate-500 mt-1">SK Diterbitkan</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-purple-600">32</p>
                  <p className="text-xs text-slate-500 mt-1">Kepanitiaan Aktif</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HELPDESK (HELPDESK & REQUEST DESAIN) */}
          {currentNav === 'helpdesk' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <Headphones size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Helpdesk & Request Desain Medinfo
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Tiket permohonan materi publikasi visual, feed IG, dan bantuan teknis multimedia.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('helpdesk')}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman Helpdesk Penuh</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-rose-600 font-bold block">TIKET-089</span>
                    <h4 className="text-sm font-bold text-slate-900">Request Desain Poster & Twibbon LDK 2026</h4>
                    <p className="text-xs text-slate-500">Pengaju: Divisi Kaderisasi • Deadline: 10 Nov 2026</p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Sedang Dikerjakan</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-rose-600 font-bold block">TIKET-090</span>
                    <h4 className="text-sm font-bold text-slate-900">Permohonan Pinjam Sound Portable & Mic</h4>
                    <p className="text-xs text-slate-500">Pengaju: Divisi Minat & Bakat • Acara: TeraCup</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Disetujui</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDENTS (DATA MAHASISWA & KREDENSIAL) */}
          {currentNav === 'students' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Data Mahasiswa & Kredensial Login
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Kelola data akun NIM, hak akses divisi, dan kata sandi mahasiswa terdaftar.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAddFormOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Tambah Mahasiswa</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                  >
                    <Download size={14} />
                    <span>Ekspor JSON</span>
                  </button>
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter NIM atau nama..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                    >
                      {divisionsList.map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  {selectedRows.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer hover:bg-rose-100"
                    >
                      <Trash2 size={13} />
                      <span>Hapus Terpilih ({selectedRows.length})</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/60 border-b border-slate-100">
                        <th className="py-3 px-4 w-8">
                          <input
                            type="checkbox"
                            checked={filteredAccounts.length > 0 && selectedRows.length === filteredAccounts.length}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4">MAHASISWA (NIM & NAMA)</th>
                        <th className="py-3 px-4">DIVISI & JABATAN</th>
                        <th className="py-3 px-4">KATA SANDI</th>
                        <th className="py-3 px-4">TERDAFTAR</th>
                        <th className="py-3 px-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredAccounts.map((acc) => {
                        const isEditingThis = editingNim === acc.nim;
                        const isPassVisible = visiblePasswords[acc.nim];

                        return (
                          <tr key={acc.nim} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(acc.nim)}
                                onChange={() => handleToggleSelectRow(acc.nim)}
                                className="rounded border-slate-300 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {acc.name ? acc.name.charAt(0).toUpperCase() : 'M'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{acc.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="font-mono text-[11px] text-slate-500">{acc.nim}</span>
                                    <button
                                      onClick={() => handleCopyNim(acc.nim)}
                                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                      title="Salin NIM"
                                    >
                                      {copiedNim === acc.nim ? (
                                        <Check size={11} className="text-emerald-500" />
                                      ) : (
                                        <Copy size={11} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-0.5">
                                {acc.division}
                              </span>
                              <p className="text-[11px] text-slate-500">{acc.role}</p>
                            </td>
                            <td className="py-3 px-4">
                              {isEditingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={newPasswordVal}
                                    onChange={(e) => setNewPasswordVal(e.target.value)}
                                    className="px-2 py-1 border border-blue-400 rounded-lg text-xs font-mono w-28 bg-white"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSavePassword(acc.nim)}
                                    className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                                  >
                                    <Check size={12} />
                                  </button>
                                  <button
                                    onClick={() => setEditingNim(null)}
                                    className="p-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 cursor-pointer"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs">
                                    {isPassVisible ? acc.password : '••••••••'}
                                  </span>
                                  <button
                                    onClick={() => togglePasswordVisibility(acc.nim)}
                                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                  >
                                    {isPassVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                                  </button>
                                  <button
                                    onClick={() => handleStartEditPassword(acc)}
                                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                    title="Edit Sandi"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                              {acc.createdAt || '2026-11-03'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => onImpersonate(acc)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                                >
                                  Masuk
                                </button>
                                <button
                                  onClick={() => handleDelete(acc.nim, acc.name)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus Akun"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SESSION & SECURITY */}
          {currentNav === 'session' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Sesi Pengguna & Keamanan Zero-Trust
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Audit keamanan sesi administrator terautentikasi dan mekanisme auto-destroy.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center">
                    {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {authUser?.name || 'Alif Fikri'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      NIM: <span className="font-mono font-bold text-slate-800">{authUser?.nim || '23404053'}</span> • Jabatan: <span className="font-semibold text-slate-800">{authUser?.role || 'Demisioner Ketua Umum'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-xs font-bold text-slate-700">Tipe Token Autentikasi</p>
                    <p className="text-xs text-slate-500 mt-1">Zero-Trust Memory Session Guard</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-xs font-bold text-slate-700">Kebijakan Auto-Destroy</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">Aktif (Sesi hancur otomatis saat browser reload)</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Ingin mengakhiri sesi administrator dan mengunci kembali dashboard?
                  </p>
                  <button
                    onClick={onForceDestroySession}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                  >
                    <LogOut size={14} />
                    <span>Hancurkan Sesi Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BACKUP & DATA INTEGRATION */}
          {currentNav === 'backup' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Cadangan & Integrasi Data Akun (JSON)
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Simpan cadangan data mahasiswa terdaftar secara offline atau impor berkas JSON.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Kredensial Aktif ({accounts.length} Akun)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {copiedJson ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedJson ? 'Disalin!' : 'Salin JSON'}</span>
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download size={13} />
                      <span>Unduh .json</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono max-h-64 overflow-y-auto leading-relaxed">
                  {JSON.stringify(accounts, null, 2)}
                </pre>

                {/* Import section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-800">Impor Data Akun dari JSON</p>
                  <textarea
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='Tempel array JSON di sini, contoh: [{"nim": "23404099", "name": "Budi", "password": "pass"}]'
                    rows={4}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-blue-600"
                  />
                  {importStatus && (
                    <p className={`text-xs font-semibold ${importStatus.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {importStatus.msg}
                    </p>
                  )}
                  <button
                    onClick={handleImportJson}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>Mulai Impor Akun</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGS & AUDIT TRAIL */}
          {currentNav === 'logs' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Log Aktivitas & Jejak Audit
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Rekam jejak setiap aksi mutasi akun, perombakan sandi, dan status operasional.
                  </p>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Bersihkan Log
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {logs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Tidak ada catatan aktivitas sistem saat ini.
                  </div>
                ) : (
                  logs.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          item.type === 'success' ? 'bg-emerald-500' : item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}></span>
                        <span className="text-xs font-medium text-slate-800">{item.event}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{item.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {currentNav === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Pengaturan Sistem TeraDesk
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Preferensi lingkungan administrator dan konfigurasi global.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Tombol Cepat Pengembang</p>
                      <p className="text-[11px] text-slate-500">Akses cepat menggunakan tombol kombinasi keyboard</p>
                    </div>
                    <kbd className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700">
                      Ctrl + Shift + D
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Reset Akun Organisasi</p>
                      <p className="text-[11px] text-slate-500">Kembalikan daftar akun ke default akun Alif Fikri</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Reset semua akun mahasiswa kembali ke akun default Alif Fikri?')) {
                          onResetAccounts();
                          addLog('Akun direset ke default', 'warning');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      <span>Reset Akun</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. MODAL: TAMBAH MAHASISWA BARU */}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  <Plus size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftarkan Akun Mahasiswa
                </h3>
              </div>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Induk Mahasiswa (NIM)
                </label>
                <input
                  type="text"
                  value={formNim}
                  onChange={(e) => setFormNim(e.target.value)}
                  placeholder="Contoh: 23404099"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Divisi
                  </label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    {divisionsList.filter((d) => d !== 'Semua Divisi').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Anggota Aktif"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Kata Sandi Default
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPass}
                    className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={11} />
                    <span>Acak Sandi</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  {formError}
                </p>
              )}

              {formSuccess && (
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  {formSuccess}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Mahasiswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;

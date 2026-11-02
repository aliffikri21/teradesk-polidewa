import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Terminal,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  LogIn,
  LogOut,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Check,
  Search,
  ShieldCheck,
  AlertCircle,
  Database,
  Layers,
  Sparkles,
  Users,
  Activity,
  History,
  FileCheck2,
  FolderArchive,
  Boxes,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Headphones,
  Key
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

const workspaceModules = [
  { id: 'par', title: 'PAR (Program Approval Request)', category: 'Administrasi', icon: FileCheck2 },
  { id: 'archive', title: 'Digitalisasi Arsip & Surat', category: 'Administrasi', icon: FolderArchive },
  { id: 'asset', title: 'Digitalisasi Aset & Inventaris', category: 'Logistik', icon: Boxes },
  { id: 'finance', title: 'Kas & Reimbursement Nota', category: 'Keuangan', icon: Receipt },
  { id: 'attendance', title: 'Presensi Digital QR Code', category: 'Operasional', icon: ClipboardCheck },
  { id: 'timeline', title: 'Master Timeline Kerja', category: 'Perencanaan', icon: CalendarRange },
  { id: 'hr', title: 'Database Anggota & SDM', category: 'Kaderisasi', icon: Users },
  { id: 'helpdesk', title: 'Helpdesk & Request Desain', category: 'Layanan', icon: Headphones },
];

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
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'session' | 'backup' | 'logs'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua Divisi');

  // Form State
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

  // Copy Feedback state
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedNim, setCopiedNim] = useState(null);

  // Import JSON State
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  // Activity Logs
  const [logs, setLogs] = useState([
    { id: 1, time: '14:50:12', event: 'Sistem Inisialisasi Database Kredensial', type: 'info' },
    { id: 2, time: '14:52:40', event: 'Audit Session Guard: Auto-destroy on refresh diaktifkan', type: 'success' },
    { id: 3, time: '15:00:15', event: '5 Akun demo resmi organisasi dimuat ke memory', type: 'info' },
  ]);

  const addLog = (event, type = 'info') => {
    const time = new Date().toLocaleTimeString('id-ID');
    setLogs((prev) => [{ id: Date.now(), time, event, type }, ...prev.slice(0, 19)]);
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
      setFormError(`NIM ${cleanNim} sudah terdaftar dalam sistem.`);
      return;
    }

    if (!cleanName) {
      setFormError('Nama lengkap mahasiswa wajib diisi.');
      return;
    }

    if (!cleanPass || cleanPass.length < 4) {
      setFormError('Kata sandi minimal 4 karakter.');
      return;
    }

    const newAcc = {
      nim: cleanNim,
      name: cleanName,
      division: formDivision,
      role: cleanRole || 'Anggota Aktif',
      password: cleanPass,
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false,
    };

    onAddAccount(newAcc);
    addLog(`Akun baru terdaftar: ${cleanName} (${cleanNim}) - ${formDivision}`, 'success');
    setFormSuccess(`Mahasiswa ${cleanName} (${cleanNim}) berhasil didaftarkan ke sistem!`);
    setFormNim('');
    setFormName('');
    setFormRole('Anggota Aktif');
    setFormPassword('password123');

    setTimeout(() => setFormSuccess(''), 5000);
  };

  const handleSaveNewPassword = (nim) => {
    if (!newPasswordVal.trim() || newPasswordVal.trim().length < 4) {
      alert('Kata sandi baru minimal 4 karakter.');
      return;
    }
    onUpdatePassword(nim, newPasswordVal.trim());
    addLog(`Kata sandi NIM ${nim} berhasil diperbarui`, 'warning');
    setEditingNim(null);
    setNewPasswordVal('');
  };

  const handleCopyNim = (nim) => {
    navigator.clipboard.writeText(nim);
    setCopiedNim(nim);
    setTimeout(() => setCopiedNim(null), 1500);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(accounts, null, 2));
    setCopiedJson(true);
    addLog('Database akun disalin ke clipboard format JSON', 'info');
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
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        setImportStatus({ success: false, message: 'Format data JSON harus berupa Array objek akun.' });
        return;
      }
      const valid = parsed.every((item) => item.nim && item.password);
      if (!valid) {
        setImportStatus({ success: false, message: 'Setiap akun dalam JSON harus memiliki field "nim" dan "password".' });
        return;
      }
      parsed.forEach((item) => onAddAccount(item));
      addLog(`Berhasil mengimpor ${parsed.length} akun mahasiswa dari JSON`, 'success');
      setImportStatus({ success: true, message: `Berhasil mengimpor ${parsed.length} akun mahasiswa ke database.` });
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 4000);
    } catch {
      setImportStatus({ success: false, message: 'Sintaks format JSON tidak valid.' });
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchDivision = selectedDivision === 'Semua Divisi' || acc.division === selectedDivision;
    const matchSearch =
      acc.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.role && acc.role.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDivision && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#060D25] text-white flex flex-col font-sans">
      
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060D25]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none min-h-[44px]"
              title="Kembali ke Beranda Depan"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Beranda</span>
            </button>

            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <button
                onClick={onBackToLanding}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Beranda
              </button>
              <ChevronRight size={13} className="text-gray-600" />
              <button
                onClick={onNavigateToPortal}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Workspace Hub
              </button>
              <ChevronRight size={13} className="text-gray-600" />
              <span className="text-amber-300 font-semibold">Admin & Dev Console</span>
            </div>
          </div>

          {/* Right: Environment Pills & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl">
              <Terminal size={14} />
              <span>ADMIN MODE</span>
            </span>

            {authUser ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {authUser.name ? authUser.name.charAt(0) : 'P'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-bold text-white text-[11px] leading-tight truncate max-w-[120px]">
                    {authUser.name}
                  </p>
                  <p className="text-[9px] text-gray-400 font-mono leading-none">
                    NIM: {authUser.nim}
                  </p>
                </div>
                <button
                  onClick={onForceDestroySession}
                  className="ml-1 text-rose-300 hover:text-white p-1 hover:bg-rose-500/20 rounded cursor-pointer transition-colors"
                  title="Logout / Destroy Sesi"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hidden sm:inline-block">
                Status: Guest
              </span>
            )}

            <button
              onClick={onNavigateToPortal}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Buka Workspace</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Header Banner */}
      <div className="bg-linear-to-b from-[#0b1435] via-[#080E24] to-[#060D25] border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shrink-0">
              <Terminal size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  TERADESK DEV CONSOLE v1.2
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Panel Khusus Pengembang & Admin
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Dashboard Manajemen Developer & Admin Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                Pusat kendali mandiri: kelola kredensial mahasiswa (NIM & Kata Sandi), audit sesi kerja aktif, simulator bypass modul, dan manajemen data persistensi.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('accounts');
                const formElem = document.getElementById('add-student-form');
                if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer min-h-[44px]"
            >
              <UserPlus size={16} />
              <span>+ Daftarkan Mahasiswa</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/15 flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <Download size={16} />
              <span>Ekspor JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Key Telemetry Metric Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="bg-[#0b1433]/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider mb-1">
                Mahasiswa Terdaftar
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {accounts.length} Akun
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Tersimpan dalam database lokal</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#0b1433]/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider mb-1">
                Status Sesi Saat Ini
              </span>
              <div className="text-lg sm:text-xl font-bold truncate">
                {authUser ? (
                  <span className="text-emerald-400">{authUser.name}</span>
                ) : (
                  <span className="text-gray-400">Guest Mode</span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate font-mono">
                {authUser ? `NIM: ${authUser.nim}` : 'Akses workspace terkunci'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              authUser ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-400 border-white/10'
            }`}>
              <ShieldCheck size={22} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#0b1433]/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider mb-1">
                Protokol Sesi Refresh
              </span>
              <div className="text-lg sm:text-xl font-bold text-cyan-300">
                Auto-Destroy
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Sesi terhapus otomatis saat F5</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <RefreshCw size={22} />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-[#0b1433]/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider mb-1">
                Katalog Modul Aktif
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
                8 Modul
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Terintegrasi dalam platform</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Layers size={22} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. Tab Navigation Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-6">
        <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2">
          
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
              activeTab === 'accounts'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound size={16} />
            <span>Manajemen Kredensial Mahasiswa ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
              activeTab === 'session'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity size={16} />
            <span>Kontrol Sesi & Simulator Modul</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
              activeTab === 'backup'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database size={16} />
            <span>Ekspor / Impor JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
              activeTab === 'logs'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History size={16} />
            <span>Log Aktivitas Sistem ({logs.length})</span>
          </button>

        </div>
      </div>

      {/* 5. Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 flex-1">
        
        {/* TAB 1: Manajemen Akun Mahasiswa */}
        {activeTab === 'accounts' && (
          <div className="space-y-8">
            
            {/* Form Tambah Mahasiswa Baru */}
            <div id="add-student-form" className="bg-[#0b1433] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <UserPlus size={20} className="text-amber-400" />
                    <span>Daftarkan Mahasiswa Baru (NIM & Kata Sandi)</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Akun yang ditambahkan di sini langsung dapat digunakan mahasiswa untuk login ke Workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateRandomPass}
                  className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5 cursor-pointer transition-colors w-fit"
                >
                  <Sparkles size={14} />
                  <span>Generate Password Acak</span>
                </button>
              </div>

              {formError && (
                <div className="mb-6 bg-rose-500/15 border border-rose-500/30 rounded-2xl p-4 text-xs sm:text-sm text-rose-300 flex items-center gap-3 animate-in fade-in duration-150">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-6 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 text-xs sm:text-sm text-emerald-300 flex items-center gap-3 animate-in fade-in duration-150">
                  <Check size={18} className="shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* NIM Field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Nomor Induk Mahasiswa (NIM) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 2209010088"
                      value={formNim}
                      onChange={(e) => setFormNim(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                    />
                  </div>

                  {/* Nama Mahasiswa */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Nama Lengkap Mahasiswa <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Fadhil Ardiansyah"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                    />
                  </div>

                  {/* Divisi */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Divisi Organisasi
                    </label>
                    <select
                      value={formDivision}
                      onChange={(e) => setFormDivision(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer min-h-[44px]"
                    >
                      {divisionsList.filter(d => d !== 'Semua Divisi').map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  {/* Jabatan / Role */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Jabatan / Role
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Staff Publikasi & Sosmed"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Password & Submit Button Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Kata Sandi Akun <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Masukkan kata sandi (minimal 4 karakter)"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer min-h-[44px]"
                    >
                      <UserPlus size={16} />
                      <span>Daftarkan Mahasiswa</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Tabel Kredensial Mahasiswa */}
            <div className="bg-[#0b1433] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Header with Search, Division Filter, and Reset */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <KeyRound size={20} className="text-amber-400" />
                    <span>Daftar Kredensial Mahasiswa ({filteredAccounts.length})</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Kelola password, lihat akun terdaftar, atau gunakan tombol "Masuk" untuk pengujian tanpa login manual.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari NIM, Nama, Role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 w-52 sm:w-64 min-h-[44px]"
                    />
                  </div>

                  {/* Reset Accounts Button */}
                  <button
                    onClick={onResetAccounts}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                    title="Reset ke 5 akun demo default"
                  >
                    <RefreshCw size={14} />
                    <span>Reset Default</span>
                  </button>
                </div>
              </div>

              {/* Division Filter Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {divisionsList.map((div) => {
                  const isSelected = selectedDivision === div;
                  const count = div === 'Semua Divisi' 
                    ? accounts.length 
                    : accounts.filter(a => a.division === div).length;

                  return (
                    <button
                      key={div}
                      onClick={() => setSelectedDivision(div)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{div}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-gray-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#0e1940] text-gray-300 font-bold border-b border-white/10 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Mahasiswa</th>
                      <th className="px-5 py-3.5">NIM</th>
                      <th className="px-5 py-3.5">Divisi & Role</th>
                      <th className="px-5 py-3.5">Kata Sandi</th>
                      <th className="px-5 py-3.5 text-right">Aksi Developer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                          <p className="font-semibold text-white mb-1">Tidak ada akun mahasiswa yang cocok</p>
                          <p className="text-xs">Coba ubah kata kunci pencarian atau pilih divisi yang lain.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((acc) => {
                        const isShowingPass = visiblePasswords[acc.nim];
                        const isEditing = editingNim === acc.nim;
                        const isCopied = copiedNim === acc.nim;

                        return (
                          <tr key={acc.nim} className="hover:bg-white/5 transition-colors">
                            {/* Mahasiswa Name */}
                            <td className="px-5 py-4 font-semibold text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold text-sm shrink-0">
                                  {acc.name ? acc.name.charAt(0) : 'M'}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-xs sm:text-sm">{acc.name}</p>
                                  {acc.isDefault ? (
                                    <span className="text-[10px] text-amber-400/80 font-mono">Akun Demo Bawaan</span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 font-mono">Akun Kustom</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* NIM with Copy Button */}
                            <td className="px-5 py-4 font-mono text-amber-300 font-bold">
                              <button
                                onClick={() => handleCopyNim(acc.nim)}
                                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
                                title="Klik untuk salin NIM"
                              >
                                <span>{acc.nim}</span>
                                {isCopied ? (
                                  <Check size={13} className="text-emerald-400" />
                                ) : (
                                  <Copy size={13} className="text-gray-500 group-hover:text-amber-300" />
                                )}
                              </button>
                            </td>

                            {/* Divisi & Role */}
                            <td className="px-5 py-4">
                              <span className="font-semibold text-white block text-xs sm:text-sm">{acc.division}</span>
                              <span className="text-xs text-gray-400 block">{acc.role}</span>
                            </td>

                            {/* Password Column */}
                            <td className="px-5 py-4 font-mono">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={newPasswordVal}
                                    onChange={(e) => setNewPasswordVal(e.target.value)}
                                    placeholder="Password baru"
                                    className="px-3 py-1.5 bg-slate-900 border border-amber-400 rounded-lg text-xs text-white font-mono w-32 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveNewPassword(acc.nim)}
                                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                                    title="Simpan password"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setEditingNim(null)}
                                    className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs cursor-pointer"
                                    title="Batal"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-200 text-xs sm:text-sm">
                                    {isShowingPass ? acc.password : '••••••••'}
                                  </span>
                                  <button
                                    onClick={() => togglePasswordVisibility(acc.nim)}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                                    title={isShowingPass ? 'Sembunyikan password' : 'Lihat password'}
                                  >
                                    {isShowingPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingNim(acc.nim);
                                      setNewPasswordVal(acc.password);
                                    }}
                                    className="text-[11px] text-amber-400 hover:underline cursor-pointer ml-1"
                                    title="Ubah password akun ini"
                                  >
                                    Ubah
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                
                                {/* Impersonate / Quick Login */}
                                <button
                                  onClick={() => onImpersonate(acc)}
                                  className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/60 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 min-h-[36px]"
                                  title={`Login instan sebagai ${acc.name} tanpa ketik kata sandi`}
                                >
                                  <LogIn size={13} />
                                  <span>Masuk</span>
                                </button>

                                {/* Delete Account */}
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Yakin ingin menghapus akun mahasiswa ${acc.name} (${acc.nim})?`)) {
                                      onDeleteAccount(acc.nim);
                                      addLog(`Akun dihapus: ${acc.name} (${acc.nim})`, 'warning');
                                    }
                                  }}
                                  className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                                  title="Hapus akun mahasiswa ini"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Note */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-400 pt-2 gap-2">
                <span>Menampilkan {filteredAccounts.length} dari total {accounts.length} mahasiswa terdaftar.</span>
                <span className="font-mono text-[11px]">Database tersimpan di localStorage browser pengembang.</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Kontrol Sesi & Simulator Navigasi */}
        {activeTab === 'session' && (
          <div className="space-y-8">
            
            {/* Session Inspector Card */}
            <div className="bg-[#0b1433] border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5 mb-4">
                <ShieldCheck size={22} className="text-emerald-400" />
                <span>Status & Audit Sesi Otentikasi Workspace</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                
                {/* Active Session Info */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                  <span className="text-xs text-gray-400 block uppercase font-semibold mb-2">
                    State Pengguna Saat Ini
                  </span>

                  {authUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                          {authUser.name ? authUser.name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{authUser.name}</p>
                          <p className="text-xs text-amber-300 font-mono">NIM: {authUser.nim}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/10 text-xs text-gray-300 space-y-1">
                        <p>Divisi: <strong className="text-white">{authUser.division}</strong></p>
                        <p>Jabatan: <strong className="text-white">{authUser.role}</strong></p>
                        <p>Status: <span className="text-emerald-400 font-semibold">Tersambung (Akses Workspace Terbuka)</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-300 flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">GUEST MODE (Akses Workspace Terkunci)</strong>
                          <p className="mt-1 text-gray-300">
                            Pengguna belum login. Setiap tombol menuju workspace akan memunculkan Login Modal untuk meminta NIM & Password.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Session Destroy Action */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block uppercase font-semibold mb-2">
                      Kontrol Sesi Pengembang
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      Gunakan tombol di bawah untuk menghancurkan sesi pengurus aktif secara seketika dan mereset status aplikasi kembali ke Guest di beranda utama.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onForceDestroySession();
                      addLog('Sesi aktif dihancurkan secara manual oleh developer', 'warning');
                    }}
                    className="w-full bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
                  >
                    <LogOut size={16} />
                    <span>Paksa Destroy Sesi Saat Ini</span>
                  </button>
                </div>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-gray-300">
                <p>
                  <strong className="text-amber-300">Aturan Session Destroy on Refresh:</strong> Aplikasi telah diprogram dengan in-memory state guard. Ketika halaman direfresh (F5 atau reload browser), token sesi otomatis dibersihkan dan pengguna kembali ke halaman beranda sebagai Guest.
                </p>
              </div>
            </div>

            {/* Simulator Navigasi Cepat (Direct Bypass) */}
            <div className="bg-[#0b1433] border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5 mb-2">
                <Layers size={22} className="text-amber-400" />
                <span>Simulator Navigasi Modul (Direct Access)</span>
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Lompat langsung ke halaman modul internal manapun untuk memeriksa tampilan atau fungsionalitas UI secara langsung.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Beranda */}
                <button
                  onClick={onBackToLanding}
                  className="p-4 bg-slate-900 hover:bg-white/10 border border-white/10 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer min-h-[44px]"
                >
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Halaman Depan</span>
                  <strong className="text-sm text-white block">Beranda Landing Page</strong>
                  <p className="text-xs text-gray-400 mt-1">Hero, Fitur, Tentang Kami, Footer</p>
                </button>

                {/* Workspace Hub */}
                <button
                  onClick={onNavigateToPortal}
                  className="p-4 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer min-h-[44px]"
                >
                  <span className="text-[10px] text-blue-300 uppercase font-bold block mb-1">Workspace Portal</span>
                  <strong className="text-sm text-white block">Workspace Hub Organisasi</strong>
                  <p className="text-xs text-gray-400 mt-1">Katalog 8 layanan & modul internal</p>
                </button>

                {/* 8 Internal Service Modules */}
                {workspaceModules.map((m) => {
                  const SvcIcon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onNavigateToService(m.id)}
                      className="p-4 bg-slate-900 hover:bg-white/10 border border-white/10 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer min-h-[44px] group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-amber-400 uppercase font-bold">{m.category}</span>
                        <SvcIcon size={16} className="text-gray-400 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <strong className="text-xs sm:text-sm text-white block truncate">{m.title}</strong>
                      <p className="text-[11px] text-gray-400 mt-0.5">Buka halaman modul langsung</p>
                    </button>
                  );
                })}

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Ekspor & Impor Data JSON */}
        {activeTab === 'backup' && (
          <div className="space-y-8">
            
            {/* Export JSON Card */}
            <div className="bg-[#0b1433] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Download size={20} className="text-amber-400" />
                    <span>Ekspor Database Kredensial Mahasiswa (JSON)</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Cadangkan atau migrasikan seluruh kredensial mahasiswa terdaftar ke format file JSON.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCopyJson}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                  >
                    {copiedJson ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                    <span>{copiedJson ? 'Tersalin ke Clipboard!' : 'Salin JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Download size={15} />
                    <span>Unduh File .json</span>
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 border border-white/10 rounded-2xl p-5 text-xs font-mono text-amber-300/90 overflow-x-auto max-h-72">
                {JSON.stringify(accounts, null, 2)}
              </pre>
            </div>

            {/* Import JSON Card */}
            <div className="bg-[#0b1433] border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5 mb-2">
                <Upload size={20} className="text-blue-400" />
                <span>Impor Akun Mahasiswa Baru dari Format JSON</span>
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Tempelkan array objek akun mahasiswa untuk mendaftarkan banyak akun sekaligus secara otomatis.
              </p>

              {importStatus && (
                <div
                  className={`mb-4 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 ${
                    importStatus.success
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {importStatus.success ? <Check size={18} /> : <AlertCircle size={18} />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <textarea
                rows={6}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder={`[\n  {\n    "nim": "2209010112",\n    "name": "Salsa Putri",\n    "division": "Medinfo",\n    "role": "Staff Publikasi",\n    "password": "password123"\n  }\n]`}
                className="w-full p-4 bg-slate-950 border border-white/15 rounded-2xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleImportJson}
                  disabled={!importJsonText.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  <Upload size={16} />
                  <span>Jalankan Impor Akun Mahasiswa</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Log Aktivitas Sistem */}
        {activeTab === 'logs' && (
          <div className="bg-[#0b1433] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <History size={20} className="text-amber-400" />
                  <span>Log Riwayat Aktivitas & Event Internal</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Mencatat aksi penambahan mahasiswa, perubahan sandi, pemutusan sesi, dan aktivitas konsol pengembang.
                </p>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                Bersihkan Log
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Belum ada log aktivitas yang tercatat.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-950/70 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        log.type === 'success' ? 'bg-emerald-400' :
                        log.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                      }`}></span>
                      <span className="text-gray-200">{log.event}</span>
                    </div>
                    <span className="text-gray-500 text-[11px] shrink-0 ml-4">{log.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

export default AdminDashboardPage;

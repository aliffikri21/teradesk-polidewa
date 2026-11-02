import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  LogIn,
  RefreshCw,
  Sparkles,
  ExternalLink,
  KeyRound,
  FileCheck2,
  FolderArchive,
  Boxes,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Headphones,
  CheckSquare,
  Square,
  AlertCircle
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
  // Navigation View: 'dashboard' | 'students' | 'session' | 'modules' | 'backup' | 'logs'
  const [currentNav, setCurrentNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua Divisi');
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

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

  // Activity Logs
  const [logs, setLogs] = useState([
    { id: 1, time: '14:50:12', event: 'Sistem inisialisasi database kredensial', type: 'info' },
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
      setFormError(`NIM ${cleanNim} sudah terdaftar.`);
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
    addLog(`Akun mahasiswa baru terdaftar: ${cleanName} (${cleanNim})`, 'success');
    setFormSuccess(`Mahasiswa ${cleanName} (${cleanNim}) berhasil didaftarkan!`);
    setFormNim('');
    setFormName('');
    setFormRole('Anggota Aktif');
    setFormPassword('password123');

    setTimeout(() => setFormSuccess(''), 4000);
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
        setImportStatus({ success: false, message: 'Format JSON harus berupa Array objek akun.' });
        return;
      }
      const valid = parsed.every((item) => item.nim && item.password);
      if (!valid) {
        setImportStatus({ success: false, message: 'Setiap akun harus memiliki field "nim" dan "password".' });
        return;
      }
      parsed.forEach((item) => onAddAccount(item));
      addLog(`Berhasil mengimpor ${parsed.length} akun mahasiswa`, 'success');
      setImportStatus({ success: true, message: `Berhasil mengimpor ${parsed.length} akun mahasiswa.` });
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } catch {
      setImportStatus({ success: false, message: 'Sintaks format JSON tidak valid.' });
    }
  };

  const toggleSelectRow = (nim) => {
    setSelectedRows((prev) =>
      prev.includes(nim) ? prev.filter((id) => id !== nim) : [...prev, nim]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAccounts.map((a) => a.nim));
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
    <div className="w-full min-h-screen bg-[#F8F9FC] text-slate-800 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* 1. LEFT SIDEBAR (Matching Reference Nexus Navigation) */}
      <aside className="w-64 bg-white border-r border-[#EBF0F5] shrink-0 hidden lg:flex flex-col justify-between p-5 min-h-screen sticky top-0 h-screen">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#6366F1] to-[#4F46E5] text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-200">
                <span className="text-sm font-mono">TD</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                  TeraDesk
                </span>
                <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider uppercase">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={onBackToLanding}
              className="text-gray-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Kembali ke Beranda"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-6">
            {/* SECTION: GENERAL */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                GENERAL
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentNav('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'dashboard'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={16} className={currentNav === 'dashboard' ? 'text-indigo-400' : 'text-gray-400'} />
                    <span>Dashboard</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentNav('students')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'students'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={16} className={currentNav === 'students' ? 'text-indigo-400' : 'text-gray-400'} />
                    <span>Mahasiswa</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-slate-600 font-bold">
                    {accounts.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav('session')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'session'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className={currentNav === 'session' ? 'text-indigo-400' : 'text-gray-400'} />
                    <span>Sesi & Keamanan</span>
                  </div>
                  {authUser && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentNav('logs')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'logs'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity size={16} className={currentNav === 'logs' ? 'text-indigo-400' : 'text-gray-400'} />
                    <span>Log Aktivitas</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-slate-600 font-bold">
                    {logs.length}
                  </span>
                </button>
              </div>
            </div>

            {/* SECTION: TOOLS */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                TOOLS
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentNav('modules')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'modules'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={16} className={currentNav === 'modules' ? 'text-indigo-400' : 'text-gray-400'} />
                    <span>Modul Layanan</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    8 MODUL
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav('backup')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'backup'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database size={16} className={currentNav === 'backup' ? 'text-indigo-400' : 'text-gray-400'} />
                    <span>Backup & JSON</span>
                  </div>
                </button>
              </div>
            </div>

            {/* SECTION: SUPPORT */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                SUPPORT
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    if (window.confirm('Reset seluruh daftar akun ke 5 akun demo bawaan sistem?')) {
                      onResetAccounts();
                      addLog('Database akun direset ke akun bawaan', 'warning');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <RefreshCw size={16} className="text-gray-400" />
                  <span>Reset Akun Default</span>
                </button>

                <button
                  onClick={onBackToLanding}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ExternalLink size={16} className="text-gray-400" />
                  <span>Lihat Landing Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Capsule (Matching Reference Team Capsule & Upgrade button) */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="bg-[#F8F9FC] border border-gray-200/80 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-cyan-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                TM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">TERAMEDIA</p>
                <p className="text-[10px] text-gray-500 truncate">Dewantara Palopo</p>
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400 shrink-0" />
          </div>

          <button
            onClick={onNavigateToPortal}
            className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl text-xs font-bold text-slate-800 shadow-xs transition-colors cursor-pointer text-center block"
          >
            Buka Workspace Hub
          </button>

          <p className="text-[10px] text-gray-400 text-center font-mono">
            © 2026 TeraDesk Internal
          </p>
        </div>
      </aside>

      {/* 2. MAIN VIEW AREA (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar (Matching Reference Safari/Nexus Header) */}
        <header className="h-18 px-6 lg:px-8 bg-white border-b border-[#EBF0F5] flex items-center justify-between gap-4 sticky top-0 z-30">
          
          {/* Left: Global Search Input */}
          <div className="relative w-72 sm:w-84">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search NIM, Nama, atau Modul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-14 py-2 bg-[#F8F9FC] border border-gray-200/80 rounded-xl text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
              ⌘ + F
            </span>
          </div>

          {/* Right: Quick Triggers & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Add Button */}
            <button
              onClick={() => {
                setIsAddFormOpen(!isAddFormOpen);
                setCurrentNav('dashboard');
              }}
              className="w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Tambah Akun Mahasiswa Baru"
            >
              <Plus size={16} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Notifikasi Sistem"
              >
                <Bell size={16} />
              </button>
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1 right-1 ring-2 ring-white"></span>
            </div>

            {/* User Profile Capsule (Matching Young Alaska / Bussiness) */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-gray-100">
                {authUser?.name ? authUser.name.charAt(0) : 'SA'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {authUser ? authUser.name : 'System Admin'}
                </p>
                <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                  {authUser ? `${authUser.role} (${authUser.nim})` : 'Superuser • Dev'}
                </p>
              </div>
            </div>

            {/* Back to Web Button */}
            <button
              onClick={onBackToLanding}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-slate-700 transition-colors cursor-pointer hidden md:flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Kembali</span>
            </button>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="p-6 lg:p-8 space-y-6">
          
          {/* Dashboard Header Row (Title + Date + Controls) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentNav === 'dashboard' ? 'Dashboard' :
                 currentNav === 'students' ? 'Manajemen Mahasiswa' :
                 currentNav === 'session' ? 'Kontrol Sesi & Keamanan' :
                 currentNav === 'modules' ? 'Katalog 8 Modul' :
                 currentNav === 'backup' ? 'Cadangan Data JSON' : 'Log Aktivitas'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pusat kendali akun mahasiswa, audit keamanan sesi, dan telemetry sistem TeraDesk.
              </p>
            </div>

            {/* Controls (Date, Period, Filter, Export, Add) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date Pill */}
              <div className="bg-white border border-gray-200/80 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-2 shadow-2xs">
                <Calendar size={13} className="text-gray-400" />
                <span>02 Nov - 08 Nov</span>
              </div>

              {/* Monthly Dropdown */}
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white border border-gray-200/80 pl-3 pr-7 py-1.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="Weekly">Weekly ▾</option>
                  <option value="Monthly">Monthly ▾</option>
                  <option value="Semester">Semester ▾</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => {
                  setSelectedDivision(selectedDivision === 'Semua Divisi' ? 'Medinfo' : 'Semua Divisi');
                }}
                className="bg-white border border-gray-200/80 hover:bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Filter size={13} className="text-gray-400" />
                <span>Filter</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleDownloadJson}
                className="bg-white border border-gray-200/80 hover:bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-gray-400" />
                <span>Export</span>
              </button>

              {/* Primary Action Button */}
              <button
                onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                className="bg-[#5046E5] hover:bg-[#4338CA] text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Plus size={14} />
                <span>+ Mahasiswa</span>
              </button>
            </div>
          </div>

          {/* Form Tambah Mahasiswa (Collapsible or Triggered) */}
          {isAddFormOpen && (
            <div className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-sm animate-in fade-in zoom-in-98 duration-150 relative">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <KeyRound size={17} className="text-indigo-600" />
                    <span>Daftarkan Mahasiswa Baru (NIM & Kata Sandi)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kredensial yang didaftarkan langsung aktif dan dapat digunakan untuk login ke Workspace.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateRandomPass}
                    className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Generate Sandi Acak</span>
                  </button>
                  <button
                    onClick={() => setIsAddFormOpen(false)}
                    className="text-gray-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {formError && (
                <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700 flex items-center gap-2">
                  <Check size={15} className="shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NIM Mahasiswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2209010088"
                    value={formNim}
                    onChange={(e) => setFormNim(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fadhil Ardiansyah"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Divisi Organisasi
                  </label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    {divisionsList.filter(d => d !== 'Semua Divisi').map((div) => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jabatan / Role
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Staff Publikasi"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Min. 4 char"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="bg-[#5046E5] hover:bg-[#4338CA] text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 transition-colors cursor-pointer shadow-xs"
                    >
                      Daftarkan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ROW 1: 3 METRIC CARDS (Exact Match to Reference: Page Views, Revenue, Bounce Rate) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric Card 1: Page Views -> Total Mahasiswa */}
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center text-slate-600">
                    <Users size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Total Mahasiswa Terdaftar</span>
                </div>
                <span className="text-gray-300 hover:text-gray-500 cursor-pointer text-xs" title="Total mahasiswa yang telah terdaftar di database">ⓘ</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {accounts.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold flex items-center gap-0.5">
                  <span>15.8%</span>
                  <span className="text-xs">↗</span>
                </span>
              </div>
            </div>

            {/* Metric Card 2: Revenue -> Sesi Kerja Aktif */}
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center text-slate-600">
                    <ShieldCheck size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Sesi Kerja Aktif Saat Ini</span>
                </div>
                <span className="text-gray-300 hover:text-gray-500 cursor-pointer text-xs" title="Informasi status login pengurus aktif">ⓘ</span>
              </div>
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                  {authUser ? authUser.name : 'Guest Mode'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                  authUser ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {authUser ? 'Aktif ↗' : 'Terkunci 🔒'}
                </span>
              </div>
            </div>

            {/* Metric Card 3: Bounce Rate -> Protokol Keamanan F5 */}
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center text-slate-600">
                    <RefreshCw size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Protokol Keamanan Sesi</span>
                </div>
                <span className="text-gray-300 hover:text-gray-500 cursor-pointer text-xs" title="Sesi otomatis dihancurkan saat refresh">ⓘ</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Auto-Destroy F5
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold flex items-center gap-0.5">
                  <span>100% Aman</span>
                  <span className="text-xs">↗</span>
                </span>
              </div>
            </div>

          </div>

          {/* ROW 2: VISUAL OVERVIEW (Matching Sales Overview Chart & Total Subscriber Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Chart Card: Sales Overview style (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-7 shadow-xs flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                    <Activity size={14} className="text-indigo-600" />
                    <span>Statistik Penyerapan & Beban Kerja Divisi</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      {accounts.length * 14} Sesi Kerja
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +15.8% ↗ +{accounts.length * 3} aktif bulan ini
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
                    <Filter size={12} />
                    <span>Filter</span>
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
                    <span>⇅ Sort</span>
                  </button>
                  <button className="px-2.5 py-1 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-gray-50 cursor-pointer">
                    •••
                  </button>
                </div>
              </div>

              {/* Graphic Visualization matching exact stacked columns & connection ribbons in reference */}
              <div className="relative py-4">
                
                {/* Value labels on top of columns */}
                <div className="grid grid-cols-3 text-center text-xs font-bold text-slate-800 font-mono mb-2">
                  <div>2,988 Sesi</div>
                  <div>1,765 Sesi</div>
                  <div>4,005 Sesi</div>
                </div>

                {/* SVG Connecting Ribbons */}
                <div className="relative h-44 flex items-end justify-between px-8 sm:px-16">
                  
                  {/* Background SVG wave bands connecting the stacks */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="bandGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.25" />
                      </linearGradient>
                      <linearGradient id="bandGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>
                    <path d="M 60 120 C 130 135, 170 135, 200 135 C 230 135, 270 120, 340 120 L 340 150 C 270 150, 230 155, 200 155 C 170 155, 130 150, 60 150 Z" fill="url(#bandGrad1)" />
                    <path d="M 60 70 C 130 90, 170 90, 200 90 C 230 90, 270 60, 340 60 L 340 90 C 270 90, 230 110, 200 110 C 170 110, 130 90, 60 90 Z" fill="url(#bandGrad2)" />
                  </svg>

                  {/* Column 1 (Oct) */}
                  <div className="w-14 sm:w-16 space-y-1.5 z-10">
                    <div className="h-3.5 rounded-md bg-[#06B6D4]"></div>
                    <div className="h-3.5 rounded-md bg-[#38BDF8]"></div>
                    <div className="h-5 rounded-md bg-[#818CF8]"></div>
                    <div className="h-6 rounded-md bg-[#6366F1]"></div>
                    <div className="h-8 rounded-md bg-[#4338CA]"></div>
                  </div>

                  {/* Column 2 (Nov) */}
                  <div className="w-14 sm:w-16 space-y-1.5 z-10">
                    <div className="h-3 rounded-md bg-[#06B6D4]"></div>
                    <div className="h-3.5 rounded-md bg-[#38BDF8]"></div>
                    <div className="h-4 rounded-md bg-[#818CF8]"></div>
                    <div className="h-4.5 rounded-md bg-[#6366F1]"></div>
                    <div className="h-6 rounded-md bg-[#4338CA]"></div>
                  </div>

                  {/* Column 3 (Dec) */}
                  <div className="w-14 sm:w-16 space-y-1.5 z-10">
                    <div className="h-4 rounded-md bg-[#06B6D4]"></div>
                    <div className="h-4 rounded-md bg-[#38BDF8]"></div>
                    <div className="h-6 rounded-md bg-[#818CF8]"></div>
                    <div className="h-7 rounded-md bg-[#6366F1]"></div>
                    <div className="h-10 rounded-md bg-[#4338CA]"></div>
                  </div>

                </div>

                {/* X Axis Months */}
                <div className="grid grid-cols-3 text-center text-xs font-semibold text-slate-400 mt-3">
                  <div>Bulan 1 (Okt)</div>
                  <div>Bulan 2 (Nov)</div>
                  <div>Bulan 3 (Des)</div>
                </div>

                {/* Legend at Bottom */}
                <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-500 mt-5 flex-wrap">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4338CA]"></span> BPH / Inti</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span> Medinfo</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]"></span> Kaderisasi</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span> Minat Bakat</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span> Danus</span>
                </div>
              </div>
            </div>

            {/* Right Chart Card: Total Subscriber style (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-7 shadow-xs flex flex-col justify-between">
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Users size={14} className="text-indigo-600" />
                    <span>Aktivitas Pengurus</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-lg">
                    Weekly ▾
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    24,473
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  8.3% ↗ + 749 sesi kerja
                </span>
              </div>

              {/* Bar Chart with Highlighted Tuesday */}
              <div className="pt-6">
                <div className="h-44 flex items-end justify-between gap-2 px-2">
                  
                  {/* Sun */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-12"></div>
                    <span className="text-[10px] font-semibold text-gray-400">Sun</span>
                  </div>

                  {/* Mon */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-20"></div>
                    <span className="text-[10px] font-semibold text-gray-400">Mon</span>
                  </div>

                  {/* Tue (Highlighted with gradient & badge) */}
                  <div className="flex-1 flex flex-col items-center gap-2 relative">
                    <span className="absolute -top-7 text-[10px] font-bold font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded shadow-2xs">
                      3,874
                    </span>
                    <div className="w-full bg-linear-to-b from-[#6366F1] to-[#4338CA] rounded-xl h-36 shadow-sm shadow-indigo-200"></div>
                    <span className="text-[10px] font-bold text-slate-900">Tue</span>
                  </div>

                  {/* Wed */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-28"></div>
                    <span className="text-[10px] font-semibold text-gray-400">Wed</span>
                  </div>

                  {/* Thu */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-22"></div>
                    <span className="text-[10px] font-semibold text-gray-400">Thu</span>
                  </div>

                  {/* Fri */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-16"></div>
                    <span className="text-[10px] font-semibold text-gray-400">Fri</span>
                  </div>

                  {/* Sat */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-10"></div>
                    <span className="text-[10px] font-semibold text-gray-400">Sat</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* ROW 3: BOTTOM SPLIT (Matching Sales Distribution & List of Integration Table) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Card: Sales Distribution style (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-7 shadow-xs flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Boxes size={14} className="text-indigo-600" />
                    <span>Sebaran Divisi Organisasi</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-lg">
                    Monthly ▾
                  </span>
                </div>

                {/* 3 Categories metrics */}
                <div className="grid grid-cols-3 gap-2 text-left mb-6">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 block mb-0.5">BPH / Inti</span>
                    <strong className="text-sm font-bold text-slate-900 font-mono">
                      {accounts.filter(a => a.division === 'BPH').length} Akun
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 block mb-0.5">Medinfo</span>
                    <strong className="text-sm font-bold text-slate-900 font-mono">
                      {accounts.filter(a => a.division === 'Medinfo').length} Akun
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 block mb-0.5">Lainnya</span>
                    <strong className="text-sm font-bold text-slate-900 font-mono">
                      {accounts.filter(a => a.division !== 'BPH' && a.division !== 'Medinfo').length} Akun
                    </strong>
                  </div>
                </div>
              </div>

              {/* Exact Semi-Donut Gauge Graphic matching Reference */}
              <div className="flex flex-col items-center justify-center pt-2 pb-2">
                <div className="w-56 h-28 flex items-end justify-center">
                  <svg className="w-52 h-28" viewBox="0 0 120 70">
                    {/* Background track */}
                    <circle
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke="#F1F5F9"
                      strokeWidth="12"
                      strokeDasharray="132 264"
                      transform="rotate(-180 60 60)"
                    />
                    {/* Purple Segment (BPH & Sekre) */}
                    <circle
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="12"
                      strokeDasharray="75 264"
                      transform="rotate(-180 60 60)"
                    />
                    {/* Cyan Segment (Medinfo & Kaderisasi) */}
                    <circle
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="12"
                      strokeDasharray="45 264"
                      strokeDashoffset="-80"
                      transform="rotate(-180 60 60)"
                    />
                    {/* Radial tick marks on right */}
                    <circle
                      cx="60"
                      cy="60"
                      r="49"
                      fill="none"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeDasharray="2 3"
                      strokeDashoffset="-95"
                      transform="rotate(-180 60 60)"
                    />
                  </svg>
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs font-bold text-slate-900 font-mono">86.4% Terdistribusi</p>
                  <p className="text-[10px] text-gray-400">Rasio alokasi akun aktif pengurus per divisi</p>
                </div>
              </div>

            </div>

            {/* Right Card: List of Integration style (8 cols) -> Registered Student Accounts Table */}
            <div className="lg:col-span-8 bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-7 shadow-xs space-y-4">
              
              {/* Table Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <KeyRound size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Daftar Akun Mahasiswa Terdaftar ({filteredAccounts.length})
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Kelola NIM, kata sandi, atau gunakan tombol Masuk untuk impersonate.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    {divisionsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsAddFormOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    + Tambah Akun
                  </button>
                </div>
              </div>

              {/* Table Wrapper (Matching Reference List of Integration: Checkbox, App, Type, Rate, Profit) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-2 w-8">
                        <button
                          onClick={toggleSelectAll}
                          className="text-gray-400 hover:text-slate-800 cursor-pointer"
                        >
                          {selectedRows.length === filteredAccounts.length && filteredAccounts.length > 0 ? (
                            <CheckSquare size={14} className="text-indigo-600" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-3">MAHASISWA</th>
                      <th className="py-3 px-3">NIM</th>
                      <th className="py-3 px-3">DIVISI / JABATAN</th>
                      <th className="py-3 px-3">KATA SANDI</th>
                      <th className="py-3 px-3 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          Tidak ada mahasiswa yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((acc) => {
                        const isSelected = selectedRows.includes(acc.nim);
                        const isShowingPass = visiblePasswords[acc.nim];
                        const isEditing = editingNim === acc.nim;
                        const isCopied = copiedNim === acc.nim;

                        return (
                          <tr key={acc.nim} className="hover:bg-gray-50/70 transition-colors">
                            {/* Checkbox */}
                            <td className="py-3.5 px-2">
                              <button
                                onClick={() => toggleSelectRow(acc.nim)}
                                className="text-gray-400 hover:text-slate-800 cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare size={14} className="text-indigo-600" />
                                ) : (
                                  <Square size={14} />
                                )}
                              </button>
                            </td>

                            {/* Mahasiswa (Icon + Name) */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                  {acc.name ? acc.name.charAt(0) : 'M'}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 truncate max-w-[130px]">{acc.name}</p>
                                  {acc.isDefault && (
                                    <span className="text-[9px] text-gray-400 font-mono">Demo Akun</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* NIM with Copy Button */}
                            <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                              <button
                                onClick={() => handleCopyNim(acc.nim)}
                                className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer group"
                                title="Klik untuk salin NIM"
                              >
                                <span>{acc.nim}</span>
                                {isCopied ? (
                                  <Check size={11} className="text-emerald-600" />
                                ) : (
                                  <Copy size={11} className="text-gray-300 group-hover:text-indigo-500" />
                                )}
                              </button>
                            </td>

                            {/* Divisi & Role */}
                            <td className="py-3.5 px-3">
                              <span className="font-semibold text-slate-800 block">{acc.division}</span>
                              <span className="text-[10px] text-gray-400 block">{acc.role}</span>
                            </td>

                            {/* Password Column with show/hide toggle & inline edit */}
                            <td className="py-3.5 px-3 font-mono">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={newPasswordVal}
                                    onChange={(e) => setNewPasswordVal(e.target.value)}
                                    placeholder="Sandi baru"
                                    className="px-2 py-1 bg-white border border-indigo-400 rounded text-xs text-slate-800 font-mono w-24 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveNewPassword(acc.nim)}
                                    className="px-1.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                                    title="Simpan"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setEditingNim(null)}
                                    className="px-1.5 py-1 bg-gray-200 text-gray-700 rounded text-[10px] cursor-pointer"
                                    title="Batal"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-600 text-xs">
                                    {isShowingPass ? acc.password : '••••••••'}
                                  </span>
                                  <button
                                    onClick={() => togglePasswordVisibility(acc.nim)}
                                    className="text-gray-400 hover:text-slate-800 transition-colors cursor-pointer p-0.5"
                                    title={isShowingPass ? 'Sembunyikan sandi' : 'Lihat sandi'}
                                  >
                                    {isShowingPass ? <EyeOff size={13} /> : <Eye size={13} />}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingNim(acc.nim);
                                      setNewPasswordVal(acc.password);
                                    }}
                                    className="text-[10px] text-indigo-600 hover:underline cursor-pointer ml-1"
                                    title="Ubah kata sandi"
                                  >
                                    Ubah
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onImpersonate(acc)}
                                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                  title={`Masuk sebagai ${acc.name} tanpa ketik kata sandi`}
                                >
                                  <LogIn size={11} />
                                  <span>Masuk</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus akun mahasiswa ${acc.name} (${acc.nim})?`)) {
                                      onDeleteAccount(acc.nim);
                                      addLog(`Akun dihapus: ${acc.name} (${acc.nim})`, 'warning');
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                  title="Hapus akun"
                                >
                                  <Trash2 size={13} />
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

              {/* Table Footer */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                <span>{selectedRows.length} dari {filteredAccounts.length} mahasiswa dipilih</span>
                <button
                  onClick={() => setCurrentNav('students')}
                  className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Kelola Detail Akun →
                </button>
              </div>

            </div>

          </div>

          {/* VIEW: Sesi & Keamanan (Active when tab is 'session') */}
          {currentNav === 'session' && (
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-600" />
                <span>Audit Status Sesi Kerja Workspace</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5">
                  <span className="text-[11px] font-bold uppercase text-gray-400 block mb-2">
                    State Pengguna Aktif
                  </span>
                  {authUser ? (
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">{authUser.name}</p>
                      <p className="text-xs font-mono text-indigo-600 font-bold">NIM: {authUser.nim}</p>
                      <p className="text-xs text-gray-600">Divisi: {authUser.division} • {authUser.role}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 font-semibold py-2">
                      Status: Guest Mode (Akses Workspace terkunci sebelum login)
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-gray-400 block mb-1">
                      Kontrol Sesi Pengembang
                    </span>
                    <p className="text-xs text-slate-600 mb-4">
                      Hancurkan sesi pengurus aktif seketika untuk mereset status aplikasi kembali ke Guest.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onForceDestroySession();
                      addLog('Sesi aktif dihancurkan secara manual oleh admin', 'warning');
                    }}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Paksa Destroy Sesi Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 8 Modul Layanan (Active when tab is 'modules') */}
          {currentNav === 'modules' && (
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers size={18} className="text-indigo-600" />
                <span>Katalog 8 Modul Layanan Organisasi (Bypass Cepat)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {workspaceModules.map((m) => {
                  const SvcIcon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onNavigateToService(m.id)}
                      className="p-4 bg-gray-50 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-200 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">{m.category}</span>
                        <SvcIcon size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{m.title}</p>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">Buka modul →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: Backup & JSON (Active when tab is 'backup') */}
          {currentNav === 'backup' && (
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Database size={18} className="text-indigo-600" />
                    <span>Cadangan & Ekspor/Impor Database Akun JSON</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Salin, unduh, atau pulihkan akun mahasiswa dalam format file JSON standar.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {copiedJson ? 'Tersalin!' : 'Salin JSON'}
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="px-3.5 py-2 bg-[#5046E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Unduh File .json
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 text-amber-300 font-mono text-xs rounded-2xl max-h-56 overflow-y-auto">
                {JSON.stringify(accounts, null, 2)}
              </pre>

              {/* Import Textarea */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 mb-2">Impor Akun Massal dari JSON:</p>
                {importStatus && (
                  <p className={`text-xs mb-2 ${importStatus.success ? 'text-emerald-600 font-bold' : 'text-rose-600'}`}>
                    {importStatus.message}
                  </p>
                )}
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "nim": "2209010115",\n    "name": "Budi Santoso",\n    "division": "Kaderisasi",\n    "role": "Staff",\n    "password": "password123"\n  }\n]`}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleImportJson}
                    disabled={!importJsonText.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Jalankan Impor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Log Aktivitas (Active when tab is 'logs') */}
          {currentNav === 'logs' && (
            <div className="bg-white border border-[#EBF0F5] rounded-3xl p-6 lg:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600" />
                  <span>Log Riwayat Aktivitas Sistem ({logs.length})</span>
                </h3>
                <button
                  onClick={() => setLogs([])}
                  className="text-xs text-gray-400 hover:text-slate-800 cursor-pointer"
                >
                  Bersihkan Log
                </button>
              </div>

              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${
                        log.type === 'success' ? 'bg-emerald-500' :
                        log.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}></span>
                      <span className="text-slate-800 font-medium">{log.event}</span>
                    </div>
                    <span className="font-mono text-gray-400 text-[11px]">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default AdminDashboardPage;

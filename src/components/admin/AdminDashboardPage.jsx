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
  Lock,
  Clock,
  Database,
  SlidersHorizontal,
  Layers,
  Globe,
  ShoppingBag,
  Award,
  TrendingUp
} from 'lucide-react';

const divisionsList = [
  'Semua Divisi',
  'BPH (Badan Pengurus Harian)',
  'Divisi Kesekretariatan',
  'Divisi Publikasi dan Dokumentasi',
  'Divisi Humas',
  'Divisi Kaderisasi',
  'Divisi KKM (Kewirausahaan)',
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
    category: 'Divisi Kesekretariatan',
    badge: 'Modul Inti',
    icon: FolderArchive,
    color: 'text-blue-600 bg-blue-50 border-blue-200/80',
    description: 'Generator nomor surat dinas otomatis anti-bentrok, repositori SK, dan checklist kelengkapan berkas LPJ.',
    pic: 'Divisi Kesekretariatan',
    activeCount: '148 Surat',
  },
  {
    id: 'helpdesk',
    title: 'Tiket Desain & Publikasi Pubdok',
    category: 'Publikasi & Dokumentasi',
    badge: 'Modul Divisi',
    icon: Headphones,
    color: 'text-rose-600 bg-rose-50 border-rose-200/80',
    description: 'Tiket request desain visual (Feed/Story/A3/Twibbon), SLA pengerjaan, dan papan kanban kerja Pubdok.',
    pic: 'Publikasi & Dokumentasi',
    activeCount: '6 Tiket Aktif',
  },
  {
    id: 'humas',
    title: 'Media Partner Gateway & Relasi',
    category: 'Hubungan Masyarakat',
    badge: 'Modul Divisi',
    icon: Globe,
    color: 'text-sky-600 bg-sky-50 border-sky-200/80',
    description: 'Tinjauan proposal media partner, koordinasi barter promosi dengan Pubdok, & direktori kontak relasi/alumni.',
    pic: 'Divisi Humas',
    activeCount: '8 Pengajuan Medpart',
  },
  {
    id: 'hr',
    title: 'Rapor Kader & Scoring Keaktifan',
    category: 'Kaderisasi & SDM',
    badge: 'Modul Divisi',
    icon: Users,
    color: 'text-violet-600 bg-violet-50 border-violet-200/80',
    description: 'Scoring keaktifan kader, tracking rekrutmen/diksar, database profil anggota, dan sertifikasi.',
    pic: 'Divisi Kaderisasi',
    activeCount: '48 Kader Aktif',
  },
  {
    id: 'kkm',
    title: 'Kreativitas & Kewirausahaan (KKM)',
    category: 'Kewirausahaan Mahasiswa',
    badge: 'Modul Divisi',
    icon: ShoppingBag,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80',
    description: 'Pre-order official merchandise (hoodie, lanyard), sewa alat multimedia/liputan, dan kas laba-rugi KKM.',
    pic: 'Divisi KKM',
    activeCount: '38 Order Pre-Order',
  },
  {
    id: 'asset',
    title: 'Digitalisasi Aset & Inventaris',
    category: 'Operasional & Aset',
    badge: 'Modul Inti',
    icon: Boxes,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    description: 'Pencatatan inventaris alat multimedia (kamera, mic, sound), booking ruang rapat, dan audit fisik.',
    pic: 'Logistik & BPH',
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
    pic: 'Kesekretariatan',
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
];

const getTimestamp = () => new Date().toLocaleTimeString('id-ID');
const getDateStamp = () => new Date().toISOString().split('T')[0];

const AdminDashboardPage = ({
  onBackToLanding,
  onNavigateToPortal,
  onNavigateToService,
  accounts,
  onAddAccount,
  onUpdateAccount,
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
  const [accessFilter, setAccessFilter] = useState('Semua Akses');
  const [dateRangeFilter, setDateRangeFilter] = useState('Semester Ganjil 2026/2027');
  const [timeframeFilter, setTimeframeFilter] = useState('Bulan Ini');

  // Form State for Adding Student
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [formNim, setFormNim] = useState('');
  const [formName, setFormName] = useState('');
  const [formDivision, setFormDivision] = useState('Divisi Kesekretariatan');
  const [formRole, setFormRole] = useState('Anggota Aktif');
  const [formPassword, setFormPassword] = useState('password123');
  const [formCanAccessAdmin, setFormCanAccessAdmin] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form State for Editing Account
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTargetNim, setEditingTargetNim] = useState('');
  const [editFormNim, setEditFormNim] = useState('');
  const [editFormName, setEditFormName] = useState('');
  const [editFormDivision, setEditFormDivision] = useState('Divisi Kesekretariatan');
  const [editFormRole, setEditFormRole] = useState('Anggota Aktif');
  const [editFormPassword, setEditFormPassword] = useState('');
  const [editFormCanAccessAdmin, setEditFormCanAccessAdmin] = useState(false);
  const [editFormShowPass, setEditFormShowPass] = useState(false);
  const [editFormError, setEditFormError] = useState('');
  const [editFormSuccess, setEditFormSuccess] = useState('');

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
    humas: true,
    kkm: true,
  });

  // Mock PAR Submissions
  const [parSubmissions, setParSubmissions] = useState([
    {
      id: 'PAR-2026-001',
      title: 'Latihan Dasar Kepemimpinan (LDK) 2026',
      division: 'Divisi Kaderisasi',
      budget: 'Rp 8.500.000',
      date: '15 - 17 Nov 2026',
      status: 'Review BPH',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      pic: 'Fajar Nugraha',
    },
    {
      id: 'PAR-2026-002',
      title: 'Workshop Desain Grafis & UI/UX Multimedia',
      division: 'Divisi Publikasi dan Dokumentasi',
      budget: 'Rp 3.200.000',
      date: '28 Nov 2026',
      status: 'Disetujui',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pic: 'Nadia Safitri',
    },
    {
      id: 'PAR-2026-003',
      title: 'Media Visit & Studi Banding Lembaga Pers Mahasiswa',
      division: 'Divisi Humas',
      budget: 'Rp 4.200.000',
      date: '05 Des 2026',
      status: 'Review Kadiv',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      pic: 'Rian Pratama',
    },
    {
      id: 'PAR-2026-004',
      title: 'Produksi Merchandise Resmi & Ekspo Kewirausahaan',
      division: 'Divisi KKM (Kewirausahaan)',
      budget: 'Rp 5.750.000',
      date: '12 Des 2026',
      status: 'Disetujui',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pic: 'Ilham Ramadhan',
    },
  ]);

  // 1. DIVISI KESEKRETARIATAN: State & Logic
  const [suratGenType, setSuratGenType] = useState('UND');
  const [suratGenDiv, setSuratGenDiv] = useState('KESEKRETARIATAN');
  const [suratGenPerihal, setSuratGenPerihal] = useState('Undangan Rapat Pleno Koordinasi');
  const [generatedSurat, setGeneratedSurat] = useState('024/TERA-UKM/UND/SEKRE/XI/2026');
  const [copiedSuratNum, setCopiedSuratNum] = useState(false);
  const [suratLog, setSuratLog] = useState([
    {
      id: 1,
      no: '023/TERA-UKM/UND/BPH/XI/2026',
      perihal: 'Undangan Rapat Kerja Paruh Periode',
      div: 'BPH',
      date: '02 Nov 2026',
      status: 'Terdaftar Resmi',
    },
    {
      id: 2,
      no: '022/TERA-UKM/ST/PUBDOK/X/2026',
      perihal: 'Surat Tugas Dokumentasi Dies Natalis',
      div: 'Pubdok',
      date: '28 Okt 2026',
      status: 'Terdaftar Resmi',
    },
    {
      id: 3,
      no: '021/TERA-UKM/SP/KADER/X/2026',
      perihal: 'Surat Permohonan Peminjaman Aula Kampus',
      div: 'Kaderisasi',
      date: '22 Okt 2026',
      status: 'Terdaftar Resmi',
    },
  ]);

  // 2. DIVISI PUBLIKASI & DOKUMENTASI (PUBDOK): State & Logic
  const [pubdokTickets, setPubdokTickets] = useState([
    {
      id: 'PUB-001',
      title: 'Feed & Reels Open Recruitment Kader Muda 2026',
      division: 'Divisi Kaderisasi',
      canvas: 'Feed 1:1 + Reels 9:16',
      deadline: '08 Nov 2026',
      status: 'Dikerjakan',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      designer: 'Bagas Aditya (Pubdok)',
    },
    {
      id: 'PUB-002',
      title: 'Backdrop Spanduk Panggung & Sertifikat Seminar',
      division: 'BPH',
      canvas: 'Spanduk 3x1m & A4 Cetak',
      deadline: '14 Nov 2026',
      status: 'Antrean',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      designer: 'Menunggu Penugasan',
    },
    {
      id: 'PUB-003',
      title: 'Twibbon Mahasiswa Baru Dies Natalis Ke-12',
      division: 'Divisi Kesekretariatan',
      canvas: 'Twibbon PNG Transparan',
      deadline: '20 Nov 2026',
      status: 'Selesai',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      designer: 'Nadia Safitri (Pubdok)',
    },
  ]);
  const [pubdokFilter, setPubdokFilter] = useState('Semua');
  const [formPubTitle, setFormPubTitle] = useState('');
  const [formPubDiv, setFormPubDiv] = useState('Divisi Kaderisasi');
  const [formPubCanvas, setFormPubCanvas] = useState('Feed Instagram (1:1)');
  const [formPubDeadline, setFormPubDeadline] = useState('');

  // 3. DIVISI HUMAS: State & Logic
  const [humasMedparts, setHumasMedparts] = useState([
    {
      id: 'MP-01',
      event: 'Seminar Nasional AI & Web3 Ecosystem',
      organizer: 'BEM Fasilkom',
      package: 'Paket Gold (Feed + Reels + Story)',
      date: '18 Nov 2026',
      pic: 'Dimas Setiawan (0812-9876-5432)',
      status: 'Menunggu Review',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'MP-02',
      event: 'Turnamen Futsal Se-Kampus TeraCup',
      organizer: 'UKM Olahraga',
      package: 'Paket Silver (Story + Logo Backdrop)',
      date: '25 Nov 2026',
      pic: 'Rian Fahrezi (0857-1122-3344)',
      status: 'Disetujui - Forward Pubdok',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'MP-03',
      event: 'Lomba Fotografi & Videografi Kreatif',
      organizer: 'HIMAFOTO',
      package: 'Paket Barter Media',
      date: '01 Des 2026',
      pic: 'Maya Safira (0813-5566-7788)',
      status: 'Tayang di Medsos',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ]);

  // 4. DIVISI KADERISASI: State & Logic
  const [kaderRaporList] = useState([
    {
      nim: '24401012',
      name: 'Rizky Ramadhan',
      division: 'Divisi Publikasi dan Dokumentasi',
      diksar: 'Lulus Diksar I & II',
      score: 94,
      attendance: '96%',
      grade: 'A (Sangat Aktif)',
      gradeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      certStatus: 'Siap Terbit',
    },
    {
      nim: '24402034',
      name: 'Dewi Lestari',
      division: 'Divisi Humas',
      diksar: 'Lulus Diksar I & II',
      score: 88,
      attendance: '92%',
      grade: 'A (Sangat Aktif)',
      gradeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      certStatus: 'Siap Terbit',
    },
    {
      nim: '25403055',
      name: 'Fikri Haikal',
      division: 'Divisi KKM',
      diksar: 'Lulus Diksar I',
      score: 76,
      attendance: '80%',
      grade: 'B (Aktif)',
      gradeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      certStatus: 'Proses Magang',
    },
    {
      nim: '25404099',
      name: 'Nabila Putri',
      division: 'Divisi Kesekretariatan',
      diksar: 'Lulus Diksar I',
      score: 68,
      attendance: '72%',
      grade: 'C (Cukup)',
      gradeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      certStatus: 'Remedial Presensi',
    },
  ]);

  // 5. DIVISI KKM: State & Logic
  const [kkmOrders, setKkmOrders] = useState([
    {
      id: 'PO-01',
      name: 'Alif Fikri (23404053)',
      item: 'Official Hoodie TERAMEDIA 2026',
      size: 'XL',
      total: 'Rp 165.000',
      status: 'Lunas',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'PO-02',
      name: 'Bagas Aditya (23403112)',
      item: 'Lanyard + ID Card Holder Satin Doff',
      size: 'All Size',
      total: 'Rp 25.000',
      status: 'Lunas',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'PO-03',
      name: 'Fani Rahmawati (25402011)',
      item: 'Sticker Pack Hologram Vinyl (6 Pcs)',
      size: 'Bundle',
      total: 'Rp 15.000',
      status: 'DP 50%',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
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

  // Divisi Kesekretariatan handlers
  const handleGenerateSurat = (e) => {
    e.preventDefault();
    const nextSeq = String(suratLog.length + 24).padStart(3, '0');
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentRoman = romanMonths[new Date().getMonth()];
    const newNum = `${nextSeq}/TERA-UKM/${suratGenType}/${suratGenDiv}/${currentRoman}/2026`;
    setGeneratedSurat(newNum);

    const newEntry = {
      id: Date.now(),
      no: newNum,
      perihal: suratGenPerihal || 'Surat Dinas Organisasi',
      div: suratGenDiv,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Terdaftar Resmi',
    };
    setSuratLog([newEntry, ...suratLog]);
    addLog(`Penerbitan nomor surat resmi baru: ${newNum}`, 'success');
  };

  const handleCopySurat = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedSurat);
    }
    setCopiedSuratNum(true);
    setTimeout(() => setCopiedSuratNum(false), 2000);
  };

  // Divisi Pubdok handlers
  const handleCreatePubdokTicket = (e) => {
    e.preventDefault();
    if (!formPubTitle.trim()) return;

    const newTicket = {
      id: `PUB-00${pubdokTickets.length + 1}`,
      title: formPubTitle.trim(),
      division: formPubDiv,
      canvas: formPubCanvas,
      deadline: formPubDeadline || '15 Nov 2026',
      status: 'Antrean',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      designer: 'Antrean Pubdok',
    };

    setPubdokTickets([newTicket, ...pubdokTickets]);
    setFormPubTitle('');
    addLog(`Tiket request desain baru dibuat: ${newTicket.id} (${newTicket.title})`, 'info');
  };

  const handleToggleTicketStatus = (ticketId, nextStatus) => {
    const statusMap = {
      'Antrean': 'bg-blue-50 text-blue-700 border-blue-200',
      'Dikerjakan': 'bg-amber-50 text-amber-700 border-amber-200',
      'Selesai': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    setPubdokTickets(
      pubdokTickets.map((t) =>
        t.id === ticketId
          ? { ...t, status: nextStatus, statusColor: statusMap[nextStatus] || t.statusColor }
          : t
      )
    );
    addLog(`Update status tiket desain ${ticketId} ➔ ${nextStatus}`, 'success');
  };

  // Divisi Humas handlers
  const handleApproveMedpart = (medpartId) => {
    setHumasMedparts(
      humasMedparts.map((m) =>
        m.id === medpartId
          ? {
              ...m,
              status: 'Disetujui - Forward Pubdok',
              statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            }
          : m
      )
    );
    addLog(`Pengajuan Medpart ${medpartId} disetujui & diteruskan ke Pubdok`, 'success');
  };

  const handleRejectMedpart = (medpartId) => {
    setHumasMedparts(
      humasMedparts.map((m) =>
        m.id === medpartId
          ? {
              ...m,
              status: 'Ditolak (Slot Penuh)',
              statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
            }
          : m
      )
    );
    addLog(`Pengajuan Medpart ${medpartId} ditolak`, 'info');
  };

  // Divisi KKM handlers
  const handleSetKkmLunas = (orderId) => {
    setKkmOrders(
      kkmOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Lunas',
              statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            }
          : o
      )
    );
    addLog(`Pesanan Pre-Order ${orderId} diverifikasi lunas`, 'success');
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
      canAccessAdmin: Boolean(formCanAccessAdmin),
    };

    onAddAccount(newAccount);
    addLog(`Akun mahasiswa baru ditambahkan: ${cleanName} (${cleanNim}) [${formCanAccessAdmin ? 'Akses Admin' : 'Non-Admin'}]`, 'success');

    setFormSuccess(`Akun ${cleanName} (${cleanNim}) berhasil didaftarkan!`);
    setFormNim('');
    setFormName('');
    setFormPassword('password123');
    setFormCanAccessAdmin(false);

    setTimeout(() => {
      setFormSuccess('');
      setIsAddFormOpen(false);
    }, 1500);
  };

  const handleOpenEditModal = (acc) => {
    setEditingTargetNim(acc.nim);
    setEditFormNim(acc.nim);
    setEditFormName(acc.name || '');
    setEditFormDivision(acc.division || 'Divisi Kesekretariatan');
    setEditFormRole(acc.role || 'Anggota Aktif');
    setEditFormPassword(acc.password || '');
    setEditFormCanAccessAdmin(acc.canAccessAdmin ?? (acc.nim === '23404053' || acc.isDefault));
    setEditFormShowPass(false);
    setEditFormError('');
    setEditFormSuccess('');
    setIsEditModalOpen(true);
  };

  const handleGenerateEditPass = () => {
    const randomPass = 'tera' + Math.floor(1000 + Math.random() * 9000);
    setEditFormPassword(randomPass);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditFormError('');
    setEditFormSuccess('');

    const cleanNim = editFormNim.trim();
    const cleanName = editFormName.trim();
    const cleanPass = editFormPassword.trim();
    const cleanRole = editFormRole.trim();

    if (!cleanNim) {
      setEditFormError('NIM mahasiswa wajib diisi.');
      return;
    }
    if (!cleanName) {
      setEditFormError('Nama lengkap mahasiswa wajib diisi.');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      setEditFormError('Kata sandi minimal 4 karakter.');
      return;
    }

    // Check if changed NIM collides with another account
    if (cleanNim !== editingTargetNim && accounts.some((a) => a.nim === cleanNim)) {
      setEditFormError(`NIM ${cleanNim} sudah digunakan oleh akun mahasiswa lain.`);
      return;
    }

    // NIM 23404053 is primary Master Administrator
    const finalCanAccessAdmin = cleanNim === '23404053' ? true : Boolean(editFormCanAccessAdmin);

    const updatedAccount = {
      nim: cleanNim,
      name: cleanName,
      division: editFormDivision,
      role: cleanRole || 'Anggota Aktif',
      password: cleanPass,
      canAccessAdmin: finalCanAccessAdmin,
    };

    if (onUpdateAccount) {
      onUpdateAccount(editingTargetNim, updatedAccount);
    } else if (onUpdatePassword) {
      onUpdatePassword(editingTargetNim, cleanPass);
    }

    addLog(`Data akun diperbarui: ${cleanName} (NIM: ${cleanNim}) [${finalCanAccessAdmin ? 'Bisa Akses Admin' : 'Non-Admin'}]`, 'success');
    setEditFormSuccess(`Data akun ${cleanName} berhasil diperbarui!`);

    setTimeout(() => {
      setEditFormSuccess('');
      setIsEditModalOpen(false);
    }, 1200);
  };

  const handleToggleAdminAccess = (acc) => {
    if (acc.nim === '23404053') {
      alert('NIM 23404053 adalah akun Master Administrator dan izin akses admin tidak dapat dinonaktifkan.');
      return;
    }
    const nextStatus = !acc.canAccessAdmin;
    const updatedAccount = {
      ...acc,
      canAccessAdmin: nextStatus,
    };
    if (onUpdateAccount) {
      onUpdateAccount(acc.nim, updatedAccount);
    }
    addLog(
      `Hak akses admin ${acc.name} (${acc.nim}) diubah: ${nextStatus ? 'BISA AKSES ADMIN' : 'HANYA PORTAL (NON-ADMIN)'}`,
      nextStatus ? 'success' : 'info'
    );
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

  // Filtered accounts based on search query, division, and access rights
  const filteredAccounts = accounts.filter((acc) => {
    const matchDivision =
      selectedDivision === 'Semua Divisi' || acc.division === selectedDivision;
    const matchAccess =
      accessFilter === 'Semua Akses' ||
      (accessFilter === 'Bisa Akses Admin' && Boolean(acc.canAccessAdmin)) ||
      (accessFilter === 'Hanya Portal (Non-Admin)' && !acc.canAccessAdmin);
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      acc.nim.toLowerCase().includes(q) ||
      acc.name.toLowerCase().includes(q) ||
      acc.role.toLowerCase().includes(q) ||
      acc.division.toLowerCase().includes(q);
    return matchDivision && matchAccess && matchSearch;
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
                LAYANAN WORKSPACE (10 MODUL)
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
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> BPH & Kesekretariatan
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">14 Kader (29%)</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Pubdok & Humas
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">20 Kader (42%)</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Kaderisasi & KKM
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">14 Kader (29%)</p>
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

          {/* TAB: ARCHIVE (DIGITALISASI E-ARSIP & PERSURATAN - DIVISI KESEKRETARIATAN) */}
          {currentNav === 'archive' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                    <FolderArchive size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Divisi Kesekretariatan: E-Arsip & Persuratan
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Generator nomor surat dinas otomatis anti-bentrok, checklist kelengkapan LPJ, & repositori SK.
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

              {/* Top 3 Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Nomor Terbit Terakhir</span>
                  <p className="text-base font-bold text-blue-600 mt-2 font-mono truncate">{generatedSurat}</p>
                  <p className="text-xs text-slate-500 mt-1">Format baku baku Teramedia 2026</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Surat Keluar Terdata</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{suratLog.length + 23} Dokumen</p>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                    <Check size={12} /> Terarsip otomatis di cloud
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Verifikasi Kelengkapan LPJ</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">4 dari 4 Syarat</p>
                  <p className="text-xs text-slate-500 mt-1">100% Berkas Siap untuk Mubes</p>
                </div>
              </div>

              {/* Interactive Tool: Generator Nomor Surat Otomatis */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FolderArchive size={16} className="text-blue-600" />
                      <span>Generator Nomor Surat Dinas Otomatis (Anti-Bentrok)</span>
                    </h3>
                    <p className="text-xs text-slate-500">Pilih kode divisi dan jenis surat untuk mendapatkan nomor resmi instan</p>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Sistem Kesekretariatan
                  </span>
                </div>

                <form onSubmit={handleGenerateSurat} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Jenis Surat</label>
                    <select
                      value={suratGenType}
                      onChange={(e) => setSuratGenType(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="UND">UND (Surat Undangan)</option>
                      <option value="ST">ST (Surat Tugas Panitia)</option>
                      <option value="SP">SP (Surat Permohonan / Izin)</option>
                      <option value="SK">SK (Surat Keputusan)</option>
                      <option value="PBR">PBR (Surat Pemberitahuan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Divisi Pemohon</label>
                    <select
                      value={suratGenDiv}
                      onChange={(e) => setSuratGenDiv(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="BPH">BPH (Badan Pengurus Harian)</option>
                      <option value="SEKRE">KESEKRETARIATAN</option>
                      <option value="PUBDOK">PUBDOK (Publikasi & Dokumentasi)</option>
                      <option value="HUMAS">HUMAS (Hubungan Masyarakat)</option>
                      <option value="KADER">KADERISASI</option>
                      <option value="KKM">KKM (Kewirausahaan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Perihal / Keperluan Surat</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Undangan Narasumber Workshop"
                      value={suratGenPerihal}
                      onChange={(e) => setSuratGenPerihal(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Terbitkan & Registrasi Nomor Surat</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Nomor Baru Terbit:</span>
                      <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-xs text-slate-900">
                        {generatedSurat}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopySurat}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedSuratNum ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedSuratNum ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Table of Generated Letters */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Buku Registrasi Nomor Surat Terbit</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Nomor Surat Resmi</th>
                        <th className="py-2.5 px-3">Perihal Dokumen</th>
                        <th className="py-2.5 px-3">Divisi</th>
                        <th className="py-2.5 px-3">Tanggal Terbit</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {suratLog.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{s.no}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{s.perihal}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              {s.div}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{s.date}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              <Check size={11} /> {s.status}
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
                  <p className="text-xs text-slate-500 mt-1">Kit Lensa 16-50mm • Divisi Pubdok</p>
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

          {/* TAB: HR (DIVISI KADERISASI - RAPOR KADER & SCORING KEAKTIFAN) */}
          {currentNav === 'hr' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Divisi Kaderisasi: Rapor Kader & Scoring Keaktifan
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Pemantauan keaktifan, tracking kelulusan Diksar, evaluasi anggota, dan penerbitan e-sertifikat.
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

              {/* Kaderisasi Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-slate-900">48</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Kader Aktif Terdaftar</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-blue-600">92%</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Rata-rata Presensi</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">38</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Lulus Diksar Penuh</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                  <p className="text-2xl font-extrabold text-purple-600">100%</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">E-Sertifikat Siap Terbit</p>
                </div>
              </div>

              {/* Rapor Keaktifan Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Award size={16} className="text-violet-600" />
                      <span>Rapor Nilai Keaktifan Kader TERAMEDIA 2026</span>
                    </h3>
                    <p className="text-xs text-slate-500">Kalkulasi otomatis dari kehadiran pleno, kepanitiaan, dan pengerjaan tugas divisi</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Periode 2026/2027</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">NIM / Nama Kader</th>
                        <th className="py-2.5 px-3">Divisi Kepengurusan</th>
                        <th className="py-2.5 px-3">Status Diksar</th>
                        <th className="py-2.5 px-3">Presensi</th>
                        <th className="py-2.5 px-3">Skor Poin</th>
                        <th className="py-2.5 px-3">Predikat Nilai</th>
                        <th className="py-2.5 px-3">E-Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {kaderRaporList.map((k) => (
                        <tr key={k.nim} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{k.name}</span>
                            <span className="text-[11px] font-mono text-slate-400">NIM: {k.nim}</span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">{k.division}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              {k.diksar}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">{k.attendance}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">{k.score}</span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-violet-600 rounded-full"
                                  style={{ width: `${k.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${k.gradeColor}`}>
                              {k.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                              <Check size={12} /> {k.certStatus}
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

          {/* TAB: HELPDESK (DIVISI PUBLIKASI & DOKUMENTASI - PUBDOK TICKET KANBAN) */}
          {currentNav === 'helpdesk' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <Headphones size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Divisi Pubdok: Sistem Tiket & Antrean Desain Visual
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Manajemen request materi visual (Feed, Story, Spanduk, Twibbon) dengan spesifikasi canvas & SLA jelas.
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

              {/* Form Input Request Desain Cepat */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Plus size={16} className="text-rose-600" />
                  <span>+ Ajukan Permohonan Desain ke Divisi Pubdok</span>
                </h3>
                <form onSubmit={handleCreatePubdokTicket} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Judul Kebutuhan Desain</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Poster Webinar AI"
                      value={formPubTitle}
                      onChange={(e) => setFormPubTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Divisi Pemohon</label>
                    <select
                      value={formPubDiv}
                      onChange={(e) => setFormPubDiv(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                    >
                      <option value="BPH">BPH</option>
                      <option value="Divisi Kesekretariatan">Divisi Kesekretariatan</option>
                      <option value="Divisi Humas">Divisi Humas</option>
                      <option value="Divisi Kaderisasi">Divisi Kaderisasi</option>
                      <option value="Divisi KKM">Divisi KKM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Ukuran / Format Canvas</label>
                    <select
                      value={formPubCanvas}
                      onChange={(e) => setFormPubCanvas(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                    >
                      <option value="Feed Instagram (1:1)">Feed Instagram (1:1)</option>
                      <option value="Story & Reels (9:16)">Story & Reels (9:16)</option>
                      <option value="Spanduk Banner (3x1m)">Spanduk Banner (3x1m)</option>
                      <option value="Poster Cetak (A3)">Poster Cetak (A3)</option>
                      <option value="Twibbon PNG Transparan">Twibbon PNG Transparan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Batas Waktu (Deadline)</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={formPubDeadline}
                        onChange={(e) => setFormPubDeadline(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shrink-0 cursor-pointer shadow-xs transition-colors"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Tickets Kanban List */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Antrean Kerja Desain Divisi Pubdok</h4>
                    <p className="text-xs text-slate-500">Pantau SLA pengerjaan dan ganti status desain secara live</p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
                    {['Semua', 'Antrean', 'Dikerjakan', 'Selesai'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setPubdokFilter(f)}
                        className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          pubdokFilter === f
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {pubdokTickets
                    .filter((t) => pubdokFilter === 'Semua' || t.status === pubdokFilter)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-rose-600">{t.id}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                              {t.canvas}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.statusColor}`}>
                              {t.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                          <p className="text-xs text-slate-500">
                            Pengaju: <span className="font-semibold text-slate-700">{t.division}</span> • Deadline: {t.deadline} • PIC: {t.designer}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {t.status === 'Antrean' && (
                            <button
                              onClick={() => handleToggleTicketStatus(t.id, 'Dikerjakan')}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              Mulai Kerjakan
                            </button>
                          )}
                          {t.status === 'Dikerjakan' && (
                            <button
                              onClick={() => handleToggleTicketStatus(t.id, 'Selesai')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              Tandai Selesai
                            </button>
                          )}
                          {t.status === 'Selesai' && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <Check size={14} /> Selesai Siap Upload
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HUMAS (DIVISI HUMAS - MEDIA PARTNER GATEWAY & RELASI) */}
          {currentNav === 'humas' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Divisi Humas: Gateway Media Partner & Relasi
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Pusat verifikasi permohonan publikasi media partner, barter promosi, & buku kontak relasi kampus.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('humas')}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman Humas Penuh</span>
                </button>
              </div>

              {/* Humas Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pengajuan Masuk Bulan Ini</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{humasMedparts.length} Permohonan</p>
                  <p className="text-xs text-sky-600 mt-1 font-semibold">Trafik medpart aktif meningkat</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Mitra Kampus & Alumni</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">24 Organisasi</p>
                  <p className="text-xs text-slate-500 mt-1">BEM, DEMA, Himpunan & UKM</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Koordinasi ke Pubdok</span>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">Otomatis Sync</p>
                  <p className="text-xs text-slate-500 mt-1">Disetujui langsung masuk antrean Medsos</p>
                </div>
              </div>

              {/* Medpart Approval Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Pengajuan Media Partner Terbaru</h3>
                    <p className="text-xs text-slate-500">Tinjau kesesuaian barter publikasi sebelum materi diteruskan ke Medsos</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Filter: Semua Event</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Kode / Event</th>
                        <th className="py-2.5 px-3">Lembaga Penyelenggara</th>
                        <th className="py-2.5 px-3">Paket Barter</th>
                        <th className="py-2.5 px-3">Tanggal Kegiatan</th>
                        <th className="py-2.5 px-3">Kontak PIC</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {humasMedparts.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{m.event}</span>
                            <span className="font-mono text-[11px] text-slate-400">{m.id}</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">{m.organizer}</td>
                          <td className="py-3 px-3 font-medium text-slate-700">{m.package}</td>
                          <td className="py-3 px-3 text-slate-600">{m.date}</td>
                          <td className="py-3 px-3 text-slate-500">{m.pic}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.statusColor}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {m.status === 'Menunggu Review' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApproveMedpart(m.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleRejectMedpart(m.id)}
                                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <span className="text-emerald-700 font-semibold text-[11px]">Terverifikasi</span>
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

          {/* TAB: KKM (DIVISI KREATIVITAS & KEWIRAUSAHAAN - MERCH & SEWA ALAT) */}
          {currentNav === 'kkm' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Divisi KKM: Kewirausahaan, Merch & Sewa Alat
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Pre-order merchandise resmi, booking persewaan kamera/multimedia, & pembukuan kas laba-rugi usaha.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService('kkm')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Buka Halaman KKM Penuh</span>
                </button>
              </div>

              {/* KKM Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Omzet Usaha</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">Rp 14.850.000</p>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                    <TrendingUp size={12} /> +24% dari periode lalu
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pre-Order Merch Aktif</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{kkmOrders.length + 35} Pesanan</p>
                  <p className="text-xs text-blue-600 mt-1 font-semibold">Hoodie & Lanyard Batch 1</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sewa Alat & Liputan</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">5 Jadwal</p>
                  <p className="text-xs text-purple-600 mt-1 font-semibold">Kamera Sony, Mic, Godox</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Laba Bersih KKM</span>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">Rp 4.920.000</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Bagi Hasil UKM: Rp 1.968.000 (40%)</p>
                </div>
              </div>

              {/* Pre-Order Tracking Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Daftar Pesanan Pre-Order Official Merchandise</h3>
                    <p className="text-xs text-slate-500">Rekapitulasi ukuran kaos hoodie, lanyard, dan status pelunasan</p>
                  </div>
                  <button
                    onClick={() => onNavigateToService('kkm')}
                    className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    + Buat Pesanan Baru di Portal
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Kode Order</th>
                        <th className="py-2.5 px-3">Nama Pemesan / NIM</th>
                        <th className="py-2.5 px-3">Item Merchandise</th>
                        <th className="py-2.5 px-3">Ukuran</th>
                        <th className="py-2.5 px-3">Total Biaya</th>
                        <th className="py-2.5 px-3">Status Bayar</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {kkmOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-700">{o.id}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900">{o.name}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{o.item}</td>
                          <td className="py-3 px-3 text-slate-600">{o.size}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{o.total}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${o.statusColor}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {o.status !== 'Lunas' ? (
                              <button
                                onClick={() => handleSetKkmLunas(o.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Set Lunas
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-semibold text-[11px]">Lunas</span>
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
                    <select
                      value={accessFilter}
                      onChange={(e) => setAccessFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                    >
                      <option value="Semua Akses">Semua Hak Akses</option>
                      <option value="Bisa Akses Admin">Bisa Akses Admin</option>
                      <option value="Hanya Portal (Non-Admin)">Hanya Portal (Non-Admin)</option>
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
                        <th className="py-3 px-4">HAK AKSES ADMIN</th>
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
                              <button
                                type="button"
                                onClick={() => handleToggleAdminAccess(acc)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                                  acc.canAccessAdmin
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                }`}
                                title={
                                  acc.nim === '23404053'
                                    ? 'Akun Master Admin (Permanen)'
                                    : acc.canAccessAdmin
                                    ? 'Klik untuk cabut hak akses admin'
                                    : 'Klik untuk berikan hak akses admin'
                                }
                              >
                                {acc.canAccessAdmin ? (
                                  <>
                                    <ShieldCheck size={12} className="text-emerald-600" />
                                    <span>Bisa Akses Admin</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock size={12} className="text-slate-400" />
                                    <span>Hanya Portal Layanan</span>
                                  </>
                                )}
                              </button>
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
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(acc)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer border border-blue-200/80 hover:border-blue-600 shadow-2xs"
                                  title="Edit Data Mahasiswa & Akun"
                                >
                                  <Edit2 size={12} />
                                  <span>Edit Data</span>
                                </button>
                                <button
                                  onClick={() => onImpersonate(acc)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                                  title="Masuk sebagai akun ini"
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

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Hak Akses Dashboard Admin
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormCanAccessAdmin(false)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      !formCanAccessAdmin
                        ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Lock size={13} />
                    <span>Hanya Portal Layanan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormCanAccessAdmin(true)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formCanAccessAdmin
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>Bisa Akses Admin</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {formCanAccessAdmin
                    ? '✓ Mahasiswa ini diizinkan membuka dashboard admin & mengelola data akun.'
                    : 'ℹ Mahasiswa ini hanya dapat membuka portal kerja layanan divisi (non-admin).'}
                </p>
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

      {/* 4. MODAL: EDIT DATA MAHASISWA & AKUN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Edit2 size={15} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Edit Data Akun Mahasiswa
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Perbarui NIM, nama lengkap, divisi, jabatan, atau kata sandi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Induk Mahasiswa (NIM)
                </label>
                <input
                  type="text"
                  value={editFormNim}
                  onChange={(e) => setEditFormNim(e.target.value)}
                  placeholder="Contoh: 23404053"
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
                  value={editFormName}
                  onChange={(e) => setEditFormName(e.target.value)}
                  placeholder="Contoh: Alif Fikri"
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
                    value={editFormDivision}
                    onChange={(e) => setEditFormDivision(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    {divisionsList.filter((d) => d !== 'Semua Divisi').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Jabatan / Peran
                  </label>
                  <input
                    type="text"
                    value={editFormRole}
                    onChange={(e) => setEditFormRole(e.target.value)}
                    placeholder="Contoh: Demisioner Ketua Umum"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateEditPass}
                    className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={11} />
                    <span>Acak Sandi</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={editFormShowPass ? 'text' : 'password'}
                    value={editFormPassword}
                    onChange={(e) => setEditFormPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setEditFormShowPass(!editFormShowPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {editFormShowPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Hak Akses Dashboard Admin
                  </label>
                  {editingTargetNim === '23404053' && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Master Admin (Terkunci)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    disabled={editingTargetNim === '23404053'}
                    onClick={() => setEditFormCanAccessAdmin(false)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editingTargetNim === '23404053'
                        ? 'opacity-40 cursor-not-allowed text-slate-400'
                        : !editFormCanAccessAdmin
                        ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Lock size={13} />
                    <span>Hanya Portal Layanan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormCanAccessAdmin(true)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editFormCanAccessAdmin
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>Bisa Akses Admin</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {editingTargetNim === '23404053'
                    ? 'NIM 23404053 adalah akun Master Admin UKM TERAMEDIA dan hak akses panel admin tidak dapat dinonaktifkan.'
                    : editFormCanAccessAdmin
                    ? '✓ Akun ini memiliki izin penuh untuk masuk ke Dashboard Admin.'
                    : 'ℹ Akun ini dibatasi hanya dapat mengakses portal kerja/layanan divisi.'}
                </p>
              </div>

              {editFormError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  {editFormError}
                </p>
              )}

              {editFormSuccess && (
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <Check size={14} />
                  <span>{editFormSuccess}</span>
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
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

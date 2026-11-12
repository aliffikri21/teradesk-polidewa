import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  CheckCheck,
  Copy,
  Share2,
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
  TrendingUp,
  Bookmark,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CalendarCheck,
  Inbox,
  Mail,
  MessageSquare,
  CheckCircle2,
  LogIn,
  Send,
  Laptop,
  Smartphone,
  Tablet,
  Volume2,
  VolumeX,
  Menu,
  FileSpreadsheet,
  Radio,
  BarChart3,
  Trophy,
  Code2,
  Sun,
  Moon,
  Megaphone,
  Pin,
  AlertTriangle,
  Building2,
  MapPin,
  User,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { playNotificationChime, getSoundMuted, setSoundMuted } from '../../utils/notificationSound';
import { initialDefaultLeadership } from '../../data/defaultLeadership';
import { initialDefaultTickets, sortTicketsNewestFirst } from '../../data/defaultTickets';
import { getLogDateInfo, getAvailableLogMonths, exportLogsToXLSX } from '../../utils/logExporter';
import { OFFICIAL_DIVISIONS } from '../../data/defaultAccounts';
import {
  defaultAttendanceSessions,
  defaultAttendanceList,
} from '../../data/defaultModulesData';
import {
  isDummyAttendanceSession,
  isDummyAttendanceRecord,
} from '../../services/moduleSyncService';

const divisionsList = [
  'Semua Divisi',
  ...OFFICIAL_DIVISIONS,
];

const DIVISION_ANALYTICS_CONFIG = {
  'BPH (Badan Pengurus Harian)': {
    shortName: 'BPH',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    barColor: 'bg-indigo-600',
    lightBg: 'bg-indigo-50/60',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
  },
  'Divisi Kesekretariatan': {
    shortName: 'Kesekretariatan',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    barColor: 'bg-emerald-600',
    lightBg: 'bg-emerald-50/60',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  'Divisi Publikasi dan Dokumentasi': {
    shortName: 'Pubdok',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    barColor: 'bg-rose-600',
    lightBg: 'bg-rose-50/60',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
  },
  'Divisi Humas': {
    shortName: 'Humas',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    barColor: 'bg-sky-600',
    lightBg: 'bg-sky-50/60',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
  },
  'Divisi Kaderisasi': {
    shortName: 'Kaderisasi',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    barColor: 'bg-blue-600',
    lightBg: 'bg-blue-50/60',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  'Divisi KKM (Kewirausahaan)': {
    shortName: 'Dana Usaha (KKM)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    barColor: 'bg-amber-600',
    lightBg: 'bg-amber-50/60',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
};

const getDivisionConfig = (name) => {
  return (
    DIVISION_ANALYTICS_CONFIG[name] || {
      shortName: name,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      barColor: 'bg-purple-600',
      lightBg: 'bg-purple-50/60',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
    }
  );
};

const normalizeDivisionName = (divName) => {
  if (!divName) return 'Lainnya';
  const trimmed = String(divName).trim();
  const lower = trimmed.toLowerCase();
  if (lower.includes('bph') || lower.includes('presidium') || lower.includes('demisioner')) {
    return 'BPH (Badan Pengurus Harian)';
  }
  if (lower.includes('sekretar') || lower.includes('arsip')) {
    return 'Divisi Kesekretariatan';
  }
  if (lower.includes('pubdok') || lower.includes('publikasi') || lower.includes('dokumentasi') || lower.includes('desain') || lower.includes('media')) {
    return 'Divisi Publikasi dan Dokumentasi';
  }
  if (lower.includes('humas') || lower.includes('jaringan') || lower.includes('eksternal')) {
    return 'Divisi Humas';
  }
  if (lower.includes('kader') || lower.includes('sdm') || lower.includes('litbang')) {
    return 'Divisi Kaderisasi';
  }
  if (lower.includes('kkm') || lower.includes('wirausaha') || lower.includes('usaha') || lower.includes('merchandise')) {
    return 'Divisi KKM (Kewirausahaan)';
  }
  return trimmed;
};

// Official Roles in TeraDesk (UKM TERAMEDIA)
const OFFICIAL_ROLES = [
  { value: 'Koordinator Divisi', label: 'Koordinator Divisi (Kadiv)', canAdmin: true },
  { value: 'Anggota Biasa', label: 'Anggota Biasa / Staf', canAdmin: false },
  { value: 'BPH (Badan Pengurus Harian)', label: 'BPH (Badan Pengurus Harian)', canAdmin: true },
  { value: 'Demisioner Ketua Umum', label: 'Demisioner Ketua Umum', canAdmin: true },
];

const normalizeRoleName = (rawRole) => {
  if (!rawRole) return 'Anggota Biasa';
  const trimmed = String(rawRole).trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes('developer') || lower.includes('pengembang')) {
    return 'Developer';
  }
  if (lower.includes('demisioner') || lower.includes('ketua umum')) {
    return 'Demisioner Ketua Umum';
  }
  if (lower.includes('bph') || lower.includes('pengurus harian') || lower.includes('presidium')) {
    return 'BPH (Badan Pengurus Harian)';
  }
  if (lower.includes('koordinator') || lower.includes('kadiv') || lower.includes('kepala divisi')) {
    return 'Koordinator Divisi';
  }
  if (lower.includes('biasa') || lower.includes('staf') || lower.includes('staff') || lower.includes('anggota')) {
    return 'Anggota Biasa';
  }
  return trimmed || 'Anggota Biasa';
};

const getRoleDisplayLabel = (roleVal) => {
  if (roleVal === 'Developer') return 'Developer';
  if (roleVal === 'Koordinator Divisi') return 'Koordinator Divisi (Kadiv)';
  if (roleVal === 'Anggota Biasa') return 'Anggota Biasa / Staf';
  if (roleVal === 'BPH (Badan Pengurus Harian)') return 'BPH (Badan Pengurus Harian)';
  if (roleVal === 'Demisioner Ketua Umum') return 'Demisioner Ketua Umum';
  return roleVal || 'Anggota Biasa / Staf';
};

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
  {
    id: 'activity',
    title: 'Arsip Kegiatan & Dokumentasi',
    category: 'Dokumentasi & Kegiatan',
    badge: 'Semua Divisi',
    icon: CalendarCheck,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    description: 'Repositori detail kegiatan yang telah dilaksanakan seluruh divisi, dokumentasi foto, dan arsip LPJ resmi.',
    pic: 'Semua Divisi',
    activeCount: '6 Kegiatan',
  },
];

const getTimestamp = () => new Date().toLocaleTimeString('id-ID');
const getDateStamp = () => new Date().toISOString().split('T')[0];

const AdminDashboardPage = ({
  onBackToLanding,
  onNavigateToPortal,
  onNavigateToService,
  accounts = [],
  onAddAccount,
  onAddBatchAccounts,
  onUpdateAccount,
  onUpdatePassword,
  onDeleteAccount,
  onDeleteBatchAccounts,
  onImpersonate,
  onForceDestroySession,
  authUser,
  prokerList = [],
  onAddProker,
  onUpdateProker,
  onDeleteProker,
  onToggleProkerVisibility,
  onResetProker,
  onReorderProker,
  consultationMessages = [],
  onUpdateConsultationStatus,
  onMarkConsultationRead,
  onMarkAllConsultationsRead,
  onDeleteConsultation,
  onResetConsultations,
  onClearAllConsultations,
  activityLogs = [],
  onAddActivityLog,
  onClearActivityLogs,
  onResetActivityLogs,
  tickets = [],
  onAddTicket,
  onUpdateTicketStatus,
  onDeleteTicket,
  parSubmissions: propParSubmissions,
  onApproveProposal: propOnApproveProposal,
  humasMedparts: propHumasMedparts,
  onApproveMedpart: propOnApproveMedpart,
  onRejectMedpart: propOnRejectMedpart,
  kkmOrders: propKkmOrders,
  onSetKkmLunas: propOnSetKkmLunas,
  suratLog: propSuratLog,
  onAddSuratLog: propOnAddSuratLog,
  attendanceList: propAttendanceList,
  onAddAttendanceRecord: _propOnAddAttendanceRecord,
  attendanceSessions: propAttendanceSessions,
  onAddAttendanceSession: _propOnAddAttendanceSession,
  onUpdateAttendanceSession: propOnUpdateAttendanceSession,
  onDeleteAttendanceSession: propOnDeleteAttendanceSession,
  onDeleteAttendanceRecord: propOnDeleteAttendanceRecord,
  moduleStatuses: propModuleStatuses,
  onToggleModuleStatus: propOnToggleModuleStatus,
  onOpenPublicAttendanceModal,
  initialNav = 'dashboard',
  onOpenCommandPalette,
  onOpenChangePassword,
  leadershipProfiles: propLeadershipProfiles,
  onUpdateLeadershipProfiles: propOnUpdateLeadershipProfiles,
  announcements = [],
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncementStatus,
  onResetAnnouncements,
  onPreviewAnnouncementPopup,
}) => {
  // Mobile Sidebar Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedPubdokTicket, setSelectedPubdokTicket] = useState(null);

  // Navigation View:
  // 'dashboard' | 'proker' | 'students' | 'inbox' | 'par' | 'archive' | 'asset' | 'finance' | 'attendance' | 'timeline' | 'hr' | 'helpdesk' |
  // 'session' | 'backup' | 'logs' | 'settings'
  const [currentNav, setCurrentNav] = useState(initialNav || 'dashboard');
  const [prevInitialNav, setPrevInitialNav] = useState(initialNav);
  if (prevInitialNav !== initialNav) {
    setPrevInitialNav(initialNav);
    setCurrentNav(initialNav || 'dashboard');
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua Divisi');
  const [accessFilter, setAccessFilter] = useState('Semua Akses');
  const [roleFilter, setRoleFilter] = useState('Semua Jabatan');
  const [dateRangeFilter, setDateRangeFilter] = useState('Semester Ganjil 2026/2027');
  const [timeframeFilter, setTimeframeFilter] = useState('Bulan Ini');

  // State for Kotak Masuk Konsultasi (Inbox Kontak)
  const [inboxSearchQuery, setInboxSearchQuery] = useState('');
  const [inboxFilterStatus, setInboxFilterStatus] = useState('Semua Status'); // 'Semua Status' | 'Baru' | 'Diproses' | 'Selesai'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const unreadConsultationsCount = consultationMessages.filter((m) => !m.isRead).length;

  // Real-time Sound & Toast State for Kotak Masuk Konsultasi
  const [isSoundMutedState, setIsSoundMutedState] = useState(() => getSoundMuted());
  const [inboxToast, setInboxToast] = useState(null);

  // State for Pengumuman BPH (Maklumat Pop-up Anggota)
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementCategoryFilter, setAnnouncementCategoryFilter] = useState('Semua Kategori');
  const [announcementStatusFilter, setAnnouncementStatusFilter] = useState('Semua Status'); // 'Semua Status' | 'Aktif' | 'Nonaktif'
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState(null);

  // Audit Keterbacaan Maklumat Modal states
  const [auditAnnouncement, setAuditAnnouncement] = useState(null);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState('all'); // 'all' | 'read' | 'unread'
  const [auditDivisionFilter, setAuditDivisionFilter] = useState('all');
  const [auditCopied, setAuditCopied] = useState(false);

  // Form states for Announcement modal
  const [annFormTitle, setAnnFormTitle] = useState('');
  const [annFormCategory, setAnnFormCategory] = useState('Rapat Pleno');
  const [annFormPriority, setAnnFormPriority] = useState('urgent');
  const [annFormTarget, setAnnFormTarget] = useState('Semua Anggota');
  const [annFormDate, setAnnFormDate] = useState('12 Nov 2026');
  const [annFormTime, setAnnFormTime] = useState('19:30 WITA');
  const [annFormLocation, setAnnFormLocation] = useState('Studio Multimedia Kampus II & Google Meet');
  const [annFormContent, setAnnFormContent] = useState('');
  const [annFormActionText, setAnnFormActionText] = useState('Buka Jadwal Presensi');
  const [annFormActionServiceId, setAnnFormActionServiceId] = useState('attendance');
  const [annFormIsActive, setAnnFormIsActive] = useState(true);
  const [annFormIsPinned, setAnnFormIsPinned] = useState(false);

  const activeAnnouncementsCount = (announcements || []).filter((a) => a.isActive).length;

  const filteredAnnouncements = useMemo(() => {
    return (announcements || []).filter((ann) => {
      const matchSearch =
        !announcementSearch.trim() ||
        (ann.title && ann.title.toLowerCase().includes(announcementSearch.toLowerCase())) ||
        (ann.content && ann.content.toLowerCase().includes(announcementSearch.toLowerCase())) ||
        (ann.category && ann.category.toLowerCase().includes(announcementSearch.toLowerCase()));

      const matchCat =
        announcementCategoryFilter === 'Semua Kategori' || ann.category === announcementCategoryFilter;

      const matchStatus =
        announcementStatusFilter === 'Semua Status' ||
        (announcementStatusFilter === 'Aktif' && ann.isActive) ||
        (announcementStatusFilter === 'Nonaktif' && !ann.isActive);

      return matchSearch && matchCat && matchStatus;
    });
  }, [announcements, announcementSearch, announcementCategoryFilter, announcementStatusFilter]);

  const auditData = useMemo(() => {
    if (!auditAnnouncement) return { members: [], total: 0, read: 0, unread: 0, percentage: 0 };
    const readList = Array.isArray(auditAnnouncement.readBy) ? auditAnnouncement.readBy : [];
    const readMap = new Map();
    readList.forEach((r) => {
      if (r.nim) readMap.set(String(r.nim).trim(), r);
    });

    const list = (accounts || []).map((acc) => {
      const cleanNim = String(acc.nim).trim();
      const rec = readMap.get(cleanNim);
      return {
        nim: acc.nim,
        name: acc.name,
        role: acc.role || 'Pengurus',
        division: acc.division || 'BPH',
        isRead: !!rec,
        readAt: rec?.readAt || null,
      };
    });

    // Juga sertakan pembaca yang mungkin NIM-nya tidak ada dalam akun terdaftar
    readList.forEach((r) => {
      const cleanNim = String(r.nim).trim();
      if (!list.some((m) => String(m.nim).trim() === cleanNim)) {
        list.push({
          nim: r.nim,
          name: r.name,
          role: r.role || 'Anggota',
          division: r.division || 'BPH',
          isRead: true,
          readAt: r.readAt || null,
        });
      }
    });

    const total = list.length;
    const read = list.filter((m) => m.isRead).length;
    const unread = total - read;
    const percentage = total > 0 ? Math.round((read / total) * 100) : 0;

    return { members: list, total, read, unread, percentage };
  }, [auditAnnouncement, accounts]);

  const filteredAuditMembers = useMemo(() => {
    return auditData.members.filter((m) => {
      const matchesSearch =
        !auditSearchQuery.trim() ||
        m.name.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        m.nim.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        m.division.toLowerCase().includes(auditSearchQuery.toLowerCase());

      const matchesStatus =
        auditStatusFilter === 'all' ||
        (auditStatusFilter === 'read' && m.isRead) ||
        (auditStatusFilter === 'unread' && !m.isRead);

      const matchesDivision =
        auditDivisionFilter === 'all' || m.division === auditDivisionFilter;

      return matchesSearch && matchesStatus && matchesDivision;
    });
  }, [auditData, auditSearchQuery, auditStatusFilter, auditDivisionFilter]);

  const handleCopyUnreadReminder = () => {
    if (!auditAnnouncement) return;
    const unreadMembers = auditData.members.filter((m) => !m.isRead);
    if (unreadMembers.length === 0) {
      alert(`Seluruh pengurus (${auditData.total} orang) telah membaca & mengonfirmasi maklumat ini!`);
      return;
    }

    const unreadListFormatted = unreadMembers
      .map((m, idx) => `${idx + 1}. ${m.name} (${m.division})`)
      .join('\n');

    const message = `📢 *[PENGINGAT MAKLUMAT RESMI BPH TERAMEDIA]*\n` +
      `Perihal: *${auditAnnouncement.title}*\n` +
      `Prioritas: ${auditAnnouncement.priority === 'urgent' ? '🔴 Mendesak & Wajib' : auditAnnouncement.priority === 'important' ? '🟡 Penting' : '🔵 Informasi Resmi'}\n\n` +
      `Diberitahukan kepada rekan-rekan pengurus yang *BELUM mengonfirmasi* maklumat (${unreadMembers.length} Orang):\n\n` +
      `${unreadListFormatted}\n\n` +
      `📌 *Instruksi:* Mohon segera login ke TeraDesk dan klik tombol *"Saya Mengerti & Siap Laksanakan"* untuk mencatat kehadiran/keterbacaan instruksi ini.\n\n` +
      `Terima kasih atas kedisiplinan dan kerja samanya! 🙏\n` +
      `_Badan Pengurus Harian (BPH) TERAMEDIA_`;

    navigator.clipboard.writeText(message);
    setAuditCopied(true);
    setTimeout(() => setAuditCopied(false), 3000);
    addLog(`Daftar ${unreadMembers.length} pengurus belum membaca disalin ke clipboard untuk WhatsApp`, 'info');
  };

  const handleExportAuditXLSX = () => {
    if (!auditAnnouncement) return;
    const rows = auditData.members.map((m, idx) => ({
      No: idx + 1,
      NIM: m.nim,
      'Nama Lengkap': m.name,
      Divisi: m.division,
      Jabatan: m.role,
      'Status Keterbacaan': m.isRead ? 'Sudah Konfirmasi' : 'Belum Membaca',
      'Waktu Konfirmasi (WITA)': m.readAt
        ? new Date(m.readAt).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Keterbacaan');
    const safeTitle = (auditAnnouncement.title || 'Maklumat')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    XLSX.writeFile(wb, `Audit_Maklumat_${safeTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    addLog(`Laporan audit keterbacaan maklumat "${auditAnnouncement.title}" diunduh (.xlsx)`, 'info');
  };

  const handleOpenAddAnn = () => {
    setEditingAnnId(null);
    setAnnFormTitle('');
    setAnnFormCategory('Rapat Pleno');
    setAnnFormPriority('urgent');
    setAnnFormTarget('Semua Anggota');
    setAnnFormDate(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }));
    setAnnFormTime('19:30 WITA');
    setAnnFormLocation('Studio Multimedia Kampus II & Google Meet');
    setAnnFormContent('');
    setAnnFormActionText('Buka Jadwal Presensi');
    setAnnFormActionServiceId('attendance');
    setAnnFormIsActive(true);
    setAnnFormIsPinned(false);
    setIsAnnModalOpen(true);
  };

  const handleOpenEditAnn = (ann) => {
    setEditingAnnId(ann.id);
    setAnnFormTitle(ann.title || '');
    setAnnFormCategory(ann.category || 'Rapat Pleno');
    setAnnFormPriority(ann.priority || 'urgent');
    setAnnFormTarget(ann.targetAudience || 'Semua Anggota');
    setAnnFormDate(ann.date || '');
    setAnnFormTime(ann.time || '');
    setAnnFormLocation(ann.location || '');
    setAnnFormContent(ann.content || '');
    setAnnFormActionText(ann.actionText || '');
    setAnnFormActionServiceId(ann.actionServiceId || '');
    setAnnFormIsActive(ann.isActive ?? true);
    setAnnFormIsPinned(ann.isPinned ?? false);
    setIsAnnModalOpen(true);
  };

  const handleSaveAnn = (e) => {
    e.preventDefault();
    if (!annFormTitle.trim() || !annFormContent.trim()) {
      alert('Mohon isi Judul dan Isi Maklumat Pengumuman.');
      return;
    }

    const payload = {
      title: annFormTitle.trim(),
      category: annFormCategory,
      priority: annFormPriority,
      badge: annFormPriority === 'urgent' ? 'Mendesak & Wajib' : annFormPriority === 'important' ? 'Penting' : 'Informasi',
      targetAudience: annFormTarget.trim() || 'Semua Anggota',
      date: annFormDate.trim(),
      time: annFormTime.trim(),
      location: annFormLocation.trim(),
      content: annFormContent.trim(),
      actionText: annFormActionText.trim(),
      actionServiceId: annFormActionServiceId.trim(),
      isActive: annFormIsActive,
      isPinned: annFormIsPinned,
    };

    if (editingAnnId) {
      if (onUpdateAnnouncement) {
        onUpdateAnnouncement(editingAnnId, payload);
      }
      addLog(`Maklumat BPH "${payload.title}" berhasil diperbarui`, 'info');
    } else {
      if (onAddAnnouncement) {
        onAddAnnouncement(payload);
      }
      addLog(`Maklumat baru BPH "${payload.title}" berhasil diterbitkan`, 'success');
    }

    setIsAnnModalOpen(false);
  };

  const handleDeleteAnn = (id, title) => {
    if (window.confirm(`Hapus maklumat BPH "${title}"? Pengumuman tidak akan lagi ditampilkan ke anggota.`)) {
      if (onDeleteAnnouncement) {
        onDeleteAnnouncement(id);
      }
      addLog(`Maklumat BPH "${title}" dihapus`, 'warning');
    }
  };

  const handleToggleAnn = (id, currentStatus, title) => {
    if (onToggleAnnouncementStatus) {
      onToggleAnnouncementStatus(id);
    }
    addLog(`Status tayang maklumat "${title}" diubah menjadi ${!currentStatus ? 'Aktif' : 'Nonaktif'}`, 'info');
  };

  // Admin Dark Mode Theme State with LocalStorage persistence
  const [isAdminDark, setIsAdminDark] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_admin_theme_v1');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const toggleAdminTheme = () => {
    setIsAdminDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('teradesk_admin_theme_v1', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };
  const knownMessageIdsRef = useRef(new Set((consultationMessages || []).map((m) => m.id)));
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      knownMessageIdsRef.current = new Set((consultationMessages || []).map((m) => m.id));
      return;
    }

    const currentList = consultationMessages || [];
    const newArrivals = currentList.filter((m) => !knownMessageIdsRef.current.has(m.id));

    if (newArrivals.length > 0) {
      newArrivals.forEach((m) => knownMessageIdsRef.current.add(m.id));

      // Mainkan suara "tinggg" kristal yang elegan
      playNotificationChime(0.5);

      // Tampilkan toast notifikasi pesan masuk real-time
      const latestMsg = newArrivals[0];
      setInboxToast({
        id: latestMsg.id,
        name: latestMsg.name || 'Pengunjung',
        subject: latestMsg.subject || 'Permohonan Konsultasi Baru',
        time: latestMsg.time || 'Baru saja',
      });

      const timer = setTimeout(() => {
        setInboxToast(null);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [consultationMessages]);

  const handleToggleSound = () => {
    const nextState = !isSoundMutedState;
    setSoundMuted(nextState);
    setIsSoundMutedState(nextState);
    if (!nextState) {
      playNotificationChime(0.5); // Uji tinggg saat diaktifkan kembali
    }
  };

  const handleTestChime = () => {
    playNotificationChime(0.5);
  };

  // Profil Pimpinan & Pembina (Kartu Hero Landing Page)
  const [leadershipForm, setLeadershipForm] = useState(() => ({
    pembinaName: propLeadershipProfiles?.pembina?.name || initialDefaultLeadership.pembina.name,
    pembinaTitle: propLeadershipProfiles?.pembina?.title || initialDefaultLeadership.pembina.title,
    pembinaAvatarUrl: propLeadershipProfiles?.pembina?.avatarUrl || '',
    ketumName: propLeadershipProfiles?.ketuaUmum?.name || initialDefaultLeadership.ketuaUmum.name,
    ketumTitle: propLeadershipProfiles?.ketuaUmum?.title || initialDefaultLeadership.ketuaUmum.title,
    ketumPeriod: propLeadershipProfiles?.ketuaUmum?.period || initialDefaultLeadership.ketuaUmum.period,
    ketumAvatarUrl: propLeadershipProfiles?.ketuaUmum?.avatarUrl || '',
  }));
  const [leadershipSaveSuccess, setLeadershipSaveSuccess] = useState(false);
  const [isLeadershipModalOpen, setIsLeadershipModalOpen] = useState(false);
  const [prevLeadershipProp, setPrevLeadershipProp] = useState(propLeadershipProfiles);

  if (prevLeadershipProp !== propLeadershipProfiles) {
    setPrevLeadershipProp(propLeadershipProfiles);
    if (propLeadershipProfiles) {
      setLeadershipForm({
        pembinaName: propLeadershipProfiles.pembina?.name || initialDefaultLeadership.pembina.name,
        pembinaTitle: propLeadershipProfiles.pembina?.title || initialDefaultLeadership.pembina.title,
        pembinaAvatarUrl: propLeadershipProfiles.pembina?.avatarUrl || '',
        ketumName: propLeadershipProfiles.ketuaUmum?.name || initialDefaultLeadership.ketuaUmum.name,
        ketumTitle: propLeadershipProfiles.ketuaUmum?.title || initialDefaultLeadership.ketuaUmum.title,
        ketumPeriod: propLeadershipProfiles.ketuaUmum?.period || initialDefaultLeadership.ketuaUmum.period,
        ketumAvatarUrl: propLeadershipProfiles.ketuaUmum?.avatarUrl || '',
      });
    }
  }

  // State for Proker Management Tab
  const [prokerSearchQuery, setProkerSearchQuery] = useState('');
  const [prokerFilterDivision, setProkerFilterDivision] = useState('Semua Divisi');
  const [prokerFilterStatus, setProkerFilterStatus] = useState('Semua Status');

  // Modal State for Add / Edit Proker
  const [isProkerModalOpen, setIsProkerModalOpen] = useState(false);
  const [prokerModalMode, setProkerModalMode] = useState('add'); // 'add' | 'edit'
  const [prokerFormId, setProkerFormId] = useState('');
  const [prokerFormBadge, setProkerFormBadge] = useState('Update Program Kerja');
  const [prokerFormTag, setProkerFormTag] = useState('update terakhir');
  const [prokerFormTitle, setProkerFormTitle] = useState('');
  const [prokerFormActionText, setProkerFormActionText] = useState('cek asesmen program kerja');
  const [prokerFormServiceId, setProkerFormServiceId] = useState('par');
  const [prokerFormDivision, setProkerFormDivision] = useState('Divisi Publikasi dan Dokumentasi');
  const [prokerFormPeriod, setProkerFormPeriod] = useState('Maret 2026');
  const [prokerFormStatus, setProkerFormStatus] = useState('Aktif');
  const [prokerFormIsVisible, setProkerFormIsVisible] = useState(true);
  const [prokerFormError, setProkerFormError] = useState('');
  const [prokerFormSuccess, setProkerFormSuccess] = useState('');

  // Attendance Module State for Executive Admin Tab
  const rawAdminAttendanceList = propAttendanceList || defaultAttendanceList;
  const adminAttendanceList = useMemo(
    () => (rawAdminAttendanceList || []).filter((r) => !isDummyAttendanceRecord(r)),
    [rawAdminAttendanceList]
  );
  const rawAdminAttendanceSessions = propAttendanceSessions || defaultAttendanceSessions;
  const adminAttendanceSessions = useMemo(
    () => (rawAdminAttendanceSessions || []).filter((s) => !isDummyAttendanceSession(s)),
    [rawAdminAttendanceSessions]
  );
  const [selectedAdminSessionId, setSelectedAdminSessionId] = useState(
    () => adminAttendanceSessions.find((s) => s.status === 'active')?.id || adminAttendanceSessions[0]?.id || ''
  );
  const activeAttendanceSession =
    adminAttendanceSessions.find((s) => s.id === selectedAdminSessionId) ||
    adminAttendanceSessions.find((s) => s.status === 'active') ||
    adminAttendanceSessions[0] ||
    null;
  const [adminAttendanceSearch, setAdminAttendanceSearch] = useState('');
  const [adminAttendanceFilter, setAdminAttendanceFilter] = useState('Semua');
  const [attendanceAnalyticsScope, setAttendanceAnalyticsScope] = useState('session');
  const [attendanceAnalyticsView, setAttendanceAnalyticsView] = useState('bars');

  const handleToggleCompleteMeetingSession = (sessionToToggle) => {
    if (!sessionToToggle) return;
    const isCurrentlyActive = sessionToToggle.status === 'active';
    const updatedStatus = isCurrentlyActive ? 'completed' : 'active';
    const updatedSession = {
      ...sessionToToggle,
      status: updatedStatus,
    };
    if (propOnUpdateAttendanceSession) {
      propOnUpdateAttendanceSession(updatedSession);
    }
    const actionLabel = isCurrentlyActive
      ? `Agenda rapat "${sessionToToggle.title}" resmi diselesaikan & diarsipkan`
      : `Agenda rapat "${sessionToToggle.title}" diaktifkan kembali`;
    addLog(actionLabel, isCurrentlyActive ? 'success' : 'info');
    playNotificationChime();
  };

  const handleDeleteMeetingSession = (sessionToDelete) => {
    const s = sessionToDelete || activeAttendanceSession;
    if (!s) return;
    if (!window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus acara rapat "${s.title}"? Seluruh riwayat presensi terkait akan dihapus permanen dari sistem.`)) {
      return;
    }
    if (propOnDeleteAttendanceSession) {
      propOnDeleteAttendanceSession(s.id);
    }
    const remaining = adminAttendanceSessions.filter((item) => item.id !== s.id);
    setSelectedAdminSessionId(remaining[0]?.id || '');
    addLog(`Acara rapat "${s.title}" (ID: ${s.id}) berhasil dihapus permanen`, 'warning');
    playNotificationChime();
  };

  const handleDeleteAdminRecord = (recordId, attendeeName) => {
    if (!window.confirm(`Hapus catatan kehadiran "${attendeeName || 'Pengurus'}" dari agenda rapat ini?`)) {
      return;
    }
    if (propOnDeleteAttendanceRecord) {
      propOnDeleteAttendanceRecord(recordId);
    }
    addLog(`Catatan kehadiran "${attendeeName || 'Pengurus'}" berhasil dihapus`, 'warning');
    playNotificationChime();
  };

  const [copiedAdminQrLink, setCopiedAdminQrLink] = useState(false);
  const handleCopyAdminQrLink = (sessionToCopy) => {
    const s = sessionToCopy || activeAttendanceSession;
    if (!s) return;
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?presensi=${s.id}&token=${s.qrToken}`
      : `https://teradesk.politeknikdewantara.ac.id/?presensi=${s.id}&token=${s.qrToken}`;
    navigator.clipboard.writeText(url);
    setCopiedAdminQrLink(true);
    playNotificationChime();
    setTimeout(() => setCopiedAdminQrLink(false), 3000);
  };

  const handleExportAdminAttendanceXlsx = () => {
    const rows = adminAttendanceList.map((item, idx) => ({
      No: idx + 1,
      'ID Presensi': item.id,
      'Nama Pengurus': item.name,
      NIM: item.nim || '-',
      Divisi: item.division,
      Jabatan: item.role,
      'Waktu Presensi (WITA)': item.time,
      'Status': item.status,
      'Metode': item.method || 'Manual',
      'Catatan': item.note || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 24 },
      { wch: 14 },
      { wch: 28 },
      { wch: 16 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 32 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Presensi');
    XLSX.writeFile(wb, `Rekap_Presensi_Admin_${new Date().toISOString().slice(0, 10)}.xlsx`);
    addLog('Ekspor rekap data presensi ke Excel (.xlsx) berhasil diunduh', 'info');
  };

  // Form State for Adding Student
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [formNim, setFormNim] = useState('');
  const [formName, setFormName] = useState('');
  const [formDivision, setFormDivision] = useState('Divisi Kesekretariatan');
  const [formRole, setFormRole] = useState('Anggota Biasa');
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
  const [editFormRole, setEditFormRole] = useState('Anggota Biasa');
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

  // Notifications popup toggle
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Module active state toggles (simulation & persistent sync)
  const [localModuleStatuses, setLocalModuleStatuses] = useState({
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
    activity: true,
  });
  const moduleStatuses = propModuleStatuses || localModuleStatuses;

  // Mock PAR Submissions (persistent sync)
  const [localParSubmissions, setLocalParSubmissions] = useState([
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
  const parSubmissions = propParSubmissions || localParSubmissions;

  // 1. DIVISI KESEKRETARIATAN: State & Logic
  const [suratGenType, setSuratGenType] = useState('UND');
  const [suratGenDiv, setSuratGenDiv] = useState('KESEKRETARIATAN');
  const [suratGenPerihal, setSuratGenPerihal] = useState('Undangan Rapat Pleno Koordinasi');
  const [generatedSurat, setGeneratedSurat] = useState('024/TERA-UKM/UND/SEKRE/XI/2026');
  const [copiedSuratNum, setCopiedSuratNum] = useState(false);
  const [localSuratLog, setLocalSuratLog] = useState([
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
  const suratLog = propSuratLog || localSuratLog;

  // 2. DIVISI PUBLIKASI & DOKUMENTASI (PUBDOK): State & Logic
  const [localPubdokTickets, setLocalPubdokTickets] = useState(() => sortTicketsNewestFirst(initialDefaultTickets));
  const activePubdokTickets = sortTicketsNewestFirst((tickets && tickets.length > 0) ? tickets : localPubdokTickets);
  const [pubdokFilter, setPubdokFilter] = useState('Semua');
  const [formPubTitle, setFormPubTitle] = useState('');
  const [formPubDiv, setFormPubDiv] = useState('Divisi Kaderisasi');
  const [formPubCanvas, setFormPubCanvas] = useState('Feed Instagram (1:1)');
  const [formPubDeadline, setFormPubDeadline] = useState('');

  // 3. DIVISI HUMAS: State & Logic
  const [localHumasMedparts, setLocalHumasMedparts] = useState([
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
  const humasMedparts = propHumasMedparts || localHumasMedparts;

  // 4. DIVISI KADERISASI: State & Logic
  const [kaderRaporList] = useState([]);

  // Sinkronisasi data Akun Terdaftar ke tabel Rapor Kader SDM
  const combinedKaderRaporList = useMemo(() => {
    const existingNims = new Set(kaderRaporList.map((k) => k.nim));
    const registeredKader = (accounts || [])
      .filter((acc) => !existingNims.has(acc.nim))
      .map((acc) => ({
        nim: acc.nim,
        name: acc.name
          ? acc.name
              .split(' ')
              .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
              .join(' ')
          : 'Pengurus Resmi',
        division:
          acc.division === 'BPH'
            ? 'Badan Pengurus Harian (BPH)'
            : acc.division && acc.division.startsWith('Divisi')
            ? acc.division
            : `Divisi ${acc.division || 'BPH'}`,
        diksar: 'Lulus Diksar & Penugasan BPH',
        score: acc.canAccessAdmin ? 98 : 92,
        attendance: '98%',
        grade: acc.canAccessAdmin ? 'A+ (Pimpinan)' : 'A (Sangat Aktif)',
        gradeColor: acc.canAccessAdmin
          ? 'text-violet-700 bg-violet-50 border-violet-200'
          : 'text-emerald-700 bg-emerald-50 border-emerald-200',
        certStatus: 'Siap Terbit',
      }));
    return [...registeredKader, ...kaderRaporList];
  }, [accounts, kaderRaporList]);

  // 5. DIVISI KKM: State & Logic
  const [localKkmOrders, setLocalKkmOrders] = useState([
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
  const kkmOrders = propKkmOrders || localKkmOrders;

  // Activity Logs State & Filtering
  const [localLogs, setLocalLogs] = useState([]);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logFilterCategory, setLogFilterCategory] = useState('all'); // 'all' | 'login' | 'module_submit' | 'system'
  const [selectedLogMonth, setSelectedLogMonth] = useState('all'); // 'all' | '2026-11' | '2026-10' ...
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Prioritize global persistent activityLogs if available, fallback to local
  const currentLogs = useMemo(() => {
    if (activityLogs && activityLogs.length > 0) return activityLogs;
    if (localLogs && localLogs.length > 0) return localLogs;
    return [
      {
        id: 1,
        time: '14:50:12',
        date: '06 Nov 2026',
        timestamp: '14:50:12 WITA, 06 Nov 2026',
        event: 'Sistem inisialisasi database kredensial TeraDesk',
        type: 'info',
        category: 'system',
        module: 'Sistem Admin',
        actor: {
          name: 'Sistem TeraDesk',
          nim: 'SYSTEM',
          role: 'Core Engine',
          division: 'Infrastruktur',
        },
      },
    ];
  }, [activityLogs, localLogs]);

  // Daftar bulan yang tersedia dalam riwayat log aktivitas
  const availableLogMonths = useMemo(() => {
    return getAvailableLogMonths(currentLogs);
  }, [currentLogs]);

  // Log yang difilter berdasarkan bulan terpilih
  const monthLogs = useMemo(() => {
    if (selectedLogMonth === 'all') return currentLogs;
    return currentLogs.filter((log) => getLogDateInfo(log).monthKey === selectedLogMonth);
  }, [currentLogs, selectedLogMonth]);

  // --- REAL-TIME ANALYTICS CALCULATIONS FOR EXECUTIVE DASHBOARD CHARTS ---
  const realParCount = useMemo(() => {
    const base = (parSubmissions || []).length;
    const fromLogs = (currentLogs || []).filter(
      (l) =>
        (l.moduleName || '').toLowerCase().includes('par') ||
        (l.event || '').toLowerCase().includes('proposal')
    ).length;
    return Math.max(base, base + fromLogs);
  }, [parSubmissions, currentLogs]);

  const realArchiveCount = useMemo(() => {
    const base = (suratLog || []).length;
    const fromLogs = (currentLogs || []).filter(
      (l) =>
        (l.moduleName || '').toLowerCase().includes('arsip') ||
        (l.moduleName || '').toLowerCase().includes('surat') ||
        (l.event || '').toLowerCase().includes('surat')
    ).length;
    return Math.max(base, base + fromLogs);
  }, [suratLog, currentLogs]);

  const realFinanceCount = useMemo(() => {
    const base = (kkmOrders || []).length;
    const fromLogs = (currentLogs || []).filter(
      (l) =>
        (l.moduleName || '').toLowerCase().includes('kas') ||
        (l.moduleName || '').toLowerCase().includes('keuangan') ||
        (l.moduleName || '').toLowerCase().includes('kkm') ||
        (l.moduleName || '').toLowerCase().includes('anggaran')
    ).length;
    return Math.max(base, base + fromLogs);
  }, [kkmOrders, currentLogs]);

  const realAttendanceCount = useMemo(() => {
    const base = (adminAttendanceList || []).length;
    const fromLogs = (currentLogs || []).filter(
      (l) =>
        (l.moduleName || '').toLowerCase().includes('presensi') ||
        (l.moduleName || '').toLowerCase().includes('rapat')
    ).length;
    return Math.max(base, base + fromLogs);
  }, [adminAttendanceList, currentLogs]);

  const realHelpdeskCount = useMemo(() => {
    const base = (activePubdokTickets || []).length;
    const fromLogs = (currentLogs || []).filter(
      (l) =>
        (l.moduleName || '').toLowerCase().includes('helpdesk') ||
        (l.moduleName || '').toLowerCase().includes('tiket') ||
        (l.moduleName || '').toLowerCase().includes('pubdok')
    ).length;
    return Math.max(base, base + fromLogs);
  }, [activePubdokTickets, currentLogs]);

  const totalRealMutasi = useMemo(() => {
    const sum = realParCount + realArchiveCount + realFinanceCount + realAttendanceCount + realHelpdeskCount;
    return Math.max(sum, (currentLogs || []).length);
  }, [realParCount, realArchiveCount, realFinanceCount, realAttendanceCount, realHelpdeskCount, currentLogs]);

  const realRecentWeekCount = useMemo(() => {
    return Math.max(1, Math.min(totalRealMutasi, (currentLogs || []).length));
  }, [totalRealMutasi, currentLogs]);

  const realGrowthPercentage = useMemo(() => {
    if (totalRealMutasi <= 0) return '0.0';
    const pct = (realRecentWeekCount / totalRealMutasi) * 100;
    return Math.min(99.9, Math.max(5.0, pct)).toFixed(1);
  }, [realRecentWeekCount, totalRealMutasi]);

  const svgRibbonData = useMemo(() => {
    const baseTotal = Math.max(1, realHelpdeskCount + realAttendanceCount + realFinanceCount + realArchiveCount + realParCount);
    const maxStackH = 88;
    const minH = 8;

    const hCol2Helpdesk = Math.max(minH, Math.round((realHelpdeskCount / baseTotal) * maxStackH));
    const hCol2Presensi = Math.max(minH, Math.round((realAttendanceCount / baseTotal) * maxStackH));
    const hCol2Kas = Math.max(minH, Math.round((realFinanceCount / baseTotal) * maxStackH));
    const hCol2Arsip = Math.max(minH, Math.round((realArchiveCount / baseTotal) * maxStackH));
    const hCol2Par = Math.max(minH, Math.round((realParCount / baseTotal) * maxStackH));

    const gap = 3;
    const yBase = 204;

    const y2Par = yBase - hCol2Par;
    const y2Arsip = y2Par - gap - hCol2Arsip;
    const y2Kas = y2Arsip - gap - hCol2Kas;
    const y2Presensi = y2Kas - gap - hCol2Presensi;
    const y2Helpdesk = y2Presensi - gap - hCol2Helpdesk;
    const col2TotalHits = totalRealMutasi;

    const ratioCol1 = 0.74;
    const hCol1Helpdesk = Math.max(minH, Math.round(hCol2Helpdesk * ratioCol1));
    const hCol1Presensi = Math.max(minH, Math.round(hCol2Presensi * ratioCol1));
    const hCol1Kas = Math.max(minH, Math.round(hCol2Kas * ratioCol1));
    const hCol1Arsip = Math.max(minH, Math.round(hCol2Arsip * ratioCol1));
    const hCol1Par = Math.max(minH, Math.round(hCol2Par * ratioCol1));

    const y1Par = yBase - hCol1Par;
    const y1Arsip = y1Par - gap - hCol1Arsip;
    const y1Kas = y1Arsip - gap - hCol1Kas;
    const y1Presensi = y1Kas - gap - hCol1Presensi;
    const y1Helpdesk = y1Presensi - gap - hCol1Helpdesk;
    const col1TotalHits = Math.max(1, Math.round(totalRealMutasi * 0.74));

    const ratioCol3 = 1.34;
    const hCol3Helpdesk = Math.max(minH, Math.round(hCol2Helpdesk * ratioCol3));
    const hCol3Presensi = Math.max(minH, Math.round(hCol2Presensi * ratioCol3));
    const hCol3Kas = Math.max(minH, Math.round(hCol2Kas * ratioCol3));
    const hCol3Arsip = Math.max(minH, Math.round(hCol2Arsip * ratioCol3));
    const hCol3Par = Math.max(minH, Math.round(hCol2Par * ratioCol3));

    const y3Par = yBase - hCol3Par;
    const y3Arsip = y3Par - gap - hCol3Arsip;
    const y3Kas = y3Arsip - gap - hCol3Kas;
    const y3Presensi = y3Kas - gap - hCol3Presensi;
    const y3Helpdesk = y3Presensi - gap - hCol3Helpdesk;
    const col3TotalHits = Math.max(1, Math.round(totalRealMutasi * 1.35));

    const getRibbonPath = (x1, y1, h1, x2, y2, h2) => {
      const cx1 = x1 + (x2 - x1) * 0.5;
      const cx2 = x1 + (x2 - x1) * 0.5;
      return `M ${x1},${y1} C ${cx1},${y1} ${cx2},${y2} ${x2},${y2} L ${x2},${y2 + h2} C ${cx2},${y2 + h2} ${cx1},${y1 + h1} ${x1},${y1 + h1} Z`;
    };

    const x1Right = 132;
    const x2Left = 240;
    const x2Right = 290;
    const x3Left = 398;

    return {
      col1: {
        totalHits: col1TotalHits,
        labelY: y1Helpdesk - 10,
        helpdesk: { y: y1Helpdesk, h: hCol1Helpdesk },
        presensi: { y: y1Presensi, h: hCol1Presensi },
        kas: { y: y1Kas, h: hCol1Kas },
        arsip: { y: y1Arsip, h: hCol1Arsip },
        par: { y: y1Par, h: hCol1Par },
      },
      col2: {
        totalHits: col2TotalHits,
        labelY: y2Helpdesk - 10,
        helpdesk: { y: y2Helpdesk, h: hCol2Helpdesk },
        presensi: { y: y2Presensi, h: hCol2Presensi },
        kas: { y: y2Kas, h: hCol2Kas },
        arsip: { y: y2Arsip, h: hCol2Arsip },
        par: { y: y2Par, h: hCol2Par },
      },
      col3: {
        totalHits: col3TotalHits,
        labelY: y3Helpdesk - 10,
        helpdesk: { y: y3Helpdesk, h: hCol3Helpdesk },
        presensi: { y: y3Presensi, h: hCol3Presensi },
        kas: { y: y3Kas, h: hCol3Kas },
        arsip: { y: y3Arsip, h: hCol3Arsip },
        par: { y: y3Par, h: hCol3Par },
      },
      ribbons12: {
        helpdesk: getRibbonPath(x1Right, y1Helpdesk, hCol1Helpdesk, x2Left, y2Helpdesk, hCol2Helpdesk),
        presensi: getRibbonPath(x1Right, y1Presensi, hCol1Presensi, x2Left, y2Presensi, hCol2Presensi),
        kas: getRibbonPath(x1Right, y1Kas, hCol1Kas, x2Left, y2Kas, hCol2Kas),
        arsip: getRibbonPath(x1Right, y1Arsip, hCol1Arsip, x2Left, y2Arsip, hCol2Arsip),
        par: getRibbonPath(x1Right, y1Par, hCol1Par, x2Left, y2Par, hCol2Par),
      },
      ribbons23: {
        helpdesk: getRibbonPath(x2Right, y2Helpdesk, hCol2Helpdesk, x3Left, y3Helpdesk, hCol3Helpdesk),
        presensi: getRibbonPath(x2Right, y2Presensi, hCol2Presensi, x3Left, y3Presensi, hCol3Presensi),
        kas: getRibbonPath(x2Right, y2Kas, hCol2Kas, x3Left, y3Kas, hCol3Kas),
        arsip: getRibbonPath(x2Right, y2Arsip, hCol2Arsip, x3Left, y3Arsip, hCol3Arsip),
        par: getRibbonPath(x2Right, y2Par, hCol2Par, x3Left, y3Par, hCol3Par),
      },
    };
  }, [realHelpdeskCount, realAttendanceCount, realFinanceCount, realArchiveCount, realParCount, totalRealMutasi]);

  const weeklyAttendanceStats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];

    const parseDayIndex = (dateStr) => {
      if (!dateStr) return -1;
      const s = String(dateStr).toLowerCase();
      if (s.includes('minggu') || s.includes('ahad')) return 0;
      if (s.includes('senin')) return 1;
      if (s.includes('selasa')) return 2;
      if (s.includes('rabu')) return 3;
      if (s.includes('kamis')) return 4;
      if (s.includes('jumat') || s.includes("jum'at")) return 5;
      if (s.includes('sabtu')) return 6;

      const monthMap = {
        januari: 0, jan: 0,
        februari: 1, feb: 1,
        maret: 2, mar: 2,
        april: 3, apr: 3,
        mei: 4,
        juni: 5, jun: 5,
        juli: 6, jul: 6,
        agustus: 7, ags: 7, agt: 7,
        september: 8, sep: 8,
        oktober: 9, okt: 9,
        november: 10, nov: 10,
        desember: 11, des: 11,
      };
      const parts = s.split(/\s+/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = monthMap[parts[1]];
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
          return new Date(year, month, day).getDay();
        }
      }
      return -1;
    };

    (adminAttendanceList || []).forEach((rec) => {
      let dayIdx = -1;
      if (rec.sessionId && adminAttendanceSessions) {
        const sess = adminAttendanceSessions.find((s) => s.id === rec.sessionId);
        if (sess?.date) {
          dayIdx = parseDayIndex(sess.date);
        }
      }
      if (dayIdx === -1 && rec.date) {
        dayIdx = parseDayIndex(rec.date);
      }
      if (dayIdx === -1 && rec.createdAt) {
        const d = new Date(rec.createdAt);
        if (!isNaN(d.getTime())) dayIdx = d.getDay();
      }
      if (dayIdx === -1) {
        if (activeAttendanceSession?.date) {
          dayIdx = parseDayIndex(activeAttendanceSession.date);
        }
      }
      if (dayIdx === -1) {
        const numId = parseInt(String(rec.id).replace(/\D/g, ''), 10) || 0;
        dayIdx = numId % 7;
      }
      counts[dayIdx] = (counts[dayIdx] || 0) + 1;
    });

    const maxCount = Math.max(...counts, 1);

    let highestDayIdx = 2; // Default to Selasa
    let currentMax = -1;
    counts.forEach((c, idx) => {
      if (c > currentMax) {
        currentMax = c;
        highestDayIdx = idx;
      }
    });

    if (currentMax === 0 && activeAttendanceSession?.date) {
      const activeIdx = parseDayIndex(activeAttendanceSession.date);
      if (activeIdx !== -1) highestDayIdx = activeIdx;
    }

    const dayLabels = [
      { id: 'min', label: 'Min', name: 'Minggu' },
      { id: 'sen', label: 'Sen', name: 'Senin' },
      { id: 'sel', label: 'Sel', name: 'Selasa' },
      { id: 'rab', label: 'Rab', name: 'Rabu' },
      { id: 'kam', label: 'Kam', name: 'Kamis' },
      { id: 'jum', label: 'Jum', name: 'Jumat' },
      { id: 'sab', label: 'Sab', name: 'Sabtu' },
    ];

    const days = dayLabels.map((d, idx) => {
      const count = counts[idx] || 0;
      const isPeak = idx === highestDayIdx;
      const heightPx = maxCount > 0 ? Math.max(16, Math.round((count / maxCount) * 144)) : 16;
      return {
        ...d,
        count,
        isPeak,
        heightPx,
      };
    });

    const tepatCount = (adminAttendanceList || []).filter((r) => r.status && r.status.includes('Tepat')).length;
    const onTimePct = (adminAttendanceList || []).length > 0
      ? Math.round((tepatCount / (adminAttendanceList || []).length) * 100)
      : 100;

    return {
      total: (adminAttendanceList || []).length,
      peakDay: dayLabels[highestDayIdx],
      peakCount: counts[highestDayIdx] || 0,
      tepatCount,
      onTimePct,
      days,
    };
  }, [adminAttendanceList, adminAttendanceSessions, activeAttendanceSession]);

  // Real-Time Division Attendance & Cadre Statistics for Executive Dashboard
  const [executiveDivisionView, setExecutiveDivisionView] = useState('attendance'); // 'attendance' | 'members'

  const executiveDivisionStats = useMemo(() => {
    const sessionMultiplier = Math.max(1, (adminAttendanceSessions || []).length);
    const totalMembers = (accounts || []).length;

    const stats = OFFICIAL_DIVISIONS.map((divName) => {
      const cfg = getDivisionConfig(divName);
      const members = (accounts || []).filter(
        (a) => normalizeDivisionName(a.division) === divName
      );
      const memberCount = members.length;
      const memberPct = totalMembers > 0 ? Math.round((memberCount / totalMembers) * 100) : 0;

      const divRecs = (adminAttendanceList || []).filter(
        (r) => normalizeDivisionName(r.division) === divName
      );

      const hadirTepat = divRecs.filter((r) => r.status && r.status.includes('Tepat')).length;
      const hadirTerlambat = divRecs.filter((r) => r.status && r.status.includes('Terlambat')).length;
      const izinSakit = divRecs.filter((r) => r.status && (r.status.includes('Izin') || r.status.includes('Sakit'))).length;
      const totalHadirDiv = hadirTepat + hadirTerlambat;

      const expectedCount = memberCount > 0 ? (memberCount * sessionMultiplier) : (totalHadirDiv > 0 ? totalHadirDiv : 1);
      const effectiveTarget = Math.max(expectedCount, totalHadirDiv);

      const ratePct = memberCount > 0 || totalHadirDiv > 0
        ? Math.min(100, Math.round((totalHadirDiv / effectiveTarget) * 100))
        : 0;

      const onTimePct = totalHadirDiv > 0
        ? Math.round((hadirTepat / totalHadirDiv) * 100)
        : 100;

      const tepatPct = Math.min(100, Math.round((hadirTepat / effectiveTarget) * 100));
      const telatPct = Math.min(100, Math.round((hadirTerlambat / effectiveTarget) * 100));
      const izinPct = Math.min(100, Math.round((izinSakit / effectiveTarget) * 100));
      const belumPct = Math.max(0, 100 - (tepatPct + telatPct + izinPct));

      return {
        name: divName,
        cfg,
        memberCount,
        memberPct,
        totalHadir: totalHadirDiv,
        hadirTepat,
        hadirTerlambat,
        izinSakit,
        effectiveTarget,
        ratePct,
        onTimePct,
        tepatPct,
        telatPct,
        izinPct,
        belumPct,
      };
    });

    const rankedByRate = [...stats].sort((a, b) => b.ratePct - a.ratePct || b.onTimePct - a.onTimePct);
    const topDivision = rankedByRate[0] || stats[0];

    const totalExpectedAll = stats.reduce((sum, d) => sum + d.effectiveTarget, 0);
    const totalHadirAll = stats.reduce((sum, d) => sum + d.totalHadir, 0);
    const overallRatePct = totalExpectedAll > 0 ? Math.round((totalHadirAll / totalExpectedAll) * 100) : 0;

    return {
      stats,
      rankedByRate,
      topDivision,
      totalMembers,
      totalHadirAll,
      overallRatePct,
    };
  }, [accounts, adminAttendanceList, adminAttendanceSessions]);

  const addLog = (event, type = 'info', extra = {}) => {
    const time = getTimestamp();
    const date = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const logItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      time,
      date,
      timestamp: `${time} WITA, ${date}`,
      event,
      type,
      category: extra.category || 'system',
      module: extra.module || 'Sistem Admin',
      actor: extra.actor || {
        name: 'Administrator (Alif Fikri)',
        nim: '23404053',
        role: 'Developer',
        division: 'BPH & Pimpinan Organisasi',
      },
      ...extra,
    };
    if (onAddActivityLog) {
      onAddActivityLog(logItem);
    } else {
      setLocalLogs((prev) => [logItem, ...prev.slice(0, 49)]);
    }
  };

  const filteredActivityLogs = useMemo(() => {
    const list = currentLogs.filter((log) => {
      // Month filter
      if (selectedLogMonth !== 'all') {
        const dateInfo = getLogDateInfo(log);
        if (dateInfo.monthKey !== selectedLogMonth) {
          return false;
        }
      }

      // Category filter
      if (logFilterCategory !== 'all' && log.category !== logFilterCategory) {
        return false;
      }

      // Search filter
      if (logSearchQuery.trim()) {
        const q = logSearchQuery.toLowerCase();
        const eventMatch = (log.event || '').toLowerCase().includes(q);
        const nameMatch = (log.actor?.name || log.userName || '').toLowerCase().includes(q);
        const nimMatch = (log.actor?.nim || log.userNim || '').toLowerCase().includes(q);
        const roleMatch = (log.actor?.role || log.userRole || '').toLowerCase().includes(q);
        const moduleMatch = (log.module || log.moduleName || '').toLowerCase().includes(q);
        const divMatch = (log.actor?.division || log.userDivision || '').toLowerCase().includes(q);
        const deviceMatch = (log.device?.summary || log.details || '').toLowerCase().includes(q);
        return eventMatch || nameMatch || nimMatch || roleMatch || moduleMatch || divMatch || deviceMatch;
      }
      return true;
    });

    // Urutkan selalu dari yang terbaru di paling atas
    return [...list].sort((a, b) => {
      const getEpoch = (item) => {
        if (item.createdAt?.toMillis) return item.createdAt.toMillis();
        if (item.createdAt) {
          const t = new Date(item.createdAt).getTime();
          if (!isNaN(t)) return t;
        }
        if (typeof item.id === 'number') return item.id;
        const numInId = String(item.id).replace(/\D/g, '').slice(0, 13);
        if (numInId.length >= 10) return parseInt(numInId, 10);
        return 0;
      };

      const epochA = getEpoch(a);
      const epochB = getEpoch(b);
      if (epochA && epochB && epochA !== epochB) return epochB - epochA;

      return 0;
    });
  }, [currentLogs, selectedLogMonth, logFilterCategory, logSearchQuery]);

  const loginCount = useMemo(() => {
    return monthLogs.filter((l) => l.category === 'login').length;
  }, [monthLogs]);

  const moduleSubmitCount = useMemo(() => {
    return monthLogs.filter((l) => l.category === 'module_submit').length;
  }, [monthLogs]);

  const systemCount = useMemo(() => {
    return monthLogs.filter((l) => l.category === 'system' || !l.category).length;
  }, [monthLogs]);

  // Ekspor JSON
  const handleExportLogsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `teradesk_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('Ekspor riwayat aktivitas log berhasil diunduh (JSON)', 'info');
  };

  // Ekspor Bulanan (.xlsx)
  const handleExportMonthlyXlsx = (monthKeyToExport = selectedLogMonth) => {
    let targetLogs = currentLogs;
    let label = 'seluruh_bulan';

    if (monthKeyToExport !== 'all') {
      targetLogs = currentLogs.filter((l) => getLogDateInfo(l).monthKey === monthKeyToExport);
      const foundMonth = availableLogMonths.find((m) => m.key === monthKeyToExport);
      label = foundMonth ? foundMonth.label.toLowerCase().replace(/\s+/g, '_') : monthKeyToExport;
    } else {
      const currentMonthInfo = getLogDateInfo({ createdAt: new Date() });
      targetLogs = currentLogs.filter((l) => getLogDateInfo(l).monthKey === currentMonthInfo.monthKey);
      label = currentMonthInfo.monthLabel.toLowerCase().replace(/\s+/g, '_');
    }

    exportLogsToXLSX(
      targetLogs,
      `teradesk_log_aktivitas_${label}.xlsx`,
      `Log ${label}`
    );
    addLog(`Ekspor log bulanan (${label}) berhasil diunduh (.xlsx)`, 'info');
    setIsExportMenuOpen(false);
  };

  // Ekspor Tahunan (.xlsx)
  const handleExportYearlyXlsx = (yearToExport = 2026) => {
    const targetLogs = currentLogs.filter((l) => getLogDateInfo(l).year === Number(yearToExport));
    exportLogsToXLSX(
      targetLogs.length > 0 ? targetLogs : currentLogs,
      `teradesk_log_aktivitas_tahunan_${yearToExport}.xlsx`,
      `Log Tahun ${yearToExport}`
    );
    addLog(`Ekspor log tahunan (${yearToExport}) berhasil diunduh (.xlsx)`, 'info');
    setIsExportMenuOpen(false);
  };

  // Ekspor Seluruh Log (.xlsx)
  const handleExportAllXlsx = () => {
    exportLogsToXLSX(
      currentLogs,
      `teradesk_log_aktivitas_keseluruhan_${new Date().toISOString().slice(0, 10)}.xlsx`,
      'Semua Log'
    );
    addLog('Ekspor seluruh log aktivitas berhasil diunduh (.xlsx)', 'info');
    setIsExportMenuOpen(false);
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
    if (propOnAddSuratLog) {
      propOnAddSuratLog(newEntry);
    } else {
      setLocalSuratLog([newEntry, ...suratLog]);
      addLog(`Penerbitan nomor surat resmi baru: ${newNum}`, 'success');
    }
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

    const now = new Date();
    const newTicket = {
      id: `PUB-2026-${Date.now().toString().slice(-4)}`,
      title: formPubTitle.trim(),
      division: formPubDiv,
      requester: formPubDiv,
      category: formPubCanvas,
      canvas: formPubCanvas,
      deadline: formPubDeadline || '15 Nov 2026',
      targetDate: formPubDeadline || '15 Nov 2026',
      status: 'Antrean',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      designer: 'Antrean Pubdok',
      assignedTo: 'Antrean Pubdok',
      brief: 'Kebutuhan visual internal diajukan melalui Admin Console Pubdok.',
      createdAt: now.toISOString(),
      createdTimestamp: Date.now(),
    };

    if (onAddTicket) {
      onAddTicket(newTicket);
    } else {
      setLocalPubdokTickets((prev) => sortTicketsNewestFirst([newTicket, ...prev]));
    }
    setFormPubTitle('');
    addLog(`Tiket request desain baru dibuat: ${newTicket.id} (${newTicket.title})`, 'info');
  };

  const handleToggleTicketStatus = (ticketId, nextStatus) => {
    const statusMap = {
      'Antrean': 'bg-blue-50 text-blue-700 border-blue-200',
      'Diajukan': 'bg-amber-50 text-amber-700 border-amber-200',
      'Dikerjakan': 'bg-amber-50 text-amber-700 border-amber-200',
      'Sedang Dikerjakan': 'bg-amber-50 text-amber-700 border-amber-200',
      'Selesai': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(ticketId, nextStatus, statusMap[nextStatus]);
    } else {
      setLocalPubdokTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: nextStatus, statusColor: statusMap[nextStatus] || t.statusColor }
            : t
        )
      );
    }
    addLog(`Update status tiket desain ${ticketId} ➔ ${nextStatus}`, 'success');
  };

  // Divisi Humas handlers
  const handleApproveMedpart = (medpartId) => {
    if (propOnApproveMedpart) {
      propOnApproveMedpart(medpartId);
    } else {
      setLocalHumasMedparts(
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
    }
  };

  const handleRejectMedpart = (medpartId) => {
    if (propOnRejectMedpart) {
      propOnRejectMedpart(medpartId);
    } else {
      setLocalHumasMedparts(
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
    }
  };

  // Divisi KKM handlers
  const handleSetKkmLunas = (orderId) => {
    if (propOnSetKkmLunas) {
      propOnSetKkmLunas(orderId);
    } else {
      setLocalKkmOrders(
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
    }
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
    const isAlif = isAccountAlifFikri(acc.nim, acc.name);
    setEditingTargetNim(acc.nim);
    setEditFormNim(acc.nim);
    setEditFormName(acc.name || '');
    setEditFormDivision(normalizeDivisionName(acc.division) || 'Divisi Kesekretariatan');
    setEditFormRole(isAlif ? 'Developer' : (acc.role || 'Anggota Aktif'));
    setEditFormPassword(acc.password || '');
    setEditFormCanAccessAdmin(acc.canAccessAdmin ?? (isAlif || acc.isDefault));
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
    const isAlif = isAccountAlifFikri(cleanNim, cleanName);
    const cleanRole = isAlif ? 'Developer' : editFormRole.trim();
    const cleanDivision = normalizeDivisionName(editFormDivision);

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
    const finalCanAccessAdmin = isAlif || cleanNim === '23404053' ? true : Boolean(editFormCanAccessAdmin);

    const updatedAccount = {
      nim: cleanNim,
      name: cleanName,
      division: cleanDivision,
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

  const isAccountAlifFikri = (nim, name) => {
    return nim === '23404053' || Boolean(name && name.toLowerCase().includes('alif fikri'));
  };

  const handleDelete = (nim, name) => {
    if (isAccountAlifFikri(nim, name)) {
      alert('Akun pengembang Alif Fikri Haykal diproteksi dan tidak dapat dihapus.');
      return;
    }
    if (window.confirm(`Hapus akun mahasiswa ${name} (${nim}) dari database?`)) {
      onDeleteAccount(nim);
      addLog(`Akun mahasiswa dihapus: ${name} (${nim})`, 'warning');
      setSelectedRows((prev) => prev.filter((id) => id !== nim));
    }
  };

  const handleDeleteSelected = () => {
    const validSelection = selectedRows.filter((nim) => nim !== '23404053');
    if (validSelection.length === 0) {
      alert('Akun Alif Fikri Haykal diproteksi dan tidak dapat dihapus.');
      setSelectedRows([]);
      return;
    }
    if (window.confirm(`Hapus ${validSelection.length} akun mahasiswa yang dipilih?`)) {
      if (onDeleteBatchAccounts) {
        onDeleteBatchAccounts(validSelection);
      } else {
        validSelection.forEach((nim) => onDeleteAccount(nim));
      }
      addLog(`${validSelection.length} akun mahasiswa dihapus massal`, 'warning');
      setSelectedRows([]);
    }
  };

  const handleSelectAll = () => {
    const selectableAccounts = filteredAccounts.filter((acc) => acc && !isAccountAlifFikri(acc.nim, acc.name));
    if (selectableAccounts.length === 0) return;
    if (selectedRows.length === selectableAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(selectableAccounts.map((acc) => acc.nim));
    }
  };

  const handleToggleSelectRow = (nim) => {
    if (nim === '23404053') return;
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

  // State & Handlers for Batch Import Accounts (Script, CSV, & Excel)
  const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false);
  const [batchImportTab, setBatchImportTab] = useState('script'); // 'script' | 'file'
  const [batchRawScript, setBatchRawScript] = useState('');
  const [batchFileName, setBatchFileName] = useState('');
  const [batchImportError, setBatchImportError] = useState('');
  const [batchImportSuccess, setBatchImportSuccess] = useState('');
  const [isImportingBatch, setIsImportingBatch] = useState(false);

  // Parser: Supports JSON Array, CSV/Tab lines, and normalized object maps
  const parseBatchAccounts = (rawText, existingAccounts) => {
    if (!rawText || !rawText.trim()) return { valid: [], duplicates: [], invalid: [] };
    const trimmed = rawText.trim();
    const existingNimSet = new Set((existingAccounts || []).map((a) => String(a.nim).trim()));
    const seenNewNims = new Set();
    const valid = [];
    const duplicates = [];
    const invalid = [];

    // 1. Coba parse sebagai format JSON array
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        let parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed)) {
          parsed = [parsed];
        }
        parsed.forEach((item, index) => {
          const rawNim = String(item.nim || item.NIM || item.Nim || '').trim();
          const rawName = String(item.name || item.nama || item.Nama || item.fullname || '').trim();
          if (!rawNim || !rawName) {
            invalid.push({ index: index + 1, data: item, reason: 'NIM dan Nama wajib diisi' });
            return;
          }
          if (existingNimSet.has(rawNim) || seenNewNims.has(rawNim)) {
            duplicates.push({ index: index + 1, nim: rawNim, name: rawName, reason: 'NIM sudah terdaftar di sistem' });
            return;
          }
          seenNewNims.add(rawNim);
          const normalizedRole = normalizeRoleName(item.role || item.jabatan || 'Anggota Biasa');
          const hasAdminExplicit = item.canAccessAdmin !== undefined || item.isAdmin !== undefined;
          const canAccessAdmin = hasAdminExplicit
            ? Boolean(item.canAccessAdmin ?? item.isAdmin)
            : (normalizedRole === 'Koordinator Divisi' || normalizedRole.includes('BPH') || normalizedRole.includes('Demisioner'));

          valid.push({
            nim: rawNim,
            name: rawName,
            division: normalizeDivisionName(item.division || item.divisi || 'Divisi Kesekretariatan'),
            role: normalizedRole,
            password: String(item.password || 'password123'),
            canAccessAdmin,
            createdAt: item.createdAt || getDateStamp(),
            isDefault: false,
          });
        });
        return { valid, duplicates, invalid };
      } catch {
        // Lanjutkan ke parser baris CSV/teks jika bukan JSON valid
      }
    }

    // 2. Parse sebagai format baris teks (CSV / TSV / Delimited)
    const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      if (index === 0 && (lowerLine.includes('nim') || lowerLine.includes('nama'))) {
        return;
      }

      let delimiter = ',';
      if (line.includes('\t')) delimiter = '\t';
      else if (line.includes(';')) delimiter = ';';

      const parts = line.split(delimiter).map((p) => p.trim());
      if (parts.length < 2) {
        invalid.push({ index: index + 1, line, reason: 'Baris minimal harus berisi NIM dan Nama' });
        return;
      }

      const rawNim = parts[0].replace(/^["']|["']$/g, '').trim();
      const rawName = parts[1].replace(/^["']|["']$/g, '').trim();
      const rawDiv = parts[2] ? parts[2].replace(/^["']|["']$/g, '').trim() : 'Divisi Kesekretariatan';
      const rawRole = parts[3] ? parts[3].replace(/^["']|["']$/g, '').trim() : 'Anggota Biasa';
      const rawPass = parts[4] ? parts[4].replace(/^["']|["']$/g, '').trim() : 'password123';
      const rawAdmin = parts[5] ? (parts[5].toLowerCase().includes('true') || parts[5] === '1' || parts[5].toLowerCase().includes('ya')) : null;

      if (!rawNim || !rawName) {
        invalid.push({ index: index + 1, line, reason: 'NIM atau Nama kosong' });
        return;
      }

      if (existingNimSet.has(rawNim) || seenNewNims.has(rawNim)) {
        duplicates.push({ index: index + 1, nim: rawNim, name: rawName, reason: 'NIM sudah terdaftar' });
        return;
      }

      seenNewNims.add(rawNim);
      const normalizedRole = normalizeRoleName(rawRole);
      const canAccessAdmin = rawAdmin !== null
        ? Boolean(rawAdmin)
        : (normalizedRole === 'Koordinator Divisi' || normalizedRole.includes('BPH') || normalizedRole.includes('Demisioner'));

      valid.push({
        nim: rawNim,
        name: rawName,
        division: normalizeDivisionName(rawDiv),
        role: normalizedRole,
        password: rawPass || 'password123',
        canAccessAdmin,
        createdAt: getDateStamp(),
        isDefault: false,
      });
    });

    return { valid, duplicates, invalid };
  };

  const batchParseResult = useMemo(() => {
    return parseBatchAccounts(batchRawScript, accounts);
  }, [batchRawScript, accounts]);

  const handleFillSampleJson = () => {
    const sample = [
      {
        nim: '23404060',
        name: 'Rian Pratama',
        division: 'Divisi Kesekretariatan',
        role: 'Koordinator Divisi (Kadiv)',
        password: 'password123',
        canAccessAdmin: true,
      },
      {
        nim: '23404061',
        name: 'Nabila Az-Zahra',
        division: 'Divisi Publikasi dan Dokumentasi',
        role: 'Anggota Biasa / Staf',
        password: 'password123',
        canAccessAdmin: false,
      },
      {
        nim: '23404062',
        name: 'Muhammad Fadhil',
        division: 'Divisi Humas',
        role: 'BPH (Badan Pengurus Harian)',
        password: 'password123',
        canAccessAdmin: true,
      },
      {
        nim: '23404063',
        name: 'Alif Fikri Haykal',
        division: 'BPH (Badan Pengurus Harian)',
        role: 'Developer',
        password: 'password123',
        canAccessAdmin: true,
      },
    ];
    setBatchRawScript(JSON.stringify(sample, null, 2));
    setBatchImportError('');
  };

  const handleFillSampleCsv = () => {
    const sample = `NIM, Nama, Divisi, Jabatan, Password, AksesAdmin
23404060, Rian Pratama, Divisi Kesekretariatan, Koordinator Divisi (Kadiv), password123, true
23404061, Nabila Az-Zahra, Divisi Publikasi dan Dokumentasi, Anggota Biasa / Staf, password123, false
23404062, Muhammad Fadhil, Divisi Humas, BPH (Badan Pengurus Harian), password123, true
23404063, Alif Fikri Haykal, BPH (Badan Pengurus Harian), Developer, password123, true`;
    setBatchRawScript(sample);
    setBatchImportError('');
  };

  const handleDownloadExcelTemplate = () => {
    const templateData = [
      {
        NIM: '23404060',
        Nama: 'Rian Pratama',
        Divisi: 'Divisi Kesekretariatan',
        Jabatan: 'Koordinator Divisi (Kadiv)',
        Password: 'password123',
        'Akses Admin': 'Ya',
      },
      {
        NIM: '23404061',
        Nama: 'Nabila Az-Zahra',
        Divisi: 'Divisi Publikasi dan Dokumentasi',
        Jabatan: 'Anggota Biasa / Staf',
        Password: 'password123',
        'Akses Admin': 'Tidak',
      },
      {
        NIM: '23404062',
        Nama: 'Muhammad Fadhil',
        Divisi: 'Divisi Humas',
        Jabatan: 'BPH (Badan Pengurus Harian)',
        Password: 'password123',
        'Akses Admin': 'Ya',
      },
      {
        NIM: '23404063',
        Nama: 'Alif Fikri Haykal',
        Divisi: 'BPH (Badan Pengurus Harian)',
        Jabatan: 'Developer',
        Password: 'password123',
        'Akses Admin': 'Ya',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Akun');
    XLSX.writeFile(wb, 'Template_Import_Akun_TeraDesk.xlsx');
    playNotificationChime(0.5);
  };

  const handleBatchFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBatchFileName(file.name);
    setBatchImportError('');

    const reader = new FileReader();
    if (file.name.endsWith('.json')) {
      reader.onload = (evt) => {
        try {
          const content = evt.target.result;
          setBatchRawScript(content);
        } catch {
          setBatchImportError('Gagal membaca file JSON.');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!Array.isArray(jsonRows) || jsonRows.length === 0) {
            setBatchImportError('File spreadsheet kosong atau format worksheet tidak terbaca.');
            return;
          }

          const normalized = jsonRows.map((row) => {
            const normalizedRole = normalizeRoleName(row.Jabatan || row.jabatan || row.Role || row.role || 'Anggota Biasa');
            const rawAdminVal = row['Akses Admin'] ?? row.canAccessAdmin ?? row.isAdmin;
            const hasAdminExplicit = rawAdminVal !== undefined && rawAdminVal !== '';
            const canAdmin = hasAdminExplicit
              ? (String(rawAdminVal).toLowerCase().includes('true') || String(rawAdminVal).toLowerCase().includes('ya') || String(rawAdminVal).toLowerCase().includes('1') || String(rawAdminVal).toLowerCase().includes('admin'))
              : (normalizedRole === 'Koordinator Divisi' || normalizedRole.includes('BPH') || normalizedRole.includes('Demisioner'));

            return {
              nim: String(row.NIM || row.nim || row.Nim || row['Nomor Induk Mahasiswa'] || '').trim(),
              name: String(row.Nama || row.nama || row.Name || row['Nama Lengkap'] || '').trim(),
              division: String(row.Divisi || row.divisi || row.Division || 'Divisi Kesekretariatan').trim(),
              role: normalizedRole,
              password: String(row.Password || row.password || row['Kata Sandi'] || 'password123').trim(),
              canAccessAdmin: canAdmin,
            };
          });

          setBatchRawScript(JSON.stringify(normalized, null, 2));
        } catch (err) {
          console.error('Error parsing excel:', err);
          setBatchImportError('Gagal memproses file spreadsheet. Pastikan format file sesuai.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExecuteBatchImport = () => {
    if (batchParseResult.valid.length === 0) {
      setBatchImportError('Tidak ada akun valid yang dapat diimpor.');
      return;
    }

    setIsImportingBatch(true);
    try {
      if (onAddBatchAccounts) {
        onAddBatchAccounts(batchParseResult.valid);
      } else {
        batchParseResult.valid.forEach((acc) => onAddAccount(acc));
      }

      addLog(`Import Massal: ${batchParseResult.valid.length} akun mahasiswa berhasil ditambahkan`, 'success', {
        module: 'Manajemen Akun',
        category: 'accounts',
      });

      playNotificationChime(0.5);
      setBatchImportSuccess(`Berhasil mengimpor ${batchParseResult.valid.length} akun mahasiswa!`);

      setTimeout(() => {
        setIsBatchImportModalOpen(false);
        setBatchRawScript('');
        setBatchFileName('');
        setBatchImportSuccess('');
        setBatchImportError('');
        setIsImportingBatch(false);
      }, 1500);
    } catch (err) {
      console.error('Error importing batch:', err);
      setBatchImportError('Terjadi kesalahan saat memproses impor data.');
      setIsImportingBatch(false);
    }
  };

  // Proker Management Handlers
  const handleOpenAddProker = () => {
    setProkerModalMode('add');
    setProkerFormId('proker-' + Date.now());
    setProkerFormBadge('Update Program Kerja');
    setProkerFormTag('update terakhir');
    setProkerFormTitle('');
    setProkerFormActionText('cek asesmen program kerja');
    setProkerFormServiceId('par');
    setProkerFormDivision('Divisi Publikasi dan Dokumentasi');
    setProkerFormPeriod('Maret 2026');
    setProkerFormStatus('Aktif');
    setProkerFormIsVisible(true);
    setProkerFormError('');
    setProkerFormSuccess('');
    setIsProkerModalOpen(true);
  };

  const handleOpenEditProker = (item) => {
    setProkerModalMode('edit');
    setProkerFormId(item.id);
    setProkerFormBadge(item.badge || 'Update Program Kerja');
    setProkerFormTag(item.tag || 'update terakhir');
    setProkerFormTitle(item.title || '');
    setProkerFormActionText(item.actionText || 'cek asesmen program kerja');
    setProkerFormServiceId(item.actionServiceId || 'par');
    setProkerFormDivision(item.division || 'Divisi Kesekretariatan');
    setProkerFormPeriod(item.period || 'Periode 2026');
    setProkerFormStatus(item.status || 'Aktif');
    setProkerFormIsVisible(item.isVisible !== false);
    setProkerFormError('');
    setProkerFormSuccess('');
    setIsProkerModalOpen(true);
  };

  const handleSaveProker = (e) => {
    e.preventDefault();
    if (!prokerFormTitle.trim()) {
      setProkerFormError('Judul kegiatan program kerja tidak boleh kosong.');
      return;
    }

    const payload = {
      id: prokerFormId || ('proker-' + Date.now()),
      badge: prokerFormBadge.trim() || 'Update Program Kerja',
      tag: prokerFormTag.trim() || 'update terakhir',
      title: prokerFormTitle.trim(),
      actionText: prokerFormActionText.trim() || 'cek asesmen program kerja',
      actionServiceId: prokerFormServiceId || 'par',
      division: prokerFormDivision,
      period: prokerFormPeriod.trim() || 'Periode 2026',
      status: prokerFormStatus,
      isVisible: prokerFormIsVisible,
    };

    if (prokerModalMode === 'add') {
      if (onAddProker) {
        onAddProker(payload);
      }
      addLog(`Program kerja baru ditambahkan: "${payload.title.slice(0, 30)}..."`, 'success');
      setProkerFormSuccess('Program kerja berhasil ditambahkan ke landing page!');
    } else {
      if (onUpdateProker) {
        onUpdateProker(prokerFormId, payload);
      }
      addLog(`Program kerja diperbarui: "${payload.title.slice(0, 30)}..."`, 'info');
      setProkerFormSuccess('Program kerja berhasil diperbarui!');
    }

    setTimeout(() => {
      setProkerFormSuccess('');
      setIsProkerModalOpen(false);
    }, 900);
  };

  const handleDeleteProkerItem = (id, title) => {
    if (window.confirm(`Hapus program kerja "${title}" dari landing page?`)) {
      if (onDeleteProker) {
        onDeleteProker(id);
      }
      addLog(`Program kerja dihapus: "${title.slice(0, 30)}..."`, 'warning');
    }
  };

  const handleMoveProkerItem = (index, direction) => {
    if (!onReorderProker) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= prokerList.length) return;
    const updated = [...prokerList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onReorderProker(updated);
    addLog(`Urutan proker diubah (posisi #${index + 1} ke #${targetIndex + 1})`, 'info');
  };

  const handleToggleProkerVisibilityItem = (id, currentVis) => {
    if (onToggleProkerVisibility) {
      onToggleProkerVisibility(id);
      addLog(`Status visibilitas proker diubah menjadi ${!currentVis ? 'Tampil' : 'Sembunyi'}`, 'info');
    }
  };

  const toggleModuleStatus = (modId) => {
    if (propOnToggleModuleStatus) {
      propOnToggleModuleStatus(modId);
    } else {
      setLocalModuleStatuses((prev) => {
        const updated = !prev[modId];
        addLog(`Status modul ${modId.toUpperCase()} diubah menjadi ${updated ? 'AKTIF' : 'MAINTENANCE'}`, 'info');
        return { ...prev, [modId]: updated };
      });
    }
  };

  const handleApproveProposal = (id) => {
    if (propOnApproveProposal) {
      propOnApproveProposal(id);
    } else {
      setLocalParSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, status: 'Disetujui', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
            : sub
        )
      );
      addLog(`Proposal ${id} disetujui oleh Administrator Alif Fikri`, 'success');
    }
  };

  const handleSaveLeadership = (e) => {
    if (e) e.preventDefault();
    const updated = {
      pembina: {
        name: leadershipForm.pembinaName.trim() || initialDefaultLeadership.pembina.name,
        title: leadershipForm.pembinaTitle.trim() || initialDefaultLeadership.pembina.title,
        avatarUrl: leadershipForm.pembinaAvatarUrl.trim(),
      },
      ketuaUmum: {
        name: leadershipForm.ketumName.trim() || initialDefaultLeadership.ketuaUmum.name,
        title: leadershipForm.ketumTitle.trim() || initialDefaultLeadership.ketuaUmum.title,
        period: leadershipForm.ketumPeriod.trim() || initialDefaultLeadership.ketuaUmum.period,
        avatarUrl: leadershipForm.ketumAvatarUrl.trim(),
      },
    };

    if (propOnUpdateLeadershipProfiles) {
      propOnUpdateLeadershipProfiles(updated);
    }
    addLog('Kartu profil pimpinan hero landing page berhasil diperbarui', 'success', {
      category: 'system',
      module: 'Hero Landing Page',
    });
    playNotificationChime(0.5);
    setLeadershipSaveSuccess(true);
    setTimeout(() => {
      setLeadershipSaveSuccess(false);
    }, 3000);
  };

  const handleResetLeadership = () => {
    if (window.confirm('Kembalikan data kartu pimpinan di landing page ke profil awal default (M. Ishak & M. Toha)?')) {
      if (propOnUpdateLeadershipProfiles) {
        propOnUpdateLeadershipProfiles(initialDefaultLeadership);
      }
      setLeadershipForm({
        pembinaName: initialDefaultLeadership.pembina.name,
        pembinaTitle: initialDefaultLeadership.pembina.title,
        pembinaAvatarUrl: initialDefaultLeadership.pembina.avatarUrl || '',
        ketumName: initialDefaultLeadership.ketuaUmum.name,
        ketumTitle: initialDefaultLeadership.ketuaUmum.title,
        ketumPeriod: initialDefaultLeadership.ketuaUmum.period,
        ketumAvatarUrl: initialDefaultLeadership.ketuaUmum.avatarUrl || '',
      });
      addLog('Kartu pimpinan hero direset ke profil default', 'warning', {
        category: 'system',
        module: 'Hero Landing Page',
      });
      playNotificationChime(0.5);
    }
  };

  const handleLeadershipPhotoUpload = (e, fieldKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Format file harus berupa gambar (JPG, PNG, WEBP, GIF, dll.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 256;
          let w = img.width;
          let h = img.height;

          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setLeadershipForm((prev) => ({
            ...prev,
            [fieldKey]: optimizedDataUrl,
          }));
        } catch {
          setLeadershipForm((prev) => ({
            ...prev,
            [fieldKey]: loadEvent.target.result,
          }));
        }
      };
      img.onerror = () => {
        alert('Gagal memproses file gambar. Silakan coba file gambar lain.');
      };
      img.src = loadEvent.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Dynamic list of divisions combining official list with any imported accounts
  const allDivisionOptions = useMemo(() => {
    const list = ['Semua Divisi', ...OFFICIAL_DIVISIONS];
    (accounts || []).forEach((acc) => {
      if (acc && acc.division) {
        const normalized = normalizeDivisionName(acc.division);
        if (normalized && !list.includes(normalized)) {
          list.push(normalized);
        }
      }
    });
    return list;
  }, [accounts]);

  // Dynamic list of roles from current accounts
  const availableRoles = useMemo(() => {
    const set = new Set();
    (accounts || []).forEach((a) => {
      if (a && a.role && a.role.trim()) {
        const isAlif = isAccountAlifFikri(a.nim, a.name);
        set.add(isAlif ? 'Developer' : a.role.trim());
      }
    });
    return ['Semua Jabatan', ...Array.from(set)];
  }, [accounts]);

  // Filtered accounts based on search query, division, access rights, and role
  const filteredAccounts = (accounts || [])
    .map((acc) => {
      if (!acc) return acc;
      const isAlif = isAccountAlifFikri(acc.nim, acc.name);
      return {
        ...acc,
        division: normalizeDivisionName(acc.division),
        role: isAlif ? 'Developer' : acc.role,
        canAccessAdmin: isAlif ? true : acc.canAccessAdmin,
      };
    })
    .filter((acc) => {
      if (!acc) return false;
      const matchDivision =
        selectedDivision === 'Semua Divisi' ||
        acc.division === selectedDivision ||
        normalizeDivisionName(acc.division) === normalizeDivisionName(selectedDivision);
      const matchAccess =
        accessFilter === 'Semua Akses' ||
        (accessFilter === 'Bisa Akses Admin' && Boolean(acc.canAccessAdmin)) ||
        (accessFilter === 'Hanya Portal (Non-Admin)' && !acc.canAccessAdmin);
      const matchRole =
        !roleFilter || roleFilter === 'Semua Jabatan' || acc.role === roleFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (acc.nim && acc.nim.toLowerCase().includes(q)) ||
        (acc.name && acc.name.toLowerCase().includes(q)) ||
        (acc.role && acc.role.toLowerCase().includes(q)) ||
        (acc.division && acc.division.toLowerCase().includes(q));
      return matchDivision && matchAccess && matchRole && matchSearch;
    });

  // Render Sidebar Content (Shared between Desktop Aside & Mobile Drawer)
  const renderSidebarContent = (isMobile = false) => {
    const handleNav = (nav) => {
      setCurrentNav(nav);
      if (isMobile) setIsMobileSidebarOpen(false);
    };

    return (
      <div className="flex flex-col justify-between h-full min-h-full">
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
            {isMobile ? (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup Menu"
                aria-label="Tutup Menu"
              >
                <X size={18} />
              </button>
            ) : (
              <button
                onClick={onBackToLanding}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Kembali ke Beranda Landing"
              >
                <ArrowLeft size={16} />
              </button>
            )}
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
                  onClick={() => handleNav('dashboard')}
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
                  onClick={() => handleNav('students')}
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

                <button
                  onClick={() => handleNav('proker')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'proker'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark size={16} className={currentNav === 'proker' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Program Kerja (Landing)</span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    currentNav === 'proker' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {prokerList.length}
                  </span>
                </button>

                {/* Kotak Masuk Konsultasi (Inbox Kontak Landing Page) */}
                <button
                  onClick={() => handleNav('inbox')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'inbox'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Inbox size={16} className={currentNav === 'inbox' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Kotak Masuk Konsultasi</span>
                  </div>
                  {unreadConsultationsCount > 0 ? (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs animate-pulse">
                      {unreadConsultationsCount} Baru
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      currentNav === 'inbox' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {consultationMessages.length}
                    </span>
                  )}
                </button>

                {/* Pengumuman BPH (Maklumat Pop-up Anggota) */}
                <button
                  onClick={() => handleNav('announcements')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentNav === 'announcements'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Megaphone size={16} className={currentNav === 'announcements' ? 'text-blue-400' : 'text-slate-400'} />
                    <span>Pengumuman BPH</span>
                  </div>
                  {activeAnnouncementsCount > 0 ? (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                      {activeAnnouncementsCount} Tayang
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      currentNav === 'announcements' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {announcements.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* SECTION 2: TAB LAYANAN ASLI TERADESK */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                LAYANAN WORKSPACE ({availableServices.length} MODUL)
              </p>
              <div className="space-y-1">
                {availableServices.map((svc) => {
                  const Icon = svc.icon;
                  const isActive = currentNav === svc.id;

                  return (
                    <button
                      key={svc.id}
                      onClick={() => handleNav(svc.id)}
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
                  onClick={() => handleNav('session')}
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
                  onClick={() => handleNav('backup')}
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
                  onClick={() => handleNav('logs')}
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
                    {currentLogs.length}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('settings')}
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

                {/* Dark Mode Quick Switcher */}
                <button
                  type="button"
                  onClick={toggleAdminTheme}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isAdminDark
                      ? 'bg-slate-800 text-amber-400 hover:bg-slate-700/80 border border-slate-700/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isAdminDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-400" />}
                    <span>{isAdminDark ? 'Mode Gelap (Aktif)' : 'Mode Terang (Aktif)'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAdminDark ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isAdminDark ? 'Dark' : 'Light'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Zero-Trust Destroy Session Button */}
        <div className="pt-4 border-t border-slate-100 mt-6">
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
                  {authUser?.role || 'Developer'}
                </p>
              </div>
            </div>
          </div>

          {onOpenChangePassword && (
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 mb-2 shadow-2xs"
            >
              <KeyRound size={13} className="text-blue-600" />
              <span>Ganti Kata Sandi</span>
            </button>
          )}

          <button
            onClick={onForceDestroySession}
            className="w-full py-2 px-3 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 mb-2"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>

          {isMobile && (
            <button
              onClick={onBackToLanding}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 mb-2"
            >
              <ArrowLeft size={13} />
              <span>Kembali ke Beranda</span>
            </button>
          )}

          <p className="text-[10px] text-center text-slate-400 font-medium">
            © 2026 TERAMEDIA / TeraDesk
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full min-h-screen flex font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
      isAdminDark
        ? 'admin-dark-theme bg-[#070B18] text-slate-100 dark'
        : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      
      {/* 1. LEFT SIDEBAR: DESKTOP ONLY */}
      <aside className="w-64 bg-white border-r border-slate-200/80 shrink-0 hidden lg:flex flex-col justify-between p-5 min-h-screen sticky top-0 h-screen z-20 overflow-y-auto">
        {renderSidebarContent(false)}
      </aside>

      {/* 1B. MOBILE SIDEBAR DRAWER (HP & TABLET) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-out Drawer Panel */}
          <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
            {/* Hamburger Button for Mobile (HP) */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Buka Menu Navigasi"
              aria-label="Buka Menu Navigasi"
            >
              <Menu size={19} />
            </button>

            {/* Search Bar for TeraDesk (Spotlight Command Palette Trigger) */}
            <div
              onClick={() => {
                if (onOpenCommandPalette) onOpenCommandPalette();
              }}
              className="relative w-full max-w-[130px] xs:max-w-[160px] sm:max-w-xs lg:max-w-sm cursor-pointer group shrink min-w-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onOpenCommandPalette) onOpenCommandPalette();
                }
              }}
            >
              <Search size={15} className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              <input
                type="text"
                readOnly
                placeholder="Cari..."
                className="w-full pl-8 sm:pl-9 pr-2 sm:pr-14 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-800 focus:outline-hidden transition-all placeholder:text-slate-400 cursor-pointer select-none truncate"
              />
              <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-300/60 group-hover:bg-slate-200 group-hover:text-slate-700 transition-colors">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            <button
              onClick={onNavigateToPortal}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <ExternalLink size={13} />
              <span>Buka Portal Hub</span>
            </button>

            {/* Notification Bell */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-slate-400 hover:text-slate-700 p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer relative flex items-center justify-center"
                title="Notifikasi & Inbox"
              >
                <Bell size={17} />
                {unreadConsultationsCount > 0 ? (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white animate-pulse"></span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                      <p className="text-xs font-bold text-slate-900">Notifikasi & Pesan Masuk</p>
                      <div className="flex items-center gap-2">
                        {unreadConsultationsCount > 0 && (
                          <button
                            type="button"
                            onClick={onMarkAllConsultationsRead}
                            className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer"
                          >
                            Tandai Semua Dibaca
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Tutup Notifikasi"
                          aria-label="Tutup Notifikasi"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                  {/* Consultation Inflow section */}
                  {consultationMessages.length > 0 && (
                    <div className="mb-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Konsultasi Masuk ({unreadConsultationsCount} Baru)
                        </span>
                        <button
                          onClick={() => {
                            setCurrentNav('inbox');
                            setIsNotificationsOpen(false);
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Lihat Tab Inbox →
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {consultationMessages.slice(0, 2).map((m) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              if (onMarkConsultationRead) onMarkConsultationRead(m.id);
                              setSelectedMessage(m);
                              setIsNotificationsOpen(false);
                            }}
                            className={`p-2 rounded-xl text-[11px] cursor-pointer transition-colors ${
                              !m.isRead ? 'bg-blue-50/70 border border-blue-200/60' : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="font-bold text-slate-900 truncate">{m.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono shrink-0">{m.date}</span>
                            </div>
                            <p className="text-slate-600 text-[10px] line-clamp-1">{m.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Jejak Audit Sistem
                  </p>
                  <div className="space-y-1.5">
                    {currentLogs.slice(0, 3).map((l) => (
                      <div key={l.id} className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700">
                        <span className="font-mono text-[9px] text-slate-400 block">{l.time}</span>
                        {l.event}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleAdminTheme}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isAdminDark
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-2xs'
              }`}
              title={isAdminDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
              aria-label="Toggle Dark Mode"
            >
              {isAdminDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Quick Add Student Button */}
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
              title="Tambah Data Mahasiswa"
            >
              <Plus size={15} />
              <span className="hidden md:inline">Mahasiswa</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2.5 border-l border-slate-200/80 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                  {authUser?.name || 'Alif Fikri'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-none truncate max-w-[100px]">
                  {authUser?.role || 'Developer'}
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
                    Monitoring terpusat aktivitas {availableServices.length} modul digitalisasi TeraDesk TERAMEDIA.
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
                    onClick={() => setIsLeadershipModalOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 text-blue-700 shadow-xs transition-colors cursor-pointer"
                    title="Ubah Profil Kartu Pimpinan Hero Landing Page"
                  >
                    <Sparkles size={13} className="text-blue-600" />
                    <span>Edit Kartu Hero</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Download size={13} className="text-slate-400" />
                    <span>Ekspor JSON</span>
                  </button>
                </div>
              </div>

              {/* Quick Consultation Inflow Banner (End-to-End Landing Page Integration) */}
              <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-white border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Inbox size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Kotak Masuk Konsultasi (Inbox Kontak Landing)
                      </h4>
                      {unreadConsultationsCount > 0 ? (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                          {unreadConsultationsCount} Pesan Baru
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          Semua Terbaca
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {consultationMessages.length} permohonan konsultasi dari publik & ormawa telah tersinkronisasi end-to-end.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentNav('inbox')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Buka Kotak Masuk</span>
                  <ArrowRight size={13} />
                </button>
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

              {/* ROW 2: REAL TERADESK ACTIVITY CHARTS (REAL-TIME LIVE DATA) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT CARD (60%): Statistik Aktivitas Modul Organisasi (Ribbon Flow Chart) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Layers size={16} className="text-blue-500" />
                        <span>Statistik Aktivitas Modul Organisasi</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live Sync
                        </span>
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
                        {totalRealMutasi.toLocaleString('id-ID')} Mutasi Layanan
                      </span>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                        <span className="text-emerald-600 font-bold inline-flex items-center">
                          {realGrowthPercentage}% ↗
                        </span>
                        <span>+ {realRecentWeekCount} aktivitas terverifikasi real-time</span>
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
                      <path d={svgRibbonData.ribbons12.helpdesk} fill="url(#ribbonHelpdesk)" />
                      <path d={svgRibbonData.ribbons12.presensi} fill="url(#ribbonPresensi)" />
                      <path d={svgRibbonData.ribbons12.kas} fill="url(#ribbonKas)" />
                      <path d={svgRibbonData.ribbons12.arsip} fill="url(#ribbonArsip)" />
                      <path d={svgRibbonData.ribbons12.par} fill="url(#ribbonPar)" />

                      {/* Ribbons: Nov -> Des */}
                      <path d={svgRibbonData.ribbons23.helpdesk} fill="url(#ribbonHelpdesk)" />
                      <path d={svgRibbonData.ribbons23.presensi} fill="url(#ribbonPresensi)" />
                      <path d={svgRibbonData.ribbons23.kas} fill="url(#ribbonKas)" />
                      <path d={svgRibbonData.ribbons23.arsip} fill="url(#ribbonArsip)" />
                      <path d={svgRibbonData.ribbons23.par} fill="url(#ribbonPar)" />

                      {/* Column 1: Okt */}
                      <text x="107" y={svgRibbonData.col1.labelY} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                        {svgRibbonData.col1.totalHits.toLocaleString('id-ID')} Hits
                      </text>
                      <rect x="82" y={svgRibbonData.col1.helpdesk.y} width="50" height={svgRibbonData.col1.helpdesk.h} rx="4" fill="#2DD4BF" />
                      <rect x="82" y={svgRibbonData.col1.presensi.y} width="50" height={svgRibbonData.col1.presensi.h} rx="4" fill="#38BDF8" />
                      <rect x="82" y={svgRibbonData.col1.kas.y} width="50" height={svgRibbonData.col1.kas.h} rx="4" fill="#818CF8" />
                      <rect x="82" y={svgRibbonData.col1.arsip.y} width="50" height={svgRibbonData.col1.arsip.h} rx="4" fill="#6366F1" />
                      <rect x="82" y={svgRibbonData.col1.par.y} width="50" height={svgRibbonData.col1.par.h} rx="4" fill="#312E81" />
                      <text x="107" y="214" textAnchor="middle" className="text-[11px] font-medium fill-slate-400">
                        Okt
                      </text>

                      {/* Column 2: Nov (Real-Time Live) */}
                      <text x="265" y={svgRibbonData.col2.labelY} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                        {svgRibbonData.col2.totalHits.toLocaleString('id-ID')} Hits
                      </text>
                      <rect x="240" y={svgRibbonData.col2.helpdesk.y} width="50" height={svgRibbonData.col2.helpdesk.h} rx="4" fill="#2DD4BF" />
                      <rect x="240" y={svgRibbonData.col2.presensi.y} width="50" height={svgRibbonData.col2.presensi.h} rx="4" fill="#38BDF8" />
                      <rect x="240" y={svgRibbonData.col2.kas.y} width="50" height={svgRibbonData.col2.kas.h} rx="4" fill="#818CF8" />
                      <rect x="240" y={svgRibbonData.col2.arsip.y} width="50" height={svgRibbonData.col2.arsip.h} rx="4" fill="#6366F1" />
                      <rect x="240" y={svgRibbonData.col2.par.y} width="50" height={svgRibbonData.col2.par.h} rx="4" fill="#312E81" />
                      <text x="265" y="214" textAnchor="middle" className="text-[11px] font-bold fill-indigo-600">
                        Nov • Real-time
                      </text>

                      {/* Column 3: Des (Target Proyeksi) */}
                      <text x="423" y={svgRibbonData.col3.labelY} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                        {svgRibbonData.col3.totalHits.toLocaleString('id-ID')} Hits
                      </text>
                      <rect x="398" y={svgRibbonData.col3.helpdesk.y} width="50" height={svgRibbonData.col3.helpdesk.h} rx="4" fill="#2DD4BF" />
                      <rect x="398" y={svgRibbonData.col3.presensi.y} width="50" height={svgRibbonData.col3.presensi.h} rx="4" fill="#38BDF8" />
                      <rect x="398" y={svgRibbonData.col3.kas.y} width="50" height={svgRibbonData.col3.kas.h} rx="4" fill="#818CF8" />
                      <rect x="398" y={svgRibbonData.col3.arsip.y} width="50" height={svgRibbonData.col3.arsip.h} rx="4" fill="#6366F1" />
                      <rect x="398" y={svgRibbonData.col3.par.y} width="50" height={svgRibbonData.col3.par.h} rx="4" fill="#312E81" />
                      <text x="423" y="214" textAnchor="middle" className="text-[11px] font-medium fill-slate-400">
                        Des
                      </text>
                    </svg>
                  </div>

                  {/* Legend: Real Services with Live Real-Time Counts */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5" title={`${realParCount} proposal/mutasi PAR`}>
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#312E81]"></span> PAR Proposal ({realParCount})
                    </span>
                    <span className="flex items-center gap-1.5" title={`${realArchiveCount} arsip/surat terbit`}>
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]"></span> E-Arsip ({realArchiveCount})
                    </span>
                    <span className="flex items-center gap-1.5" title={`${realFinanceCount} transaksi kas/danus`}>
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#818CF8]"></span> Kas Anggaran ({realFinanceCount})
                    </span>
                    <span className="flex items-center gap-1.5" title={`${realAttendanceCount} presensi rapat`}>
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]"></span> Presensi QR ({realAttendanceCount})
                    </span>
                    <span className="flex items-center gap-1.5" title={`${realHelpdeskCount} tiket desain`}>
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#2DD4BF]"></span> Helpdesk Desain ({realHelpdeskCount})
                    </span>
                  </div>
                </div>

                {/* RIGHT CARD (40%): Kehadiran & Akses Rapat Mingguan (REAL-TIME LIVE DATA) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <ClipboardCheck size={16} className="text-purple-500" />
                        <span>Presensi & Akses Rapat Mingguan</span>
                      </div>
                      <span
                        className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 max-w-[150px] truncate"
                        title={activeAttendanceSession?.title || 'Rapat Pleno'}
                      >
                        {activeAttendanceSession?.title || 'Rapat Pleno'}
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {weeklyAttendanceStats.total.toLocaleString('id-ID')} Kehadiran
                      </span>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                        {weeklyAttendanceStats.total > 0 ? (
                          <>
                            <span className="text-emerald-600 font-bold inline-flex items-center">
                              {weeklyAttendanceStats.onTimePct}% ↗
                            </span>
                            <span>
                              {weeklyAttendanceStats.tepatCount} tepat waktu • {weeklyAttendanceStats.peakCount} hadir pada hari {weeklyAttendanceStats.peakDay.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400">
                            Belum ada kehadiran tercatat pada sesi berjalan
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* 7-Day Real-Time Bar Chart */}
                  <div className="w-full h-56 flex items-end justify-between px-2 pt-8 pb-2">
                    {weeklyAttendanceStats.days.map((day) => {
                      if (day.isPeak) {
                        return (
                          <div
                            key={day.id}
                            className="flex flex-col items-center gap-1.5 flex-1 relative group cursor-pointer"
                            title={`${day.name}: ${day.count} Pengurus Hadir`}
                          >
                            <span className="text-[10px] font-bold text-slate-800 tracking-tight">
                              {day.count}
                            </span>
                            <div
                              style={{ height: `${day.heightPx}px` }}
                              className="w-6 sm:w-7 bg-gradient-to-t from-violet-700 to-indigo-500 rounded-md shadow-sm shadow-indigo-200 transition-all duration-500 hover:brightness-110"
                            />
                            <span className="text-[11px] font-bold text-slate-900">{day.label}</span>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={day.id}
                          className="flex flex-col items-center gap-2 flex-1 group cursor-pointer"
                          title={`${day.name}: ${day.count} Pengurus Hadir`}
                        >
                          <div
                            style={{ height: `${day.heightPx}px` }}
                            className="w-6 sm:w-7 bg-slate-100 group-hover:bg-slate-200 rounded-md transition-all duration-500"
                          />
                          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600">
                            {day.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ROW 3: DIVISI DISTRIBUTION & INTEGRATED SERVICES TABLE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT CARD (40%): Statistik Kehadiran & Partisipasi per Divisi (REAL-TIME ANALYTICS) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    {/* Header with Title and Mode Switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                          <BarChart3 size={15} />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span>Statistik Kehadiran per Divisi</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Live
                            </span>
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {executiveDivisionStats.totalMembers} Kader Aktif • 6 Divisi
                          </p>
                        </div>
                      </div>

                      {/* View Switch: Kehadiran vs Komposisi Kader */}
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setExecutiveDivisionView('attendance')}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            executiveDivisionView === 'attendance'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Kehadiran
                        </button>
                        <button
                          type="button"
                          onClick={() => setExecutiveDivisionView('members')}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            executiveDivisionView === 'members'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Kader
                        </button>
                      </div>
                    </div>

                    {/* Top Executive Summary Pill / Banner */}
                    {executiveDivisionView === 'attendance' ? (
                      <div className="mb-4 bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 p-3 rounded-xl border border-purple-100/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Trophy size={13} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                              Divisi Terdisiplin
                            </span>
                            <span className="text-xs font-extrabold text-slate-800 truncate block">
                              {executiveDivisionStats.topDivision?.cfg.shortName || 'BPH'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200">
                            {executiveDivisionStats.topDivision?.ratePct || 0}% Hadir
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                            {executiveDivisionStats.topDivision?.onTimePct || 0}% Tepat
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 bg-gradient-to-r from-blue-50/80 via-slate-50 to-white p-3 rounded-xl border border-blue-100/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Users size={13} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                              Total Pengurus Terdaftar
                            </span>
                            <span className="text-xs font-extrabold text-slate-800 truncate block">
                              {executiveDivisionStats.totalMembers} Mahasiswa
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentNav('students')}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Kelola SDM</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    )}

                    {/* Chart Body: Ranked Horizontal Bars */}
                    {executiveDivisionView === 'attendance' ? (
                      <div className="space-y-3">
                        {executiveDivisionStats.rankedByRate.map((d) => (
                          <div key={d.name} className="group">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md border ${d.cfg.badgeColor}`}>
                                  {d.cfg.shortName}
                                </span>
                                <span className="text-xs font-medium text-slate-700 truncate max-w-[150px] sm:max-w-[180px]" title={d.name}>
                                  {d.name.replace(/Divisi\s*/, '')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-black text-slate-900">
                                  {d.ratePct}%
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                                  ({d.totalHadir}/{d.effectiveTarget})
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${
                                    d.ratePct >= 80
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : d.ratePct >= 50
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                >
                                  {d.ratePct >= 80 ? 'Prima' : d.ratePct >= 50 ? 'Cukup' : 'Rendah'}
                                </span>
                              </div>
                            </div>

                            {/* Stacked Progress Bar */}
                            <div
                              className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex shadow-inner cursor-pointer"
                              title={`${d.name}: Tepat ${d.hadirTepat}, Terlambat ${d.hadirTerlambat}, Izin/Sakit ${d.izinSakit}, Target ${d.effectiveTarget}`}
                            >
                              {d.tepatPct > 0 && (
                                <div
                                  style={{ width: `${d.tepatPct}%` }}
                                  className="bg-emerald-500 h-full transition-all duration-500 hover:opacity-90"
                                />
                              )}
                              {d.telatPct > 0 && (
                                <div
                                  style={{ width: `${d.telatPct}%` }}
                                  className="bg-amber-400 h-full transition-all duration-500 hover:opacity-90"
                                />
                              )}
                              {d.izinPct > 0 && (
                                <div
                                  style={{ width: `${d.izinPct}%` }}
                                  className="bg-purple-400 h-full transition-all duration-500 hover:opacity-90"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {executiveDivisionStats.stats.map((d) => (
                          <div key={d.name} className="group">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md border ${d.cfg.badgeColor}`}>
                                  {d.cfg.shortName}
                                </span>
                                <span className="text-xs font-medium text-slate-700 truncate max-w-[150px] sm:max-w-[180px]" title={d.name}>
                                  {d.name.replace(/Divisi\s*/, '')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-black text-slate-900">
                                  {d.memberCount} Kader
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({d.memberPct}%)
                                </span>
                              </div>
                            </div>

                            {/* Member Progress Bar */}
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                              <div
                                style={{ width: `${d.memberPct}%` }}
                                className={`h-full transition-all duration-500 ${d.cfg.barColor}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Legend & Action */}
                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    {executiveDivisionView === 'attendance' ? (
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tepat
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Terlambat
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-400"></span> Izin
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">Proporsi kader aktif berdasarkan database SDM</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentNav('attendance')}
                      className="font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Lihat Rincian</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>

                {/* RIGHT CARD (60%): Daftar Layanan Workspace Terintegrasi */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Boxes size={16} className="text-blue-500" />
                        <span>Status {availableServices.length} Modul Layanan Terintegrasi</span>
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

              {/* ROW 4: RECENT CONSULTATION INBOX TABLE (EXECUTIVE DASHBOARD VIEW) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Inbox size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          Kotak Masuk Konsultasi Terbaru (Inflow Landing Page)
                        </h3>
                        {unreadConsultationsCount > 0 ? (
                          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                            {unreadConsultationsCount} Pesan Baru
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                            Semua Terbaca
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Pesan dan permohonan kemitraan yang dikirim oleh pengunjung melalui form Kontak Kami.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentNav('inbox')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <span>Buka Semua di Tab Inbox</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3">PENGIRIM & ORGANISASI</th>
                        <th className="py-2.5 px-3">WAKTU MASUK</th>
                        <th className="py-2.5 px-3">ISI PESAN</th>
                        <th className="py-2.5 px-3 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {consultationMessages.slice(0, 5).map((msg) => (
                        <tr
                          key={msg.id}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            !msg.isRead ? 'bg-blue-50/25' : ''
                          }`}
                          onClick={() => {
                            if (onMarkConsultationRead) onMarkConsultationRead(msg.id);
                            setSelectedMessage(msg);
                          }}
                        >
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                msg.status === 'Baru'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : msg.status === 'Diproses'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {msg.status}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{msg.name}</div>
                            <div className="text-[11px] text-slate-500">{msg.organization}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {msg.date}
                          </td>
                          <td className="py-3 px-3 max-w-sm">
                            <p className="text-slate-600 line-clamp-1">{msg.message}</p>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                if (onMarkConsultationRead) onMarkConsultationRead(msg.id);
                                setSelectedMessage(msg);
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Detail
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
                  <p className="text-xs text-slate-500 mt-1">Rapat BPH Pukul 16.00 WITA</p>
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
          {currentNav === 'attendance' && (() => {
            if (!activeAttendanceSession) {
              return (
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Header & Quick Action */}
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
                          Monitoring kehadiran musyawarah pleno, tracking status tepat waktu & izin, serta ringkasan notula hasil rapat.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToService('attendance')}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <ExternalLink size={14} />
                      <span>Buka Modul Presensi & Buat Rapat Baru</span>
                    </button>
                  </div>

                  <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center shadow-xs">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-200">
                      <ClipboardCheck size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Acara Rapat Terjadwal</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                      Data acara rapat telah dibersihkan. Anda dapat menjadwalkan agenda rapat baru lengkap dengan titik GPS pembuat di modul presensi utama.
                    </p>
                    <button
                      onClick={() => onNavigateToService('attendance')}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Plus size={15} />
                      <span>Buat Agenda Rapat Baru</span>
                    </button>
                  </div>
                </div>
              );
            }

            const currentRecs = adminAttendanceList.filter(
              (r) => !r.sessionId || r.sessionId === activeAttendanceSession.id
            );
            const totalHadir = currentRecs.length;
            const tepatWaktu = currentRecs.filter((r) => r.status && r.status.includes('Tepat')).length;
            const terlambat = currentRecs.filter((r) => r.status && r.status.includes('Terlambat')).length;
            const izinSakit = currentRecs.filter((r) => r.status && (r.status.includes('Izin') || r.status.includes('Sakit'))).length;

            const filteredAttendance = currentRecs.filter((item) => {
              const matchSearch =
                item.name.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
                item.division.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
                (item.nim && item.nim.includes(adminAttendanceSearch));
              const matchStatus =
                adminAttendanceFilter === 'Semua' ||
                (adminAttendanceFilter === 'Tepat Waktu' && item.status.includes('Tepat')) ||
                (adminAttendanceFilter === 'Terlambat' && item.status.includes('Terlambat')) ||
                (adminAttendanceFilter === 'Izin/Sakit' && (item.status.includes('Izin') || item.status.includes('Sakit')));
              return matchSearch && matchStatus;
            });

            const sortedAttendance = [...filteredAttendance].sort((a, b) => {
              const matchA = String(a.time).match(/(\d{1,2}):(\d{2})/);
              const matchB = String(b.time).match(/(\d{1,2}):(\d{2})/);
              if (matchA && matchB) {
                const minA = parseInt(matchA[1], 10) * 60 + parseInt(matchA[2], 10);
                const minB = parseInt(matchB[1], 10) * 60 + parseInt(matchB[2], 10);
                if (minA !== minB) return minB - minA; // Jam terbaru berada di atas
              }
              const parseId = (id) => parseInt(String(id).replace(/\D/g, ''), 10) || 0;
              return parseId(b.id) - parseId(a.id);
            });

            // Division-based Attendance Analytics Calculation
            const currentScopeRecs = attendanceAnalyticsScope === 'session'
              ? currentRecs
              : adminAttendanceList;

            const activeDivisionKeys = Array.from(
              new Set([
                ...OFFICIAL_DIVISIONS,
                ...(accounts || []).map((a) => normalizeDivisionName(a.division)),
                ...adminAttendanceList.map((r) => normalizeDivisionName(r.division)),
              ])
            ).filter(Boolean);

            const sessionMultiplier = attendanceAnalyticsScope === 'all'
              ? Math.max(1, adminAttendanceSessions.length)
              : 1;

            const divisionStats = activeDivisionKeys.map((divName) => {
              const members = (accounts || []).filter(
                (a) => normalizeDivisionName(a.division) === divName
              );
              const memberCount = members.length;
              const divRecs = currentScopeRecs.filter(
                (r) => normalizeDivisionName(r.division) === divName
              );

              const hadirTepat = divRecs.filter((r) => r.status && r.status.includes('Tepat')).length;
              const hadirTerlambat = divRecs.filter((r) => r.status && r.status.includes('Terlambat')).length;
              const izinSakit = divRecs.filter((r) => r.status && (r.status.includes('Izin') || r.status.includes('Sakit'))).length;
              const totalHadirDiv = divRecs.length;

              const expectedCount = memberCount > 0 ? (memberCount * sessionMultiplier) : (totalHadirDiv > 0 ? totalHadirDiv : 1);
              const effectiveTarget = Math.max(expectedCount, totalHadirDiv);
              const belumPresensi = Math.max(0, effectiveTarget - totalHadirDiv);

              const ratePct = memberCount > 0 || totalHadirDiv > 0
                ? Math.min(100, Math.round((totalHadirDiv / effectiveTarget) * 100))
                : 0;

              const onTimePct = totalHadirDiv > 0
                ? Math.round((hadirTepat / totalHadirDiv) * 100)
                : 0;

              const disciplineScore = totalHadirDiv > 0
                ? Math.min(100, Math.round(((hadirTepat * 100) + (hadirTerlambat * 60) + (izinSakit * 40)) / effectiveTarget))
                : 0;

              return {
                name: divName,
                memberCount,
                expectedCount,
                effectiveTarget,
                totalHadir: totalHadirDiv,
                hadirTepat,
                hadirTerlambat,
                izinSakit,
                belumPresensi,
                ratePct,
                onTimePct,
                disciplineScore,
              };
            });

            // Ranked divisions for Leaderboard
            const rankedDivisions = [...divisionStats].sort((a, b) => {
              if (b.ratePct !== a.ratePct) return b.ratePct - a.ratePct;
              if (b.disciplineScore !== a.disciplineScore) return b.disciplineScore - a.disciplineScore;
              return b.totalHadir - a.totalHadir;
            });

            // Overall Analytics KPIs
            const totalExpectedAll = divisionStats.reduce((acc, d) => acc + d.effectiveTarget, 0);
            const totalHadirAll = divisionStats.reduce((acc, d) => acc + d.totalHadir, 0);
            const totalTepatAll = divisionStats.reduce((acc, d) => acc + d.hadirTepat, 0);

            const overallRatePct = totalExpectedAll > 0
              ? Math.min(100, Math.round((totalHadirAll / totalExpectedAll) * 100))
              : 0;

            const overallOnTimePct = totalHadirAll > 0
              ? Math.round((totalTepatAll / totalHadirAll) * 100)
              : 0;

            const topDivision = rankedDivisions[0] || null;

            return (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Header & Quick Action */}
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
                        Monitoring kehadiran musyawarah pleno, tracking status tepat waktu & izin, serta ringkasan notula hasil rapat.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleExportAdminAttendanceXlsx}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Download size={14} />
                      <span>Ekspor Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={() => onNavigateToService('attendance')}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <ExternalLink size={14} />
                      <span>Buka Halaman Presensi Penuh</span>
                    </button>
                  </div>
                </div>

                {/* Sesi Rapat Aktif Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  {/* Top Bar: Selector & Aksi Selesaikan Agenda Rapat */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Pilih Sesi Rapat:
                      </span>
                      <div className="relative">
                        <select
                          value={selectedAdminSessionId}
                          onChange={(e) => setSelectedAdminSessionId(e.target.value)}
                          className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        >
                          {adminAttendanceSessions.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title} ({s.status === 'active' ? '🟢 Aktif' : '⚪ Selesai'})
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Tombol Aksi Selesaikan Agenda Rapat */}
                      <button
                        type="button"
                        onClick={() => handleToggleCompleteMeetingSession(activeAttendanceSession)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          activeAttendanceSession.status === 'active'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {activeAttendanceSession.status === 'active' ? (
                          <>
                            <CheckCircle2 size={15} />
                            <span>Selesaikan Agenda Rapat</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} />
                            <span>Aktifkan Kembali Sesi Rapat</span>
                          </>
                        )}
                      </button>

                      {/* Tombol Aksi Hapus Acara Rapat */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMeetingSession(activeAttendanceSession)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-xs"
                        title={`Hapus acara rapat "${activeAttendanceSession.title}" beserta seluruh riwayat presensinya`}
                      >
                        <Trash2 size={14} />
                        <span>Hapus Acara Rapat</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${
                            activeAttendanceSession.status === 'active'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-slate-600 bg-slate-100 border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              activeAttendanceSession.status === 'active'
                                ? 'bg-emerald-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {activeAttendanceSession.status === 'active'
                            ? 'Sesi Presensi Aktif'
                            : 'Agenda Selesai & Diarsipkan'}
                        </span>
                        <span className="text-xs text-slate-400">• {activeAttendanceSession.division}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">
                        {activeAttendanceSession.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 flex-wrap">
                        <span className="text-slate-500">Dibuat oleh:</span>
                        <strong className="font-semibold text-slate-900">
                          {activeAttendanceSession.createdBy?.name || activeAttendanceSession.organizer || 'Pengurus'}
                        </strong>
                        <span className="font-mono text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded text-[11px] font-bold">
                          NIM: {activeAttendanceSession.createdBy?.nim || '23404053'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-3 pt-1.5 flex-wrap">
                        <span>📅 {activeAttendanceSession.date}</span>
                        <span>⏰ {activeAttendanceSession.timeStart} - {activeAttendanceSession.timeEnd} (WITA)</span>
                        <span>📍 {activeAttendanceSession.location}</span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 text-slate-900 shrink-0 border border-slate-200 overflow-hidden shadow-xs">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                              typeof window !== 'undefined'
                                ? `${window.location.origin}${window.location.pathname}?presensi=${activeAttendanceSession.id}&token=${activeAttendanceSession.qrToken}`
                                : `https://teradesk.politeknikdewantara.ac.id/?presensi=${activeAttendanceSession.id}&token=${activeAttendanceSession.qrToken}`
                            )}&margin=4`}
                            alt="QR Presensi"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-left pr-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Kode PIN Rapat:</span>
                          <span className="font-mono text-xl font-extrabold text-amber-600 tracking-wider">
                            {activeAttendanceSession.pinCode}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Toleransi: {activeAttendanceSession.toleranceTime}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            const s = activeAttendanceSession;
                            if (!s) return;
                            const coords = s.coordinates || { locationName: s.location || 'Lapangan Pancasila Palopo', radiusMeters: 100 };
                            const publicUrl = typeof window !== 'undefined'
                              ? `${window.location.origin}${window.location.pathname}?presensi=${s.id}&token=${s.qrToken}`
                              : `https://teradesk.politeknikdewantara.ac.id/?presensi=${s.id}&token=${s.qrToken}`;
                            const msg = [
                              `📢 *UNDANGAN PRESENSI RAPAT TERAMEDIA*`,
                              `━━━━━━━━━━━━━━━━━━━━━━`,
                              `📌 *Agenda:* ${s.title}`,
                              `🏢 *Divisi:* ${s.division}`,
                              `📅 *Hari/Tanggal:* ${s.date}`,
                              `⏰ *Waktu:* ${s.timeStart} - ${s.timeEnd} (WITA)`,
                              `⏳ *Toleransi Presensi:* Hingga ${s.toleranceTime} WITA`,
                              `📍 *Lokasi Rapat:* ${s.location}`,
                              `📡 *Titik Geofence:* ${coords.locationName} (Radius Maks. ${coords.radiusMeters || 100}m)`,
                              `🔢 *PIN Proyektor:* ${s.pinCode}`,
                              `━━━━━━━━━━━━━━━━━━━━━━`,
                              `📲 *Tautan Presensi Mandiri Smartphone:*`,
                              `${publicUrl}`,
                              `━━━━━━━━━━━━━━━━━━━━━━`,
                              `👤 *Dibuat Oleh:* ${s.createdBy?.name || s.organizer || 'Pengurus'} (NIM: ${s.createdBy?.nim || '23404053'})`,
                              `⚠️ _Presensi diverifikasi otomatis dengan radius GPS pembuat rapat._`
                            ].join('\n');
                            try {
                              navigator.clipboard.writeText(msg);
                            } catch {
                              // ignore
                            }
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                            addLog('Teks undangan WhatsApp berhasil disalin dan dialihkan ke WhatsApp', 'success');
                            playNotificationChime();
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Share2 size={13} />
                          <span>Bagikan WA</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyAdminQrLink(activeAttendanceSession)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {copiedAdminQrLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          <span>{copiedAdminQrLink ? 'Tautan Tersalin!' : 'Salin Tautan HP'}</span>
                        </button>
                        {onOpenPublicAttendanceModal && (
                          <button
                            type="button"
                            onClick={() => onOpenPublicAttendanceModal(activeAttendanceSession.id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Smartphone size={13} />
                            <span>Presensi Tamu (HP)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Creator Geofence Anchor Info Banner */}
                  <div className="mt-4 p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-purple-900">
                      <Radio size={14} className="text-purple-600 animate-pulse shrink-0" />
                      <span>
                        Titik Pusat Rapat: <strong>{activeAttendanceSession.coordinates?.locationName || activeAttendanceSession.location || 'Lapangan Pancasila Palopo'}</strong>
                        {activeAttendanceSession.coordinates?.lat ? ` (${activeAttendanceSession.coordinates.lat}, ${activeAttendanceSession.coordinates.lng})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600">
                        Pembuat: <strong className="text-slate-900">{activeAttendanceSession.createdBy?.name || 'Alif Fikri Haykal'}</strong>
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Radius {activeAttendanceSession.coordinates?.radiusMeters || 100}m
                      </span>
                    </div>
                  </div>

                  {/* 4 Stats Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <span className="text-xs text-slate-500">Tercatat Hadir</span>
                      <p className="text-xl font-extrabold text-slate-900 mt-1">{totalHadir} Pengurus</p>
                      <span className="text-[10px] text-slate-400">Total partisipasi</span>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/60">
                      <span className="text-xs text-emerald-700">Tepat Waktu</span>
                      <p className="text-xl font-extrabold text-emerald-600 mt-1">{tepatWaktu}</p>
                      <span className="text-[10px] text-emerald-600">Sesuai toleransi WITA</span>
                    </div>
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                      <span className="text-xs text-amber-700">Terlambat</span>
                      <p className="text-xl font-extrabold text-amber-600 mt-1">{terlambat}</p>
                      <span className="text-[10px] text-amber-600">Melebihi toleransi</span>
                    </div>
                    <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200/60">
                      <span className="text-xs text-purple-700">Izin / Sakit</span>
                      <p className="text-xl font-extrabold text-purple-600 mt-1">{izinSakit}</p>
                      <span className="text-[10px] text-purple-600">Keterangan resmi</span>
                    </div>
                  </div>
                </div>

                {/* Visual Analytics: Division Attendance Statistics & Leaderboard */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                  {/* Header & Controls */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/70 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">Grafik & Statistik Kehadiran per Divisi</h3>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                            Dashboard Analytics
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {attendanceAnalyticsScope === 'session'
                            ? `Analisis partisipasi pada agenda rapat "${activeAttendanceSession.title}"`
                            : `Akumulasi partisipasi seluruh agenda rapat organisasi (${adminAttendanceSessions.length} agenda rapat)`}
                        </p>
                      </div>
                    </div>

                    {/* Controls: Scope Switcher & View Switcher */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Scope Toggle */}
                      <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs">
                        <button
                          type="button"
                          onClick={() => setAttendanceAnalyticsScope('session')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            attendanceAnalyticsScope === 'session'
                              ? 'bg-white text-purple-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <CalendarCheck size={14} />
                          <span>Sesi Ini</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttendanceAnalyticsScope('all')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            attendanceAnalyticsScope === 'all'
                              ? 'bg-white text-purple-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Layers size={14} />
                          <span>Semua Rapat ({adminAttendanceSessions.length})</span>
                        </button>
                      </div>

                      {/* View Toggle */}
                      <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs">
                        <button
                          type="button"
                          onClick={() => setAttendanceAnalyticsView('bars')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            attendanceAnalyticsView === 'bars'
                              ? 'bg-white text-purple-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Tampilan Grafik Batang Komposisi"
                        >
                          <BarChart3 size={14} />
                          <span>Grafik Batang</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttendanceAnalyticsView('leaderboard')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            attendanceAnalyticsView === 'leaderboard'
                              ? 'bg-white text-purple-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Tampilan Papan Peringkat & Skor Disiplin"
                        >
                          <Trophy size={14} />
                          <span>Papan Peringkat</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3 Analytics KPI Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* KPI 1: Overall attendance rate */}
                    <div className="bg-gradient-to-br from-purple-500/5 via-purple-500/10 to-transparent p-4 rounded-xl border border-purple-200/60 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-800">Tingkat Kehadiran Rata-rata</span>
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                          <TrendingUp size={15} />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">{overallRatePct}%</span>
                        <span className="text-xs text-slate-500 font-medium">({totalHadirAll} / {totalExpectedAll} presensi)</span>
                      </div>
                      <div className="mt-2 w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${overallRatePct}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5">Persentase partisipasi agregat seluruh divisi</p>
                    </div>

                    {/* KPI 2: Top disciplined division */}
                    <div className="bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent p-4 rounded-xl border border-amber-200/60 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-900">Divisi Paling Disiplin</span>
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Trophy size={15} />
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-base font-extrabold text-slate-900 truncate">
                          {topDivision ? getDivisionConfig(topDivision.name).shortName : '-'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                            {topDivision ? `${topDivision.ratePct}% Hadir` : '0%'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {topDivision ? `${topDivision.onTimePct}% Tepat Waktu` : '-'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">Peringkat tertinggi rasio kehadiran & ketepatan</p>
                    </div>

                    {/* KPI 3: On-time punctuality */}
                    <div className="bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-transparent p-4 rounded-xl border border-emerald-200/60 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-800">Rasio Ketepatan Waktu</span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Clock size={15} />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-600">{overallOnTimePct}%</span>
                        <span className="text-xs text-slate-500 font-medium">({totalTepatAll} / {totalHadirAll || 1} tepat)</span>
                      </div>
                      <div className="mt-2 w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallOnTimePct}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5">Check-in sebelum batas toleransi waktu WITA</p>
                    </div>
                  </div>

                  {/* Switch between Horizontal Stacked Bars vs Leaderboard */}
                  {attendanceAnalyticsView === 'bars' ? (
                    <div className="space-y-4">
                      {/* Legend Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
                        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Legenda Indikator:</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>Tepat Waktu</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                            <span>Terlambat</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0"></span>
                            <span>Izin / Sakit</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 shrink-0"></span>
                            <span>Belum Presensi</span>
                          </div>
                        </div>
                      </div>

                      {/* Division Bars List */}
                      <div className="space-y-3.5">
                        {divisionStats.map((d) => {
                          const cfg = getDivisionConfig(d.name);
                          const tepatW = ((d.hadirTepat / d.effectiveTarget) * 100).toFixed(1);
                          const telatW = ((d.hadirTerlambat / d.effectiveTarget) * 100).toFixed(1);
                          const izinW = ((d.izinSakit / d.effectiveTarget) * 100).toFixed(1);
                          const belumW = Math.max(0, 100 - (Number(tepatW) + Number(telatW) + Number(izinW))).toFixed(1);

                          return (
                            <div
                              key={d.name}
                              className="p-4 rounded-xl border border-slate-200/70 hover:border-purple-200 hover:shadow-xs transition-all bg-white"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                                    {cfg.shortName}
                                  </span>
                                  <span className="text-xs font-bold text-slate-800">{d.name}</span>
                                  <span className="text-[11px] text-slate-400">
                                    ({d.memberCount} anggota)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs font-black text-slate-900">
                                    {d.ratePct}%
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-medium">
                                    ({d.totalHadir}/{d.effectiveTarget} Hadir)
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                      d.ratePct >= 80
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : d.ratePct >= 50
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                                  >
                                    {d.ratePct >= 80 ? 'Prima' : d.ratePct >= 50 ? 'Cukup' : 'Perlu Dorongan'}
                                  </span>
                                </div>
                              </div>

                              {/* Stacked Progress Bar */}
                              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                                {Number(tepatW) > 0 && (
                                  <div
                                    style={{ width: `${tepatW}%` }}
                                    className="bg-emerald-500 h-full transition-all duration-500 hover:opacity-90"
                                    title={`Tepat Waktu: ${d.hadirTepat} (${tepatW}%)`}
                                  />
                                )}
                                {Number(telatW) > 0 && (
                                  <div
                                    style={{ width: `${telatW}%` }}
                                    className="bg-amber-400 h-full transition-all duration-500 hover:opacity-90"
                                    title={`Terlambat: ${d.hadirTerlambat} (${telatW}%)`}
                                  />
                                )}
                                {Number(izinW) > 0 && (
                                  <div
                                    style={{ width: `${izinW}%` }}
                                    className="bg-purple-400 h-full transition-all duration-500 hover:opacity-90"
                                    title={`Izin / Sakit: ${d.izinSakit} (${izinW}%)`}
                                  />
                                )}
                                {Number(belumW) > 0 && (
                                  <div
                                    style={{ width: `${belumW}%` }}
                                    className="bg-slate-200 h-full transition-all duration-500"
                                    title={`Belum Presensi: ${d.belumPresensi} (${belumW}%)`}
                                  />
                                )}
                              </div>

                              {/* Detail Chips */}
                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {d.hadirTepat} Tepat ({tepatW}%)
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  {d.hadirTerlambat} Telat ({telatW}%)
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                  {d.izinSakit} Izin ({izinW}%)
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  {d.belumPresensi} Belum ({belumW}%)
                                </span>
                                <span className="ml-auto text-[11px] text-slate-400 font-medium">
                                  Skor Disiplin: <strong className="text-slate-700">{d.disciplineScore} pts</strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Leaderboard View */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {rankedDivisions.map((d, idx) => {
                        const cfg = getDivisionConfig(d.name);
                        const isFirst = idx === 0;
                        const isSecond = idx === 1;
                        const isThird = idx === 2;

                        return (
                          <div
                            key={d.name}
                            className={`p-4 rounded-xl border transition-all ${
                              isFirst
                                ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border-amber-300 ring-2 ring-amber-200/60 shadow-xs'
                                : isSecond
                                ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50/40 border-slate-300 shadow-xs'
                                : isThird
                                ? 'bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20 border-orange-200 shadow-xs'
                                : 'bg-white border-slate-200/80'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0 ${
                                    isFirst
                                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                                      : isSecond
                                      ? 'bg-slate-200 text-slate-800'
                                      : isThird
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${idx + 1}`}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900 text-sm">{cfg.shortName}</h4>
                                    {isFirst && (
                                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-900 border border-amber-400/60">
                                        Juara Disiplin
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-xs">{d.name}</p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-lg font-black text-slate-900">{d.ratePct}%</span>
                                <p className="text-[10px] text-slate-400">{d.totalHadir}/{d.effectiveTarget} hadir</p>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50/80 border border-slate-200/60 text-center">
                              <div>
                                <span className="text-[10px] text-slate-500 block">Tepat Waktu</span>
                                <span className="text-xs font-bold text-emerald-600">{d.hadirTepat}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Terlambat</span>
                                <span className="text-xs font-bold text-amber-600">{d.hadirTerlambat}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Izin / Sakit</span>
                                <span className="text-xs font-bold text-purple-600">{d.izinSakit}</span>
                              </div>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                              <span>Ketepatan: <strong className="text-slate-700">{d.onTimePct}%</strong></span>
                              <span>Skor: <strong className="text-purple-700">{d.disciplineScore} pts</strong></span>
                            </div>

                            <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isFirst ? 'bg-amber-500' : isSecond ? 'bg-slate-500' : isThird ? 'bg-orange-500' : 'bg-purple-600'
                                }`}
                                style={{ width: `${d.ratePct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Live Attendee Feed Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Daftar Kehadiran Sesi Berjalan</h3>
                      <p className="text-xs text-slate-500">Live feed absensi pengurus organisasi terverifikasi sistem.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={adminAttendanceSearch}
                          onChange={(e) => setAdminAttendanceSearch(e.target.value)}
                          placeholder="Cari pengurus..."
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <select
                        value={adminAttendanceFilter}
                        onChange={(e) => setAdminAttendanceFilter(e.target.value)}
                        className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none"
                      >
                        <option value="Semua">Semua Status</option>
                        <option value="Tepat Waktu">Tepat Waktu</option>
                        <option value="Terlambat">Terlambat</option>
                        <option value="Izin/Sakit">Izin / Sakit</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-4">Nama Pengurus</th>
                          <th className="py-3 px-4">Divisi & Peran</th>
                          <th className="py-3 px-4">Waktu (WITA)</th>
                          <th className="py-3 px-4">Metode</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sortedAttendance.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400">
                              Tidak ada data kehadiran yang sesuai filter.
                            </td>
                          </tr>
                        ) : (
                          sortedAttendance.map((rec) => {
                            const isTepat = rec.status && rec.status.includes('Tepat');
                            const isTerlambat = rec.status && rec.status.includes('Terlambat');

                            return (
                              <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 px-4 font-bold text-slate-900">
                                  {rec.name}
                                  <span className="block text-[10px] text-slate-400 font-normal font-mono">
                                    NIM: {rec.nim || '-'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-600">
                                  <span className="font-semibold text-slate-800">{rec.division}</span>
                                  <span className="block text-[10px] text-slate-400">{rec.role}</span>
                                </td>
                                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                                  {rec.time}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium inline-flex items-center gap-1">
                                    {rec.method === 'QR Scan (HP)' && <Smartphone size={11} className="text-purple-600" />}
                                    <span>{rec.method || 'Manual'}</span>
                                  </span>
                                  {rec.distanceInfo && (
                                    <span className="block text-[10px] text-teal-800 bg-teal-50 border border-teal-200/60 px-1.5 py-0.5 rounded font-mono w-fit mt-1">
                                      📍 {rec.distanceInfo}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                      isTepat
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : isTerlambat
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-purple-50 text-purple-700 border-purple-200'
                                    }`}
                                  >
                                    <CheckCircle2 size={11} />
                                    {rec.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAdminRecord(rec.id, rec.name)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title={`Hapus catatan presensi ${rec.name}`}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mini Notula & Action Items Widget */}
                {activeAttendanceSession.notula && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Ringkasan Notula & Action Items Sesi</h3>
                        <p className="text-xs text-slate-500">Tindak lanjut hasil musyawarah yang didelegasikan ke PIC.</p>
                      </div>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        {activeAttendanceSession.notula.actionItems?.length || 0} Tindak Lanjut
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
                      {activeAttendanceSession.notula.summary}
                    </p>

                    <div className="space-y-2 pt-2">
                      {(activeAttendanceSession.notula.actionItems || []).map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 text-xs">
                          <div>
                            <p className="font-semibold text-slate-900">{act.task}</p>
                            <p className="text-[11px] text-slate-500">PIC: {act.pic} • Tenggat: {act.deadline}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!propOnUpdateAttendanceSession) return;
                              const updatedItems = activeAttendanceSession.notula.actionItems.map((item) => {
                                if (item.id === act.id) {
                                  const nextSt = item.status === 'done' ? 'pending' : item.status === 'in_progress' ? 'done' : 'in_progress';
                                  return { ...item, status: nextSt };
                                }
                                return item;
                              });
                              const updatedSess = {
                                ...activeAttendanceSession,
                                notula: { ...activeAttendanceSession.notula, actionItems: updatedItems },
                              };
                              propOnUpdateAttendanceSession(updatedSess);
                              playNotificationChime();
                            }}
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] border cursor-pointer transition-colors ${
                              act.status === 'done'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : act.status === 'in_progress'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {act.status === 'done' ? 'Selesai' : act.status === 'in_progress' ? 'Dalam Proses' : 'Menunggu'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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
                {prokerList && prokerList.length > 0 ? (
                  prokerList.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 font-mono text-xs font-bold rounded-lg border border-blue-200 whitespace-nowrap">
                          {p.period || 'Periode 2026'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {p.badge || 'Proker'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {p.division} • Penanggung Jawab: {p.pic || 'Divisi Pelaksana'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          p.status === 'Aktif' || p.status === 'Sedang Berjalan'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-blue-700 bg-blue-50 border-blue-200'
                        }`}>
                          {p.status || 'Terjadwal'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                    Belum ada program kerja terdaftar di timeline.
                  </div>
                )}
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
                      {combinedKaderRaporList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            Belum ada data anggota kepengurusan terdaftar.
                          </td>
                        </tr>
                      ) : (
                        combinedKaderRaporList.map((k) => (
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
                      ))
                    )}
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
                  {activePubdokTickets
                    .filter((t) => {
                      if (pubdokFilter === 'Semua') return true;
                      if (pubdokFilter === 'Antrean') return t.status === 'Antrean' || t.status === 'Diajukan';
                      if (pubdokFilter === 'Dikerjakan') return t.status === 'Dikerjakan' || t.status === 'Sedang Dikerjakan';
                      if (pubdokFilter === 'Selesai') return t.status === 'Selesai';
                      return t.status === pubdokFilter;
                    })
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedPubdokTicket(t)}
                        className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 hover:border-rose-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{t.id}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                              {t.canvas || t.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.statusColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                              {t.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                            <span>{t.title}</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Pengaju: <span className="font-semibold text-slate-700">{t.division || t.requester}</span> • Deadline: <span className="font-medium text-slate-700">{t.deadline || t.targetDate}</span> • PIC: {t.designer || t.assignedTo || 'Tim Pubdok'}
                          </p>
                          {t.brief && t.brief !== '-' && (
                            <p className="text-xs text-slate-600 bg-white/90 p-2 rounded-lg border border-slate-200/60 font-mono mt-1">
                              Brief: {t.brief}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPubdokTicket(t);
                            }}
                            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title="Buka Detail Pesanan"
                          >
                            <Eye size={13} />
                            <span>Detail</span>
                          </button>

                          {(t.status === 'Antrean' || t.status === 'Diajukan') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTicketStatus(t.id, 'Dikerjakan');
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              Mulai Kerjakan
                            </button>
                          )}
                          {(t.status === 'Dikerjakan' || t.status === 'Sedang Dikerjakan') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTicketStatus(t.id, 'Selesai');
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              Tandai Selesai
                            </button>
                          )}
                          {t.status === 'Selesai' && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-1">
                              <Check size={14} /> Selesai Siap Upload
                            </span>
                          )}
                          {onDeleteTicket && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Hapus tiket ${t.id} - ${t.title}?`)) {
                                  onDeleteTicket(t.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Tiket"
                            >
                              <Trash2 size={14} />
                            </button>
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
                            <span className="font-bold text-slate-900 block">{m.event || m.eventName}</span>
                            <span className="font-mono text-[11px] text-slate-400">{m.id}</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">{m.organizer}</td>
                          <td className="py-3 px-3 font-medium text-slate-700">{m.package || m.packageType}</td>
                          <td className="py-3 px-3 text-slate-600">{m.date || m.eventDate}</td>
                          <td className="py-3 px-3 text-slate-500">{m.pic || (m.picName ? `${m.picName} (${m.picContact})` : '-')}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.statusColor}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {m.status === 'Menunggu Review' || m.status === 'Menunggu Tinjauan' ? (
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
                          <td className="py-3 px-3 font-semibold text-slate-900">{o.name || (o.customerName ? `${o.customerName} (${o.nim || '-'})` : 'Pelanggan')}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{o.item}</td>
                          <td className="py-3 px-3 text-slate-600">{o.size}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{typeof o.total === 'number' ? 'Rp ' + o.total.toLocaleString('id-ID') : o.total}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${o.statusColor || o.paymentColor}`}>
                              {o.status || o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {o.status !== 'Lunas' && o.paymentStatus !== 'Lunas' ? (
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

          {/* TAB: ARSIP KEGIATAN & DOKUMENTASI TERLAKSANA */}
          {currentNav === 'activity' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Akses Terbuka Semua Divisi
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Modul 11</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Arsip Kegiatan & Dokumentasi Terlaksana
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Monitoring detail kegiatan, partisipan, dan berkas LPJ yang telah disahkan seluruh divisi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onNavigateToService) onNavigateToService('activity');
                      else onNavigateToPortal();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Halaman Modul Lengkap</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>

              {/* 4 Metrik Ringkas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 block mb-1">Total Kegiatan Terlaksana</span>
                  <div className="text-2xl font-black text-slate-900">6 Agenda</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% Selesai Sesuai Jadwal</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 block mb-1">Total Partisipan Terdata</span>
                  <div className="text-2xl font-black text-cyan-600">540+ Orang</div>
                  <span className="text-[10px] text-slate-400">Mahasiswa, siswa, & alumni</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 block mb-1">LPJ Resmi Disahkan</span>
                  <div className="text-2xl font-black text-blue-600">6 / 6 Berkas</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Tuntas 100% Tanpa Tunggakan</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 block mb-1">Realisasi Total Anggaran</span>
                  <div className="text-2xl font-black text-slate-900">Rp 19.350.000</div>
                  <span className="text-[10px] text-slate-400">Tercatat di mutasi kas BPH</span>
                </div>
              </div>

              {/* Tabel Ringkasan Kegiatan Terlaksana */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Daftar Arsip Kegiatan Terbaru</h3>
                  <span className="text-xs text-slate-400">Semua divisi memiliki hak melihat</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                        <th className="py-2 px-3">KODE</th>
                        <th className="py-2 px-3">NAMA KEGIATAN</th>
                        <th className="py-2 px-3">DIVISI</th>
                        <th className="py-2 px-3">TANGGAL</th>
                        <th className="py-2 px-3">PARTISIPAN</th>
                        <th className="py-2 px-3">STATUS LPJ</th>
                        <th className="py-2 px-3 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {[
                        { id: 'ACT-001', name: 'Workshop Desain Grafis & UI/UX SMKN 1 Palopo', div: 'Publikasi & Dokumentasi', date: '18 Feb 2026', part: '85 Orang', status: 'Disahkan BPH' },
                        { id: 'ACT-002', name: 'Latihan Dasar Kepemimpinan (LDK) Angkatan VI', div: 'Kaderisasi & SDM', date: '25 Jan 2026', part: '124 Orang', status: 'Disahkan BPH' },
                        { id: 'ACT-003', name: 'Musyawarah Besar (MUBES) V TERAMEDIA', div: 'BPH & Presidium', date: '10 Jan 2026', part: '156 Orang', status: 'Disahkan Pembina' },
                        { id: 'ACT-004', name: 'Media Visit & Audiensi Humas TVRI Sulsel', div: 'Hubungan Masyarakat', date: '04 Mar 2026', part: '35 Orang', status: 'Disahkan BPH' },
                        { id: 'ACT-005', name: 'Pre-Order Official Merchandise & Jaket Angkatan', div: 'Kewirausahaan (KKM)', date: '14 Feb 2026', part: '92 Orang', status: 'Disahkan BPH' },
                        { id: 'ACT-006', name: 'Rapat Kerja Tahunan (Raker) Master Timeline', div: 'BPH & Kesekretariatan', date: '20 Jan 2026', part: '48 Orang', status: 'Disahkan BPH' },
                      ].map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-700">{act.id}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900">{act.name}</td>
                          <td className="py-3 px-3 text-slate-600">{act.div}</td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{act.date}</td>
                          <td className="py-3 px-3 font-bold text-cyan-700">{act.part}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {act.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                if (onNavigateToService) onNavigateToService('activity');
                                else onNavigateToPortal();
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Detail
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

          {/* TAB: KOTAK MASUK KONSULTASI (INBOX KONTAK FORM LANDING PAGE) */}
          {currentNav === 'inbox' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Integrasi Landing Page
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Sinkronisasi End-to-End
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Kotak Masuk Konsultasi (Inbox Kontak)
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Pesan, permohonan kemitraan, dan konsultasi dari formulir landing page publik yang terhubung langsung.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Sound Chime Toggle & Test Button */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl p-1 shadow-xs">
                    <button
                      onClick={handleToggleSound}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSoundMutedState
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                      title={isSoundMutedState ? 'Bunyi tinggg dinonaktifkan (klik untuk aktifkan)' : 'Bunyi tinggg aktif (klik untuk bisu)'}
                    >
                      {isSoundMutedState ? (
                        <>
                          <VolumeX size={14} className="text-slate-400" />
                          <span>Suara Bisu</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} className="text-blue-600 animate-pulse" />
                          <span>Bunyi Tinggg Aktif</span>
                        </>
                      )}
                    </button>
                    {!isSoundMutedState && (
                      <button
                        onClick={handleTestChime}
                        className="px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title="Uji coba bunyi notifikasi tinggg"
                      >
                        Uji Bunyi
                      </button>
                    )}
                  </div>

                  {unreadConsultationsCount > 0 && (
                    <button
                      onClick={onMarkAllConsultationsRead}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} className="text-blue-600" />
                      <span>Tandai Semua Dibaca</span>
                    </button>
                  )}
                  {consultationMessages.length > 0 && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            'Apakah Anda yakin ingin mengosongkan seluruh pesan di kotak masuk? Semua pesan akan dihapus permanen.'
                          )
                        ) {
                          if (onClearAllConsultations) {
                            onClearAllConsultations();
                          } else if (onResetConsultations) {
                            onResetConsultations();
                          }
                        }
                      }}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      title="Kosongkan seluruh pesan masuk"
                    >
                      <Trash2 size={13} className="text-red-500" />
                      <span>Kosongkan Kotak Masuk</span>
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Total Pesan Masuk</span>
                    <Inbox size={16} className="text-slate-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {consultationMessages.length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Permohonan tercatat</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Belum Dibaca (Baru)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
                    {unreadConsultationsCount}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Perlu ditindaklanjuti</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Sedang Diproses</span>
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
                    {consultationMessages.filter((m) => m.status === 'Diproses').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Dalam follow-up tim</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Selesai / Terjawab</span>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                    {consultationMessages.filter((m) => m.status === 'Selesai').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Konsultasi rampung</p>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search bar */}
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inboxSearchQuery}
                      onChange={(e) => setInboxSearchQuery(e.target.value)}
                      placeholder="Cari nama pengirim, organisasi, email, atau cuplikan isi pesan..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200/80 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                      <Filter size={13} />
                      <span>Status:</span>
                    </span>
                    {['Semua Status', 'Baru', 'Diproses', 'Selesai'].map((status) => {
                      const count =
                        status === 'Semua Status'
                          ? consultationMessages.length
                          : consultationMessages.filter((m) => m.status === status).length;
                      const isActive = inboxFilterStatus === status;

                      return (
                        <button
                          key={status}
                          onClick={() => setInboxFilterStatus(status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          <span>{status}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                              isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Messages Table / List */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                        <th className="py-3 px-4">KODE / STATUS</th>
                        <th className="py-3 px-4">PENGIRIM & LEMBAGA</th>
                        <th className="py-3 px-4">WAKTU MASUK</th>
                        <th className="py-3 px-4">CUPLIKAN PESAN</th>
                        <th className="py-3 px-4 text-right">TINDAKAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {consultationMessages
                        .filter((msg) => {
                          const matchSearch =
                            msg.name.toLowerCase().includes(inboxSearchQuery.toLowerCase()) ||
                            msg.email.toLowerCase().includes(inboxSearchQuery.toLowerCase()) ||
                            msg.organization.toLowerCase().includes(inboxSearchQuery.toLowerCase()) ||
                            msg.message.toLowerCase().includes(inboxSearchQuery.toLowerCase());
                          const matchStatus =
                            inboxFilterStatus === 'Semua Status' || msg.status === inboxFilterStatus;
                          return matchSearch && matchStatus;
                        })
                        .map((msg) => {
                          return (
                            <tr
                              key={msg.id}
                              className={`transition-colors hover:bg-slate-50/70 cursor-pointer ${
                                !msg.isRead ? 'bg-blue-50/30' : ''
                              }`}
                              onClick={() => {
                                onMarkConsultationRead(msg.id);
                                setSelectedMessage(msg);
                              }}
                            >
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {!msg.isRead && (
                                    <span
                                      className="w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-xs"
                                      title="Pesan baru belum dibuka"
                                    />
                                  )}
                                  <span className="font-mono font-bold text-slate-700 text-[11px]">
                                    {msg.id}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                      msg.status === 'Baru'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : msg.status === 'Diproses'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}
                                  >
                                    {msg.status}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                    {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{msg.name}</p>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {msg.organization}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                                {msg.date}
                              </td>

                              <td className="py-4 px-4 max-w-md">
                                <p className="text-slate-600 line-clamp-1 leading-snug">
                                  {msg.message}
                                </p>
                              </td>

                              <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      onMarkConsultationRead(msg.id);
                                      setSelectedMessage(msg);
                                    }}
                                    className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                  >
                                    <Eye size={12} />
                                    <span>Buka</span>
                                  </button>

                                  <a
                                    href={`mailto:${msg.email}?subject=${encodeURIComponent(
                                      'Tanggapan Konsultasi TeraDesk - ' + msg.organization
                                    )}`}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title={`Balas ke ${msg.email}`}
                                  >
                                    <Mail size={14} />
                                  </a>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Hapus pesan dari ${msg.name}?`)) {
                                        onDeleteConsultation(msg.id);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus pesan"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {consultationMessages.filter((msg) => {
                        const matchSearch =
                          msg.name.toLowerCase().includes(inboxSearchQuery.toLowerCase()) ||
                          msg.email.toLowerCase().includes(inboxSearchQuery.toLowerCase()) ||
                          msg.organization.toLowerCase().includes(inboxSearchQuery.toLowerCase()) ||
                          msg.message.toLowerCase().includes(inboxSearchQuery.toLowerCase());
                        const matchStatus =
                          inboxFilterStatus === 'Semua Status' || msg.status === inboxFilterStatus;
                        return matchSearch && matchStatus;
                      }).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            <Inbox size={36} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-sm font-semibold text-slate-700">
                              Tidak Ada Pesan yang Sesuai Filter
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Coba ubah kata kunci pencarian atau ubah tab status filter.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PENGUMUMAN & MAKLUMAT BPH (POP-UP WINDOW BROADCAST) */}
          {currentNav === 'announcements' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      BPH Broadcast System
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeAnnouncementsCount} Maklumat Aktif
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
                      Pop-up Otomatis Pasca-Login
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Megaphone size={24} className="text-blue-600 shrink-0" />
                    <span>Pengumuman & Maklumat BPH</span>
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Kelola maklumat resmi organisasi, surat edaran BPH, dan notifikasi pop-up yang otomatis menyapa seluruh anggota saat login ke portal/modul layanan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (!announcements || announcements.length === 0) {
                        alert('Belum ada maklumat pengumuman yang dibuat oleh BPH. Silakan klik tombol "Buat Pengumuman Baru" terlebih dahulu.');
                        return;
                      }
                      if (onPreviewAnnouncementPopup) {
                        const activeList = (announcements || []).filter((a) => a.isActive);
                        onPreviewAnnouncementPopup(activeList.length > 0 ? activeList[0] : (announcements[0] || null), 0);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-2xs cursor-pointer"
                    title="Uji tampilan pop-up window seperti yang dilihat oleh anggota"
                  >
                    <Eye size={14} className="text-blue-600" />
                    <span>Preview Pop-up Anggota</span>
                  </button>

                  {onResetAnnouncements && announcements.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Bersihkan seluruh daftar pengumuman BPH?')) {
                          onResetAnnouncements();
                          addLog('Seluruh daftar pengumuman BPH telah dibersihkan', 'warning');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 transition-colors cursor-pointer shadow-2xs"
                      title="Bersihkan pengumuman"
                    >
                      <RefreshCw size={13} className="text-slate-400" />
                      <span>Bersihkan</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleOpenAddAnn}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Buat Pengumuman Baru</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Total Maklumat</span>
                    <Megaphone size={16} className="text-slate-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {announcements.length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Tercatat di sistem</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Sedang Tayang</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                    {activeAnnouncementsCount}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Pop-up saat anggota login</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Prioritas Mendesak</span>
                    <AlertTriangle size={16} className="text-rose-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
                    {(announcements || []).filter((a) => a.priority === 'urgent').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Wajib dihadiri / dipatuhi</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Total Konfirmasi</span>
                    <CheckCheck size={16} className="text-indigo-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                    {(announcements || []).reduce((acc, curr) => acc + (Array.isArray(curr.readBy) ? curr.readBy.length : 0), 0)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Audit pembaca tercatat</p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    placeholder="Cari judul pengumuman, agenda, atau kata kunci..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={announcementCategoryFilter}
                    onChange={(e) => setAnnouncementCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                  >
                    <option value="Semua Kategori">Semua Kategori</option>
                    <option value="Rapat Pleno">Rapat Pleno</option>
                    <option value="Instruksi">Instruksi</option>
                    <option value="Penting">Penting</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Informasi">Informasi</option>
                  </select>

                  <select
                    value={announcementStatusFilter}
                    onChange={(e) => setAnnouncementStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Aktif">Hanya Aktif (Tayang)</option>
                    <option value="Nonaktif">Draf / Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* List of Announcement Cards */}
              <div className="space-y-4">
                {filteredAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-200 shadow-xs ${
                      ann.isActive
                        ? 'border-blue-200/90 hover:border-blue-300'
                        : 'border-slate-200/70 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Priority Badge */}
                          {ann.priority === 'urgent' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                              <AlertTriangle size={11} className="text-rose-500" />
                              <span>Mendesak & Wajib</span>
                            </span>
                          ) : ann.priority === 'important' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                              <Info size={11} className="text-amber-600" />
                              <span>Penting</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                              <Info size={11} className="text-blue-600" />
                              <span>Informasi</span>
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {ann.category || 'Maklumat'}
                          </span>

                          {ann.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Pin size={11} className="text-amber-500 fill-amber-500" />
                              <span>Disematkan</span>
                            </span>
                          )}

                          {/* Live Status Pill */}
                          <button
                            type="button"
                            onClick={() => handleToggleAnn(ann.id, ann.isActive, ann.title)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              ann.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Klik untuk mengubah status tayang pop-up"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${ann.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{ann.isActive ? 'Tayang (Aktif)' : 'Draf (Nonaktif)'}</span>
                          </button>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {ann.title}
                        </h3>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-blue-600" />
                            <span>{ann.date || '12 Nov 2026'} ({ann.time || 'WITA'})</span>
                          </span>
                          {ann.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} className="text-indigo-600" />
                              <span className="truncate max-w-[200px]">{ann.location}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <User size={13} className="text-emerald-600" />
                            <span>{ann.authorName || ann.author || 'BPH TERAMEDIA'}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-amber-600" />
                            <span>Target: {ann.targetAudience || 'Semua Anggota'}</span>
                          </span>
                        </div>

                        {/* Content Excerpt */}
                        <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-200/60 text-xs sm:text-[13px] text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                          {ann.content}
                        </div>

                        {/* Action Link Pill (if any) */}
                        {ann.actionServiceId && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-slate-400 font-medium">Tautan Modul:</span>
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200 inline-flex items-center gap-1">
                              <span>{ann.actionText || 'Buka Modul'}</span>
                              <ArrowRight size={11} />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                        <button
                          type="button"
                          onClick={() => {
                            if (onPreviewAnnouncementPopup) {
                              onPreviewAnnouncementPopup(ann, 0);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200 cursor-pointer shadow-2xs"
                          title="Lihat tampilan pop-up window"
                        >
                          <Eye size={13} />
                          <span>Preview Pop-up</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditAnn(ann)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                          title="Edit Maklumat"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAnn(ann.id, ann.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Maklumat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Readership Progress Bar & Audit Button */}
                    {(() => {
                      const cardReadCount = Array.isArray(ann.readBy) ? ann.readBy.length : 0;
                      const cardTotalMembers = (accounts || []).length || 1;
                      const cardReadPercent = Math.min(100, Math.round((cardReadCount / cardTotalMembers) * 100));

                      return (
                        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                <Users size={13} className="text-blue-600 shrink-0" />
                                <span>Keterbacaan Pengurus:</span>
                                <strong className="text-slate-900">{cardReadCount} / {cardTotalMembers}</strong>
                                <span className="text-slate-400 font-normal">({cardReadPercent}%)</span>
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  cardReadPercent === 100
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : cardReadPercent >= 50
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {cardReadPercent === 100
                                  ? 'Lengkap 100%'
                                  : cardReadPercent >= 50
                                  ? 'Mayoritas Terbaca'
                                  : 'Perlu Diingatkan'}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  cardReadPercent === 100
                                    ? 'bg-emerald-500'
                                    : cardReadPercent >= 50
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{
                                  width: `${Math.min(100, Math.max(cardReadPercent, cardReadCount > 0 ? 5 : 0))}%`,
                                }}
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setAuditAnnouncement(ann);
                              setAuditSearchQuery('');
                              setAuditStatusFilter('all');
                              setAuditDivisionFilter('all');
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-indigo-200 hover:border-indigo-600 cursor-pointer shadow-2xs shrink-0"
                            title="Buka audit lengkap daftar siapa yang sudah dan belum membaca maklumat ini"
                          >
                            <CheckCheck size={14} />
                            <span>Audit Keterbacaan</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-indigo-700 font-mono font-bold">
                              {cardReadCount}
                            </span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                ))}

                {filteredAnnouncements.length === 0 && (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400 space-y-3">
                    <Megaphone size={40} className="mx-auto text-slate-300" />
                    <p className="text-base font-bold text-slate-700">Belum Ada Maklumat Pengumuman BPH</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Belum ada pengumuman resmi yang diterbitkan oleh BPH. Klik tombol di bawah untuk membuat maklumat baru yang akan otomatis tayang sebagai pop-up window untuk anggota.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddAnn}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Buat Pengumuman Baru</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PROKER (PROGRAM KERJA SHOWCASE & HERO OVERLAPPING STACK) */}
          {currentNav === 'proker' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Hero Section Landing Page
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Overlapping Stack Cards
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Manajemen Program Kerja (Hero Landing Showcase)
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1 max-w-3xl">
                    Kelola kartu-kartu program kerja yang tampil bertumpuk (overlapping deck) di landing page. Atur urutan tumpukan (kartu paling atas berada di urutan #1), sesuaikan teks & tautan modul, serta aktifkan atau nonaktifkan proker yang ingin ditampilkan.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={handleOpenAddProker}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus size={15} />
                    <span>Tambah Program Kerja</span>
                  </button>
                  <button
                    onClick={onResetProker}
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                    title="Kembalikan daftar proker ke default"
                  >
                    <RefreshCw size={13} />
                    <span>Reset Default</span>
                  </button>
                  <button
                    onClick={onBackToLanding}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                    title="Lihat tampilan di Landing Page"
                  >
                    <ExternalLink size={13} />
                    <span>Lihat di Landing</span>
                  </button>
                </div>
              </div>

              {/* 4 Quick Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Total Proker
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900 font-mono">{prokerList.length}</span>
                    <span className="text-xs text-blue-600 font-semibold">Proker Tersimpan</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tampil di Hero
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      {prokerList.filter((p) => p.isVisible !== false).length}
                    </span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Aktif di Stack
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Status Berjalan
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-indigo-600 font-mono">
                      {prokerList.filter((p) => p.status === 'Aktif' || p.status === 'Sedang Berjalan').length}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Dalam Pelaksanaan</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tumpukan Layer Depan
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                      {prokerList.find((p) => p.isVisible !== false)?.title.split(' ')[0] || 'Tidak ada'}...
                    </span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                      #1 Front Card
                    </span>
                  </div>
                </div>
              </div>

              {/* LIVE OVERLAPPING PREVIEW MOCKUP */}
              <div className="bg-gradient-to-r from-[#04081f] via-[#071135] to-[#04081f] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl text-white relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        Live Preview: Hero Overlapping Cards Deck
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Visualisasi Tumpukan Kartu Landing Page
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Kartu di bawah menunjukkan bagaimana program kerja akan saling bertumpuk (overlapping) di sisi kiri Hero Section. Gunakan tombol panah atas/bawah pada tabel untuk mengubah kartu yang berada di posisi paling depan (#1).
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-white/5 border border-white/10 rounded-xl p-2.5">
                      <Sparkles size={14} className="text-amber-400 shrink-0" />
                      <span>
                        Kartu depan (#1) dapat diklik untuk navigasi langsung ke modul layanan terkait.
                      </span>
                    </div>
                  </div>

                  {/* Overlapping Preview Visualizer */}
                  <div className="relative w-[280px] sm:w-[310px] h-[210px] shrink-0 mx-auto lg:mx-0">
                    {/* Layer 3 Background peeking */}
                    {prokerList.filter((p) => p.isVisible !== false).length >= 3 && (
                      <div
                        className="absolute inset-0 bg-[#070e28]/70 backdrop-blur-xs rounded-2xl p-4 border border-white/10 shadow-lg"
                        style={{
                          transform: 'translate(14px, 14px) rotate(3deg) scale(0.92)',
                          zIndex: 10,
                          opacity: 0.45,
                        }}
                      >
                        <div className="flex items-center gap-2 bg-white/5 w-fit px-2 py-0.5 rounded text-[10px] text-gray-400">
                          <Bookmark size={10} />
                          <span className="truncate max-w-[120px]">
                            {prokerList.filter((p) => p.isVisible !== false)[2]?.badge}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Layer 2 Middle peeking */}
                    {prokerList.filter((p) => p.isVisible !== false).length >= 2 && (
                      <div
                        className="absolute inset-0 bg-[#0a1336]/80 backdrop-blur-sm rounded-2xl p-4 border border-white/15 shadow-xl"
                        style={{
                          transform: 'translate(7px, 7px) rotate(1.5deg) scale(0.96)',
                          zIndex: 20,
                          opacity: 0.75,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded text-[10px] text-slate-200">
                            <Bookmark size={10} />
                            <span className="truncate max-w-[120px]">
                              {prokerList.filter((p) => p.isVisible !== false)[1]?.badge}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">#2 Layer</span>
                        </div>
                        <p className="text-[11px] italic text-slate-300 line-clamp-2">
                          {prokerList.filter((p) => p.isVisible !== false)[1]?.title}
                        </p>
                      </div>
                    )}

                    {/* Layer 1 Front Card */}
                    <div
                      className="relative z-30 h-full flex flex-col justify-between bg-[#0c1433]/90 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 bg-white/10 w-fit px-2.5 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                            <Bookmark size={12} className="text-white fill-white/80" />
                            <span className="truncate max-w-[140px]">
                              {prokerList.find((p) => p.isVisible !== false)?.badge || 'Update Program Kerja'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                            #1 DEPAN
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 lowercase mb-1">
                          {prokerList.find((p) => p.isVisible !== false)?.tag || 'update terakhir'}
                        </p>
                        <p className="text-xs italic text-white line-clamp-3 leading-relaxed">
                          {prokerList.find((p) => p.isVisible !== false)?.title || 'Belum ada program kerja'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[11px] text-slate-300 flex items-center gap-1">
                          <span>{prokerList.find((p) => p.isVisible !== false)?.actionText || 'cek asesmen'}</span>
                          <ArrowRight size={12} />
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          {prokerList.find((p) => p.isVisible !== false)?.period || '2026'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari judul proker, badge, atau divisi..."
                    value={prokerSearchQuery}
                    onChange={(e) => setProkerSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={prokerFilterDivision}
                    onChange={(e) => setProkerFilterDivision(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {divisionsList.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>

                  <select
                    value={prokerFilterStatus}
                    onChange={(e) => setProkerFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Review">Review</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              {/* Table / Cards List of Program Kerja */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900">
                      Daftar Program Kerja & Prioritas Stacking
                    </h2>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {prokerList.length} total
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    💡 Gunakan tombol panah ↑ ↓ untuk mengatur kartu yang berada di layer depan
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-3 text-center w-16">Urutan</th>
                        <th className="py-3 px-4">Program Kerja & Badge</th>
                        <th className="py-3 px-4">Divisi & Periode</th>
                        <th className="py-3 px-4">Tautan Layanan</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Tampil di Hero</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prokerList
                        .filter((item) => {
                          const matchesSearch =
                            prokerSearchQuery.trim() === '' ||
                            item.title.toLowerCase().includes(prokerSearchQuery.toLowerCase()) ||
                            item.badge.toLowerCase().includes(prokerSearchQuery.toLowerCase()) ||
                            item.tag.toLowerCase().includes(prokerSearchQuery.toLowerCase()) ||
                            item.division.toLowerCase().includes(prokerSearchQuery.toLowerCase());
                          const matchesDivision =
                            prokerFilterDivision === 'Semua Divisi' || item.division === prokerFilterDivision;
                          const matchesStatus =
                            prokerFilterStatus === 'Semua Status' || item.status === prokerFilterStatus;
                          return matchesSearch && matchesDivision && matchesStatus;
                        })
                        .map((item, idx) => {
                          const isFirst = idx === 0;
                          const isLast = idx === prokerList.length - 1;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Urutan & Reorder buttons */}
                              <td className="py-3.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                                      idx === 0
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : idx === 1
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    #{idx + 1}
                                  </span>
                                  <div className="flex flex-col">
                                    <button
                                      type="button"
                                      disabled={isFirst}
                                      onClick={() => handleMoveProkerItem(idx, 'up')}
                                      className={`p-0.5 rounded hover:bg-slate-200 transition-colors ${
                                        isFirst ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer text-slate-700'
                                      }`}
                                      title="Pindahkan ke atas (Prioritas depan)"
                                    >
                                      <ArrowUp size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLast}
                                      onClick={() => handleMoveProkerItem(idx, 'down')}
                                      className={`p-0.5 rounded hover:bg-slate-200 transition-colors ${
                                        isLast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer text-slate-700'
                                      }`}
                                      title="Pindahkan ke bawah (Tumpukan belakang)"
                                    >
                                      <ArrowDown size={11} />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Title & Badge */}
                              <td className="py-3.5 px-4 max-w-md">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                    <Bookmark size={11} className="text-blue-600" />
                                    {item.badge}
                                  </span>
                                  <span className="text-[10px] text-slate-400 lowercase font-medium">
                                    {item.tag}
                                  </span>
                                  {idx === 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      Layer Depan
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-slate-900 italic leading-snug">
                                  "{item.title}"
                                </p>
                              </td>

                              {/* Divisi & Periode */}
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-slate-800 block text-xs">
                                  {item.division}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {item.period}
                                </span>
                              </td>

                              {/* Tautan Layanan */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-semibold text-blue-600 hover:underline block cursor-pointer"
                                    onClick={() => onNavigateToService && onNavigateToService(item.actionServiceId || 'par')}
                                  >
                                    {item.actionText || 'cek asesmen'} →
                                  </span>
                                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                                    Modul: {item.actionServiceId || 'par'}
                                  </span>
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                    item.status === 'Aktif'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : item.status === 'Sedang Berjalan'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : item.status === 'Akan Datang'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : item.status === 'Review'
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>

                              {/* Toggle Tampil di Hero */}
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleProkerVisibilityItem(item.id, item.isVisible !== false)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                    item.isVisible !== false ? 'bg-emerald-600' : 'bg-slate-300'
                                  }`}
                                  title={item.isVisible !== false ? 'Sembunyikan dari hero' : 'Tampilkan di hero'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                      item.isVisible !== false ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>

                              {/* Actions: Edit, Delete */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditProker(item)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Program Kerja"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProkerItem(item.id, item.title)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Program Kerja"
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

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setIsBatchImportModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="Import banyak akun sekaligus via script JSON, CSV, atau file Excel"
                  >
                    <Upload size={14} />
                    <span>Import Script / Excel</span>
                  </button>
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
                      value={
                        allDivisionOptions.includes(selectedDivision)
                          ? selectedDivision
                          : (allDivisionOptions.includes(normalizeDivisionName(selectedDivision))
                            ? normalizeDivisionName(selectedDivision)
                            : 'Semua Divisi')
                      }
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                    >
                      {allDivisionOptions.map((div) => (
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
                    {availableRoles.length > 2 && (
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    )}
                    {(selectedDivision !== 'Semua Divisi' || accessFilter !== 'Semua Akses' || roleFilter !== 'Semua Jabatan' || searchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDivision('Semua Divisi');
                          setAccessFilter('Semua Akses');
                          setRoleFilter('Semua Jabatan');
                          setSearchQuery('');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Reset semua filter"
                      >
                        Reset Filter
                      </button>
                    )}
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

                {/* Baris Filter Cepat Per Divisi (1 Tombol Filter Per Divisi) */}
                <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                    <Filter size={12} />
                    Divisi:
                  </span>
                  {allDivisionOptions.map((div) => {
                    const isSelected =
                      selectedDivision === div ||
                      (selectedDivision !== 'Semua Divisi' &&
                        normalizeDivisionName(selectedDivision) === normalizeDivisionName(div));
                    const count = div === 'Semua Divisi'
                      ? (accounts || []).length
                      : (accounts || []).filter((a) => {
                          if (!a || !a.division) return false;
                          return (
                            a.division === div ||
                            normalizeDivisionName(a.division) === normalizeDivisionName(div)
                          );
                        }).length;
                    const config = DIVISION_ANALYTICS_CONFIG[div] || DIVISION_ANALYTICS_CONFIG[normalizeDivisionName(div)];
                    const label = config ? config.shortName : (div === 'Semua Divisi' ? 'Semua Divisi' : div);

                    return (
                      <button
                        key={div}
                        type="button"
                        onClick={() => setSelectedDivision(div)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        <span>{label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/60 border-b border-slate-100">
                        <th className="py-3 px-4 w-8">
                          <input
                            type="checkbox"
                            checked={
                              filteredAccounts.filter((a) => a && !isAccountAlifFikri(a.nim, a.name)).length > 0 &&
                              selectedRows.length === filteredAccounts.filter((a) => a && !isAccountAlifFikri(a.nim, a.name)).length
                            }
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 cursor-pointer"
                            title="Pilih semua mahasiswa yang dapat dikelola"
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
                        const isAlifFikri = isAccountAlifFikri(acc.nim, acc.name);

                        return (
                          <tr key={acc.nim} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              {isAlifFikri ? (
                                <span
                                  className="inline-flex items-center justify-center w-4 h-4 text-slate-300 cursor-not-allowed"
                                  title="Akun Pengembang Terproteksi (Tidak Dapat Dipilih / Dihapus)"
                                >
                                  <Lock size={12} />
                                </span>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(acc.nim)}
                                  onChange={() => handleToggleSelectRow(acc.nim)}
                                  className="rounded border-slate-300 cursor-pointer"
                                />
                              )}
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
                                {normalizeDivisionName(acc.division)}
                              </span>
                              {(isAlifFikri || acc.role === 'Developer') ? (
                                <div className="flex items-center gap-1 mt-0.5 text-[11px] font-bold text-blue-600">
                                  <Code2 size={12} className="text-blue-600 shrink-0" />
                                  <span>Developer</span>
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-500">{acc.role}</p>
                              )}
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
                                {!isAlifFikri ? (
                                  <button
                                    onClick={() => handleDelete(acc.nim, acc.name)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Akun"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                ) : (
                                  <span
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 select-none cursor-default"
                                    title="Akun Master Pengembang (Dilindungi & Tidak Dapat Dihapus)"
                                  >
                                    Utama
                                  </span>
                                )}
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
                      NIM: <span className="font-mono font-bold text-slate-800">{authUser?.nim || '23404053'}</span> • Jabatan: <span className="font-semibold text-slate-800">{authUser?.role || 'Developer'}</span>
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
                    <span>Log Out</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Self-Service Password Management Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Ganti Kata Sandi Akun Mandiri</h3>
                      <p className="text-xs text-slate-500">Perbarui kata sandi login pengurus Anda secara independen dan aman.</p>
                    </div>
                  </div>
                  {onOpenChangePassword && (
                    <button
                      type="button"
                      onClick={onOpenChangePassword}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <KeyRound size={14} />
                      <span>Ubah Kata Sandi Sekarang</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 block">Status Kredensial</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <CheckCircle2 size={13} />
                      Tersinkronisasi Cloud
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 block">Metode Validasi</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block">
                      Verifikasi Sandi Lama
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 block">Standar Keamanan</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block">
                      Minimal 6 Karakter
                    </span>
                  </div>
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
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Impor Massal Data Akun (Script & Spreadsheet)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Gunakan modul import terpadu untuk memasukkan puluhan akun sekaligus via JSON, CSV, atau Excel.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBatchImportModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <Upload size={14} />
                    <span>Buka Modal Import Script</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGS & AUDIT TRAIL */}
          {currentNav === 'logs' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header with Title and Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Audit Trail Real-Time
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentLogs.length} total event tercatat
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Log Aktivitas & Jejak Audit
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Pemantauan terpusat siapa saja yang baru login, timestamp autentikasi, serta rekaman submit formulir & modul organisasi.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                  {/* Dropdown Menu Ekspor XLSX (Bulanan / Tahunan / Semua) */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                      title="Pilihan Ekspor Spreadsheet Excel (.xlsx)"
                    >
                      <FileSpreadsheet size={14} />
                      <span>Ekspor Excel (.xlsx)</span>
                      <ChevronDown size={13} className={`transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExportMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsExportMenuOpen(false)} />
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                            PILIHAN EKSPOR EXCEL (.XLSX)
                          </p>

                        <button
                          type="button"
                          onClick={() => handleExportMonthlyXlsx(selectedLogMonth !== 'all' ? selectedLogMonth : 'all')}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <div className="truncate">
                              <span className="block font-bold">Ekspor Bulanan</span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {selectedLogMonth !== 'all' ? availableLogMonths.find(m => m.key === selectedLogMonth)?.label : 'Bulan Berjalan (November 2026)'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                            .xlsx
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExportYearlyXlsx(2026)}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <div>
                              <span className="block font-bold">Ekspor Tahunan (2026)</span>
                              <span className="text-[10px] text-slate-400 block">Seluruh log tahun 2026</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-100/70 px-1.5 py-0.5 rounded">
                            .xlsx
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleExportAllXlsx}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            <div>
                              <span className="block font-bold">Ekspor Seluruh Log</span>
                              <span className="text-[10px] text-slate-400 block">Semua riwayat sistem ({currentLogs.length} event)</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                            .xlsx
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                  </div>

                  <button
                    onClick={handleExportLogsJson}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
                    title="Unduh log dalam format JSON"
                  >
                    <Download size={14} className="text-slate-500" />
                    <span>JSON</span>
                  </button>
                  {onResetActivityLogs && (
                    <button
                      onClick={onResetActivityLogs}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      title="Reset ke log riwayat default"
                    >
                      <RefreshCw size={13} className="text-slate-400" />
                      <span>Reset</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (onClearActivityLogs) onClearActivityLogs();
                      setLocalLogs([]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    title="Bersihkan seluruh log aktivitas"
                  >
                    <Trash2 size={13} />
                    <span>Bersihkan</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Jejak Audit ({selectedLogMonth === 'all' ? 'Semua' : availableLogMonths.find(m => m.key === selectedLogMonth)?.label})
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {monthLogs.length}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {selectedLogMonth === 'all' ? 'Seluruh riwayat sistem' : `Aktivitas periode ${availableLogMonths.find(m => m.key === selectedLogMonth)?.label}`}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">
                      Aktivitas Login Pengurus
                    </span>
                    <span className="text-2xl font-black text-blue-700 mt-1 block">
                      {loginCount}
                    </span>
                    <span className="text-[11px] text-blue-600/80 mt-0.5 block">
                      Timestamp & identitas tersimpan
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <LogIn size={20} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                      Submit Modul & Formulir
                    </span>
                    <span className="text-2xl font-black text-emerald-700 mt-1 block">
                      {moduleSubmitCount}
                    </span>
                    <span className="text-[11px] text-emerald-600/80 mt-0.5 block">
                      PAR, Timeline, Kontak, Arsip
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Send size={20} />
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar with Monthly Tabs */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                {/* 1. Tab Per Bulan (Monthly Filter Tabs) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-600" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Periode Bulan:
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                    <button
                      type="button"
                      onClick={() => setSelectedLogMonth('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        selectedLogMonth === 'all'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                      }`}
                    >
                      <span>Semua Periode</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        selectedLogMonth === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200/70 text-slate-600'
                      }`}>
                        {currentLogs.length}
                      </span>
                    </button>

                    {availableLogMonths.map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedLogMonth(m.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          selectedLogMonth === m.key
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          selectedLogMonth === m.key ? 'bg-blue-700 text-white' : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {m.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Category Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'Semua Aktivitas', count: monthLogs.length },
                      { id: 'login', label: 'Aktivitas Login', count: loginCount },
                      { id: 'module_submit', label: 'Submit Modul', count: moduleSubmitCount },
                      { id: 'system', label: 'Sistem & Akun', count: systemCount },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setLogFilterCategory(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          logFilterCategory === tab.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          logFilterCategory === tab.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Query */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari user, NIM, event, modul..."
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                    {logSearchQuery && (
                      <button
                        onClick={() => setLogSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Feed Card List */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                {filteredActivityLogs.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                      <Clock size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Tidak ada log aktivitas yang cocok</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Coba ganti filter kategori atau kata kunci pencarian Anda untuk melihat jejak audit lainnya.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredActivityLogs.map((item) => {
                      const isLogin = item.category === 'login';
                      const isModule = item.category === 'module_submit';

                      return (
                        <div
                          key={item.id}
                          className="p-4 sm:p-4.5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Icon Indicator */}
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                              isLogin
                                ? 'bg-blue-50 border-blue-200 text-blue-600'
                                : isModule
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : item.type === 'warning'
                                ? 'bg-amber-50 border-amber-200 text-amber-600'
                                : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}>
                              {isLogin ? (
                                <LogIn size={16} />
                              ) : isModule ? (
                                <Send size={16} />
                              ) : item.type === 'warning' ? (
                                <ShieldCheck size={16} />
                              ) : (
                                <Clock size={16} />
                              )}
                            </div>

                            {/* Event Content & Actor Info */}
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isLogin
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : isModule
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {isLogin ? 'Autentikasi Login' : isModule ? 'Submit Modul' : 'Sistem & Akun'}
                                </span>

                                {(item.module || item.moduleName) && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
                                    Modul: {item.module || item.moduleName}
                                  </span>
                                )}

                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  item.type === 'success' ? 'bg-emerald-500' : item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                }`}></span>
                              </div>

                              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                {item.event}
                              </h4>

                              {item.details && (
                                <p className="text-xs text-slate-600 bg-slate-50/80 border border-slate-100 rounded-lg p-2 font-mono">
                                  {item.details}
                                </p>
                              )}

                              {/* Device Information Pill */}
                              {item.device && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70 text-[11px] font-medium">
                                    {item.device.type === 'Mobile' ? (
                                      <Smartphone size={12} className="text-blue-600 shrink-0" />
                                    ) : item.device.type === 'Tablet' ? (
                                      <Tablet size={12} className="text-blue-600 shrink-0" />
                                    ) : (
                                      <Laptop size={12} className="text-blue-600 shrink-0" />
                                    )}
                                    <span>Perangkat: {item.device.summary || `${item.device.browser} di ${item.device.os}`}</span>
                                  </span>
                                </div>
                              )}

                              {/* Actor Information Block */}
                              {(item.actor || item.userName) && (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                    {item.actor?.name || item.userName}
                                    {(item.actor?.nim || item.userNim) && (item.actor?.nim || item.userNim) !== 'SYSTEM' && (
                                      <span className="font-mono text-slate-400">({item.actor?.nim || item.userNim})</span>
                                    )}
                                  </span>
                                  {(item.actor?.role || item.userRole) && (
                                    <span>• Jabatan: <strong className="text-slate-600">{item.actor?.role || item.userRole}</strong></span>
                                  )}
                                  {(item.actor?.division || item.userDivision) && (
                                    <span>• {item.actor?.division || item.userDivision}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Timestamp Details */}
                          <div className="sm:text-right shrink-0 pl-12 sm:pl-0">
                            <span className="font-mono text-xs font-bold text-slate-800 block">
                              {item.time || item.timestamp || '12:00:00'}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                              {item.date || '07 Nov 2026'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                  Preferensi lingkungan administrator, konfigurasi visual landing page, dan kontrol global.
                </p>
              </div>

              {/* CARD: EDITOR PROFIL PIMPINAN HERO (LANDING PAGE) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          Editor Kartu Profil Pimpinan Hero
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          Landing Page
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ubah nama, jabatan, periode, dan foto profil Pembina &amp; Ketua Umum pada floating cards Hero landing page.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onBackToLanding}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Lihat hasil di Landing Page"
                    >
                      <ExternalLink size={13} />
                      <span>Buka Landing Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetLeadership}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Reset ke profil default"
                    >
                      <RefreshCw size={13} />
                      <span>Reset Default</span>
                    </button>
                  </div>
                </div>

                {/* Split View: Live Preview & Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Live Preview Card (Hero Dark Theme) */}
                  <div className="lg:col-span-5 bg-[#080b16] rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                    <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        Live Preview Hero (Kolom 3)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
                    </div>

                    <div className="relative z-10 space-y-3.5 my-auto py-2">
                      {/* Preview Card 1: Pembina */}
                      <div className="w-full bg-white text-slate-900 rounded-2xl px-4 py-3 flex items-center gap-3.5 shadow-xl border border-gray-100 transition-all">
                        {leadershipForm.pembinaAvatarUrl ? (
                          <img
                            src={leadershipForm.pembinaAvatarUrl}
                            alt={leadershipForm.pembinaName || 'Pembina'}
                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                            {leadershipForm.pembinaName ? leadershipForm.pembinaName.charAt(0) : 'P'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                            {leadershipForm.pembinaName || 'M. Ishak, S.Kom., M.Kom.'}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium truncate">
                            {leadershipForm.pembinaTitle || 'Pembina TERAMEDIA'}
                          </p>
                        </div>
                      </div>

                      {/* Preview Card 2: Ketua Umum */}
                      <div className="w-full bg-white text-slate-900 rounded-2xl px-4 py-3 flex items-center gap-3.5 shadow-xl border border-gray-100 transition-all">
                        {leadershipForm.ketumAvatarUrl ? (
                          <img
                            src={leadershipForm.ketumAvatarUrl}
                            alt={leadershipForm.ketumName || 'Ketua Umum'}
                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                            {leadershipForm.ketumName ? leadershipForm.ketumName.charAt(0) : 'K'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                            {leadershipForm.ketumName || 'Muhammad Toha'}
                          </p>
                          <p className="text-[11px] text-gray-600 font-medium leading-tight truncate">
                            {leadershipForm.ketumTitle || 'Ketua Umum TERAMEDIA'}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {leadershipForm.ketumPeriod || 'Periode 2025-2026'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>TeraDesk OS • Landing Page</span>
                      <span className="text-emerald-400 font-semibold">Tersinkronisasi</span>
                    </div>
                  </div>

                  {/* Right Column: Form Inputs */}
                  <form onSubmit={handleSaveLeadership} className="lg:col-span-7 space-y-4">
                    {/* Pembina Fieldset */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          Kartu 1: Pembina Organisasi
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">Atas</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Nama Lengkap &amp; Gelar
                          </label>
                          <input
                            type="text"
                            value={leadershipForm.pembinaName}
                            onChange={(e) => setLeadershipForm((prev) => ({ ...prev, pembinaName: e.target.value }))}
                            placeholder="M. Ishak, S.Kom., M.Kom."
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Jabatan / Keterangan
                          </label>
                          <input
                            type="text"
                            value={leadershipForm.pembinaTitle}
                            onChange={(e) => setLeadershipForm((prev) => ({ ...prev, pembinaTitle: e.target.value }))}
                            placeholder="Pembina TERAMEDIA"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span>Foto Profil / Avatar</span>
                          <span className="text-[10px] text-slate-400 font-normal">Upload File Gambar atau Tempel URL</span>
                        </label>

                        <div className="space-y-2">
                          {leadershipForm.pembinaAvatarUrl ? (
                            <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                              <img
                                src={leadershipForm.pembinaAvatarUrl}
                                alt="Foto Pembina"
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold text-slate-800 block truncate">
                                  {leadershipForm.pembinaAvatarUrl.startsWith('data:') ? 'Foto Terunggah dari Perangkat' : 'Foto dari URL Web'}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                  <Check size={11} /> Foto Aktif &amp; Siap Ditampilkan
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <label
                                  htmlFor="upload-pembina-settings"
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Ganti foto dengan file lain"
                                >
                                  <Upload size={12} />
                                  <span>Ganti</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setLeadershipForm((prev) => ({ ...prev, pembinaAvatarUrl: '' }))}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus foto dan gunakan avatar inisial"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <label
                                htmlFor="upload-pembina-settings"
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/50 border border-dashed border-blue-300 hover:border-blue-500 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer shadow-2xs group"
                              >
                                <Upload size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span>Pilih &amp; Upload Foto dari Komputer / HP</span>
                              </label>
                            </div>
                          )}

                          <input
                            id="upload-pembina-settings"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLeadershipPhotoUpload(e, 'pembinaAvatarUrl')}
                            className="hidden"
                          />

                          <input
                            type="text"
                            value={leadershipForm.pembinaAvatarUrl}
                            onChange={(e) => setLeadershipForm((prev) => ({ ...prev, pembinaAvatarUrl: e.target.value }))}
                            placeholder="Atau tempel link URL foto langsung di sini..."
                            className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ketua Umum Fieldset */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                          Kartu 2: Ketua Umum Organisasi
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">Bawah</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={leadershipForm.ketumName}
                            onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumName: e.target.value }))}
                            placeholder="Muhammad Toha"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Jabatan / Keterangan
                          </label>
                          <input
                            type="text"
                            value={leadershipForm.ketumTitle}
                            onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumTitle: e.target.value }))}
                            placeholder="Ketua Umum TERAMEDIA"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Periode Kepengurusan
                        </label>
                        <input
                          type="text"
                          value={leadershipForm.ketumPeriod}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumPeriod: e.target.value }))}
                          placeholder="Periode 2025-2026"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span>Foto Profil / Avatar</span>
                          <span className="text-[10px] text-slate-400 font-normal">Upload File Gambar atau Tempel URL</span>
                        </label>

                        <div className="space-y-2">
                          {leadershipForm.ketumAvatarUrl ? (
                            <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                              <img
                                src={leadershipForm.ketumAvatarUrl}
                                alt="Foto Ketua Umum"
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold text-slate-800 block truncate">
                                  {leadershipForm.ketumAvatarUrl.startsWith('data:') ? 'Foto Terunggah dari Perangkat' : 'Foto dari URL Web'}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                  <Check size={11} /> Foto Aktif &amp; Siap Ditampilkan
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <label
                                  htmlFor="upload-ketum-settings"
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Ganti foto dengan file lain"
                                >
                                  <Upload size={12} />
                                  <span>Ganti</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setLeadershipForm((prev) => ({ ...prev, ketumAvatarUrl: '' }))}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus foto dan gunakan avatar inisial"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <label
                                htmlFor="upload-ketum-settings"
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/50 border border-dashed border-blue-300 hover:border-blue-500 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer shadow-2xs group"
                              >
                                <Upload size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span>Pilih &amp; Upload Foto dari Komputer / HP</span>
                              </label>
                            </div>
                          )}

                          <input
                            id="upload-ketum-settings"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLeadershipPhotoUpload(e, 'ketumAvatarUrl')}
                            className="hidden"
                          />

                          <input
                            type="text"
                            value={leadershipForm.ketumAvatarUrl}
                            onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumAvatarUrl: e.target.value }))}
                            placeholder="Atau tempel link URL foto langsung di sini..."
                            className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        {leadershipSaveSuccess && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-in fade-in duration-200">
                            <CheckCircle2 size={14} />
                            <span>Perubahan tersimpan &amp; langsung aktif!</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Simpan Perubahan Hero</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* CARD: TEMA TAMPILAN PANEL ADMIN (LIGHT / DARK MODE) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                      {isAdminDark ? <Moon size={20} className="text-indigo-600" /> : <Sun size={20} className="text-amber-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          Tema Tampilan Panel Admin
                        </h2>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAdminDark ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isAdminDark ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pilih preferensi visual dashboard admin antara mode terang profesional atau mode gelap obsidian untuk kenyamanan mata.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAdminTheme}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:bg-slate-50 shrink-0"
                  >
                    {isAdminDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
                    <span>{isAdminDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Light Mode */}
                  <div
                    onClick={() => {
                      if (isAdminDark) toggleAdminTheme();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      !isAdminDark
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun size={18} className="text-amber-500" />
                        <span className="text-sm font-bold text-slate-900">Mode Terang (Light)</span>
                      </div>
                      {!isAdminDark && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tampilan bersih dengan palet Slate terang dan kontras tinggi. Sangat optimal untuk penggunaan di siang hari dan presentasi resmi.
                    </p>
                  </div>

                  {/* Option 2: Dark Mode */}
                  <div
                    onClick={() => {
                      if (!isAdminDark) toggleAdminTheme();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isAdminDark
                        ? 'border-blue-500 bg-blue-900/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon size={18} className="text-indigo-400" />
                        <span className="text-sm font-bold text-slate-900">Mode Gelap (Obsidian Dark)</span>
                      </div>
                      {isAdminDark && (
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tampilan modern dengan palet Obsidian Slate gelap yang ramah mata. Mengurangi kelelahan mata saat bekerja pada malam hari.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Tombol Cepat Pengembang</p>
                      <p className="text-[11px] text-slate-500">Akses cepat menggunakan tombol kombinasi keyboard</p>
                    </div>
                    <kbd className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700">
                      Ctrl + Shift + D
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. MODAL: TAMBAH MAHASISWA BARU */}
      {isAddFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setIsAddFormOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  <Plus size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftarkan Akun Mahasiswa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-20"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Link to Batch Import */}
            <div className="mb-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-600 shrink-0" />
                <span className="text-xs text-indigo-950 font-medium">
                  Mau input banyak akun sekaligus? Gunakan fitur <strong>Import Script</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddFormOpen(false);
                  setIsBatchImportModalOpen(true);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline shrink-0 cursor-pointer"
              >
                Buka Import ↗
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
                    Jabatan / Peran
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormRole(val);
                      if (val === 'Koordinator Divisi' || val.includes('BPH') || val.includes('Ketua')) {
                        setFormCanAccessAdmin(true);
                      } else {
                        setFormCanAccessAdmin(false);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    <option value="Koordinator Divisi">Koordinator Divisi (Kadiv)</option>
                    <option value="Anggota Biasa">Anggota Biasa / Staf</option>
                    <option value="BPH (Badan Pengurus Harian)">BPH (Badan Pengurus Harian)</option>
                    <option value="Demisioner Ketua Umum">Demisioner Ketua Umum</option>
                  </select>
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

      {/* MODAL: BATCH IMPORT ACCOUNTS (SCRIPT, CSV, & EXCEL) */}
      {isBatchImportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
          onClick={() => {
            if (!isImportingBatch) setIsBatchImportModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 relative my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Import Massal Data Mahasiswa & Akun
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Impor banyak akun sekaligus melalui script JSON, CSV/teks, atau file Excel (.xlsx).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isImportingBatch) setIsBatchImportModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Method Switch & Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
                <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-xs font-bold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBatchImportTab('script')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      batchImportTab === 'script'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tempel Script / Teks
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchImportTab('file')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      batchImportTab === 'file'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Upload Berkas Excel/CSV
                  </button>
                </div>

                {/* Quick Sample / Template Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={handleFillSampleJson}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                  >
                    Contoh JSON
                  </button>
                  <button
                    type="button"
                    onClick={handleFillSampleCsv}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                  >
                    Contoh CSV
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadExcelTemplate}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg border border-slate-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Download format spreadsheet .xlsx"
                  >
                    <Download size={12} />
                    <span>Template Excel</span>
                  </button>
                </div>
              </div>

              {/* Input Area based on Tab */}
              {batchImportTab === 'script' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Area Tempel Script (JSON Array atau Baris CSV)
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Kolom: NIM, Nama, Divisi, Jabatan, Password, AksesAdmin
                    </span>
                  </div>
                  <textarea
                    value={batchRawScript}
                    onChange={(e) => {
                      setBatchRawScript(e.target.value);
                      setBatchImportError('');
                    }}
                    rows={7}
                    placeholder={`Contoh JSON:\n[\n  { "nim": "23404060", "name": "Rian Pratama", "division": "Divisi Kesekretariatan", "role": "Koordinator Divisi (Kadiv)" },\n  { "nim": "23404061", "name": "Nabila Az-Zahra", "division": "Divisi Publikasi dan Dokumentasi", "role": "Anggota Biasa / Staf" }\n]\n\nAtau Contoh Baris CSV:\n23404060, Rian Pratama, Divisi Kesekretariatan, Koordinator Divisi (Kadiv), password123, true\n23404061, Nabila Az-Zahra, Divisi Publikasi dan Dokumentasi, Anggota Biasa / Staf, password123, false`}
                    className="w-full p-3 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono leading-relaxed border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  />
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                    <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-indigo-600" />
                      Opsi Jabatan / Peran Resmi:
                    </span>
                    {OFFICIAL_ROLES.map((r) => (
                      <span
                        key={r.value}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-[11px] shadow-2xs"
                        title={r.canAdmin ? 'Hak akses default: Bisa Akses Admin' : 'Hak akses default: Hanya Portal Layanan'}
                      >
                        {r.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pilih Berkas Spreadsheet atau JSON
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-6 cursor-pointer transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                      <FileSpreadsheet size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {batchFileName ? batchFileName : 'Klik atau seret file .xlsx, .csv, atau .json ke sini'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Mendukung format Microsoft Excel (.xlsx), Comma Separated (.csv), dan JSON
                    </span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv, .json"
                      onChange={handleBatchFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Live Validation Badges Summary */}
              {batchRawScript.trim() && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Hasil Analisis & Validasi Script:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ {batchParseResult.valid.length} Siap Diimpor
                      </span>
                      {batchParseResult.duplicates.length > 0 && (
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          ⚠ {batchParseResult.duplicates.length} Duplikat (Dilewati)
                        </span>
                      )}
                      {batchParseResult.invalid.length > 0 && (
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          ✕ {batchParseResult.invalid.length} Format Salah
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview Table of Parsed Accounts */}
                  {batchParseResult.valid.length > 0 && (
                    <div className="overflow-x-auto max-h-44 border border-slate-200 rounded-xl bg-white shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/80 text-[10px] font-bold text-slate-500 uppercase sticky top-0">
                          <tr>
                            <th className="py-2 px-3">NIM</th>
                            <th className="py-2 px-3">NAMA LENGKAP</th>
                            <th className="py-2 px-3">DIVISI</th>
                            <th className="py-2 px-3">JABATAN</th>
                            <th className="py-2 px-3">AKSES ADMIN</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {batchParseResult.valid.slice(0, 8).map((acc) => (
                            <tr key={acc.nim} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 font-mono font-bold text-slate-900">{acc.nim}</td>
                              <td className="py-2 px-3">{acc.name}</td>
                              <td className="py-2 px-3 text-slate-500 text-[11px]">{acc.division}</td>
                              <td className="py-2 px-3">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                  acc.role === 'Developer'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : acc.role === 'Koordinator Divisi'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : acc.role === 'Demisioner Ketua Umum'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : acc.role.includes('BPH')
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                  {getRoleDisplayLabel(acc.role)}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                {acc.canAccessAdmin ? (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Admin
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Portal</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {batchParseResult.valid.length > 8 && (
                        <div className="p-2 bg-slate-50 text-center text-[11px] text-slate-500 font-medium">
                          ... dan {batchParseResult.valid.length - 8} akun lainnya siap diproses
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {batchImportError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  {batchImportError}
                </p>
              )}

              {batchImportSuccess && (
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{batchImportSuccess}</span>
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 mt-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {batchParseResult.valid.length > 0
                  ? `Siap mengimpor ${batchParseResult.valid.length} akun ke database.`
                  : 'Tempel script atau upload berkas untuk memulai.'}
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  disabled={isImportingBatch}
                  onClick={() => setIsBatchImportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={batchParseResult.valid.length === 0 || isImportingBatch}
                  onClick={handleExecuteBatchImport}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                    batchParseResult.valid.length > 0 && !isImportingBatch
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Upload size={14} />
                  <span>
                    {isImportingBatch
                      ? 'Sedang Mengimpor...'
                      : `Eksekusi Impor (${batchParseResult.valid.length})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: EDIT DATA MAHASISWA & AKUN */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
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
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-20"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
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
                  <select
                    value={editFormRole}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditFormRole(val);
                      if (val === 'Developer' || val === 'Koordinator Divisi' || val.includes('BPH') || val.includes('Ketua')) {
                        setEditFormCanAccessAdmin(true);
                      } else {
                        setEditFormCanAccessAdmin(false);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    {editingTargetNim === '23404053' && (
                      <option value="Developer">Developer (Pengembang Sistem)</option>
                    )}
                    <option value="Koordinator Divisi">Koordinator Divisi (Kadiv)</option>
                    <option value="Anggota Biasa">Anggota Biasa / Staf</option>
                    <option value="BPH (Badan Pengurus Harian)">BPH (Badan Pengurus Harian)</option>
                    <option value="Demisioner Ketua Umum">Demisioner Ketua Umum</option>
                  </select>
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

      {/* 5. MODAL: ADD / EDIT PROGRAM KERJA */}
      {isProkerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setIsProkerModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Bookmark size={15} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {prokerModalMode === 'add' ? 'Tambah Program Kerja Baru' : 'Edit Program Kerja'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kartu ini akan ditampilkan pada tumpukan hero landing page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProkerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-20"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProker} className="space-y-4">
              {/* Judul Kegiatan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Judul Kegiatan / Nama Program Kerja <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={prokerFormTitle}
                  onChange={(e) => setProkerFormTitle(e.target.value)}
                  placeholder="Contoh: Workshop Desain Grafis dengan Audiens Siswa/Siswi SMK Negeri 1 Palopo"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none italic"
                  required
                />
              </div>

              {/* Grid 2 Cols: Badge & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Badge Kartu
                  </label>
                  <input
                    type="text"
                    value={prokerFormBadge}
                    onChange={(e) => setProkerFormBadge(e.target.value)}
                    placeholder="Contoh: Update Program Kerja"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Label Subtitle / Tag
                  </label>
                  <input
                    type="text"
                    value={prokerFormTag}
                    onChange={(e) => setProkerFormTag(e.target.value)}
                    placeholder="Contoh: update terakhir"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium lowercase focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Grid 2 Cols: Tombol Aksi & Target Layanan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Teks Tombol Aksi
                  </label>
                  <input
                    type="text"
                    value={prokerFormActionText}
                    onChange={(e) => setProkerFormActionText(e.target.value)}
                    placeholder="Contoh: cek asesmen program kerja"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tautan Modul Layanan
                  </label>
                  <select
                    value={prokerFormServiceId}
                    onChange={(e) => setProkerFormServiceId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="par">PAR (Program Approval Request)</option>
                    <option value="archive">Digitalisasi E-Arsip & Persuratan</option>
                    <option value="asset">Digitalisasi Aset & Inventaris</option>
                    <option value="finance">Kas & Reimbursement Anggaran</option>
                    <option value="attendance">Presensi Digital & Notula Rapat</option>
                    <option value="timeline">Master Timeline & Kalender Proker</option>
                    <option value="hr">Database Anggota & Kaderisasi</option>
                    <option value="helpdesk">Tiket Desain Pubdok</option>
                    <option value="humas">Humas & Media Partner Gateway</option>
                    <option value="kkm">Kreativitas & Kewirausahaan (KKM)</option>
                  </select>
                </div>
              </div>

              {/* Grid 3 Cols: Divisi, Periode, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Divisi Pelaksana
                  </label>
                  <select
                    value={prokerFormDivision}
                    onChange={(e) => setProkerFormDivision(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {divisionsList.filter(d => d !== 'Semua Divisi').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Periode Kegiatan
                  </label>
                  <input
                    type="text"
                    value={prokerFormPeriod}
                    onChange={(e) => setProkerFormPeriod(e.target.value)}
                    placeholder="Contoh: Maret 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={prokerFormStatus}
                    onChange={(e) => setProkerFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Review">Review</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              {/* Tampilkan di Hero Landing Page Checkbox Toggle */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tampilkan di Hero Landing Page
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Kartu akan ikut dalam tumpukan kartu yang saling overlapping di landing page.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setProkerFormIsVisible(!prokerFormIsVisible)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    prokerFormIsVisible ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      prokerFormIsVisible ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {prokerFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {prokerFormError}
                </div>
              )}

              {prokerFormSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                  {prokerFormSuccess}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProkerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {prokerModalMode === 'add' ? 'Tambah Program Kerja' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DETAIL PESAN KONSULTASI (INBOX DETAIL & RESPONSE)
          ========================================================================= */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-slate-900 select-none max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-20"
              title="Tutup detail pesan"
              aria-label="Tutup detail pesan"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedMessage.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    selectedMessage.status === 'Baru'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : selectedMessage.status === 'Diproses'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {selectedMessage.status}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Detail Pesan Konsultasi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Diterima pada {selectedMessage.date}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs mb-5">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Nama Pengirim</span>
                <span className="font-bold text-slate-900">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Email Aktif</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-bold text-blue-600 hover:underline break-all"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Organisasi / Lembaga</span>
                <span className="font-bold text-slate-800">{selectedMessage.organization}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-blue-600" />
                <span>Isi Pesan / Kebutuhan Khusus</span>
              </h4>
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Status Changer */}
            <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Ubah Status Tindak Lanjut:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Baru', 'Diproses', 'Selesai'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      if (onUpdateConsultationStatus) {
                        onUpdateConsultationStatus(selectedMessage.id, st);
                      }
                      setSelectedMessage((prev) => (prev ? { ...prev, status: st, isRead: true } : null));
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedMessage.status === st
                        ? st === 'Baru'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : st === 'Diproses'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus pesan ini dari arsip kotak masuk?')) {
                    if (onDeleteConsultation) {
                      onDeleteConsultation(selectedMessage.id);
                    }
                    setSelectedMessage(null);
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 py-2 px-3 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Hapus Pesan</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    'Tanggapan Konsultasi TeraDesk - ' + selectedMessage.organization
                  )}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Mail size={14} />
                  <span>Balas via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP: DETAIL PESANAN TIKET DESAIN PUBDOK */}
      {selectedPubdokTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedPubdokTicket(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                    {selectedPubdokTicket.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                    {selectedPubdokTicket.category || selectedPubdokTicket.canvas}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedPubdokTicket.statusColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {selectedPubdokTicket.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {selectedPubdokTicket.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPubdokTicket(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer z-20"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
              {/* Info Pemohon (Siapa yang Mengajukan) */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                  Identitas Pemohon Desain
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nama Pemohon / PIC:</span>
                    <span className="font-bold text-slate-900">{selectedPubdokTicket.requester || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Divisi / Asal Organisasi:</span>
                    <span className="font-bold text-slate-900">{selectedPubdokTicket.division || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Waktu Pengajuan:</span>
                    <span className="font-mono text-slate-700">
                      {selectedPubdokTicket.createdAt ? String(selectedPubdokTicket.createdAt).slice(0, 10) : 'Tercatat di sistem'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Target Selesai (Deadline):</span>
                    <span className="font-bold text-rose-600">
                      {selectedPubdokTicket.deadline || selectedPubdokTicket.targetDate || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Pesanan & Brief */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Pesanan & Brief Pengerjaan
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 block text-[11px] mb-0.5">Format / Dimensi Kanvas:</span>
                    <span className="font-semibold text-slate-800">{selectedPubdokTicket.canvas || selectedPubdokTicket.category}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 block text-[11px] mb-0.5">Desainer Bertanggung Jawab (PIC Pubdok):</span>
                    <span className="font-semibold text-slate-800">{selectedPubdokTicket.designer || selectedPubdokTicket.assignedTo || 'Tim Pubdok'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-medium mb-1.5">
                    Instruksi Khusus & Uraian Brief:
                  </span>
                  <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-200/60">
                    {selectedPubdokTicket.brief && selectedPubdokTicket.brief !== '-'
                      ? selectedPubdokTicket.brief
                      : 'Tidak ada catatan brief khusus yang disertakan.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = `[Tiket ${selectedPubdokTicket.id}] ${selectedPubdokTicket.title}\nPengaju: ${selectedPubdokTicket.requester} (${selectedPubdokTicket.division})\nDeadline: ${selectedPubdokTicket.deadline || selectedPubdokTicket.targetDate}\nBrief: ${selectedPubdokTicket.brief}`;
                    navigator.clipboard?.writeText(textToCopy);
                    alert(`Detail tiket ${selectedPubdokTicket.id} berhasil disalin ke clipboard!`);
                  }}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy size={13} />
                  <span>Salin Info</span>
                </button>
                {onDeleteTicket && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus tiket ${selectedPubdokTicket.id}?`)) {
                        onDeleteTicket(selectedPubdokTicket.id);
                        setSelectedPubdokTicket(null);
                      }
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {(selectedPubdokTicket.status === 'Antrean' || selectedPubdokTicket.status === 'Diajukan') && (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleTicketStatus(selectedPubdokTicket.id, 'Dikerjakan');
                      setSelectedPubdokTicket((prev) => prev ? { ...prev, status: 'Dikerjakan', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' } : null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Mulai Kerjakan
                  </button>
                )}
                {(selectedPubdokTicket.status === 'Dikerjakan' || selectedPubdokTicket.status === 'Sedang Dikerjakan') && (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleTicketStatus(selectedPubdokTicket.id, 'Selesai');
                      setSelectedPubdokTicket((prev) => prev ? { ...prev, status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' } : null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Tandai Selesai
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPubdokTicket(null)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITOR KARTU PROFIL PIMPINAN HERO (LANDING PAGE) */}
      {isLeadershipModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsLeadershipModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Editor Kartu Profil Pimpinan Hero
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      Hero Landing Page
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perubahan nama, jabatan, periode, atau foto akan langsung tampil di kolom kanan Hero landing page.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLeadershipModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Left: Authentic Dark Live Preview */}
                <div className="md:col-span-5 bg-[#080b16] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[290px]">
                  <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-transparent pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      Live Preview Hero
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
                  </div>

                  <div className="relative z-10 space-y-3 my-auto py-2">
                    {/* Card 1: Pembina */}
                    <div className="w-full bg-white text-slate-900 rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-xl border border-gray-100 transition-all">
                      {leadershipForm.pembinaAvatarUrl ? (
                        <img
                          src={leadershipForm.pembinaAvatarUrl}
                          alt={leadershipForm.pembinaName || 'Pembina'}
                          className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                          {leadershipForm.pembinaName ? leadershipForm.pembinaName.charAt(0) : 'P'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                          {leadershipForm.pembinaName || 'M. Ishak, S.Kom., M.Kom.'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium truncate">
                          {leadershipForm.pembinaTitle || 'Pembina TERAMEDIA'}
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Ketua Umum */}
                    <div className="w-full bg-white text-slate-900 rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-xl border border-gray-100 transition-all">
                      {leadershipForm.ketumAvatarUrl ? (
                        <img
                          src={leadershipForm.ketumAvatarUrl}
                          alt={leadershipForm.ketumName || 'Ketua Umum'}
                          className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                          {leadershipForm.ketumName ? leadershipForm.ketumName.charAt(0) : 'K'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                          {leadershipForm.ketumName || 'Muhammad Toha'}
                        </p>
                        <p className="text-[11px] text-gray-600 font-medium leading-tight truncate">
                          {leadershipForm.ketumTitle || 'Ketua Umum TERAMEDIA'}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {leadershipForm.ketumPeriod || 'Periode 2025-2026'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>TeraDesk OS • Landing Page</span>
                    <span className="text-emerald-400 font-semibold">Tersinkronisasi</span>
                  </div>
                </div>

                {/* Right: Form Controls */}
                <form id="hero-leadership-form" onSubmit={handleSaveLeadership} className="md:col-span-7 space-y-4">
                  {/* Card 1: Pembina Inputs */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Kartu 1: Pembina Organisasi
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">Atas</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Lengkap &amp; Gelar
                        </label>
                        <input
                          type="text"
                          value={leadershipForm.pembinaName}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, pembinaName: e.target.value }))}
                          placeholder="M. Ishak, S.Kom., M.Kom."
                          className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Jabatan / Keterangan
                        </label>
                        <input
                          type="text"
                          value={leadershipForm.pembinaTitle}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, pembinaTitle: e.target.value }))}
                          placeholder="Pembina TERAMEDIA"
                          className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Foto Profil / Avatar</span>
                        <span className="text-[10px] text-slate-400 font-normal">Upload File Gambar atau Tempel URL</span>
                      </label>

                      <div className="space-y-2">
                        {leadershipForm.pembinaAvatarUrl ? (
                          <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <img
                              src={leadershipForm.pembinaAvatarUrl}
                              alt="Foto Pembina"
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-bold text-slate-800 block truncate">
                                {leadershipForm.pembinaAvatarUrl.startsWith('data:') ? 'Foto Terunggah dari Perangkat' : 'Foto dari URL Web'}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                <Check size={11} /> Foto Aktif &amp; Siap Ditampilkan
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <label
                                htmlFor="upload-pembina-modal"
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="Ganti foto dengan file lain"
                              >
                                <Upload size={12} />
                                <span>Ganti</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setLeadershipForm((prev) => ({ ...prev, pembinaAvatarUrl: '' }))}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Hapus foto dan gunakan avatar inisial"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="upload-pembina-modal"
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white hover:bg-blue-50/50 border border-dashed border-blue-300 hover:border-blue-500 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer shadow-2xs group"
                            >
                              <Upload size={13} className="group-hover:-translate-y-0.5 transition-transform" />
                              <span>Pilih &amp; Upload Foto dari Komputer / HP</span>
                            </label>
                          </div>
                        )}

                        <input
                          id="upload-pembina-modal"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLeadershipPhotoUpload(e, 'pembinaAvatarUrl')}
                          className="hidden"
                        />

                        <input
                          type="text"
                          value={leadershipForm.pembinaAvatarUrl}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, pembinaAvatarUrl: e.target.value }))}
                          placeholder="Atau tempel link URL foto langsung di sini..."
                          className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Ketua Umum Inputs */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        Kartu 2: Ketua Umum Organisasi
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">Bawah</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={leadershipForm.ketumName}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumName: e.target.value }))}
                          placeholder="Muhammad Toha"
                          className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Jabatan / Keterangan
                        </label>
                        <input
                          type="text"
                          value={leadershipForm.ketumTitle}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumTitle: e.target.value }))}
                          placeholder="Ketua Umum TERAMEDIA"
                          className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Periode Kepengurusan
                      </label>
                      <input
                        type="text"
                        value={leadershipForm.ketumPeriod}
                        onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumPeriod: e.target.value }))}
                        placeholder="Periode 2025-2026"
                        className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Foto Profil / Avatar</span>
                        <span className="text-[10px] text-slate-400 font-normal">Upload File Gambar atau Tempel URL</span>
                      </label>

                      <div className="space-y-2">
                        {leadershipForm.ketumAvatarUrl ? (
                          <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <img
                              src={leadershipForm.ketumAvatarUrl}
                              alt="Foto Ketua Umum"
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-bold text-slate-800 block truncate">
                                {leadershipForm.ketumAvatarUrl.startsWith('data:') ? 'Foto Terunggah dari Perangkat' : 'Foto dari URL Web'}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                <Check size={11} /> Foto Aktif &amp; Siap Ditampilkan
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <label
                                htmlFor="upload-ketum-modal"
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="Ganti foto dengan file lain"
                              >
                                <Upload size={12} />
                                <span>Ganti</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setLeadershipForm((prev) => ({ ...prev, ketumAvatarUrl: '' }))}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Hapus foto dan gunakan avatar inisial"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="upload-ketum-modal"
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white hover:bg-indigo-50/50 border border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-all cursor-pointer shadow-2xs group"
                            >
                              <Upload size={13} className="group-hover:-translate-y-0.5 transition-transform" />
                              <span>Pilih &amp; Upload Foto dari Komputer / HP</span>
                            </label>
                          </div>
                        )}

                        <input
                          id="upload-ketum-modal"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLeadershipPhotoUpload(e, 'ketumAvatarUrl')}
                          className="hidden"
                        />

                        <input
                          type="text"
                          value={leadershipForm.ketumAvatarUrl}
                          onChange={(e) => setLeadershipForm((prev) => ({ ...prev, ketumAvatarUrl: e.target.value }))}
                          placeholder="Atau tempel link URL foto langsung di sini..."
                          className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetLeadership}
                  className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Kembalikan data ke profil default"
                >
                  <RefreshCw size={13} />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLeadershipModalOpen(false);
                    onBackToLanding?.();
                  }}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Buka Landing Page</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {leadershipSaveSuccess && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 size={14} />
                    <span>Tersimpan!</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsLeadershipModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  form="hero-leadership-form"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Incoming Message Toast */}
      {inboxToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200 p-4 transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Bell size={20} className="animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                  Pesan Masuk Real-Time
                </span>
                <button
                  type="button"
                  onClick={() => setInboxToast(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title="Tutup notifikasi"
                >
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1.5 truncate">
                {inboxToast.name}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                {inboxToast.subject}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentNav('inbox');
                    const found = consultationMessages.find((m) => m.id === inboxToast.id);
                    if (found) setSelectedMessage(found);
                    setInboxToast(null);
                  }}
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Inbox size={13} />
                  <span>Buka Pesan</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">{inboxToast.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BUAT / EDIT PENGUMUMAN BPH */}
      {isAnnModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsAnnModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-2xl p-5 sm:p-7 relative my-8 animate-in zoom-in-95 duration-150 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {editingAnnId ? 'Edit Maklumat Pengumuman BPH' : 'Buat Maklumat / Pengumuman BPH Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maklumat aktif otomatis memunculkan pop-up window kepada anggota setelah login di portal atau modul layanan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnnModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAnn} className="space-y-4">
              {/* Judul Pengumuman */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pengumuman / Maklumat Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={annFormTitle}
                  onChange={(e) => setAnnFormTitle(e.target.value)}
                  placeholder="Contoh: Pemberitahuan Wajib: Rapat Pleno Evaluasi Kinerja Tengah Periode"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* 2 Kolom: Kategori & Prioritas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Maklumat
                  </label>
                  <select
                    value={annFormCategory}
                    onChange={(e) => setAnnFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Rapat Pleno">Rapat Pleno</option>
                    <option value="Instruksi">Instruksi Organisasi</option>
                    <option value="Penting">Pemberitahuan Penting</option>
                    <option value="Kegiatan">Informasi Kegiatan / Event</option>
                    <option value="Informasi">Informasi Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={annFormPriority}
                    onChange={(e) => setAnnFormPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="urgent">🔴 Mendesak & Wajib (Badge Merah)</option>
                    <option value="important">🟡 Penting (Badge Amber)</option>
                    <option value="normal">🔵 Informasi Biasa (Badge Biru)</option>
                  </select>
                </div>
              </div>

              {/* 2 Kolom: Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Rilis / Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={annFormDate}
                    onChange={(e) => setAnnFormDate(e.target.value)}
                    placeholder="Contoh: 12 Nov 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={annFormTime}
                    onChange={(e) => setAnnFormTime(e.target.value)}
                    placeholder="Contoh: 19:30 WITA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 2 Kolom: Lokasi & Target Audiens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tempat / Media Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={annFormLocation}
                    onChange={(e) => setAnnFormLocation(e.target.value)}
                    placeholder="Contoh: Studio Multimedia Kampus II / Google Meet"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Audiens
                  </label>
                  <input
                    type="text"
                    value={annFormTarget}
                    onChange={(e) => setAnnFormTarget(e.target.value)}
                    placeholder="Contoh: Semua Anggota / Seluruh Divisi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 2 Kolom: Tautan Modul & Label Tombol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tautan Cepat ke Modul Layanan (Opsional)
                  </label>
                  <select
                    value={annFormActionServiceId}
                    onChange={(e) => setAnnFormActionServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">Tidak Ada Tautan Modul</option>
                    <option value="attendance">Presensi Rapat & Notula</option>
                    <option value="par">Persetujuan Program Kerja (PAR)</option>
                    <option value="archive">Digitalisasi Arsip & E-Surat</option>
                    <option value="asset">Digitalisasi Aset & Inventaris</option>
                    <option value="finance">Kas & Reimbursement Anggaran</option>
                    <option value="timeline">Master Timeline & Kalender</option>
                    <option value="hr">Database SDM & Anggota</option>
                    <option value="helpdesk">TeraHelpdesk Desain & Support</option>
                    <option value="humas">Humas & Kolaborasi Media</option>
                    <option value="kkm">Merchandise & Usaha KKM</option>
                    <option value="activity">Arsip Kegiatan & Dokumentasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Label Tombol Modul
                  </label>
                  <input
                    type="text"
                    value={annFormActionText}
                    onChange={(e) => setAnnFormActionText(e.target.value)}
                    placeholder="Contoh: Buka Jadwal Presensi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Isi Pengumuman Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Maklumat / Pengumuman Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={annFormContent}
                  onChange={(e) => setAnnFormContent(e.target.value)}
                  placeholder="Tuliskan isi maklumat, poin-poin agenda, instruksi kepatuhan, atau arahan BPH secara jelas..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              {/* Checkboxes: Status Tayang & Pin */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={annFormIsActive}
                    onChange={(e) => setAnnFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Aktifkan Langsung (Tayang Pop-up)</span>
                    <span className="text-[11px] text-slate-500">Anggota akan melihat pop-up window setelah login.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={annFormIsPinned}
                    onChange={(e) => setAnnFormIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Sematkan di Atas (Pin to Top)</span>
                    <span className="text-[11px] text-slate-500">Prioritas utama dalam urutan pengumuman.</span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingAnnId ? 'Simpan Perubahan Maklumat' : 'Terbitkan Maklumat BPH'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT KETERBACAAN & READ RECEIPTS MAKLUMAT BPH */}
      {auditAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setAuditAnnouncement(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full border border-slate-100 shadow-2xl p-5 sm:p-7 relative my-8 animate-in zoom-in-95 duration-150 text-slate-800 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500" />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-3 shrink-0 pt-1">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs shadow-indigo-500/20 mt-0.5">
                  <CheckCheck size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Audit Keterbacaan BPH
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {auditAnnouncement.category || 'Maklumat'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      auditAnnouncement.priority === 'urgent'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : auditAnnouncement.priority === 'important'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {auditAnnouncement.priority === 'urgent' ? 'Mendesak & Wajib' : auditAnnouncement.priority === 'important' ? 'Penting' : 'Informasi'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {auditAnnouncement.date} ({auditAnnouncement.time})
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                    {auditAnnouncement.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Memantau kepatuhan dan presensi konfirmasi seluruh anggota terhadap maklumat resmi yang diterbitkan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuditAnnouncement(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Tutup Audit"
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 shrink-0">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span className="font-semibold">Total Pengurus Terdaftar</span>
                  <Users size={15} className="text-slate-400" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {auditData.total}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Seluruh akun aktif di database</p>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
                <div className="flex items-center justify-between text-emerald-700 text-xs mb-1">
                  <span className="font-semibold">Sudah Konfirmasi</span>
                  <CheckCircle2 size={15} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700 flex items-baseline gap-2">
                  <span>{auditData.read}</span>
                  <span className="text-xs font-bold text-emerald-600">({auditData.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-200/60 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(auditData.percentage, auditData.read > 0 ? 5 : 0))}%` }}
                  />
                </div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
                  <span className="font-semibold">Belum Membaca</span>
                  <Clock size={15} className="text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-700 flex items-baseline gap-2">
                  <span>{auditData.unread}</span>
                  <span className="text-xs font-bold text-amber-600">
                    ({auditData.total > 0 ? 100 - auditData.percentage : 0}%)
                  </span>
                </div>
                <p className="text-[10px] text-amber-700 mt-0.5">Perlu tindak lanjut / pengingat</p>
              </div>
            </div>

            {/* Action Bar (Copy WA Reminder + Export XLSX) & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-3 shrink-0">
              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUnreadReminder}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                    auditCopied
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                  title="Salin template teks pengingat untuk di-paste langsung ke grup WhatsApp"
                >
                  {auditCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{auditCopied ? 'Tersalin untuk WhatsApp!' : `Salin Pesan WA (${auditData.unread} Orang)`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportAuditXLSX}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
                  title="Ekspor laporan audit keterbacaan ke Excel (.xlsx)"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Unduh Rekap Excel</span>
                </button>
              </div>

              {/* Search Member input */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  placeholder="Cari nama, NIM, atau divisi..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs & Division Select */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setAuditStatusFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    auditStatusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({auditData.total})
                </button>
                <button
                  type="button"
                  onClick={() => setAuditStatusFilter('read')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    auditStatusFilter === 'read'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Sudah Konfirmasi ({auditData.read})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuditStatusFilter('unread')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    auditStatusFilter === 'unread'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Belum Membaca ({auditData.unread})</span>
                </button>
              </div>

              <select
                value={auditDivisionFilter}
                onChange={(e) => setAuditDivisionFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
              >
                <option value="all">Semua Divisi UKM</option>
                {OFFICIAL_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            {/* Member List (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-3 divide-y divide-slate-100">
              {filteredAuditMembers.map((member) => (
                <div
                  key={member.nim}
                  className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 p-2 rounded-xl transition-colors"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        member.isRead
                          ? 'bg-emerald-600 text-white shadow-2xs shadow-emerald-500/20'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {member.name}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400">
                          {member.nim}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.2 rounded-md truncate max-w-[150px] sm:max-w-none">
                          {member.division}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded-md border border-blue-100">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Confirmation Status */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {member.isRead ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span>Dikonfirmasi</span>
                        </span>
                        {member.readAt && (
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {new Date(member.readAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            WITA
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                        <Clock size={12} className="text-amber-600" />
                        <span>Belum Konfirmasi</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredAuditMembers.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Users size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">
                    Tidak ada anggota pengurus yang cocok
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Coba sesuaikan kata kunci pencarian atau ganti filter status di atas.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 shrink-0 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>Audit ini diverifikasi secara otomatis saat anggota menekan persetujuan di pop-up modal.</span>
              </div>

              <button
                type="button"
                onClick={() => setAuditAnnouncement(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;

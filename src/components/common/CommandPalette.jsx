import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  FileCheck2,
  FolderArchive,
  Boxes,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Users,
  Headphones,
  Globe,
  ShoppingBag,
  CalendarCheck,
  Home,
  LayoutGrid,
  ShieldCheck,
  MessageSquare,
  Clock,
  FileSpreadsheet,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ArrowRight,
  CornerDownLeft,
  Tag,
  Ticket,
  FileText,
  UserCheck
} from 'lucide-react';
import { getSoundMuted, setSoundMuted, playNotificationChime } from '../../utils/notificationSound';
import { exportLogsToXLSX } from '../../utils/logExporter';

// 11 Definisi Modul Layanan TeraDesk (Wajib Lengkap & Konsisten)
const MODULES_CONFIG = [
  {
    id: 'par',
    title: 'PAR (Program Approval Request)',
    subtitle: 'Alur persetujuan proposal program kerja bertingkat & tanda tangan digital',
    division: 'BPH & Kesekretariatan',
    category: 'Administrasi & Legalitas',
    badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    icon: FileCheck2,
    keywords: ['par', 'proposal', 'persetujuan', 'approval', 'bph', 'pembina', 'pengesahan', 'proker'],
  },
  {
    id: 'archive',
    title: 'Digitalisasi E-Arsip & Persuratan',
    subtitle: 'Repositori cloud surat masuk/keluar, SK, dan generator nomor surat anti-bentrok',
    division: 'Divisi Kesekretariatan',
    category: 'Administrasi & Legalitas',
    badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    icon: FolderArchive,
    keywords: ['arsip', 'surat', 'e-arsip', 'sk', 'nomor surat', 'lpj', 'dokumen', 'surat masuk', 'surat keluar'],
  },
  {
    id: 'asset',
    title: 'Digitalisasi Aset & Inventaris',
    subtitle: 'Katalog alat multimedia (kamera, mic, proyektor) & peminjaman ruangan',
    division: 'Logistik & Operasional',
    category: 'Operasional & Aset',
    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    icon: Boxes,
    keywords: ['aset', 'inventaris', 'alat', 'kamera', 'pinjam', 'booking', 'mic', 'sony', 'ruang rapat', 'logistik'],
  },
  {
    id: 'finance',
    title: 'Kas & Reimbursement Anggaran',
    subtitle: 'Pencatatan kas masuk/keluar, reimbursement nota belanja & pagu anggaran',
    division: 'Bendahara & Keuangan',
    category: 'Keuangan & Anggaran',
    badgeColor: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
    icon: Receipt,
    keywords: ['kas', 'keuangan', 'uang', 'reimbursement', 'anggaran', 'nota', 'kwitansi', 'saldo', 'bendahara'],
  },
  {
    id: 'attendance',
    title: 'Presensi Digital QR Code & Notula',
    subtitle: 'Absensi cepat via scan QR proyektor, pembuat notula otomatis & action items PIC',
    division: 'Divisi Kaderisasi',
    category: 'Tata Kelola SDM',
    badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    icon: ClipboardCheck,
    keywords: ['presensi', 'absen', 'kehadiran', 'qr', 'notula', 'rapat', 'action items', 'kaderisasi'],
  },
  {
    id: 'timeline',
    title: 'Master Timeline & Kalender Proker',
    subtitle: 'Roadmap kalender kegiatan tahunan seluruh divisi untuk cegah bentrok jadwal',
    division: 'Internal & Proker',
    category: 'Operasional & Aset',
    badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    icon: CalendarRange,
    keywords: ['timeline', 'kalender', 'jadwal', 'proker', 'gantt', 'kegiatan', 'roadmap', 'program kerja'],
  },
  {
    id: 'hr',
    title: 'Database Anggota & Struktur SDM',
    subtitle: 'Direktori kepengurusan lengkap, profil keahlian, dan sertifikat kepengurusan',
    division: 'Litbang & SDM',
    category: 'Tata Kelola SDM',
    badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    icon: Users,
    keywords: ['hr', 'sdm', 'anggota', 'pengurus', 'struktur', 'nim', 'jabatan', 'litbang', 'mahasiswa'],
  },
  {
    id: 'helpdesk',
    title: 'Helpdesk & Request Desain Pubdok',
    subtitle: 'Sistem antrean tiket brief desain publikasi (Feed, Story, Banner, Poster)',
    division: 'Publikasi & Dokumentasi',
    category: 'Publikasi & Media',
    badgeColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    icon: Headphones,
    keywords: ['helpdesk', 'desain', 'tiket', 'pubdok', 'feed', 'poster', 'banner', 'story', 'instagram', 'medinfo'],
  },
  {
    id: 'humas',
    title: 'Humas & Media Partner Gateway',
    subtitle: 'Portal permohonan media partner eksternal, barter publikasi & kontak relasi mitra',
    division: 'Divisi Humas & Media',
    category: 'Hubungan Masyarakat',
    badgeColor: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
    icon: Globe,
    keywords: ['humas', 'media partner', 'medpart', 'mitra', 'relasi', 'kolaborasi', 'promosi', 'eksternal'],
  },
  {
    id: 'kkm',
    title: 'Kreativitas & Kewirausahaan (KKM)',
    subtitle: 'Pre-order merchandise resmi, penyewaan alat multimedia, & buku laba rugi usaha',
    division: 'Dana Usaha (KKM)',
    category: 'Kewirausahaan Mahasiswa',
    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    icon: ShoppingBag,
    keywords: ['kkm', 'usaha', 'merchandise', 'preorder', 'kaos', 'lanyard', 'sewa kamera', 'laba rugi', 'danus'],
  },
  {
    id: 'activity',
    title: 'Arsip Kegiatan & Dokumentasi',
    subtitle: 'Dokumentasi foto, riwayat kegiatan sukses, dan berkas LPJ resmi lintas divisi',
    division: 'Semua Divisi',
    category: 'Dokumentasi & Kegiatan',
    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    icon: CalendarCheck,
    keywords: ['kegiatan', 'arsip kegiatan', 'dokumentasi', 'event', 'foto', 'lpj', 'partisipan', 'riwayat'],
  },
];

const CATEGORY_TABS = [
  { id: 'semua', label: 'Semua' },
  { id: 'modul', label: '11 Modul Layanan' },
  { id: 'navigasi', label: 'Halaman & Menu' },
  { id: 'data', label: 'Data & Entitas' },
  { id: 'aksi', label: 'Aksi Cepat' },
];

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenContact,
  authUser,
  accounts = [],
  prokerList = [],
  tickets = [],
  archiveDocs = [],
  suratLog = [],
  assets = [],
  activityLogs = [],
  consultationMessages = [],
}) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('semua');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSoundMutedState, setIsSoundMutedState] = useState(() => getSoundMuted());
  const [toastMessage, setToastMessage] = useState(null);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Toast auto dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // 1. Navigation items
  const navigationItems = useMemo(() => {
    const list = [
      {
        id: 'nav-landing',
        type: 'navigasi',
        title: 'Beranda Utama TeraDesk',
        subtitle: 'Halaman showcase, program kerja unggulan, dan profil TERAMEDIA',
        badge: 'Halaman',
        icon: Home,
        iconColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
        action: () => {
          onNavigate('landing');
          onClose();
        },
        keywords: ['beranda', 'home', 'landing', 'depan', 'profil', 'tentang kami'],
      },
      {
        id: 'nav-portal',
        type: 'navigasi',
        title: 'Workspace Hub (Katalog 11 Modul)',
        subtitle: 'Katalog interaktif seluruh 11 modul layanan digital organisasi',
        badge: 'Portal',
        icon: LayoutGrid,
        iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        action: () => {
          onNavigate('portal');
          onClose();
        },
        keywords: ['portal', 'workspace', 'katalog', 'layanan', 'modul', 'hub', 'semua modul'],
      },
      {
        id: 'nav-contact',
        type: 'navigasi',
        title: 'Kontak Kami & Konsultasi Organisasi',
        subtitle: 'Buka formulir permohonan konsultasi atau kerjasama dengan pengurus',
        badge: 'Modal',
        icon: MessageSquare,
        iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
        action: () => {
          onClose();
          onOpenContact();
        },
        keywords: ['kontak', 'konsultasi', 'hubungi', 'pesan', 'kerjasama', 'bph'],
      },
    ];

    // Menu khusus Admin & BPH jika memiliki izin akses
    if (authUser?.canAccessAdmin) {
      list.push(
        {
          id: 'nav-admin-dashboard',
          type: 'navigasi',
          title: 'Panel Admin: Dashboard Eksekutif',
          subtitle: 'Ringkasan metrik statistik operasional & shortcut administrasi (Ctrl+Shift+D)',
          badge: 'Admin Panel',
          icon: ShieldCheck,
          iconColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
          action: () => {
            onNavigate('admin', null, true, 'dashboard');
            onClose();
          },
          keywords: ['admin', 'dashboard', 'eksekutif', 'overview', 'ringkasan', 'statistik'],
        },
        {
          id: 'nav-admin-inbox',
          type: 'navigasi',
          title: 'Panel Admin: Kotak Masuk Konsultasi',
          subtitle: `Kelola pesan & konsultasi masuk (${consultationMessages.length} pesan tercatat)`,
          badge: 'Admin Inbox',
          icon: MessageSquare,
          iconColor: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
          action: () => {
            onNavigate('admin', null, true, 'inbox');
            onClose();
          },
          keywords: ['inbox', 'pesan', 'kotak masuk', 'konsultasi', 'pertanyaan', 'tamu'],
        },
        {
          id: 'nav-admin-students',
          type: 'navigasi',
          title: 'Panel Admin: Kelola Pengurus & Akun',
          subtitle: `Manajemen autentikasi login NIM dan peran pengurus (${accounts.length} akun)`,
          badge: 'Admin SDM',
          icon: Users,
          iconColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
          action: () => {
            onNavigate('admin', null, true, 'students');
            onClose();
          },
          keywords: ['akun', 'pengurus', 'mahasiswa', 'user', 'password', 'role', 'akses', 'nim'],
        },
        {
          id: 'nav-admin-logs',
          type: 'navigasi',
          title: 'Panel Admin: Log Aktivitas & Audit Trail',
          subtitle: `Rekam jejak histori login, submit formulir, dan ekspor xlsx (${activityLogs.length} entri)`,
          badge: 'Admin Logs',
          icon: Clock,
          iconColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
          action: () => {
            onNavigate('admin', null, true, 'logs');
            onClose();
          },
          keywords: ['log', 'aktivitas', 'audit', 'riwayat', 'histori', 'login', 'perangkat', 'device'],
        },
        {
          id: 'nav-admin-proker',
          type: 'navigasi',
          title: 'Panel Admin: Master Showcase Proker Beranda',
          subtitle: 'Pengaturan kartu program kerja unggulan di beranda utama',
          badge: 'Admin Proker',
          icon: CalendarRange,
          iconColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
          action: () => {
            onNavigate('admin', null, true, 'proker');
            onClose();
          },
          keywords: ['proker', 'showcase', 'slider', 'beranda', 'kelola proker'],
        }
      );
    } else {
      list.push({
        id: 'nav-login',
        type: 'navigasi',
        title: authUser ? `Profil Akun: ${authUser.name} (${authUser.nim})` : 'Login Pengurus Organisasi',
        subtitle: authUser
          ? `Status: ${authUser.role} • Akses Admin: ${authUser.canAccessAdmin ? 'Ya' : 'Terbatas'}`
          : 'Masuk dengan NIM dan password pengurus untuk membuka workspace',
        badge: authUser ? 'Sesi Aktif' : 'Autentikasi',
        icon: UserCheck,
        iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
        action: () => {
          if (!authUser) {
            onNavigate('login');
          }
          onClose();
        },
        keywords: ['login', 'masuk', 'profil', 'akun', 'nim', 'pengurus'],
      });
    }

    return list;
  }, [authUser, consultationMessages.length, accounts.length, activityLogs.length, onNavigate, onClose, onOpenContact]);

  // 2. Module items (11 Modul)
  const moduleItems = useMemo(() => {
    return MODULES_CONFIG.map((mod) => ({
      id: `modul-${mod.id}`,
      type: 'modul',
      serviceId: mod.id,
      title: mod.title,
      subtitle: mod.subtitle,
      badge: mod.division,
      icon: mod.icon,
      iconColor: mod.badgeColor,
      action: () => {
        onNavigate('service', mod.id);
        onClose();
      },
      keywords: mod.keywords,
    }));
  }, [onNavigate, onClose]);

  // 3. Dynamic Data Search Items (Accounts, Tickets, Assets, Letters, Proker)
  const dynamicDataItems = useMemo(() => {
    const items = [];
    const qLower = query.toLowerCase().trim();

    // Akun Pengurus
    accounts.forEach((acc) => {
      const matchText = `${acc.name} ${acc.nim} ${acc.role} ${acc.division || ''}`.toLowerCase();
      if (!qLower || matchText.includes(qLower)) {
        items.push({
          id: `data-acc-${acc.id || acc.nim}`,
          type: 'data',
          categoryName: 'Pengurus & Anggota',
          title: `${acc.name} (${acc.nim})`,
          subtitle: `${acc.role} • Divisi: ${acc.division || 'BPH'} • Akses: ${acc.canAccessAdmin ? 'Admin' : 'Anggota'}`,
          badge: acc.division || 'SDM',
          icon: Users,
          iconColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
          action: () => {
            if (authUser?.canAccessAdmin) {
              onNavigate('admin', null, true, 'students');
            } else {
              onNavigate('service', 'hr');
            }
            onClose();
          },
          keywords: [acc.name, acc.nim, acc.role, acc.division || ''],
        });
      }
    });

    // Tiket Desain Pubdok
    tickets.forEach((t) => {
      const matchText = `${t.id} ${t.title} ${t.requester} ${t.division || ''} ${t.category || t.canvas || ''}`.toLowerCase();
      if (!qLower || matchText.includes(qLower)) {
        items.push({
          id: `data-ticket-${t.id}`,
          type: 'data',
          categoryName: 'Tiket Desain Pubdok',
          title: `Tiket #${t.id}: ${t.title}`,
          subtitle: `Status: ${t.status} • Pemohon: ${t.requester} (${t.division || 'Umum'}) • Kanvas: ${t.category || t.canvas || 'Feed'}`,
          badge: t.status,
          icon: Ticket,
          iconColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
          action: () => {
            onNavigate('service', 'helpdesk');
            onClose();
          },
          keywords: [t.id, t.title, t.requester, t.status],
        });
      }
    });

    // Aset & Inventaris
    assets.forEach((a) => {
      const matchText = `${a.code || a.id} ${a.name} ${a.category || ''} ${a.status || ''} ${a.location || ''}`.toLowerCase();
      if (!qLower || matchText.includes(qLower)) {
        items.push({
          id: `data-asset-${a.code || a.id}`,
          type: 'data',
          categoryName: 'Aset Multimedia',
          title: `${a.code || 'AST'}: ${a.name}`,
          subtitle: `Kondisi: ${a.status || 'Tersedia'} • Kategori: ${a.category || 'Alat'} • Lokasi: ${a.location || 'Sekretariat'}`,
          badge: a.status || 'Aset',
          icon: Boxes,
          iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          action: () => {
            onNavigate('service', 'asset');
            onClose();
          },
          keywords: [a.code, a.name, a.category, a.status],
        });
      }
    });

    // Surat & Dokumen E-Arsip
    const combinedDocs = [...(archiveDocs || []), ...(suratLog || [])];
    combinedDocs.forEach((doc, idx) => {
      const noSurat = doc.noSurat || doc.nomorSurat || `SURAT-${idx + 1}`;
      const perihal = doc.perihal || doc.title || 'Dokumen Persuratan';
      const matchText = `${noSurat} ${perihal} ${doc.kategori || doc.jenis || ''}`.toLowerCase();
      if (!qLower || matchText.includes(qLower)) {
        items.push({
          id: `data-doc-${noSurat}-${idx}`,
          type: 'data',
          categoryName: 'Dokumen Persuratan',
          title: `${noSurat} — ${perihal}`,
          subtitle: `Kategori: ${doc.kategori || doc.jenis || 'Dokumen'} • Tanggal: ${doc.date || doc.tanggal || '2026'}`,
          badge: 'E-Arsip',
          icon: FileText,
          iconColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
          action: () => {
            onNavigate('service', 'archive');
            onClose();
          },
          keywords: [noSurat, perihal, doc.kategori || ''],
        });
      }
    });

    // Program Kerja (Proker)
    prokerList.forEach((p) => {
      const matchText = `${p.title} ${p.division || ''} ${p.period || ''} ${p.location || ''}`.toLowerCase();
      if (!qLower || matchText.includes(qLower)) {
        items.push({
          id: `data-proker-${p.id}`,
          type: 'data',
          categoryName: 'Program Kerja',
          title: `Proker: ${p.title}`,
          subtitle: `Divisi: ${p.division} • Periode: ${p.period || '2026'} • Tempat: ${p.location || 'Kampus'}`,
          badge: p.division,
          icon: CalendarRange,
          iconColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
          action: () => {
            onNavigate('service', p.actionServiceId || 'timeline');
            onClose();
          },
          keywords: [p.title, p.division, p.period || ''],
        });
      }
    });

    return items;
  }, [accounts, tickets, assets, archiveDocs, suratLog, prokerList, query, authUser, onNavigate, onClose]);

  // 4. Quick Actions
  const actionItems = useMemo(() => {
    return [
      {
        id: 'action-export-xlsx',
        type: 'aksi',
        title: 'Ekspor Seluruh Log Aktivitas (.xlsx)',
        subtitle: `Unduh spreadsheet audit trail ${activityLogs.length} rekam jejak pengguna dalam format Excel`,
        badge: 'Excel .XLSX',
        icon: FileSpreadsheet,
        iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
        action: () => {
          exportLogsToXLSX(activityLogs, 'teradesk_log_aktivitas_semua.xlsx', 'Semua Log');
          showToast('File spreadsheet Excel berhasil diunduh!');
          onClose();
        },
        keywords: ['ekspor', 'export', 'excel', 'xlsx', 'download', 'log', 'unduh'],
      },
      {
        id: 'action-toggle-sound',
        type: 'aksi',
        title: isSoundMutedState ? 'Aktifkan Suara Notifikasi' : 'Senyapkan Suara Notifikasi (Mute)',
        subtitle: `Status saat ini: ${isSoundMutedState ? 'Senyap (Muted)' : 'Aktif (Bunyi kristal "tinggg" saat inbox baru)'}`,
        badge: isSoundMutedState ? 'Muted' : 'Sound On',
        icon: isSoundMutedState ? Volume2 : VolumeX,
        iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        action: () => {
          const next = !isSoundMutedState;
          setSoundMuted(next);
          setIsSoundMutedState(next);
          if (!next) {
            playNotificationChime();
            showToast('Suara notifikasi diaktifkan!');
          } else {
            showToast('Suara notifikasi disenyapkan!');
          }
        },
        keywords: ['suara', 'sound', 'notifikasi', 'ting', 'mute', 'unmute', 'audio', 'lonceng'],
      },
      {
        id: 'action-new-ticket',
        type: 'aksi',
        title: 'Buat Tiket Permohonan Desain Baru',
        subtitle: 'Buka formulir pengajuan desain Pubdok (Instagram Feed, Story, Backdrop)',
        badge: 'Helpdesk',
        icon: Headphones,
        iconColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
        action: () => {
          onNavigate('service', 'helpdesk');
          onClose();
        },
        keywords: ['tiket', 'desain', 'pesan desain', 'pubdok', 'request', 'form'],
      },
      {
        id: 'action-new-par',
        type: 'aksi',
        title: 'Ajukan Proposal PAR (Program Approval Request)',
        subtitle: 'Unggah lembar persetujuan proker ke alur validasi bertingkat BPH & Pembina',
        badge: 'PAR Modul',
        icon: FileCheck2,
        iconColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
        action: () => {
          onNavigate('service', 'par');
          onClose();
        },
        keywords: ['par', 'proposal', 'ajukan proposal', 'program kerja', 'approval'],
      },
      {
        id: 'action-new-letter',
        type: 'aksi',
        title: 'Generate Nomor Surat Keluar Otomatis',
        subtitle: 'Dapatkan kode penomoran resmi organisasi instan tanpa bentrok nomor',
        badge: 'E-Arsip',
        icon: FolderArchive,
        iconColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
        action: () => {
          onNavigate('service', 'archive');
          onClose();
        },
        keywords: ['surat', 'nomor surat', 'buat surat', 'arsip', 'penomoran'],
      },
      {
        id: 'action-borrow-asset',
        type: 'aksi',
        title: 'Pinjam Alat Multimedia atau Ruangan',
        subtitle: 'Cek jadwal ketersediaan kamera Sony A7, mic wireless, dan ruang sekretariat',
        badge: 'Inventaris',
        icon: Boxes,
        iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        action: () => {
          onNavigate('service', 'asset');
          onClose();
        },
        keywords: ['pinjam alat', 'sewa', 'kamera', 'ruang rapat', 'inventaris', 'booking'],
      },
      {
        id: 'action-copy-hotline',
        type: 'aksi',
        title: 'Salin Kontak WhatsApp Official TERAMEDIA',
        subtitle: 'Nomor narahubung: +62 822-7711-2345 (Sekretariat Kampus Dewantara)',
        badge: 'Salin Kontak',
        icon: Copy,
        iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
        action: () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText('+62 822-7711-2345');
            showToast('Nomor WhatsApp TERAMEDIA disalin ke clipboard!');
          }
        },
        keywords: ['wa', 'whatsapp', 'kontak', 'hotline', 'nomor', 'telepon', 'salin'],
      },
    ];
  }, [activityLogs, isSoundMutedState, onNavigate, onClose]);

  // Combine and filter items
  const filteredItems = useMemo(() => {
    let pool = [];
    if (activeTab === 'semua') {
      pool = [...moduleItems, ...navigationItems, ...actionItems, ...dynamicDataItems];
    } else if (activeTab === 'modul') {
      pool = moduleItems;
    } else if (activeTab === 'navigasi') {
      pool = navigationItems;
    } else if (activeTab === 'data') {
      pool = dynamicDataItems;
    } else if (activeTab === 'aksi') {
      pool = actionItems;
    }

    const q = query.toLowerCase().trim();
    if (!q) return pool;

    return pool.filter((item) => {
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => String(k).toLowerCase().includes(q));
      return matchTitle || matchSubtitle || matchBadge || matchKeywords;
    });
  }, [activeTab, moduleItems, navigationItems, actionItems, dynamicDataItems, query]);

  const safeSelectedIndex = selectedIndex < filteredItems.length ? selectedIndex : 0;

  // Auto-scroll selected element into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${safeSelectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [safeSelectedIndex]);

  // Keyboard navigation within the modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[safeSelectedIndex]) {
        filteredItems[safeSelectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spotlight-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[120] flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-3 sm:px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#090e24]/95 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] text-white overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in zoom-in-95 duration-150">
        
        {/* Subtle decorative top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400" />

        {/* Toast alert indicator */}
        {toastMessage && (
          <div className="absolute top-3 right-3 z-50 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <Check size={14} className="stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header & Search Input */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
            <Search size={18} className="stroke-[2.5]" />
          </div>
          
          <input
            ref={inputRef}
            id="spotlight-title"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik perintah, nama modul, NIM, tiket, surat, atau aksi cepat..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none font-medium"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Hapus kata kunci"
            >
              <X size={16} />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
              ESC
            </kbd>
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="px-3.5 sm:px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'modul' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                    11
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1 divide-y divide-slate-800/40 custom-scrollbar"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mb-3">
                <Search size={22} />
              </div>
              <p className="text-sm font-bold text-slate-200">Tidak ada hasil ditemukan</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Tidak ada modul, data, atau aksi yang cocok dengan kata kunci &quot;<span className="text-amber-300 font-semibold">{query}</span>&quot;.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveTab('semua');
                  inputRef.current?.focus();
                }}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === safeSelectedIndex;
              const IconComp = item.icon || Tag;

              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => item.action()}
                  className={`group relative p-2.5 sm:p-3 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600/25 via-amber-400/10 to-transparent border border-blue-500/40 shadow-xs'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        item.iconColor || 'text-slate-300 bg-slate-800 border-slate-700'
                      }`}
                    >
                      <IconComp size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-100'}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/80 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Action Hint */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[10px] shadow-xs">
                        <span>Pilih</span>
                        <CornerDownLeft size={11} className="stroke-[3]" />
                      </div>
                    ) : (
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Footer Bar with Shortcuts & Context info */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[9px] bg-slate-800 border border-slate-700 rounded text-slate-300">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 font-mono text-[9px] bg-slate-800 border border-slate-700 rounded text-slate-300">
                ↓
              </kbd>
              <span className="hidden sm:inline">Navigasi</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[9px] bg-slate-800 border border-slate-700 rounded text-slate-300">
                ↵
              </kbd>
              <span className="hidden sm:inline">Buka</span>
            </span>

            <span className="hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[9px] bg-slate-800 border border-slate-700 rounded text-slate-300">
                ESC
              </kbd>
              <span>Tutup</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <span className="hidden sm:inline text-slate-500">TeraDesk Spotlight</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold truncate max-w-[150px]">
              {authUser ? authUser.name : 'Tamu (Guest)'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

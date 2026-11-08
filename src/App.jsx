import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Search } from 'lucide-react';
import Hero from './components/Hero';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import LoginPage from './components/LoginPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import FeaturesPortal from './components/FeaturesPortal';
import ServiceDispatcher from './components/services/ServiceDispatcher';
import CommandPalette from './components/common/CommandPalette';
import PublicAttendanceModal from './components/services/PublicAttendanceModal';
import { initialDefaultAccounts } from './data/defaultAccounts';
import { initialDefaultProker } from './data/defaultProker';
import { isDummyConsultation } from './data/defaultConsultations';
import { initialDefaultActivityLogs } from './data/defaultActivityLogs';
import { initialDefaultTickets, sortTicketsNewestFirst } from './data/defaultTickets';
import { isFirebaseConfigured } from './services/firebase';
import {
  subscribeActivityLogs,
  addActivityLogToDb,
  clearActivityLogsFromDb,
  resetActivityLogsInDb,
} from './services/activityLogService';
import {
  subscribeConsultations,
  addConsultationToDb,
  updateConsultationStatusInDb,
  deleteConsultationFromDb,
  clearAllConsultationsFromDb,
} from './services/consultationService';
import {
  subscribeAccounts,
  addAccountToDb,
  updateAccountInDb,
  updatePasswordInDb,
  deleteAccountFromDb,
  deleteAccountsBatchFromDb,
  resetAccountsInDb,
} from './services/accountService';
import {
  subscribeTickets,
  addTicketToDb,
  updateTicketInDb,
  deleteTicketFromDb,
} from './services/ticketService';
import { getDeviceInfo } from './utils/deviceDetector';
import {
  STORAGE_KEYS,
  loadLocalData,
  saveLocalData,
  parSync,
  humasSync,
  kkmOrdersSync,
  kkmCashflowSync,
  archiveDocsSync,
  suratLogSync,
  assetsSync,
  financeSync,
  attendanceSync,
  attendanceSessionsSync,
  activitiesSync,
  subscribeModuleStatuses,
  updateModuleStatusInDb,
  isDummyAttendanceSession,
  isDummyAttendanceRecord,
} from './services/moduleSyncService';
import {
  defaultParSubmissions,
  defaultHumasMedparts,
  defaultKkmOrders,
  defaultKkmCashflow,
  defaultArchiveDocs,
  defaultSuratLog,
  defaultAssets,
  defaultFinanceTransactions,
  defaultAttendanceList,
  defaultAttendanceSessions,
  defaultActivities,
  defaultModuleStatuses,
} from './data/defaultModulesData';

function App() {
  const [pendingTarget, setPendingTarget] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin') {
        return { page: 'admin', serviceId: null };
      }
      if (window.location.pathname.startsWith('/service/')) {
        const sid = window.location.pathname.replace('/service/', '').trim();
        return { page: 'service', serviceId: sid };
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin') {
        // Tamu yang mengakses /admin langsung diarahkan ke form login terlebih dahulu
        return { page: 'login', serviceId: null };
      }
      if (window.location.pathname === '/login') {
        return { page: 'login', serviceId: null };
      }
      if (window.location.pathname.startsWith('/service/')) {
        // Tamu yang mengakses /service/:id langsung diarahkan ke form login terlebih dahulu
        return { page: 'login', serviceId: null };
      }
    }
    return { page: 'landing', serviceId: null };
  });

  const [authUser, setAuthUser] = useState(null); // null = Guest, object = Authenticated pengurus
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [accessDeniedInfo, setAccessDeniedInfo] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [adminInitialNav, setAdminInitialNav] = useState('dashboard');

  // State Presensi Mandiri Publik (untuk anggota/tamu yang memindai QR Code via smartphone camera)
  const [activePublicAttendanceId, setActivePublicAttendanceId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const presensiId = params.get('presensi');
      if (presensiId && presensiId !== 'true') {
        return presensiId;
      }
    }
    return null;
  });

  // Registered accounts state tersinkron dengan Koordinator Divisi & Anggota Biasa
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      localStorage.removeItem('teradesk_dev_accounts');
      localStorage.removeItem('teradesk_dev_accounts_v2');
      localStorage.removeItem('teradesk_dev_accounts_v3');
      const saved = localStorage.getItem('teradesk_dev_accounts_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((acc) => ({
            ...acc,
            canAccessAdmin: acc.canAccessAdmin ?? (acc.nim === '23404053' || acc.role?.toLowerCase().includes('koordinator') || acc.isDefault === true),
          }));
        }
      }
    } catch {
      // ignore
    }
    return initialDefaultAccounts;
  });

  // Persist registered accounts changes
  useEffect(() => {
    try {
      localStorage.setItem('teradesk_dev_accounts_v4', JSON.stringify(registeredAccounts));
    } catch {
      // ignore
    }
  }, [registeredAccounts]);

  const registeredAccountsRef = useRef(registeredAccounts);
  useEffect(() => {
    registeredAccountsRef.current = registeredAccounts;
  }, [registeredAccounts]);

  // Program Kerja Showcase state (ditampilkan saling overlapping di Hero landing page)
  const [prokerList, setProkerList] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_proker_list_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialDefaultProker;
  });

  // Persist prokerList changes
  useEffect(() => {
    try {
      localStorage.setItem('teradesk_proker_list_v1', JSON.stringify(prokerList));
    } catch {
      // ignore
    }
  }, [prokerList]);

  // Design Tickets state (Permohonan tiket request desain Pubdok & Helpdesk)
  const [designTickets, setDesignTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_design_tickets_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortTicketsNewestFirst(parsed);
        }
      }
    } catch {
      // ignore
    }
    return sortTicketsNewestFirst(initialDefaultTickets);
  });

  // Persist designTickets changes
  useEffect(() => {
    try {
      localStorage.setItem('teradesk_design_tickets_v1', JSON.stringify(designTickets));
    } catch {
      // ignore
    }
  }, [designTickets]);

  const designTicketsRef = useRef(designTickets);
  useEffect(() => {
    designTicketsRef.current = designTickets;
  }, [designTickets]);

  const handleAddProker = (newProker) => {
    setProkerList((prev) => [newProker, ...prev]);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: newProker.division || 'BPH',
      moduleName: 'Master Timeline',
      event: `Submit Proker: ${newProker.title.length > 40 ? newProker.title.slice(0, 40) + '...' : newProker.title}`,
      details: `Pendaftaran jadwal program kerja periode ${newProker.period || '2026'} di ${newProker.location || 'Kampus'}.`,
    });
  };

  const handleUpdateProker = (id, updatedFields) => {
    setProkerList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const handleDeleteProker = (id) => {
    setProkerList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleProkerVisibility = (id) => {
    setProkerList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  const handleResetProker = () => {
    setProkerList(initialDefaultProker);
    try {
      localStorage.setItem('teradesk_proker_list_v1', JSON.stringify(initialDefaultProker));
    } catch {
      // ignore
    }
  };

  const handleReorderProker = (newOrderList) => {
    setProkerList(newOrderList);
  };

  const handleAddTicket = (newTicket) => {
    setDesignTickets((prev) => sortTicketsNewestFirst([newTicket, ...prev]));
    addTicketToDb(newTicket);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || newTicket.requester || 'Pengurus',
      userNim: authUser?.nim || '-',
      userRole: authUser?.role || 'Pengurus',
      userDivision: newTicket.division || 'BPH',
      moduleName: 'Tiket Desain Pubdok',
      event: `Permohonan Desain: ${newTicket.title.length > 35 ? newTicket.title.slice(0, 35) + '...' : newTicket.title}`,
      details: `Tiket #${newTicket.id} diajukan untuk kebutuhan ${newTicket.category || newTicket.canvas} oleh ${newTicket.requester}.`,
    });
  };

  const handleUpdateTicketStatus = (ticketId, nextStatus, nextStatusColor, designer) => {
    setDesignTickets((prev) => {
      const updated = prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: nextStatus,
              statusColor: nextStatusColor || t.statusColor,
              ...(designer !== undefined ? { designer, assignedTo: designer } : {}),
            }
          : t
      );
      try {
        localStorage.setItem('teradesk_design_tickets_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    const updatePayload = {
      status: nextStatus,
    };
    if (nextStatusColor) updatePayload.statusColor = nextStatusColor;
    if (designer !== undefined) {
      updatePayload.designer = designer;
      updatePayload.assignedTo = designer;
    }

    updateTicketInDb(ticketId, updatePayload);
    handleAddActivityLog({
      category: 'system',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'Pubdok',
      moduleName: 'Tiket Desain Pubdok',
      event: `Update Tiket #${ticketId} ➔ ${nextStatus}`,
      details: `Status tiket desain diperbarui menjadi "${nextStatus}"${designer ? ` (${designer})` : ''}.`,
    });
  };

  const handleDeleteTicket = (ticketId) => {
    setDesignTickets((prev) => prev.filter((t) => t.id !== ticketId));
    deleteTicketFromDb(ticketId);
    handleAddActivityLog({
      category: 'system',
      type: 'warning',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'Pubdok',
      moduleName: 'Tiket Desain Pubdok',
      event: `Hapus Tiket #${ticketId}`,
      details: `Tiket request desain #${ticketId} telah dihapus dari antrean kerja.`,
    });
  };

  // Handlers for PAR
  const handleAddParSubmission = (newPar) => {
    setParSubmissions((prev) => [newPar, ...prev]);
    saveLocalData(STORAGE_KEYS.PAR, [newPar, ...parSubmissions]);
    parSync.addItem(newPar);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || newPar.pic || 'Pengaju PAR',
      userNim: authUser?.nim || '-',
      userRole: authUser?.role || 'Pengurus',
      userDivision: newPar.division || 'BPH',
      moduleName: 'Persetujuan Proker (PAR)',
      event: `Submit Proposal: ${newPar.title}`,
      details: `Proposal anggaran ${newPar.budget} diajukan untuk kegiatan ${newPar.date}.`,
    });
  };

  const handleApproveParSubmission = (id) => {
    setParSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: 'Disetujui',
              statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              step: 4,
              slaRemaining: 'Selesai',
            }
          : sub
      )
    );
    parSync.updateItem(id, {
      status: 'Disetujui',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      step: 4,
      slaRemaining: 'Selesai',
    });
    handleAddActivityLog({
      category: 'module_submit',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Persetujuan Proker (PAR)',
      event: `Persetujuan Proposal: ${id}`,
      details: `Proposal ID ${id} disetujui resmi oleh Administrator.`,
    });
  };

  const handleUpdateParStatus = (id, step, status) => {
    setParSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, step, status } : sub))
    );
    parSync.updateItem(id, { step, status });
  };

  // Handlers for Humas Medpart
  const handleAddHumasMedpart = (newMedpart) => {
    setHumasMedparts((prev) => [newMedpart, ...prev]);
    saveLocalData(STORAGE_KEYS.HUMAS, [newMedpart, ...humasMedparts]);
    humasSync.addItem(newMedpart);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: newMedpart.picName || authUser?.name || 'Mitra Humas',
      userNim: authUser?.nim || '-',
      userRole: 'Mitra Kampus',
      userDivision: newMedpart.organizer || 'Humas',
      moduleName: 'Humas & Media Partner',
      event: `Permohonan Medpart: ${newMedpart.eventName}`,
      details: `Pengajuan ${newMedpart.packageType} dari ${newMedpart.organizer}.`,
    });
  };

  const handleApproveHumasMedpart = (id) => {
    setHumasMedparts((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'Disetujui - Forward Pubdok',
              statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            }
          : m
      )
    );
    humasSync.updateItem(id, {
      status: 'Disetujui - Forward Pubdok',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    });
    handleAddActivityLog({
      category: 'module_submit',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Humas & Media Partner',
      event: `Approve Medpart: ${id}`,
      details: `Permohonan kerja sama media partner ID ${id} disetujui & diteruskan ke Pubdok.`,
    });
  };

  const handleRejectHumasMedpart = (id) => {
    setHumasMedparts((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'Ditolak (Slot Penuh)',
              statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
            }
          : m
      )
    );
    humasSync.updateItem(id, {
      status: 'Ditolak (Slot Penuh)',
      statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
    });
  };

  // Handlers for KKM
  const handleAddKkmOrder = (newOrder) => {
    setKkmOrders((prev) => [newOrder, ...prev]);
    saveLocalData(STORAGE_KEYS.KKM_ORDERS, [newOrder, ...kkmOrders]);
    kkmOrdersSync.addItem(newOrder);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: newOrder.customerName || authUser?.name || 'Pelanggan KKM',
      userNim: newOrder.nim || authUser?.nim || '-',
      userRole: 'Pemesan Merchandise',
      userDivision: newOrder.division || 'KKM',
      moduleName: 'KKM (Kewirausahaan)',
      event: `Pre-Order: ${newOrder.item}`,
      details: `Pesanan baru ${newOrder.qty}x ${newOrder.item} (${newOrder.size}) senilai Rp ${newOrder.total?.toLocaleString('id-ID')}.`,
    });
  };

  const handleSetKkmLunas = (orderId) => {
    setKkmOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'Lunas',
              paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              pickupStatus: 'Siap Diambil di Sekre',
            }
          : o
      )
    );
    kkmOrdersSync.updateItem(orderId, {
      paymentStatus: 'Lunas',
      paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pickupStatus: 'Siap Diambil di Sekre',
    });
    handleAddActivityLog({
      category: 'module_submit',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'Divisi KKM',
      moduleName: 'KKM (Kewirausahaan)',
      event: `Pelunasan PO: ${orderId}`,
      details: `Pembayaran pesanan merchandise #${orderId} telah diverifikasi lunas.`,
    });
  };

  const handleAddKkmCashflow = (newTx) => {
    setKkmCashflow((prev) => [newTx, ...prev]);
    saveLocalData(STORAGE_KEYS.KKM_CASHFLOW, [newTx, ...kkmCashflow]);
    kkmCashflowSync.addItem(newTx);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || 'Pengurus KKM',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'Divisi KKM',
      userDivision: 'Divisi KKM',
      moduleName: 'KKM (Kewirausahaan)',
      event: `Kas Usaha KKM: ${newTx.desc}`,
      details: `${newTx.type === 'in' ? 'Pemasukan' : 'Pengeluaran'} senilai Rp ${Number(newTx.amount).toLocaleString('id-ID')} (${newTx.category}).`,
    });
  };

  // Handlers for Archive & Surat
  const handleAddArchiveDoc = (newDoc) => {
    setArchiveDocs((prev) => [newDoc, ...prev]);
    saveLocalData(STORAGE_KEYS.ARCHIVE_DOCS, [newDoc, ...archiveDocs]);
    archiveDocsSync.addItem(newDoc);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || newDoc.author || 'Sekretariat',
      userNim: authUser?.nim || '-',
      userRole: authUser?.role || 'Kesekretariatan',
      userDivision: 'Kesekretariatan',
      moduleName: 'Digitalisasi E-Arsip',
      event: `Upload Arsip: ${newDoc.title}`,
      details: `Pengarsipan dokumen digital nomor ${newDoc.number} (${newDoc.category}).`,
    });
  };

  const handleAddSuratLog = (newEntry) => {
    setSuratLog((prev) => [newEntry, ...prev]);
    saveLocalData(STORAGE_KEYS.SURAT_LOG, [newEntry, ...suratLog]);
    suratLogSync.addItem(newEntry);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: newEntry.div || 'Kesekretariatan',
      moduleName: 'Penomoran Surat Resmi',
      event: `Generate Surat: ${newEntry.no}`,
      details: `Nomor surat keluar diterbitkan: ${newEntry.perihal} (${newEntry.div}).`,
    });
  };

  // Handlers for Assets
  const handleBookAsset = (assetId, bookingForm) => {
    setAssets((prev) =>
      prev.map((ast) =>
        ast.id === assetId
          ? {
              ...ast,
              status: 'Dipinjam',
              borrower: `${bookingForm.borrowerName} (${bookingForm.division})`,
              returnDate: bookingForm.endDate || 'Besok',
            }
          : ast
      )
    );
    assetsSync.updateItem(assetId, {
      status: 'Dipinjam',
      borrower: `${bookingForm.borrowerName} (${bookingForm.division})`,
      returnDate: bookingForm.endDate || 'Besok',
    });
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: bookingForm.borrowerName || authUser?.name || 'Peminjam',
      userNim: authUser?.nim || '-',
      userRole: 'Peminjam Alat',
      userDivision: bookingForm.division || 'Logistik',
      moduleName: 'Digitalisasi Aset & Inventaris',
      event: `Peminjaman Alat: ${assetId}`,
      details: `Aset dipinjam oleh ${bookingForm.borrowerName} untuk keperluan: ${bookingForm.purpose}.`,
    });
  };

  const handleReturnAsset = (assetId) => {
    setAssets((prev) =>
      prev.map((ast) =>
        ast.id === assetId
          ? {
              ...ast,
              status: 'Tersedia',
              borrower: null,
              returnDate: null,
            }
          : ast
      )
    );
    assetsSync.updateItem(assetId, {
      status: 'Tersedia',
      borrower: null,
      returnDate: null,
    });
    handleAddActivityLog({
      category: 'module_submit',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'Logistik',
      userDivision: 'Logistik',
      moduleName: 'Digitalisasi Aset & Inventaris',
      event: `Pengembalian Alat: ${assetId}`,
      details: `Aset ${assetId} telah dikembalikan dan diverifikasi siap pakai di gudang/sekre.`,
    });
  };

  // Handlers for Finance
  const handleAddFinanceTransaction = (newTx) => {
    setFinanceTransactions((prev) => [newTx, ...prev]);
    saveLocalData(STORAGE_KEYS.FINANCE, [newTx, ...financeTransactions]);
    financeSync.addItem(newTx);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || 'Pengurus Keuangan',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'Bendahara',
      userDivision: newTx.division || 'Keuangan',
      moduleName: 'Kas & Reimbursement',
      event: `Transaksi Kas: ${newTx.title}`,
      details: `Mutasi ${newTx.type} senilai ${newTx.amount} status "${newTx.status}".`,
    });
  };

  // Handlers for Attendance
  const handleAddAttendanceRecord = (record) => {
    setAttendanceList((prev) => [record, ...prev]);
    saveLocalData(STORAGE_KEYS.ATTENDANCE, [record, ...attendanceList]);
    attendanceSync.addItem(record);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'success',
      userName: record.name,
      userNim: record.nim || authUser?.nim || '-',
      userRole: record.role || 'Anggota',
      userDivision: record.division || 'Kaderisasi',
      moduleName: 'Presensi Digital & QR Acara',
      event: `Check-in Presensi: ${record.name}`,
      details: `Presensi rapat/kegiatan tercatat pada ${record.time} (${record.status}) - ${record.method || 'Presensi Digital'}${record.distanceInfo ? ` [${record.distanceInfo}]` : ''}.`,
    });
  };

  const handleAddAttendanceSession = (session) => {
    setAttendanceSessions((prev) => [session, ...prev]);
    saveLocalData(STORAGE_KEYS.ATTENDANCE_SESSIONS, [session, ...attendanceSessions]);
    attendanceSessionsSync.addItem(session);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || 'Pengurus',
      userNim: authUser?.nim || '-',
      userRole: authUser?.role || 'BPH',
      userDivision: session.division || 'BPH & Presidium',
      moduleName: 'Presensi Digital & QR Acara',
      event: `Sesi Rapat Baru Dibuat: ${session.title}`,
      details: `Agenda pada ${session.date} (${session.timeStart} - ${session.timeEnd}) di ${session.location}. PIN: ${session.pinCode}`,
    });
  };

  const handleUpdateAttendanceSession = (updatedSession) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
    const updatedList = attendanceSessions.map((s) =>
      s.id === updatedSession.id ? updatedSession : s
    );
    saveLocalData(STORAGE_KEYS.ATTENDANCE_SESSIONS, updatedList);
    attendanceSessionsSync.updateItem(updatedSession.id, updatedSession);
  };

  const handleDeleteAttendanceSession = (sessionId) => {
    setAttendanceSessions((prev) => prev.filter((s) => s.id !== sessionId));
    const filtered = attendanceSessions.filter((s) => s.id !== sessionId);
    saveLocalData(STORAGE_KEYS.ATTENDANCE_SESSIONS, filtered);
    attendanceSessionsSync.deleteItem(sessionId);

    // Hapus juga seluruh riwayat presensi yang terikat pada agenda ini
    setAttendanceList((prev) => {
      const remainingRecords = prev.filter((r) => r.sessionId !== sessionId);
      saveLocalData(STORAGE_KEYS.ATTENDANCE, remainingRecords);
      return remainingRecords;
    });

    handleAddActivityLog({
      category: 'module_submit',
      type: 'warning',
      userName: authUser?.name || 'Pengurus',
      userNim: authUser?.nim || '-',
      userRole: authUser?.role || 'BPH',
      userDivision: authUser?.division || 'BPH & Presidium',
      moduleName: 'Presensi Digital & QR Acara',
      event: `Agenda Rapat Dihapus: ${sessionId}`,
      details: `Sesi rapat dengan ID ${sessionId} beserta riwayat kehadiran terkait telah dihapus permanen oleh ${authUser?.name || 'Pengurus'}.`,
    });
  };

  const handleDeleteAttendanceRecord = (recordId) => {
    setAttendanceList((prev) => {
      const remaining = prev.filter((r) => r.id !== recordId);
      saveLocalData(STORAGE_KEYS.ATTENDANCE, remaining);
      return remaining;
    });
    attendanceSync.deleteItem(recordId);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'warning',
      userName: authUser?.name || 'Pengurus',
      userNim: authUser?.nim || '-',
      userRole: authUser?.role || 'BPH',
      userDivision: authUser?.division || 'BPH & Presidium',
      moduleName: 'Presensi Digital & QR Acara',
      event: `Log Presensi Dihapus: ${recordId}`,
      details: `Catatan presensi dengan ID ${recordId} telah dihapus dari sistem.`,
    });
  };

  // Handlers for Activity Archive
  const handleAddActivity = (newActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
    saveLocalData(STORAGE_KEYS.ACTIVITIES, [newActivity, ...activities]);
    activitiesSync.addItem(newActivity);
    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: authUser?.name || newActivity.pic || 'PIC Kegiatan',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: newActivity.division || 'Lintas Divisi',
      moduleName: 'Arsip Kegiatan & Dokumentasi',
      event: `Arsip Baru: ${newActivity.title}`,
      details: `Dokumentasi kegiatan terlaksana ${newActivity.date} di ${newActivity.location} (${newActivity.participants} peserta).`,
    });
  };

  // Handlers for Module Status
  const handleToggleModuleStatus = (modId) => {
    setModuleStatuses((prev) => {
      const updated = !prev[modId];
      const next = { ...prev, [modId]: updated };
      saveLocalData(STORAGE_KEYS.MODULE_STATUSES, next);
      updateModuleStatusInDb(next);
      handleAddActivityLog({
        category: 'system',
        type: updated ? 'success' : 'warning',
        userName: authUser?.name || 'Administrator',
        userNim: authUser?.nim || '23404053',
        userRole: authUser?.role || 'BPH',
        userDivision: 'BPH',
        moduleName: 'Sistem Organisasi',
        event: `Status Modul: ${modId.toUpperCase()}`,
        details: `Modul layanan ${modId.toUpperCase()} dialihkan menjadi ${updated ? 'ONLINE / AKTIF' : 'MAINTENANCE'}.`,
      });
      return next;
    });
  };

  // Kotak Masuk Konsultasi (Inbox Kontak) state terintegrasi
  const [consultationMessages, setConsultationMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_consultations_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m) => !isDummyConsultation(m));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sinkronisasi otomatis antar-tab browser dan saat window fokus
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const saved = localStorage.getItem('teradesk_consultations_v1');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setConsultationMessages(parsed.filter((m) => !isDummyConsultation(m)));
          }
        }
      } catch {
        // ignore
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'teradesk_consultations_v1') {
        syncFromStorage();
      }
    };

    const handleCustomSync = (e) => {
      if (Array.isArray(e.detail)) {
        setConsultationMessages(e.detail.filter((m) => !isDummyConsultation(m)));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncFromStorage);
    window.addEventListener('teradesk-consultation-updated', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncFromStorage);
      window.removeEventListener('teradesk-consultation-updated', handleCustomSync);
    };
  }, []);

  // Persist consultation messages (pastikan data dummy lama dibuang dari storage)
  useEffect(() => {
    try {
      const cleanMessages = (consultationMessages || []).filter((m) => !isDummyConsultation(m));
      localStorage.setItem('teradesk_consultations_v1', JSON.stringify(cleanMessages));
    } catch {
      // ignore
    }
  }, [consultationMessages]);

  // Activity Logs & Audit Trail state (Login & Module Submissions)
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_activity_logs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialDefaultActivityLogs;
  });

  // Persist activity logs
  useEffect(() => {
    try {
      localStorage.setItem('teradesk_activity_logs_v1', JSON.stringify(activityLogs));
    } catch {
      // ignore
    }
  }, [activityLogs]);

  // ==========================================
  // PERSISTENT & SYNCED MODULE STATES
  // ==========================================
  // 1. PAR Submissions
  const [parSubmissions, setParSubmissions] = useState(() =>
    loadLocalData(STORAGE_KEYS.PAR, defaultParSubmissions)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.PAR, parSubmissions);
  }, [parSubmissions]);

  // 2. Humas Medparts
  const [humasMedparts, setHumasMedparts] = useState(() =>
    loadLocalData(STORAGE_KEYS.HUMAS, defaultHumasMedparts)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.HUMAS, humasMedparts);
  }, [humasMedparts]);

  // 3. KKM Orders
  const [kkmOrders, setKkmOrders] = useState(() =>
    loadLocalData(STORAGE_KEYS.KKM_ORDERS, defaultKkmOrders)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.KKM_ORDERS, kkmOrders);
  }, [kkmOrders]);

  // 4. KKM Cashflow
  const [kkmCashflow, setKkmCashflow] = useState(() =>
    loadLocalData(STORAGE_KEYS.KKM_CASHFLOW, defaultKkmCashflow)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.KKM_CASHFLOW, kkmCashflow);
  }, [kkmCashflow]);

  // 5. Archive Docs
  const [archiveDocs, setArchiveDocs] = useState(() =>
    loadLocalData(STORAGE_KEYS.ARCHIVE_DOCS, defaultArchiveDocs)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.ARCHIVE_DOCS, archiveDocs);
  }, [archiveDocs]);

  // 6. Surat Log
  const [suratLog, setSuratLog] = useState(() =>
    loadLocalData(STORAGE_KEYS.SURAT_LOG, defaultSuratLog)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.SURAT_LOG, suratLog);
  }, [suratLog]);

  // 7. Assets Inventory
  const [assets, setAssets] = useState(() =>
    loadLocalData(STORAGE_KEYS.ASSETS, defaultAssets)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.ASSETS, assets);
  }, [assets]);

  // 8. Finance Transactions
  const [financeTransactions, setFinanceTransactions] = useState(() =>
    loadLocalData(STORAGE_KEYS.FINANCE, defaultFinanceTransactions)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.FINANCE, financeTransactions);
  }, [financeTransactions]);

  // 9. Attendance List & Sessions
  const [attendanceList, setAttendanceList] = useState(() => {
    const loaded = loadLocalData(STORAGE_KEYS.ATTENDANCE, defaultAttendanceList);
    return Array.isArray(loaded) ? loaded.filter((r) => !isDummyAttendanceRecord(r)) : [];
  });
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.ATTENDANCE, attendanceList);
  }, [attendanceList]);

  const [attendanceSessions, setAttendanceSessions] = useState(() => {
    const loaded = loadLocalData(STORAGE_KEYS.ATTENDANCE_SESSIONS, defaultAttendanceSessions);
    return Array.isArray(loaded) ? loaded.filter((s) => !isDummyAttendanceSession(s)) : [];
  });
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.ATTENDANCE_SESSIONS, attendanceSessions);
  }, [attendanceSessions]);

  // 10. Activities Archive
  const [activities, setActivities] = useState(() =>
    loadLocalData(STORAGE_KEYS.ACTIVITIES, defaultActivities)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  // 11. Module Statuses
  const [moduleStatuses, setModuleStatuses] = useState(() =>
    loadLocalData(STORAGE_KEYS.MODULE_STATUSES, defaultModuleStatuses)
  );
  useEffect(() => {
    saveLocalData(STORAGE_KEYS.MODULE_STATUSES, moduleStatuses);
  }, [moduleStatuses]);

  // Real-time Cloud Firestore synchronization (aktif otomatis jika kredensial Firebase terisi)
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubLogs = subscribeActivityLogs((cloudLogs) => {
      if (Array.isArray(cloudLogs) && cloudLogs.length > 0) {
        setActivityLogs(cloudLogs);
      }
    });

    const unsubConsultations = subscribeConsultations((cloudMessages) => {
      if (Array.isArray(cloudMessages)) {
        const cleanList = cloudMessages.filter((m) => !isDummyConsultation(m));
        setConsultationMessages(cleanList);
        try {
          localStorage.setItem('teradesk_consultations_v1', JSON.stringify(cleanList));
        } catch {
          // ignore
        }
      }
    });

    const unsubAccounts = subscribeAccounts(
      (cloudAccounts) => {
        if (Array.isArray(cloudAccounts) && cloudAccounts.length > 0) {
          setRegisteredAccounts(cloudAccounts);
          try {
            localStorage.setItem('teradesk_dev_accounts_v4', JSON.stringify(cloudAccounts));
          } catch {
            // ignore
          }
        }
      },
      (err) => console.warn('⚠️ [Accounts Sync Error]:', err),
      () => registeredAccountsRef.current
    );

    const unsubTickets = subscribeTickets(
      (cloudTickets) => {
        if (Array.isArray(cloudTickets) && cloudTickets.length > 0) {
          setDesignTickets(sortTicketsNewestFirst(cloudTickets));
        }
      },
      (err) => console.warn('⚠️ [Tickets Sync Error]:', err),
      () => designTicketsRef.current
    );

    const unsubPar = parSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setParSubmissions(data);
    });
    const unsubHumas = humasSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setHumasMedparts(data);
    });
    const unsubKkmOrders = kkmOrdersSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setKkmOrders(data);
    });
    const unsubKkmCashflow = kkmCashflowSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setKkmCashflow(data);
    });
    const unsubArchiveDocs = archiveDocsSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setArchiveDocs(data);
    });
    const unsubSuratLog = suratLogSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setSuratLog(data);
    });
    const unsubAssets = assetsSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setAssets(data);
    });
    const unsubFinance = financeSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setFinanceTransactions(data);
    });
    const unsubAttendance = attendanceSync.subscribe((data) => {
      if (Array.isArray(data)) {
        setAttendanceList(data.filter((r) => !isDummyAttendanceRecord(r)));
      }
    });
    const unsubAttendanceSessions = attendanceSessionsSync.subscribe((data) => {
      if (Array.isArray(data)) {
        setAttendanceSessions(data.filter((s) => !isDummyAttendanceSession(s)));
      }
    });
    const unsubActivities = activitiesSync.subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) setActivities(data);
    });
    const unsubModuleStatuses = subscribeModuleStatuses((data) => {
      if (data && typeof data === 'object') setModuleStatuses(data);
    });

    return () => {
      unsubLogs();
      unsubConsultations();
      unsubAccounts();
      unsubTickets();
      unsubPar();
      unsubHumas();
      unsubKkmOrders();
      unsubKkmCashflow();
      unsubArchiveDocs();
      unsubSuratLog();
      unsubAssets();
      unsubFinance();
      unsubAttendance();
      unsubAttendanceSessions();
      unsubActivities();
      unsubModuleStatuses();
    };
  }, []);

  const handleAddActivityLog = ({
    category = 'system', // 'login' | 'module_submit' | 'system'
    type = 'info', // 'success' | 'info' | 'warning'
    userName = 'Pengguna',
    userNim = '-',
    userRole = 'Pengurus',
    userDivision = 'BPH',
    moduleName = 'Workspace',
    event = '',
    details = '',
    device = null,
  }) => {
    const currentDevice = device || getDeviceInfo();
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID');
    const date = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time,
      timestamp: time,
      date,
      category,
      type,
      userName,
      userNim,
      userRole,
      userDivision,
      actor: {
        name: userName,
        nim: userNim,
        role: userRole,
        division: userDivision,
      },
      moduleName,
      module: moduleName,
      event,
      details,
      device: currentDevice,
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      try {
        localStorage.setItem('teradesk_activity_logs_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (isFirebaseConfigured) {
      addActivityLogToDb(newLog);
    }
  };

  const handleClearActivityLogs = () => {
    setActivityLogs([]);
    try {
      localStorage.setItem('teradesk_activity_logs_v1', JSON.stringify([]));
    } catch {
      // ignore
    }
    if (isFirebaseConfigured) {
      clearActivityLogsFromDb();
    }
  };

  const handleResetActivityLogs = () => {
    setActivityLogs(initialDefaultActivityLogs);
    try {
      localStorage.setItem('teradesk_activity_logs_v1', JSON.stringify(initialDefaultActivityLogs));
    } catch {
      // ignore
    }
    if (isFirebaseConfigured) {
      resetActivityLogsInDb(initialDefaultActivityLogs);
    }
  };

  const handleSendConsultation = (newMessage) => {
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':') +
      ' WITA';

    // Selalu baca data terbaru dari storage agar tidak tertimpa state lama di memori
    let currentList = [];
    try {
      const saved = localStorage.getItem('teradesk_consultations_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentList = parsed.filter((m) => !isDummyConsultation(m));
        }
      }
    } catch {
      // ignore
    }
    if (!Array.isArray(currentList)) {
      currentList = (consultationMessages || []).filter((m) => !isDummyConsultation(m));
    }

    const created = {
      id: `MSG-2026-${String(currentList.length + 1).padStart(3, '0')}`,
      name: newMessage.name?.trim() || 'Tamu Organisasi',
      email: newMessage.email?.trim() || 'tamu@dewantara.ac.id',
      organization: newMessage.organization?.trim() || 'Umum / Eksternal',
      message: newMessage.message?.trim() || '(Tanpa pesan khusus)',
      date: dateFormatted,
      status: 'Baru',
      isRead: false,
    };

    const nextList = [created, ...currentList.filter((m) => m.id !== created.id)];
    try {
      localStorage.setItem('teradesk_consultations_v1', JSON.stringify(nextList));
    } catch {
      // ignore
    }
    setConsultationMessages(nextList);

    // Broadcast ke event bus lokal
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('teradesk-consultation-updated', { detail: nextList })
      );
    }

    if (isFirebaseConfigured) {
      addConsultationToDb(created);
    }

    handleAddActivityLog({
      category: 'module_submit',
      type: 'info',
      userName: created.name,
      userNim: '-',
      userRole: 'Pengirim Konsultasi',
      userDivision: created.organization,
      moduleName: 'Kontak Kami (Inflow)',
      event: `Konsultasi Baru: ${created.name}`,
      details: `Pesan baru masuk dari lembaga ${created.organization}: "${created.message.length > 60 ? created.message.slice(0, 60) + '...' : created.message}"`,
    });
  };

  const handleUpdateConsultationStatus = (id, newStatus) => {
    setConsultationMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus, isRead: true } : msg))
    );
    if (isFirebaseConfigured) {
      updateConsultationStatusInDb(id, newStatus);
    }
    handleAddActivityLog({
      category: 'module_submit',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Kotak Masuk Konsultasi',
      event: `Respon Tiket #${id}`,
      details: `Status respon konsultasi ID #${id} berhasil diubah menjadi "${newStatus}".`,
    });
  };

  const handleMarkConsultationRead = (id) => {
    setConsultationMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const handleMarkAllConsultationsRead = () => {
    setConsultationMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
  };

  const handleDeleteConsultation = (id) => {
    setConsultationMessages((prev) => {
      const next = prev.filter((msg) => msg.id !== id && !isDummyConsultation(msg));
      try {
        localStorage.setItem('teradesk_consultations_v1', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    if (isFirebaseConfigured) {
      deleteConsultationFromDb(id);
    }
  };

  const handleClearAllConsultations = () => {
    setConsultationMessages([]);
    try {
      localStorage.setItem('teradesk_consultations_v1', JSON.stringify([]));
    } catch {
      // ignore
    }
    if (isFirebaseConfigured) {
      clearAllConsultationsFromDb();
    }
    handleAddActivityLog({
      category: 'module_submit',
      type: 'warning',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Kotak Masuk Konsultasi',
      event: 'Kosongkan Kotak Masuk',
      details: 'Semua permohonan konsultasi di kotak masuk telah dikosongkan dan dibersihkan.',
    });
  };

  const handleResetConsultations = () => {
    handleClearAllConsultations();
  };

  // Synchronize browser history and popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        if (authUser && !authUser.canAccessAdmin) {
          setAccessDeniedInfo({
            nim: authUser.nim,
            name: authUser.name,
            role: authUser.role,
          });
          setCurrentView({ page: 'landing', serviceId: null });
        } else {
          // Pastikan data kotak masuk konsultasi terbaru tersinkronisasi saat masuk admin
      try {
        const saved = localStorage.getItem('teradesk_consultations_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConsultationMessages(parsed);
          }
        }
      } catch {
        // ignore
      }

      setCurrentView({ page: 'admin', serviceId: null });
        }
      } else if (window.location.pathname === '/login') {
        setCurrentView({ page: 'login', serviceId: null });
      } else {
        setCurrentView((prev) => (prev.page === 'admin' || prev.page === 'login' ? { page: 'landing', serviceId: null } : prev));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [authUser]);

  // Global keyboard shortcut (Ctrl + Shift + D) to toggle Admin Dashboard page
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setCurrentView((prev) => {
          if (prev.page === 'admin') {
            if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
            return { page: 'landing', serviceId: null };
          } else {
            if (!authUser) {
              setPendingTarget({ page: 'admin', serviceId: null });
              if (window.location.pathname !== '/login') window.history.pushState(null, '', '/login');
              return { page: 'login', serviceId: null };
            }
            if (!authUser.canAccessAdmin) {
              setAccessDeniedInfo({
                nim: authUser.nim,
                name: authUser.name,
                role: authUser.role,
              });
              return prev;
            }
            if (window.location.pathname !== '/admin') window.history.pushState(null, '', '/admin');
            try {
              const saved = localStorage.getItem('teradesk_consultations_v1');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setConsultationMessages(parsed);
                }
              }
            } catch {
              // ignore
            }
            return { page: 'admin', serviceId: null };
          }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [authUser]);

  // Global keyboard shortcut (Ctrl + K or Cmd + K) to toggle Spotlight Command Palette (disabled on landing page)
  useEffect(() => {
    const handleCommandPaletteKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'k') {
        if (currentView.page === 'landing') return;
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleCommandPaletteKey);
    return () => window.removeEventListener('keydown', handleCommandPaletteKey);
  }, [currentView.page]);

  // Guarantee that on page refresh (initial mount), session is completely destroyed
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleNavigate = (page, serviceId = null, pushHistory = true, adminNav = null) => {
    if (adminNav) {
      setAdminInitialNav(adminNav);
    }
    if (page === 'landing') {
      setIsCommandPaletteOpen(false);
      setCurrentView({ page: 'landing', serviceId: null });
      if (pushHistory && window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'admin') {
      if (!authUser) {
        setPendingTarget({ page: 'admin', serviceId: null });
        if (pushHistory && window.location.pathname !== '/login') {
          window.history.pushState(null, '', '/login');
        }
        setCurrentView({ page: 'login', serviceId: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Validasi izin akses panel admin
      if (!authUser.canAccessAdmin) {
        setAccessDeniedInfo({
          nim: authUser.nim,
          name: authUser.name,
          role: authUser.role,
        });
        return;
      }

      // Pastikan data kotak masuk konsultasi terbaru tersinkronisasi saat masuk admin
      try {
        const saved = localStorage.getItem('teradesk_consultations_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConsultationMessages(parsed);
          }
        }
      } catch {
        // ignore
      }

      setCurrentView({ page: 'admin', serviceId: null });
      if (pushHistory && window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'login') {
      setCurrentView({ page: 'login', serviceId });
      if (pushHistory && window.location.pathname !== '/login') {
        window.history.pushState(null, '', '/login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If guest attempts to open workspace (portal or service page)
    if (!authUser) {
      setPendingTarget({ page, serviceId });
      if (pushHistory && window.location.pathname !== '/login') {
        window.history.pushState(null, '', '/login');
      }
      setCurrentView({ page: 'login', serviceId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If already authenticated
    setCurrentView({ page, serviceId });
    if (pushHistory && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userProfile) => {
    setAuthUser(userProfile);
    try {
      const saved = localStorage.getItem('teradesk_consultations_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConsultationMessages(parsed);
        }
      }
    } catch {
      // ignore
    }

    const deviceInfo = getDeviceInfo();

    handleAddActivityLog({
      category: 'login',
      type: 'success',
      userName: userProfile.name,
      userNim: userProfile.nim,
      userRole: userProfile.role || 'Pengurus',
      userDivision: userProfile.division || 'BPH',
      moduleName: 'Autentikasi Login',
      event: `Login Berhasil: ${userProfile.name}`,
      details: `User NIM ${userProfile.nim} berhasil masuk via ${deviceInfo.summary} dengan akses ${userProfile.canAccessAdmin ? 'Admin Executive' : 'Portal Mahasiswa'}.`,
      device: deviceInfo,
    });

    let target = pendingTarget || { page: 'portal', serviceId: null };

    // Jika target login adalah dashboard admin tetapi akun tidak memiliki izin admin:
    if (target.page === 'admin' && !userProfile.canAccessAdmin) {
      setAccessDeniedInfo({
        nim: userProfile.nim,
        name: userProfile.name,
        role: userProfile.role,
      });
      target = { page: 'portal', serviceId: null };
    }

    setCurrentView(target);
    setPendingTarget(null);
    const targetPath = target.page === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (authUser) {
      const deviceInfo = getDeviceInfo();
      handleAddActivityLog({
        category: 'login',
        type: 'info',
        userName: authUser.name,
        userNim: authUser.nim,
        userRole: authUser.role || 'Pengurus',
        userDivision: authUser.division || 'BPH',
        moduleName: 'Autentikasi Login',
        event: `Logout Sesi: ${authUser.name}`,
        details: `Sesi login pengguna NIM ${authUser.nim} telah diakhiri dengan aman dari ${deviceInfo.summary}.`,
        device: deviceInfo,
      });
    }
    setAuthUser(null);
    sessionStorage.clear();
    setCurrentView({ page: 'landing', serviceId: null });
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Developer Dashboard account actions
  const handleAddAccount = (newAccount) => {
    setRegisteredAccounts((prev) => [newAccount, ...prev]);
    addAccountToDb(newAccount);
    handleAddActivityLog({
      category: 'system',
      type: 'success',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Manajemen Akun',
      event: `Akun Baru: ${newAccount.name}`,
      details: `Mendaftarkan akun mahasiswa NIM ${newAccount.nim} (${newAccount.role} - ${newAccount.division}).`,
    });
  };

  const handleUpdatePassword = (nim, newPassword) => {
    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.nim === nim ? { ...acc, password: newPassword } : acc))
    );
    updatePasswordInDb(nim, newPassword);
  };

  const handleUpdateAccount = (originalNim, updatedAccount) => {
    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.nim === originalNim ? { ...acc, ...updatedAccount } : acc))
    );
    if (authUser && authUser.nim === originalNim) {
      setAuthUser((prev) => ({ ...prev, ...updatedAccount }));
    }
    updateAccountInDb(originalNim, updatedAccount);
    handleAddActivityLog({
      category: 'system',
      type: 'info',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Manajemen Akun',
      event: `Update Akun: NIM ${originalNim}`,
      details: `Data akun pengurus NIM ${originalNim} berhasil diperbarui.`,
    });
  };

  const handleDeleteAccount = (nim) => {
    setRegisteredAccounts((prev) => {
      const updated = prev.filter((acc) => String(acc.nim) !== String(nim));
      try {
        localStorage.setItem('teradesk_dev_accounts_v4', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    deleteAccountFromDb(nim);
    handleAddActivityLog({
      category: 'system',
      type: 'warning',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Manajemen Akun',
      event: `Hapus Akun: NIM ${nim}`,
      details: `Akun pengurus NIM ${nim} dihapus dari basis data sistem.`,
    });
  };

  const handleDeleteBatchAccounts = (nims) => {
    if (!Array.isArray(nims) || nims.length === 0) return;
    const nimSet = new Set(nims.map(String));
    setRegisteredAccounts((prev) => {
      const updated = prev.filter((acc) => !nimSet.has(String(acc.nim)));
      try {
        localStorage.setItem('teradesk_dev_accounts_v4', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    deleteAccountsBatchFromDb(nims);
    handleAddActivityLog({
      category: 'system',
      type: 'warning',
      userName: authUser?.name || 'Administrator',
      userNim: authUser?.nim || '23404053',
      userRole: authUser?.role || 'BPH',
      userDivision: 'BPH',
      moduleName: 'Manajemen Akun',
      event: `Hapus Massal Akun (${nims.length} akun)`,
      details: `${nims.length} akun mahasiswa pengurus telah dihapus dari basis data sistem.`,
    });
  };

  const handleResetAccounts = () => {
    if (window.confirm('Kembalikan seluruh daftar akun ke akun bawaan sistem?')) {
      setRegisteredAccounts(initialDefaultAccounts);
      resetAccountsInDb(initialDefaultAccounts);
    }
  };

  const handleImpersonate = (account) => {
    setAuthUser(account);
    setCurrentView({ page: 'portal', serviceId: null });
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTargetTitle = () => {
    if (!pendingTarget) return null;
    if (pendingTarget.page === 'admin') {
      return 'Admin & Developer Dashboard';
    }
    if (pendingTarget.serviceId) {
      const titles = {
        par: 'PAR (Program Approval Request)',
        archive: 'Digitalisasi Arsip & Persuratan',
        asset: 'Digitalisasi Aset & Inventaris',
        finance: 'Kas & Reimbursement Anggaran',
        attendance: 'Presensi Digital & QR Code Acara',
        timeline: 'Master Timeline & Kalender Kerja',
        hr: 'Database Anggota & Tata Kelola SDM',
        helpdesk: 'Helpdesk Internal & Request Desain',
      };
      return titles[pendingTarget.serviceId] || 'Layanan Workspace TeraDesk';
    }
    return 'Workspace Hub Organisasi';
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col ${
      currentView.page === 'landing' && !activePublicAttendanceId
        ? 'bg-[#060D25] text-white landing-page-root'
        : 'bg-[#F8FAFC] text-slate-800 selection:bg-blue-600 selection:text-white'
    }`}>
      {/* 1. Mode Presensi Mandiri Mobile / Tamu: Render mandiri dan ringan tanpa membebani GPU dengan background landing page */}
      {activePublicAttendanceId ? (
        <PublicAttendanceModal
          isOpen={true}
          onClose={() => {
            setActivePublicAttendanceId(null);
            if (typeof window !== 'undefined' && window.location.search.includes('presensi')) {
              const cleanUrl = window.location.origin + window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          }}
          session={
            attendanceSessions.find((s) => s.id === activePublicAttendanceId) ||
            attendanceSessions.find((s) => s.status === 'active') ||
            attendanceSessions[0]
          }
          allRecords={attendanceList}
          onAddAttendanceRecord={handleAddAttendanceRecord}
          onOpenPortal={() => {
            setActivePublicAttendanceId(null);
            handleNavigate('portal');
          }}
        />
      ) : currentView.page === 'landing' ? (
        <div className="landing-page-root w-full flex flex-col">
          {/* Hero Section with Embedded Nav & Sliced Widgets */}
          <Hero
            onOpenContact={() => setIsContactOpen(true)}
            onNavigateToPortal={(serviceId) =>
              handleNavigate(serviceId ? 'service' : 'portal', serviceId)
            }
            prokerList={prokerList}
          />

          {/* Fitur Unggulan Section (11 Cards Grid on Light Background) */}
          <Features
            onNavigateToPortal={(serviceId) =>
              handleNavigate(serviceId ? 'service' : 'portal', serviceId)
            }
          />

          {/* Tentang Kami Section (Text & 3 Photos Gallery) */}
          <AboutUs />

          {/* Footer Section (Brand, Newsletter, Socials, Phone, Copyright) */}
          <Footer
            onNavigateToPortal={() => handleNavigate('portal')}
            onOpenDevDashboard={() => handleNavigate('admin')}
          />
        </div>
      ) : currentView.page === 'login' ? (
        /* Halaman Baru: Dedicated Login Page (Trendy Clean White Palette) */
        <LoginPage
          onBackToLanding={() => handleNavigate('landing')}
          onSuccess={handleLoginSuccess}
          targetServiceTitle={getTargetTitle()}
          accounts={registeredAccounts}
          onOpenDevDashboard={() => handleNavigate('admin')}
        />
      ) : currentView.page === 'admin' ? (
        /* Halaman Baru: Admin & Developer Dashboard Dedicated Page */
        <AdminDashboardPage
          initialNav={adminInitialNav}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onBackToLanding={() => handleNavigate('landing')}
          onNavigateToPortal={() => handleNavigate('portal')}
          onNavigateToService={(serviceId) => handleNavigate('service', serviceId)}
          accounts={registeredAccounts}
          onAddAccount={handleAddAccount}
          onUpdateAccount={handleUpdateAccount}
          onUpdatePassword={handleUpdatePassword}
          onDeleteAccount={handleDeleteAccount}
          onDeleteBatchAccounts={handleDeleteBatchAccounts}
          onResetAccounts={handleResetAccounts}
          onImpersonate={handleImpersonate}
          onForceDestroySession={handleLogout}
          authUser={authUser}
          prokerList={prokerList}
          onAddProker={handleAddProker}
          onUpdateProker={handleUpdateProker}
          onDeleteProker={handleDeleteProker}
          onToggleProkerVisibility={handleToggleProkerVisibility}
          onResetProker={handleResetProker}
          onReorderProker={handleReorderProker}
          consultationMessages={consultationMessages}
          onUpdateConsultationStatus={handleUpdateConsultationStatus}
          onMarkConsultationRead={handleMarkConsultationRead}
          onMarkAllConsultationsRead={handleMarkAllConsultationsRead}
          onDeleteConsultation={handleDeleteConsultation}
          onResetConsultations={handleResetConsultations}
          onClearAllConsultations={handleClearAllConsultations}
          activityLogs={activityLogs}
          onAddActivityLog={handleAddActivityLog}
          onClearActivityLogs={handleClearActivityLogs}
          onResetActivityLogs={handleResetActivityLogs}
          tickets={designTickets}
          onAddTicket={handleAddTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onDeleteTicket={handleDeleteTicket}
          parSubmissions={parSubmissions}
          onAddParSubmission={handleAddParSubmission}
          onApproveProposal={handleApproveParSubmission}
          onUpdateParStatus={handleUpdateParStatus}
          humasMedparts={humasMedparts}
          onAddHumasMedpart={handleAddHumasMedpart}
          onApproveMedpart={handleApproveHumasMedpart}
          onRejectMedpart={handleRejectHumasMedpart}
          kkmOrders={kkmOrders}
          onAddKkmOrder={handleAddKkmOrder}
          onSetKkmLunas={handleSetKkmLunas}
          suratLog={suratLog}
          onAddSuratLog={handleAddSuratLog}
          attendanceList={attendanceList}
          onAddAttendanceRecord={handleAddAttendanceRecord}
          attendanceSessions={attendanceSessions}
          onAddAttendanceSession={handleAddAttendanceSession}
          onUpdateAttendanceSession={handleUpdateAttendanceSession}
          onDeleteAttendanceSession={handleDeleteAttendanceSession}
          onDeleteAttendanceRecord={handleDeleteAttendanceRecord}
          onOpenPublicAttendanceModal={(sessionId) => setActivePublicAttendanceId(sessionId || null)}
          moduleStatuses={moduleStatuses}
          onToggleModuleStatus={handleToggleModuleStatus}
        />
      ) : currentView.page === 'service' ? (
        /* Halaman Layanan Spesifik (PAR, Arsip, Aset, Kas, dsb.) */
        <ServiceDispatcher
          serviceId={currentView.serviceId}
          onBackToPortal={() => handleNavigate('portal')}
          onBackToLanding={() => handleNavigate('landing')}
          onSelectService={(serviceId) => handleNavigate('service', serviceId)}
          authUser={authUser}
          onLogout={handleLogout}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          prokerList={prokerList}
          onAddProker={handleAddProker}
          onUpdateProker={handleUpdateProker}
          onDeleteProker={handleDeleteProker}
          accounts={registeredAccounts}
          onAddAccount={handleAddAccount}
          onAddActivityLog={handleAddActivityLog}
          tickets={designTickets}
          onAddTicket={handleAddTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          parSubmissions={parSubmissions}
          onAddParSubmission={handleAddParSubmission}
          onApproveProposal={handleApproveParSubmission}
          onUpdateParStatus={handleUpdateParStatus}
          humasMedparts={humasMedparts}
          onAddHumasMedpart={handleAddHumasMedpart}
          onApproveMedpart={handleApproveHumasMedpart}
          onRejectMedpart={handleRejectHumasMedpart}
          kkmOrders={kkmOrders}
          onAddKkmOrder={handleAddKkmOrder}
          onSetKkmLunas={handleSetKkmLunas}
          kkmCashflow={kkmCashflow}
          onAddKkmCashflow={handleAddKkmCashflow}
          archiveDocs={archiveDocs}
          onAddArchiveDoc={handleAddArchiveDoc}
          suratLog={suratLog}
          onAddSuratLog={handleAddSuratLog}
          assets={assets}
          onBookAsset={handleBookAsset}
          onReturnAsset={handleReturnAsset}
          financeTransactions={financeTransactions}
          onAddFinanceTransaction={handleAddFinanceTransaction}
          attendanceList={attendanceList}
          onAddAttendanceRecord={handleAddAttendanceRecord}
          attendanceSessions={attendanceSessions}
          onAddAttendanceSession={handleAddAttendanceSession}
          onUpdateAttendanceSession={handleUpdateAttendanceSession}
          onDeleteAttendanceSession={handleDeleteAttendanceSession}
          onDeleteAttendanceRecord={handleDeleteAttendanceRecord}
          onOpenPublicAttendanceModal={(sessionId) => setActivePublicAttendanceId(sessionId || null)}
          activities={activities}
          onAddActivity={handleAddActivity}
          moduleStatuses={moduleStatuses}
          onToggleModuleStatus={handleToggleModuleStatus}
        />
      ) : (
        /* Halaman Khusus Portal Fitur & Katalog Aplikasi Organisasi */
        <FeaturesPortal
          onBackToLanding={() => handleNavigate('landing')}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenDevDashboard={() => handleNavigate('admin')}
          onSelectService={(serviceId) => handleNavigate('service', serviceId)}
          authUser={authUser}
          onLogout={handleLogout}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      )}

      {/* Access Denied Modal (Role Restriction) */}
      {accessDeniedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-100 shadow-2xl text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <ShieldAlert size={28} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
              Akses Dibatasi • Hak Akses Non-Admin
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Akses Dashboard Admin Ditolak
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Akun atas nama <strong className="text-slate-900">{accessDeniedInfo.name}</strong> (NIM: <span className="font-mono font-bold text-slate-900">{accessDeniedInfo.nim}</span>) terdaftar dengan hak akses <strong className="text-rose-600">Anggota Biasa</strong> dan tidak memiliki izin Administrator untuk mengelola Dashboard Admin.
            </p>
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-[11px] text-slate-500 mb-5 text-left space-y-1">
              <p className="font-bold text-slate-700">
                💡 Hak Akses Anda Saat Ini:
              </p>
              <p>
                Anda tetap memiliki akses penuh ke seluruh modul Portal Layanan Mahasiswa (PAR, E-Arsip, Digitalisasi Aset, Presensi, dsb.). Hubungi Ketua Umum atau Administrator jika Anda membutuhkan hak akses panel admin.
              </p>
            </div>
            <button
              onClick={() => setAccessDeniedInfo(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              Mengerti & Lanjut ke Portal Layanan
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onSubmitMessage={handleSendConsultation}
      />

      {/* Floating Spotlight Command Palette Trigger Pill (Khusus di luar Landing Page & Bukan di mode presensi HP) */}
      {currentView.page !== 'landing' && !activePublicAttendanceId && (
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          aria-label="Buka Spotlight Command Palette (Ctrl+K)"
          title="Buka Spotlight Command Palette (Ctrl + K)"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-slate-700/80 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Search size={11} className="stroke-[3]" />
          </div>
          <span className="text-xs font-bold text-slate-200 group-hover:text-white">Spotlight</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            Ctrl K
          </kbd>
        </button>
      )}

      {/* Global Spotlight Command Palette Modal (Khusus di luar Landing Page) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen && currentView.page !== 'landing'}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
        authUser={authUser}
        accounts={registeredAccounts}
        prokerList={prokerList}
        tickets={designTickets}
        archiveDocs={archiveDocs}
        suratLog={suratLog}
        assets={assets}
        activityLogs={activityLogs}
        consultationMessages={consultationMessages}
      />
    </div>
  );
}

export default App;

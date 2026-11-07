import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import Hero from './components/Hero';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import LoginPage from './components/LoginPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import FeaturesPortal from './components/FeaturesPortal';
import ServiceDispatcher from './components/services/ServiceDispatcher';
import { initialDefaultAccounts } from './data/defaultAccounts';
import { initialDefaultProker } from './data/defaultProker';
import { initialDefaultConsultations } from './data/defaultConsultations';
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
  resetConsultationsInDb,
} from './services/consultationService';
import {
  subscribeAccounts,
  addAccountToDb,
  updateAccountInDb,
  updatePasswordInDb,
  deleteAccountFromDb,
  resetAccountsInDb,
} from './services/accountService';
import {
  subscribeTickets,
  addTicketToDb,
  updateTicketInDb,
  deleteTicketFromDb,
} from './services/ticketService';
import { getDeviceInfo } from './utils/deviceDetector';

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

  // Registered accounts state dengan pembersihan data lama agar hanya akun Alif Fikri yang aktif
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      localStorage.removeItem('teradesk_dev_accounts');
      localStorage.removeItem('teradesk_dev_accounts_v2');
      const saved = localStorage.getItem('teradesk_dev_accounts_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((acc) => ({
            ...acc,
            canAccessAdmin: acc.canAccessAdmin ?? (acc.nim === '23404053' || acc.isDefault === true),
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
      localStorage.setItem('teradesk_dev_accounts_v3', JSON.stringify(registeredAccounts));
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

  // Kotak Masuk Konsultasi (Inbox Kontak) state terintegrasi
  const [consultationMessages, setConsultationMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_consultations_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialDefaultConsultations;
  });

  // Sinkronisasi otomatis antar-tab browser dan saat window fokus
  useEffect(() => {
    const syncFromStorage = () => {
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
    };

    const handleStorageChange = (e) => {
      if (e.key === 'teradesk_consultations_v1') {
        syncFromStorage();
      }
    };

    const handleCustomSync = (e) => {
      if (Array.isArray(e.detail)) {
        setConsultationMessages(e.detail);
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

  // Persist consultation messages
  useEffect(() => {
    try {
      localStorage.setItem('teradesk_consultations_v1', JSON.stringify(consultationMessages));
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

  // Real-time Cloud Firestore synchronization (aktif otomatis jika kredensial Firebase terisi)
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubLogs = subscribeActivityLogs((cloudLogs) => {
      if (Array.isArray(cloudLogs) && cloudLogs.length > 0) {
        setActivityLogs(cloudLogs);
      }
    });

    const unsubConsultations = subscribeConsultations((cloudMessages) => {
      if (Array.isArray(cloudMessages) && cloudMessages.length > 0) {
        setConsultationMessages(cloudMessages);
      }
    });

    const unsubAccounts = subscribeAccounts(
      (cloudAccounts) => {
        if (Array.isArray(cloudAccounts) && cloudAccounts.length > 0) {
          setRegisteredAccounts(cloudAccounts);
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

    return () => {
      unsubLogs();
      unsubConsultations();
      unsubAccounts();
      unsubTickets();
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
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

    // Selalu baca data terbaru dari storage agar tidak tertimpa state lama di memori
    let currentList = [];
    try {
      const saved = localStorage.getItem('teradesk_consultations_v1');
      if (saved) {
        currentList = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    if (!Array.isArray(currentList) || currentList.length === 0) {
      currentList = consultationMessages;
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
    setConsultationMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (isFirebaseConfigured) {
      deleteConsultationFromDb(id);
    }
  };

  const handleResetConsultations = () => {
    setConsultationMessages(initialDefaultConsultations);
    if (isFirebaseConfigured) {
      resetConsultationsInDb(initialDefaultConsultations);
    }
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

  // Guarantee that on page refresh (initial mount), session is completely destroyed
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleNavigate = (page, serviceId = null, pushHistory = true) => {
    if (page === 'landing') {
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
    setRegisteredAccounts((prev) => prev.filter((acc) => acc.nim !== nim));
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
      currentView.page === 'landing'
        ? 'bg-[#060D25] text-white landing-page-root'
        : 'bg-[#F8FAFC] text-slate-800 selection:bg-blue-600 selection:text-white'
    }`}>
      {currentView.page === 'landing' ? (
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
          onBackToLanding={() => handleNavigate('landing')}
          onNavigateToPortal={() => handleNavigate('portal')}
          onNavigateToService={(serviceId) => handleNavigate('service', serviceId)}
          accounts={registeredAccounts}
          onAddAccount={handleAddAccount}
          onUpdateAccount={handleUpdateAccount}
          onUpdatePassword={handleUpdatePassword}
          onDeleteAccount={handleDeleteAccount}
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
          activityLogs={activityLogs}
          onAddActivityLog={handleAddActivityLog}
          onClearActivityLogs={handleClearActivityLogs}
          onResetActivityLogs={handleResetActivityLogs}
          tickets={designTickets}
          onAddTicket={handleAddTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onDeleteTicket={handleDeleteTicket}
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
    </div>
  );
}

export default App;

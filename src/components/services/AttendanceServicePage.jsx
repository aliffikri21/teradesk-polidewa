import React, { useState, useMemo } from 'react';
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
  KeyRound,
  Plus,
  AlertCircle,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Camera,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Radio,
  Copy,
  Check,
  Smartphone,
  Compass,
  Share2,
  Pencil,
  Trash2,
  Lock,
  RotateCcw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ServicePageLayout from './ServicePageLayout';
import {
  defaultAttendanceSessions,
  defaultAttendanceList,
} from '../../data/defaultModulesData';
import { OFFICIAL_DIVISIONS, isUserCoordinator } from '../../data/defaultAccounts';
import {
  isDummyAttendanceSession,
  isDummyAttendanceRecord,
} from '../../services/moduleSyncService';
import { playNotificationChime } from '../../utils/notificationSound';
import { PALOPO_LOCATION_PRESETS } from '../../utils/geoDistance';

const DIVISION_COLORS = {
  'BPH (Badan Pengurus Harian)': 'bg-indigo-500',
  'Divisi Kesekretariatan': 'bg-emerald-500',
  'Divisi Publikasi dan Dokumentasi': 'bg-rose-500',
  'Divisi Humas': 'bg-sky-500',
  'Divisi Kaderisasi': 'bg-blue-500',
  'Divisi KKM (Kewirausahaan)': 'bg-amber-500',
};

const AttendanceServicePage = (props) => {
  const {
    attendanceList: propAttendance,
    onAddAttendanceRecord,
    onDeleteAttendanceRecord,
    attendanceSessions: propSessions,
    onAddAttendanceSession,
    onUpdateAttendanceSession,
    onDeleteAttendanceSession,
    authUser,
    onOpenPublicAttendanceModal,
  } = props;

  // State Sessions
  const [localSessions, setLocalSessions] = useState(() =>
    defaultAttendanceSessions.filter((s) => !isDummyAttendanceSession(s))
  );
  const rawSessions = propSessions || localSessions;
  const sessions = useMemo(
    () => (rawSessions || []).filter((s) => !isDummyAttendanceSession(s)),
    [rawSessions]
  );

  // Selected Session
  const [selectedSessionId, setSelectedSessionId] = useState(
    () => sessions.find((s) => s.status === 'active')?.id || sessions[0]?.id || ''
  );

  const currentSession = useMemo(() => {
    return (
      sessions.find((s) => s.id === selectedSessionId) ||
      sessions.find((s) => s.status === 'active') ||
      sessions[0] ||
      null
    );
  }, [sessions, selectedSessionId]);

  // State Records
  const [localAttendance, setLocalAttendance] = useState(() =>
    defaultAttendanceList.filter((r) => !isDummyAttendanceRecord(r))
  );
  const rawRecords = propAttendance || localAttendance;
  const allRecords = useMemo(
    () => (rawRecords || []).filter((r) => !isDummyAttendanceRecord(r)),
    [rawRecords]
  );

  // Filter records by selected session
  const sessionRecords = useMemo(() => {
    if (!currentSession) return [];
    return allRecords.filter((rec) => !rec.sessionId || rec.sessionId === currentSession.id);
  }, [allRecords, currentSession]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'log' | 'notula' | 'rekap'

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Filter Agenda & Collapse state khusus Tab 2: Live Log Kehadiran
  const [logAgendaFilter, setLogAgendaFilter] = useState('all'); // 'all' | sessionId
  const [collapsedSessionIds, setCollapsedSessionIds] = useState({});

  const toggleSessionCollapse = (sessionId) => {
    setCollapsedSessionIds((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  // Interactive Check-In Modal State
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [checkinMethodTab, setCheckinMethodTab] = useState('pin'); // 'pin' | 'qr'
  const [enteredPin, setEnteredPin] = useState('');
  const [checkinError, setCheckinError] = useState('');
  const [checkinSuccess, setCheckinSuccess] = useState('');
  const [isCameraScanning, setIsCameraScanning] = useState(false);

  // Leave / Permission Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Izin', // 'Izin' | 'Sakit'
    reason: '',
    attachmentName: '',
  });

  // Create Session Modal State
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [copiedQrLink, setCopiedQrLink] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    title: '',
    division: OFFICIAL_DIVISIONS[0],
    date: '08 November 2026',
    timeStart: '14:00 WITA',
    timeEnd: '16:30 WITA',
    toleranceTime: '14:15 WITA',
    location: 'Lapangan Pancasila Palopo (Area Gazebo Teramedia)',
    agenda: '',
    locationPreset: 'lapangan-pancasila',
    lat: -2.9928,
    lng: 120.1983,
    locationName: 'Lapangan Pancasila Palopo',
    radiusMeters: 100,
    isDetectingGps: false,
  });

  // Salin Tautan Presensi Smartphone ke Clipboard
  const handleCopyQrLink = () => {
    if (!currentSession) return;
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?presensi=${currentSession.id}&token=${currentSession.qrToken}`
      : `https://teradesk.politeknikdewantara.ac.id/?presensi=${currentSession.id}&token=${currentSession.qrToken}`;
    navigator.clipboard.writeText(url);
    setCopiedQrLink(true);
    playNotificationChime();
    setTimeout(() => setCopiedQrLink(false), 3000);
  };

  // Ambil Titik GPS Pembuat Rapat (Alif / Pengurus)
  const handleDetectCreatorGps = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung Geolocation API.');
      return;
    }
    setNewSessionForm((prev) => ({ ...prev, isDetectingGps: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setNewSessionForm((prev) => ({
          ...prev,
          lat,
          lng,
          locationPreset: 'custom',
          locationName: prev.locationName || 'Lokasi Terdeteksi GPS Pembuat',
          location: prev.location || 'Lokasi Terdeteksi GPS Pembuat',
          isDetectingGps: false,
        }));
      },
      (err) => {
        alert(`Gagal mengambil titik GPS: ${err.message || 'Izin lokasi belum diberikan.'}`);
        setNewSessionForm((prev) => ({ ...prev, isDetectingGps: false }));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handle Preset Lokasi Change
  const handlePresetChange = (presetId) => {
    const found = PALOPO_LOCATION_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setNewSessionForm((prev) => ({
        ...prev,
        locationPreset: presetId,
        lat: found.lat,
        lng: found.lng,
        locationName: found.name,
        location: found.name,
        radiusMeters: found.defaultRadius,
      }));
    } else {
      setNewSessionForm((prev) => ({
        ...prev,
        locationPreset: 'custom',
      }));
    }
  };

  // Role Check: Hanya Koordinator Divisi, BPH, atau Eksekutif yang memiliki hak akses kelola sesi
  const isCoordinator = useMemo(() => isUserCoordinator(authUser), [authUser]);

  // Edit Session Modal State
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [editSessionForm, setEditSessionForm] = useState({
    id: '',
    title: '',
    division: OFFICIAL_DIVISIONS[0],
    date: '08 November 2026',
    timeStart: '14:00 WITA',
    timeEnd: '16:30 WITA',
    toleranceTime: '14:15 WITA',
    location: '',
    agenda: '',
    locationPreset: 'custom',
    lat: -2.9928,
    lng: 120.1983,
    locationName: '',
    radiusMeters: 100,
    isDetectingGps: false,
  });

  // Ambil Titik GPS Pembuat Rapat Saat Edit
  const handleDetectEditGps = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung Geolocation API.');
      return;
    }
    setEditSessionForm((prev) => ({ ...prev, isDetectingGps: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setEditSessionForm((prev) => ({
          ...prev,
          lat,
          lng,
          locationPreset: 'custom',
          isDetectingGps: false,
        }));
      },
      (err) => {
        alert(`Gagal mengambil titik GPS: ${err.message || 'Izin lokasi belum diberikan.'}`);
        setEditSessionForm((prev) => ({ ...prev, isDetectingGps: false }));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handle Preset Lokasi Saat Edit
  const handleEditPresetChange = (presetId) => {
    const found = PALOPO_LOCATION_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setEditSessionForm((prev) => ({
        ...prev,
        locationPreset: presetId,
        lat: found.lat,
        lng: found.lng,
        locationName: found.name,
        location: found.name,
        radiusMeters: found.defaultRadius,
      }));
    } else {
      setEditSessionForm((prev) => ({
        ...prev,
        locationPreset: 'custom',
      }));
    }
  };

  // Buka Modal Edit Sesi
  const handleOpenEditSessionModal = (s = currentSession) => {
    if (!s) {
      alert('Belum ada sesi rapat yang dapat diedit.');
      return;
    }
    if (!isCoordinator) {
      alert(
        `Akses Ditolak: Hanya Koordinator Divisi atau BPH yang berhak mengedit data agenda rapat. Status akun Anda saat ini: "${authUser?.role || 'Anggota Biasa'}".`
      );
      return;
    }

    const coords = s.coordinates || {
      lat: -2.9928,
      lng: 120.1983,
      locationName: s.location || 'Politeknik Dewantara Palopo',
      radiusMeters: 100,
    };

    setEditSessionForm({
      id: s.id,
      title: s.title || '',
      division: s.division || OFFICIAL_DIVISIONS[0],
      date: s.date || '08 November 2026',
      timeStart: s.timeStart || '14:00 WITA',
      timeEnd: s.timeEnd || '16:30 WITA',
      toleranceTime: s.toleranceTime || '14:15 WITA',
      location: s.location || '',
      agenda: s.agenda || '',
      locationPreset: 'custom',
      lat: coords.lat,
      lng: coords.lng,
      locationName: coords.locationName || s.location || '',
      radiusMeters: coords.radiusMeters || 100,
      isDetectingGps: false,
    });
    setIsEditSessionModalOpen(true);
  };

  // Simpan Perubahan Sesi Rapat
  const handleSaveEditSession = (e) => {
    e.preventDefault();
    if (!editSessionForm.title.trim()) {
      alert('Judul agenda rapat wajib diisi.');
      return;
    }

    const targetSession = sessions.find((s) => s.id === editSessionForm.id) || currentSession;
    if (!targetSession) return;

    const updatedSession = {
      ...targetSession,
      title: editSessionForm.title.trim(),
      division: editSessionForm.division,
      date: editSessionForm.date,
      timeStart: editSessionForm.timeStart,
      timeEnd: editSessionForm.timeEnd,
      toleranceTime: editSessionForm.toleranceTime,
      location: editSessionForm.location.trim(),
      agenda: editSessionForm.agenda.trim(),
      coordinates: {
        ...(targetSession.coordinates || {}),
        locationName: editSessionForm.locationName.trim() || editSessionForm.location.trim(),
        lat: Number(editSessionForm.lat) || -2.9928,
        lng: Number(editSessionForm.lng) || 120.1983,
        radiusMeters: Number(editSessionForm.radiusMeters) || 100,
      },
    };

    if (onUpdateAttendanceSession) {
      onUpdateAttendanceSession(updatedSession);
    } else {
      setLocalSessions((prev) =>
        prev.map((item) => (item.id === updatedSession.id ? updatedSession : item))
      );
    }

    setIsEditSessionModalOpen(false);
    playNotificationChime();
    setCheckinSuccess(`Perubahan agenda rapat "${updatedSession.title}" berhasil disimpan!`);
    setTimeout(() => setCheckinSuccess(''), 5000);
  };

  // Hapus Agenda Rapat
  const handleDeleteSession = (sessionId = currentSession?.id) => {
    if (!sessionId) {
      alert('Belum ada sesi rapat yang dapat dihapus.');
      return;
    }
    if (!isCoordinator) {
      alert(
        `Akses Ditolak: Hanya Koordinator Divisi atau BPH yang berhak menghapus agenda rapat. Status akun Anda saat ini: "${authUser?.role || 'Anggota Biasa'}".`
      );
      return;
    }

    const target = sessions.find((s) => s.id === sessionId);
    const targetTitle = target?.title || sessionId;

    if (!window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus agenda rapat "${targetTitle}"? Sesi akan dihapus permanen dari sistem.`)) {
      return;
    }

    if (onDeleteAttendanceSession) {
      onDeleteAttendanceSession(sessionId);
    } else {
      setLocalSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }

    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSelectedSessionId(remaining[0]?.id || '');
    playNotificationChime();
    setCheckinSuccess(`Agenda rapat "${targetTitle}" berhasil dihapus.`);
    setTimeout(() => setCheckinSuccess(''), 5000);
  };

  // Hapus Catatan Kehadiran Individu (Khusus Koordinator Divisi)
  const handleDeleteSingleRecord = (recordId, attendeeName) => {
    if (!isCoordinator) {
      alert('Akses Ditolak: Hanya Koordinator Divisi atau BPH yang berhak menghapus data presensi.');
      return;
    }
    if (!window.confirm(`Hapus catatan kehadiran "${attendeeName || 'Pengurus'}" dari agenda rapat ini?`)) {
      return;
    }
    if (onDeleteAttendanceRecord) {
      onDeleteAttendanceRecord(recordId);
    } else {
      setLocalAttendance((prev) => prev.filter((r) => r.id !== recordId));
    }
    playNotificationChime();
    setCheckinSuccess(`Catatan kehadiran "${attendeeName || 'Pengurus'}" berhasil dihapus.`);
    setTimeout(() => setCheckinSuccess(''), 4500);
  };

  // Selesaikan / Arsipkan Agenda Rapat (Khusus Koordinator Divisi)
  const handleToggleCompleteSession = (sessionToToggle = currentSession) => {
    const s = sessionToToggle || currentSession;
    if (!s) {
      alert('Belum ada sesi rapat yang aktif.');
      return;
    }

    if (!isCoordinator) {
      alert(
        `Akses Ditolak: Fitur menyelesaikan/mengarsipkan rapat hanya dapat dilakukan oleh Koordinator Divisi atau BPH. Akun Anda terdaftar sebagai "${authUser?.role || 'Anggota Biasa'}".`
      );
      return;
    }

    const isCurrentlyActive = s.status === 'active';
    const confirmMsg = isCurrentlyActive
      ? `Apakah Anda yakin ingin menyelesaikan agenda rapat "${s.title}"? Sesi presensi QR akan ditutup dan status diubah menjadi selesai & diarsipkan.`
      : `Buka kembali sesi rapat "${s.title}" sebagai agenda aktif?`;

    if (!window.confirm(confirmMsg)) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

    const updatedSession = {
      ...s,
      status: isCurrentlyActive ? 'completed' : 'active',
      timeEnd: isCurrentlyActive ? timeStr : s.timeEnd,
      completedAt: isCurrentlyActive ? new Date().toISOString() : null,
      completedBy: isCurrentlyActive
        ? {
            name: authUser?.name || 'Koordinator Divisi',
            nim: authUser?.nim || '-',
            role: authUser?.role || 'Koordinator Divisi',
          }
        : null,
    };

    if (onUpdateAttendanceSession) {
      onUpdateAttendanceSession(updatedSession);
    } else {
      setLocalSessions((prev) =>
        prev.map((item) => (item.id === updatedSession.id ? updatedSession : item))
      );
    }

    playNotificationChime();
    setCheckinSuccess(
      isCurrentlyActive
        ? `Agenda rapat "${s.title}" berhasil diselesaikan & diarsipkan oleh Koordinator Divisi (${authUser?.name || 'Koordinator'}).`
        : `Agenda rapat "${s.title}" berhasil diaktifkan kembali!`
    );
    setTimeout(() => setCheckinSuccess(''), 5000);
  };

  // Bagikan Undangan Rapat ke WhatsApp
  const handleShareWhatsApp = (targetSession = currentSession) => {
    const s = targetSession || currentSession;
    if (!s) {
      alert('Belum ada sesi rapat yang dapat dibagikan.');
      return;
    }

    const sessionCoords = s.coordinates || {
      locationName: s.location || 'Lapangan Pancasila Palopo',
      radiusMeters: 100,
    };

    const attendancePublicUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?presensi=${s.id}&token=${s.qrToken}`
      : `https://teradesk.politeknikdewantara.ac.id/?presensi=${s.id}&token=${s.qrToken}`;

    const message = [
      `📢 *UNDANGAN PRESENSI RAPAT TERAMEDIA*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 *Agenda:* ${s.title}`,
      `🏢 *Divisi:* ${s.division}`,
      `📅 *Hari/Tanggal:* ${s.date}`,
      `⏰ *Waktu:* ${s.timeStart} - ${s.timeEnd} (WITA)`,
      `⏳ *Toleransi Presensi:* Hingga ${s.toleranceTime} WITA`,
      `📍 *Lokasi Rapat:* ${s.location}`,
      `📡 *Titik Geofence:* ${sessionCoords.locationName} (Radius Maks. ${sessionCoords.radiusMeters || 100}m)`,
      `🔢 *PIN Proyektor:* ${s.pinCode}`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📲 *Tautan Presensi Mandiri Smartphone:*`,
      `${attendancePublicUrl}`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Dibuat Oleh:* ${s.createdBy?.name || s.organizer || 'Pengurus'} (NIM: ${s.createdBy?.nim || '23404053'})`,
      `⚠️ _Presensi diverifikasi otomatis dengan radius GPS pembuat rapat. Harap hadir tepat waktu._`
    ].join('\n');

    try {
      navigator.clipboard.writeText(message);
    } catch {
      // ignore
    }

    playNotificationChime();
    setCheckinSuccess('Teks undangan WhatsApp berhasil disalin ke clipboard!');
    setTimeout(() => setCheckinSuccess(''), 4500);

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // New Notula Decision & Action Item Form States
  const [newDecisionInput, setNewDecisionInput] = useState('');
  const [isAddActionItemOpen, setIsAddActionItemOpen] = useState(false);
  const [newActionItem, setNewActionItem] = useState({
    task: '',
    pic: '',
    deadline: '',
  });

  // Dynamic QR Refresh
  const handleRefreshQr = () => {
    if (!currentSession) return;
    const randomToken = `TERA-QR-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomPin = `${Math.floor(100000 + Math.random() * 900000)}`;
    const updated = {
      ...currentSession,
      qrToken: randomToken,
      pinCode: randomPin,
    };
    if (onUpdateAttendanceSession) {
      onUpdateAttendanceSession(updated);
    } else {
      setLocalSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
    setCheckinSuccess(`Token QR (${randomToken}) & PIN (${randomPin}) berhasil diperbarui!`);
    setTimeout(() => setCheckinSuccess(''), 4000);
  };

  // Helper check if late
  const checkIsLate = (session) => {
    if (!session?.toleranceTime) return { isLate: false, diff: 0 };
    try {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;

      // Parse tolerance time, e.g. "14:15 WITA"
      const tolMatch = session.toleranceTime.match(/(\d{1,2}):(\d{2})/);
      if (tolMatch) {
        const tolHours = parseInt(tolMatch[1], 10);
        const tolMinutes = parseInt(tolMatch[2], 10);
        const tolTotalMin = tolHours * 60 + tolMinutes;
        if (currentTotalMin > tolTotalMin) {
          const diff = currentTotalMin - tolTotalMin;
          return { isLate: true, diff };
        }
      }
    } catch {
      // fallback
    }
    return { isLate: false, diff: 0 };
  };

  // Submit Check-In
  const handleExecuteCheckIn = (methodName = 'Input PIN') => {
    if (!currentSession) {
      setCheckinError('Tidak ada agenda rapat yang aktif.');
      return;
    }
    const user = authUser || {
      name: 'Alif Fikri Haykal',
      nim: '23404053',
      division: 'BPH (Badan Pengurus Harian)',
      role: 'Demisioner Ketum',
    };

    // Check if user already checked in for this session
    const existing = sessionRecords.find(
      (r) => r.name.toLowerCase() === user.name.toLowerCase() || (user.nim && r.nim === user.nim)
    );
    if (existing) {
      setCheckinError(`Pengurus ${user.name} sudah tercatat presensi sebelumnya (${existing.status}).`);
      setTimeout(() => setCheckinError(''), 4500);
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;
    const lateCheck = checkIsLate(currentSession);
    const statusText = lateCheck.isLate
      ? `Terlambat (${lateCheck.diff}m)`
      : 'Tepat Waktu';

    const newRecord = {
      id: `REC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      sessionId: currentSession.id,
      name: user.name,
      nim: user.nim || '23404053',
      division: user.division || 'BPH (Badan Pengurus Harian)',
      role: user.role || 'Pengurus',
      time: timeStr,
      status: statusText,
      method: methodName,
      note: lateCheck.isLate ? `Check-in lewat batas toleransi ${currentSession.toleranceTime}` : 'Presensi terverifikasi',
    };

    if (onAddAttendanceRecord) {
      onAddAttendanceRecord(newRecord);
    } else {
      setLocalAttendance((prev) => [newRecord, ...prev]);
    }

    playNotificationChime();
    setCheckinSuccess(`Check-In Berhasil! ${user.name} tercatat ${statusText} pada ${timeStr}.`);
    setEnteredPin('');
    setIsCameraScanning(false);
    setIsCheckinModalOpen(false);
    setTimeout(() => setCheckinSuccess(''), 5000);
  };

  // Verify PIN
  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (!currentSession) {
      setCheckinError('Belum ada sesi rapat yang aktif.');
      return;
    }
    if (!enteredPin.trim()) {
      setCheckinError('Harap masukkan 6 digit kode PIN rapat.');
      return;
    }
    if (enteredPin.trim() !== currentSession.pinCode) {
      setCheckinError(`Kode PIN salah. Silakan periksa PIN pada layar proyektor (${currentSession.pinCode}).`);
      return;
    }
    setCheckinError('');
    handleExecuteCheckIn('Input PIN 6-Digit');
  };

  // Trigger QR Scan Simulation
  const handleStartQrScan = () => {
    setIsCameraScanning(true);
    setCheckinError('');
    setTimeout(() => {
      setIsCameraScanning(false);
      handleExecuteCheckIn('QR Scanner');
    }, 2200);
  };

  // Submit Leave / Permission Request
  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if (!currentSession) {
      alert('Tidak ada agenda rapat yang aktif.');
      return;
    }
    if (!leaveForm.reason.trim()) {
      alert('Mohon isi alasan / keterangan pengajuan.');
      return;
    }

    const user = authUser || {
      name: 'Alif Fikri Haykal',
      nim: '23404053',
      division: 'BPH (Badan Pengurus Harian)',
      role: 'Pengurus',
    };

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

    const newRecord = {
      id: `REC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      sessionId: currentSession.id,
      name: user.name,
      nim: user.nim || '23404053',
      division: user.division || 'BPH (Badan Pengurus Harian)',
      role: user.role || 'Pengurus',
      time: timeStr,
      status: leaveForm.type,
      method: 'Form Izin/Sakit',
      note: leaveForm.reason + (leaveForm.attachmentName ? ` (Bukti: ${leaveForm.attachmentName})` : ''),
    };

    if (onAddAttendanceRecord) {
      onAddAttendanceRecord(newRecord);
    } else {
      setLocalAttendance((prev) => [newRecord, ...prev]);
    }

    playNotificationChime();
    setCheckinSuccess(`Pengajuan ${leaveForm.type} atas nama ${user.name} berhasil diajukan.`);
    setIsLeaveModalOpen(false);
    setLeaveForm({ type: 'Izin', reason: '', attachmentName: '' });
    setTimeout(() => setCheckinSuccess(''), 5000);
  };

  // Create New Meeting Session
  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!isCoordinator) {
      alert(
        `Akses Ditolak: Hanya Koordinator Divisi atau BPH yang berhak membuat agenda rapat baru. Status akun Anda saat ini: "${authUser?.role || 'Anggota Biasa'}".`
      );
      return;
    }
    if (!newSessionForm.title.trim()) {
      alert('Judul rapat / agenda wajib diisi.');
      return;
    }

    const randomToken = `TERA-QR-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomPin = `${Math.floor(100000 + Math.random() * 900000)}`;

    const newSession = {
      id: `SES-2026-${Date.now().toString().slice(-5)}`,
      title: newSessionForm.title,
      division: newSessionForm.division,
      date: newSessionForm.date,
      timeStart: newSessionForm.timeStart,
      timeEnd: newSessionForm.timeEnd,
      toleranceTime: newSessionForm.toleranceTime,
      location: newSessionForm.location,
      status: 'active',
      qrToken: randomToken,
      pinCode: randomPin,
      organizer: newSessionForm.division,
      createdBy: {
        name: authUser?.name || 'Alif Fikri Haykal',
        nim: authUser?.nim || '23404053',
        role: authUser?.role || 'Demisioner Ketum',
        division: authUser?.division || newSessionForm.division,
      },
      coordinates: {
        lat: Number(newSessionForm.lat) || -2.9928,
        lng: Number(newSessionForm.lng) || 120.1983,
        locationName: newSessionForm.locationName || newSessionForm.location || 'Lapangan Pancasila Palopo',
        radiusMeters: Number(newSessionForm.radiusMeters) || 100,
      },
      agenda: newSessionForm.agenda || 'Koordinasi kegiatan keorganisasian TERAMEDIA.',
      notula: {
        summary: 'Notula rapat sedang dalam proses pencatatan oleh sekretariat.',
        keyDecisions: [],
        actionItems: [],
      },
    };

    if (onAddAttendanceSession) {
      onAddAttendanceSession(newSession);
    } else {
      setLocalSessions((prev) => [newSession, ...prev]);
    }

    setSelectedSessionId(newSession.id);
    setIsNewSessionModalOpen(false);
    setCheckinSuccess(`Sesi Rapat "${newSession.title}" berhasil dibuat dan diaktifkan!`);
    setTimeout(() => setCheckinSuccess(''), 5000);
  };

  // Toggle Action Item Status
  const handleToggleActionItemStatus = (itemId) => {
    if (!currentSession?.notula?.actionItems) return;
    const updatedItems = (currentSession.notula?.actionItems || []).map((item) => {
      if (item.id === itemId) {
        const nextStatus =
          item.status === 'done'
            ? 'pending'
            : item.status === 'in_progress'
            ? 'done'
            : 'in_progress';
        return { ...item, status: nextStatus };
      }
      return item;
    });

    const updatedSession = {
      ...currentSession,
      notula: {
        ...(currentSession.notula || {}),
        actionItems: updatedItems,
      },
    };

    if (onUpdateAttendanceSession) {
      onUpdateAttendanceSession(updatedSession);
    } else {
      setLocalSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    }
  };

  // Add Key Decision to Session Notula
  const handleAddDecision = (e) => {
    e.preventDefault();
    if (!currentSession || !newDecisionInput.trim()) return;
    const existingDecisions = currentSession.notula?.keyDecisions || [];
    const updatedSession = {
      ...currentSession,
      notula: {
        ...(currentSession.notula || {}),
        keyDecisions: [...existingDecisions, newDecisionInput.trim()],
      },
    };

    if (onUpdateAttendanceSession) {
      onUpdateAttendanceSession(updatedSession);
    } else {
      setLocalSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    }
    setNewDecisionInput('');
  };

  // Add Action Item to Session Notula
  const handleAddActionItem = (e) => {
    e.preventDefault();
    if (!currentSession) return;
    if (!newActionItem.task.trim() || !newActionItem.pic.trim()) {
      alert('Tugas dan nama PIC wajib diisi.');
      return;
    }

    const item = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      task: newActionItem.task.trim(),
      pic: newActionItem.pic.trim(),
      deadline: newActionItem.deadline.trim() || 'Sesuai Arahan Rapat',
      status: 'pending',
    };

    const existingItems = currentSession.notula?.actionItems || [];
    const updatedSession = {
      ...currentSession,
      notula: {
        ...(currentSession.notula || {}),
        actionItems: [...existingItems, item],
      },
    };

    if (onUpdateAttendanceSession) {
      onUpdateAttendanceSession(updatedSession);
    } else {
      setLocalSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    }
    setNewActionItem({ task: '', pic: '', deadline: '' });
    setIsAddActionItemOpen(false);
  };

  // Export to Excel (.xlsx)
  const handleExportXlsx = () => {
    if (!currentSession) {
      alert('Belum ada agenda rapat yang dapat diekspor. Silakan buat sesi rapat terlebih dahulu.');
      return;
    }
    // Sheet 1: Log Kehadiran Sesi
    const rowsAttendance = sessionRecords.map((item, idx) => ({
      No: idx + 1,
      'ID Presensi': item.id,
      'Nama Pengurus': item.name,
      NIM: item.nim || '-',
      Divisi: item.division,
      Jabatan: item.role,
      'Waktu Presensi (WITA)': item.time,
      'Status Kehadiran': item.status,
      'Metode Validasi': item.method || 'Manual',
      'Catatan / Keterangan': item.note || '-',
    }));
    const wsAttendance = XLSX.utils.json_to_sheet(rowsAttendance);
    wsAttendance['!cols'] = [
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

    // Sheet 2: Rekapitulasi Partisipasi Divisi
    const divisionRecapData = OFFICIAL_DIVISIONS.map((divName) => {
      const recordsForDiv = allRecords.filter((r) => r.division === divName);
      const hadirCount = recordsForDiv.filter(
        (r) => r.status?.includes('Tepat') || r.status?.includes('Terlambat') || r.status === 'Hadir'
      ).length;
      const tepatCount = recordsForDiv.filter((r) => r.status?.includes('Tepat')).length;
      const lambatCount = recordsForDiv.filter((r) => r.status?.includes('Terlambat')).length;
      const izinCount = recordsForDiv.filter((r) => r.status === 'Izin' || r.status === 'Sakit').length;
      const totalRecorded = recordsForDiv.length;
      const percent = totalRecorded > 0 ? Math.round((hadirCount / totalRecorded) * 100) : 0;
      return {
        div: divName,
        total: totalRecorded,
        hadir: hadirCount,
        tepat: tepatCount,
        lambat: lambatCount,
        izin: izinCount,
        percent,
      };
    });
    const rowsRecap = divisionRecapData.map((d, idx) => ({
      No: idx + 1,
      'Divisi Pengurus': d.div,
      'Total Anggota': d.total,
      'Total Hadir': d.hadir,
      'Tepat Waktu': d.tepat,
      Terlambat: d.lambat,
      'Izin / Sakit': d.izin,
      'Tingkat Kehadiran': `${d.percent}%`,
    }));
    const wsRecap = XLSX.utils.json_to_sheet(rowsRecap);
    wsRecap['!cols'] = [
      { wch: 6 },
      { wch: 34 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
    ];

    // Sheet 3: Notula & Action Items
    const rowsNotula = (currentSession?.notula?.actionItems || []).map((act, idx) => ({
      No: idx + 1,
      'ID Tugas': act.id,
      'Deskripsi Tindak Lanjut': act.task,
      'Penanggung Jawab (PIC)': act.pic,
      'Tenggat Waktu (WITA)': act.deadline,
      Status: act.status === 'done' ? 'Selesai' : act.status === 'in_progress' ? 'Dalam Pengerjaan' : 'Menunggu',
    }));
    const wsNotula = XLSX.utils.json_to_sheet(
      rowsNotula.length > 0
        ? rowsNotula
        : [{ Catatan: 'Belum ada action items yang ditambahkan pada sesi ini' }]
    );
    wsNotula['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 42 },
      { wch: 24 },
      { wch: 22 },
      { wch: 18 },
    ];

    // Assemble Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsAttendance, 'Daftar Presensi');
    XLSX.utils.book_append_sheet(workbook, wsRecap, 'Rekapitulasi Divisi');
    XLSX.utils.book_append_sheet(workbook, wsNotula, 'Action Items Notula');

    const cleanTitle = (currentSession?.title || 'Semua_Sesi').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const fileName = `Rekap_Presensi_TERADESK_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setCheckinSuccess(`Spreadsheet (${fileName}) berhasil diunduh!`);
    setTimeout(() => setCheckinSuccess(''), 4500);
  };

  // Data Pengelompokan Presensi per Agenda Rapat untuk Tab 2 (Live Log Kehadiran)
  const groupedSessionsWithRecords = useMemo(() => {
    const targetSessions = logAgendaFilter === 'all'
      ? sessions
      : sessions.filter((s) => s.id === logAgendaFilter);

    return targetSessions.map((sess) => {
      // Ambil seluruh presensi milik agenda ini
      const recordsForSess = allRecords.filter(
        (rec) => rec.sessionId === sess.id
      );

      // Filter berdasarkan pencarian & filter status
      const matched = recordsForSess.filter((item) => {
        const matchSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.nim && item.nim.includes(searchQuery));
        const matchStatus =
          statusFilter === 'Semua' ||
          (statusFilter === 'Hadir' && (item.status.includes('Tepat') || item.status.includes('Terlambat'))) ||
          (statusFilter === 'Tepat Waktu' && item.status.includes('Tepat')) ||
          (statusFilter === 'Terlambat' && item.status.includes('Terlambat')) ||
          (statusFilter === 'Izin/Sakit' && (item.status.includes('Izin') || item.status.includes('Sakit')));
        return matchSearch && matchStatus;
      });

      // Urutkan dari yang terbaru di paling atas
      const sorted = [...matched].sort((a, b) => {
        const matchA = String(a.time).match(/(\d{1,2}):(\d{2})/);
        const matchB = String(b.time).match(/(\d{1,2}):(\d{2})/);
        if (matchA && matchB) {
          const minA = parseInt(matchA[1], 10) * 60 + parseInt(matchA[2], 10);
          const minB = parseInt(matchB[1], 10) * 60 + parseInt(matchB[2], 10);
          if (minA !== minB) return minB - minA;
        }
        const parseId = (id) => parseInt(String(id).replace(/\D/g, ''), 10) || 0;
        return parseId(b.id) - parseId(a.id);
      });

      const total = recordsForSess.length;
      const tepat = recordsForSess.filter((r) => r.status.includes('Tepat')).length;
      const lambat = recordsForSess.filter((r) => r.status.includes('Terlambat')).length;
      const izin = recordsForSess.filter((r) => r.status.includes('Izin') || r.status.includes('Sakit')).length;

      return {
        session: sess,
        records: sorted,
        rawRecordsCount: recordsForSess.length,
        stats: { total, tepat, lambat, izin },
      };
    });
  }, [sessions, allRecords, logAgendaFilter, searchQuery, statusFilter]);

  // Statistics for Current Session
  const stats = useMemo(() => {
    const total = sessionRecords.length;
    const tepat = sessionRecords.filter((r) => r.status.includes('Tepat')).length;
    const lambat = sessionRecords.filter((r) => r.status.includes('Terlambat')).length;
    const izin = sessionRecords.filter((r) => r.status.includes('Izin') || r.status.includes('Sakit')).length;
    const totalTarget = 48; // Total pengurus aktif dalam musyawarah
    const percentage = totalTarget > 0 ? Math.round((total / totalTarget) * 100) : 0;
    return { total, tepat, lambat, izin, percentage, totalTarget };
  }, [sessionRecords]);

  // Dynamic Division Participation Recap (100% synchronized with OFFICIAL_DIVISIONS)
  const divisionParticipationRecap = useMemo(() => {
    return OFFICIAL_DIVISIONS.map((divName) => {
      const recordsForDiv = allRecords.filter((r) => r.division === divName);
      const hadir = recordsForDiv.filter(
        (r) => r.status?.includes('Tepat') || r.status?.includes('Terlambat') || r.status === 'Hadir'
      ).length;
      const tepat = recordsForDiv.filter((r) => r.status?.includes('Tepat')).length;
      const lambat = recordsForDiv.filter((r) => r.status?.includes('Terlambat')).length;
      const izin = recordsForDiv.filter((r) => r.status === 'Izin' || r.status === 'Sakit').length;
      const total = recordsForDiv.length;
      const percent = total > 0 ? Math.round((hadir / total) * 100) : 0;
      return {
        div: divName,
        percent,
        total,
        hadir,
        tepat,
        lambat,
        izin,
        color: DIVISION_COLORS[divName] || 'bg-blue-500',
      };
    });
  }, [allRecords]);

  return (
    <ServicePageLayout
      serviceId="attendance"
      title="Presensi Digital QR Code & Notula Rapat"
      category="Tata Kelola SDM"
      badge="Modul Aktif"
      icon={ClipboardCheck}
      authUser={authUser}
      {...props}
    >
      {/* =========================================================================
          HEADER CONTROLS: Session Switcher & Quick Action Buttons
          ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Sesi selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Sesi Rapat Terpilih:
            </span>
            <div className="relative">
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                disabled={sessions.length === 0}
                className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-9 py-2.5 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sessions.length === 0 ? (
                  <option value="">Belum Ada Agenda Rapat</option>
                ) : (
                  sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.date} • {s.status === 'active' ? '🟢 Aktif' : '⚪ Selesai'})
                    </option>
                  ))
                )}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {currentSession ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  currentSession.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${currentSession.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {currentSession.status === 'active' ? 'Sesi Sedang Berlangsung' : 'Sesi Selesai (Arsip)'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-slate-100 text-slate-500 border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Belum Ada Acara Rapat
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentSession && (
              <button
                type="button"
                onClick={() => handleShareWhatsApp(currentSession)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                title="Bagikan undangan dan link presensi ke WhatsApp"
              >
                <Share2 size={14} />
                <span>Bagikan WA</span>
              </button>
            )}

            {currentSession && (
              <button
                type="button"
                onClick={() => handleToggleCompleteSession(currentSession)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  currentSession.status === 'active'
                    ? isCoordinator
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100'
                    : isCoordinator
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                title={
                  isCoordinator
                    ? currentSession.status === 'active'
                      ? 'Tandai agenda rapat ini selesai dan arsipkan'
                      : 'Buka kembali agenda rapat'
                    : 'Akses Ditolak: Fitur selesaikan agenda rapat hanya dapat dilakukan oleh Koordinator Divisi'
                }
              >
                {currentSession.status === 'active' ? (
                  <>
                    {isCoordinator ? (
                      <CheckCircle2 size={14} className="text-rose-600" />
                    ) : (
                      <Lock size={14} className="text-slate-400" />
                    )}
                    <span>Selesaikan Rapat</span>
                  </>
                ) : (
                  <>
                    {isCoordinator ? (
                      <RotateCcw size={14} className="text-blue-600" />
                    ) : (
                      <Lock size={14} className="text-slate-400" />
                    )}
                    <span>Buka Sesi</span>
                  </>
                )}
              </button>
            )}

            {currentSession && (
              <button
                type="button"
                onClick={() => handleOpenEditSessionModal(currentSession)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  isCoordinator
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                title={
                  isCoordinator
                    ? 'Edit rincian sesi rapat (waktu, lokasi, radius GPS)'
                    : 'Akses Ditolak: Hanya Koordinator Divisi yang berhak mengedit agenda rapat'
                }
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            )}

            {currentSession && (
              <button
                type="button"
                onClick={() => handleDeleteSession(currentSession.id)}
                className={`p-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  isCoordinator
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                title={
                  isCoordinator
                    ? 'Hapus agenda rapat ini'
                    : 'Akses Ditolak: Hanya Koordinator Divisi yang berhak menghapus agenda rapat'
                }
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              onClick={() => {
                if (!isCoordinator) {
                  alert(
                    `Akses Ditolak: Hanya Koordinator Divisi atau BPH yang berhak membuat agenda rapat baru. Status akun Anda saat ini: "${authUser?.role || 'Anggota Biasa'}".`
                  );
                  return;
                }
                setIsNewSessionModalOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                isCoordinator
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100 cursor-not-allowed opacity-80'
              }`}
              title={
                isCoordinator
                  ? 'Buat Agenda Rapat Baru'
                  : 'Akses Ditolak: Hanya Koordinator Divisi atau BPH yang berhak membuat agenda rapat'
              }
            >
              {isCoordinator ? <Plus size={15} /> : <Lock size={14} className="text-slate-400" />}
              <span>Buat Sesi Baru</span>
            </button>
            <button
              onClick={() => {
                if (!currentSession) {
                  alert('Belum ada agenda rapat yang aktif. Silakan buat sesi rapat terlebih dahulu.');
                  return;
                }
                setIsLeaveModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <AlertCircle size={15} />
              <span>Ajukan Izin / Sakit</span>
            </button>
            <button
              onClick={() => {
                if (!currentSession) {
                  alert('Belum ada agenda rapat yang aktif. Silakan buat sesi rapat terlebih dahulu.');
                  return;
                }
                setCheckinMethodTab('pin');
                setIsCheckinModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <QrCode size={15} />
              <span>Check-In Presensi</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {checkinSuccess && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{checkinSuccess}</span>
            </div>
            <button onClick={() => setCheckinSuccess('')} className="text-emerald-600 hover:text-emerald-800">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          TOP METRICS CARDS (LIGHT MODERN SAAS THEME)
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Tercatat Hadir Sesi Ini</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {stats.total} <span className="text-sm font-normal text-slate-400">/ {stats.totalTarget}</span>
          </div>
          <p className="text-[11px] text-slate-500">{stats.percentage}% kuorum pengurus aktif</p>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Hadir Tepat Waktu</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mb-1">
            {stats.tepat}
          </div>
          <p className="text-[11px] text-slate-500">Sebelum batas toleransi WITA</p>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Terlambat Datang</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mb-1">
            {stats.lambat}
          </div>
          <p className="text-[11px] text-slate-500">Tercatat toleransi terlampaui</p>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Izin / Sakit Resmi</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mb-1">
            {stats.izin}
          </div>
          <p className="text-[11px] text-slate-500">Keterangan terverifikasi BPH</p>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION (4 TABS)
          ========================================================================= */}
      <div className="bg-slate-100/80 border border-slate-200/80 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <QrCode size={16} />
          <span>Sesi Aktif & QR Code</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'log'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Clock size={16} />
          <span>Live Log Kehadiran ({allRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notula')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'notula'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText size={16} />
          <span>Notula & Action Items ({currentSession?.notula?.actionItems?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'rekap'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users size={16} />
          <span>Rekap Divisi & Ekspor</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: QR GENERATOR & SESI INFO
          ========================================================================= */}
      {activeTab === 'qr' && (() => {
        if (!currentSession) {
          return (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-200">
                <QrCode size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Acara Rapat Terjadwal</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                Semua data dummy acara rapat telah dibersihkan. Anda dapat membuat sesi rapat baru untuk mengaktifkan kode QR presensi mandiri dan radius GPS pembuat rapat.
              </p>
              {isCoordinator ? (
                <button
                  onClick={() => setIsNewSessionModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Buat Sesi Rapat Baru</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-200">
                  <Lock size={14} className="text-slate-400" />
                  <span>Pembuatan agenda rapat dibatasi khusus Koordinator Divisi & BPH</span>
                </div>
              )}
            </div>
          );
        }

        const sessionCoords = currentSession.coordinates || {
          lat: -2.9928,
          lng: 120.1983,
          locationName: currentSession.location || 'Lapangan Pancasila Palopo',
          radiusMeters: 100,
        };

        const attendancePublicUrl = typeof window !== 'undefined'
          ? `${window.location.origin}${window.location.pathname}?presensi=${currentSession.id}&token=${currentSession.qrToken}`
          : `https://teradesk.politeknikdewantara.ac.id/?presensi=${currentSession.id}&token=${currentSession.qrToken}`;

        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(attendancePublicUrl)}&margin=12`;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Kolom Kiri: Layar Proyektor QR Code */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 mb-3">
                {currentSession.division} • {currentSession.date}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {currentSession.title}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600 mb-2 flex-wrap">
                <span>Dibuat oleh: <strong className="text-slate-900 font-semibold">{currentSession.createdBy?.name || currentSession.organizer || 'Pengurus'}</strong></span>
                <span className="font-mono text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-md text-[11px] font-bold">
                  NIM: {currentSession.createdBy?.nim || '23404053'}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed">
                Tampilkan QR Code ini di layar rapat atau proyektor. Anggota dapat langsung memindai dengan kamera smartphone (iOS / Android) tanpa harus login admin.
              </p>

              {/* Real Scannable Dynamic QR Code */}
              <div className="p-4 bg-slate-900 rounded-3xl shadow-xl mb-4 border-4 border-slate-800 flex flex-col items-center">
                <div className="w-52 h-52 sm:w-60 sm:h-60 bg-white rounded-2xl flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner">
                  <img
                    src={qrImageUrl}
                    alt={`QR Presensi ${currentSession.title}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-md tracking-wider">
                    Token: {currentSession.qrToken}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real Scannable QR</span>
                  </span>
                </div>
              </div>

              {/* Creator Geofence Anchor Highlight Card */}
              <div className="mb-5 p-3.5 bg-purple-50/80 border border-purple-200/80 rounded-2xl text-xs text-purple-950 max-w-md w-full text-left space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-purple-800">
                    <Radio size={14} className="text-purple-600 animate-pulse" />
                    <span>Titik Radius Pembuat Rapat:</span>
                  </span>
                  <span className="text-emerald-800 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                    Maksimal {sessionCoords.radiusMeters} Meter
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Geofence berpusat di lokasi <strong>{currentSession.createdBy?.name || 'Alif Fikri Haykal'}</strong> ({sessionCoords.locationName}). Presensi anggota di luar radius ini otomatis ditolak.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(currentSession)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Bagikan undangan rapat dan link presensi langsung ke WhatsApp"
                >
                  <Share2 size={14} />
                  <span>Bagikan ke WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQrLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {copiedQrLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedQrLink ? 'Tautan HP Tersalin!' : 'Salin Tautan Presensi HP'}</span>
                </button>

                {onOpenPublicAttendanceModal && (
                  <button
                    type="button"
                    onClick={() => onOpenPublicAttendanceModal(currentSession.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Smartphone size={14} />
                    <span>Buka Form Presensi Tamu (HP)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRefreshQr}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>Perbarui Token & PIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCheckinMethodTab('pin');
                    setIsCheckinModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Check-In PIN 6 Digit</span>
                </button>
              </div>
            </div>

            {/* Kolom Kanan: Rincian Sesi, PIN Backup & Geofence GPS */}
            <div className="lg:col-span-6 space-y-6">
              {/* PIN Code Box */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <KeyRound size={18} className="text-amber-500" />
                    <span>Metode Backup: PIN Manual 6 Digit</span>
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Layar Rapat
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Jika kamera smartphone peserta mengalami kendala resolusi atau pencahayaan ruangan redup, peserta dapat langsung menginputkan kode PIN rapat ini:
                </p>
                <div className="font-mono text-3xl font-extrabold tracking-widest text-center text-slate-900 bg-slate-50 py-4 rounded-2xl border border-slate-200">
                  {currentSession.pinCode}
                </div>
              </div>

              {/* Jadwal & Validasi Toleransi Waktu WITA */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  <span>Jadwal & Ketentuan Waktu (WITA)</span>
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Rentang Waktu Pertemuan:</span>
                    <span className="font-semibold text-slate-900">
                      {currentSession.timeStart} - {currentSession.timeEnd}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Batas Toleransi Tepat Waktu:</span>
                    <span className="font-bold text-emerald-600">
                      Hingga {currentSession.toleranceTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Status Setelah Toleransi:</span>
                    <span className="font-bold text-amber-600">Otomatis Terlambat (X menit)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Lokasi / Ruangan Rapat:</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      {currentSession.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Geofencing Pembuat Rapat (Dynamic Anchor) */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Radio size={18} className="text-teal-600 animate-pulse" />
                    <span>Geofencing Pembuat Rapat (Dynamic Anchor)</span>
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Radius {sessionCoords.radiusMeters} Meter
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Titik geofence presensi ini dikunci secara dinamis berdasarkan posisi GPS pembuat rapat saat sesi dibuat ({currentSession.createdBy?.name || 'Alif Fikri Haykal'} di {sessionCoords.locationName}).
                </p>
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl space-y-2 text-xs text-teal-900">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-800 font-semibold">Pembuat Agenda:</span>
                    <span className="font-bold text-slate-900">{currentSession.createdBy?.name || 'Alif Fikri Haykal'} (NIM: {currentSession.createdBy?.nim || '23404053'})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-800 font-semibold">Titik Pusat Rapat:</span>
                    <strong className="text-teal-950">{sessionCoords.locationName}</strong>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[11px] pt-1.5 border-t border-teal-200/70">
                    <span className="text-teal-700">Koordinat GPS Pembuat:</span>
                    <span className="font-bold">{sessionCoords.lat}, {sessionCoords.lng}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          TAB 2: LIVE LOG KEHADIRAN (DIPISAHKAN PER AGENDA RAPAT)
          ========================================================================= */}
      {activeTab === 'log' && (
        <div className="space-y-6">
          {/* Top Controls: Search, Status Filter & Agenda Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama pengurus, NIM, atau divisi lintas agenda..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
                  <Filter size={13} />
                  <span>Status:</span>
                </span>
                {['Semua', 'Tepat Waktu', 'Terlambat', 'Izin/Sakit'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Pemisah Agenda / Pill Selector */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1 mr-1">
                <span>Pilih Tampilan:</span>
              </span>
              <button
                type="button"
                onClick={() => setLogAgendaFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  logAgendaFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🌟 Tampilkan Semua Agenda ({sessions.length} Agenda)
              </button>
              {sessions.map((sess) => {
                const count = allRecords.filter((r) => r.sessionId === sess.id).length;
                return (
                  <button
                    key={sess.id}
                    type="button"
                    onClick={() => setLogAgendaFilter(sess.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      logAgendaFilter === sess.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sess.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                    <span>{sess.title.length > 26 ? `${sess.title.slice(0, 26)}...` : sess.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      logAgendaFilter === sess.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Separated Agenda Cards */}
          <div className="space-y-6">
            {groupedSessionsWithRecords.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 shadow-xs">
                <Users size={36} className="mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-700">
                  {sessions.length === 0 ? 'Belum Ada Acara Rapat Terjadwal' : 'Tidak ada agenda rapat yang cocok'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {sessions.length === 0
                    ? 'Data acara rapat telah dibersihkan. Buat sesi rapat baru untuk mulai mencatat presensi.'
                    : 'Coba sesuaikan kata kunci pencarian atau filter status.'}
                </p>
              </div>
            ) : (
              groupedSessionsWithRecords.map(({ session: sess, records, stats: sessStats }) => {
                const isCollapsed = Boolean(collapsedSessionIds[sess.id]);

                return (
                  <div
                    key={sess.id}
                    className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs transition-all duration-200"
                  >
                    {/* Header Sesi Agenda Rapat */}
                    <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200/80">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider flex items-center gap-1.5 ${
                                sess.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  sess.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                                }`}
                              />
                              {sess.status === 'active' ? 'Sesi Berjalan (Aktif)' : 'Agenda Selesai & Diarsipkan'}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                              {sess.division}
                            </span>
                            <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                              {sess.id}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {sess.title}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                            <span className="flex items-center gap-1">
                              <span>📅</span>
                              <span>{sess.date}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono text-slate-700 font-medium">
                              <Clock size={12} className="text-blue-500" />
                              <span>{sess.timeStart} - {sess.timeEnd} (WITA)</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-red-500" />
                              <strong className="text-slate-800">{sess.location}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 flex-wrap">
                            <span className="text-slate-400">Dibuat oleh:</span>
                            <strong className="text-slate-900 font-semibold">{sess.createdBy?.name || sess.organizer || 'Pengurus'}</strong>
                            <span className="font-mono text-purple-700 bg-purple-100/60 px-1.5 py-0.2 rounded text-[11px] font-bold">
                              NIM: {sess.createdBy?.nim || '23404053'}
                            </span>
                            {sess.coordinates?.locationName && (
                              <span className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.2 rounded-md font-medium">
                                📍 Pusat: {sess.coordinates.locationName} (Radius {sess.coordinates.radiusMeters || 100}m)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Quick Stats & Toggle Button */}
                        <div className="flex items-center gap-3 justify-between lg:justify-end flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-xl font-bold text-slate-800 shadow-2xs">
                              Total: {sessStats.total}
                            </span>
                            <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold text-emerald-700">
                              ✓ {sessStats.tepat} Tepat
                            </span>
                            <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl font-bold text-amber-700">
                              ⏳ {sessStats.lambat} Telat
                            </span>
                            <span className="bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-xl font-bold text-purple-700">
                              📝 {sessStats.izin} Izin
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleShareWhatsApp(sess)}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                              title="Bagikan undangan rapat ke WhatsApp"
                            >
                              <Share2 size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleCompleteSession(sess)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer text-xs font-bold border flex items-center gap-1 ${
                                sess.status === 'active'
                                  ? isCoordinator
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : isCoordinator
                                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              }`}
                              title={
                                isCoordinator
                                  ? sess.status === 'active'
                                    ? 'Selesaikan & Arsipkan Rapat'
                                    : 'Buka Kembali Sesi'
                                  : 'Akses Ditolak: Hanya Koordinator Divisi yang berhak menyelesaikan rapat'
                              }
                            >
                              {sess.status === 'active' ? (
                                isCoordinator ? <CheckCircle2 size={13} className="text-rose-600" /> : <Lock size={13} className="text-slate-400" />
                              ) : (
                                isCoordinator ? <RotateCcw size={13} className="text-blue-600" /> : <Lock size={13} className="text-slate-400" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditSessionModal(sess)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer text-xs font-bold border flex items-center gap-1 ${
                                isCoordinator
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              }`}
                              title={
                                isCoordinator
                                  ? 'Edit Agenda Rapat'
                                  : 'Akses Ditolak: Hanya Koordinator Divisi yang berhak mengedit agenda rapat'
                              }
                            >
                              <Pencil size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSession(sess.id)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer text-xs font-bold border flex items-center gap-1 ${
                                isCoordinator
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              }`}
                              title={
                                isCoordinator
                                  ? 'Hapus Agenda Rapat'
                                  : 'Akses Ditolak: Hanya Koordinator Divisi yang berhak menghapus agenda rapat'
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSessionCollapse(sess.id)}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                            title={isCollapsed ? 'Buka Tabel Presensi' : 'Tutup Tabel Presensi'}
                          >
                            <span>{isCollapsed ? 'Buka' : 'Tutup'}</span>
                            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Table Kehadiran Sesi Agenda Ini */}
                    {!isCollapsed && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-white text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-100">
                            <tr>
                              <th className="py-3.5 px-6">Nama Pengurus</th>
                              <th className="py-3.5 px-6">Divisi & Peran</th>
                              <th className="py-3.5 px-6">Waktu Presensi (WITA)</th>
                              <th className="py-3.5 px-6">Metode & Jarak GPS</th>
                              <th className="py-3.5 px-6">Status Kehadiran</th>
                              <th className="py-3.5 px-6">Catatan</th>
                              {isCoordinator && <th className="py-3.5 px-6 text-right">Aksi</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {records.length === 0 ? (
                              <tr>
                                <td colSpan={isCoordinator ? 7 : 6} className="py-8 text-center text-slate-400">
                                  <p className="font-semibold text-slate-600">Belum ada data presensi yang sesuai untuk agenda ini</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">Peserta belum mencatatkan kehadiran atau tidak cocok dengan filter pencarian.</p>
                                </td>
                              </tr>
                            ) : (
                              records.map((item) => {
                                const isTepat = item.status && item.status.includes('Tepat');
                                const isTerlambat = item.status && item.status.includes('Terlambat');

                                return (
                                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-6">
                                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                                      <span className="text-[10px] text-slate-400 font-mono">NIM: {item.nim || '-'}</span>
                                    </td>
                                    <td className="py-3.5 px-6 text-slate-600">
                                      <p className="font-semibold text-slate-800">{item.division}</p>
                                      <span className="text-[10px] text-slate-400">{item.role}</span>
                                    </td>
                                    <td className="py-3.5 px-6 font-mono text-slate-800 font-medium">
                                      {item.time}
                                    </td>
                                    <td className="py-3.5 px-6">
                                      <span className="text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1">
                                        {item.method === 'QR Scan (HP)' && <Smartphone size={12} className="text-purple-600" />}
                                        <span>{item.method || 'Manual'}</span>
                                      </span>
                                      {item.distanceInfo && (
                                        <span className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200/70 px-1.5 py-0.5 rounded font-mono block w-fit mt-1">
                                          📍 {item.distanceInfo}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-6">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                          isTepat
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : isTerlambat
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-purple-50 text-purple-700 border-purple-200'
                                        }`}
                                      >
                                        <CheckCircle2 size={12} />
                                        {item.status}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-6 text-slate-500 max-w-xs truncate">
                                      {item.note || '-'}
                                    </td>
                                    {isCoordinator && (
                                      <td className="py-3.5 px-6 text-right">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSingleRecord(item.id, item.name)}
                                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                          title={`Hapus catatan presensi ${item.name}`}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                          <span>Menampilkan <strong>{records.length}</strong> pengurus untuk agenda "{sess.title}"</span>
                          <span className="font-mono text-slate-400">Toleransi: {sess.toleranceTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NOTULA DIGITAL & ACTION ITEMS PIC (NEW FEATURE)
          ========================================================================= */}
      {activeTab === 'notula' && (
        !currentSession ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-200">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Notula</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Notula dan action items akan otomatis tersedia setelah Anda membuat agenda rapat baru.
            </p>
            {isCoordinator ? (
              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
              >
                <Plus size={16} />
                <span>Buat Sesi Rapat Baru</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-200">
                <Lock size={14} className="text-slate-400" />
                <span>Pembuatan agenda rapat dibatasi khusus Koordinator Divisi & BPH</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Ringkasan Notula Rapat */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Notula Resmi Pertemuan
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {currentSession.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                  <span>{currentSession.date} • Dipimpin oleh {currentSession.organizer}</span>
                  <span>•</span>
                  <span>Dibuat oleh: <strong className="text-slate-800">{currentSession.createdBy?.name || currentSession.organizer || 'Pengurus'}</strong> (NIM: {currentSession.createdBy?.nim || '23404053'})</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">
                  {currentSession.notula?.actionItems?.length || 0} Tindak Lanjut
                </span>
              </div>
            </div>

            {/* Summary Text */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ringkasan Jalannya Rapat:
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {currentSession.notula?.summary || 'Belum ada ringkasan yang ditulis untuk sesi ini.'}
              </p>
            </div>

            {/* Key Decisions */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Poin Keputusan Resmi:
              </h4>
              <div className="space-y-2">
                {(currentSession?.notula?.keyDecisions || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada poin keputusan dicatat.</p>
                ) : (
                  (currentSession.notula?.keyDecisions || []).map((dec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-medium leading-relaxed">{dec}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Decision Form */}
              <form onSubmit={handleAddDecision} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newDecisionInput}
                  onChange={(e) => setNewDecisionInput(e.target.value)}
                  placeholder="Tambahkan poin kesepakatan rapat..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tambah Poin
                </button>
              </form>
            </div>
          </div>

          {/* Action Items PIC Table */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pembagian Tindak Lanjut & PIC (Action Items)
                </h3>
                <p className="text-xs text-slate-500">
                  Delegasi tugas terstruktur hasil rapat dengan PIC penanggung jawab dan deadline jelas.
                </p>
              </div>
              <button
                onClick={() => setIsAddActionItemOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Tambah Action Item</span>
              </button>
            </div>

            {/* List Action Items */}
            <div className="space-y-3">
              {(currentSession?.notula?.actionItems || []).length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs">Belum ada action item yang ditugaskan pada sesi ini.</p>
                </div>
              ) : (
                (currentSession.notula?.actionItems || []).map((act) => {
                  const isDone = act.status === 'done';
                  const isInProgress = act.status === 'in_progress';

                  return (
                    <div
                      key={act.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                          : isInProgress
                          ? 'bg-blue-50/40 border-blue-200/80 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleActionItemStatus(act.id)}
                          className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {isDone ? (
                            <CheckSquare size={18} className="text-emerald-600" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                        <div>
                          <p className={`font-semibold text-xs sm:text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {act.task}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
                            <span className="font-medium text-slate-700">PIC: {act.pic}</span>
                            <span>•</span>
                            <span>Tenggat: {act.deadline}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleActionItemStatus(act.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {isDone ? 'Selesai' : isInProgress ? 'Dalam Proses' : 'Menunggu'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        )
      )}

      {/* =========================================================================
          TAB 4: REKAP DIVISI & EKSPOR (.XLSX)
          ========================================================================= */}
      {activeTab === 'rekap' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rekapitulasi Partisipasi Seluruh Divisi
                </h3>
                <p className="text-xs text-slate-500">
                  Akumulasi kehadiran rapat pleno dan koordinasi proker keorganisasian semester berjalan.
                </p>
              </div>
              <button
                onClick={handleExportXlsx}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Download size={15} />
                <span>Unduh Rekap Spreadsheet (XLSX)</span>
              </button>
            </div>

            {/* List Division Participation */}
            <div className="space-y-4 mt-6">
              {divisionParticipationRecap.map((row, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{row.div}</p>
                      <p className="text-[11px] text-slate-500">
                        {row.hadir} Hadir ({row.tepat} Tepat, {row.lambat} Terlambat) {row.izin > 0 ? `• ${row.izin} Izin/Sakit ` : ''}dari {row.total} Tercatat
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-mono text-base font-extrabold text-emerald-600">
                        {row.percent}%
                      </span>
                      <p className="text-[10px] text-slate-400">Tingkat Kehadiran</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CHECK-IN PRESENSI DUAL MODE (PIN & QR SCANNER)
          ========================================================================= */}
      {isCheckinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setIsCheckinModalOpen(false);
                setCheckinError('');
              }}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Presensi Mandiri
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Check-In {currentSession?.title || 'Rapat'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Toleransi: {currentSession?.toleranceTime || '-'} • Zona WITA
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setCheckinMethodTab('pin');
                  setCheckinError('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  checkinMethodTab === 'pin'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Input PIN 6-Digit
              </button>
              <button
                type="button"
                onClick={() => {
                  setCheckinMethodTab('qr');
                  setCheckinError('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  checkinMethodTab === 'qr'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Scan QR Kamera
              </button>
            </div>

            {checkinError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{checkinError}</span>
              </div>
            )}

            {/* Account Info Badge */}
            <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Pengurus Login:</span>
                <span className="font-bold text-slate-900">{authUser?.name || 'Alif Fikri Haykal'}</span>
              </div>
              <span className="font-mono text-slate-500">NIM: {authUser?.nim || '23404053'}</span>
            </div>

            {/* Mode 1: Input PIN Form */}
            {checkinMethodTab === 'pin' && (
              <form onSubmit={handleVerifyPin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Masukkan 6 Digit PIN Rapat:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 782910"
                    className="w-full text-center font-mono text-2xl font-extrabold tracking-widest px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                    PIN tertera di layar proyektor atau papan rapat BPH.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Verifikasi & Presensi Sekarang</span>
                </button>
              </form>
            )}

            {/* Mode 2: Camera QR Scan Simulation */}
            {checkinMethodTab === 'qr' && (
              <div className="space-y-4 text-center">
                <div className="w-full aspect-square max-w-[240px] mx-auto bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800">
                  <Camera size={36} className="text-slate-600 mb-2" />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isCameraScanning ? 'Memindai QR Code...' : 'Kamera Siap Memindai'}
                  </span>

                  {/* Scanning beam */}
                  {isCameraScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10B981] animate-bounce" />
                  )}

                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                </div>

                <p className="text-xs text-slate-500">
                  Arahkan kamera ke layar proyektor yang menampilkan kode token QR sesi rapat.
                </p>

                <button
                  type="button"
                  disabled={isCameraScanning}
                  onClick={handleStartQrScan}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>{isCameraScanning ? 'Membaca Token QR...' : 'Deteksi & Validasi Kode QR'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AJUKAN IZIN / SAKIT
          ========================================================================= */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Dispensasi Pertemuan
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Form Keterangan Izin / Sakit
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sesi: {currentSession?.title || 'Rapat'} ({currentSession?.date || '-'})
              </p>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis Pengajuan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Izin', 'Sakit'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLeaveForm({ ...leaveForm, type: t })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        leaveForm.type === t
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t} {t === 'Izin' ? '(Keperluan / Akademik)' : '(Kondisi Medis)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan / Keterangan Lengkap:
                </label>
                <textarea
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Contoh: Praktikum laboratorium jaringan komputer atau kondisi demam..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Dokumen / Bukti Pendukung (Opsional):
                </label>
                <input
                  type="text"
                  value={leaveForm.attachmentName}
                  onChange={(e) => setLeaveForm({ ...leaveForm, attachmentName: e.target.value })}
                  placeholder="Contoh: Surat_Izin_Dosen_Pengampu.pdf"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 size={16} />
                <span>Kirim Permohonan Izin / Sakit</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BUAT SESI RAPAT BARU
          ========================================================================= */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewSessionModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Otoritas: Koordinator Divisi & BPH
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Buat Sesi Rapat & Presensi Baru
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sistem otomatis meng-generate Token QR dan PIN 6-digit untuk rapat baru ini.
              </p>
            </div>

            {/* Creator Information Badge */}
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200/80 rounded-xl text-xs text-purple-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-purple-600 font-bold block uppercase tracking-wider">Pembuat Agenda (Koordinator / BPH):</span>
                <span className="font-bold text-slate-900">{authUser?.name || 'Alif Fikri Haykal'}</span>
                <span className="text-[10px] text-purple-700 block font-medium">({authUser?.role || 'Koordinator Divisi'})</span>
              </div>
              <span className="font-mono text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200 text-[11px] font-bold">
                NIM: {authUser?.nim || '23404053'}
              </span>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Rapat / Agenda Pertemuan:
                </label>
                <input
                  required
                  type="text"
                  value={newSessionForm.title}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, title: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi Panitia Dies Natalis 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Divisi Penyelenggara:
                  </label>
                  <select
                    value={newSessionForm.division}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, division: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {OFFICIAL_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pelaksanaan:
                  </label>
                  <input
                    type="text"
                    value={newSessionForm.date}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, date: e.target.value })}
                    placeholder="Contoh: 08 November 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jam Mulai (WITA):
                  </label>
                  <input
                    type="text"
                    value={newSessionForm.timeStart}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, timeStart: e.target.value })}
                    placeholder="14:00 WITA"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jam Selesai (WITA):
                  </label>
                  <input
                    type="text"
                    value={newSessionForm.timeEnd}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, timeEnd: e.target.value })}
                    placeholder="16:30 WITA"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Batas Toleransi:
                  </label>
                  <input
                    type="text"
                    value={newSessionForm.toleranceTime}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, toleranceTime: e.target.value })}
                    placeholder="14:15 WITA"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi / Ruangan Rapat:
                </label>
                <input
                  type="text"
                  value={newSessionForm.location}
                  onChange={(e) =>
                    setNewSessionForm({
                      ...newSessionForm,
                      location: e.target.value,
                      locationName: e.target.value,
                    })
                  }
                  placeholder="Contoh: Lapangan Pancasila Palopo (Gazebo Teramedia)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Anchor Geofence GPS Pembuat Rapat */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Radio size={14} className="text-purple-600" />
                    <span>Titik Geofence Pembuat Rapat (Anchor GPS)</span>
                  </span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold border border-purple-200">
                    Anchor: {authUser?.name || 'Alif Fikri Haykal'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Pilihan Preset Lokasi:
                    </label>
                    <select
                      value={newSessionForm.locationPreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      {PALOPO_LOCATION_PRESETS.map((pr) => (
                        <option key={pr.id} value={pr.id}>
                          {pr.name}
                        </option>
                      ))}
                      <option value="custom">Koordinat Custom / GPS Saya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Radius Izin Kehadiran:
                    </label>
                    <select
                      value={newSessionForm.radiusMeters}
                      onChange={(e) =>
                        setNewSessionForm({
                          ...newSessionForm,
                          radiusMeters: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-bold"
                    >
                      <option value={50}>50 Meter (Ruang Rapat / Sekre)</option>
                      <option value={100}>100 Meter (Area Lapangan Pancasila)</option>
                      <option value={200}>200 Meter (Area Kampus Dewantara)</option>
                      <option value={500}>500 Meter (Lingkar Luar Kampus)</option>
                      <option value={0}>0 Meter (Tanpa Batas Radius / Online)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDetectCreatorGps}
                    disabled={newSessionForm.isDetectingGps}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Compass size={13} className={newSessionForm.isDetectingGps ? 'animate-spin' : ''} />
                    <span>{newSessionForm.isDetectingGps ? 'Mendeteksi...' : 'Deteksi GPS Saya Sekarang'}</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    Lat: {newSessionForm.lat}, Lng: {newSessionForm.lng}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Agenda Pembahasan:
                </label>
                <textarea
                  rows={2}
                  value={newSessionForm.agenda}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, agenda: e.target.value })}
                  placeholder="Poin-poin garis besar yang akan dibahas..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-3"
              >
                <Plus size={16} />
                <span>Terbitkan & Buka Sesi Rapat</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT DATA AGENDA RAPAT (KHUSUS KOORDINATOR DIVISI)
          ========================================================================= */}
      {isEditSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditSessionModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Akses Koordinator Divisi
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Edit Agenda Rapat & Sesi Presensi
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Perbarui detail jadwal, ruangan, atau radius geofence kehadiran pengurus.
              </p>
            </div>

            <form onSubmit={handleSaveEditSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Rapat / Agenda Pertemuan:
                </label>
                <input
                  required
                  type="text"
                  value={editSessionForm.title}
                  onChange={(e) => setEditSessionForm({ ...editSessionForm, title: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi Panitia Dies Natalis 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Divisi Penanggung Jawab:
                  </label>
                  <select
                    value={editSessionForm.division}
                    onChange={(e) => setEditSessionForm({ ...editSessionForm, division: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {OFFICIAL_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pelaksanaan:
                  </label>
                  <input
                    type="text"
                    value={editSessionForm.date}
                    onChange={(e) => setEditSessionForm({ ...editSessionForm, date: e.target.value })}
                    placeholder="Contoh: 08 November 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jam Mulai (WITA):
                  </label>
                  <input
                    type="text"
                    value={editSessionForm.timeStart}
                    onChange={(e) => setEditSessionForm({ ...editSessionForm, timeStart: e.target.value })}
                    placeholder="14:00 WITA"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jam Selesai (WITA):
                  </label>
                  <input
                    type="text"
                    value={editSessionForm.timeEnd}
                    onChange={(e) => setEditSessionForm({ ...editSessionForm, timeEnd: e.target.value })}
                    placeholder="16:30 WITA"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Batas Toleransi:
                  </label>
                  <input
                    type="text"
                    value={editSessionForm.toleranceTime}
                    onChange={(e) => setEditSessionForm({ ...editSessionForm, toleranceTime: e.target.value })}
                    placeholder="14:15 WITA"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi / Ruangan Rapat:
                </label>
                <input
                  type="text"
                  value={editSessionForm.location}
                  onChange={(e) =>
                    setEditSessionForm({
                      ...editSessionForm,
                      location: e.target.value,
                      locationName: e.target.value,
                    })
                  }
                  placeholder="Contoh: Lapangan Pancasila Palopo (Area Gazebo Teramedia)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Anchor Geofence GPS Pembuat Rapat */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Radio size={14} className="text-purple-600" />
                    <span>Titik Geofence Pembuat Rapat (Anchor GPS)</span>
                  </span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold border border-purple-200">
                    ID Sesi: {editSessionForm.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Pilihan Preset Lokasi:
                    </label>
                    <select
                      value={editSessionForm.locationPreset}
                      onChange={(e) => handleEditPresetChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      {PALOPO_LOCATION_PRESETS.map((pr) => (
                        <option key={pr.id} value={pr.id}>
                          {pr.name}
                        </option>
                      ))}
                      <option value="custom">Koordinat Custom / GPS Saya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Radius Izin Kehadiran:
                    </label>
                    <select
                      value={editSessionForm.radiusMeters}
                      onChange={(e) =>
                        setEditSessionForm({
                          ...editSessionForm,
                          radiusMeters: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-bold"
                    >
                      <option value={50}>50 Meter (Ruang Rapat / Sekre)</option>
                      <option value={100}>100 Meter (Area Lapangan Pancasila)</option>
                      <option value={200}>200 Meter (Area Kampus Dewantara)</option>
                      <option value={500}>500 Meter (Lingkar Luar Kampus)</option>
                      <option value={0}>0 Meter (Tanpa Batas Radius / Online)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDetectEditGps}
                    disabled={editSessionForm.isDetectingGps}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Compass size={13} className={editSessionForm.isDetectingGps ? 'animate-spin' : ''} />
                    <span>{editSessionForm.isDetectingGps ? 'Mendeteksi...' : 'Deteksi GPS Saya Sekarang'}</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    Lat: {editSessionForm.lat}, Lng: {editSessionForm.lng}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Agenda Pembahasan:
                </label>
                <textarea
                  rows={2}
                  value={editSessionForm.agenda}
                  onChange={(e) => setEditSessionForm({ ...editSessionForm, agenda: e.target.value })}
                  placeholder="Poin-poin garis besar yang akan dibahas..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteSession(editSessionForm.id)}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Hapus Agenda</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditSessionModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH ACTION ITEM NOTULA BARU
          ========================================================================= */}
      {isAddActionItemOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddActionItemOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Tindak Lanjut Rapat
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Tambah Action Item Baru
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tugaskan tindak lanjut ke person in charge (PIC) dengan deadline terukur.
              </p>
            </div>

            <form onSubmit={handleAddActionItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Tugas:
                </label>
                <input
                  required
                  type="text"
                  value={newActionItem.task}
                  onChange={(e) => setNewActionItem({ ...newActionItem, task: e.target.value })}
                  placeholder="Contoh: Pengajuan peminjaman proyektor ke BPH"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penanggung Jawab (PIC):
                </label>
                <input
                  required
                  type="text"
                  value={newActionItem.pic}
                  onChange={(e) => setNewActionItem({ ...newActionItem, pic: e.target.value })}
                  placeholder="Contoh: Rian Pratama (Logistik)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tenggat Waktu Selesai (WITA):
                </label>
                <input
                  type="text"
                  value={newActionItem.deadline}
                  onChange={(e) => setNewActionItem({ ...newActionItem, deadline: e.target.value })}
                  placeholder="Contoh: 11 Nov 2026, 17:00 WITA"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <Plus size={16} />
                <span>Simpan Tindak Lanjut</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </ServicePageLayout>
  );
};

export default AttendanceServicePage;

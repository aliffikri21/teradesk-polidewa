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
  Filter,
  Radio,
  Copy,
  Check,
  Smartphone,
  Compass
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ServicePageLayout from './ServicePageLayout';
import {
  defaultAttendanceSessions,
  defaultAttendanceList,
} from '../../data/defaultModulesData';
import { playNotificationChime } from '../../utils/notificationSound';
import { PALOPO_LOCATION_PRESETS } from '../../utils/geoDistance';

const AttendanceServicePage = (props) => {
  const {
    attendanceList: propAttendance,
    onAddAttendanceRecord,
    attendanceSessions: propSessions,
    onAddAttendanceSession,
    onUpdateAttendanceSession,
    authUser,
    onOpenPublicAttendanceModal,
  } = props;

  // State Sessions
  const [localSessions, setLocalSessions] = useState(defaultAttendanceSessions);
  const sessions = propSessions || localSessions;

  // Selected Session
  const [selectedSessionId, setSelectedSessionId] = useState(
    () => sessions.find((s) => s.status === 'active')?.id || sessions[0]?.id || 'SES-2026-001'
  );

  const currentSession = useMemo(() => {
    return (
      sessions.find((s) => s.id === selectedSessionId) ||
      sessions[0] || {
        id: 'SES-DEFAULT',
        title: 'Sesi Presensi Rapat',
        division: 'BPH & Presidium',
        date: '08 November 2026',
        timeStart: '13:30 WITA',
        timeEnd: '16:00 WITA',
        toleranceTime: '14:15 WITA',
        location: 'Ruang Rapat Bersama',
        status: 'active',
        qrToken: 'TERA-QR-98214',
        pinCode: '782910',
        organizer: 'BPH',
        agenda: 'Koordinasi teknis kegiatan organisasi',
        notula: { summary: '', keyDecisions: [], actionItems: [] },
      }
    );
  }, [sessions, selectedSessionId]);

  // State Records
  const [localAttendance, setLocalAttendance] = useState(defaultAttendanceList);
  const allRecords = propAttendance || localAttendance;

  // Filter records by selected session
  const sessionRecords = useMemo(() => {
    return allRecords.filter((rec) => !rec.sessionId || rec.sessionId === currentSession.id);
  }, [allRecords, currentSession.id]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'log' | 'notula' | 'rekap'

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

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
    division: 'BPH & Presidium',
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
    const user = authUser || {
      name: 'Alif Fikri Haykal',
      nim: '23404053',
      division: 'BPH & Kesekretariatan',
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
      id: `ATT-${Date.now().toString().slice(-4)}`,
      sessionId: currentSession.id,
      name: user.name,
      nim: user.nim || '23404053',
      division: user.division || 'BPH & Kesekretariatan',
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
    if (!leaveForm.reason.trim()) {
      alert('Mohon isi alasan / keterangan pengajuan.');
      return;
    }

    const user = authUser || {
      name: 'Alif Fikri Haykal',
      nim: '23404053',
      division: 'BPH & Kesekretariatan',
      role: 'Pengurus',
    };

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      sessionId: currentSession.id,
      name: user.name,
      nim: user.nim || '23404053',
      division: user.division || 'BPH & Kesekretariatan',
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
    if (!newSessionForm.title.trim()) {
      alert('Judul rapat / agenda wajib diisi.');
      return;
    }

    const randomToken = `TERA-QR-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomPin = `${Math.floor(100000 + Math.random() * 900000)}`;

    const newSession = {
      id: `SES-2026-00${sessions.length + 1}`,
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
    if (!currentSession.notula?.actionItems) return;
    const updatedItems = currentSession.notula.actionItems.map((item) => {
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
        ...currentSession.notula,
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
    if (!newDecisionInput.trim()) return;
    const existingDecisions = currentSession.notula?.keyDecisions || [];
    const updatedSession = {
      ...currentSession,
      notula: {
        ...currentSession.notula,
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
        ...currentSession.notula,
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
    const divisionRecapData = [
      { div: 'BPH / Presidium & Kesekretariatan', total: 6, hadir: 6, tepat: 5, lambat: 1, izin: 0, percent: 100 },
      { div: 'Divisi Kaderisasi & SDM', total: 18, hadir: 17, tepat: 16, lambat: 1, izin: 1, percent: 94 },
      { div: 'Divisi Publikasi & Dokumentasi', total: 14, hadir: 13, tepat: 13, lambat: 0, izin: 1, percent: 93 },
      { div: 'Divisi Dana Usaha (KKM)', total: 12, hadir: 11, tepat: 10, lambat: 1, izin: 1, percent: 92 },
      { div: 'Divisi Minat & Bakat', total: 16, hadir: 14, tepat: 13, lambat: 1, izin: 2, percent: 88 },
      { div: 'Divisi Humas & Jaringan Eksternal', total: 15, hadir: 14, tepat: 14, lambat: 0, izin: 1, percent: 93 },
    ];
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
    const rowsNotula = (currentSession.notula?.actionItems || []).map((act, idx) => ({
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

    const cleanTitle = currentSession.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const fileName = `Rekap_Presensi_TERADESK_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setCheckinSuccess(`Spreadsheet (${fileName}) berhasil diunduh!`);
    setTimeout(() => setCheckinSuccess(''), 4500);
  };

  // Filtered List for Table (Diurutkan dari yang terbaru di paling atas)
  const filteredList = useMemo(() => {
    const matched = sessionRecords.filter((item) => {
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

    return [...matched].sort((a, b) => {
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
  }, [sessionRecords, searchQuery, statusFilter]);

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
                className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-9 py-2.5 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.date} • {s.status === 'active' ? '🟢 Aktif' : '⚪ Selesai'})
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
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
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Buat Sesi Baru</span>
            </button>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <AlertCircle size={15} />
              <span>Ajukan Izin / Sakit</span>
            </button>
            <button
              onClick={() => {
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
          <span>Live Log Kehadiran ({sessionRecords.length})</span>
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
          <span>Notula & Action Items ({currentSession.notula?.actionItems?.length || 0})</span>
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
          TAB 2: LIVE LOG KEHADIRAN
          ========================================================================= */}
      {activeTab === 'log' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama anggota, NIM, atau divisi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Status Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Filter size={13} />
                <span>Status:</span>
              </span>
              {['Semua', 'Tepat Waktu', 'Terlambat', 'Izin/Sakit'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">Nama Pengurus</th>
                    <th className="py-4 px-6">Divisi & Peran</th>
                    <th className="py-4 px-6">Waktu Presensi (WITA)</th>
                    <th className="py-4 px-6">Metode</th>
                    <th className="py-4 px-6">Status Kehadiran</th>
                    <th className="py-4 px-6">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Users size={32} className="mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">Belum ada data presensi yang sesuai</p>
                        <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Check-In Presensi" untuk mencatat presensi baru.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => {
                      const isTepat = item.status.includes('Tepat');
                      const isTerlambat = item.status.includes('Terlambat');

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">NIM: {item.nim || '-'}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            <p className="font-semibold text-slate-800">{item.division}</p>
                            <span className="text-[10px] text-slate-400">{item.role}</span>
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-800 font-medium">
                            {item.time}
                          </td>
                          <td className="py-4 px-6">
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
                          <td className="py-4 px-6">
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
                          <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                            {item.note || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NOTULA DIGITAL & ACTION ITEMS PIC (NEW FEATURE)
          ========================================================================= */}
      {activeTab === 'notula' && (
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
                {(currentSession.notula?.keyDecisions || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada poin keputusan dicatat.</p>
                ) : (
                  currentSession.notula.keyDecisions.map((dec, idx) => (
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
              {(currentSession.notula?.actionItems || []).length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs">Belum ada action item yang ditugaskan pada sesi ini.</p>
                </div>
              ) : (
                currentSession.notula.actionItems.map((act) => {
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
              {[
                { div: 'BPH / Sekretariat & Bendahara', percent: 98, total: 6, hadir: 6, tepat: 5, lambat: 1, color: 'bg-indigo-500' },
                { div: 'Divisi Kaderisasi & SDM', percent: 96, total: 18, hadir: 17, tepat: 16, lambat: 1, color: 'bg-blue-500' },
                { div: 'Divisi Media & Informasi (Pubdok)', percent: 94, total: 14, hadir: 13, tepat: 13, lambat: 0, color: 'bg-rose-500' },
                { div: 'Divisi Dana Usaha (KKM)', percent: 92, total: 12, hadir: 11, tepat: 10, lambat: 1, color: 'bg-amber-500' },
                { div: 'Divisi Minat & Bakat', percent: 90, total: 16, hadir: 14, tepat: 13, lambat: 1, color: 'bg-purple-500' },
                { div: 'Divisi Humas & Jaringan', percent: 93, total: 15, hadir: 14, tepat: 14, lambat: 0, color: 'bg-sky-500' },
              ].map((row, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{row.div}</p>
                      <p className="text-[11px] text-slate-500">
                        {row.hadir} Hadir ({row.tepat} Tepat, {row.lambat} Terlambat) dari {row.total} Pengurus
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
                Check-In {currentSession.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Toleransi: {currentSession.toleranceTime} • Zona WITA
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
                Sesi: {currentSession.title} ({currentSession.date})
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Agenda Musyawarah
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
                <span className="text-[10px] text-purple-600 font-bold block uppercase tracking-wider">Pembuat Agenda:</span>
                <span className="font-bold text-slate-900">{authUser?.name || 'Alif Fikri Haykal'}</span>
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
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BPH & Presidium">BPH & Presidium</option>
                    <option value="Divisi Kaderisasi & SDM">Divisi Kaderisasi & SDM</option>
                    <option value="Divisi Publikasi & Dokumentasi">Divisi Publikasi & Dokumentasi</option>
                    <option value="Divisi Dana Usaha (KKM)">Divisi Dana Usaha (KKM)</option>
                    <option value="Divisi Minat & Bakat">Divisi Minat & Bakat</option>
                    <option value="Divisi Humas & Jaringan">Divisi Humas & Jaringan</option>
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

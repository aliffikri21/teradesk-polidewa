import React, { useState, useMemo, useCallback } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Radio,
  X,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { calculateDistanceInMeters, formatDistance } from '../../utils/geoDistance';
import { playNotificationChime } from '../../utils/notificationSound';
import { OFFICIAL_DIVISIONS } from '../../data/defaultAccounts';

/**
 * PublicAttendanceModal
 * Modal / Halaman Presensi Mandiri untuk anggota/tamu yang memindai QR Code via Smartphone.
 * Tidak membutuhkan akun atau login admin; cukup mengisi Nama & NIM.
 * Lokasi GPS perangkat dicocokkan langsung terhadap titik koordinat pembuat rapat (contoh: Alif di Lap. Pancasila Palopo).
 */
export default function PublicAttendanceModal({
  isOpen,
  onClose,
  session,
  allRecords = [],
  onAddAttendanceRecord,
  onOpenPortal,
}) {
  // Creator Anchor Coordinates
  const creatorCoords = useMemo(() => {
    return session?.coordinates || {
      lat: -2.9928,
      lng: 120.1983,
      locationName: 'Lapangan Pancasila Palopo',
      radiusMeters: 100,
    };
  }, [session]);

  const maxRadius = creatorCoords.radiusMeters || 100;
  const isGeofenceActive = maxRadius > 0;

  // Form State
  const [form, setForm] = useState({
    name: '',
    nim: '',
    division: OFFICIAL_DIVISIONS[0],
    statusType: 'Hadir', // 'Hadir' | 'Izin' | 'Sakit'
    note: '',
  });

  // GPS & Geofence State
  // simulationMode: 'real' | 'sim_inside' | 'sim_outside'
  const [simulationMode, setSimulationMode] = useState('sim_inside');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [userCoords, setUserCoords] = useState(() => ({
    // Default simulated slightly offset from creator (~14 meters away inside Lap. Pancasila)
    lat: creatorCoords.lat ? creatorCoords.lat + 0.00010 : -2.9927,
    lng: creatorCoords.lng ? creatorCoords.lng + 0.00008 : 120.19838,
  }));

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Request Real Device GPS
  const handleRequestRealGps = useCallback(() => {
    setGpsLoading(true);
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung Geolocation API.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setSimulationMode('real');
        setGpsLoading(false);
      },
      (err) => {
        let msg = 'Gagal mendeteksi lokasi GPS.';
        if (err.code === 1) msg = 'Akses lokasi ditolak. Harap izinkan GPS pada browser smartphone.';
        else if (err.code === 2) msg = 'Posisi GPS tidak tersedia.';
        else if (err.code === 3) msg = 'Waktu permintaan GPS habis.';
        setGpsError(msg);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  // Set Simulation Modes
  const handleSetSimulation = (mode) => {
    setSimulationMode(mode);
    setGpsError('');
    if (mode === 'sim_inside') {
      // 14 meters away from creator
      setUserCoords({
        lat: creatorCoords.lat ? creatorCoords.lat + 0.00010 : -2.9927,
        lng: creatorCoords.lng ? creatorCoords.lng + 0.00008 : 120.19838,
      });
    } else if (mode === 'sim_outside') {
      // 3.4 km away from Lapangan Pancasila Palopo (around Wara Selatan)
      setUserCoords({
        lat: -3.0235,
        lng: 120.1850,
      });
    } else if (mode === 'real') {
      handleRequestRealGps();
    }
  };

  // Calculate current distance in meters
  const distanceInMeters = useMemo(() => {
    if (!isGeofenceActive || !userCoords.lat || !creatorCoords.lat) return 0;
    return calculateDistanceInMeters(
      creatorCoords.lat,
      creatorCoords.lng,
      userCoords.lat,
      userCoords.lng
    );
  }, [creatorCoords, userCoords, isGeofenceActive]);

  const isWithinRadius = !isGeofenceActive || distanceInMeters <= maxRadius;

  // Calculate Late Tolerance
  const checkIsLate = (sess) => {
    if (!sess?.toleranceTime) return { isLate: false, diff: 0 };
    try {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;

      const tolMatch = sess.toleranceTime.match(/(\d{1,2}):(\d{2})/);
      if (tolMatch) {
        const tolHours = parseInt(tolMatch[1], 10);
        const tolMinutes = parseInt(tolMatch[2], 10);
        const tolTotalMin = tolHours * 60 + tolMinutes;
        if (currentTotalMin > tolTotalMin) {
          return { isLate: true, diff: currentTotalMin - tolTotalMin };
        }
      }
    } catch {
      // ignore
    }
    return { isLate: false, diff: 0 };
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!form.nim.trim()) {
      setFormError('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }
    if (form.nim.trim().length < 4) {
      setFormError('Format NIM tidak valid (minimal 4 karakter).');
      return;
    }

    // Geofence check
    if (isGeofenceActive && !isWithinRadius && form.statusType === 'Hadir') {
      setFormError(
        `Presensi ditolak. Anda berada ${formatDistance(distanceInMeters)} dari lokasi rapat (Maksimal ${maxRadius} meter dari pembuat rapat).`
      );
      return;
    }

    // Check if duplicate NIM for this session
    const existing = allRecords.find(
      (rec) =>
        rec.sessionId === session?.id &&
        (rec.nim === form.nim.trim() ||
          rec.name.toLowerCase() === form.name.trim().toLowerCase())
    );
    if (existing) {
      setFormError(
        `NIM ${form.nim.trim()} (${form.name.trim()}) sudah tercatat presensi sebelumnya dengan status: "${existing.status}".`
      );
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WITA`;

    const lateCheck = checkIsLate(session);
    let finalStatus = form.statusType;
    if (form.statusType === 'Hadir') {
      finalStatus = lateCheck.isLate ? `Terlambat (${lateCheck.diff}m)` : 'Tepat Waktu';
    }

    const creatorName = session?.createdBy?.name || 'Alif Fikri Haykal';
    const locName = creatorCoords.locationName || 'Lapangan Pancasila Palopo';

    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      sessionId: session?.id || 'SES-2026-001',
      name: form.name.trim(),
      nim: form.nim.trim(),
      division: form.division || 'Anggota Umum',
      role: 'Anggota / Pengurus',
      time: timeStr,
      status: finalStatus,
      method: 'QR Scan (HP)',
      distanceInfo: isGeofenceActive
        ? `${distanceInMeters}m dari ${creatorName} (${locName})`
        : 'Rapat Online / Bebas',
      verifiedLocation: isWithinRadius,
      note:
        form.note.trim() ||
        (form.statusType === 'Hadir'
          ? `Presensi mandiri scan QR (${distanceInMeters}m dari pembuat rapat)`
          : `Pengajuan ${form.statusType} via scan QR Code`),
    };

    if (onAddAttendanceRecord) {
      onAddAttendanceRecord(newRecord);
    }

    playNotificationChime();
    setIsSubmitting(false);
    setSubmissionSuccess(newRecord);
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
              Presensi Mandiri Smartphone
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
            {session.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg font-medium">
              {session.division}
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <Clock size={12} className="text-amber-400" />
              <span>{session.timeStart} - {session.timeEnd} (WITA)</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {submissionSuccess ? (
            /* =========================================================================
               SUCCESS CONFIRMATION SCREEN
               ========================================================================= */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Check-In Terverifikasi
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Presensi Berhasil Dicatat!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kehadiran Anda telah masuk ke sistem live log TeraDesk.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nama Anggota:</span>
                  <span className="font-bold text-slate-900">{submissionSuccess.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">NIM:</span>
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {submissionSuccess.nim}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Status Kehadiran:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {submissionSuccess.status}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Waktu Tercatat:</span>
                  <span className="font-semibold text-slate-800">{submissionSuccess.time}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Verifikasi Jarak:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {submissionSuccess.distanceInfo}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Selesai & Tutup
                </button>
                {onOpenPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPortal();
                    }}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Buka Portal TeraDesk</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* =========================================================================
               CHECK-IN FORM + GEOFENCE ENGINE
               ========================================================================= */
            <>
              {/* Creator & Geofence Anchor Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Pembuat Agenda Rapat
                    </span>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold text-sm">
                        {session.createdBy?.name || 'Alif Fikri Haykal'}
                      </strong>
                      <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                        NIM: {session.createdBy?.nim || '23404053'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    {session.createdBy?.role || 'Demisioner Ketum'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-red-500 shrink-0" />
                    <span>Titik Lokasi Pembuat: <strong>{creatorCoords.locationName}</strong></span>
                  </div>
                  <span className="font-semibold text-slate-800 shrink-0">
                    Radius: {maxRadius}m
                  </span>
                </div>
              </div>

              {/* Real Geofence Status Box */}
              {isGeofenceActive && (
                <div className="rounded-2xl border p-4 space-y-3 transition-all duration-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio size={16} className={isWithinRadius ? 'text-emerald-600 animate-pulse' : 'text-rose-600'} />
                      <h4 className="text-xs font-bold text-slate-900">
                        Status Radius GPS Smartphone
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isWithinRadius
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {isWithinRadius ? '✓ Dalam Radius' : '✕ Di Luar Radius'}
                    </span>
                  </div>

                  {/* Distance Meter Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Jarak ke Pembuat ({session.createdBy?.name || 'Alif'}):</span>
                      <strong className={`font-mono text-sm ${isWithinRadius ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {formatDistance(distanceInMeters)}
                      </strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isWithinRadius ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(8, (distanceInMeters / (maxRadius * 2)) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>0 meter (Titik Alif)</span>
                      <span>Maksimal {maxRadius} meter</span>
                    </div>
                  </div>

                  {/* Geofence Alert Result */}
                  {isWithinRadius ? (
                    <div className="flex items-start gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Lokasi Valid:</strong> Anda terdeteksi berada di lokasi rapat bersama {session.createdBy?.name || 'Alif Fikri Haykal'} di {creatorCoords.locationName}. Tombol presensi dibuka.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                      <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Di Luar Radius:</strong> Anda berada {formatDistance(distanceInMeters)} dari lokasi pembuat rapat. Presensi fisik ditolak karena melebihi radius batas {maxRadius} meter.
                      </p>
                    </div>
                  )}

                  {/* GPS Mode & Simulation Toggle Switcher */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Mode Lokasi (Pengujian):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleSetSimulation('sim_inside')}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          simulationMode === 'sim_inside'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ✓ Simulasi Di Lokasi (14m)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetSimulation('sim_outside')}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          simulationMode === 'sim_outside'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ✕ Simulasi Jauh (3.4km)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetSimulation('real')}
                        disabled={gpsLoading}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          simulationMode === 'real'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Compass size={12} className={gpsLoading ? 'animate-spin' : ''} />
                        <span>{gpsLoading ? 'Mencari GPS...' : 'GPS Asli HP'}</span>
                      </button>
                    </div>
                  </div>

                  {gpsError && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      ⚠️ {gpsError}
                    </p>
                  )}
                </div>
              )}

              {/* Form Input Data Anggota */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Anggota / Tamu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Muhammad Akbar / Cindy Claudia"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIM (Nomor Induk Mahasiswa) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nim}
                      onChange={(e) => setForm({ ...form, nim: e.target.value })}
                      placeholder="Contoh: 23404015"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Divisi / Status Kepengurusan
                    </label>
                    <select
                      value={form.division}
                      onChange={(e) => setForm({ ...form, division: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer"
                    >
                      {OFFICIAL_DIVISIONS.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                      <option value="Anggota Muda / Magang">Anggota Muda / Magang</option>
                      <option value="Tamu Undangan / Umum">Tamu Undangan / Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Kehadiran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Hadir', label: 'Hadir Fisik', icon: '📍' },
                      { id: 'Izin', label: 'Izin Resmi', icon: '📝' },
                      { id: 'Sakit', label: 'Sakit', icon: '🏥' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setForm({ ...form, statusType: st.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          form.statusType === st.id
                            ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{st.icon}</span>
                        <span>{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan / Keterangan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder={
                      form.statusType === 'Hadir'
                        ? 'Contoh: Hadir di Gazebo Lap. Pancasila Palopo'
                        : 'Alasan izin / sakit...'
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || (isGeofenceActive && !isWithinRadius && form.statusType === 'Hadir')}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      isGeofenceActive && !isWithinRadius && form.statusType === 'Hadir'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                    }`}
                  >
                    <UserCheck size={16} />
                    <span>
                      {isSubmitting
                        ? 'Mencatat Presensi...'
                        : isGeofenceActive && !isWithinRadius && form.statusType === 'Hadir'
                        ? 'Presensi Ditolak (Di Luar Radius)'
                        : 'Kirim Presensi Sekarang'}
                    </span>
                  </button>
                  {isGeofenceActive && !isWithinRadius && form.statusType === 'Hadir' && (
                    <p className="text-[11px] text-center text-rose-600 mt-2">
                      ⚠️ Anda harus berada dalam radius {maxRadius} meter dari lokasi {session.createdBy?.name || 'Alif'} untuk presensi hadir fisik.
                    </p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

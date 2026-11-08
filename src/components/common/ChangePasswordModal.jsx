import React, { useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Check,
} from 'lucide-react';
import { playNotificationChime } from '../../utils/notificationSound';

export default function ChangePasswordModal({
  isOpen,
  onClose,
  authUser,
  accounts = [],
  onUpdatePassword,
  onAddActivityLog,
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Find authoritative account record for current password matching
  const activeAccount = accounts.find((a) => a.nim === authUser?.nim) || authUser;

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[a-zA-Z]/.test(pass) && /\d/.test(pass)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) score += 1;

    if (score <= 1) {
      return { score: 1, label: 'Lemah (Minimal 6 karakter)', color: 'bg-rose-500', textColor: 'text-rose-600' };
    }
    if (score === 2) {
      return { score: 2, label: 'Cukup Baik (Kombinasi huruf & angka)', color: 'bg-amber-500', textColor: 'text-amber-600' };
    }
    return { score: 3, label: 'Sangat Kuat & Aman', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(newPassword);
  const isMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!authUser || !authUser.nim) {
      setErrorMessage('Sesi akun tidak valid. Silakan login kembali.');
      return;
    }

    const cleanCurrent = currentPassword.trim();
    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanCurrent) {
      setErrorMessage('Kata sandi saat ini wajib diisi.');
      return;
    }

    if (activeAccount && activeAccount.password && activeAccount.password !== cleanCurrent) {
      setErrorMessage('Kata sandi saat ini yang Anda masukkan salah. Periksa kembali.');
      return;
    }

    if (!cleanNew) {
      setErrorMessage('Kata sandi baru wajib diisi.');
      return;
    }

    if (cleanNew.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter demi keamanan akun.');
      return;
    }

    if (cleanNew === cleanCurrent) {
      setErrorMessage('Kata sandi baru tidak boleh sama dengan kata sandi saat ini.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (onUpdatePassword) {
        onUpdatePassword(authUser.nim, cleanNew);
      }

      if (onAddActivityLog) {
        onAddActivityLog({
          category: 'security',
          type: 'info',
          userName: authUser.name || 'Pengurus',
          userNim: authUser.nim,
          userRole: authUser.role || 'Pengurus',
          userDivision: authUser.division || 'BPH',
          moduleName: 'Keamanan Akun',
          event: 'Ganti Kata Sandi Mandiri',
          details: `Pengurus ${authUser.name} (NIM: ${authUser.nim}) telah memperbarui kata sandi akunnya secara mandiri.`,
        });
      }

      playNotificationChime();
      setIsLoading(false);
      setSuccessMessage('Kata sandi berhasil diperbarui! Sesi login akun Anda telah diperbarui.');

      setTimeout(() => {
        handleClose();
      }, 1600);
    }, 400);
  };

  const handleClose = () => {
    if (isLoading) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-change-password-title"
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button X */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer z-20"
          aria-label="Tutup jendela ganti kata sandi"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <KeyRound size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="modal-change-password-title" className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                Ganti Kata Sandi Mandiri
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Self-Service
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Amankan akun pengurus TERAMEDIA Anda secara mandiri.
            </p>
          </div>
        </div>

        {/* Logged in User Profile Card */}
        {authUser && (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {authUser.name ? authUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {authUser.name || 'Pengurus'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  NIM: <strong className="text-slate-700">{authUser.nim}</strong> • {authUser.role || 'Anggota'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Terverifikasi</span>
            </span>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <span className="font-semibold leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Password Change Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi Saat Ini <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                disabled={isLoading || Boolean(successMessage)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showCurrentPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Dibutuhkan untuk verifikasi kepemilikan akun.
            </p>
          </div>

          {/* Field 2: New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi Baru <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                disabled={isLoading || Boolean(successMessage)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showNewPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      strength.score >= 1 ? strength.color : 'bg-transparent'
                    }`}
                    style={{ width: '33.33%' }}
                  />
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      strength.score >= 2 ? strength.color : 'bg-transparent'
                    }`}
                    style={{ width: '33.33%' }}
                  />
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      strength.score >= 3 ? strength.color : 'bg-transparent'
                    }`}
                    style={{ width: '33.33%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${strength.textColor}`}>
                    {strength.label}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {newPassword.length} karakter
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Field 3: Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                disabled={isLoading || Boolean(successMessage)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all pr-10 ${
                  isMismatch
                    ? 'border-rose-300 focus:ring-rose-500'
                    : isMatch
                    ? 'border-emerald-300 focus:ring-emerald-500'
                    : 'border-slate-200 focus:ring-blue-500'
                }`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Match feedback indicator */}
            {confirmPassword.length > 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                {isMatch ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check size={12} className="stroke-[3]" />
                    Kata sandi cocok
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle size={12} />
                    Kata sandi belum sama
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || Boolean(successMessage)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : successMessage ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


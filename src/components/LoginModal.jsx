import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Terminal
} from 'lucide-react';
import { initialDefaultAccounts } from '../data/defaultAccounts';

const LoginModal = ({
  isOpen,
  onClose,
  onSuccess,
  targetServiceTitle,
  accounts = initialDefaultAccounts,
  onOpenDevDashboard
}) => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleModalClose = useCallback(() => {
    setNim('');
    setPassword('');
    setErrorMessage('');
    setIsLoading(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleModalClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNim = nim.trim();
    const cleanPassword = password.trim();

    if (!cleanNim) {
      setErrorMessage('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('Kata sandi minimal 4 karakter.');
      return;
    }

    const matched = accounts.find((acc) => acc.nim === cleanNim);

    if (!matched) {
      setErrorMessage(`NIM "${cleanNim}" tidak terdaftar. Tambahkan akun melalui Developer Dashboard.`);
      return;
    }

    if (matched.password !== cleanPassword) {
      setErrorMessage(`Kata sandi untuk NIM ${cleanNim} salah. Periksa Developer Dashboard.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setNim('');
      setPassword('');
      onSuccess(matched);
    }, 500);
  };

  const handleUseDemo = (demo) => {
    setNim(demo.nim);
    setPassword(demo.password);
    setErrorMessage('');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative w-full max-w-md bg-[#0b132f] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-8 flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 flex items-start justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md shrink-0">
              <KeyRound size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">TeraDesk</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Autentikasi Pengurus
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Masuk untuk mengakses workspace</p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup form login"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 pt-6 space-y-6">
          {/* Target destination alert pill */}
          {targetServiceTitle && (
            <div className="bg-blue-950/60 border border-blue-500/30 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-blue-200">
              <ShieldCheck size={16} className="text-blue-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tujuan Akses:</span>
                <strong className="text-white truncate block">{targetServiceTitle}</strong>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-150">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIM Field */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Nomor Induk Mahasiswa (NIM) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Contoh: 2209010042"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Kata Sandi Akun <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi pengurus"
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi NIM...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Workspace TeraDesk</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick Pill */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400 block">
                Akun Terdaftar (1-Klik Isi):
              </span>
              {onOpenDevDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    handleModalClose();
                    onOpenDevDashboard();
                  }}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
                  title="Buka panel developer untuk menambah/mengedit akun"
                >
                  <Terminal size={12} />
                  <span>Dev Panel</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {accounts.slice(0, 3).map((demo) => (
                <button
                  key={demo.nim}
                  type="button"
                  onClick={() => handleUseDemo(demo)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {demo.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      NIM: {demo.nim} • {demo.role || demo.division}
                    </p>
                  </div>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-semibold shrink-0">
                    Gunakan
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="bg-black/30 px-6 py-3.5 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Sesi aman (destroy otomatis saat refresh)</span>
          </div>
          <button
            onClick={handleModalClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer font-semibold"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

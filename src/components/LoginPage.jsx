import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { initialDefaultAccounts } from '../data/defaultAccounts';

const LoginPage = ({
  onBackToLanding,
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
      setErrorMessage(`NIM "${cleanNim}" tidak terdaftar. Hubungi admin atau periksa daftar akun.`);
      return;
    }

    if (matched.password !== cleanPassword) {
      setErrorMessage(`Kata sandi untuk NIM ${cleanNim} salah. Silakan coba kembali.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setNim('');
      setPassword('');
      onSuccess(matched);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/90 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-all cursor-pointer min-h-[38px] shrink-0"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </button>

          {/* Center Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/logo-teramedia.png"
              alt="Logo TERAMEDIA"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-xs shrink-0"
            />
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
              TeraDesk
            </span>
          </div>

          {/* Right Status Badge */}
          <div className="hidden md:inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck size={14} />
            <span>Portal Autentikasi</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual Brand & Organization Values (Hidden on small mobile, visible lg) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit shadow-xs">
              <Sparkles size={14} />
              <span>Workspace Terpadu Pengurus</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Satu Akses untuk Seluruh <br />
              <span className="text-blue-600">Layanan Organisasi</span>
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed max-w-md font-normal">
              Masuk dengan akun terdaftar untuk mengelola modul PAR (Program Approval Request), E-Arsip dokumen persuratan, dan inventaris kegiatan TERAMEDIA.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Persetujuan Program Digital</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Pengajuan proposal proker dengan alur verifikasi bertingkat real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Digitalisasi Arsip & SK</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Penyimpanan terpusat dokumen resmi dan penomoran surat otomatis anti-bentrok.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Keamanan Akses Berbasis Peran</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Sistem autentikasi aman dengan batas hak akses divisi dan sesi sekali pakai.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">352++ Mahasiswa</span>
              <span>•</span>
              <span>TERAMEDIA Politeknik Dewantara</span>
            </div>
          </div>

          {/* Right Column: Clean White Login Card */}
          <div className="w-full lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
              
              {/* Card Header */}
              <div className="text-center sm:text-left mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-xs mb-4 mx-auto sm:mx-0">
                  <img
                    src="/logo-teramedia.png"
                    alt="Logo TERAMEDIA"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Masuk ke Workspace
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Masukkan NIM dan kata sandi akun Anda untuk memulai sesi.
                </p>
              </div>

              {/* Target Service Redirect Notice */}
              {targetServiceTitle && (
                <div className="mb-5 bg-blue-50/80 border border-blue-200/70 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
                  <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Tujuan Layanan Terpilih:</span>
                    <span className="text-blue-700 font-medium">{targetServiceTitle}</span>
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl p-3.5 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* NIM Field */}
                <div>
                  <label
                    htmlFor="nim-input"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="nim-input"
                      type="text"
                      inputMode="numeric"
                      autoComplete="username"
                      required
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="Contoh: 202401001"
                      className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="password-input"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Kata Sandi (Password)
                    </label>
                    <span className="text-[11px] text-slate-400">Min. 4 karakter</span>
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 placeholder-slate-400 pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                      title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer min-h-[46px] mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Workspace</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Security Sessional Note & Admin Link */}
              <div className="mt-8 pt-5 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-2">
                <p>
                  Sesi login aman akan otomatis dihancurkan saat halaman di-refresh.
                </p>
                {onOpenDevDashboard && (
                  <p>
                    Butuh kelola akun atau ubah password?{' '}
                    <button
                      onClick={onOpenDevDashboard}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                    >
                      Buka Admin Console
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <p>© 2026 TERAMEDIA Politeknik Dewantara • TeraDesk Workspace</p>
      </footer>
    </div>
  );
};

export default LoginPage;

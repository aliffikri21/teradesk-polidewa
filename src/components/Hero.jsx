import React from 'react';

const Hero = ({ onOpenContact, onNavigateToPortal }) => {
  return (
    <section id="beranda" className="w-full relative bg-[#060D25] text-white flex flex-col items-center px-4 sm:px-6 md:px-12 pt-6 pb-12 overflow-hidden">
      {/* Navigation Bar */}
      <nav className="w-full max-w-6xl py-4 flex justify-between items-center z-20">
        {/* Brand Logo */}
        <a href="#beranda" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-blue-400/50 flex items-center justify-center bg-blue-950/60 shadow-sm">
            <span className="text-white text-base">⚛</span>
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">
            TeraDesk
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#beranda" className="text-white border-b-2 border-white pb-1 font-semibold">
            Beranda
          </a>
          <button
            onClick={onNavigateToPortal}
            className="text-gray-300 hover:text-amber-300 pb-1 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <span>Fitur & Workspace</span>
          </button>
          <a href="#tentang-kami" className="text-gray-400 hover:text-white pb-1 transition-colors">
            Tentang Kami
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToPortal}
            className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-full text-xs transition-all border border-white/15 cursor-pointer"
          >
            Buka Portal Fitur
          </button>
          <button
            onClick={onOpenContact}
            className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Kontak Kami
          </button>
        </div>
      </nav>

      {/* Hero Header Section */}
      <div className="w-full max-w-4xl text-center mt-12 mb-10 flex flex-col items-center z-10">
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 tracking-tight text-white">
          Kelola Organisasi Lebih Mudah <br />
          dalam <span className="italic underline decoration-2 underline-offset-8">Satu Platform</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 max-w-2xl text-xs sm:text-sm md:text-base mb-8 leading-relaxed font-normal">
          Kelola program kerja, proses persetujuan, dan administrasi organisasi dalam satu platform yang terintegrasi dan efisien.
        </p>

        {/* CTA Button without redundant decorative arrow icon */}
        <button
          onClick={onNavigateToPortal}
          className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 px-8 py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Jelajahi Fitur Organisasi
        </button>
      </div>

      {/* Dashboard Preview Widgets Container */}
      <div className="relative w-full max-w-5xl lg:h-[430px] mt-4 mb-12 z-10">
        
        {/* Responsive Layout for Screens */}
        <div className="flex flex-col lg:block items-center gap-6 w-full">

          {/* Left Dark Card - solid background without heavy blur */}
          <div className="w-full max-w-[320px] lg:max-w-none lg:w-[275px] lg:absolute lg:left-0 lg:top-14 bg-[#0d1633] rounded-2xl p-5 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-md text-xs mb-5 font-medium text-gray-200">
              <span>🔖</span> Update Program Kerja
            </div>
            <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">
              update terakhir
            </p>
            <p className="text-xs sm:text-sm font-medium mb-6 leading-snug text-white">
              Workshop Desain Grafis dengan Audiens Siswa/Siswi SMK Negeri 1 Palopo
            </p>
            <button
              onClick={onNavigateToPortal}
              className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-colors font-medium cursor-pointer"
            >
              Cek asesmen program kerja
            </button>
          </div>

          {/* Center Main Card */}
          <div className="w-full max-w-[380px] lg:w-[380px] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-gray-100">
            <div className="text-center text-xs font-medium text-gray-500 mb-3">
              <span className="bg-gray-100/80 px-3 py-1 rounded-full border border-gray-200 text-[11px]">
                Arsip Administrasi
              </span>
            </div>
            <h3 className="text-2xl font-bold leading-tight mb-5 text-slate-900">
              Kelola Organisasi - <br />
              Dengan <span className="italic font-bold">Mudah</span>
            </h3>
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-[3px] border-blue-900 flex items-center justify-center text-xs font-bold text-blue-950 bg-blue-50/50">
                  89%
                </div>
                <div className="text-xs sm:text-sm font-bold leading-tight text-slate-800">
                  Proker Telah <br /> Terlaksana
                </div>
              </div>
              <button
                onClick={onNavigateToPortal}
                className="text-xs text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
              >
                Buka E-Arsip
              </button>
            </div>

            <div className="w-full h-36 bg-gray-200 rounded-xl overflow-hidden relative border border-gray-100 shadow-inner">
              <img
                src="/images/group_pavilion.jpg"
                alt="Dokumentasi Mahasiswa TERAMEDIA"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-[-8px] right-[-8px] bg-blue-700 text-white w-9 h-9 flex items-center justify-center transform rotate-12 rounded-tl-lg shadow-md font-bold text-sm">
                ✦
              </div>
            </div>
          </div>

          {/* Right Cards Stack */}
          <div className="w-full max-w-[320px] lg:max-w-none lg:w-[280px] lg:absolute lg:right-0 lg:top-8 flex flex-col gap-3.5">
            {/* Profile Card 1 */}
            <div className="bg-white text-slate-900 rounded-2xl p-3 flex items-center gap-3.5 shadow-xl border border-gray-100">
              <div className="w-11 h-11 bg-slate-900 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <img src="/images/pembina.jpg" alt="M. Ishak" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900">
                  M. Ishak, S.Kom., M.Kom.
                </p>
                <p className="text-[11px] text-gray-500">Pembina TERAMEDIA</p>
              </div>
            </div>

            {/* Profile Card 2 */}
            <div className="bg-white text-slate-900 rounded-2xl p-3 flex items-center gap-3.5 shadow-xl border border-gray-100">
              <div className="w-11 h-11 bg-slate-900 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <img src="/images/ketua.jpg" alt="Muhammad Toha" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900">
                  Muhammad Toha
                </p>
                <p className="text-[11px] text-gray-500">
                  Ketua Umum TERAMEDIA<br />
                  <span className="text-[10px]">Periode 2025-2026</span>
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-xl border border-gray-100 relative mt-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded mb-2">
                Database Anggota
              </span>
              <p className="text-sm font-bold text-slate-900 mb-1">
                Kader & Pengurus Aktif
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Terdata dalam sistem terpusat TERAMEDIA Politeknik Dewantara
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Sistem Aktif
                </span>
                <button
                  onClick={onOpenContact}
                  className="text-xs font-bold text-slate-800 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Hubungi Pengurus
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Hero Copyright on left */}
      <div className="w-full max-w-6xl text-left mt-auto pt-4 pb-2 z-10 px-2 sm:px-0">
        <p className="text-xs text-gray-400/80 font-medium">Copyright TERAMEDIA 2026</p>
      </div>
    </section>
  );
};

export default Hero;

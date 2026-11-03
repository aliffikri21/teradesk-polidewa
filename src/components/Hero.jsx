import React, { useState, useEffect } from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';

const Hero = ({ onOpenContact, onNavigateToPortal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['tentang-kami', 'fitur', 'beranda'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="beranda"
      className="w-full relative min-h-screen h-[100vh] lg:h-screen bg-[#04081f] text-white flex flex-col items-center justify-between pt-8 sm:pt-10 lg:pt-8 xl:pt-10 2xl:pt-14 pb-0 overflow-hidden select-none"
    >
      {/* =========================================================================
          BACKGROUND: 3D Architectural Ribbed Slats (Fluted Wall) + Radial Ambient
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Base dark navy fill */}
        <div className="absolute inset-0 bg-[#040922]" />

        {/* Ambient radial glow in center behind headline & cards */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 1200px 750px at 50% 32%, rgba(28, 64, 185, 0.4) 0%, rgba(4, 9, 34, 0) 75%)',
          }}
        />

        {/* Vertical Fluted Wall Panels (16 Slats across the screen) */}
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={idx}
              className="h-full flex-1 border-l border-white/[0.045] relative"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.016) 0%, rgba(255,255,255,0) 65%)',
              }}
            >
              {/* Highlight edge on left side of each slat */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-blue-400/[0.07]" />
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          NAVBAR: Floating Glassmorphism Sticky Navbar
          - Tampil halus saat scroll atau saat cursor mengarah ke bagian paling atas
          ========================================================================= */}
      <div
        className="fixed top-0 left-0 right-0 h-16 z-50 pointer-events-auto"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        <nav
          className={`mx-auto w-[calc(100%-2rem)] max-w-6xl mt-3 sm:mt-4 transition-all duration-300 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center ${
            isScrolled || isNavHovered
              ? 'opacity-100 translate-y-0 bg-[#060D25]/85 backdrop-blur-md border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          {/* Brand Logo */}
          <a href="#beranda" className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/logo-teramedia.png"
              alt="Logo TERAMEDIA"
              draggable="false"
              className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0 select-none"
            />
            <span className="text-lg font-semibold tracking-wide text-white">TeraDesk</span>
          </a>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#beranda"
              className={`pb-0.5 transition-all cursor-pointer ${
                activeSection === 'beranda'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-gray-300 hover:text-white font-medium border-b-2 border-transparent'
              }`}
            >
              Beranda
            </a>
            <a
              href="#fitur"
              className={`pb-0.5 transition-all cursor-pointer ${
                activeSection === 'fitur'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-gray-300 hover:text-white font-medium border-b-2 border-transparent'
              }`}
            >
              Fitur
            </a>
            <a
              href="#tentang-kami"
              className={`pb-0.5 transition-all cursor-pointer ${
                activeSection === 'tentang-kami'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-gray-300 hover:text-white font-medium border-b-2 border-transparent'
              }`}
            >
              Tentang Kami
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 font-bold px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer min-h-[40px] flex items-center justify-center"
            >
              Kontak Kami
            </button>
          </div>
        </nav>
      </div>

      {/* =========================================================================
          HERO HEADER: Capsule Badge, Headline, Subtitle, CTA Button (Larger & Impactful)
          ========================================================================= */}
      <div className="w-full max-w-4xl 2xl:max-w-5xl text-center flex flex-col items-center px-4 z-10 shrink-0 mt-2 lg:mt-3 2xl:mt-4">
        {/* Top Capsule Badge: TERAMEDIA Prototype */}
        <div className="bg-[#182042]/85 border border-white/20 text-gray-200 text-xs sm:text-[13px] 2xl:text-sm px-5 sm:px-6 py-1.5 rounded-full mb-3.5 sm:mb-4 font-medium inline-flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <span className="font-semibold tracking-wider text-white">TERAMEDIA</span>
          <span className="font-normal italic text-slate-300">Prototype</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-[54px] xl:text-[60px] 2xl:text-[66px] font-bold leading-[1.12] mb-3.5 sm:mb-4 tracking-tight text-white max-w-4xl 2xl:max-w-5xl">
          Kelola Organisasi Lebih Mudah <br />
          dalam{' '}
          <span className="italic underline decoration-white decoration-[3px] sm:decoration-[4px] underline-offset-[8px] sm:underline-offset-[10px]">
            Satu Platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 max-w-xl 2xl:max-w-2xl text-xs sm:text-sm md:text-[15px] lg:text-base 2xl:text-lg mb-4 sm:mb-5 leading-relaxed font-normal">
          Kelola program kerja, proses persetujuan, dan administrasi organisasi dalam satu platform
          yang terintegrasi dan efisien.
        </p>

        {/* CTA Button: Jelajahi Lebih Banyak Fitur */}
        <button
          onClick={() => onNavigateToPortal && onNavigateToPortal()}
          className="bg-[#ea9804] hover:bg-[#f59e0b] text-white pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 2xl:py-3 rounded-full text-xs sm:text-sm md:text-[15px] 2xl:text-base font-semibold transition-all shadow-[0_8px_25px_rgba(234,152,4,0.4)] active:scale-95 cursor-pointer flex items-center gap-3.5 min-h-[42px] sm:min-h-[46px] 2xl:min-h-[50px]"
        >
          <span className="tracking-wide">Jelajahi Lebih Banyak Fitur</span>
          <span className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 rounded-full bg-white flex items-center justify-center text-[#ea9804] shadow-sm shrink-0">
            <ArrowRight size={15} strokeWidth={2.8} />
          </span>
        </button>
      </div>

      {/* =========================================================================
          HERO DASHBOARD PREVIEW: 3 Substantial Cards filling the frame
          ========================================================================= */}
      <div className="relative w-full max-w-[1080px] xl:max-w-[1180px] 2xl:max-w-[1340px] px-4 sm:px-6 z-10 shrink-0 mt-auto">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-6 xl:gap-8 2xl:gap-10 w-full">

          {/* -------------------------------------------------------------------
              COLUMN 1: Left Dark Frosted Card (Update Program Kerja)
              ------------------------------------------------------------------- */}
          <div className="w-[260px] sm:w-[280px] xl:w-[295px] 2xl:w-[330px] lg:mt-2 bg-[#0c1433]/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 xl:p-6 2xl:p-7 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none shrink-0">
            {/* Card Badge */}
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-lg text-xs xl:text-[13px] 2xl:text-sm mb-4 font-medium text-white border border-white/10">
              <Bookmark size={14} className="text-white fill-white/80" />
              <span>Update Program Kerja</span>
            </div>

            {/* Small uppercase label */}
            <p className="text-[10px] xl:text-[11px] 2xl:text-xs text-gray-400 mb-1.5 lowercase tracking-normal font-normal">
              update terakhir
            </p>

            {/* Main Title (Italicized per design) */}
            <p className="text-xs sm:text-[13px] xl:text-sm 2xl:text-[15px] font-normal italic mb-6 leading-relaxed text-white">
              Workshop Desain Grafis dengan Audiens Siswa/Siswi SMK Negeri 1 Palopo
            </p>

            {/* Link action */}
            <button
              onClick={() => onNavigateToPortal && onNavigateToPortal('par')}
              className="text-[11px] xl:text-xs 2xl:text-sm text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-normal cursor-pointer"
            >
              <span>cek asesmen program kerja</span>
              <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 2: Center Showcase Card (Arsip Administrasi)
              ------------------------------------------------------------------- */}
          <div className="w-[350px] sm:w-[380px] xl:w-[410px] 2xl:w-[460px] lg:mt-8 bg-white text-slate-900 rounded-[2rem] sm:rounded-[2.5rem] 2xl:rounded-[3rem] p-6 xl:p-7 2xl:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-gray-100 relative z-20 select-none shrink-0">
            {/* Top Capsule inside card */}
            <div className="text-center mb-2.5">
              <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full border border-gray-200/80 text-xs xl:text-[13px] 2xl:text-sm font-medium inline-block">
                Arsip Administrasi
              </span>
            </div>

            {/* Heading inside card */}
            <h3 className="text-2xl sm:text-[26px] xl:text-[28px] 2xl:text-[32px] font-bold leading-tight mb-4 text-slate-900 text-center tracking-tight">
              Kelola Organisasi - <br />
              Dengan <span className="italic font-bold">Mudah</span>
            </h3>

            {/* Progress & Period Row */}
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-3">
                {/* 89% Navy Circle */}
                <div className="w-12 h-12 xl:w-13 xl:h-13 2xl:w-14 2xl:h-14 rounded-full border-[3.5px] border-[#0a237a] flex items-center justify-center text-xs xl:text-sm 2xl:text-base font-bold text-[#0a237a] bg-blue-50/40 shrink-0">
                  89%
                </div>
                <div className="text-xs sm:text-[13px] xl:text-sm 2xl:text-[15px] font-bold leading-tight text-slate-900">
                  Proker Telah <br /> Terlaksana 🔥
                </div>
              </div>

              {/* Periode 2025 Blue Underline */}
              <span className="text-[#1e3a8a] text-xs xl:text-[13px] 2xl:text-sm font-semibold underline underline-offset-4 cursor-default">
                Periode 2025
              </span>
            </div>

            {/* Photo Container with Sparkle Star */}
            <div className="w-full h-36 sm:h-40 xl:h-44 2xl:h-48 rounded-2xl overflow-visible relative border border-gray-100 shadow-inner select-none">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src="/images/group_pavilion.jpg"
                  alt="Dokumentasi Mahasiswa TERAMEDIA"
                  draggable="false"
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* 4-Point Blue Sparkle Star Floating at Top-Right Edge of Photo */}
              <div className="absolute -top-4 -right-3 z-30 pointer-events-none drop-shadow-[0_4px_12px_rgba(37,99,235,0.45)]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 fill-[#2563EB]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 3: Right Stack (Pembina, Ketua Umum, Jumlah Kader Metric)
              Staggered layout matching target design exactly
              ------------------------------------------------------------------- */}
          <div className="w-[270px] sm:w-[290px] xl:w-[310px] 2xl:w-[340px] flex flex-col gap-3 2xl:gap-4 select-none shrink-0">
            {/* Card 1: Pembina TERAMEDIA (Shifted right) */}
            <div className="w-[230px] sm:w-[250px] xl:w-[265px] 2xl:w-[290px] self-center lg:self-end bg-white text-slate-900 rounded-2xl px-4 py-3 2xl:py-3.5 flex items-center gap-3.5 shadow-xl border border-gray-100">
              <div className="w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner" />
              <div>
                <p className="text-[13px] xl:text-sm 2xl:text-[15px] font-bold leading-tight mb-0.5 text-slate-900">
                  M. Ishak, S.Kom., M.Kom.
                </p>
                <p className="text-[11px] xl:text-xs 2xl:text-[13px] text-gray-500 font-medium">Pembina TERAMEDIA</p>
              </div>
            </div>

            {/* Card 2: Ketua Umum TERAMEDIA (Slightly shifted) */}
            <div className="w-[225px] sm:w-[245px] xl:w-[260px] 2xl:w-[285px] self-center lg:self-end lg:mr-4 bg-white text-slate-900 rounded-2xl px-4 py-3 2xl:py-3.5 flex items-center gap-3.5 shadow-xl border border-gray-100">
              <div className="w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner" />
              <div>
                <p className="text-[13px] xl:text-sm 2xl:text-[15px] font-bold leading-tight mb-0.5 text-slate-900">
                  Muhammad Toha
                </p>
                <p className="text-[11px] xl:text-xs 2xl:text-[13px] text-gray-600 font-medium leading-tight">
                  Ketua Umum TERAMEDIA <br />
                  <span className="text-[10px] xl:text-[11px] 2xl:text-xs text-gray-400">Periode 2025-2026</span>
                </p>
              </div>
            </div>

            {/* Card 3: Jumlah Kader Metric Card */}
            <div className="w-full bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-5 xl:p-6 2xl:p-7 shadow-xl border border-gray-100 relative">
              {/* Card Header with Clapping Hands */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs sm:text-[13px] xl:text-sm 2xl:text-[15px] font-bold text-slate-900 leading-snug">
                    Jumlah Kader <br />
                    Menggunakan TeraDesk
                  </p>
                  <p className="text-[10px] xl:text-[11px] 2xl:text-xs text-gray-400 font-normal lowercase mt-0.5">
                    update terakhir
                  </p>
                </div>
                {/* Clapping Hands with small sparkle accents */}
                <div className="relative text-lg xl:text-xl 2xl:text-2xl select-none leading-none pt-0.5">
                  <span role="img" aria-label="clapping hands">
                    👏
                  </span>
                  <span className="absolute -top-1.5 -right-1 text-[8px] 2xl:text-[10px] text-gray-400 font-bold">
                    \ | /
                  </span>
                </div>
              </div>

              {/* Metric Value */}
              <div className="my-2 xl:my-2.5">
                <span className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-[#1d4ed8] tracking-tight">
                  352 ++
                </span>
                <p className="text-[11px] xl:text-xs 2xl:text-sm text-gray-400 font-normal mt-0.5">
                  mahasiswa/mahasiswi
                </p>
              </div>

              {/* Card Footer: Kontak Kami + Astrolabe / Orbital Compass Icon */}
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                <button
                  onClick={onOpenContact}
                  className="text-xs xl:text-[13px] 2xl:text-sm font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Kontak Kami</span>
                  <ArrowRight size={13} strokeWidth={2.2} />
                </button>

                {/* Circular Astrolabe / Compass Rose Icon Badge */}
                <div className="w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 rounded-full bg-blue-50/70 border border-blue-200/70 flex items-center justify-center text-[#1e3a8a] shadow-xs">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(45 12 12)" />
                    <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(-45 12 12)" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            3D PERSPECTIVE FLOOR / RUNWAY: Positioned directly under center card
            --------------------------------------------------------------------- */}
        <div className="hidden lg:flex w-full pointer-events-none justify-center -mt-8 xl:-mt-10 2xl:-mt-12">
          <div
            className="w-[580px] sm:w-[640px] xl:w-[720px] 2xl:w-[820px] h-20 sm:h-24 xl:h-28 2xl:h-32"
            style={{
              clipPath: 'polygon(0% 100%, 100% 100%, 81% 0%, 19% 0%)',
              background: 'linear-gradient(180deg, #edf0f5 0%, #e2e7ee 100%)',
              boxShadow: '0 -15px 35px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          BOTTOM COPYRIGHT: Left-aligned at the bottom-left corner
          ========================================================================= */}
      <div className="w-full max-w-[1080px] xl:max-w-[1180px] 2xl:max-w-[1340px] text-left mt-auto lg:mt-0 lg:absolute lg:bottom-6 lg:left-12 xl:left-16 z-20 pointer-events-none px-6 pt-6 lg:pt-0 pb-4 lg:pb-0">
        <p className="text-[11px] xl:text-xs text-slate-400 font-normal">Copyright TERAMEDIA 2026</p>
      </div>
    </section>
  );
};

export default Hero;

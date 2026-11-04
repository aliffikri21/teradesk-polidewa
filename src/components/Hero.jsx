import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { initialDefaultProker } from '../data/defaultProker';

const Hero = ({ onOpenContact, onNavigateToPortal, prokerList = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [activeProkerIndex, setActiveProkerIndex] = useState(0);
  const [isProkerHovered, setIsProkerHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [fadeDirection, setFadeDirection] = useState('next'); // 'next' | 'prev'

  // Filter proker yang diizinkan tampil di hero
  const effectiveProkers = prokerList && prokerList.length > 0 ? prokerList : initialDefaultProker;
  const visibleProkers = effectiveProkers.filter((item) => item.isVisible !== false);
  const displayProkers = visibleProkers.length > 0 ? visibleProkers : initialDefaultProker;

  const safeIndex = displayProkers.length > 0 ? activeProkerIndex % displayProkers.length : 0;
  const currentProker = displayProkers[safeIndex] || initialDefaultProker[0];

  // Silky smooth cross-slide transition
  const changeProker = useCallback((newIndex, direction = 'next') => {
    if (isFading || displayProkers.length <= 1) return;
    setFadeDirection(direction);
    setIsFading(true);
    setTimeout(() => {
      setActiveProkerIndex(newIndex);
      setIsFading(false);
    }, 240);
  }, [isFading, displayProkers.length]);

  const triggerNext = useCallback(() => {
    changeProker((safeIndex + 1) % displayProkers.length, 'next');
  }, [changeProker, safeIndex, displayProkers.length]);

  const triggerPrev = useCallback(() => {
    changeProker((safeIndex - 1 + displayProkers.length) % displayProkers.length, 'prev');
  }, [changeProker, safeIndex, displayProkers.length]);

  const handleSelectProker = useCallback((index) => {
    if (index === safeIndex) return;
    changeProker(index % displayProkers.length, index > safeIndex ? 'next' : 'prev');
  }, [changeProker, safeIndex, displayProkers.length]);

  // Auto-cycle every 5 seconds when not hovered and not fading
  useEffect(() => {
    if (displayProkers.length <= 1 || isProkerHovered || isFading) return;
    const interval = setInterval(() => {
      triggerNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [displayProkers.length, isProkerHovered, isFading, triggerNext]);

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
      className="w-full relative min-h-screen h-[100vh] lg:h-screen bg-[#04081f] text-white flex flex-col items-center justify-between pt-16 sm:pt-18 lg:pt-16 xl:pt-20 pb-8 sm:pb-10 lg:pb-8 xl:pb-10 overflow-hidden select-none"
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
          - Tampil konsisten dengan frosted glass putih beropasitas rendah
          ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 h-16 z-50 pointer-events-auto">
        <nav
          className={`mx-auto w-[calc(100%-2rem)] max-w-6xl mt-3 sm:mt-4 transition-all duration-300 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center opacity-100 translate-y-0 ${
            activeSection === 'beranda'
              ? `bg-white/15 backdrop-blur-md border border-white/25 text-white ${
                  isScrolled
                    ? 'shadow-[0_12px_40px_0_rgba(0,0,0,0.45)] bg-white/[0.18]'
                    : 'shadow-[0_8px_32px_0_rgba(0,0,0,0.32)]'
                }`
              : 'bg-white/75 backdrop-blur-md border border-slate-200/70 shadow-[0_12px_36px_rgba(0,0,0,0.08)] text-slate-800'
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
            <span
              className={`text-lg font-semibold tracking-wide transition-colors ${
                activeSection === 'beranda' ? 'text-white' : 'text-slate-900'
              }`}
            >
              TeraDesk
            </span>
          </a>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#beranda"
              className={`pb-0.5 transition-all cursor-pointer ${
                activeSection === 'beranda'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium border-b-2 border-transparent'
              }`}
            >
              Beranda
            </a>
            <a
              href="#fitur"
              className={`pb-0.5 transition-all cursor-pointer ${
                activeSection === 'fitur'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-bold'
                  : activeSection === 'beranda'
                  ? 'text-gray-300 hover:text-white font-medium border-b-2 border-transparent'
                  : 'text-slate-600 hover:text-slate-900 font-medium border-b-2 border-transparent'
              }`}
            >
              Fitur
            </a>
            <a
              href="#tentang-kami"
              className={`pb-0.5 transition-all cursor-pointer ${
                activeSection === 'tentang-kami'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-bold'
                  : activeSection === 'beranda'
                  ? 'text-gray-300 hover:text-white font-medium border-b-2 border-transparent'
                  : 'text-slate-600 hover:text-slate-900 font-medium border-b-2 border-transparent'
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

        {/* CTA Button: Jelajahi Lebih Banyak Fitur (High-End Micro-Interactions & Shimmer) */}
        <button
          onClick={() => onNavigateToPortal && onNavigateToPortal()}
          className="group relative overflow-hidden bg-gradient-to-r from-[#e58f00] via-[#ea9804] to-[#f59e0b] hover:from-[#ea9804] hover:via-[#f59e0b] hover:to-[#fbbf24] text-white pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 2xl:py-3 rounded-full text-xs sm:text-sm md:text-[15px] 2xl:text-base font-semibold transition-all duration-300 shadow-[0_8px_25px_rgba(234,152,4,0.4)] hover:shadow-[0_16px_38px_rgba(234,152,4,0.6)] hover:ring-4 hover:ring-amber-400/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] cursor-pointer flex items-center gap-3.5 min-h-[42px] sm:min-h-[46px] 2xl:min-h-[50px]"
        >
          {/* Animated Light Sweep / Shimmer Flare */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Button Text */}
          <span className="tracking-wide relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
            Jelajahi Lebih Banyak Fitur
          </span>

          {/* Circular Badge with Arrow */}
          <span className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 rounded-full bg-white flex items-center justify-center text-[#ea9804] shadow-sm shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
            <ArrowRight
              size={15}
              strokeWidth={2.8}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105"
            />
          </span>
        </button>
      </div>

      {/* =========================================================================
          HERO DASHBOARD PREVIEW: 3 Substantial Cards filling the frame
          ========================================================================= */}
      <div className="relative w-full max-w-[1080px] xl:max-w-[1180px] 2xl:max-w-[1340px] px-4 sm:px-6 z-10 shrink-0 mt-auto mb-4 sm:mb-6 lg:mb-6 xl:mb-8">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-6 xl:gap-8 2xl:gap-10 w-full">

          {/* -------------------------------------------------------------------
              COLUMN 1: Left Dark Frosted Overlapping Stack (Program Kerja Cards)
              ------------------------------------------------------------------- */}
          <div
            className="relative w-[260px] sm:w-[280px] xl:w-[295px] 2xl:w-[330px] min-h-[220px] sm:min-h-[230px] xl:min-h-[240px] 2xl:min-h-[255px] lg:mt-2 select-none shrink-0"
            onMouseEnter={() => setIsProkerHovered(true)}
            onMouseLeave={() => setIsProkerHovered(false)}
          >
            {/* Layer 3: Deepest overlapping card (terbawah) */}
            {displayProkers.length >= 3 && (
              <div
                onClick={triggerNext}
                className="absolute inset-0 bg-[#070e28]/60 backdrop-blur-xs rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-400 ease-out cursor-pointer hover:border-white/20"
                style={{
                  transform: isFading
                    ? 'translate(11px, 11px) rotate(2.2deg) scale(0.94)'
                    : 'translate(14px, 14px) rotate(3deg) scale(0.92)',
                  zIndex: 10,
                  opacity: isFading ? 0.6 : 0.45,
                }}
              />
            )}

            {/* Layer 2: Middle overlapping card (tengah) */}
            {displayProkers.length >= 2 && (
              <div
                onClick={triggerNext}
                className="absolute inset-0 bg-[#0a1336]/75 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.6)] transition-all duration-400 ease-out cursor-pointer hover:border-white/25"
                style={{
                  transform: isFading
                    ? 'translate(4px, 4px) rotate(1deg) scale(0.98)'
                    : 'translate(7px, 7px) rotate(1.5deg) scale(0.96)',
                  zIndex: 20,
                  opacity: isFading ? 0.9 : 0.75,
                }}
              />
            )}

            {/* Layer 1: Front Active Card (Kartu Utama di depan) */}
            <div className="relative z-30 h-full flex flex-col justify-between bg-[#0c1433]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 xl:p-6 2xl:p-7 border border-white/20 shadow-[0_22px_55px_rgba(0,0,0,0.7)] transition-all duration-300">
              {/* Animated Content Wrapper (Cross-slide & Smooth Fade) */}
              <div
                className="transition-all duration-240 ease-out"
                style={{
                  opacity: isFading ? 0 : 1,
                  transform: isFading
                    ? (fadeDirection === 'next' ? 'translateY(-6px)' : 'translateY(6px)')
                    : 'translateY(0)',
                }}
              >
                {/* Card Header: Badge & Stepper Controls */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-lg text-xs xl:text-[13px] 2xl:text-sm font-medium text-white border border-white/10 shadow-xs">
                    <Bookmark size={14} className="text-white fill-white/80" />
                    <span className="truncate max-w-[145px] sm:max-w-[165px]">{currentProker.badge || 'Update Program Kerja'}</span>
                  </div>

                  {/* Navigation controls when multiple proker exist */}
                  {displayProkers.length > 1 && (
                    <div className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/15 text-[10px] text-slate-300 shadow-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerPrev();
                        }}
                        className="hover:text-white transition-colors cursor-pointer p-0.5"
                        title="Proker Sebelumnya"
                      >
                        <ChevronLeft size={11} />
                      </button>
                      <span className="font-mono font-bold px-1 text-white text-[10px]">
                        {safeIndex + 1}/{displayProkers.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerNext();
                        }}
                        className="hover:text-white transition-colors cursor-pointer p-0.5"
                        title="Proker Selanjutnya"
                      >
                        <ChevronRight size={11} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Small uppercase label */}
                <p className="text-[10px] xl:text-[11px] 2xl:text-xs text-gray-400 mb-1.5 lowercase tracking-normal font-normal">
                  {currentProker.tag || 'update terakhir'}
                </p>

                {/* Main Title (Italicized per design) */}
                <p className="text-xs sm:text-[13px] xl:text-sm 2xl:text-[15px] font-normal italic mb-4 leading-relaxed text-white line-clamp-3">
                  {currentProker.title}
                </p>
              </div>

              {/* Bottom Row: Action link + Minimalist Pagination Dots */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-auto">
                <button
                  onClick={() => onNavigateToPortal && onNavigateToPortal(currentProker.actionServiceId || 'par')}
                  className="text-[11px] xl:text-xs 2xl:text-sm text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-normal cursor-pointer group/link"
                >
                  <span className="group-hover/link:underline">{currentProker.actionText || 'cek asesmen program kerja'}</span>
                  <ArrowRight size={13} strokeWidth={2} className="group-hover/link:translate-x-0.5 transition-transform" />
                </button>

                {displayProkers.length > 1 && (
                  <div className="flex items-center gap-1">
                    {displayProkers.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProker(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === safeIndex ? 'w-3.5 bg-white shadow-xs' : 'w-1 bg-white/30 hover:bg-white/60'
                        }`}
                        title={`Buka proker ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
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
                  src="/images/img1.JPG"
                  alt="Dokumentasi Mahasiswa TERAMEDIA"
                  draggable="false"
                  className="w-full h-full object-cover object-bottom select-none"
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
      </div>

      {/* =========================================================================
          BOTTOM COPYRIGHT: Left-aligned at the bottom-left corner
          ========================================================================= */}
      <div className="w-full max-w-[1080px] xl:max-w-[1180px] 2xl:max-w-[1340px] text-left mt-auto lg:mt-0 lg:absolute lg:bottom-4 lg:left-12 xl:left-16 z-20 pointer-events-none px-6 pt-4 lg:pt-0 pb-2 lg:pb-0">
        <p className="text-[11px] xl:text-xs text-slate-400 font-normal">Copyright TERAMEDIA 2026</p>
      </div>
    </section>
  );
};

export default Hero;

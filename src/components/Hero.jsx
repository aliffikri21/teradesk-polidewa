import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { initialDefaultProker } from '../data/defaultProker';
import CardSwap, { Card } from './CardSwap';

const defaultCenterCards = [
  {
    id: 'arsip',
    badge: 'Arsip Administrasi',
    titleLine1: 'Kelola Organisasi -',
    titleLine2: 'Dengan',
    titleEmphasis: 'Mudah',
    metricValue: '89%',
    metricLabel: 'Proker Telah',
    metricSub: 'Terlaksana 🔥',
    period: 'Periode 2025',
    image: '/images/img1.JPG',
    imageAlt: 'Dokumentasi Mahasiswa TERAMEDIA di Pantai',
    sparkleColor: '#2563EB',
    actionServiceId: 'archive',
  },
  {
    id: 'surat',
    badge: 'E-Surat & LPJ Resmi',
    titleLine1: 'Tata Kelola Surat -',
    titleLine2: 'Bebas',
    titleEmphasis: 'Bentrok',
    metricValue: '96%',
    metricLabel: 'Surat Terbit',
    metricSub: 'Resmi & Valid 📄',
    period: 'Format Standar',
    image: '/images/about/img4.webp',
    imageAlt: 'Pelatihan dan Workshop Mahasiswa TERAMEDIA',
    sparkleColor: '#ea9804',
    actionServiceId: 'par',
  },
  {
    id: 'aset',
    badge: 'Logistik & Inventaris',
    titleLine1: 'Peralatan Multimedia -',
    titleLine2: 'Selalu',
    titleEmphasis: 'Terlacak',
    metricValue: '98%',
    metricLabel: 'Aset Siap',
    metricSub: 'Operasional 🎥',
    period: 'Tracking Real-time',
    image: '/images/about/img2.webp',
    imageAlt: 'Outbound dan Kebersamaan Mahasiswa TERAMEDIA',
    sparkleColor: '#10B981',
    actionServiceId: 'asset',
  },
];

const Hero = ({ onOpenContact, onNavigateToPortal, prokerList = [], leadershipProfiles }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [activeProkerIndex, setActiveProkerIndex] = useState(0);
  const [isProkerHovered, setIsProkerHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [fadeDirection, setFadeDirection] = useState('next'); // 'next' | 'prev'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profil Pimpinan & Pembina Dinamis (Sinkron dengan Admin Editor)
  const activePembina = leadershipProfiles?.pembina || {
    name: 'M. Ishak, S.Kom., M.Kom.',
    title: 'Pembina TERAMEDIA',
    avatarUrl: '',
  };
  const activeKetum = leadershipProfiles?.ketuaUmum || {
    name: 'Muhammad Toha',
    title: 'Ketua Umum TERAMEDIA',
    period: 'Periode 2025-2026',
    avatarUrl: '',
  };

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

  // Ref & State untuk CardSwap Component (React Bits)
  const cardSwapRef = useRef(null);
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);

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
      className="w-full relative min-h-screen h-auto bg-[#04081f] text-white flex flex-col items-center justify-between pt-24 sm:pt-28 lg:pt-20 xl:pt-24 pb-8 sm:pb-10 lg:pb-8 overflow-hidden select-none"
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
          NAVBAR: Floating Glassmorphism Sticky Navbar + Responsive Mobile Drawer
          - Tampil konsisten dengan frosted glass putih beropasitas rendah
          ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-auto">
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
          <a
            href="#beranda"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
          >
            <img
              src="/logo-teramedia.png"
              alt="Logo TERAMEDIA"
              draggable="false"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0 select-none"
            />
            <span
              className={`text-base sm:text-lg font-semibold tracking-wide transition-colors ${
                activeSection === 'beranda' ? 'text-white' : 'text-slate-900'
              }`}
            >
              TeraDesk
            </span>
          </a>

          {/* Center Nav Links (Hidden on mobile, visible on md+) */}
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

          {/* Right Action: CTA Button & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenContact}
              className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 font-bold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer min-h-[38px] sm:min-h-[40px] flex items-center justify-center shrink-0"
            >
              Kontak Kami
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
                activeSection === 'beranda'
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300/80'
              }`}
            >
              {isMobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="md:hidden mx-auto w-[calc(100%-2rem)] max-w-6xl mt-2 p-3 bg-[#080f29]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.65)] animate-in fade-in slide-in-from-top-2 duration-200 relative z-50">
              <div className="flex flex-col gap-1">
                <a
                  href="#beranda"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between ${
                    activeSection === 'beranda' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Beranda</span>
                  {activeSection === 'beranda' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </a>
                <a
                  href="#fitur"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between ${
                    activeSection === 'fitur' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Fitur Layanan</span>
                  {activeSection === 'fitur' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </a>
                <a
                  href="#tentang-kami"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between ${
                    activeSection === 'tentang-kami' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Tentang Kami</span>
                  {activeSection === 'tentang-kami' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =========================================================================
          HERO HEADER: Capsule Badge, Headline, Subtitle, CTA Button (Larger & Impactful)
          ========================================================================= */}
      <div className="w-full max-w-4xl 2xl:max-w-5xl text-center flex flex-col items-center px-4 z-10 shrink-0 mt-3 sm:mt-4 lg:mt-3 2xl:mt-4">
        {/* Top Capsule Badge: TERAMEDIA Prototype */}
        <div className="bg-[#182042]/85 border border-white/20 text-gray-200 text-[11px] sm:text-xs md:text-[13px] 2xl:text-sm px-4 sm:px-6 py-1.5 rounded-full mb-3 sm:mb-4 font-medium inline-flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <span className="font-semibold tracking-wider text-white">TERAMEDIA</span>
          <span className="font-normal italic text-slate-300">Prototype</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[56px] 2xl:text-[64px] font-bold leading-[1.18] sm:leading-[1.14] mb-3 sm:mb-4 tracking-tight text-white max-w-4xl 2xl:max-w-5xl">
          Kelola Organisasi Lebih Mudah <br />
          dalam{' '}
          <span className="italic underline decoration-white decoration-[2.5px] sm:decoration-[4px] underline-offset-[6px] sm:underline-offset-[10px]">
            Satu Platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 max-w-xl 2xl:max-w-2xl text-xs sm:text-sm md:text-[15px] lg:text-[15px] xl:text-base 2xl:text-lg mb-4 sm:mb-5 leading-relaxed font-normal px-2">
          Kelola program kerja, proses persetujuan, dan administrasi organisasi dalam satu platform
          yang terintegrasi dan efisien.
        </p>

        {/* CTA Button: Jelajahi Lebih Banyak Fitur (High-End Micro-Interactions & Shimmer) */}
        <button
          onClick={() => onNavigateToPortal && onNavigateToPortal()}
          className="group relative overflow-hidden bg-gradient-to-r from-[#e58f00] via-[#ea9804] to-[#f59e0b] hover:from-[#ea9804] hover:via-[#f59e0b] hover:to-[#fbbf24] text-white pl-5 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 2xl:py-3 rounded-full text-xs sm:text-sm md:text-[15px] 2xl:text-base font-semibold transition-all duration-300 shadow-[0_8px_25px_rgba(234,152,4,0.4)] hover:shadow-[0_16px_38px_rgba(234,152,4,0.6)] hover:ring-4 hover:ring-amber-400/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] cursor-pointer flex items-center gap-3.5 min-h-[42px] sm:min-h-[46px] 2xl:min-h-[50px]"
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
      <div className="relative w-full max-w-[1020px] xl:max-w-[1180px] 2xl:max-w-[1340px] px-4 sm:px-6 z-10 shrink-0 mt-6 sm:mt-8 lg:mt-6 xl:mt-8 mb-4 sm:mb-6 lg:mb-6 xl:mb-8">
        <div className="relative flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center justify-center lg:items-start lg:justify-center xl:justify-between gap-5 sm:gap-6 md:gap-8 lg:gap-4 xl:gap-7 2xl:gap-10 w-full">

          {/* -------------------------------------------------------------------
              COLUMN 1: Left Dark Frosted Overlapping Stack (Program Kerja Cards)
              ------------------------------------------------------------------- */}
          <div
            className="relative w-full max-w-[315px] sm:max-w-[330px] lg:max-w-[295px] xl:w-[325px] 2xl:w-[355px] min-h-[220px] sm:min-h-[230px] xl:min-h-[240px] 2xl:min-h-[255px] lg:mt-2 select-none shrink-0"
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
                    ? 'translate(8px, 8px) rotate(2deg) scale(0.95)'
                    : 'translate(10px, 10px) rotate(2.5deg) scale(0.94)',
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
                    : 'translate(6px, 6px) rotate(1.4deg) scale(0.97)',
                  zIndex: 20,
                  opacity: isFading ? 0.9 : 0.75,
                }}
              />
            )}

            {/* Layer 1: Front Active Card (Kartu Utama di depan) */}
            <div className="relative z-30 h-full flex flex-col justify-between bg-[#0c1433]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 xl:p-6 2xl:p-7 border border-white/20 shadow-[0_22px_55px_rgba(0,0,0,0.7)] transition-all duration-300 overflow-hidden">
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
                <div className="flex items-center justify-between gap-2 mb-3 min-w-0 w-full">
                  <div className="flex items-center gap-2 bg-white/10 min-w-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] 2xl:text-sm font-medium text-white border border-white/10 shadow-xs truncate">
                    <Bookmark size={14} className="text-white fill-white/80 shrink-0" />
                    <span className="truncate">{currentProker.badge || 'Update Program Kerja'}</span>
                  </div>

                  {/* Navigation controls when multiple proker exist */}
                  {displayProkers.length > 1 && (
                    <div className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/15 text-[10px] text-slate-300 shadow-xs shrink-0">
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
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10 mt-auto w-full min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToPortal) {
                      onNavigateToPortal(currentProker.actionServiceId || 'par');
                    }
                  }}
                  className="text-[11px] xl:text-xs 2xl:text-sm text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-normal cursor-pointer group/link min-w-0 truncate"
                >
                  <span className="group-hover/link:underline truncate">{currentProker.actionText || 'cek asesmen program kerja'}</span>
                  <ArrowRight size={13} strokeWidth={2} className="group-hover/link:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {displayProkers.length > 1 && (
                  <div className="flex items-center gap-1 shrink-0">
                    {displayProkers.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
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
              COLUMN 2: Center Showcase Card Stack (React Bits CardSwap Component)
              ------------------------------------------------------------------- */}
          <div className="relative w-full max-w-[365px] sm:max-w-[385px] lg:max-w-[355px] xl:max-w-[430px] 2xl:max-w-[470px] lg:mt-2 xl:mt-4 select-none shrink-0 flex flex-col items-center">
            <CardSwap
              ref={cardSwapRef}
              width={360}
              height={445}
              cardDistance={26}
              verticalDistance={28}
              depth={40}
              skewAmount={2}
              cardRadius={36}
              visibleCards={3}
              delay={5000}
              autoplay={true}
              pauseOnHover={true}
              draggable={true}
              speed={1.05}
              bounce={0}
              parallax={0.12}
              hoverSpread={0.05}
              theme="light"
              onChange={(idx) => setActiveCenterIndex(idx)}
              className="w-full"
            >
              {defaultCenterCards.map((card, idx) => (
                <Card
                  key={card.id}
                  className="p-4 sm:p-5 xl:p-6 bg-white text-slate-900 flex flex-col justify-between h-full select-none cursor-grab active:cursor-grabbing border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.22)] rounded-[2rem] sm:rounded-[2.25rem]"
                >
                  {/* Top Capsule & Stepper Controls */}
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="bg-gray-100 text-gray-700 px-3.5 py-1 rounded-full border border-gray-200/80 text-xs xl:text-[13px] font-semibold inline-block truncate max-w-[200px]">
                      {card.badge}
                    </span>

                    {/* Stepper controls */}
                    <div className="flex items-center gap-1 bg-gray-100/90 px-2 py-0.5 rounded-full border border-gray-200 text-[10px] text-gray-500 font-mono">
                      <button
                        type="button"
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          cardSwapRef.current?.prev();
                        }}
                        className="hover:text-slate-900 transition-colors p-0.5 cursor-pointer"
                        title="Kartu Sebelumnya"
                      >
                        <ChevronLeft size={12} />
                      </button>
                      <span className="font-bold text-slate-800 px-0.5">
                        {idx + 1}/{defaultCenterCards.length}
                      </span>
                      <button
                        type="button"
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          cardSwapRef.current?.next();
                        }}
                        className="hover:text-slate-900 transition-colors p-0.5 cursor-pointer"
                        title="Kartu Selanjutnya"
                      >
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Heading inside card */}
                  <h3 className="text-xl sm:text-[23px] xl:text-[26px] 2xl:text-[29px] font-bold leading-tight mb-2 sm:mb-2.5 text-slate-900 text-center tracking-tight">
                    {card.titleLine1} <br />
                    {card.titleLine2} <span className="italic font-bold">{card.titleEmphasis}</span>
                  </h3>

                  {/* Progress & Period Row */}
                  <div className="flex justify-between items-center mb-2.5 sm:mb-3 px-0.5">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {/* Circle Metric */}
                      <div
                        className="w-11 h-11 xl:w-12 xl:h-12 rounded-full border-[3px] sm:border-[3.5px] flex items-center justify-center text-xs xl:text-sm font-bold bg-blue-50/40 shrink-0"
                        style={{
                          borderColor: card.sparkleColor,
                          color: card.sparkleColor,
                        }}
                      >
                        {card.metricValue}
                      </div>
                      <div className="text-xs sm:text-[13px] xl:text-sm font-bold leading-tight text-slate-900">
                        {card.metricLabel} <br /> {card.metricSub}
                      </div>
                    </div>

                    {/* Period Button / Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToPortal) {
                          onNavigateToPortal(card.actionServiceId);
                        }
                      }}
                      className="text-xs xl:text-[13px] font-semibold underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: card.sparkleColor }}
                    >
                      {card.period}
                    </button>
                  </div>

                  {/* Photo Container with Sparkle Star */}
                  <div className="w-full h-34 sm:h-38 xl:h-44 rounded-2xl overflow-visible relative border border-gray-100 shadow-inner select-none mt-auto">
                    <div className="w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        draggable="false"
                        className="w-full h-full object-cover object-bottom select-none pointer-events-none"
                      />
                    </div>

                    {/* 4-Point Colored Sparkle Star Floating at Top-Right Edge of Photo */}
                    <div className="absolute -top-3 -right-2.5 z-30 pointer-events-none drop-shadow-[0_4px_12px_rgba(37,99,235,0.45)]">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 xl:w-7 xl:h-7"
                        style={{ fill: card.sparkleColor }}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                      </svg>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>

            {/* Minimalist Navigation Bar: External Prev Button + Dots + External Next Button */}
            <div className="flex items-center justify-center gap-3 mt-3 z-30">
              <button
                type="button"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  cardSwapRef.current?.prev();
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Kartu Sebelumnya"
              >
                <ChevronLeft size={14} />
              </button>

              <div className="flex items-center gap-1.5">
                {defaultCenterCards.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (dotIdx !== activeCenterIndex) {
                        cardSwapRef.current?.next();
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === activeCenterIndex ? 'w-5 bg-white shadow-xs' : 'w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                    title={`Buka kartu ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  cardSwapRef.current?.next();
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Kartu Selanjutnya"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 3: Right Stack (Pembina, Ketua Umum, Jumlah Kader Metric)
              Staggered layout matching target design exactly
              ------------------------------------------------------------------- */}
          <div className="w-full max-w-[280px] sm:max-w-[290px] lg:max-w-[265px] xl:w-[310px] 2xl:w-[340px] flex flex-col gap-2.5 sm:gap-3 2xl:gap-4 select-none shrink-0">
            {/* Card 1: Pembina TERAMEDIA (Shifted right) */}
            <div className="w-full max-w-[245px] sm:max-w-[260px] lg:max-w-[245px] xl:w-[265px] 2xl:w-[290px] self-center lg:self-end bg-white text-slate-900 rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 2xl:py-3.5 flex items-center gap-3 shadow-xl border border-gray-100 transition-all duration-300">
              {activePembina.avatarUrl ? (
                <img
                  src={activePembina.avatarUrl}
                  alt={activePembina.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                  {activePembina.name ? activePembina.name.charAt(0) : 'P'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-[13px] xl:text-sm 2xl:text-[15px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                  {activePembina.name}
                </p>
                <p className="text-[10px] sm:text-[11px] xl:text-xs 2xl:text-[13px] text-gray-500 font-medium truncate">
                  {activePembina.title}
                </p>
              </div>
            </div>

            {/* Card 2: Ketua Umum TERAMEDIA (Slightly shifted) */}
            <div className="w-full max-w-[240px] sm:max-w-[255px] lg:max-w-[240px] xl:w-[260px] 2xl:w-[285px] self-center lg:self-end lg:mr-2 xl:mr-4 bg-white text-slate-900 rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 2xl:py-3.5 flex items-center gap-3 shadow-xl border border-gray-100 transition-all duration-300">
              {activeKetum.avatarUrl ? (
                <img
                  src={activeKetum.avatarUrl}
                  alt={activeKetum.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                  {activeKetum.name ? activeKetum.name.charAt(0) : 'K'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-[13px] xl:text-sm 2xl:text-[15px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                  {activeKetum.name}
                </p>
                <p className="text-[10px] sm:text-[11px] xl:text-xs 2xl:text-[13px] text-gray-600 font-medium leading-tight truncate">
                  {activeKetum.title} <br />
                  <span className="text-[9px] sm:text-[10px] xl:text-[11px] 2xl:text-xs text-gray-400">
                    {activeKetum.period}
                  </span>
                </p>
              </div>
            </div>

            {/* Card 3: Jumlah Kader Metric Card */}
            <div className="w-full bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 xl:p-6 2xl:p-7 shadow-xl border border-gray-100 relative">
              {/* Card Header with Clapping Hands */}
              <div className="flex justify-between items-start mb-1.5 sm:mb-2">
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
                <div className="relative text-base sm:text-lg xl:text-xl 2xl:text-2xl select-none leading-none pt-0.5">
                  <span role="img" aria-label="clapping hands">
                    👏
                  </span>
                  <span className="absolute -top-1.5 -right-1 text-[8px] 2xl:text-[10px] text-gray-400 font-bold">
                    \ | /
                  </span>
                </div>
              </div>

              {/* Metric Value */}
              <div className="my-1.5 sm:my-2 xl:my-2.5">
                <span className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-[#1d4ed8] tracking-tight">
                  352 ++
                </span>
                <p className="text-[10px] sm:text-[11px] xl:text-xs 2xl:text-sm text-gray-400 font-normal mt-0.5">
                  mahasiswa/mahasiswi
                </p>
              </div>

              {/* Card Footer: Kontak Kami + Astrolabe / Orbital Compass Icon */}
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                <button
                  onClick={onOpenContact}
                  className="text-[11px] sm:text-xs xl:text-[13px] 2xl:text-sm font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Kontak Kami</span>
                  <ArrowRight size={13} strokeWidth={2.2} />
                </button>

                {/* Circular Astrolabe / Compass Rose Icon Badge */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 rounded-full bg-blue-50/70 border border-blue-200/70 flex items-center justify-center text-[#1e3a8a] shadow-xs">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5"
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
          BOTTOM COPYRIGHT: Left-aligned on desktop, centered on mobile/tablet
          ========================================================================= */}
      <div className="w-full max-w-[1020px] xl:max-w-[1180px] 2xl:max-w-[1340px] text-center lg:text-left mt-6 sm:mt-8 z-20 pointer-events-none px-4 sm:px-6 pb-2 sm:pb-4">
        <p className="text-[11px] xl:text-xs text-slate-400 font-normal">Copyright TERAMEDIA 2026</p>
      </div>
    </section>
  );
};

export default Hero;

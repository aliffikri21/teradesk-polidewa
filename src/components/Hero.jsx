import React, { useState, useEffect } from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';

const Hero = ({ onOpenContact, onNavigateToPortal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

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
    <section id="beranda" className="w-full relative bg-[#060D25] text-white flex flex-col items-center px-4 sm:px-6 md:px-12 pt-28 sm:pt-32 pb-12 overflow-hidden">
      {/* Floating Glassmorphism Sticky Navbar */}
      <nav
        className={`fixed top-3 sm:top-5 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-6xl z-50 transition-all duration-300 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center ${
          isScrolled
            ? 'bg-[#060D25]/55 backdrop-blur-md border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.4)]'
            : 'bg-[#060D25]/35 sm:bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
        }`}
      >
        {/* Brand Logo */}
        <a href="#beranda" className="flex items-center gap-3 group">
          <img
            src="/logo-teramedia.png"
            alt="Logo TERAMEDIA"
            className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0"
          />
          <span className="text-lg font-semibold tracking-wide text-white">
            TeraDesk
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#beranda"
            className={`pb-0.5 transition-all ${
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
            className={`pb-0.5 transition-all ${
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

      {/* Hero Header Section */}
      <div className="w-full max-w-4xl text-center mt-12 mb-10 flex flex-col items-center z-10">
        {/* Top Capsule Badge */}
        <div className="bg-white/10 border border-white/20 text-gray-300 text-xs px-4 py-1 rounded-full mb-6 font-medium inline-flex items-center">
          TERAMEDIA Prototype
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 tracking-tight text-white">
          Kelola Organisasi Lebih Mudah <br />
          dalam <span className="italic underline decoration-2 underline-offset-8">Satu Platform</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 max-w-2xl text-xs sm:text-sm md:text-base mb-8 leading-relaxed font-normal">
          Kelola program kerja, proses persetujuan, dan administrasi organisasi dalam satu platform yang terintegrasi dan efisien.
        </p>

        {/* CTA Button with Arrow in white circle */}
        <button
          onClick={() => onNavigateToPortal && onNavigateToPortal()}
          className="bg-[#FFA000] hover:bg-[#ffaa1a] text-slate-950 pl-7 pr-3 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-3 min-h-[44px]"
        >
          <span>Jelajahi Lebih Banyak Fitur</span>
          <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-950 shadow-sm shrink-0">
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {/* Dashboard Preview Widgets Container */}
      <div className="relative w-full max-w-5xl lg:h-[440px] mt-4 mb-16 z-10">
        {/* Responsive Layout for Screens */}
        <div className="flex flex-col lg:block items-center gap-6 w-full">

          {/* Left Dark Card */}
          <div className="w-full max-w-[320px] lg:max-w-none lg:w-[280px] lg:absolute lg:left-0 lg:top-14 bg-[#0d1633] rounded-2xl p-5 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-md text-xs mb-5 font-medium text-gray-200">
              <Bookmark size={14} className="text-amber-400" />
              <span>Update Program Kerja</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">
              update terakhir
            </p>
            <p className="text-xs sm:text-sm font-medium mb-6 leading-snug text-white">
              Workshop Desain Grafis dengan Audiens Siswa/Siswi SMK Negeri 1 Palopo
            </p>
            <button
              onClick={() => onNavigateToPortal && onNavigateToPortal('par')}
              className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-colors font-medium cursor-pointer"
            >
              <span>cek asesmen program kerja</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Center Main Card */}
          <div className="w-full max-w-[390px] lg:w-[390px] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-gray-100">
            <div className="text-center text-xs font-medium text-gray-500 mb-3">
              <span className="bg-gray-100/90 text-gray-600 px-3.5 py-1 rounded-full border border-gray-200/80 text-[11px] font-medium inline-block">
                Arsip Administrasi
              </span>
            </div>
            <h3 className="text-2xl font-bold leading-tight mb-5 text-slate-900 text-center">
              Kelola Organisasi - <br />
              Dengan <span className="italic font-bold">Mudah</span>
            </h3>

            <div className="flex justify-between items-center mb-5 px-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-[3px] border-blue-900 flex items-center justify-center text-xs font-bold text-blue-950 bg-blue-50/50">
                  89%
                </div>
                <div className="text-xs sm:text-sm font-bold leading-tight text-slate-800">
                  Proker Telah <br /> Terlaksana 🔥
                </div>
              </div>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200/80">
                Periode 2025
              </span>
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
          <div className="w-full max-w-[320px] lg:max-w-none lg:w-[290px] lg:absolute lg:right-0 lg:top-6 flex flex-col gap-3.5">
            {/* Profile Card 1 - Pembina */}
            <div className="bg-white text-slate-900 rounded-2xl p-3 flex items-center gap-3.5 shadow-xl border border-gray-100">
              <div className="w-11 h-11 bg-slate-900 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-gray-200">
                <img src="/images/pembina.jpg" alt="M. Ishak" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900">
                  M. Ishak, S.Kom., M.Kom.
                </p>
                <p className="text-[11px] text-gray-500 font-medium">Pembina TERAMEDIA</p>
              </div>
            </div>

            {/* Profile Card 2 - Ketua Umum */}
            <div className="bg-white text-slate-900 rounded-2xl p-3 flex items-center gap-3.5 shadow-xl border border-gray-100">
              <div className="w-11 h-11 bg-slate-900 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-gray-200">
                <img src="/images/ketua.jpg" alt="Muhammad Toha" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900">
                  Muhammad Toha
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Ketua Umum TERAMEDIA<br />
                  <span className="text-[10px] text-gray-400">Periode 2025-2026</span>
                </p>
              </div>
            </div>

            {/* Metric Card 3 - Jumlah Kader */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-xl border border-gray-100 relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    Jumlah Kader Menggunakan TeraDesk
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Update Terkini
                  </p>
                </div>
                <span className="text-lg leading-none" role="img" aria-label="clapping hands">
                  👏
                </span>
              </div>

              <div className="my-3">
                <span className="text-3xl font-extrabold text-[#1d4ed8] tracking-tight">
                  352 ++
                </span>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  mahasiswa/mahasiswi
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={onOpenContact}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Kontak Kami</span>
                  <ArrowRight size={12} />
                </button>
                <div className="w-7 h-7 rounded-full bg-blue-50/80 border border-blue-200/80 flex items-center justify-center p-0.5 overflow-hidden shadow-xs">
                  <img
                    src="/logo-teramedia.png"
                    alt="Logo TERAMEDIA"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Hero Copyright on left */}
      <div className="w-full max-w-6xl text-left mt-auto pt-4 pb-2 z-10 px-2 sm:px-0">
        <p className="text-xs text-gray-400 font-medium">Copyright TERAMEDIA 2026</p>
      </div>
    </section>
  );
};

export default Hero;

import React, { useState } from 'react';

const Footer = ({ onNavigateToPortal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#121318] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-14">
          {/* Left Column (Brand) */}
          <div className="md:col-span-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full border border-blue-400/50 flex items-center justify-center bg-blue-950/60">
                <span className="text-white text-xs">⚛</span>
              </div>
              <span className="text-lg font-bold tracking-wide">TeraDesk</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-4">
              Platform efisiensi & integrasi kerja organisasi modern: PAR, Digitalisasi Arsip, dan Inventaris Aset.
            </p>
            {onNavigateToPortal && (
              <button
                onClick={onNavigateToPortal}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center w-fit cursor-pointer"
              >
                Buka Portal Fitur Organisasi
              </button>
            )}
          </div>

          {/* Center Column (Subscribe) */}
          <div className="md:col-span-5 flex flex-col">
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">
              Dapatkan informasi pembaruan sistem dan jadwal agenda kegiatan organisasi secara berkala.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email pengurus"
                className="flex-1 bg-white text-slate-900 placeholder-gray-400 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-100 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                {subscribed ? 'Terdaftar' : 'Langganan'}
              </button>
            </form>
          </div>

          {/* Right Column (Socials & Call us) */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-300 block mb-2">Saluran Resmi</span>
              <div className="flex items-center gap-4 text-gray-400">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Instagram Resmi TERAMEDIA"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-300 block mb-1">Sekretariat</span>
              <p className="text-xs text-gray-400 font-mono tracking-wide">
                +62 822-9106-4885
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Divider & Copyright */}
        <div className="pt-6 border-t border-white/10 text-left">
          <p className="text-xs text-gray-500 font-medium">
            © 2026 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

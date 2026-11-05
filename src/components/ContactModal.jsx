import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, Mail, User, MessageSquare } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulated success reset
    }, 2000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', organization: '', message: '' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] text-slate-900 animate-in zoom-in-95 duration-200 select-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Corner Accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50/80 rounded-bl-full pointer-events-none -z-0" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Tutup form kontak"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="text-center py-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Pesan Anda Terkirim!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              Terima kasih telah menghubungi TERAMEDIA. Tim kami akan segera menindaklanjuti permintaan konsultasi atau demo platform untuk organisasi Anda.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Tutup Jendela
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="mb-6">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                Konsultasi & Integrasi
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Kontak Kami</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Diskusikan kebutuhan manajemen organisasi Anda dengan tim pengembang TeraDesk.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Muhammad Toha"
                    className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Email Aktif
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Nama Organisasi / Lembaga
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Contoh: TERAMEDIA / BEM Universitas"
                    className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Pesan atau Kebutuhan Khusus
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ceritakan gambaran sistem atau fitur yang dibutuhkan..."
                    className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer min-h-[46px] mt-2"
              >
                <Send size={15} />
                <span>Kirimkan Permintaan</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;

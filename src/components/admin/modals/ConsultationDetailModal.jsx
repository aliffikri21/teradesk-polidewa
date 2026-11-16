import React from 'react';
import { X, Phone, MessageSquare, Trash2, Mail } from 'lucide-react';

/**
 * ConsultationDetailModal - Modal Detail & Tindak Lanjut Pesan Konsultasi
 * Ditampilkan di Admin Dashboard saat admin mengklik pesan di Kotak Masuk Konsultasi.
 */
export default function ConsultationDetailModal({
  selectedMessage,
  onClose,
  onUpdateConsultationStatus,
  onDeleteConsultation,
  setSelectedMessage,
}) {
  if (!selectedMessage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-slate-900 select-none max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-20"
          title="Tutup detail pesan"
          aria-label="Tutup detail pesan"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {selectedMessage.id}
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                selectedMessage.status === 'Baru'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : selectedMessage.status === 'Diproses'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {selectedMessage.status}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Detail Pesan Konsultasi</h3>
          <p className="text-xs text-slate-500 mt-0.5">Diterima pada {selectedMessage.date}</p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs mb-5">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Nama Pengirim</span>
            <span className="font-bold text-slate-900">{selectedMessage.name}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Email Aktif</span>
            <a
              href={`mailto:${selectedMessage.email}`}
              className="font-bold text-blue-600 hover:underline break-all"
            >
              {selectedMessage.email}
            </a>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Nomor WhatsApp / HP</span>
            {selectedMessage.phone && selectedMessage.phone !== '-' ? (
              <a
                href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                  `Halo ${selectedMessage.name}, kami dari Tim Pengembang TERAMEDIA menanggapi permohonan konsultasi TeraDesk Anda.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-600 hover:underline inline-flex items-center gap-1.5"
              >
                <Phone size={12} />
                <span>{selectedMessage.phone}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-normal">Chat WA</span>
              </a>
            ) : (
              <span className="text-slate-400 font-medium">-</span>
            )}
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Organisasi / Lembaga</span>
            <span className="font-bold text-slate-800">{selectedMessage.organization}</span>
          </div>
        </div>

        {/* Message Body */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-blue-600" />
            <span>Isi Pesan / Kebutuhan Khusus</span>
          </h4>
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
            {selectedMessage.message}
          </div>
        </div>

        {/* Status Changer */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Ubah Status Tindak Lanjut:
          </label>
          <div className="flex flex-wrap gap-2">
            {['Baru', 'Diproses', 'Selesai'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  if (onUpdateConsultationStatus) {
                    onUpdateConsultationStatus(selectedMessage.id, st);
                  }
                  setSelectedMessage((prev) => (prev ? { ...prev, status: st, isRead: true } : null));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMessage.status === st
                    ? st === 'Baru'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : st === 'Diproses'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Hapus pesan ini dari arsip kotak masuk?')) {
                if (onDeleteConsultation) {
                  onDeleteConsultation(selectedMessage.id);
                }
                setSelectedMessage(null);
              }
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 py-2 px-3 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>Hapus Pesan</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {selectedMessage.phone && selectedMessage.phone !== '-' && (
              <a
                href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                  `Halo ${selectedMessage.name}, kami dari Tim Pengembang TERAMEDIA menanggapi permohonan konsultasi TeraDesk dari ${selectedMessage.organization}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Phone size={14} />
                <span>Chat WhatsApp</span>
              </a>
            )}
            <a
              href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                'Tanggapan Konsultasi TeraDesk - ' + selectedMessage.organization
              )}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Mail size={14} />
              <span>Balas via Email</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

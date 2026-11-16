import React from 'react';
import { X, Copy, Trash2 } from 'lucide-react';

/**
 * TicketDetailModal - Modal Detail Pesanan Tiket Desain Pubdok
 * Ditampilkan di Admin Dashboard saat admin mengklik tiket pubdok.
 */
export default function TicketDetailModal({
  selectedPubdokTicket,
  onClose,
  onDeleteTicket,
  handleToggleTicketStatus,
  setSelectedPubdokTicket,
}) {
  if (!selectedPubdokTicket) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                {selectedPubdokTicket.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                {selectedPubdokTicket.category || selectedPubdokTicket.canvas}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  selectedPubdokTicket.statusColor || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {selectedPubdokTicket.status}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {selectedPubdokTicket.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer z-20"
            title="Tutup Modal"
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
          {/* Info Pemohon (Siapa yang Mengajukan) */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
              Identitas Pemohon Desain
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Pemohon / PIC:</span>
                <span className="font-bold text-slate-900">{selectedPubdokTicket.requester || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Divisi / Asal Organisasi:</span>
                <span className="font-bold text-slate-900">{selectedPubdokTicket.division || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Waktu Pengajuan:</span>
                <span className="font-mono text-slate-700">
                  {selectedPubdokTicket.createdAt ? String(selectedPubdokTicket.createdAt).slice(0, 10) : 'Tercatat di sistem'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Target Selesai (Deadline):</span>
                <span className="font-bold text-rose-600">
                  {selectedPubdokTicket.deadline || selectedPubdokTicket.targetDate || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Pesanan & Brief */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Rincian Pesanan & Brief Pengerjaan
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px] mb-0.5">Format / Dimensi Kanvas:</span>
                <span className="font-semibold text-slate-800">
                  {selectedPubdokTicket.canvas || selectedPubdokTicket.category}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px] mb-0.5">
                  Desainer Bertanggung Jawab (PIC Pubdok):
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedPubdokTicket.designer || selectedPubdokTicket.assignedTo || 'Tim Pubdok'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] font-medium mb-1.5">
                Instruksi Khusus & Uraian Brief:
              </span>
              <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-200/60">
                {selectedPubdokTicket.brief && selectedPubdokTicket.brief !== '-'
                  ? selectedPubdokTicket.brief
                  : 'Tidak ada catatan brief khusus yang disertakan.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                const textToCopy = `[Tiket ${selectedPubdokTicket.id}] ${selectedPubdokTicket.title}\nPengaju: ${selectedPubdokTicket.requester} (${selectedPubdokTicket.division})\nDeadline: ${selectedPubdokTicket.deadline || selectedPubdokTicket.targetDate}\nBrief: ${selectedPubdokTicket.brief}`;
                navigator.clipboard?.writeText(textToCopy);
                alert(`Detail tiket ${selectedPubdokTicket.id} berhasil disalin ke clipboard!`);
              }}
              className="flex-1 sm:flex-initial px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy size={13} />
              <span>Salin Info</span>
            </button>
            {onDeleteTicket && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Hapus tiket ${selectedPubdokTicket.id}?`)) {
                    onDeleteTicket(selectedPubdokTicket.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Hapus</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {(selectedPubdokTicket.status === 'Antrean' || selectedPubdokTicket.status === 'Diajukan') && (
              <button
                type="button"
                onClick={() => {
                  handleToggleTicketStatus(selectedPubdokTicket.id, 'Dikerjakan');
                  setSelectedPubdokTicket((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: 'Dikerjakan',
                          statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
                        }
                      : null
                  );
                }}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Mulai Kerjakan
              </button>
            )}
            {(selectedPubdokTicket.status === 'Dikerjakan' || selectedPubdokTicket.status === 'Sedang Dikerjakan') && (
              <button
                type="button"
                onClick={() => {
                  handleToggleTicketStatus(selectedPubdokTicket.id, 'Selesai');
                  setSelectedPubdokTicket((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: 'Selesai',
                          statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        }
                      : null
                  );
                }}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Tandai Selesai
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

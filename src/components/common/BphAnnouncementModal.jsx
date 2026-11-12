import React, { useState } from 'react';
import {
  Megaphone,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pin,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const BphAnnouncementModal = ({
  isOpen,
  onClose,
  announcements = [],
  initialIndex = 0,
  onNavigateToService,
}) => {
  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const [prevInitial, setPrevInitial] = useState(initialIndex);

  if (prevInitial !== initialIndex) {
    setPrevInitial(initialIndex);
    setInternalIndex(initialIndex);
  }

  if (!isOpen || !announcements || announcements.length === 0) {
    return null;
  }

  const safeIndex =
    internalIndex >= 0 && internalIndex < announcements.length ? internalIndex : 0;
  const currentAnn = announcements[safeIndex] || announcements[0];
  const hasMultiple = announcements.length > 1;

  const handlePrev = () => {
    setInternalIndex((prev) => (prev > 0 ? prev - 1 : announcements.length - 1));
  };

  const handleNext = () => {
    setInternalIndex((prev) => (prev < announcements.length - 1 ? prev + 1 : 0));
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs animate-pulse">
            <AlertTriangle size={12} className="text-rose-500" />
            <span>Mendesak & Wajib</span>
          </span>
        );
      case 'important':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <Info size={12} className="text-amber-600" />
            <span>Penting</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            <Info size={12} className="text-blue-600" />
            <span>Informasi Resmi</span>
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[86vh] overflow-hidden animate-in zoom-in-95 duration-200 relative text-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bph-announcement-title"
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-3.5 sm:p-6 pb-2.5 sm:pb-4 border-b border-slate-100 flex items-start justify-between gap-2.5 sm:gap-3 bg-white shrink-0">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/20 mt-0.5">
              <Megaphone size={16} className="sm:hidden text-white" />
              <Megaphone size={20} className="hidden sm:block text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-blue-100">
                  Maklumat BPH
                </span>
                {getPriorityBadge(currentAnn.priority)}
                {currentAnn.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-md">
                    <Pin size={10} className="text-amber-500 fill-amber-500" />
                    <span>Disematkan</span>
                  </span>
                )}
              </div>
              <h2
                id="bph-announcement-title"
                className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 leading-snug tracking-tight break-words"
              >
                {currentAnn.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0 -mr-1 sm:mr-0"
            title="Tutup Maklumat (Esc)"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 text-xs sm:text-sm flex-1 overscroll-contain">
          {/* Metadata Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/70 text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar size={13} className="text-blue-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Tanggal</span>
                <span className="font-bold text-slate-800 truncate block">{currentAnn.date || '12 Nov 2026'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Clock size={13} className="text-indigo-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Waktu</span>
                <span className="font-bold text-slate-800 truncate block">{currentAnn.time || 'WITA'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <User size={13} className="text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Oleh</span>
                <span className="font-bold text-slate-800 truncate block" title={currentAnn.authorName || currentAnn.author}>
                  {currentAnn.authorName || currentAnn.author || 'BPH'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Building2 size={13} className="text-amber-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Audiens</span>
                <span className="font-bold text-slate-800 truncate block">{currentAnn.targetAudience || 'Semua Anggota'}</span>
              </div>
            </div>
          </div>

          {/* Location Badge (if applicable) */}
          {currentAnn.location && (
            <div className="flex items-start sm:items-center gap-2 px-3 py-2 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-800 text-[11px] sm:text-xs">
              <MapPin size={13} className="text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
              <span className="font-medium leading-tight break-words min-w-0">
                <strong>Tempat / Media:</strong> {currentAnn.location}
              </span>
            </div>
          )}

          {/* Announcement Content Box */}
          <div className="bg-slate-50/50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 leading-relaxed text-slate-700 whitespace-pre-line text-xs sm:text-[13px] font-normal shadow-2xs break-words [overflow-wrap:anywhere]">
            {currentAnn.content}
          </div>

          {/* Verification Footnote */}
          <div className="flex items-start sm:items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-tight">Maklumat resmi diautentikasi oleh Badan Pengurus Harian (BPH) TERAMEDIA.</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:p-5 pt-2.5 sm:pt-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          {/* Carousel / Navigation Controls (if multiple active announcements) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {hasMultiple ? (
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Pengumuman Sebelumnya"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-xs font-mono font-bold text-slate-500 px-2 select-none">
                  {safeIndex + 1} dari {announcements.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Pengumuman Selanjutnya"
                  aria-label="Selanjutnya"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            ) : (
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                Status: <strong className="text-emerald-600 font-bold">Sedang Tayang</strong>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {currentAnn.actionServiceId && onNavigateToService && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToService(currentAnn.actionServiceId);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
              >
                <span>{currentAnn.actionText || 'Buka Modul Terkait'}</span>
                <ArrowRight size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Saya Mengerti & Siap Laksanakan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BphAnnouncementModal;

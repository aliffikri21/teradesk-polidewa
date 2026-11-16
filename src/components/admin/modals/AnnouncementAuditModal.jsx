import React from 'react';
import {
  CheckCheck,
  X,
  Users,
  CheckCircle2,
  Clock,
  Check,
  Copy,
  FileSpreadsheet,
  Search,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

/**
 * AnnouncementAuditModal - Modal Audit Keterbacaan & Read Receipts Maklumat BPH
 * Memantau kepatuhan seluruh anggota terhadap pengumuman resmi yang diterbitkan.
 */
export default function AnnouncementAuditModal({
  auditAnnouncement,
  onClose,
  auditData,
  handleCopyUnreadReminder,
  auditCopied,
  handleExportAuditXLSX,
  auditSearchQuery,
  setAuditSearchQuery,
  auditStatusFilter,
  setAuditStatusFilter,
  auditDivisionFilter,
  setAuditDivisionFilter,
  OFFICIAL_DIVISIONS = [],
  filteredAuditMembers = [],
  handleReopenAnn,
  handleCompleteAnn,
  setAuditAnnouncement,
}) {
  if (!auditAnnouncement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full border border-slate-100 shadow-2xl p-5 sm:p-7 relative my-8 animate-in zoom-in-95 duration-150 text-slate-800 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-3 shrink-0 pt-1">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs shadow-indigo-500/20 mt-0.5">
              <CheckCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  Audit Keterbacaan BPH
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {auditAnnouncement.category || 'Maklumat'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    auditAnnouncement.priority === 'urgent'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : auditAnnouncement.priority === 'important'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {auditAnnouncement.priority === 'urgent'
                    ? 'Mendesak & Wajib'
                    : auditAnnouncement.priority === 'important'
                    ? 'Penting'
                    : 'Informasi'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {auditAnnouncement.date} ({auditAnnouncement.time})
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                {auditAnnouncement.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Memantau kepatuhan dan presensi konfirmasi seluruh anggota terhadap maklumat resmi yang diterbitkan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Tutup Audit"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 shrink-0">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold">Total Pengurus Terdaftar</span>
              <Users size={15} className="text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {auditData.total}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Seluruh akun aktif di database</p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
            <div className="flex items-center justify-between text-emerald-700 text-xs mb-1">
              <span className="font-semibold">Sudah Konfirmasi</span>
              <CheckCircle2 size={15} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 flex items-baseline gap-2">
              <span>{auditData.read}</span>
              <span className="text-xs font-bold text-emerald-600">({auditData.percentage}%)</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(auditData.percentage, auditData.read > 0 ? 5 : 0)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
              <span className="font-semibold">Belum Membaca</span>
              <Clock size={15} className="text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 flex items-baseline gap-2">
              <span>{auditData.unread}</span>
              <span className="text-xs font-bold text-amber-600">
                ({auditData.total > 0 ? 100 - auditData.percentage : 0}%)
              </span>
            </div>
            <p className="text-[10px] text-amber-700 mt-0.5">Perlu tindak lanjut / pengingat</p>
          </div>
        </div>

        {/* Action Bar (Copy WA Reminder + Export XLSX) & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-3 shrink-0">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyUnreadReminder}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                auditCopied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
              title="Salin template teks pengingat untuk di-paste langsung ke grup WhatsApp"
            >
              {auditCopied ? <Check size={14} /> : <Copy size={14} />}
              <span>
                {auditCopied
                  ? 'Tersalin untuk WhatsApp!'
                  : `Salin Pesan WA (${auditData.unread} Orang)`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportAuditXLSX}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
              title="Ekspor laporan audit keterbacaan ke Excel (.xlsx)"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Unduh Rekap Excel</span>
            </button>
          </div>

          {/* Search Member input */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={auditSearchQuery}
              onChange={(e) => setAuditSearchQuery(e.target.value)}
              placeholder="Cari nama, NIM, atau divisi..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs & Division Select */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              type="button"
              onClick={() => setAuditStatusFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                auditStatusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({auditData.total})
            </button>
            <button
              type="button"
              onClick={() => setAuditStatusFilter('read')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                auditStatusFilter === 'read'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Sudah Konfirmasi ({auditData.read})</span>
            </button>
            <button
              type="button"
              onClick={() => setAuditStatusFilter('unread')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                auditStatusFilter === 'unread'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Belum Membaca ({auditData.unread})</span>
            </button>
          </div>

          <select
            value={auditDivisionFilter}
            onChange={(e) => setAuditDivisionFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">Semua Divisi UKM</option>
            {OFFICIAL_DIVISIONS.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        {/* Member List (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-3 divide-y divide-slate-100">
          {filteredAuditMembers.map((member) => (
            <div
              key={member.nim}
              className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 p-2 rounded-xl transition-colors"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    member.isRead
                      ? 'bg-emerald-600 text-white shadow-2xs shadow-emerald-500/20'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                    <span className="text-[10px] font-mono text-slate-400">{member.nim}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.2 rounded-md truncate max-w-[150px] sm:max-w-none">
                      {member.division}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded-md border border-blue-100">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Confirmation Status */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {member.isRead ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>Dikonfirmasi</span>
                    </span>
                    {member.readAt && (
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {new Date(member.readAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WITA
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                    <Clock size={12} className="text-amber-600" />
                    <span>Belum Konfirmasi</span>
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredAuditMembers.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Users size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">
                Tidak ada anggota pengurus yang cocok
              </p>
              <p className="text-[11px] text-slate-400">
                Coba sesuaikan kata kunci pencarian atau ganti filter status di atas.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>
              Audit ini diverifikasi secara otomatis saat anggota menekan persetujuan di pop-up modal.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {auditAnnouncement.isCompleted ? (
              <button
                type="button"
                onClick={() => {
                  handleReopenAnn(auditAnnouncement.id, auditAnnouncement.title);
                  setAuditAnnouncement((prev) =>
                    prev ? { ...prev, isCompleted: false, isActive: true } : null
                  );
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
                title="Aktifkan kembali maklumat ini"
              >
                <RotateCcw size={13} />
                <span>Buka Kembali</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleCompleteAnn(auditAnnouncement.id, auditAnnouncement.title);
                  setAuditAnnouncement((prev) =>
                    prev ? { ...prev, isCompleted: true, isActive: false } : null
                  );
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                title="Selesaikan pengumuman ini agar pop-up tidak muncul lagi di semua anggota"
              >
                <CheckCircle2 size={13} />
                <span>Selesaikan Pengumuman</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

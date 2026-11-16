import React from 'react';
import { Bookmark, X } from 'lucide-react';

/**
 * ProkerModal - Modal Tambah & Edit Program Kerja
 * Ditampilkan di Admin Dashboard untuk mengelola tumpukan kartu Hero & daftar proker.
 */
export default function ProkerModal({
  isOpen,
  onClose,
  prokerModalMode,
  prokerFormTitle,
  setProkerFormTitle,
  prokerFormBadge,
  setProkerFormBadge,
  prokerFormTag,
  setProkerFormTag,
  prokerFormActionText,
  setProkerFormActionText,
  prokerFormServiceId,
  setProkerFormServiceId,
  prokerFormDivision,
  setProkerFormDivision,
  prokerFormPeriod,
  setProkerFormPeriod,
  prokerFormStatus,
  setProkerFormStatus,
  prokerFormIsVisible,
  setProkerFormIsVisible,
  prokerFormError,
  prokerFormSuccess,
  handleSaveProker,
  divisionsList = [],
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Bookmark size={15} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {prokerModalMode === 'add' ? 'Tambah Program Kerja Baru' : 'Edit Program Kerja'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Kartu ini akan ditampilkan pada tumpukan hero landing page.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-20"
            title="Tutup Modal"
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveProker} className="space-y-4">
          {/* Judul Kegiatan */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Judul Kegiatan / Nama Program Kerja <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={prokerFormTitle}
              onChange={(e) => setProkerFormTitle(e.target.value)}
              placeholder="Contoh: Workshop Desain Grafis dengan Audiens Siswa/Siswi SMK Negeri 1 Palopo"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none italic"
              required
            />
          </div>

          {/* Grid 2 Cols: Badge & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Badge Kartu
              </label>
              <input
                type="text"
                value={prokerFormBadge}
                onChange={(e) => setProkerFormBadge(e.target.value)}
                placeholder="Contoh: Update Program Kerja"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Label Subtitle / Tag
              </label>
              <input
                type="text"
                value={prokerFormTag}
                onChange={(e) => setProkerFormTag(e.target.value)}
                placeholder="Contoh: update terakhir"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium lowercase focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Grid 2 Cols: Tombol Aksi & Target Layanan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Teks Tombol Aksi
              </label>
              <input
                type="text"
                value={prokerFormActionText}
                onChange={(e) => setProkerFormActionText(e.target.value)}
                placeholder="Contoh: cek asesmen program kerja"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium lowercase focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Target Modul Layanan
              </label>
              <select
                value={prokerFormServiceId}
                onChange={(e) => setProkerFormServiceId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="par">PAR (Program Approval Request)</option>
                <option value="archive">Digitalisasi E-Arsip & Persuratan</option>
                <option value="asset">Digitalisasi Aset & Inventaris</option>
                <option value="finance">Kas & Reimbursement Anggaran</option>
                <option value="attendance">Presensi Digital & Notula Rapat</option>
                <option value="timeline">Master Timeline & Kalender Proker</option>
                <option value="hr">Database Anggota & Kaderisasi</option>
                <option value="helpdesk">Tiket Desain Pubdok</option>
                <option value="humas">Humas & Media Partner Gateway</option>
                <option value="kkm">Kreativitas & Kewirausahaan (KKM)</option>
              </select>
            </div>
          </div>

          {/* Grid 3 Cols: Divisi, Periode, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Divisi Pelaksana
              </label>
              <select
                value={prokerFormDivision}
                onChange={(e) => setProkerFormDivision(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                {divisionsList
                  .filter((d) => d !== 'Semua Divisi')
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Periode Kegiatan
              </label>
              <input
                type="text"
                value={prokerFormPeriod}
                onChange={(e) => setProkerFormPeriod(e.target.value)}
                placeholder="Contoh: Maret 2026"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={prokerFormStatus}
                onChange={(e) => setProkerFormStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Aktif">Aktif</option>
                <option value="Akan Datang">Akan Datang</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Review">Review</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Tampilkan di Hero Landing Page Checkbox Toggle */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Tampilkan di Hero Landing Page
              </span>
              <span className="text-[11px] text-slate-500">
                Kartu akan ikut dalam tumpukan kartu yang saling overlapping di landing page.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setProkerFormIsVisible(!prokerFormIsVisible)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                prokerFormIsVisible ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  prokerFormIsVisible ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {prokerFormError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {prokerFormError}
            </div>
          )}

          {prokerFormSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
              {prokerFormSuccess}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {prokerModalMode === 'add' ? 'Tambah Program Kerja' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

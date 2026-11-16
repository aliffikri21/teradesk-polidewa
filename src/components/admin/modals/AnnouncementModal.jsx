import React from 'react';
import { Megaphone, X, Check } from 'lucide-react';

/**
 * AnnouncementModal - Modal Tambah & Edit Maklumat / Pengumuman BPH
 * Ditampilkan di Admin Dashboard untuk menerbitkan pengumuman resmi ke seluruh anggota.
 */
export default function AnnouncementModal({
  isOpen,
  onClose,
  editingAnnId,
  annFormTitle,
  setAnnFormTitle,
  annFormCategory,
  setAnnFormCategory,
  annFormPriority,
  setAnnFormPriority,
  annFormDate,
  setAnnFormDate,
  annFormTime,
  setAnnFormTime,
  annFormLocation,
  setAnnFormLocation,
  annFormTarget,
  setAnnFormTarget,
  annFormActionServiceId,
  setAnnFormActionServiceId,
  annFormActionText,
  setAnnFormActionText,
  annFormContent,
  setAnnFormContent,
  annFormIsActive,
  setAnnFormIsActive,
  annFormIsPinned,
  setAnnFormIsPinned,
  annFormIsCompleted,
  setAnnFormIsCompleted,
  handleSaveAnn,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-2xl p-5 sm:p-7 relative my-8 animate-in zoom-in-95 duration-150 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Megaphone size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {editingAnnId ? 'Edit Maklumat Pengumuman BPH' : 'Buat Maklumat / Pengumuman BPH Baru'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Maklumat aktif otomatis memunculkan pop-up window kepada anggota setelah login di portal atau modul layanan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveAnn} className="space-y-4">
          {/* Judul Pengumuman */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Pengumuman / Maklumat Resmi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={annFormTitle}
              onChange={(e) => setAnnFormTitle(e.target.value)}
              placeholder="Contoh: Pemberitahuan Wajib: Rapat Pleno Evaluasi Kinerja Tengah Periode"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* 2 Kolom: Kategori & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Maklumat
              </label>
              <select
                value={annFormCategory}
                onChange={(e) => setAnnFormCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="Rapat Pleno">Rapat Pleno</option>
                <option value="Instruksi">Instruksi Organisasi</option>
                <option value="Penting">Pemberitahuan Penting</option>
                <option value="Kegiatan">Informasi Kegiatan / Event</option>
                <option value="Informasi">Informasi Umum</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Prioritas
              </label>
              <select
                value={annFormPriority}
                onChange={(e) => setAnnFormPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="urgent">🔴 Mendesak & Wajib (Badge Merah)</option>
                <option value="important">🟡 Penting (Badge Amber)</option>
                <option value="normal">🔵 Informasi Biasa (Badge Biru)</option>
              </select>
            </div>
          </div>

          {/* 2 Kolom: Tanggal & Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Rilis / Pelaksanaan
              </label>
              <input
                type="text"
                value={annFormDate}
                onChange={(e) => setAnnFormDate(e.target.value)}
                placeholder="Contoh: 12 Nov 2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Waktu / Jam
              </label>
              <input
                type="text"
                value={annFormTime}
                onChange={(e) => setAnnFormTime(e.target.value)}
                placeholder="Contoh: 19:30 WITA"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2 Kolom: Lokasi & Target Audiens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tempat / Media Pelaksanaan
              </label>
              <input
                type="text"
                value={annFormLocation}
                onChange={(e) => setAnnFormLocation(e.target.value)}
                placeholder="Contoh: Studio Multimedia Kampus II / Google Meet"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Audiens
              </label>
              <input
                type="text"
                value={annFormTarget}
                onChange={(e) => setAnnFormTarget(e.target.value)}
                placeholder="Contoh: Semua Anggota / Seluruh Divisi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2 Kolom: Tautan Modul & Label Tombol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tautan Cepat ke Modul Layanan (Opsional)
              </label>
              <select
                value={annFormActionServiceId}
                onChange={(e) => setAnnFormActionServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="">Tidak Ada Tautan Modul</option>
                <option value="attendance">Presensi Rapat & Notula</option>
                <option value="par">Persetujuan Program Kerja (PAR)</option>
                <option value="archive">Digitalisasi Arsip & E-Surat</option>
                <option value="asset">Digitalisasi Aset & Inventaris</option>
                <option value="finance">Kas & Reimbursement Anggaran</option>
                <option value="timeline">Master Timeline & Kalender</option>
                <option value="hr">Database SDM & Anggota</option>
                <option value="helpdesk">TeraHelpdesk Desain & Support</option>
                <option value="humas">Humas & Kolaborasi Media</option>
                <option value="kkm">Merchandise & Usaha KKM</option>
                <option value="activity">Arsip Kegiatan & Dokumentasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Label Tombol Modul
              </label>
              <input
                type="text"
                value={annFormActionText}
                onChange={(e) => setAnnFormActionText(e.target.value)}
                placeholder="Contoh: Buka Jadwal Presensi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Isi Pengumuman Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Isi Maklumat / Pengumuman Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={annFormContent}
              onChange={(e) => setAnnFormContent(e.target.value)}
              placeholder="Tuliskan isi maklumat, poin-poin agenda, instruksi kepatuhan, atau arahan BPH secara jelas..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          {/* Checkboxes: Status Tayang, Pin & Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={annFormIsActive && !annFormIsCompleted}
                disabled={annFormIsCompleted}
                onChange={(e) => setAnnFormIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Aktifkan (Tayang)</span>
                <span className="text-[11px] text-slate-500">Muncul sebagai pop-up window setelah login.</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={annFormIsPinned}
                onChange={(e) => setAnnFormIsPinned(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Sematkan di Atas</span>
                <span className="text-[11px] text-slate-500">Prioritas utama dalam urutan pop-up.</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={annFormIsCompleted}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAnnFormIsCompleted(checked);
                  if (checked) setAnnFormIsActive(false);
                }}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-emerald-700 block">Tandai Acara Selesai</span>
                <span className="text-[11px] text-slate-500">Pop-up tidak akan tayang lagi ke anggota.</span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{editingAnnId ? 'Simpan Perubahan Maklumat' : 'Terbitkan Maklumat BPH'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

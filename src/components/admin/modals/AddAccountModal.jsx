import React from 'react';
import { Plus, X, Sparkles, KeyRound, Lock, ShieldCheck } from 'lucide-react';

/**
 * AddAccountModal - Modal Pendaftaran Akun Mahasiswa Baru
 * Ditampilkan di Admin Dashboard untuk menambahkan akun mahasiswa secara individual.
 */
export default function AddAccountModal({
  isOpen,
  onClose,
  onOpenBatchImport,
  handleAddSubmit,
  formNim,
  setFormNim,
  formName,
  setFormName,
  formDivision,
  setFormDivision,
  divisionsList = [],
  formRole,
  setFormRole,
  formPassword,
  setFormPassword,
  handleGenerateRandomPass,
  formCanAccessAdmin,
  setFormCanAccessAdmin,
  formError,
  formSuccess,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Plus size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Daftarkan Akun Mahasiswa
            </h3>
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

        {/* Quick Link to Batch Import */}
        <div className="mb-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-600 shrink-0" />
            <span className="text-xs text-indigo-950 font-medium">
              Mau input banyak akun sekaligus? Gunakan fitur <strong>Import Script</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBatchImport();
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline shrink-0 cursor-pointer"
          >
            Buka Import ↗
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              type="text"
              value={formNim}
              onChange={(e) => setFormNim(e.target.value)}
              placeholder="Contoh: 23404099"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Divisi
              </label>
              <select
                value={formDivision}
                onChange={(e) => setFormDivision(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
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
                Jabatan / Peran
              </label>
              <select
                value={formRole}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormRole(val);
                  if (val === 'Koordinator Divisi' || val.includes('BPH') || val.includes('Ketua')) {
                    setFormCanAccessAdmin(true);
                  } else {
                    setFormCanAccessAdmin(false);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
              >
                <option value="Koordinator Divisi">Koordinator Divisi (Kadiv)</option>
                <option value="Anggota Biasa">Anggota Biasa / Staf</option>
                <option value="BPH (Badan Pengurus Harian)">BPH (Badan Pengurus Harian)</option>
                <option value="Demisioner Ketua Umum">Demisioner Ketua Umum</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Kata Sandi Default
              </label>
              <button
                type="button"
                onClick={handleGenerateRandomPass}
                className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles size={11} />
                <span>Acak Sandi</span>
              </button>
            </div>
            <div className="relative">
              <KeyRound
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Hak Akses Dashboard Admin
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setFormCanAccessAdmin(false)}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !formCanAccessAdmin
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lock size={13} />
                <span>Hanya Portal Layanan</span>
              </button>
              <button
                type="button"
                onClick={() => setFormCanAccessAdmin(true)}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  formCanAccessAdmin
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck size={13} />
                <span>Bisa Akses Admin</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {formCanAccessAdmin
                ? '✓ Mahasiswa ini diizinkan membuka dashboard admin & mengelola data akun.'
                : 'ℹ Mahasiswa ini hanya dapat membuka portal kerja layanan divisi (non-admin).'}
            </p>
          </div>

          {formError && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {formError}
            </p>
          )}

          {formSuccess && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              {formSuccess}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Simpan Mahasiswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

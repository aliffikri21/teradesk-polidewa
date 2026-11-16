import React from 'react';
import { Edit2, X, Sparkles, KeyRound, Eye, EyeOff, Lock, ShieldCheck, Check } from 'lucide-react';

/**
 * EditAccountModal - Modal Edit Data Akun Mahasiswa
 * Memungkinkan pembaruan NIM, nama lengkap, divisi, jabatan, kata sandi, dan hak akses admin.
 */
export default function EditAccountModal({
  isOpen,
  onClose,
  handleEditSubmit,
  editFormNim,
  setEditFormNim,
  editFormName,
  setEditFormName,
  editFormDivision,
  setEditFormDivision,
  divisionsList = [],
  editFormRole,
  setEditFormRole,
  editingTargetNim,
  editFormPassword,
  setEditFormPassword,
  editFormShowPass,
  setEditFormShowPass,
  handleGenerateEditPass,
  editFormCanAccessAdmin,
  setEditFormCanAccessAdmin,
  editFormError,
  editFormSuccess,
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
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Edit2 size={15} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Edit Data Akun Mahasiswa
              </h3>
              <p className="text-[11px] text-slate-500">
                Perbarui NIM, nama lengkap, divisi, jabatan, atau kata sandi.
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

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              type="text"
              value={editFormNim}
              onChange={(e) => setEditFormNim(e.target.value)}
              placeholder="Contoh: 23404053"
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
              value={editFormName}
              onChange={(e) => setEditFormName(e.target.value)}
              placeholder="Contoh: Alif Fikri"
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
                value={editFormDivision}
                onChange={(e) => setEditFormDivision(e.target.value)}
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
                value={editFormRole}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditFormRole(val);
                  if (
                    val === 'Developer' ||
                    val === 'Koordinator Divisi' ||
                    val.includes('BPH') ||
                    val.includes('Ketua')
                  ) {
                    setEditFormCanAccessAdmin(true);
                  } else {
                    setEditFormCanAccessAdmin(false);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 bg-white"
              >
                {editingTargetNim === '23404053' && (
                  <option value="Developer">Developer (Pengembang Sistem)</option>
                )}
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
                Kata Sandi (Password)
              </label>
              <button
                type="button"
                onClick={handleGenerateEditPass}
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
                type={editFormShowPass ? 'text' : 'password'}
                value={editFormPassword}
                onChange={(e) => setEditFormPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => setEditFormShowPass(!editFormShowPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {editFormShowPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hak Akses Dashboard Admin
              </label>
              {editingTargetNim === '23404053' && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Master Admin (Terkunci)
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                disabled={editingTargetNim === '23404053'}
                onClick={() => setEditFormCanAccessAdmin(false)}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  editingTargetNim === '23404053'
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : !editFormCanAccessAdmin
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lock size={13} />
                <span>Hanya Portal Layanan</span>
              </button>
              <button
                type="button"
                onClick={() => setEditFormCanAccessAdmin(true)}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  editFormCanAccessAdmin
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck size={13} />
                <span>Bisa Akses Admin</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {editingTargetNim === '23404053'
                ? 'NIM 23404053 adalah akun Master Admin UKM TERAMEDIA dan hak akses panel admin tidak dapat dinonaktifkan.'
                : editFormCanAccessAdmin
                ? '✓ Akun ini memiliki izin penuh untuk masuk ke Dashboard Admin.'
                : 'ℹ Akun ini dibatasi hanya dapat mengakses portal kerja/layanan divisi.'}
            </p>
          </div>

          {editFormError && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {editFormError}
            </p>
          )}

          {editFormSuccess && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
              <Check size={14} />
              <span>{editFormSuccess}</span>
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

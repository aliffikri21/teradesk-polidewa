import React from 'react';
import {
  Sparkles,
  X,
  Check,
  Upload,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

/**
 * LeadershipModal - Editor Kartu Profil Pimpinan Hero (Landing Page)
 * Memungkinkan admin mengubah nama, jabatan, periode, atau avatar pimpinan organisasi.
 */
export default function LeadershipModal({
  isOpen,
  onClose,
  leadershipForm,
  setLeadershipForm,
  handleSaveLeadership,
  handleResetLeadership,
  handleLeadershipPhotoUpload,
  leadershipSaveSuccess,
  onBackToLanding,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Editor Kartu Profil Pimpinan Hero
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Hero Landing Page
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perubahan nama, jabatan, periode, atau foto akan langsung tampil di kolom kanan Hero landing page.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup Modal"
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left: Authentic Dark Live Preview */}
            <div className="md:col-span-5 bg-[#080b16] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[290px]">
              <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Live Preview Hero
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
              </div>

              <div className="relative z-10 space-y-3 my-auto py-2">
                {/* Card 1: Pembina */}
                <div className="w-full bg-white text-slate-900 rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-xl border border-gray-100 transition-all">
                  {leadershipForm.pembinaAvatarUrl ? (
                    <img
                      src={leadershipForm.pembinaAvatarUrl}
                      alt={leadershipForm.pembinaName || 'Pembina'}
                      className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                      {leadershipForm.pembinaName ? leadershipForm.pembinaName.charAt(0) : 'P'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                      {leadershipForm.pembinaName || 'M. Ishak, S.Kom., M.Kom.'}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium truncate">
                      {leadershipForm.pembinaTitle || 'Pembina TERAMEDIA'}
                    </p>
                  </div>
                </div>

                {/* Card 2: Ketua Umum */}
                <div className="w-full bg-white text-slate-900 rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-xl border border-gray-100 transition-all">
                  {leadershipForm.ketumAvatarUrl ? (
                    <img
                      src={leadershipForm.ketumAvatarUrl}
                      alt={leadershipForm.ketumName || 'Ketua Umum'}
                      className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-slate-100"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#26282d] shrink-0 flex items-center justify-center text-white shadow-inner font-bold text-xs">
                      {leadershipForm.ketumName ? leadershipForm.ketumName.charAt(0) : 'K'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight mb-0.5 text-slate-900 truncate">
                      {leadershipForm.ketumName || 'Muhammad Toha'}
                    </p>
                    <p className="text-[11px] text-gray-600 font-medium leading-tight truncate">
                      {leadershipForm.ketumTitle || 'Ketua Umum TERAMEDIA'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {leadershipForm.ketumPeriod || 'Periode 2025-2026'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>TeraDesk OS • Landing Page</span>
                <span className="text-emerald-400 font-semibold">Tersinkronisasi</span>
              </div>
            </div>

            {/* Right: Form Controls */}
            <form
              id="hero-leadership-form"
              onSubmit={handleSaveLeadership}
              className="md:col-span-7 space-y-4"
            >
              {/* Card 1: Pembina Inputs */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Kartu 1: Pembina Organisasi
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Atas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap &amp; Gelar
                    </label>
                    <input
                      type="text"
                      value={leadershipForm.pembinaName}
                      onChange={(e) =>
                        setLeadershipForm((prev) => ({ ...prev, pembinaName: e.target.value }))
                      }
                      placeholder="M. Ishak, S.Kom., M.Kom."
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jabatan / Keterangan
                    </label>
                    <input
                      type="text"
                      value={leadershipForm.pembinaTitle}
                      onChange={(e) =>
                        setLeadershipForm((prev) => ({ ...prev, pembinaTitle: e.target.value }))
                      }
                      placeholder="Pembina TERAMEDIA"
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Foto Profil / Avatar</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Upload File Gambar atau Tempel URL
                    </span>
                  </label>

                  <div className="space-y-2">
                    {leadershipForm.pembinaAvatarUrl ? (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <img
                          src={leadershipForm.pembinaAvatarUrl}
                          alt="Foto Pembina"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-slate-800 block truncate">
                            {leadershipForm.pembinaAvatarUrl.startsWith('data:')
                              ? 'Foto Terunggah dari Perangkat'
                              : 'Foto dari URL Web'}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check size={11} /> Foto Aktif &amp; Siap Ditampilkan
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <label
                            htmlFor="upload-pembina-modal"
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Ganti foto dengan file lain"
                          >
                            <Upload size={12} />
                            <span>Ganti</span>
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setLeadershipForm((prev) => ({ ...prev, pembinaAvatarUrl: '' }))
                            }
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus foto dan gunakan avatar inisial"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="upload-pembina-modal"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white hover:bg-blue-50/50 border border-dashed border-blue-300 hover:border-blue-500 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer shadow-2xs group"
                        >
                          <Upload
                            size={13}
                            className="group-hover:-translate-y-0.5 transition-transform"
                          />
                          <span>Pilih &amp; Upload Foto dari Komputer / HP</span>
                        </label>
                      </div>
                    )}

                    <input
                      id="upload-pembina-modal"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLeadershipPhotoUpload(e, 'pembinaAvatarUrl')}
                      className="hidden"
                    />

                    <input
                      type="text"
                      value={leadershipForm.pembinaAvatarUrl}
                      onChange={(e) =>
                        setLeadershipForm((prev) => ({ ...prev, pembinaAvatarUrl: e.target.value }))
                      }
                      placeholder="Atau tempel link URL foto langsung di sini..."
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Ketua Umum Inputs */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Kartu 2: Ketua Umum Organisasi
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Bawah
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={leadershipForm.ketumName}
                      onChange={(e) =>
                        setLeadershipForm((prev) => ({ ...prev, ketumName: e.target.value }))
                      }
                      placeholder="Muhammad Toha"
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jabatan / Keterangan
                    </label>
                    <input
                      type="text"
                      value={leadershipForm.ketumTitle}
                      onChange={(e) =>
                        setLeadershipForm((prev) => ({ ...prev, ketumTitle: e.target.value }))
                      }
                      placeholder="Ketua Umum TERAMEDIA"
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Periode Kepengurusan
                  </label>
                  <input
                    type="text"
                    value={leadershipForm.ketumPeriod}
                    onChange={(e) =>
                      setLeadershipForm((prev) => ({ ...prev, ketumPeriod: e.target.value }))
                    }
                    placeholder="Periode 2025-2026"
                    className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Foto Profil / Avatar</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Upload File Gambar atau Tempel URL
                    </span>
                  </label>

                  <div className="space-y-2">
                    {leadershipForm.ketumAvatarUrl ? (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <img
                          src={leadershipForm.ketumAvatarUrl}
                          alt="Foto Ketua Umum"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-slate-800 block truncate">
                            {leadershipForm.ketumAvatarUrl.startsWith('data:')
                              ? 'Foto Terunggah dari Perangkat'
                              : 'Foto dari URL Web'}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check size={11} /> Foto Aktif &amp; Siap Ditampilkan
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <label
                            htmlFor="upload-ketum-modal"
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Ganti foto dengan file lain"
                          >
                            <Upload size={12} />
                            <span>Ganti</span>
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setLeadershipForm((prev) => ({ ...prev, ketumAvatarUrl: '' }))
                            }
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus foto dan gunakan avatar inisial"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="upload-ketum-modal"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white hover:bg-indigo-50/50 border border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-all cursor-pointer shadow-2xs group"
                        >
                          <Upload
                            size={13}
                            className="group-hover:-translate-y-0.5 transition-transform"
                          />
                          <span>Pilih &amp; Upload Foto dari Komputer / HP</span>
                        </label>
                      </div>
                    )}

                    <input
                      id="upload-ketum-modal"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLeadershipPhotoUpload(e, 'ketumAvatarUrl')}
                      className="hidden"
                    />

                    <input
                      type="text"
                      value={leadershipForm.ketumAvatarUrl}
                      onChange={(e) =>
                        setLeadershipForm((prev) => ({ ...prev, ketumAvatarUrl: e.target.value }))
                      }
                      placeholder="Atau tempel link URL foto langsung di sini..."
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetLeadership}
              className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Kembalikan data ke profil default"
            >
              <RefreshCw size={13} />
              <span>Reset Default</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBackToLanding?.();
              }}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Buka Landing Page</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {leadershipSaveSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={14} />
                <span>Tersimpan!</span>
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="submit"
              form="hero-leadership-form"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Upload,
  X,
  Download,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

/**
 * BatchImportModal - Modal Import Massal Akun Mahasiswa
 * Mendukung script JSON, baris CSV, dan upload file spreadsheet Excel (.xlsx).
 */
export default function BatchImportModal({
  isOpen,
  onClose,
  isImportingBatch,
  batchImportTab,
  setBatchImportTab,
  handleFillSampleJson,
  handleFillSampleCsv,
  handleDownloadExcelTemplate,
  batchRawScript,
  setBatchRawScript,
  setBatchImportError,
  OFFICIAL_ROLES = [],
  batchFileName,
  handleBatchFileUpload,
  batchParseResult = { valid: [], duplicates: [], invalid: [] },
  getRoleDisplayLabel,
  batchImportError,
  batchImportSuccess,
  handleExecuteBatchImport,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      onClick={() => {
        if (!isImportingBatch) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 relative my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Import Massal Data Mahasiswa &amp; Akun
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Impor banyak akun sekaligus melalui script JSON, CSV/teks, atau file Excel (.xlsx).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isImportingBatch) onClose();
            }}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup Modal"
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Method Switch & Quick Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBatchImportTab('script')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  batchImportTab === 'script'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tempel Script / Teks
              </button>
              <button
                type="button"
                onClick={() => setBatchImportTab('file')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  batchImportTab === 'file'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload Berkas Excel/CSV
              </button>
            </div>

            {/* Quick Sample / Template Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={handleFillSampleJson}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
              >
                Contoh JSON
              </button>
              <button
                type="button"
                onClick={handleFillSampleCsv}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
              >
                Contoh CSV
              </button>
              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg border border-slate-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Download format spreadsheet .xlsx"
              >
                <Download size={12} />
                <span>Template Excel</span>
              </button>
            </div>
          </div>

          {/* Input Area based on Tab */}
          {batchImportTab === 'script' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Area Tempel Script (JSON Array atau Baris CSV)
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Kolom: NIM, Nama, Divisi, Jabatan, Password, AksesAdmin
                </span>
              </div>
              <textarea
                value={batchRawScript}
                onChange={(e) => {
                  setBatchRawScript(e.target.value);
                  setBatchImportError('');
                }}
                rows={7}
                placeholder={`Contoh JSON:\n[\n  { "nim": "23404060", "name": "Rian Pratama", "division": "Divisi Kesekretariatan", "role": "Koordinator Divisi (Kadiv)" },\n  { "nim": "23404061", "name": "Nabila Az-Zahra", "division": "Divisi Publikasi dan Dokumentasi", "role": "Anggota Biasa / Staf" }\n]\n\nAtau Contoh Baris CSV:\n23404060, Rian Pratama, Divisi Kesekretariatan, Koordinator Divisi (Kadiv), password123, true\n23404061, Nabila Az-Zahra, Divisi Publikasi dan Dokumentasi, Anggota Biasa / Staf, password123, false`}
                className="w-full p-3 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono leading-relaxed border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-indigo-600" />
                  Opsi Jabatan / Peran Resmi:
                </span>
                {OFFICIAL_ROLES.map((r) => (
                  <span
                    key={r.value}
                    className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-[11px] shadow-2xs"
                    title={
                      r.canAdmin
                        ? 'Hak akses default: Bisa Akses Admin'
                        : 'Hak akses default: Hanya Portal Layanan'
                    }
                  >
                    {r.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pilih Berkas Spreadsheet atau JSON
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-6 cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                  <FileSpreadsheet size={24} />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {batchFileName
                    ? batchFileName
                    : 'Klik atau seret file .xlsx, .csv, atau .json ke sini'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Mendukung format Microsoft Excel (.xlsx), Comma Separated (.csv), dan JSON
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv, .json"
                  onChange={handleBatchFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Live Validation Badges Summary */}
          {batchRawScript.trim() && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Hasil Analisis &amp; Validasi Script:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ {batchParseResult.valid.length} Siap Diimpor
                  </span>
                  {batchParseResult.duplicates.length > 0 && (
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      ⚠ {batchParseResult.duplicates.length} Duplikat (Dilewati)
                    </span>
                  )}
                  {batchParseResult.invalid.length > 0 && (
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      ✕ {batchParseResult.invalid.length} Format Salah
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Table of Parsed Accounts */}
              {batchParseResult.valid.length > 0 && (
                <div className="overflow-x-auto max-h-44 border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-[10px] font-bold text-slate-500 uppercase sticky top-0">
                      <tr>
                        <th className="py-2 px-3">NIM</th>
                        <th className="py-2 px-3">NAMA LENGKAP</th>
                        <th className="py-2 px-3">DIVISI</th>
                        <th className="py-2 px-3">JABATAN</th>
                        <th className="py-2 px-3">AKSES ADMIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {batchParseResult.valid.slice(0, 8).map((acc) => (
                        <tr key={acc.nim} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">
                            {acc.nim}
                          </td>
                          <td className="py-2 px-3">{acc.name}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{acc.division}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                acc.role === 'Developer'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : acc.role === 'Koordinator Divisi'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : acc.role === 'Demisioner Ketua Umum'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : acc.role.includes('BPH')
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {getRoleDisplayLabel ? getRoleDisplayLabel(acc.role) : acc.role}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {acc.canAccessAdmin ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Admin
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Portal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {batchParseResult.valid.length > 8 && (
                    <div className="p-2 bg-slate-50 text-center text-[11px] text-slate-500 font-medium">
                      ... dan {batchParseResult.valid.length - 8} akun lainnya siap diproses
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {batchImportError && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {batchImportError}
            </p>
          )}

          {batchImportSuccess && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{batchImportSuccess}</span>
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 mt-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {batchParseResult.valid.length > 0
              ? `Siap mengimpor ${batchParseResult.valid.length} akun ke database.`
              : 'Tempel script atau upload berkas untuk memulai.'}
          </span>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              disabled={isImportingBatch}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={batchParseResult.valid.length === 0 || isImportingBatch}
              onClick={handleExecuteBatchImport}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                batchParseResult.valid.length > 0 && !isImportingBatch
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Upload size={14} />
              <span>
                {isImportingBatch
                  ? 'Sedang Mengimpor...'
                  : `Eksekusi Impor (${batchParseResult.valid.length})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Plus,
  QrCode
} from 'lucide-react';

const FeatureDetailModal = ({ feature, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !feature) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-detail-title"
        className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-[#070B19] text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <feature.icon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="feature-detail-title" className="font-bold text-lg text-white">{feature.title}</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold px-2 py-0.5 rounded-full">
                  Modul Terintegrasi
                </span>
              </div>
              <p className="text-xs text-gray-300">{feature.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grow space-y-6">
          {/* Main Description */}
          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Tentang Modul Ini</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {feature.longDescription || feature.description}
            </p>
          </div>

          {/* Efficiency Benefits List */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Dampak Efisiensi untuk Anggota Organisasi</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(feature.benefits || [
                'Menghemat waktu birokrasi berulang hingga 70%',
                'Pencatatan data tersentralisasi tanpa takut kehilangan file',
                'Transparansi kerja antar divisi kepengurusan',
                'Aksesibel dari laptop maupun smartphone kapan saja',
              ]).map((ben, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-200 text-xs text-slate-800"
                >
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Simulation / Mock Preview based on feature type */}
          {feature.id === 'finance' && (
            <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-blue-900">
                    Simulasi Saldo Kas Organisasi Real-Time
                  </h5>
                  <p className="text-lg font-black text-slate-900">Rp 24.850.000</p>
                </div>
                <button
                  onClick={() => alert('Simulasi form reimburse dibuka!')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Ajukan Reimburse</span>
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex justify-between py-1.5 border-b border-blue-100">
                  <span>Nota Konsumsi Rapat Kerja (Humas)</span>
                  <span className="font-bold text-rose-600">- Rp 350.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-blue-100">
                  <span>Pencairan Dana Sponsorship Brand X</span>
                  <span className="font-bold text-emerald-600">+ Rp 5.000.000</span>
                </div>
              </div>
            </div>
          )}

          {feature.id === 'meeting' && (
            <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-purple-900">
                    Sistem Presensi QR & Generator Notula
                  </h5>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Rapat Terakhir: <strong>Rapat Koordinasi BPH Semester Ganjil</strong>
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                  <QrCode size={20} />
                </div>
              </div>
              <div className="text-xs bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                <p className="font-bold text-slate-800">Action Items Terdistribusi:</p>
                <p className="text-gray-600">✓ Divisi Medinfo merampungkan teaser poster sebelum H-5</p>
                <p className="text-gray-600">✓ Kesekretariatan menyelesaikan surat perizinan rektorat</p>
              </div>
            </div>
          )}

          {feature.id === 'calendar' && (
            <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                Deteksi Tabrakan Jadwal Proker (Smart Conflict Prevention)
              </h5>
              <div className="text-xs text-gray-700 bg-white p-3.5 rounded-xl border border-amber-100">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] mb-1">
                  Aman • Bebas Konflik
                </span>
                <p className="font-semibold">Bulan November 2026: 3 Proker Terjadwal Tanpa Bentrok Tanggal</p>
                <p className="text-gray-500 mt-1">
                  15-17 Nov (LDK Kaderisasi) &bull; 21 Nov (Kunjungan Industri Humas) &bull; 28 Nov (Workshop Medinfo)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 shrink-0">
          <span>TeraDesk terintegrasi untuk seluruh divisi kepengurusan.</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeatureDetailModal;

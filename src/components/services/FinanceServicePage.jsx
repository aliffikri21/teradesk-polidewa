import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  Send,
  UploadCloud,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  TrendingUp
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const sampleTransactions = [
  {
    id: 'TRX-2026-042',
    date: '02 Nov 2026',
    title: 'Konsumsi Rapat Koordinasi Tengah Semester',
    division: 'BPH / Sekretariat',
    type: 'Keluar',
    amount: 'Rp 350.000',
    receipt: 'KWT-088.pdf',
    status: 'Tuntas',
  },
  {
    id: 'TRX-2026-041',
    date: '30 Okt 2026',
    title: 'Iuran Wajib Pengurus Periode Ganjil',
    division: 'Bendahara Umum',
    type: 'Masuk',
    amount: 'Rp 2.400.000',
    receipt: 'TRF-BCA-201.pdf',
    status: 'Tuntas',
  },
  {
    id: 'TRX-2026-040',
    date: '27 Okt 2026',
    title: 'Uang Muka Sewa Tenda & Sound Dies Natalis',
    division: 'Divisi Minat & Bakat',
    type: 'Keluar',
    amount: 'Rp 1.500.000',
    receipt: 'NOTA-SEWA-12.jpg',
    status: 'Tuntas',
  },
  {
    id: 'TRX-2026-039',
    date: '25 Okt 2026',
    title: 'Sponsorship Mitra Perusahaan Teknologi',
    division: 'Divisi Dana Usaha',
    type: 'Masuk',
    amount: 'Rp 5.000.000',
    receipt: 'MOU-SPON-04.pdf',
    status: 'Tuntas',
  },
  {
    id: 'TRX-2026-038',
    date: '21 Okt 2026',
    title: 'Pembelian Kertas HVS & Tinta Printer Sekre',
    division: 'BPH / Sekretariat',
    type: 'Keluar',
    amount: 'Rp 420.000',
    receipt: 'STRUK-GRAMEDIA.jpg',
    status: 'Tuntas',
  },
];

const divisionBudgets = [
  { division: 'Divisi Kaderisasi & SDM', allocated: 12000000, spent: 8500000 },
  { division: 'Divisi Media & Informasi', allocated: 8000000, spent: 3200000 },
  { division: 'Divisi Minat & Bakat', allocated: 10000000, spent: 5400000 },
  { division: 'Divisi Dana Usaha', allocated: 6000000, spent: 2100000 },
  { division: 'Divisi Humas & Jaringan', allocated: 5000000, spent: 1850000 },
];

const FinanceServicePage = (props) => {
  const [activeTab, setActiveTab] = useState('kas'); // 'kas' | 'reimburse' | 'pagu'
  const [filterType, setFilterType] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState(sampleTransactions);

  // Reimbursement Form
  const [reimburseForm, setReimburseForm] = useState({
    title: '',
    division: 'Divisi Media & Informasi',
    amount: '',
    accountNumber: '',
    bankName: 'BCA',
    notes: '',
  });
  const [reimburseSuccess, setReimburseSuccess] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    const matchType = filterType === 'Semua' || t.type === filterType;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const handleReimburseSubmit = (e) => {
    e.preventDefault();
    if (!reimburseForm.title || !reimburseForm.amount) return;

    const newTx = {
      id: `TRX-2026-0${transactions.length + 43}`,
      date: 'Hari ini',
      title: `[Reimburse] ${reimburseForm.title}`,
      division: reimburseForm.division,
      type: 'Keluar',
      amount: reimburseForm.amount.startsWith('Rp') ? reimburseForm.amount : `Rp ${reimburseForm.amount}`,
      receipt: 'NOTA-UPLOAD.jpg',
      status: 'Menunggu Verifikasi Bendum',
    };

    setTransactions([newTx, ...transactions]);
    setReimburseSuccess(true);
    setTimeout(() => {
      setReimburseSuccess(false);
      setActiveTab('kas');
      setReimburseForm({
        title: '',
        division: 'Divisi Media & Informasi',
        amount: '',
        accountNumber: '',
        bankName: 'BCA',
        notes: '',
      });
    }, 1200);
  };

  return (
    <ServicePageLayout
      serviceId="finance"
      title="Kas & Reimbursement Anggaran"
      category="Keuangan & Anggaran"
      badge="Modul Aktif"
      icon={Receipt}
      {...props}
    >
      {/* Top Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Saldo Kas Utama</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
            Rp 42.500.000
          </div>
          <p className="text-[11px] text-gray-400">Rekening Resmi Organisasi</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Realisasi Belanja Proker</span>
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Rp 18.250.000
          </div>
          <p className="text-[11px] text-gray-400">Terserap 44.5% dari pagu tahunan</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Reimbursement Pending</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">
            Rp 2.450.000
          </div>
          <p className="text-[11px] text-gray-400">3 nota menunggu approval bendum</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Efisiensi Audit Kas</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">
            100%
          </div>
          <p className="text-[11px] text-gray-400">Semua transaksi memiliki foto bukti</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('kas')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'kas'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Receipt size={16} />
          <span>Buku Kas & Riwayat Mutasi</span>
        </button>

        <button
          onClick={() => setActiveTab('reimburse')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'reimburse'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send size={16} />
          <span>Ajukan Reimbursement Nota</span>
        </button>

        <button
          onClick={() => setActiveTab('pagu')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'pagu'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp size={16} />
          <span>Monitoring Pagu Divisi</span>
        </button>
      </div>

      {/* Tab 1: Buku Kas */}
      {activeTab === 'kas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi, divisi, atau nomor mutasi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              {['Semua', 'Masuk', 'Keluar'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterType === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-4 px-6">ID & Uraian Transaksi</th>
                    <th className="py-4 px-6">Tanggal</th>
                    <th className="py-4 px-6">Divisi Pemohon</th>
                    <th className="py-4 px-6">Jenis & Nominal</th>
                    <th className="py-4 px-6">Bukti Struk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.type === 'Masuk';
                    return (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono text-[10px] text-gray-400">{tx.id}</span>
                          <p className="font-bold text-white text-xs sm:text-sm mt-0.5">{tx.title}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-300 font-mono">
                          {tx.date}
                        </td>
                        <td className="py-4 px-6 text-gray-200 font-semibold">
                          {tx.division}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-mono font-bold text-xs sm:text-sm flex items-center gap-1 ${
                              isIncome ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            {tx.amount}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-[11px] text-blue-300 underline cursor-pointer hover:text-blue-200">
                            {tx.receipt}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reimbursement Form */}
      {activeTab === 'reimburse' && (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Formulir Reimbursement Nota & Belanja Proker
            </h2>
            <p className="text-xs text-gray-400">
              Unggah foto nota fisik belanja kegiatan panitia untuk diverifikasi dan ditransfer kembali oleh Bendahara Umum.
            </p>
          </div>

          {reimburseSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Reimbursement Berhasil Diajukan!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Notifikasi pengajuan telah dikirimkan ke Bendahara Umum untuk pencocokan kwitansi dan proses transfer dana.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReimburseSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Uraian Keperluan Belanja <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian Lakban, Nametag, dan Baterai Mic Acara LDK"
                  value={reimburseForm.title}
                  onChange={(e) => setReimburseForm({ ...reimburseForm, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Divisi Pemohon
                  </label>
                  <select
                    value={reimburseForm.division}
                    onChange={(e) => setReimburseForm({ ...reimburseForm, division: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Divisi Media & Informasi">Divisi Media & Informasi</option>
                    <option value="Divisi Kaderisasi & SDM">Divisi Kaderisasi & SDM</option>
                    <option value="Divisi Minat & Bakat">Divisi Minat & Bakat</option>
                    <option value="Divisi Humas & Jaringan">Divisi Humas & Jaringan</option>
                    <option value="Divisi Dana Usaha">Divisi Dana Usaha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Total Nominal Sesuai Nota <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 350.000"
                    value={reimburseForm.amount}
                    onChange={(e) => setReimburseForm({ ...reimburseForm, amount: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Bank / E-Wallet Tujuan
                  </label>
                  <select
                    value={reimburseForm.bankName}
                    onChange={(e) => setReimburseForm({ ...reimburseForm, bankName: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                    <option value="GoPay">GoPay</option>
                    <option value="Dana">Dana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nomor Rekening & Atas Nama
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 5210982341 a/n Nadia"
                    value={reimburseForm.accountNumber}
                    onChange={(e) => setReimburseForm({ ...reimburseForm, accountNumber: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Upload Foto Struk */}
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                <UploadCloud size={32} className="mx-auto text-purple-400 mb-2" />
                <p className="text-xs font-bold text-white">
                  Tarik & letakkan foto struk / nota fisik di sini (JPG atau PNG)
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Pastikan nominal dan tanggal terlihat jelas</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('kas')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Kirim Pengajuan Reimbursement</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Monitoring Pagu Divisi */}
      {activeTab === 'pagu' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp size={22} className="text-emerald-400" />
              <span>Monitoring Alokasi Pagu Anggaran Setiap Divisi</span>
            </h2>
            <p className="text-xs text-gray-400 mb-8">
              Pagu anggaran yang disepakati saat Rapat Kerja (Raker) dan realisasi penyerapan dana proker.
            </p>

            <div className="space-y-6">
              {divisionBudgets.map((item, idx) => {
                const percent = Math.round((item.spent / item.allocated) * 100);
                const remaining = item.allocated - item.spent;

                return (
                  <div key={idx} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.division}</h4>
                        <span className="text-[11px] text-gray-400">
                          Sisa Pagu: <strong className="text-emerald-400 font-mono">Rp {remaining.toLocaleString('id-ID')}</strong>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs sm:text-sm text-gray-300">
                          Rp {item.spent.toLocaleString('id-ID')} / Rp {item.allocated.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 ml-2">({percent}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </ServicePageLayout>
  );
};

export default FinanceServicePage;

import React, { useState } from 'react';
import {
  ShoppingBag,
  Camera,
  Coins,
  Package,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Tag,
  X,
  Sparkles
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const KkmServicePage = (props) => {
  const [activeTab, setActiveTab] = useState('merch'); // 'merch' | 'rental' | 'kas'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // 1. Merchandise Products Catalog
  const merchProducts = [
    {
      id: 'PROD-01',
      name: 'Official Hoodie TERAMEDIA 2026',
      spec: 'Heavyweight Cotton Fleece 330gsm, Plastisol Doff',
      price: 165000,
      minPo: 30,
      currentPo: 38,
      status: 'Target Tercapai (Produksi)',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'PROD-02',
      name: 'Lanyard + ID Card Holder Satin Doff',
      spec: 'Tisu Satin Printing Sublimasi 2cm + Stopper & Hook Logam',
      price: 25000,
      minPo: 50,
      currentPo: 64,
      status: 'Target Tercapai (Produksi)',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'PROD-03',
      name: 'Sticker Pack Hologram Vinyl (6 Pcs)',
      spec: 'Vinyl Hologram Waterproof, Die-Cut Teramedia Edition',
      price: 15000,
      minPo: 40,
      currentPo: 28,
      status: 'Open Pre-Order (Sisa 12)',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'PROD-04',
      name: 'Enamel Pin Eksklusif Logo TERAMEDIA',
      spec: 'Zinc Alloy Enamel Hitam & Emas Chrome 3cm',
      price: 20000,
      minPo: 30,
      currentPo: 22,
      status: 'Open Pre-Order (Sisa 8)',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  // Pre-Order Orders List
  const [orderList, setOrderList] = useState([
    {
      id: 'PO-2026-001',
      customerName: 'Alif Fikri',
      nim: '23404053',
      division: 'Demisioner Ketum / BPH',
      item: 'Official Hoodie TERAMEDIA 2026',
      size: 'XL',
      qty: 1,
      total: 165000,
      paymentStatus: 'Lunas',
      pickupStatus: 'Siap Diambil di Sekre',
      paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'PO-2026-002',
      customerName: 'Sarah Amalia',
      nim: '24401089',
      division: 'Divisi Kesekretariatan',
      item: 'Lanyard + ID Card Holder Satin Doff',
      size: 'All Size',
      qty: 2,
      total: 50000,
      paymentStatus: 'Lunas',
      pickupStatus: 'Siap Diambil di Sekre',
      paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'PO-2026-003',
      customerName: 'Bagas Aditya',
      nim: '23403112',
      division: 'Divisi Pubdok',
      item: 'Official Hoodie TERAMEDIA 2026',
      size: 'L',
      qty: 1,
      total: 165000,
      paymentStatus: 'DP 50% (Rp 82.500)',
      pickupStatus: 'Dalam Proses Konveksi',
      paymentColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'PO-2026-004',
      customerName: 'Fani Rahmawati',
      nim: '25402011',
      division: 'Kader Muda / Kaderisasi',
      item: 'Sticker Pack + Enamel Pin',
      size: 'Paket Bundle',
      qty: 1,
      total: 35000,
      paymentStatus: 'Menunggu Pembayaran',
      pickupStatus: 'Menunggu Pelunasan',
      paymentColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ]);

  // Form New Order
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formNim, setFormNim] = useState('');
  const [formDivision, setFormDivision] = useState('Divisi Kaderisasi');
  const [formProduct, setFormProduct] = useState('Official Hoodie TERAMEDIA 2026');
  const [formSize, setFormSize] = useState('L');
  const [formQty, setFormQty] = useState(1);
  const [formPayStatus, setFormPayStatus] = useState('Lunas');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  // 2. Equipment Rental & Coverage Services
  const rentalEquipment = [
    {
      id: 'EQ-01',
      name: 'Sony Alpha A7 III + FE 28-70mm',
      category: 'Kamera Mirrorless',
      rate: 'Rp 150.000 / hari',
      deposit: 'KTM Asli + KTP',
      status: 'Tersedia',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'EQ-02',
      name: 'Rode Wireless GO II Dual Mic System',
      category: 'Audio Recording',
      rate: 'Rp 75.000 / hari',
      deposit: 'KTM Asli',
      status: 'Sedang Disewa (H-1 Kembali)',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'EQ-03',
      name: 'Godox SL60W LED + Octabox 90cm + Stand',
      category: 'Tata Cahaya / Lighting',
      rate: 'Rp 60.000 / hari',
      deposit: 'KTM Asli',
      status: 'Tersedia',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'EQ-04',
      name: 'Jasa Dokumentasi Event (Foto & Video Highlight)',
      category: 'Jasa Liputan Multimedia',
      rate: 'Rp 350.000 / sesi 4 jam',
      deposit: 'MOU Kerjasama UKM',
      status: 'Tersedia untuk Booking',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  const [rentalBookings] = useState([
    {
      id: 'SW-2026-001',
      client: 'BEM Fakultas Hukum (Pekan Konstitusi)',
      item: 'Rode Wireless GO II Dual Mic System',
      duration: '2 Hari (03 - 04 Nov 2026)',
      deposit: 'KTM Moch. Ridwan',
      totalCost: 'Rp 150.000',
      status: 'Sedang Berjalan',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'SW-2026-002',
      client: 'UKM Paduan Suara Mahasiswa',
      item: 'Jasa Liputan Dokumentasi Foto & Video',
      duration: '1 Sesi Konser Tahunan (12 Nov 2026)',
      deposit: 'MOU & DP 50%',
      totalCost: 'Rp 350.000',
      status: 'Terkonfirmasi (Booked)',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'SW-2026-003',
      client: 'Himpunan Mahasiswa Informatika (HIMATIF)',
      item: 'Sony Alpha A7 III + Tripod Video',
      duration: '1 Hari (30 Okt 2026)',
      deposit: 'KTM Aris Santoso',
      totalCost: 'Rp 180.000',
      status: 'Selesai & Dikembalikan',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ]);

  // 3. Profit/Loss Cashflow Data
  const [cashflowList, setCashflowList] = useState([
    {
      id: 'TX-KKM-01',
      date: '02 Nov 2026',
      desc: 'Pembayaran Lunas PO Kaos Hoodie (Batch 1)',
      category: 'Penjualan Merchandise',
      type: 'in',
      amount: 6270000,
      note: 'Transfer BCA 38 pemesan gelombang awal',
    },
    {
      id: 'TX-KKM-02',
      date: '31 Okt 2026',
      desc: 'DP Vendor Konveksi Kaos Hoodie 38 Pcs',
      category: 'Beban Produksi Merchandise',
      type: 'out',
      amount: 3800000,
      note: 'Transfer ke CV Mitra Prima Konveksi',
    },
    {
      id: 'TX-KKM-03',
      date: '30 Okt 2026',
      desc: 'Sewa Alat Kamera Sony A7 III - HIMATIF',
      category: 'Sewa Alat Multimedia',
      type: 'in',
      amount: 180000,
      note: 'Cash diterima bendahara KKM',
    },
    {
      id: 'TX-KKM-04',
      date: '28 Okt 2026',
      desc: 'Jasa Liputan Dies Natalis Kampus',
      category: 'Jasa Liputan & Video',
      type: 'in',
      amount: 450000,
      note: 'Honor liputan dokumentasi video',
    },
    {
      id: 'TX-KKM-05',
      date: '25 Okt 2026',
      desc: 'Pengadaan Box Kemasan & Tag Sablon',
      category: 'Operasional Kemasan',
      type: 'out',
      amount: 150000,
      note: 'Plastik zip lock & label stiker Teramedia',
    },
  ]);

  // Form Cashflow Transaction
  const [formTxDesc, setFormTxDesc] = useState('');
  const [formTxType, setFormTxType] = useState('in');
  const [formTxAmount, setFormTxAmount] = useState('');
  const [formTxCategory, setFormTxCategory] = useState('Penjualan Merchandise');

  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!formCustomerName || !formNim) return;

    const priceMap = {
      'Official Hoodie TERAMEDIA 2026': 165000,
      'Lanyard + ID Card Holder Satin Doff': 25000,
      'Sticker Pack Hologram Vinyl (6 Pcs)': 15000,
      'Enamel Pin Eksklusif Logo TERAMEDIA': 20000,
    };
    const unitPrice = priceMap[formProduct] || 50000;
    const totalAmount = unitPrice * Number(formQty);

    const newOrder = {
      id: `PO-2026-00${orderList.length + 1}`,
      customerName: formCustomerName,
      nim: formNim,
      division: formDivision,
      item: formProduct,
      size: formSize,
      qty: Number(formQty),
      total: totalAmount,
      paymentStatus: formPayStatus,
      pickupStatus: formPayStatus === 'Lunas' ? 'Siap Diambil di Sekre' : 'Dalam Proses Konveksi',
      paymentColor:
        formPayStatus === 'Lunas'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : formPayStatus.includes('DP')
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-rose-50 text-rose-700 border-rose-200',
    };

    setOrderList([newOrder, ...orderList]);
    setOrderSuccessMsg(`Pesanan untuk ${formCustomerName} berhasil dicatat!`);
    setFormCustomerName('');
    setFormNim('');
    setOrderModalOpen(false);

    setTimeout(() => setOrderSuccessMsg(''), 4000);
  };

  const handleAddTx = (e) => {
    e.preventDefault();
    const amountNum = Number(formTxAmount);
    if (!formTxDesc || !amountNum) return;

    const newTx = {
      id: `TX-KKM-0${cashflowList.length + 1}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      desc: formTxDesc,
      category: formTxCategory,
      type: formTxType,
      amount: amountNum,
      note: 'Dicatat via Panel Divisi KKM',
    };

    setCashflowList([newTx, ...cashflowList]);
    setFormTxDesc('');
    setFormTxAmount('');
  };

  // Calculations
  const totalMasuk = cashflowList.filter((t) => t.type === 'in').reduce((acc, c) => acc + c.amount, 0);
  const totalKeluar = cashflowList.filter((t) => t.type === 'out').reduce((acc, c) => acc + c.amount, 0);
  const labaBersih = totalMasuk - totalKeluar;
  const bagiHasilKas = Math.round(labaBersih * 0.4);

  const filteredOrders = orderList.filter((ord) => {
    const matchSearch =
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.nim.includes(searchQuery) ||
      ord.item.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === 'Semua' ||
      (filterStatus === 'Lunas' && ord.paymentStatus === 'Lunas') ||
      (filterStatus === 'DP' && ord.paymentStatus.includes('DP')) ||
      (filterStatus === 'Belum Lunas' && ord.paymentStatus === 'Menunggu Pembayaran');
    return matchSearch && matchStatus;
  });

  return (
    <ServicePageLayout
      serviceId="kkm"
      title="Divisi Kreativitas & Kewirausahaan (KKM)"
      category="Kewirausahaan & Unit Usaha Mahasiswa"
      badge="Modul Divisi"
      icon={ShoppingBag}
      {...props}
    >
      <div className="space-y-6">
        {/* Banner Alert Feedback */}
        {orderSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3 text-sm text-emerald-800 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <p className="font-medium">{orderSuccessMsg}</p>
          </div>
        )}

        {/* Top Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Omzet Usaha</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              Rp {totalMasuk.toLocaleString('id-ID')}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <TrendingUp size={13} />
              <span>Surplus kumulatif periode berjalan</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pre-Order Merch Aktif</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">{orderList.length} Pemesan</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-700 font-medium">
              <Clock size={13} />
              <span>Batch 1 Official Hoodie & Lanyard</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Sewa Alat & Liputan</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Camera size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">{rentalBookings.length} Kontrak</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-700 font-medium">
              <Sparkles size={13} />
              <span>Kamera Sony & Paket Liputan Aktif</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Laba Bersih KKM</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Coins size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              Rp {labaBersih.toLocaleString('id-ID')}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
              <span>Bagi Hasil Kas Organisasi: Rp {bagiHasilKas.toLocaleString('id-ID')} (40%)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('merch')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'merch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShoppingBag size={14} className={activeTab === 'merch' ? 'text-blue-600' : 'text-slate-500'} />
              <span>Pre-Order Merchandise ({orderList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rental')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rental'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Camera size={14} className={activeTab === 'rental' ? 'text-purple-600' : 'text-slate-500'} />
              <span>Sewa Alat & Liputan ({rentalBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('kas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Coins size={14} className={activeTab === 'kas' ? 'text-emerald-600' : 'text-slate-500'} />
              <span>Buku Kas Laba-Rugi KKM</span>
            </button>
          </div>

          {activeTab === 'merch' && (
            <button
              onClick={() => setOrderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>+ Tambah Order Pre-Order</span>
            </button>
          )}
        </div>

        {/* TAB 1: PRE-ORDER MERCHANDISE */}
        {activeTab === 'merch' && (
          <div className="space-y-6">
            {/* Products Catalog Cards */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Tag size={16} className="text-blue-600" />
                <span>Katalog Merchandise Resmi UKM TERAMEDIA (Edisi 2026)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {merchProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-medium text-slate-400">{p.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.tagColor}`}>
                          {p.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.spec}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">Harga Pre-Order</div>
                        <div className="text-sm font-bold text-blue-600">
                          Rp {p.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Terkumpul</div>
                        <div className="text-xs font-semibold text-slate-800">
                          {p.currentPo} / {p.minPo} pcs
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter and Search Bar for Orders */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama pemesan, NIM, atau barang..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-500">Status Pembayaran:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Lunas">Lunas</option>
                    <option value="DP">DP 50%</option>
                    <option value="Belum Lunas">Menunggu Pembayaran</option>
                  </select>
                </div>
              </div>

              {/* Orders Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Kode Order</th>
                      <th className="py-2.5 px-3">Nama Pemesan / NIM</th>
                      <th className="py-2.5 px-3">Produk & Ukuran</th>
                      <th className="py-2.5 px-3">Jumlah</th>
                      <th className="py-2.5 px-3">Total Bayar</th>
                      <th className="py-2.5 px-3">Status Bayar</th>
                      <th className="py-2.5 px-3">Status Pengambilan</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-slate-400">
                          Tidak ada pesanan pre-order yang cocok dengan pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-slate-700">{ord.id}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{ord.customerName}</div>
                            <div className="text-[11px] text-slate-500">
                              NIM: {ord.nim} • {ord.division}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">{ord.item}</div>
                            <div className="text-[11px] text-slate-500">Ukuran: {ord.size}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">{ord.qty} pcs</td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            Rp {ord.total.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ord.paymentColor}`}
                            >
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-slate-600 flex items-center gap-1">
                              <CheckCircle2 size={12} className="text-emerald-500" />
                              {ord.pickupStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {ord.paymentStatus !== 'Lunas' ? (
                              <button
                                onClick={() => {
                                  setOrderList(
                                    orderList.map((o) =>
                                      o.id === ord.id
                                    ? {
                                        ...o,
                                        paymentStatus: 'Lunas',
                                        paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                        pickupStatus: 'Siap Diambil di Sekre',
                                      }
                                    : o
                                    )
                                  );
                                }}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium"
                              >
                                Set Lunas
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-medium">Lunas</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEWA ALAT & JASA LIPUTAN */}
        {activeTab === 'rental' && (
          <div className="space-y-6">
            {/* Rental Equipment Cards */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Camera size={16} className="text-purple-600" />
                <span>Katalog Alat Multimedia & Jasa Liputan Divisi KKM</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rentalEquipment.map((eq) => (
                  <div key={eq.id} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                        {eq.category}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${eq.statusColor}`}>
                        {eq.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{eq.name}</h4>
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Tarif Sewa:</span>
                        <span className="font-bold text-blue-600">{eq.rate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Jaminan:</span>
                        <span className="font-medium text-slate-700">{eq.deposit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Bookings Table */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900">Jadwal Booking Peminjaman Alat & Jasa Liputan</h4>
                <span className="text-xs text-slate-500">Mencegah bentrok pemakaian antar UKM/Instansi</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Kode Booking</th>
                      <th className="py-2.5 px-3">Penyewa / Organisasi</th>
                      <th className="py-2.5 px-3">Alat / Layanan</th>
                      <th className="py-2.5 px-3">Jadwal & Durasi</th>
                      <th className="py-2.5 px-3">Jaminan Berkas</th>
                      <th className="py-2.5 px-3">Biaya Sewa</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rentalBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-slate-700">{bk.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{bk.client}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{bk.item}</td>
                        <td className="py-3 px-3 text-slate-600">{bk.duration}</td>
                        <td className="py-3 px-3 text-slate-500">{bk.deposit}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{bk.totalCost}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${bk.statusColor}`}
                          >
                            {bk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUKU KAS LABA-RUGI KKM */}
        {activeTab === 'kas' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Cashflow Ledger */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Buku Kas Laba-Rugi Divisi Usaha KKM</h4>
                    <p className="text-xs text-slate-500">Transparansi pemasukan usaha merch dan jasa multimedia</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Saldo Usaha KKM:</span>
                    <div className="text-base font-bold text-emerald-600">
                      Rp {labaBersih.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Keterangan Transaksi</th>
                        <th className="py-2.5 px-3">Kategori</th>
                        <th className="py-2.5 px-3">Tipe</th>
                        <th className="py-2.5 px-3 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cashflowList.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{tx.date}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{tx.desc}</div>
                            <div className="text-[11px] text-slate-400">{tx.note}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {tx.type === 'in' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                <TrendingUp size={12} /> Masuk
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                                <TrendingDown size={12} /> Keluar
                              </span>
                            )}
                          </td>
                          <td
                            className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                              tx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {tx.type === 'in' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Add Transaction & Profit Sharing Card */}
            <div className="space-y-4">
              {/* Bagi Hasil Kas Card */}
              <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="text-amber-400" size={18} />
                  <h4 className="text-sm font-bold">Skema Bagi Hasil UKM</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Sesuai AD/ART TERAMEDIA, laba bersih unit usaha KKM dialokasikan 40% ke Kas Umum Organisasi dan 60%
                  untuk Kas Operasional & Re-Investasi KKM.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-700/80">
                    <span className="text-slate-400">Alokasi Kas UKM (40%):</span>
                    <span className="font-bold text-amber-400">Rp {bagiHasilKas.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-700/80">
                    <span className="text-slate-400">Alokasi Kas KKM (60%):</span>
                    <span className="font-bold text-emerald-400">
                      Rp {(labaBersih - bagiHasilKas).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Input Transaksi Baru */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Plus size={15} className="text-blue-600" />
                  <span>Catat Arus Kas Baru</span>
                </h4>
                <form onSubmit={handleAddTx} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Keterangan Transaksi
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pembayaran PO Kaos #05"
                      value={formTxDesc}
                      onChange={(e) => setFormTxDesc(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Tipe Arus Kas</label>
                      <select
                        value={formTxType}
                        onChange={(e) => setFormTxType(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="in">Pemasukan (+)</option>
                        <option value="out">Pengeluaran (-)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Nominal (Rp)</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        placeholder="50000"
                        value={formTxAmount}
                        onChange={(e) => setFormTxAmount(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Kategori</label>
                    <select
                      value={formTxCategory}
                      onChange={(e) => setFormTxCategory(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Penjualan Merchandise">Penjualan Merchandise</option>
                      <option value="Sewa Alat Multimedia">Sewa Alat Multimedia</option>
                      <option value="Jasa Liputan & Video">Jasa Liputan & Video</option>
                      <option value="Beban Produksi Merchandise">Beban Produksi Merchandise</option>
                      <option value="Operasional Kemasan">Operasional Kemasan</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Simpan Transaksi Kas
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Tambah Order Pre-Order */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="text-blue-600" size={20} />
                <h3 className="text-base font-bold text-slate-900">Input Pesanan Pre-Order Baru</h3>
              </div>

              <form onSubmit={handleAddOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nama Pemesan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Ihsan"
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">NIM Mahasiswa</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 23402011"
                      value={formNim}
                      onChange={(e) => setFormNim(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Divisi / Angkatan</label>
                    <input
                      type="text"
                      placeholder="Kaderisasi / 2024"
                      value={formDivision}
                      onChange={(e) => setFormDivision(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pilihan Produk Merchandise</label>
                  <select
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Official Hoodie TERAMEDIA 2026">
                      Official Hoodie TERAMEDIA 2026 (Rp 165.000)
                    </option>
                    <option value="Lanyard + ID Card Holder Satin Doff">
                      Lanyard + ID Card Satin Doff (Rp 25.000)
                    </option>
                    <option value="Sticker Pack Hologram Vinyl (6 Pcs)">
                      Sticker Pack Hologram Vinyl (Rp 15.000)
                    </option>
                    <option value="Enamel Pin Eksklusif Logo TERAMEDIA">
                      Enamel Pin Logam Logo TERAMEDIA (Rp 20.000)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Ukuran</label>
                    <select
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL (+Rp 10.000)">XXL (+Rp 10.000)</option>
                      <option value="All Size">All Size</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Jumlah (Pcs)</label>
                    <input
                      type="number"
                      min="1"
                      value={formQty}
                      onChange={(e) => setFormQty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status Pembayaran</label>
                  <select
                    value={formPayStatus}
                    onChange={(e) => setFormPayStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Lunas">Lunas (100%)</option>
                    <option value="DP 50%">DP 50%</option>
                    <option value="Menunggu Pembayaran">Menunggu Pembayaran Transfer</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                  >
                    Simpan Pesanan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ServicePageLayout>
  );
};

export default KkmServicePage;

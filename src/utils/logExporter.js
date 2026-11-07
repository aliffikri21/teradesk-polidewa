import * as XLSX from 'xlsx';

const INDONESIAN_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_MAP = {
  jan: 0, januari: 0,
  feb: 1, februari: 1,
  mar: 2, maret: 2,
  apr: 3, april: 3,
  mei: 4, may: 4,
  jun: 5, juni: 5,
  jul: 6, juli: 6,
  agu: 7, agustus: 7, aug: 7,
  sep: 8, september: 8,
  okt: 9, oktober: 9, oct: 9,
  nov: 10, november: 10,
  des: 11, desember: 11, dec: 11,
};

/**
 * Mengekstrak informasi penanggalan terstruktur (Tahun, Bulan, Tanggal) dari objek log aktivitas.
 */
export const getLogDateInfo = (log) => {
  let dateObj = null;

  // 1. Cek Firestore timestamp atau string ISO di createdAt
  if (log?.createdAt) {
    if (typeof log.createdAt?.toDate === 'function') {
      dateObj = log.createdAt.toDate();
    } else if (typeof log.createdAt === 'string') {
      const parsed = new Date(log.createdAt);
      if (!isNaN(parsed.getTime())) dateObj = parsed;
    }
  }

  // 2. Cek ID log dengan format log-<epoch_timestamp>-...
  if (!dateObj && log?.id) {
    const match = String(log.id).match(/^log-(\d{12,14})/);
    if (match) {
      const ts = parseInt(match[1], 10);
      if (!isNaN(ts)) dateObj = new Date(ts);
    }
  }

  // 3. Cek format tanggal teks Indonesia (misal: "07 Nov 2026", "22 Okt 2026")
  if (!dateObj && log?.date) {
    const parts = String(log.date).trim().split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const mStr = parts[1].toLowerCase().replace(/[^a-z]/g, '');
      const year = parseInt(parts[2], 10);
      if (!isNaN(year) && MONTH_MAP[mStr] !== undefined) {
        dateObj = new Date(year, MONTH_MAP[mStr], isNaN(day) ? 1 : day);
      }
    }
    if (!dateObj) {
      const parsed = new Date(log.date);
      if (!isNaN(parsed.getTime())) dateObj = parsed;
    }
  }

  // Fallback: gunakan tanggal sekarang
  if (!dateObj) {
    dateObj = new Date();
  }

  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();
  const monthName = INDONESIAN_MONTH_NAMES[monthIndex];
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthLabel = `${monthName} ${year}`;

  return { dateObj, year, monthIndex, monthName, monthKey, monthLabel };
};

/**
 * Mengelompokkan seluruh bulan yang tersedia dari riwayat log aktivitas.
 */
export const getAvailableLogMonths = (logs = []) => {
  const monthMap = new Map();

  // Pastikan bulan sekarang selalu ada dalam daftar tab
  const nowInfo = getLogDateInfo({ createdAt: new Date() });
  monthMap.set(nowInfo.monthKey, {
    key: nowInfo.monthKey,
    label: nowInfo.monthLabel,
    year: nowInfo.year,
    monthName: nowInfo.monthName,
    count: 0,
  });

  (logs || []).forEach((log) => {
    const info = getLogDateInfo(log);
    if (!monthMap.has(info.monthKey)) {
      monthMap.set(info.monthKey, {
        key: info.monthKey,
        label: info.monthLabel,
        year: info.year,
        monthName: info.monthName,
        count: 0,
      });
    }
    monthMap.get(info.monthKey).count += 1;
  });

  return Array.from(monthMap.values()).sort((a, b) => b.key.localeCompare(a.key));
};

/**
 * Mengekspor daftar log aktivitas ke file spreadsheet Excel (.xlsx) rapi dengan lebar kolom optimal.
 */
export const exportLogsToXLSX = (logsList = [], filename = 'teradesk_log_aktivitas.xlsx', sheetTitle = 'Log Aktivitas') => {
  if (!Array.isArray(logsList) || logsList.length === 0) {
    alert('Tidak ada data log aktivitas yang dapat diekspor.');
    return;
  }

  const rows = logsList.map((log, index) => {
    const actorName = log.actor?.name || log.userName || '-';
    const actorNim = log.actor?.nim || log.userNim || '-';
    const actorRole = log.actor?.role || log.userRole || '-';
    const actorDivision = log.actor?.division || log.userDivision || '-';
    const moduleName = log.module || log.moduleName || '-';
    const deviceSummary = log.device?.summary || log.device?.type || '-';
    const eventTime = log.time || log.timestamp || '-';
    const eventDate = log.date || (log.createdAt ? String(log.createdAt).slice(0, 10) : '-');

    let kategoriText = 'Sistem & Akun';
    if (log.category === 'login') kategoriText = 'Autentikasi Login';
    if (log.category === 'module_submit') kategoriText = 'Submit Modul';

    return {
      'No': index + 1,
      'Tanggal': eventDate,
      'Waktu': eventTime,
      'Kategori': kategoriText,
      'Aktivitas / Event': log.event || '-',
      'Nama Pengurus / Pengguna': actorName,
      'NIM': actorNim,
      'Jabatan / Peran': actorRole,
      'Divisi': actorDivision,
      'Modul Terkait': moduleName,
      'Keterangan / Rincian': log.details || '-',
      'Perangkat & Browser': deviceSummary,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Atur lebar kolom agar rapi saat dibuka di Microsoft Excel
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 14 }, // Tanggal
    { wch: 12 }, // Waktu
    { wch: 20 }, // Kategori
    { wch: 38 }, // Aktivitas / Event
    { wch: 24 }, // Nama Pengurus
    { wch: 14 }, // NIM
    { wch: 26 }, // Jabatan / Peran
    { wch: 26 }, // Divisi
    { wch: 22 }, // Modul
    { wch: 48 }, // Keterangan / Rincian
    { wch: 32 }, // Perangkat & Browser
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.slice(0, 31)); // Batas nama sheet Excel max 31 karakter

  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
};

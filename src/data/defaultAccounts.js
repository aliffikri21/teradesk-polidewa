export const OFFICIAL_DIVISIONS = [
  'BPH (Badan Pengurus Harian)',
  'Divisi Kesekretariatan',
  'Divisi Publikasi dan Dokumentasi',
  'Divisi Humas',
  'Divisi Kaderisasi',
  'Divisi KKM (Kewirausahaan)',
];

export const initialDefaultAccounts = [
  {
    nim: '23404053',
    name: 'Alif Fikri Haykal',
    role: 'Demisioner Ketua Umum',
    division: 'BPH (Badan Pengurus Harian)',
    password: 'admin',
    createdAt: '2026-11-03',
    isDefault: true,
    canAccessAdmin: true,
  },
  {
    nim: '23404001',
    name: 'Bagas Aditya Pratama',
    role: 'Koordinator Divisi',
    division: 'Divisi Kaderisasi',
    password: 'admin',
    createdAt: '2026-11-08',
    isDefault: false,
    canAccessAdmin: true,
  },
  {
    nim: '23404002',
    name: 'Nadia Safitri',
    role: 'Koordinator Divisi',
    division: 'Divisi Publikasi dan Dokumentasi',
    password: 'admin',
    createdAt: '2026-11-08',
    isDefault: false,
    canAccessAdmin: true,
  },
  {
    nim: '23404010',
    name: 'Ahmad Fauzi',
    role: 'Anggota Biasa',
    division: 'Divisi Kaderisasi',
    password: 'admin',
    createdAt: '2026-11-08',
    isDefault: false,
    canAccessAdmin: false,
  },
  {
    nim: '23404011',
    name: 'Siti Aminah',
    role: 'Anggota Biasa',
    division: 'Divisi Humas',
    password: 'admin',
    createdAt: '2026-11-08',
    isDefault: false,
    canAccessAdmin: false,
  },
  {
    nim: '23404012',
    name: 'Rian Pratama',
    role: 'Anggota Biasa',
    division: 'Divisi KKM (Kewirausahaan)',
    password: 'admin',
    createdAt: '2026-11-08',
    isDefault: false,
    canAccessAdmin: false,
  },
];

/**
 * Memeriksa apakah akun pengguna memiliki peran sebagai Koordinator Divisi, BPH, atau Eksekutif.
 * Digunakan untuk membatasi aksi krusial seperti menyelesaikan rapat, mengedit, atau menghapus agenda.
 */
export const isUserCoordinator = (user) => {
  if (!user) return false;
  const roleLower = (user.role || '').toLowerCase();
  return (
    roleLower.includes('koordinator') ||
    roleLower.includes('kadiv') ||
    roleLower.includes('ketua') ||
    roleLower.includes('demisioner') ||
    roleLower.includes('bph') ||
    roleLower.includes('sekretaris') ||
    roleLower.includes('bendahara') ||
    user.canAccessAdmin === true
  );
};

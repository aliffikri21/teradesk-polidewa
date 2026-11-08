// Data default awal kotak masuk konsultasi (dibuat kosong agar tidak memunculkan data dummy)
export const initialDefaultConsultations = [];

/**
 * Filter pendeteksi pesan simulasi/dummy lama agar tidak bangkit kembali di memori atau storage.
 */
export const isDummyConsultation = (msg) => {
  if (!msg || typeof msg !== 'object') return true;
  const dummyIds = ['MSG-2026-001', 'MSG-2026-002', 'MSG-2026-003', 'MSG-2026-004'];
  const dummyNames = ['Budi Santoso', 'Siti Rahmawati', 'Ahmad Fauzan', 'Nadia Safitri'];
  const dummyEmails = [
    'budi.santoso@bem-dewantara.ac.id',
    'siti.rahma@hmti.org',
    'fauzan@mapala-dewantara.id',
    'nadia.safitri@politeknik-partner.ac.id',
  ];

  if (dummyIds.includes(msg.id)) return true;
  if (dummyNames.includes(msg.name)) return true;
  if (dummyEmails.includes(msg.email)) return true;
  return false;
};

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  defaultParSubmissions,
  defaultHumasMedparts,
  defaultKkmOrders,
  defaultKkmCashflow,
  defaultArchiveDocs,
  defaultSuratLog,
  defaultAssets,
  defaultFinanceTransactions,
  defaultAttendanceList,
  defaultAttendanceSessions,
  defaultActivities,
  defaultModuleStatuses,
} from '../data/defaultModulesData';

// Storage Keys
export const STORAGE_KEYS = {
  PAR: 'teradesk_par_submissions_v1',
  HUMAS: 'teradesk_humas_medparts_v1',
  KKM_ORDERS: 'teradesk_kkm_orders_v1',
  KKM_CASHFLOW: 'teradesk_kkm_cashflow_v1',
  ARCHIVE_DOCS: 'teradesk_archive_docs_v1',
  SURAT_LOG: 'teradesk_surat_log_v1',
  ASSETS: 'teradesk_assets_v1',
  FINANCE: 'teradesk_finance_v1',
  ATTENDANCE: 'teradesk_attendance_v5',
  ATTENDANCE_SESSIONS: 'teradesk_attendance_sessions_v5',
  ACTIVITIES: 'teradesk_activities_archive_v1',
  MODULE_STATUSES: 'teradesk_module_statuses_v1',
};

// Filter data dummy presensi lama agar tidak bangkit kembali
export const isDummyAttendanceSession = (s) => {
  if (!s || typeof s !== 'object') return true;
  const title = (s.title || '').trim().toLowerCase();
  if (
    title.includes('rapat pleno koordinasi ldk') ||
    title.includes('evaluasi mingguan tim desain') ||
    title.includes('briefing panitia bazar') ||
    s.id === 'SES-2026-001' ||
    s.id === 'SES-2026-002' ||
    s.id === 'SES-2026-003'
  ) {
    return true;
  }
  return false;
};

export const isDummyAttendanceRecord = (r) => {
  if (!r || typeof r !== 'object') return true;
  if (['ATT-01', 'ATT-02', 'ATT-03', 'ATT-04', 'ATT-05', 'ATT-06'].includes(r.id)) return true;
  if (['SES-2026-001', 'SES-2026-002', 'SES-2026-003'].includes(r.sessionId)) return true;
  if (typeof r.time === 'string' && r.time.includes('WIB')) return true;
  const dummyNames = ['Ahmad Fauzi', 'Nadia Safitri', 'Reza Fahrezi', 'Bagas Aditya', 'Rian Pratama', 'Siti Aminah'];
  if (dummyNames.includes(r.name) && (!r.nim || r.nim === '-' || r.nim === '')) return true;
  return false;
};

// Local Storage Safe Helpers
export const loadLocalData = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    if (key === STORAGE_KEYS.ATTENDANCE) {
      localStorage.removeItem('teradesk_attendance_v1');
      localStorage.removeItem('teradesk_attendance_v2');
      localStorage.removeItem('teradesk_attendance_v3');
      localStorage.removeItem('teradesk_attendance_v4');
    }
    if (key === STORAGE_KEYS.ATTENDANCE_SESSIONS) {
      localStorage.removeItem('teradesk_attendance_sessions_v1');
      localStorage.removeItem('teradesk_attendance_sessions_v2');
      localStorage.removeItem('teradesk_attendance_sessions_v3');
      localStorage.removeItem('teradesk_attendance_sessions_v4');
    }
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && Array.isArray(parsed)) {
        if (key === STORAGE_KEYS.ATTENDANCE_SESSIONS) {
          const cleaned = parsed.filter((s) => !isDummyAttendanceSession(s));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
          return cleaned;
        }
        if (key === STORAGE_KEYS.ATTENDANCE) {
          const cleaned = parsed.filter((r) => !isDummyAttendanceRecord(r));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
          return cleaned;
        }
        return parsed;
      }
      if (!Array.isArray(fallback) && typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`[Storage Read Error: ${key}]:`, err);
  }
  return fallback;
};

export const saveLocalData = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Storage Write Error: ${key}]:`, err);
  }
};

// Firestore Field Sanitizer (strips undefined to avoid Firestore rejections)
export const sanitizeForFirestore = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        clean[key] = sanitizeForFirestore(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean;
};

/**
 * Generic Firestore Subscription & Sync Factory
 */
const createCollectionSync = ({ collectionName, storageKey, seedData }) => {
  const subscribe = (onUpdate, onError) => {
    if (!isFirebaseConfigured || !db) return () => {};

    try {
      const colRef = collection(db, collectionName);
      let isFirst = true;

      return onSnapshot(
        colRef,
        async (snapshot) => {
          let cloudItems = snapshot.docs.map((d) => ({
            ...d.data(),
            id: d.id,
          }));

          // Filter out dummy attendance data from cloud if any
          if (storageKey === STORAGE_KEYS.ATTENDANCE_SESSIONS) {
            const dummies = cloudItems.filter((s) => isDummyAttendanceSession(s));
            if (dummies.length > 0) {
              dummies.forEach((d) => {
                try {
                  deleteDoc(doc(db, collectionName, String(d.id)));
                } catch (e) {
                  console.warn(`[Firestore Clean Dummy Error]:`, e);
                }
              });
              cloudItems = cloudItems.filter((s) => !isDummyAttendanceSession(s));
            }
          } else if (storageKey === STORAGE_KEYS.ATTENDANCE) {
            const dummies = cloudItems.filter((r) => isDummyAttendanceRecord(r));
            if (dummies.length > 0) {
              dummies.forEach((d) => {
                try {
                  deleteDoc(doc(db, collectionName, String(d.id)));
                } catch (e) {
                  console.warn(`[Firestore Clean Dummy Record Error]:`, e);
                }
              });
              cloudItems = cloudItems.filter((r) => !isDummyAttendanceRecord(r));
            }
          }

          if (isFirst) {
            isFirst = false;
            // Jika koleksi cloud masih kosong, lakukan inisialisasi dari seed data
            if (cloudItems.length === 0 && Array.isArray(seedData) && seedData.length > 0) {
              for (const item of seedData) {
                try {
                  const cleanItem = sanitizeForFirestore(item);
                  await setDoc(doc(db, collectionName, String(item.id)), cleanItem, { merge: true });
                } catch (e) {
                  console.warn(`[Firestore Seed Error: ${collectionName}]:`, e);
                }
              }
              onUpdate(seedData);
              saveLocalData(storageKey, seedData);
              return;
            }
          }

          onUpdate(cloudItems);
          saveLocalData(storageKey, cloudItems);
        },
        (error) => {
          console.warn(`[Firestore Listen Error: ${collectionName}]:`, error);
          if (onError) onError(error);
        }
      );
    } catch (err) {
      console.warn(`[Firestore Setup Error: ${collectionName}]:`, err);
      return () => {};
    }
  };

  const addItem = async (item) => {
    if (!item?.id) return;
    const clean = sanitizeForFirestore(item);
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, collectionName, String(item.id)), clean, { merge: true });
      } catch (err) {
        console.warn(`[Firestore Add Error: ${collectionName}]:`, err);
      }
    }
  };

  const updateItem = async (id, fields) => {
    if (!id) return;
    const clean = sanitizeForFirestore(fields);
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, collectionName, String(id)), clean, { merge: true });
      } catch (err) {
        console.warn(`[Firestore Update Error: ${collectionName}]:`, err);
      }
    }
  };

  const deleteItem = async (id) => {
    if (!id) return;
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, collectionName, String(id)));
      } catch (err) {
        console.warn(`[Firestore Delete Error: ${collectionName}]:`, err);
      }
    }
  };

  return { subscribe, addItem, updateItem, deleteItem };
};

// 1. PAR SUBMISSIONS
export const parSync = createCollectionSync({
  collectionName: 'par_submissions',
  storageKey: STORAGE_KEYS.PAR,
  seedData: defaultParSubmissions,
});

// 2. HUMAS MEDPARTS
export const humasSync = createCollectionSync({
  collectionName: 'humas_medparts',
  storageKey: STORAGE_KEYS.HUMAS,
  seedData: defaultHumasMedparts,
});

// 3. KKM MERCHANDISE ORDERS
export const kkmOrdersSync = createCollectionSync({
  collectionName: 'kkm_orders',
  storageKey: STORAGE_KEYS.KKM_ORDERS,
  seedData: defaultKkmOrders,
});

// 4. KKM CASHFLOW TRANSACTIONS
export const kkmCashflowSync = createCollectionSync({
  collectionName: 'kkm_cashflow',
  storageKey: STORAGE_KEYS.KKM_CASHFLOW,
  seedData: defaultKkmCashflow,
});

// 5. ARCHIVE & E-SURAT DOCS
export const archiveDocsSync = createCollectionSync({
  collectionName: 'archive_docs',
  storageKey: STORAGE_KEYS.ARCHIVE_DOCS,
  seedData: defaultArchiveDocs,
});

// 6. SURAT LOG (NOMOR SURAT RESMI ADMIN)
export const suratLogSync = createCollectionSync({
  collectionName: 'surat_log',
  storageKey: STORAGE_KEYS.SURAT_LOG,
  seedData: defaultSuratLog,
});

// 7. ASSETS & INVENTARIS
export const assetsSync = createCollectionSync({
  collectionName: 'assets_inventory',
  storageKey: STORAGE_KEYS.ASSETS,
  seedData: defaultAssets,
});

// 8. FINANCE / KAS & REIMBURSEMENT
export const financeSync = createCollectionSync({
  collectionName: 'finance_transactions',
  storageKey: STORAGE_KEYS.FINANCE,
  seedData: defaultFinanceTransactions,
});

// 9. ATTENDANCE / PRESENSI
export const attendanceSync = createCollectionSync({
  collectionName: 'attendance_records',
  storageKey: STORAGE_KEYS.ATTENDANCE,
  seedData: defaultAttendanceList,
});

export const attendanceSessionsSync = createCollectionSync({
  collectionName: 'attendance_sessions',
  storageKey: STORAGE_KEYS.ATTENDANCE_SESSIONS,
  seedData: defaultAttendanceSessions,
});

// 10. ACTIVITY ARCHIVE / ARSIP KEGIATAN
export const activitiesSync = createCollectionSync({
  collectionName: 'activity_archive',
  storageKey: STORAGE_KEYS.ACTIVITIES,
  seedData: defaultActivities,
});

// 11. MODULE STATUSES (SINGLE DOC SYNC)
export const subscribeModuleStatuses = (onUpdate) => {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    return onSnapshot(
      doc(db, 'system_settings', 'module_statuses'),
      async (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          onUpdate(cloudData);
          saveLocalData(STORAGE_KEYS.MODULE_STATUSES, cloudData);
        } else {
          // Inisialisasi awal
          try {
            await setDoc(doc(db, 'system_settings', 'module_statuses'), defaultModuleStatuses);
          } catch (e) {
            console.warn('[Firestore Module Statuses Seed Error]:', e);
          }
        }
      },
      (err) => console.warn('[Firestore Module Statuses Listen Error]:', err)
    );
  } catch (err) {
    console.warn('[Firestore Module Statuses Error]:', err);
    return () => {};
  }
};

export const updateModuleStatusInDb = async (newStatuses) => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'system_settings', 'module_statuses'), sanitizeForFirestore(newStatuses), { merge: true });
    } catch (err) {
      console.warn('[Firestore Module Status Update Error]:', err);
    }
  }
};


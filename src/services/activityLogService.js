import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const COLLECTION_NAME = 'activity_logs';

/**
 * Berlangganan (real-time listener) pembaruan log aktivitas dari Firestore.
 * Callback akan dipanggil setiap kali ada user baru login atau submit form di perangkat mana pun.
 */
export const subscribeActivityLogs = (onUpdate, onError) => {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(logs);
      },
      (error) => {
        console.warn('⚠️ [Firestore Logs] Gagal berlangganan listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('⚠️ [Firestore Logs] Subscription error:', error);
    return () => {};
  }
};

/**
 * Menyimpan rekam log aktivitas baru ke Firestore.
 * Terpicu otomatis saat login pengurus atau submit formulir modul.
 */
export const addActivityLogToDb = async (logItem) => {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const docId = logItem.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const docRef = doc(db, COLLECTION_NAME, docId);
    
    // Pastikan createdAt server timestamp disertakan untuk pengurutan real-time
    const payload = {
      ...logItem,
      id: docId,
      createdAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
    return docId;
  } catch (error) {
    console.error('❌ [Firestore Logs] Gagal menambahkan log ke cloud:', error);
    return null;
  }
};

/**
 * Menghapus seluruh log aktivitas dari database Firestore.
 */
export const clearActivityLogsFromDb = async () => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('❌ [Firestore Logs] Gagal membersihkan log di cloud:', error);
  }
};

/**
 * Mereset log aktivitas di cloud kembali ke dataset bawaan resmi.
 */
export const resetActivityLogsInDb = async (defaultLogs = []) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    // 1. Bersihkan koleksi saat ini
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    // 2. Isi kembali dengan default logs
    defaultLogs.forEach((item, index) => {
      const docRef = doc(db, COLLECTION_NAME, item.id || `log-default-${index + 1}`);
      batch.set(docRef, {
        ...item,
        createdAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('❌ [Firestore Logs] Gagal mereset log di cloud:', error);
  }
};

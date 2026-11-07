import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const COLLECTION_NAME = 'consultations';

/**
 * Berlangganan (real-time listener) pembaruan pesan konsultasi dari formulir Kontak Kami.
 */
export const subscribeConsultations = (onUpdate, onError) => {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onUpdate(messages);
      },
      (error) => {
        console.warn('⚠️ [Firestore Consultations] Listener error:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('⚠️ [Firestore Consultations] Subscription failed:', error);
    return () => {};
  }
};

/**
 * Mengirim pesan konsultasi baru ke Cloud Firestore.
 */
export const addConsultationToDb = async (messageData) => {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const docId = messageData.id || `MSG-2026-${Date.now()}`;
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, {
      ...messageData,
      id: docId,
      createdAt: serverTimestamp(),
    });
    return docId;
  } catch (error) {
    console.error('❌ [Firestore Consultations] Gagal mengirim pesan ke cloud:', error);
    return null;
  }
};

/**
 * Memperbarui status konsultasi (Baru / Diproses / Selesai).
 */
export const updateConsultationStatusInDb = async (id, status) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      isRead: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ [Firestore Consultations] Gagal update status di cloud:', error);
  }
};

/**
 * Menghapus pesan konsultasi dari Cloud Firestore.
 */
export const deleteConsultationFromDb = async (id) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('❌ [Firestore Consultations] Gagal menghapus pesan di cloud:', error);
  }
};

/**
 * Mereset data konsultasi ke pesan default.
 */
export const resetConsultationsInDb = async (defaultMessages = []) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    defaultMessages.forEach((item, index) => {
      const docRef = doc(db, COLLECTION_NAME, item.id || `MSG-DEFAULT-${index + 1}`);
      batch.set(docRef, {
        ...item,
        createdAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('❌ [Firestore Consultations] Gagal mereset konsultasi di cloud:', error);
  }
};


import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { initialDefaultTickets, sortTicketsNewestFirst } from '../data/defaultTickets';

const COLLECTION_NAME = 'design_tickets';

/**
 * Berlangganan (real-time listener) pembaruan tiket request desain dari Firestore.
 * Sinkronisasi seketika saat ada permohonan tiket baru di deployment maupun localhost,
 * otomatis diurutkan dari yang paling baru di atas.
 */
export const subscribeTickets = (onUpdate, onError, getLocalTickets) => {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let isFirstLoad = true;

    return onSnapshot(
      colRef,
      async (snapshot) => {
        let cloudTickets = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));

        if (isFirstLoad) {
          isFirstLoad = false;
          const localTickets = typeof getLocalTickets === 'function' ? getLocalTickets() : [];

          // Kasus 1: Koleksi di cloud masih kosong, lakukan inisialisasi / seeding awal
          if (cloudTickets.length === 0) {
            const seedList = localTickets && localTickets.length > 0 ? localTickets : initialDefaultTickets;
            for (const tkt of seedList) {
              try {
                await setDoc(doc(db, COLLECTION_NAME, String(tkt.id)), {
                  ...tkt,
                  createdAt: tkt.createdAt || new Date().toISOString(),
                  createdTimestamp: tkt.createdTimestamp || Date.now(),
                }, { merge: true });
              } catch (e) {
                console.warn('⚠️ [Firestore Tickets] Gagal seeding tiket:', e);
              }
            }
            onUpdate(sortTicketsNewestFirst(seedList));
            return;
          }

          // Kasus 2: Cloud sudah ada tiket, periksa apakah ada tiket lokal yang belum tersinkron
          if (localTickets && localTickets.length > 0) {
            const cloudIdSet = new Set(cloudTickets.map((t) => String(t.id)));
            const missingInCloud = localTickets.filter((t) => !cloudIdSet.has(String(t.id)));

            if (missingInCloud.length > 0) {
              for (const tkt of missingInCloud) {
                try {
                  await setDoc(doc(db, COLLECTION_NAME, String(tkt.id)), {
                    ...tkt,
                    createdAt: tkt.createdAt || new Date().toISOString(),
                    createdTimestamp: tkt.createdTimestamp || Date.now(),
                  }, { merge: true });
                  cloudTickets.unshift(tkt);
                } catch (e) {
                  console.warn('⚠️ [Firestore Tickets] Gagal sinkronkan tiket lokal ke cloud:', e);
                }
              }
            }
          }
        }

        if (cloudTickets.length > 0) {
          onUpdate(sortTicketsNewestFirst(cloudTickets));
        }
      },
      (error) => {
        console.warn('⚠️ [Firestore Tickets] Gagal berlangganan listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('⚠️ [Firestore Tickets] Subscription error:', error);
    return () => {};
  }
};

/**
 * Menyimpan tiket request desain baru ke Firestore.
 * Menyimpan timestamp numerik dan ISO string agar selalu urut terbaru di posisi atas.
 */
export const addTicketToDb = async (ticket) => {
  if (!isFirebaseConfigured || !db || !ticket?.id) return null;

  try {
    const docRef = doc(db, COLLECTION_NAME, String(ticket.id));
    const nowIso = new Date().toISOString();
    await setDoc(docRef, {
      ...ticket,
      id: String(ticket.id),
      createdAt: ticket.createdAt || nowIso,
      createdTimestamp: ticket.createdTimestamp || Date.now(),
    }, { merge: true });
    return String(ticket.id);
  } catch (error) {
    console.error('❌ [Firestore Tickets] Gagal menambahkan tiket ke cloud:', error);
    return null;
  }
};

/**
 * Memperbarui status / desainer tiket di Firestore.
 */
export const updateTicketInDb = async (ticketId, updatedFields) => {
  if (!isFirebaseConfigured || !db || !ticketId) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, String(ticketId));
    await updateDoc(docRef, {
      ...updatedFields,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ [Firestore Tickets] Gagal memperbarui status tiket di cloud:', error);
  }
};

/**
 * Menghapus tiket dari Firestore.
 */
export const deleteTicketFromDb = async (ticketId) => {
  if (!isFirebaseConfigured || !db || !ticketId) return;

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, String(ticketId)));
  } catch (error) {
    console.error('❌ [Firestore Tickets] Gagal menghapus tiket di cloud:', error);
  }
};

/**
 * Mereset tiket di Firestore kembali ke daftar tiket bawaan.
 */
export const resetTicketsInDb = async (defaultTickets = initialDefaultTickets) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);

    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    defaultTickets.forEach((tkt) => {
      const docRef = doc(db, COLLECTION_NAME, String(tkt.id));
      batch.set(docRef, {
        ...tkt,
        createdAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('❌ [Firestore Tickets] Gagal mereset tiket di cloud:', error);
  }
};


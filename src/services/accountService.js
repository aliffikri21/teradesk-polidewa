import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { initialDefaultAccounts } from '../data/defaultAccounts';

const COLLECTION_NAME = 'accounts';

/**
 * Berlangganan (real-time listener) pembaruan akun pengguna dari Firestore.
 * Sinkronisasi instan saat akun baru ditambah, password diubah, atau akun dihapus di perangkat mana pun.
 */
export const subscribeAccounts = (onUpdate, onError, getLocalAccounts) => {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let isFirstLoad = true;

    return onSnapshot(
      colRef,
      async (snapshot) => {
        const cloudAccounts = snapshot.docs.map((d) => ({
          ...d.data(),
          nim: d.id,
        }));

        if (isFirstLoad) {
          isFirstLoad = false;
          const localAccounts = typeof getLocalAccounts === 'function' ? getLocalAccounts() : [];

          // Kasus 1: Koleksi di cloud masih kosong, lakukan inisialisasi / seeding awal
          if (cloudAccounts.length === 0) {
            const seedList = localAccounts && localAccounts.length > 0 ? localAccounts : initialDefaultAccounts;
            for (const acc of seedList) {
              try {
                await setDoc(doc(db, COLLECTION_NAME, String(acc.nim)), acc, { merge: true });
              } catch (e) {
                console.warn('⚠️ [Firestore Accounts] Gagal seeding akun:', e);
              }
            }
            onUpdate(seedList);
            return;
          }

          // Kasus 2: Cloud sudah ada akun, periksa apakah ada akun lokal yang belum tersinkron ke cloud
          if (localAccounts && localAccounts.length > 0) {
            const cloudNimSet = new Set(cloudAccounts.map((a) => String(a.nim)));
            const missingInCloud = localAccounts.filter((a) => !cloudNimSet.has(String(a.nim)));

            if (missingInCloud.length > 0) {
              for (const acc of missingInCloud) {
                try {
                  await setDoc(doc(db, COLLECTION_NAME, String(acc.nim)), acc, { merge: true });
                  cloudAccounts.unshift(acc);
                } catch (e) {
                  console.warn('⚠️ [Firestore Accounts] Gagal sinkronkan akun lokal ke cloud:', e);
                }
              }
            }
          }
        }

        if (cloudAccounts.length > 0) {
          onUpdate(cloudAccounts);
        }
      },
      (error) => {
        console.warn('⚠️ [Firestore Accounts] Gagal berlangganan listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('⚠️ [Firestore Accounts] Subscription error:', error);
    return () => {};
  }
};

/**
 * Menyimpan akun baru ke Firestore.
 */
export const addAccountToDb = async (account) => {
  if (!isFirebaseConfigured || !db || !account?.nim) return null;

  try {
    const docRef = doc(db, COLLECTION_NAME, String(account.nim));
    await setDoc(docRef, { ...account, nim: String(account.nim) }, { merge: true });
    return String(account.nim);
  } catch (error) {
    console.error('❌ [Firestore Accounts] Gagal menambahkan akun ke cloud:', error);
    return null;
  }
};

/**
 * Memperbarui akun di Firestore.
 */
export const updateAccountInDb = async (originalNim, updatedAccount) => {
  if (!isFirebaseConfigured || !db || !originalNim) return;

  try {
    const origKey = String(originalNim);
    const newKey = String(updatedAccount.nim);

    if (origKey !== newKey) {
      // NIM berubah: hapus dokumen lama, buat dokumen baru
      await deleteDoc(doc(db, COLLECTION_NAME, origKey));
      await setDoc(doc(db, COLLECTION_NAME, newKey), { ...updatedAccount, nim: newKey });
    } else {
      await setDoc(doc(db, COLLECTION_NAME, origKey), updatedAccount, { merge: true });
    }
  } catch (error) {
    console.error('❌ [Firestore Accounts] Gagal memperbarui akun di cloud:', error);
  }
};

/**
 * Memperbarui kata sandi akun di Firestore.
 */
export const updatePasswordInDb = async (nim, newPassword) => {
  if (!isFirebaseConfigured || !db || !nim) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, String(nim));
    await updateDoc(docRef, { password: newPassword });
  } catch (error) {
    console.error('❌ [Firestore Accounts] Gagal memperbarui kata sandi di cloud:', error);
  }
};

/**
 * Menghapus akun dari Firestore.
 */
export const deleteAccountFromDb = async (nim) => {
  if (!isFirebaseConfigured || !db || !nim) return;

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, String(nim)));
  } catch (error) {
    console.error('❌ [Firestore Accounts] Gagal menghapus akun di cloud:', error);
  }
};

/**
 * Mereset seluruh akun di Firestore kembali ke daftar akun bawaan.
 */
export const resetAccountsInDb = async (defaultAccounts = initialDefaultAccounts) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);

    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    defaultAccounts.forEach((acc) => {
      const docRef = doc(db, COLLECTION_NAME, String(acc.nim));
      batch.set(docRef, acc);
    });

    await batch.commit();
  } catch (error) {
    console.error('❌ [Firestore Accounts] Gagal mereset akun di cloud:', error);
  }
};

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Validasi apakah konfigurasi Firebase sudah diisi dengan benar
export const isFirebaseConfigured = Boolean(
  apiKey &&
  projectId &&
  apiKey !== 'your_api_key_here' &&
  projectId !== 'your_project_id'
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.info('🔥 [TeraDesk Firebase] Terhubung ke Cloud Firestore:', projectId);
  } catch (error) {
    console.warn('⚠️ [TeraDesk Firebase] Gagal inisialisasi Firebase, beralih ke mode offline/localStorage:', error);
    db = null;
  }
} else {
  console.info('ℹ️ [TeraDesk Firebase] Berjalan dalam mode lokal (localStorage). Isi .env.local untuk mengaktifkan sinkronisasi Cloud Firestore.');
}

export { app, db };


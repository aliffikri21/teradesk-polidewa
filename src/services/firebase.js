import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const fallbackConfig = {
  apiKey: 'AIzaSyCZMj8NQXuxrp3Ek4-rQej7967PfaWwtx0',
  authDomain: 'teradesk-781cd.firebaseapp.com',
  projectId: 'teradesk-781cd',
  storageBucket: 'teradesk-781cd.firebasestorage.app',
  messagingSenderId: '890006695734',
  appId: '1:890006695734:web:9d9d61def88155487b4d97',
  measurementId: 'G-310NEG6XYM',
};

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId;

// Validasi apakah konfigurasi Firebase sudah diisi dengan benar
export const isFirebaseConfigured = Boolean(
  apiKey &&
  projectId &&
  apiKey !== 'your_api_key_here' &&
  projectId !== 'your_project_id'
);

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
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

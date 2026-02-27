// ─── Firebase Konfigürasyonu ───────────────────────────────
import { initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWQN5caYDCTzl9al4vc85ejhsY4PCZJVM",
  authDomain: "arge-dashboard.firebaseapp.com",
  projectId: "arge-dashboard",
  storageBucket: "arge-dashboard.firebasestorage.app",
  messagingSenderId: "74269180972",
  appId: "1:74269180972:web:319328fa4e4c876033bd89"
};

const app = initializeApp(firebaseConfig);

// ZORUNLU Long Polling — Üniversite ağları WebSocket'i blokluyor
// memoryLocalCache: IndexedDB offline cache'i kapatır — eski hatalı kuyruk temizlenir
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: memoryLocalCache(),
});

export { db };

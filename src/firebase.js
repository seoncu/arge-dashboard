// ─── Firebase Konfigürasyonu ───────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWQN5caYDCTzl9al4vc85ejhsY4PCZJVM",
  authDomain: "arge-dashboard.firebaseapp.com",
  projectId: "arge-dashboard",
  storageBucket: "arge-dashboard.firebasestorage.app",
  messagingSenderId: "74269180972",
  appId: "1:74269180972:web:319328fa4e4c876033bd89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// NOT: enableIndexedDbPersistence KALDIRILDI!
// Lokal cache, çoklu tarayıcı senkronizasyonunu engelliyor.
// Persistence olmadan: setDoc → doğrudan sunucu, onSnapshot → sunucudan push, getDoc → sunucudan çek.

export { db };

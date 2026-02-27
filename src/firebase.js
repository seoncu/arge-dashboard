// ─── Firebase Konfigürasyonu ───────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

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

// Offline destek — internet kesilse bile uygulama çalışmaya devam eder
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Firestore persistence: birden fazla sekme açık, sadece birinde offline destek aktif");
  } else if (err.code === "unimplemented") {
    console.warn("Firestore persistence: bu tarayıcı desteklemiyor");
  }
});

export { db };

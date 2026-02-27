// ─── Firebase Konfigürasyonu ───────────────────────────────
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWQN5caYDCTzl9al4vc85ejhsY4PCZJVM",
  authDomain: "arge-dashboard.firebaseapp.com",
  projectId: "arge-dashboard",
  storageBucket: "arge-dashboard.firebasestorage.app",
  messagingSenderId: "74269180972",
  appId: "1:74269180972:web:319328fa4e4c876033bd89"
};

const app = initializeApp(firebaseConfig);

// initializeFirestore ile özel ayarlar:
// - experimentalAutoDetectLongPolling: WebSocket bloklandığında otomatik Long Polling'e geçer
//   (üniversite ağları, kurumsal proxy'ler, bazı firewall'lar WebSocket'i engeller)
// - Persistence KAPALI: lokal cache çoklu tarayıcı senkronizasyonunu engelliyordu
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

console.log("[FIREBASE] Firestore başlatıldı (autoDetectLongPolling: ON)");

export { db };

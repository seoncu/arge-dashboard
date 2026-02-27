import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const AuthContext = createContext(null);

// Basit SHA-256 hash (Web Crypto API)
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Rol hiyerarşisi: master(4) > admin(3) > editor(2) > viewer(1)
const ROLE_PRIORITY = { master: 4, admin: 3, editor: 2, viewer: 1 };
const ROLE_NAMES = { master: "Master Yönetici", admin: "Yönetici", editor: "Editör", viewer: "Görüntüleyici" };

// Kullanıcılar
const USERS = [
  {
    username: "master",
    passwordHash: null,
    plainForInit: "Master@ArGe2026!",
    role: "master",
    displayName: "Master Yönetici",
  },
  {
    username: "admin",
    passwordHash: null,
    plainForInit: "ArGe@Aof2026",
    role: "admin",
    displayName: "Yönetici",
  },
  {
    username: "editor",
    passwordHash: null,
    plainForInit: "ArGeEdit2026!",
    role: "editor",
    displayName: "Editör",
  },
  {
    username: "user",
    passwordHash: null,
    plainForInit: "AofView2026!",
    role: "viewer",
    displayName: "Görüntüleyici",
  },
];

// Hash'leri başlatmak için (ilk yükleme)
let usersReady = null;
async function getUsers() {
  if (usersReady) return usersReady;
  usersReady = Promise.all(
    USERS.map(async (u) => ({
      ...u,
      passwordHash: await hashPassword(u.plainForInit),
    }))
  );
  return usersReady;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Oturum kontrolü (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("arge_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.role) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem("arge_auth");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // 1. Kullanıcı doğrulama
    const users = await getUsers();
    const pwHash = await hashPassword(password);
    const found = users.find(
      (u) => u.username === username && u.passwordHash === pwHash
    );
    if (!found) {
      return { success: false, error: "Kullanıcı adı veya şifre hatalı" };
    }

    const myPriority = ROLE_PRIORITY[found.role] || 0;
    const sessionId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

    // 2. Hiyerarşik oturum kontrolü (Firestore)
    try {
      const sessionDocRef = doc(db, "arge", "_active_session");
      const snap = await getDoc(sessionDocRef);

      if (snap.exists()) {
        const s = snap.data();
        const elapsed = Date.now() - (s.heartbeat || 0);
        const existingPriority = ROLE_PRIORITY[s.role] || 0;

        // Oturum hâlâ aktif mi? (60sn heartbeat timeout)
        if (elapsed < 60000) {
          if (myPriority < existingPriority) {
            // Alt hiyerarşi — GİRİŞ REDDEDİLDİ
            const roleName = (ROLE_NAMES[s.role] || s.role).toLowerCase();
            return {
              success: false,
              error: `⚠️ Şu anda ${roleName}, uygulamayı kullandığından sisteme giriş yapılamaz. Lütfen daha sonra deneyin ya da master yöneticinizle görüşün.`
            };
          }
          // Aynı veya üst hiyerarşi → öncekini at, oturumu al
        }
        // else: heartbeat eski (>60sn), oturum ölü → al
      }

      // 3. Oturumu Firestore'a kaydet
      await setDoc(sessionDocRef, {
        sessionId,
        user: found.displayName,
        username: found.username,
        role: found.role,
        priority: myPriority,
        heartbeat: Date.now(),
      });
    } catch (e) {
      console.warn("Session claim error:", e);
      // Firestore hatası olsa bile login'e izin ver
    }

    // 4. Local session oluştur
    const session = {
      username: found.username,
      role: found.role,
      displayName: found.displayName,
      sessionId,
    };
    setUser(session);
    localStorage.setItem("arge_auth", JSON.stringify(session));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("arge_auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

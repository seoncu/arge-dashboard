import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Basit SHA-256 hash (Web Crypto API)
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Önceden hash'lenmiş şifreler
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
    const users = await getUsers();
    const pwHash = await hashPassword(password);
    const found = users.find(
      (u) => u.username === username && u.passwordHash === pwHash
    );
    if (found) {
      const session = {
        username: found.username,
        role: found.role,
        displayName: found.displayName,
      };
      setUser(session);
      localStorage.setItem("arge_auth", JSON.stringify(session));
      return { success: true };
    }
    return { success: false, error: "Kullanıcı adı veya şifre hatalı" };
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

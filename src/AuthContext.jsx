import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Basit SHA-256 hash (Web Crypto API)
async function hashPassword(password) {
  var msgBuffer = new TextEncoder().encode(password);
  var hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(function(b) { return b.toString(16).padStart(2, "0"); }).join("");
}

// Rol yetkileri: master > admin > editor > viewer
// Artık hiyerarşi GİRİŞ ENGELİ değil, sadece YETKİ belirler.
// Herkes aynı anda giriş yapabilir (Notion gibi).

var USERS = [
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

// Hash'leri başlatmak için
var usersReady = null;
async function getUsers() {
  if (usersReady) return usersReady;
  usersReady = Promise.all(
    USERS.map(async function(u) {
      return {
        username: u.username,
        passwordHash: await hashPassword(u.plainForInit),
        plainForInit: u.plainForInit,
        role: u.role,
        displayName: u.displayName,
      };
    })
  );
  return usersReady;
}

export function AuthProvider({ children }) {
  var _state = useState(null);
  var user = _state[0];
  var setUser = _state[1];
  var _loading = useState(true);
  var loading = _loading[0];
  var setLoading = _loading[1];

  // Oturum kontrolü (localStorage)
  useEffect(function() {
    var saved = localStorage.getItem("arge_auth");
    if (saved) {
      try {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.role) {
          // Eski kayıtlarda tag yoksa ekle
          if (!parsed.displayName || !parsed.displayName.includes("#")) {
            var tag = Math.floor(1000 + Math.random() * 9000);
            parsed.displayName = (parsed.baseDisplayName || parsed.displayName || parsed.username) + " #" + tag;
            parsed.baseDisplayName = parsed.baseDisplayName || parsed.displayName;
            localStorage.setItem("arge_auth", JSON.stringify(parsed));
          }
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem("arge_auth");
      }
    }
    setLoading(false);
  }, []);

  var login = async function(username, password) {
    try {
      var users = await getUsers();
      var pwHash = await hashPassword(password);
      var found = users.find(function(u) {
        return u.username === username && u.passwordHash === pwHash;
      });
      if (!found) {
        return { success: false, error: "Kullanıcı adı veya şifre hatalı" };
      }

      // Her giriş benzersiz — aynı hesabı paylaşan kişiler ayırt edilsin
      var tag = Math.floor(1000 + Math.random() * 9000); // 4 haneli rastgele: 1000-9999
      var session = {
        username: found.username,
        role: found.role,
        displayName: found.displayName + " #" + tag,
        baseDisplayName: found.displayName,
      };
      setUser(session);
      localStorage.setItem("arge_auth", JSON.stringify(session));
      return { success: true };

    } catch (err) {
      console.error("Login hatası:", err);
      return { success: false, error: "Giriş hatası: " + (err.message || "Bilinmeyen hata") };
    }
  };

  var logout = function() {
    setUser(null);
    localStorage.removeItem("arge_auth");
  };

  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout, loading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

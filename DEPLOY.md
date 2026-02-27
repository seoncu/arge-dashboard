# Ar-Ge Dashboard — Deployment Rehberi

## Gereksinimler
- Node.js 18+ (https://nodejs.org/)
- Git (https://git-scm.com/)
- GitHub hesabı (https://github.com/)

## Adım 1: Projeyi Lokalde Test Edin

```bash
cd arge-dashboard
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresine gidin.

### Giriş Bilgileri
| Kullanıcı | Şifre     | Rol          |
|-----------|-----------|--------------|
| admin     | admin2026 | Yönetici     |
| user      | user2026  | Görüntüleyici|

> Şifreleri değiştirmek için `src/AuthContext.jsx` dosyasındaki `plainForInit` değerlerini güncelleyin.

## Adım 2: GitHub'a Yükleyin

```bash
git init
git add .
git commit -m "Ar-Ge Dashboard ilk commit"
```

GitHub'da yeni repo oluşturun (örn: `arge-dashboard`), sonra:

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/arge-dashboard.git
git branch -M main
git push -u origin main
```

## Adım 3: Vercel'e Deploy Edin

1. https://vercel.com/ adresine gidin ve **GitHub ile kayıt olun**
2. **"Add New Project"** tıklayın
3. GitHub reposundan `arge-dashboard` seçin
4. **Framework Preset**: Vite olarak seçin
5. **Deploy** tıklayın

Vercel otomatik olarak `npm install` ve `npm run build` çalıştıracak. Birkaç dakika içinde siteniz hazır olacak.

## Adım 4: Özel Alan Adı (Opsiyonel)

Vercel panelinden **Settings > Domains** bölümüne giderek kendi alan adınızı ekleyebilirsiniz.

## Notlar

- **Veri Kalıcılığı**: Veriler tarayıcının localStorage'ında saklanır. Her kullanıcının tarayıcısında ayrı veri tutulur.
- **Gerçek veritabanı** için Supabase gibi bir backend eklenebilir.
- **Güncellemeler**: Kodu GitHub'da güncelleyip push ettiğinizde Vercel otomatik deploy eder.

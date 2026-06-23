# Yayın Öncesi Kontrol Listesi – Human or AI?

Son kontrol tarihi: proje durumuna göre güncelleyin.

## Otomatik kontroller (geçti)

| Kontrol | Durum |
|---------|--------|
| TypeScript (`npx tsc --noEmit`) | ✅ |
| Jest testleri (21 test) | ✅ |
| Bundle ID / package (`com.humanorai.game`) | ✅ app.json + appLinks |
| expo-notifications plugin | ✅ app.json |
| Sahte IAP/reklam UI (IS_MONETIZATION_LIVE=false) | ✅ gizli |

---

## Zorunlu – yayınlamadan önce sizin yapmanız gerekenler

### 1. Mağaza görselleri
✅ `npm run generate-assets` ile 1024×1024 icon, adaptive-icon ve 1284×2778 splash üretildi (`assets/`).

### 2. Gizlilik politikası URL
✅ `PRIVACY_POLICY_URL` → `https://uguraytekin.github.io/human-or-ai/privacy.html`  
⚠️ GitHub’a push + **Settings → Pages → Source: GitHub Actions** gerekli (`.github/workflows/pages.yml` hazır).

### 3. iOS App Store ID
- Uygulama App Store Connect’te oluşturulduktan sonra `APP_STORE_ID` alanına sayısal ID yazın.
- Böylece Ayarlar’daki “Uygulamayı değerlendir” iOS’ta çalışır.

### 4. EAS / imzalama
- `npm install -g eas-cli` → `eas login` → `eas build:configure`
- iOS: Apple Developer hesabı, sertifikalar
- Android: Play Console, imzalama anahtarı

### 5. İçerik (önerilen)
- Görseller şu an Picsum placeholder; production için kendi CDN/API’nize geçin (`src/images/config.ts`).
- Video/ses harici URL’lere bağlı; offline veya yavaş ağda “Tekrar dene” devreye girer.

### 6. Meydan okuma linki (opsiyonel)
- `CHALLENGE_SHARE_BASE_URL` boşken paylaşımda sadece **8 karakterlik kod** gider.
- Alan adınız varsa: `https://siteniz.com/challenge` yazın + deep link (`scheme: humanorai` app.json’da hazır).

### 7. Monetizasyon (reklam/IAP açacaksanız)
- `src/constants/monetization.ts` → `IS_MONETIZATION_LIVE = true`
- AdMob + gerçek IAP bağlayın (`src/monetization/ads.ts`, `docs/MONETIZATION.md`)
- Mağaza: reklam beyanı, veri güvenliği formu

---

## Mağaza metinleri

Hazır metinler: `docs/STORE_LISTING.md` (TR + EN).

---

## Manuel test (yayın öncesi 15 dk)

- [ ] Ana sayfa → Klasik oyun → doğru/yanlış → sonuç → devam
- [ ] Görsel yüklenmezse “Tekrar dene”
- [ ] Günün sorusu, meydan okuma (kod yapıştır), video turu
- [ ] Ayarlar: dil değiştir, ses örneği, seri hatırlatması (mobilde izin)
- [ ] Game over: paylaş, tekrar oyna, ana menü
- [ ] Liderlik, başarılar
- [ ] Uçak modu / zayıf ağ: uygulama çökmeden hata mesajı

---

## Bilinen sınırlamalar (v1.0.0)

- Liderlik tablosu yerel/stub (global backend yok)
- Analytics konsola log (`__DEV__`); production endpoint TODO
- Deep link (`humanorai://`) native build + associated domains gerektirir
- Reklam/IAP kapalı (`IS_MONETIZATION_LIVE = false`) – mağaza için güvenli varsayılan

---

## Hızlı komutlar

```bash
npm install
npx tsc --noEmit
npm test
npx expo start          # geliştirme
eas build --platform all --profile production   # mağaza build (EAS kurulumu sonrası)
```

# Yayın Öncesi Kontrol Listesi

Son kontrol tarihi: 17 Mart 2025 — test ✓, tsc ✓, web build ✓.

## ✅ Kod Kalitesi

- **Unit testler:** 21 test geçiyor (gameEngine, dataset, leaderboard)
- **TypeScript:** `npx tsc --noEmit` hatasız
- **Linter:** src altında hata yok
- **Production build:** `npx expo export --platform web` başarılı (dist/)

## ✅ Güvenlik

- **Gizli bilgi:** Kodda sabit API key / şifre / token yok (promptEngine _apiKey opsiyonel parametre)
- **Console:** Tüm `console.log/warn/error` __DEV__ ile sınırlı
- **ErrorBoundary:** Production’da hata detayı kullanıcıya gösterilmiyor
- **npm audit:** 4 high (tar/cacache, Expo CLI transitive). `npm audit fix` ile breaking olmadan giderilemiyor; `--force` Expo 55’e atar. Şimdilik kabul edilebilir; ileride Expo SDK yükseltmesiyle giderilebilir.

## ✅ Çok Dillilik (i18n)

- 12 dil dosyası geçerli JSON (en, tr, ar, de, es, fr, hi, id, ja, ko, pt, ru)
- tr.json tüm üst seviye anahtarlara sahip
- Eksik çeviri durumunda fallback: en

## ✅ Uygulama Yapılandırması

- **app.json:** name, slug, version, orientation, icon, splash, ios.bundleIdentifier, android.package tanımlı
- **package.json:** version 1.0.0, private: true, gerekli script’ler mevcut

- **Bağımlılıklar:** Expo SDK 52 uyumlu (react-native 0.76.9, expo-image ~2.0.7, expo-asset ~11.0.5, expo-localization ~16.0.1, async-storage 1.23.1)

## ✅ Kullanıcı Akışı

- Ana sayfa: Zorluk, mod, kategori, Liderlik, Ayarlar butonları çalışıyor
- Oyun: 50/50, Atla, REAL/AI, ses (Tap to play), video oynatıcı
- Sonuç: Sonraki / Sonuçları görüntüle → bir sonraki soru veya game over
- Oyun bitti: Paylaş, Tekrar oyna, Ana sayfa
- Ayarlar: Geri, Ses, Titreşim, Dil, Uygulamayı değerlendir (Android: Play Store), Gizlilik (link)
- Liderlik: Dönem seçimi, Geri

## 📋 Mağaza Öncesi (Hazır)

- **Linkler tek yerde:** `src/constants/appLinks.ts` – PRIVACY_POLICY_URL, APP_STORE_ID, PLAY_STORE_PACKAGE
- **Gizlilik:** `docs/privacy.html` yayına hazır; GitHub Pages (Source: /docs) ile `https://KULLANICI.github.io/REPO/privacy.html` → appLinks.ts’te PRIVACY_POLICY_URL. Metin: docs/PRIVACY.md
- **Store metinleri:** `docs/STORE_LISTING.md` – Google Play ve App Store açıklama / alt başlık / anahtar kelimeler (kopyala-yapıştır)
- **iOS “Uygulamayı değerlendir”:** App Store’da yayın sonrası `appLinks.ts` → APP_STORE_ID alanına sayısal ID yazın

## Komutlar

```bash
npm test              # Testler
npx tsc --noEmit      # TypeScript
npx expo export --platform web   # Web build
npx expo export --platform android  # Android build (EAS veya yerel)
```

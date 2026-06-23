# Human or AI?

Gerçek mi, yapay zeka mı? Görsel, ses ve videoları tahmin et; zorluk seç, güçlerini kullan, skorunu yükselt.

## Gereksinimler

- Node.js 18+
- npm veya yarn

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
npm start          # Expo dev server (QR ile cihazda açın)
npm run start:clean   # Önbelleği temizleyerek başlat
npm run web        # Tarayıcıda
npm run web:clean  # Web, önbellek temiz
npm run android    # Android emülatör / cihaz
npm run android:run   # scripts/start-android.sh ile
npm run ios        # iOS simülatör
```

## Test ve build

```bash
npm test                    # Birim testleri
npx tsc --noEmit            # TypeScript kontrolü
npx expo export --platform web      # Web build (dist/)
npx expo export --platform android  # Android (EAS veya yerel)
```

## Yapılandırma

- **Mağaza / gizlilik linkleri:** `src/constants/appLinks.ts`  
  - `PRIVACY_POLICY_URL`, `APP_STORE_ID`, `PLAY_STORE_PACKAGE`
- **Gizlilik:** Metin `docs/PRIVACY.md`, yayına hazır sayfa `docs/privacy.html` (GitHub Pages’te repo → Settings → Pages → Source: main, /docs → kaydedin; URL: `https://KULLANICI.github.io/REPO/privacy.html` → `appLinks.ts`’e yazın)
- **Mağaza listeleme metinleri (TR/EN):** `docs/STORE_LISTING.md`
- **Yayın öncesi kontrol:** `PRE_RELEASE_CHECKLIST.md`

## Lisans

Private proje.

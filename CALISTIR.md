# Human or AI? – Çalıştırma

## 1. Sunucuyu başlat

Terminalde:

```bash
cd "/Users/uguraytekin/Yeni Projeler Oyun/human-or-ai"
npx expo start
```

**Not:** `app.json` içindeki EAS `projectId` kaldırıldı; böylece Expo hesabı açmadan proje açılabiliyor. EAS Build kullanacaksan `app.json` içine `extra.eas.projectId` tekrar ekleyebilirsin.

## 2. iOS simülatörde (Expo Go)

1. Simülatörde **Expo Go** uygulamasını aç.
2. **"Enter URL manually"** (URL’i elle gir) seçeneğine tıkla.
3. Terminalde yazan adresi gir, örneğin: `exp://192.168.1.21:8081`
4. Açılınca **Human or AI?** oyunu yüklenecek.

## 3. Fiziksel cihazda (telefon)

1. Telefon ve bilgisayar aynı Wi‑Fi’de olmalı.
2. Expo Go’yu telefonda aç, **"Enter URL manually"** ile terminaldeki `exp://...` adresini gir.

## 4. Hızlı kısayollar (sunucu açıkken)

- **`i`** – iOS simülatörde açar (Expo Go kurulu olmalı).
- **`a`** – Android emülatörde açar.
- **`w`** – Tarayıcıda açar.

## 5. Oyun modları

- **Classic** – Yanlış yapana kadar devam.
- **Time Attack** – 60 saniye; süre bitince Game Over.
- **Daily Challenge** – 10 resim; tamamlanınca "Daily complete! X/10 correct".
- **Expert** – Zor AI görselleri.

## 6. Test

`npm test`

Önce sunucuyu `npx expo start` ile başlat, sonra Expo Go’da URL’i elle girersen 500 / giriş hatası almaman gerekir.

# Gelir modeli – oyuncuyu sıkmadan

Oyun **tamamen ücretsiz** oynanabilir. Gelir, isteğe bağlı reklam ve tek seferlik “reklamsız” satın almadan gelir.

## Ne var?

### 1. İsteğe bağlı rewarded reklam (Game Over)
- **Buton:** "Reklam izle → Sonraki oyunda +1 Atla"
- Oyuncu **istemezse tıklamaz**; oyun aynen devam eder.
- İzleyen, sonraki oyunda ekstra 1 Atla hakkı kazanır (ödül net).

### 2. Interstitial (ara reklam) – seyrek
- **Sadece** oyun bittiğinde (game over ekranına geçince).
- **Sıklık:** En fazla her **3 game over’da bir** (ayar: `INTERSTITIAL_EVERY_N_GAMES`).
- **Cooldown:** Son gösterimden en az **5 dakika** geçmeden tekrar gösterilmez (ayar: `INTERSTITIAL_COOLDOWN_MINUTES`).
- **Reklamsız** satın alındıysa interstitial **hiç gösterilmez**.

### 3. Reklamsız satın alma (Ayarlar)
- Ayarlar’da **"Reklamları kaldır"** (veya "Remove ads").
- Şu an **test modu:** Tek tıkla reklamsız olur (kalıcı kaydedilir).
- Production’da buraya **gerçek IAP** (Google Play Billing / App Store In-App Purchase) bağlanır; satın alma başarılı olunca `setRemoveAdsPurchased(true)` çağrılır.

### 4. Geliştirmeyi destekle (opsiyonel)
- `appLinks.ts` içinde `SUPPORT_DEVELOPMENT_URL` doluysa Ayarlar’da **"Geliştirmeyi destekle"** linki çıkar (Kahve ısmarla, Ko-fi, PayPal vb.).
- Boş bırakırsanız bu satır gizlenir.

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/constants/monetization.ts` | Interstitial sıklığı, cooldown, rewarded bonus miktarı |
| `src/monetization/ads.ts` | Reklam / IAP stub’ları; production’da AdMob + IAP bağlanır |
| `src/monetization/monetizationState.ts` | Interstitial sayacı, bonus güç (sonraki oyuna +Skip) |
| `src/constants/appLinks.ts` | `SUPPORT_DEVELOPMENT_URL` (opsiyonel) |

## Production’da yapılacaklar

1. **AdMob:**  
   - `app.json` / `app.config.js` içinde AdMob App ID.  
   - `react-native-google-mobile-ads` veya Expo uyumlu reklam paketi.  
   - `showRewardedAd()` ve `showInterstitialAd()` içinde gerçek reklam gösterimi.

2. **IAP (Reklamsız):**  
   - Google Play Billing / StoreKit ile “remove ads” ürünü.  
   - Satın alma başarılı olunca `setRemoveAdsPurchased(true)` ve kalıcı doğrulama (receipt).

3. **SUPPORT_DEVELOPMENT_URL:**  
   - İstersen Ko-fi / Buy Me a Coffee / PayPal bağış linki.

Bu yapıyla oyuncular sıkılmadan oynar; gelir isteğe bağlı reklam ve reklamsız satın almadan gelir.

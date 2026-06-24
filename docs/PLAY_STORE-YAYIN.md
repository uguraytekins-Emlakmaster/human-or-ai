# Google Play Store – Yayın rehberi (Türkçe)

Paket adı: **`com.humanorai.game`** (değiştirmeyin)

---

## A) Önce: Production `.aab` build

Keystore zaten Expo’da (preview build’de oluşturdunuz).

```bash
cd "/Users/uguraytekin/Yeni Projeler Oyun/human-or-ai"
export EXPO_TOKEN="token_buraya"
npm run build:playstore
```

- Çıktı: **`.aab`** (Android App Bundle) – Play Store bunu ister, APK değil.
- Build linki: expo.dev → proje → **Yapılar** → **production** profili → **İndir**.

---

## B) Gizlilik politikası URL (ZORUNLU – şu an 404)

Play Store, **açılan bir web sayfası** ister.

**Seçenek 1 – GitHub Pages (önerilen)**

1. Repo GitHub’da public olsun (`human-or-ai`)
2. Repo → **Settings** → **Pages**
3. **Build and deployment** → Source: **GitHub Actions**
4. `docs/privacy.html` push edilsin (workflow hazır: `.github/workflows/pages.yml`)
5. Adres: `https://uguraytekin.github.io/human-or-ai/privacy.html`
6. Tarayıcıda açılıp **404 olmamalı**

**Seçenek 2 – Google Sites (hızlı)**

1. https://sites.google.com → yeni site
2. `docs/privacy.html` metnini yapıştır → **Yayınla**
3. URL’i kopyala → `src/constants/appLinks.ts` → `PRIVACY_POLICY_URL`

---

## C) Play Store görselleri

```bash
npm run generate-assets
```

Klasör: **`docs/play-store-assets/`**

| Dosya | Play Console alanı |
|--------|---------------------|
| `icon-512.png` | Uygulama simgesi (512×512) |
| `feature-graphic-1024x500.png` | Öne çıkan grafik |

**Ekran görüntüleri (en az 2):** Telefonda APK’yı açın → ekran görüntüsü alın (Ana sayfa + oyun ekranı).

---

## D) Google Play Console

1. https://play.google.com/console – **Geliştirici hesabı** ($25, bir kez)
2. **Uygulama oluştur** → ad: **Human or AI?**
3. **Paket adı:** `com.humanorai.game` (EAS build ile aynı)

### Mağaza girişi (Türkçe metinler: `docs/STORE_LISTING.md`)

| Alan | Metin |
|------|--------|
| Kısa açıklama | Gerçek mü? Yapay zeka mı? Görsel, ses ve videoyu tahmin et; skorunu yükselt! |
| Tam açıklama | STORE_LISTING.md içindeki blok |
| Kategori | Oyun → Bilgi yarışması / Trivia |
| Gizlilik politikası URL | Yukarıdaki canlı link |

### Sürüm

1. **Test et ve yayınla** → **Üretim** (veya önce **Dahili test**)
2. **Yeni sürüm oluştur**
3. **App bundle’ları** → indirdiğiniz **`.aab`** dosyasını yükleyin
4. Sürüm notu: `İlk sürüm – Human or AI? oyunu`

### Diğer zorunlu formlar

- **İçerik derecelendirmesi** – anket (şiddet yok, genelde PEGI 3 / Everyone)
- **Veri güvenliği** – veriler cihazda; hesap yok; reklam kapalı (`IS_MONETIZATION_LIVE=false`)
- **Hedef kitle** – 13+ veya tüm yaşlar (içeriğe göre)

---

## E) Yayınla

Tüm uyarılar yeşil → **İncelemeye gönder** → Google 1–7 gün inceleyebilir.

---

## Hızlı kontrol listesi

- [ ] `npm run build:playstore` → `.aab` indirildi
- [ ] Gizlilik URL tarayıcıda açılıyor (404 değil)
- [ ] Play Console’da uygulama + paket adı doğru
- [ ] Simge 512, öne çıkan grafik, en az 2 ekran görüntüsü yüklendi
- [ ] `.aab` yüklendi, formlar tamam, incelemeye gönderildi

---

## İsteğe bağlı: EAS Submit (ileride)

Play Console’da **API erişimi** + service account JSON sonrası:

```bash
CI=false eas submit --platform android --profile production --latest
```

İlk yayın için **manuel .aab yükleme** daha kolay.

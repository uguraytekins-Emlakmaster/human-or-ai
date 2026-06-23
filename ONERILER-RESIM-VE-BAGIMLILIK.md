# Resim Kalitesi, Havuz Büyüklüğü ve Oyuncu Bağımlılığı – Öneriler

Bu dokümanda **yüksek kaliteli görsel kaynakları**, **daha büyük resim havuzu** ve **oyuncuyu bağlayacak (addiction) mekanikler** için somut öneriler var.

---

## 1. Resim kalitesi

### Şu an
- Placeholder: Picsum (800×600). Kalite ve çeşitlilik sınırlı.
- Kodda hedef: **1200×900** (`src/images/config.ts`). Production’da CDN/API ile bu çözünürlüğe çık.

### Önerilen kaynaklar

| Kaynak | Ne için | Kalite | Lisans / maliyet |
|--------|---------|--------|-------------------|
| **Unsplash API** | Gerçek fotoğraflar (real) | Yüksek, ücretsiz | API key ücretsiz, ticari kullanım OK |
| **Pexels API** | Gerçek fotoğraflar | Yüksek | API ücretsiz |
| **Stability AI / Replicate** | AI görseller | Çok gerçekçi | API ücretli, prompt ile üretim |
| **OpenAI DALL·E** | AI görseller | Yüksek | API ücretli |
| **Kendi dataset’in** | Gerçek + AI etiketli | Tam kontrol | Kendi lisansın |

### Yapılacaklar (kod tarafı)
- `src/images/config.ts`: `WIDTH`, `HEIGHT`, `POOL_SIZE` değerlerini production’a göre ayarla.
- Yeni bir modül örn. `src/images/sources/unsplash.ts`: Unsplash’ten kategoriye göre URL üret (ör. portrait, landscape). API key’i env’de tut.
- `dataset.ts` içinde `imageUri`: önce kendi CDN/API’den dene, yoksa Picsum fallback.

### Kalite ipuçları
- **Real:** Doğal ışık, makul keskinlik, “fotoğraf” hissi.
- **AI:** İnce hatalar (parmak, yazı, simetri) zorluk seviyesine göre seç; Expert’ta çok ince hatalı görseller kullan.
- Mobilde **lazy load** ve **WebP** ile hem kalite hem hız dengelenebilir.

---

## 2. Resim sayısı (havuz)

### Şu an
- **600** görsel (`IMAGE_CONFIG.POOL_SIZE`). Tek oyunda aynı resmin tekrar etme ihtimali düşük.

### Öneriler
- **Minimum 500–1000** görsel: “Hep aynı resimler” hissini kırar.
- **Kategori başına en az 50–100** görsel: portrait, animal, food, landscape vb. için ayrı havuz.
- **Zorluk seviyesine göre dağıt:** Level 1–5 için “bariz” real/AI; 16+ için “neredeyse ayırt edilemeyen” AI.
- **Daily Challenge:** Her gün farklı 10 görsel (tarih bazlı seed veya backend’den liste).

### Teknik
- Görselleri **CDN** (Cloudflare, S3+CloudFront) üzerinden servis et; uygulama sadece URL kullanır.
- Metadata (real/AI, difficulty, category) **JSON** veya **API** ile çekilebilir; `buildDataset()` bu listeyi kullanır.

---

## 3. Oyuncuyu bağlayacak (addiction) mekanikler

Oyun içinde **zaten eklenen** ve **eklenebilecek** şeyler:

### Şu an oyunda olanlar
- **Streak:** Ardışık doğru cevap; her 5’te bonus. Kaybedince “So close! You had a X streak” mesajı.
- **Streak kutlaması:** 3–10 arası streak’te “X in a row! Keep going!”.
- **Game Over mesajı:** “One more round? You can beat this.” ile tekrar oynama teşviki.
- **Daily Challenge:** Günlük 10 resim; tamamlayınca “Daily complete!”.
- **Paylaşım:** Skor paylaşımı ile sosyal kanıt ve rekabet.

### Eklenebilecek fikirler

| Mekanik | Amaç | Örnek |
|--------|------|--------|
| **Kişisel rekor (PB)** | “Bir puan daha” hissi | Game Over’da “Best: 24 – You got 23. So close!” |
| **Günlük seri** | Her gün oynatma | “You’ve played 5 days in a row 🔥” |
| **Rozetler** | Tamamlama hissi | “10 streak”, “50 doğru”, “Daily 10/10” |
| **Sınırlı can** | Değerli oyun | Günde 5 “can”, yanlışta -1; ertesi gün yenilenir |
| **Rastgele ödül** | Değişken ödül | Bazen “Double points next round!” |
| **Liderlik tablosu** | Rekabet | “You’re #12 today. Top 10 is 2 points away.” |
| **“Arkadaş X skor yaptı”** | Sosyal baskı | Bildirim: “Ayşe 30 skor yaptı. Sen 28.” |

### Kod tarafında hızlı eklenebilecekler
- **PB (personal best):** `AsyncStorage` veya context’te `bestScoreByMode`; Game Over’da göster ve “Beat your best!” yaz.
- **Günlük seri:** Son oynama tarihini sakla; açılışta “X gün üst üste” mesajı.
- **Rozetler:** `src/retention/dailyChallenge.ts` içindeki badge listesini genişlet; skor/streak koşullarına göre kilidi aç.

---

## 4. Kısa aksiyon listesi

1. **Resim:** Unsplash/Pexels API ile gerçek fotoğraflar; Stability/Replicate ile AI görseller. `config.ts` çözünürlüğünü 1200×900 (veya 1024²) yap, URL’leri CDN’den servis et.
2. **Havuz:** En az 500–600 görsel; mümkünse 1000+. Kategori ve zorluk dağılımını dengele.
3. **Bağımlılık:** PB gösterimi, günlük seri ve rozetleri ekle; “One more round” ve streak mesajları zaten var, bunları A/B test ile netleştir.
4. **Analytics:** Hangi zorlukta bırakıyorlar, streak dağılımı, günlük oynama oranı; bu verilerle zorluk ve ödül sıklığını ayarla.

Bu önerilerle hem **görsel kalitesi ve çeşitlilik** hem de **oyuncunun tekrar oynama isteği** artırılabilir.

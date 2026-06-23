# Human or AI? – Geliştirme Önerileri

Oyunun mevcut yapısına göre öncelikli geliştirme fikirleri. İstediğin sırayla uygulayabilirsin.

**Uygulanan (son güncelleme):** Cevap sonrası +puan vurgusu, "Neden?" açıklama, 5/10/20/25 seri kutlaması, Başarılar ekranı (Ayarlar > Başarılar), günlük streak (7 gün), paylaşım kartı (skor kutusu), mod alt başlıkları, liderlik servis katmanı, analytics backend stub, içerik loader hazırlığı.

---

## 1. Hızlı kazanımlar (düşük efor, yüksek etki)

### İçerik çeşitliliği
- **Gerçek Real vs AI görseller:** Şu an Picsum placeholder kullanılıyor. Gerçek “insan yapımı vs yapay zeka” karşılaştırması için:
  - Ücretsiz/CC lisanslı AI örnekleri (ör. This Person Does Not Exist, Midjourney/DALL·E örnekleri, kendi ürettiğin setler)
  - Gerçek fotoğraflar: Unsplash/Pexels API veya kendi CDN
- **Ses/metin havuzunu büyüt:** `audioDataset` ve `textDataset` içine daha fazla örnek ekle; zorluk seviyelerine göre dağıt.
- **Video turu:** `videoDataset` şu an var; “coming soon” yerine birkaç kısa örnek video ile gerçekten açılabilir (lisanslı/kısa clip’ler).

### Oyun hissi
- **Doğru/yanlış animasyonu:** Cevap sonrası kısa başarı/hata animasyonu veya ses (zaten haptics var; ses efekti eklenebilir).
- **Skor artışı vurgusu:** Streak bonus veya doğru cevapta +10 gibi skor artışını ekranda kısa süre vurgula.
- **Açıklama (explanation):** Zaten `explanation` alanı var; cevap açıklandıktan sonra “Neden?” kısa metnini göster (özellikle Expert/AI Trick modunda çok değerli).

### Tutma (retention)
- **Günlük ödül / streak:** “7 gün üst üste oyna” gibi basit bir streak sayacı (AsyncStorage); küçük bir rozet veya tebrik mesajı.
- **Seri kilometre taşları:** 5, 10, 25 streak’te `trackStreakMilestone` zaten var; UI’da “🔥 10 seri!” gibi kısa kutlama göster.
- **Achievement rozetleri:** `trackAchievementUnlocked` var; “İlk 10 doğru”, “Tüm kategorilerde oyna”, “Daily’i tamamla” gibi rozetler ve Ayarlar’da “Başarılar” sayfası.

---

## 2. Orta vadeli (orta efor, büyük etki)

### Liderlik tablosu
- Şu an **yerel** (cihaz + AsyncStorage). Gerçek “global” sıralama için:
  - **Firebase Firestore** veya **Supabase** ile skor gönderme; anonim ID (cihaz/anon id) ile sıralama.
  - Günlük haftalık sıfırlama (daily/weekly) zaten mantıkta var; backend’de tarih bazlı key ile saklama.
- İstersen “Arkadaşlarla karşılaştır” için paylaşım linki ile özel oda (invite code) eklenebilir.

### Zorluk ve denge
- **Zorluk hissi:** Kolay/Orta/Zor’da level aralıkları var; içerik havuzunda “gerçekten zor” AI örneklerini Expert’e ayır; Classic’te seviye ilerledikçe zorluğun artmasını net hissettir.
- **Güç dengesi:** 50/50 ve Atla sayılarını A/B test veya kullanıcı geri bildirimi ile ayarla; Time Attack’ta süre/ceza (skip kullanınca −5 sn gibi) düşünülebilir.

### Keşif ve modlar
- **Mod açıklamaları:** Home’da her modun (Classic, Time Attack, Daily, Expert, AI Trick) tek cümlelik açıklaması; ilk açılışta kısa tooltip.
- **Kategori önizleme:** Kategori seçilirken o kategoriden 1 küçük örnek görsel göstermek (opsiyonel).
- **“Günün sorusu”:** Ana sayfada tek bir zorlu soru; paylaşılabilir, sosyal medyada konuşma başlatır.

---

## 3. Uzun vadeli / büyük özellikler

### İçerik pipeline
- **Admin/API:** Kendi “Real vs AI” setini yönetmek için basit bir panel veya script: görsel/ses/metin ekle, zorluk ve kategori etiketle, uygulama bir API veya static JSON ile çeksin.
- **Günlük güncellenen set:** Daily Challenge için her gün farklı sabit set (seed = tarih); aynı gün herkese aynı sorular, adil liderlik.

### Sosyal ve viral
- **Paylaşım kartı:** “Skorum 42 – sen kaç yaparsın?” için otomatik görsel (canvas veya server-side image); Instagram/Twitter story formatı.
- **Meydan okuma:** “Arkadaşını davet et” linki; aynı 5 soruyu ikisi de oynar, skor karşılaştırılır (backend gerekir).

### Gelir (opsiyonel)
- **Reklam:** Game over veya “Tekrar oyna” öncesi kısa rewarded/interstitial (AdMob); reklam izleyince ek 50/50 veya Skip.
- **İsteğe bağlı satın alma:** Reklamsız paket veya ek güç (ekstra 50/50 paketi); tamamen opsiyonel, oyun reklamsız da oynanabilir kalmalı.

### Teknik ve kalite
- **Offline / cache:** Görsel/ses URL’leri önceden cache’lenebilir; zayıf ağda kesinti azalır.
- **Erişilebilirlik:** Screen reader metinleri, yüksek kontrast veya büyük buton seçeneği (Ayarlar’da).
- **Analytics backend:** `analytics.ts` event’leri şu an muhtemelen sadece local; Firebase Analytics veya PostHog gibi bir servise bağlanırsa “hangi mod en çok oynanıyor, nerede bırakılıyor” verisi gelir.

---

## Öncelik özeti

| Öncelik | Ne yapılır | Neden |
|--------|------------|--------|
| 1 | Gerçek Real/AI görsel seti + açıklama (explanation) UI | Oyunun temel değeri; tekrarlanabilirlik artar |
| 2 | Cevap sonrası kısa animasyon/ses + skor vurgusu | Oyun hissi ve tatmin artar |
| 3 | Streak/achievement UI (seri kutlaması, basit rozetler) | Tutma (retention) artar |
| 4 | Liderlik için backend (Firebase/Supabase) | Daily/competitive his güçlenir |
| 5 | Paylaşım kartı (görsel) | Viral potansiyel |

İlk adım olarak **explanation göstermek** ve **cevap sonrası kısa görsel/iyi his veren feedback** eklemek en hızlı ve hissedilir iyileştirme olur; ardından içerik setini gerçek Real/AI örnekleriyle zenginleştirebilirsin.

# Performans ve Ölçeklenebilirlik

Bu belge, "Human or AI?" oyununun binlerce eşzamanlı kullanıcı ve uzun oturumlarda kasma yapmaması için alınan mimari kararları özetler.

## 1. State ve Render Optimizasyonu

- **GameContext**: `submitAnswer`, `nextImage`, `getShareMessage` callback'leri **ref tabanlı** yazıldı; state her değiştiğinde yeniden oluşturulmuyor. Alt bileşenler gereksiz re-render almıyor.
- **Context value**: `useMemo` ile sarıldı; sadece gerçekten değişen bağımlılıklar güncellendiğinde yeni referans veriliyor.
- **Ekranlar**: `HomeScreen`, `GameScreen`, `ResultScreen`, `GameOverScreen`, `LeaderboardScreen` ve ortak UI bileşenleri (`Button`, `GameAnswerButton`, `StreakBadge`) **React.memo** ile sarıldı.

## 2. Bellek Sınırları (Sızıntı Önleme)

| Kaynak | Cap | Açıklama |
|--------|-----|----------|
| `recentIds` | 50 | Son gösterilen görsel ID'leri; sınırsız büyümez. |
| Analytics `events` | 500 | In-memory event listesi; production'da flush/batch kullanın. |
| Leaderboard (per period) | 500 | Her periyot için maksimum kayıt; sıralama sonrası slice. |

## 3. Dataset ve Görseller

- **Deterministik ID**: `img-{index}-v{DATASET_VERSION}`. Aynı index her zaman aynı URI'ı üretir; **cache-friendly** ve CDN/placeholder ile uyumlu.
- **Image.prefetch**: Oyun ekranında gösterilen görsel URI'si için `Image.prefetch` çağrılıyor; native cache’ten hızlı gösterim.
- **Tek havuz**: `buildDataset()` uygulama açılışında bir kez çalışıyor; tekrar tekrar büyük dizi oluşturulmuyor.

## 4. Liderlik Tablosu (FlatList)

- **getItemLayout**: Sabit satır yüksekliği (56px) ile scroll performansı iyileştirildi.
- **initialNumToRender**: 12; **maxToRenderPerBatch**: 10; **windowSize**: 7.
- **removeClippedSubviews**: Görünür olmayan satırlar unmount edilir (platform destekliyorsa).
- **renderItem**: Memoized `LeaderboardRow` ve `useCallback` ile referans sabit.

## 5. Yan Etkiler

- **GameOverScreen**: `updatePersonalBest`, `recordGamePlayed`, `checkAndUnlockAchievements` ve ses/analytics **sadece useEffect içinde** çalışıyor; render sırasında side-effect yok.

## 6. Sabitler

- **constants/gameConstants.ts**: MODES, CATEGORIES, LEADERBOARD_PERIODS, RECENT_IDS_MAX, DATASET_VERSION tek yerde; her render’da yeni dizi/obje oluşturulmuyor.

## 7. Production Önerileri

- **Görsel**: `expo-image` ile disk/memory cache kullanımı artırılabilir.
- **Analytics**: Event’leri batch’leyip periyodik flush; in-memory cap sadece fallback.
- **Leaderboard**: Gerçek backend’de sayfalama (pagination) ve indeks kullanın.
- **Progression / PB**: AsyncStorage veya backend ile kalıcılık; uygulama kapatılsa bile veri korusun.

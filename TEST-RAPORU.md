# Human or AI? – Test Raporu

Son çalıştırma: bu oturumda yapılan testlerin özeti.

---

## 1. TypeScript

- **Komut:** `npx tsc --noEmit`
- **Sonuç:** Başarılı (exit code 0)
- Tip hataları yok.

---

## 2. Linter

- **Kapsam:** `src/`, `App.tsx`
- **Sonuç:** Hata yok.

---

## 3. Web derlemesi (Expo)

- **Komut:** `npx expo export --platform web`
- **Sonuç:** Başarılı
- Çıktı: `dist/` (web bundle ~949 kB, 427 modül)

---

## 4. Birim testleri (Jest)

- **Komut:** `npm test`
- **Sonuç:** 3 test dosyası, 21 test, hepsi geçti.

| Dosya | Test sayısı | Durum |
|-------|-------------|--------|
| `src/logic/__tests__/gameEngine.test.ts` | 9 | Geçti |
| `src/images/__tests__/dataset.test.ts` | 9 | Geçti |
| `src/leaderboard/__tests__/leaderboard.test.ts` | 3 | Geçti |

**gameEngine:** getInitialState, calculateLevel, processAnswer, getStreakBonusMessage (classic, time_attack, expert, streak bonus).  
**dataset:** buildDataset, getImagesForLevel, pickNextImage (boyut, alanlar, real/ai karışımı, zorluk, exclude).  
**leaderboard:** getLeaderboard, submitScore, getPlayerBest.

---

## 5. Özet

| Kontrol | Durum |
|--------|--------|
| TypeScript | Geçti |
| Linter | Geçti |
| Web export | Geçti |
| Jest (21 test) | Geçti |

Proje testleri başarıyla tamamlandı.

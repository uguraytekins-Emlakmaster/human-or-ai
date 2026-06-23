import { DATASET_VERSION } from '../constants/gameConstants';

/**
 * Resim kalitesi ve havuz ayarları.
 * Production'da CDN veya API'den yüksek çözünürlüklü görseller kullan.
 */
export const IMAGE_CONFIG = {
  /** Minimum havuz büyüklüğü – anti-cheat ve tekrar hissini azaltır */
  POOL_SIZE: 600,

  /** Hedef çözünürlük (genişlik x yükseklik). Yüksek = kaliteli ama daha yavaş yükleme */
  WIDTH: 1200,
  HEIGHT: 900,

  /** WebP/JPEG kalite (0–100). Sadece kendi sıkıştırman varsa kullan */
  QUALITY: 90,

  /** Dataset sürümü – deterministik URI için (cache + ölçeklenebilirlik) */
  DATASET_VERSION,
} as const;

/** Placeholder (Picsum) için URL – deterministik seed = cache-friendly */
export function getPlaceholderImageUrl(seed: string | number): string {
  const w = IMAGE_CONFIG.WIDTH;
  const h = IMAGE_CONFIG.HEIGHT;
  return `https://picsum.photos/seed/${String(seed)}/${w}/${h}`;
}

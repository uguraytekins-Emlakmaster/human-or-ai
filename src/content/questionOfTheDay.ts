/**
 * Günün sorusu – tarihle seedlenmiş, her gün aynı tek soru.
 * Sadece görsel havuzundan seçim; ses/metin de eklenebilir.
 */

import type { GameContent } from '../logic/types';
import type { GameImage } from '../logic/types';
import { buildDataset } from '../images/dataset';

function getTodaySeed(): number {
  const d = new Date();
  const str = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

let cachedPool: GameImage[] | null = null;

function getImagePool(): GameImage[] {
  if (!cachedPool) cachedPool = buildDataset();
  return cachedPool;
}

function imageToContent(img: GameImage): GameContent {
  return {
    contentType: 'image',
    id: img.id,
    imageType: img.imageType,
    difficultyLevel: img.difficultyLevel,
    category: img.category,
    explanation: img.explanation,
    uri: img.uri,
  };
}

/** Bugünün tek sorusu; her gün aynı içerik döner. */
export function getQuestionOfTheDay(): GameContent | null {
  const pool = getImagePool();
  if (pool.length === 0) return null;
  const seed = getTodaySeed();
  const index = Math.abs(seed) % pool.length;
  const img = pool[index];
  return imageToContent(img);
}

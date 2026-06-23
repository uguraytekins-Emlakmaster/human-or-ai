/**
 * Image dataset with metadata.
 * Production: CDN veya API'den yüksek kaliteli real/AI görseller yükle.
 */

import type { GameImage, ImageCategory, ImageType } from '../logic/types';
import type { CategorySlug } from '../logic/types';

const CATEGORY_SLUG_MAP: Record<CategorySlug, ImageCategory[] | null> = {
  all: null,
  faces: ['portrait'],
  food: ['food'],
  nature: ['landscape', 'nature'],
  architecture: ['architecture'],
  animals: ['animal'],
};
import { IMAGE_CONFIG, getPlaceholderImageUrl } from './config';

function seedNum(id: string): number {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

/**
 * Görsel URI – placeholder (Picsum) yüksek çözünürlük; production'da kendi CDN/API.
 */
function imageUri(id: string, _imageType: ImageType, _category: ImageCategory): string {
  const s = seedNum(id);
  return getPlaceholderImageUrl(s);
}

const CATEGORIES: ImageCategory[] = [
  'portrait', 'animal', 'food', 'architecture', 'object', 'landscape', 'nature', 'art', 'fashion', 'street',
];

/**
 * Preloaded dataset: mix of real and AI with difficulty levels.
 * Level 1-5: obvious, 6-15: moderate, 16+: expert.
 * Deterministik ID = cache-friendly URI, sürdürülebilir bellek (tek havuz).
 */
export function buildDataset(size: number = IMAGE_CONFIG.POOL_SIZE): GameImage[] {
  const version = IMAGE_CONFIG.DATASET_VERSION ?? 1;
  const images: GameImage[] = [];
  for (let i = 0; i < size; i++) {
    const id = `img-${i}-v${version}`;
    const imageType: ImageType = i % 2 === 0 ? 'real' : 'ai';
    const category = CATEGORIES[i % CATEGORIES.length];
    const difficultyLevel = Math.min(20, Math.floor(i / (size / 20)) + 1);
    images.push({
      id,
      uri: imageUri(id, imageType, category),
      imageType,
      difficultyLevel,
      category,
      source: 'dataset',
    });
  }
  return images;
}

/**
 * Get images filtered by difficulty (and optional category) for current level.
 * levelMin/levelMax: zorluk seçimi (easy/medium/hard) için clamp.
 */
export function getImagesForLevel(
  pool: GameImage[],
  level: number,
  count: number,
  excludeIds: Set<string> = new Set(),
  categorySlug: CategorySlug = 'all',
  levelMin: number = 1,
  levelMax: number = 20
): GameImage[] {
  let minDiff = Math.max(1, level - 2);
  let maxDiff = Math.min(20, level + 3);
  minDiff = Math.max(minDiff, levelMin);
  maxDiff = Math.min(maxDiff, levelMax);
  const allowedCategories = CATEGORY_SLUG_MAP[categorySlug];
  let filtered = pool.filter(
    (img) =>
      img.difficultyLevel >= minDiff &&
      img.difficultyLevel <= maxDiff &&
      !excludeIds.has(img.id)
  );
  if (allowedCategories) {
    filtered = filtered.filter((img) => allowedCategories.includes(img.category));
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get one random image for the next round (no repeat in same session when pool allows).
 */
export function pickNextImage(
  pool: GameImage[],
  level: number,
  recentIds: string[],
  expertMode: boolean,
  categorySlug: CategorySlug = 'all',
  levelMin: number = 1,
  levelMax: number = 20
): GameImage | null {
  const exclude = new Set(recentIds);
  const count = expertMode ? 50 : 10;
  const candidates = getImagesForLevel(
    pool,
    expertMode ? 16 : level,
    count,
    exclude,
    categorySlug,
    levelMin,
    levelMax
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

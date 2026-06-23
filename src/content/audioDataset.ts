/**
 * Ses içeriği – gerçek insan sesi vs AI (TTS) karşılaştırması.
 * Placeholder URL'ler; production'da kendi ses dosyaların veya API.
 */

import type { GameContent, ImageType, ImageCategory } from '../logic/types';

const CATEGORIES: ImageCategory[] = ['portrait', 'animal', 'food', 'architecture', 'object', 'landscape', 'nature'];
/** Örnek: ücretsiz test sesleri; production'da real/AI ses klipleri */
const SAMPLE_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
];

export function buildAudioContent(size: number = 40): GameContent[] {
  const list: GameContent[] = [];
  for (let i = 0; i < size; i++) {
    const id = `audio-${i}`;
    const imageType: ImageType = i % 2 === 0 ? 'real' : 'ai';
    const category = CATEGORIES[i % CATEGORIES.length];
    const difficultyLevel = Math.min(20, Math.floor(i / 4) + 1);
    list.push({
      contentType: 'audio',
      id,
      imageType,
      difficultyLevel,
      category,
      audioUri: SAMPLE_AUDIO_URLS[i % SAMPLE_AUDIO_URLS.length],
    });
  }
  return list;
}

export function pickNextAudio(
  pool: GameContent[],
  level: number,
  recentIds: string[],
  levelMin: number,
  levelMax: number
): GameContent | null {
  const exclude = new Set(recentIds);
  const minD = Math.max(levelMin, level - 2);
  const maxD = Math.min(levelMax, level + 3);
  const candidates = pool.filter(
    (c) => c.difficultyLevel >= minD && c.difficultyLevel <= maxD && !exclude.has(c.id)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

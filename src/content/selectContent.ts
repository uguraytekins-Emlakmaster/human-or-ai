/**
 * Bir sonraki soruyu seç: resim / ses / metin (ve ileride video).
 * contentTypes ve difficulty config'den gelir.
 */

import type { GameContent, GameConfig, GameState, ContentType } from '../logic/types';
import type { GameImage } from '../logic/types';
import type { CategorySlug } from '../logic/types';
import { pickNextImage } from '../images/dataset';
import { pickNextAudio } from './audioDataset';
import { pickNextText } from './textDataset';
import { pickNextVideo } from './videoDataset';
import { DIFFICULTY_OPTIONS } from '../constants/gameConstants';

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

export function selectNextContent(
  imagePool: GameImage[],
  audioPool: GameContent[],
  textPool: GameContent[],
  videoPool: GameContent[],
  state: GameState,
  recentIds: string[],
  config: GameConfig
): GameContent | null {
  const contentTypes = config.contentTypes ?? ['image', 'audio', 'text', 'video'];
  const difficulty = config.difficulty ?? 'medium';
  const expertMode = config.mode === 'expert' || config.mode === 'ai_trick' || config.expertMode === true;
  const category = config.category ?? 'all';

  const diffOpt = DIFFICULTY_OPTIONS.find((d) => d.id === difficulty) ?? DIFFICULTY_OPTIONS[1];
  const levelMin = diffOpt.levelMin;
  const levelMax = diffOpt.levelMax;
  const level = expertMode ? 16 : state.level;

  const availableTypes = contentTypes.filter(
    (t): t is 'image' | 'audio' | 'text' | 'video' =>
      t === 'image' || t === 'audio' || t === 'text' || t === 'video'
  );
  if (availableTypes.length === 0) availableTypes.push('image');

  const typeOrder = [...availableTypes].sort(() => Math.random() - 0.5);
  for (const contentType of typeOrder) {
    if (contentType === 'image') {
      const img = pickNextImage(
        imagePool,
        level,
        recentIds,
        expertMode,
        category,
        levelMin,
        levelMax
      );
      if (img) return imageToContent(img);
    }
    if (contentType === 'audio') {
      const audio = pickNextAudio(audioPool, level, recentIds, levelMin, levelMax);
      if (audio) return audio;
    }
    if (contentType === 'text') {
      const text = pickNextText(textPool, level, recentIds, levelMin, levelMax);
      if (text) return text;
    }
    if (contentType === 'video') {
      const video = pickNextVideo(videoPool, level, recentIds, levelMin, levelMax);
      if (video) return video;
    }
  }
  return null;
}

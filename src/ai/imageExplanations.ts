/**
 * Image explanation system: why the image is real or AI.
 * Shown after each answer to educate and increase engagement.
 */

import type { GameImage, GameContent, ImageType, ImageCategory } from '../logic/types';

const REAL_REASONS: Record<string, string[]> = {
  default: [
    'Real photos have natural imperfections and consistent lighting.',
    'Real photography shows authentic texture and depth.',
  ],
  portrait: ['Natural skin texture and subtle imperfections indicate a real photograph.', 'Real portraits often have consistent lighting across the face.'],
  animal: ['Real wildlife shots show natural movement and environment.', 'Fur and feather detail is consistent in real animal photos.'],
  food: ['Real food photography shows natural texture and subtle imperfections.', 'Lighting and reflections look natural in real food shots.'],
  architecture: ['Real architecture photos have consistent perspective and detail.', 'Real buildings show wear and context from the environment.'],
  landscape: ['Real landscapes have natural light gradients and atmospheric depth.', 'Real nature photos show consistent detail at all scales.'],
  nature: ['Real nature photography shows organic detail and natural lighting.', 'Authentic foliage and terrain have consistent texture in real photos.'],
  object: ['Real product photos have consistent shadows and reflections.', 'Real objects show natural material texture.'],
};

const AI_REASONS: Record<string, string[]> = {
  default: [
    'AI images often have subtle flaws in hands, text, or symmetry.',
    'AI can struggle with consistent lighting or fine details.',
  ],
  portrait: ['AI often struggles with natural skin texture and fine facial details.', 'AI-generated portraits may have uncanny or overly smooth skin.'],
  animal: ['AI can create inconsistent fur or feather patterns.', 'Animal eyes or proportions may look slightly off in AI images.'],
  food: ['AI food can look too perfect or have odd textures.', 'Steam and liquids are often unconvincing in AI images.'],
  architecture: ['AI may generate impossible geometry or repeated patterns.', 'Windows and reflections in AI architecture can be inconsistent.'],
  landscape: ['AI landscapes may have inconsistent scale or atmospheric detail.', 'AI can mix incompatible lighting or weather.'],
  nature: ['AI nature scenes can have repetitive or unnatural patterns.', 'Foliage and organic detail may look off in AI-generated nature.'],
  object: ['AI objects may have impossible reflections or shadows.', 'Text or logos in AI images are often garbled or wrong.'],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getExplanationForImage(image: GameImage | GameContent): string {
  if (image.explanation) return image.explanation;
  const category = image.category in REAL_REASONS ? image.category : 'default';
  const reasons = image.imageType === 'real' ? REAL_REASONS : AI_REASONS;
  const list = (reasons as Record<string, string[]>)[category] ?? reasons.default;
  return pickRandom(list);
}

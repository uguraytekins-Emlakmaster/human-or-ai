/**
 * Metin içeriği – insan yazısı vs AI (ChatGPT vb.) karşılaştırması.
 * Placeholder metinler; production'da daha büyük havuz.
 */

import type { GameContent, ImageType, ImageCategory } from '../logic/types';

const CATEGORIES: ImageCategory[] = ['portrait', 'animal', 'food', 'architecture', 'object', 'landscape', 'nature'];

const TEXTS: { text: string; imageType: ImageType }[] = [
  { text: 'This product is really good and I use it every day. No complaints.', imageType: 'real' },
  { text: 'This innovative solution leverages cutting-edge technology to optimize user experience.', imageType: 'ai' },
  { text: 'Went to the store. Forgot milk. Came back and it was raining.', imageType: 'real' },
  { text: 'Upon careful consideration of the multifaceted aspects, we can observe that...', imageType: 'ai' },
  { text: 'My cat sat on the keyboard again. Now my document says "gggggg".', imageType: 'real' },
  { text: 'In conclusion, it is evident that the aforementioned points collectively demonstrate...', imageType: 'ai' },
  { text: 'Meeting at 3pm. Don\'t be late. Bring the report.', imageType: 'real' },
  { text: 'Furthermore, the implementation of such strategies necessitates a comprehensive approach.', imageType: 'ai' },
  { text: 'Pizza was cold. Still ate it. No regrets.', imageType: 'real' },
  { text: 'The synergistic integration of these components facilitates optimal outcomes.', imageType: 'ai' },
  { text: 'Traffic was terrible. Took an hour to get home.', imageType: 'real' },
  { text: 'It is imperative to acknowledge the significance of these findings within the broader context.', imageType: 'ai' },
  { text: 'Coffee machine broken. Day is already ruined.', imageType: 'real' },
  { text: 'The holistic approach ensures alignment with overarching objectives.', imageType: 'ai' },
  { text: 'Found an old photo. We looked so young. Miss those days.', imageType: 'real' },
  { text: 'Leveraging best practices enables organizations to achieve sustainable growth.', imageType: 'ai' },
  { text: 'Recipe: eggs, flour, sugar. Mix. Bake 30 min. Done.', imageType: 'real' },
  { text: 'Stakeholder engagement remains critical to the success of such initiatives.', imageType: 'ai' },
  { text: 'The weather app said sunny. It\'s pouring. As usual.', imageType: 'real' },
  { text: 'Through rigorous analysis, we have identified key drivers of performance.', imageType: 'ai' },
];

export function buildTextContent(): GameContent[] {
  return TEXTS.map((t, i) => ({
    contentType: 'text' as const,
    id: `text-${i}`,
    imageType: t.imageType,
    difficultyLevel: Math.min(20, Math.floor(i / 2) + 1),
    category: CATEGORIES[i % CATEGORIES.length],
    text: t.text,
  }));
}

export function pickNextText(
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

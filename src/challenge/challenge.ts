/**
 * Arkadaşla meydan okuma – aynı 5 soru, challengeId ile deterministik.
 */

import type { GameContent } from '../logic/types';
import { buildDataset } from '../images/dataset';
import type { GameImage } from '../logic/types';
import { CHALLENGE_SHARE_BASE_URL } from '../constants/appLinks';

const CHALLENGE_LENGTH = 5;

function seedFromString(s: string): number {
  return s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

/** Rastgele 8 karakterlik challenge kodu (paylaşım linkinde kullanılır). */
export function generateChallengeId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
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

/** Basit deterministik shuffle: aynı challengeId her zaman aynı sırayı verir. */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** ChallengeId'den 5 görsel ID'si (deterministik, tekrarsız). */
export function getChallengeImageIds(challengeId: string): string[] {
  const pool = buildDataset();
  if (pool.length < CHALLENGE_LENGTH) return [];
  const seed = seedFromString(challengeId);
  const shuffled = seededShuffle(pool, seed);
  return shuffled.slice(0, CHALLENGE_LENGTH).map((img) => img.id);
}

/** ChallengeId'ye göre 5 soruluk içerik listesi (sıralı). */
export function getChallengeContents(challengeId: string): GameContent[] {
  const pool = buildDataset();
  const byId = new Map(pool.map((img) => [img.id, img]));
  const ids = getChallengeImageIds(challengeId);
  const contents = ids
    .map((id) => byId.get(id))
    .filter((img): img is GameImage => !!img)
    .map(imageToContent);
  return contents.length === CHALLENGE_LENGTH ? contents : [];
}

export function getChallengeShareUrl(challengeId: string): string {
  const base = CHALLENGE_SHARE_BASE_URL.trim();
  if (base) return `${base.replace(/\/$/, '')}/${challengeId}`;
  return challengeId;
}

export function parseChallengeIdFromUrl(url: string): string | null {
  const match = url.match(/challenge\/([a-z0-9]{6,12})/i);
  return match ? match[1] : null;
}

/**
 * Kişisel rekor (PB) – "Beat your best!" için.
 * AsyncStorage ile kalıcı; uygulama kapansa da korunur.
 */

import type { GameMode } from '../logic/types';
import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';

const MODES: GameMode[] = ['classic', 'time_attack', 'daily', 'expert', 'ai_trick'];

type PbStore = Partial<Record<GameMode, number>>;

let memory: PbStore = {};

export function getPersonalBest(mode: GameMode): number {
  return memory[mode] ?? 0;
}

/** Returns true if this score is a new record (and updates storage). */
export function updatePersonalBest(mode: GameMode, score: number): boolean {
  const current = memory[mode] ?? 0;
  if (score <= current) return false;
  memory[mode] = score;
  persist();
  return true;
}

function persist(): void {
  setItem(STORAGE_KEYS.PERSONAL_BEST, memory);
}

/** Uygulama açılışında çağrılır; AsyncStorage'dan doldurur. */
export function initFromStorage(data: PbStore | null): void {
  if (data && typeof data === 'object') {
    memory = { ...data };
  }
}

export async function loadFromStorage(): Promise<void> {
  const data = await getItem<PbStore>(STORAGE_KEYS.PERSONAL_BEST);
  initFromStorage(data);
}

/** Çeviri için anahtar ve parametreler döner; ekranda t(key, params) ile kullan. */
export function getPersonalBestMessage(
  mode: GameMode,
  score: number
): { key: string; params?: Record<string, number> } | null {
  const pb = getPersonalBest(mode);
  if (pb === 0) return null;
  if (score >= pb) return { key: 'gameOver.newRecord' };
  return { key: 'gameOver.beatBest', params: { best: pb, diff: pb - score } };
}

export function getBestScoreEver(): number {
  return Math.max(0, ...MODES.map((m) => getPersonalBest(m)));
}

/**
 * Tamamlanan günlük meydan okuma sayısı – "7 daily challenge" achievement için.
 */

import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';

let count = 0;

export function initDailyChallengesCountFromStorage(value: number | null): void {
  if (typeof value === 'number' && value >= 0) count = value;
}

export async function loadDailyChallengesCountFromStorage(): Promise<void> {
  const value = await getItem<number>(STORAGE_KEYS.DAILY_CHALLENGES_COUNT);
  initDailyChallengesCountFromStorage(value);
}

export function getDailyChallengesCompleted(): number {
  return count;
}

export function incrementDailyChallengesCompleted(): void {
  count += 1;
  setItem(STORAGE_KEYS.DAILY_CHALLENGES_COUNT, count);
}

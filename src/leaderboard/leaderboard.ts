/**
 * Leaderboard: daily, weekly, all-time.
 * Uses in-memory / AsyncStorage for now; plug in Firebase or custom backend later.
 * Cap ile liste sınırsız büyümez – ölçeklenebilir bellek kullanımı.
 */

import type { LeaderboardEntry, LeaderboardPeriod } from '../logic/types';

const MAX_ENTRIES_PER_PERIOD = 500;

const STORAGE_KEYS = {
  daily: '@human_or_ai_leaderboard_daily',
  weekly: '@human_or_ai_leaderboard_weekly',
  allTime: '@human_or_ai_leaderboard_all_time',
  dailyDate: '@human_or_ai_daily_date',
  weeklyDate: '@human_or_ai_weekly_date',
};

let memoryStore: Record<LeaderboardPeriod, LeaderboardEntry[]> = {
  daily: [],
  weekly: [],
  all_time: [],
};

function trimToTop(entries: LeaderboardEntry[], max: number): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}

export function getLeaderboard(period: LeaderboardPeriod): LeaderboardEntry[] {
  const list = memoryStore[period];
  return trimToTop(list, list.length).map((e, i) => ({ ...e, rank: i + 1 }));
}

export function submitScore(
  period: LeaderboardPeriod,
  name: string,
  score: number
): LeaderboardEntry {
  const id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const entry: LeaderboardEntry = { id, name, score, rank: 0, period };
  memoryStore[period].push(entry);
  memoryStore[period] = trimToTop(memoryStore[period], MAX_ENTRIES_PER_PERIOD);
  const sorted = getLeaderboard(period);
  const found = sorted.find((e) => e.id === id);
  return found ?? entry;
}

export function getPlayerBest(period: LeaderboardPeriod, name: string): number {
  const entries = memoryStore[period].filter((e) => e.name === name);
  if (entries.length === 0) return 0;
  return Math.max(...entries.map((e) => e.score));
}

export function resetPeriodIfNewDay(period: 'daily' | 'weekly'): void {
  // In production: compare stored date with today / this week and clear if needed
  // For now we keep in-memory only; persist via AsyncStorage when needed
}

export function setLeaderboardStore(store: typeof memoryStore): void {
  memoryStore = store;
}

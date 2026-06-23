/**
 * Günlük streak: 7 gün üst üste oynama.
 * AsyncStorage ile kalıcı; lastPlayedDate (YYYY-MM-DD) ve streakDays.
 */

import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';

function todayKey(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const MAX_CALENDAR_DAYS = 7;

type DailyStreakData = { lastPlayedDate: string; streakDays: number; playedDates?: string[] };

let memory: DailyStreakData = { lastPlayedDate: '', streakDays: 0 };

function persist(): void {
  setItem(STORAGE_KEYS.DAILY_STREAK, memory);
}

export function initDailyStreakFromStorage(data: DailyStreakData | null): void {
  if (data && typeof data === 'object' && data.lastPlayedDate) {
    const playedDates = Array.isArray(data.playedDates)
      ? data.playedDates.slice(-MAX_CALENDAR_DAYS)
      : [data.lastPlayedDate];
    memory = {
      lastPlayedDate: data.lastPlayedDate,
      streakDays: Math.max(0, data.streakDays ?? 0),
      playedDates,
    };
  }
}

export async function loadDailyStreakFromStorage(): Promise<void> {
  const data = await getItem<DailyStreakData>(STORAGE_KEYS.DAILY_STREAK);
  initDailyStreakFromStorage(data);
}

export function getDailyStreak(): number {
  const today = todayKey();
  if (memory.lastPlayedDate === today) return memory.streakDays;
  return 0;
}

/** Oyun bittiğinde veya gün içinde oynandığında çağrılır. Bugün zaten kayıtlıysa artırmaz. */
export function recordSession(): void {
  const today = todayKey();
  const yesterday = yesterdayKey();
  if (memory.lastPlayedDate === today) return;
  if (memory.lastPlayedDate === yesterday) {
    memory.streakDays += 1;
  } else {
    memory.streakDays = 1;
  }
  memory.lastPlayedDate = today;
  if (!memory.playedDates) memory.playedDates = [];
  if (!memory.playedDates.includes(today)) {
    memory.playedDates.push(today);
    memory.playedDates = memory.playedDates.slice(-MAX_CALENDAR_DAYS);
  }
  persist();
}

/** Son 7 gün için [en eski … bugün] sırasıyla: dateKey (YYYY-MM-DD), played. Label UI'da i18n ile. */
export function getLast7DaysCalendar(): { dateKey: string; played: boolean; dayOffset: number }[] {
  const playedSet = new Set(memory.playedDates ?? []);
  const out: { dateKey: string; played: boolean; dayOffset: number }[] = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    const dateKey = x.toISOString().slice(0, 10);
    out.push({ dateKey, played: playedSet.has(dateKey), dayOffset: i });
  }
  return out;
}

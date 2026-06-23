/**
 * Achievements + XP & level progression.
 * AsyncStorage ile kalıcı; unlock'lar ve XP/coins korunur.
 */

import type { Achievement, PlayerProgression } from '../logic/types';
import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';

const XP_PER_LEVEL = 100;

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_win', name: 'First Win', description: 'Get 1 correct answer', xpReward: 10 },
  { id: 'streak_5', name: 'On a Roll', description: '5 correct in a row', xpReward: 25 },
  { id: 'streak_10', name: 'On Fire', description: '10 correct in a row', xpReward: 50 },
  { id: 'streak_20', name: 'Unstoppable', description: '20 correct in a row', xpReward: 100 },
  { id: 'score_10', name: 'Sharp Eye', description: 'Score 10 in one game', xpReward: 30 },
  { id: 'score_50', name: 'Expert', description: 'Score 50 in one game', xpReward: 150 },
  { id: 'score_100', name: 'Legend', description: 'Score 100 in one game', xpReward: 300 },
  { id: 'daily_week', name: 'Dedicated', description: 'Complete 7 daily challenges', xpReward: 75 },
  { id: 'ai_expert', name: 'AI Expert', description: 'Complete an Expert mode game', xpReward: 50 },
];

const defaultProgression: PlayerProgression = {
  xp: 0,
  level: 1,
  coins: 0,
  totalCorrect: 0,
  gamesPlayed: 0,
};

let memoryProgression: PlayerProgression = { ...defaultProgression };
const unlockedIds = new Set<string>();

function persist(): void {
  setItem(STORAGE_KEYS.PROGRESSION, memoryProgression);
  setItem(STORAGE_KEYS.ACHIEVEMENTS, Array.from(unlockedIds));
}

/** Uygulama açılışında çağrılır. */
export function initFromStorage(progression: PlayerProgression | null, achievementIds: string[] | null): void {
  if (progression && typeof progression === 'object') {
    memoryProgression = {
      xp: progression.xp ?? 0,
      level: Math.max(1, progression.level ?? 1),
      coins: progression.coins ?? 0,
      totalCorrect: progression.totalCorrect ?? 0,
      gamesPlayed: progression.gamesPlayed ?? 0,
    };
  }
  if (Array.isArray(achievementIds)) {
    unlockedIds.clear();
    achievementIds.forEach((id) => unlockedIds.add(id));
  }
}

export async function loadFromStorage(): Promise<void> {
  const [prog, ach] = await Promise.all([
    getItem<PlayerProgression>(STORAGE_KEYS.PROGRESSION),
    getItem<string[]>(STORAGE_KEYS.ACHIEVEMENTS),
  ]);
  initFromStorage(prog, ach ?? null);
}

export function getProgression(): PlayerProgression {
  return { ...memoryProgression };
}

export function addXP(amount: number): void {
  memoryProgression.xp += amount;
  while (memoryProgression.level * XP_PER_LEVEL <= memoryProgression.xp) {
    memoryProgression.level += 1;
  }
  persist();
}

export function addCoins(amount: number): void {
  memoryProgression.coins += amount;
  persist();
}

export function recordGamePlayed(totalCorrect: number): void {
  memoryProgression.gamesPlayed += 1;
  memoryProgression.totalCorrect += totalCorrect;
  persist();
}

export function getLevel(): number {
  return memoryProgression.level;
}

export function getXP(): number {
  return memoryProgression.xp;
}

export function getCoins(): number {
  return memoryProgression.coins;
}

export function getXPForNextLevel(): number {
  return memoryProgression.level * XP_PER_LEVEL;
}

export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFS.map((a) => ({
    ...a,
    unlocked: unlockedIds.has(a.id),
    unlockedAt: undefined,
  }));
}

export function unlockAchievement(id: string): Achievement | null {
  const def = ACHIEVEMENT_DEFS.find((a) => a.id === id);
  if (!def || unlockedIds.has(id)) return null;
  unlockedIds.add(id);
  addXP(def.xpReward);
  return { ...def, unlocked: true, unlockedAt: Date.now() };
}

export function checkAndUnlockAchievements(params: {
  totalCorrectLifetime: number;
  bestStreak: number;
  bestScore: number;
  dailyChallengesCompleted: number;
  expertCompleted: boolean;
}): Achievement[] {
  const unlocked: Achievement[] = [];
  const { totalCorrectLifetime, bestStreak, bestScore, dailyChallengesCompleted, expertCompleted } = params;

  if (totalCorrectLifetime >= 1 && !unlockedIds.has('first_win')) unlocked.push(unlockAchievement('first_win')!);
  if (bestStreak >= 5 && !unlockedIds.has('streak_5')) unlocked.push(unlockAchievement('streak_5')!);
  if (bestStreak >= 10 && !unlockedIds.has('streak_10')) unlocked.push(unlockAchievement('streak_10')!);
  if (bestStreak >= 20 && !unlockedIds.has('streak_20')) unlocked.push(unlockAchievement('streak_20')!);
  if (bestScore >= 10 && !unlockedIds.has('score_10')) unlocked.push(unlockAchievement('score_10')!);
  if (bestScore >= 50 && !unlockedIds.has('score_50')) unlocked.push(unlockAchievement('score_50')!);
  if (bestScore >= 100 && !unlockedIds.has('score_100')) unlocked.push(unlockAchievement('score_100')!);
  if (dailyChallengesCompleted >= 7 && !unlockedIds.has('daily_week')) unlocked.push(unlockAchievement('daily_week')!);
  if (expertCompleted && !unlockedIds.has('ai_expert')) unlocked.push(unlockAchievement('ai_expert')!);

  return unlocked.filter(Boolean);
}

export function isAchievementUnlocked(id: string): boolean {
  return unlockedIds.has(id);
}

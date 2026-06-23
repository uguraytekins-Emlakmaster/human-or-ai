/**
 * Retention: daily challenge (10 images/day), daily rewards, achievement badges.
 */

const DAILY_IMAGE_COUNT = 10;
const STORAGE_KEY = '@human_or_ai_daily';

export function getDailyChallengeDate(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getDailyImageIds(): string[] {
  const today = getDailyChallengeDate();
  // In production: fetch from backend or generate deterministic set from date
  const ids: string[] = [];
  for (let i = 0; i < DAILY_IMAGE_COUNT; i++) {
    ids.push(`daily-${today}-${i}`);
  }
  return ids;
}

export function getDailyProgress(): { completed: number; total: number } {
  return { completed: 0, total: DAILY_IMAGE_COUNT };
}

export function claimDailyReward(): boolean {
  return false;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export function getAchievementBadges(): Badge[] {
  return [
    { id: 'first_5', name: 'Starter', description: 'Score 5 in a row', unlocked: false },
    { id: 'streak_10', name: 'On Fire', description: '10 streak', unlocked: false },
    { id: 'score_50', name: 'Sharp Eye', description: 'Score 50', unlocked: false },
    { id: 'daily_week', name: 'Dedicated', description: '7 daily challenges', unlocked: false },
  ];
}

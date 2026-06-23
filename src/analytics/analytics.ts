/**
 * Analytics: session duration, streak, DAU, share rate, difficulty completion.
 * Stub implementation; plug in Firebase Analytics, Mixpanel, or custom backend.
 * Event listesi cap'lenir – binlerce oturumda bellek sızıntısı önlenir.
 */

import type { AnalyticsEvent } from '../logic/types';

const MAX_STORED_EVENTS = 500;
const events: AnalyticsEvent[] = [];

export function track(event: AnalyticsEvent): void {
  events.push(event);
  if (events.length > MAX_STORED_EVENTS) {
    events.splice(0, events.length - MAX_STORED_EVENTS);
  }
  if (__DEV__) {
    console.log('[Analytics]', event.name, event.properties);
  }
  sendToBackend(event);
}

/** Set to true to enable sending events to an external backend (implement flush logic). */
const ANALYTICS_BACKEND_ENABLED = false;

function sendToBackend(event: AnalyticsEvent): void {
  if (!ANALYTICS_BACKEND_ENABLED) return;
  // TODO: batch events and POST to Firebase Analytics / Mixpanel / custom endpoint
}

export function trackSessionStart(): void {
  track({ name: 'session_start', properties: { timestamp: Date.now() } });
}

export function trackSessionEnd(durationSeconds: number): void {
  track({ name: 'session_end', properties: { duration_seconds: durationSeconds } });
}

export function trackGameStart(mode: string): void {
  track({ name: 'game_start', properties: { mode } });
}

export function trackGameOver(score: number, streak: number, mode: string): void {
  track({ name: 'game_over', properties: { score, streak, mode } });
}

export function trackShare(platform: string, score: number): void {
  track({ name: 'share', properties: { platform, score } });
}

export function trackDifficultyCompletion(level: number): void {
  track({ name: 'difficulty_completion', properties: { level } });
}

export function trackDailyChallengeComplete(score: number): void {
  track({ name: 'daily_challenge_complete', properties: { score } });
}

export function trackRetention(day: number, action: string): void {
  track({ name: 'retention', properties: { day, action } });
}

export function trackStreakMilestone(streak: number): void {
  track({ name: 'streak_milestone', properties: { streak } });
}

export function trackAchievementUnlocked(achievementId: string): void {
  track({ name: 'achievement_unlocked', properties: { achievement_id: achievementId } });
}

export function trackCategoryPlayed(category: string): void {
  track({ name: 'category_played', properties: { category } });
}

export function getStoredEvents(): AnalyticsEvent[] {
  return [...events];
}

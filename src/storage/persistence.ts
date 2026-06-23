/**
 * Kalıcı depolama – AsyncStorage ile.
 * PB, XP/level/coins, başarılar ve günlük ödüller uygulama kapansa da korunur.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@human_or_ai_';

export const STORAGE_KEYS = {
  PERSONAL_BEST: `${PREFIX}pb`,
  PROGRESSION: `${PREFIX}progression`,
  ACHIEVEMENTS: `${PREFIX}achievements`,
  DAILY_REWARDS: `${PREFIX}daily_rewards`,
  DAILY_STREAK: `${PREFIX}daily_streak`,
  DAILY_CHALLENGES_COUNT: `${PREFIX}daily_challenges_count`,
  LANGUAGE: `${PREFIX}language`,
  REMOVE_ADS: `${PREFIX}remove_ads`,
  INTERSTITIAL_STATE: `${PREFIX}interstitial_state`,
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (__DEV__) console.warn('[Persistence] setItem failed', key, e);
  }
}

/**
 * Streak hatırlatma bildirimi – opsiyonel, izin isteyerek.
 * expo-notifications kullanır; web'de no-op.
 */

import { Platform } from 'react-native';
import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';
import * as Notifications from 'expo-notifications';

const STREAK_REMINDER_ENABLED_KEY = '@human_or_ai_streak_reminder';
const NOTIFICATION_ID = 'streak-reminder';

let memoryEnabled = false;

export async function loadStreakReminderPreference(): Promise<void> {
  const v = await getItem<boolean>(STREAK_REMINDER_ENABLED_KEY);
  memoryEnabled = v === true;
}

export function isStreakReminderEnabled(): boolean {
  return memoryEnabled;
}

export async function setStreakReminderEnabled(enabled: boolean): Promise<void> {
  memoryEnabled = enabled;
  await setItem(STREAK_REMINDER_ENABLED_KEY, enabled);
  if (!enabled) await cancelStreakReminder();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function cancelStreakReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
  } catch {
    // ignore
  }
}

/** Streak varsa yarın için tek bir hatırlatma planla (saat 20:00). */
export async function scheduleStreakReminderIfEnabled(streakDays: number): Promise<void> {
  if (Platform.OS === 'web' || streakDays < 1 || !memoryEnabled) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
    const title =
      streakDays >= 7
        ? "🔥 7 day streak! Don't break it — play today!"
        : `🔥 ${streakDays} day streak — play today to keep it!`;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: { title, body: 'Human or AI? is waiting for you.' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tomorrow },
    });
  } catch {
    // ignore
  }
}

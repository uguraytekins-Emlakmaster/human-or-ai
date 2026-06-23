/**
 * Sound design: tap, correct, wrong, streak bonus, game over.
 * Uses expo-av; load actual assets in production.
 */

import { Audio } from 'expo-av';

let tapSound: Audio.Sound | null = null;
let correctSound: Audio.Sound | null = null;
let wrongSound: Audio.Sound | null = null;
let streakSound: Audio.Sound | null = null;
let gameOverSound: Audio.Sound | null = null;
let initialized = false;
let soundEnabled = true;

export async function initSounds(): Promise<void> {
  if (initialized) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    initialized = true;
  } catch (e) {
    if (__DEV__) console.warn('Audio init:', e);
  }
}

async function loadAndPlay(
  key: string,
  holder: { current: Audio.Sound | null }
): Promise<void> {
  if (!soundEnabled) return;
  try {
    if (holder.current) {
      await holder.current.replayAsync();
    }
  } catch (_) {
    // Silent fail when assets not present
  }
}

export async function playTap(): Promise<void> {
  await loadAndPlay('tap', { current: tapSound });
}

export async function playCorrect(): Promise<void> {
  await loadAndPlay('correct', { current: correctSound });
}

export async function playWrong(): Promise<void> {
  await loadAndPlay('wrong', { current: wrongSound });
}

export async function playStreakBonus(): Promise<void> {
  await loadAndPlay('streak', { current: streakSound });
}

export async function playGameOver(): Promise<void> {
  await loadAndPlay('gameover', { current: gameOverSound });
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/** Örnek ses çal (Ayarlar’daki "Örnek oynat" için). Doğru/yanlış hissi veren kısa ses. */
const SAMPLE_CORRECT_URI = 'https://assets.mixkit.co/active_storage/sfx/2000.mp3';
const SAMPLE_WRONG_URI = 'https://assets.mixkit.co/active_storage/sfx/2003.mp3';

export async function playSampleCorrect(): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: SAMPLE_CORRECT_URI },
      { shouldPlay: true }
    );
    setTimeout(() => sound.unloadAsync().catch(() => {}), 1200);
  } catch {
    // ignore
  }
}

export async function playSampleWrong(): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: SAMPLE_WRONG_URI },
      { shouldPlay: true }
    );
    setTimeout(() => sound.unloadAsync().catch(() => {}), 1200);
  } catch {
    // ignore
  }
}

/**
 * Reklam sıklığı ve bonus güç – oyuncuyu sıkmadan.
 */

import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';
import { INTERSTITIAL_COOLDOWN_MINUTES, INTERSTITIAL_EVERY_N_GAMES } from '../constants/monetization';

export type InterstitialState = { gameOversSince: number; lastShownAt: number };

/** Sonraki oyuna eklenecek bonus güç (reklam izleyince); sadece bir oyun için, bellek. */
let bonusPowerUps: { skip: number } = { skip: 0 };

export function getBonusPowerUps(): { skip: number } {
  return { ...bonusPowerUps };
}

export function setBonusPowerUps(skip: number): void {
  bonusPowerUps = { skip };
}

export function clearBonusPowerUps(): void {
  bonusPowerUps = { skip: 0 };
}

let memoryInterstitial: InterstitialState = { gameOversSince: 0, lastShownAt: 0 };

export async function loadInterstitialState(): Promise<void> {
  const data = await getItem<InterstitialState>(STORAGE_KEYS.INTERSTITIAL_STATE);
  if (data && typeof data.gameOversSince === 'number') {
    memoryInterstitial = {
      gameOversSince: data.gameOversSince ?? 0,
      lastShownAt: data.lastShownAt ?? 0,
    };
  }
}

function persistInterstitial(): void {
  setItem(STORAGE_KEYS.INTERSTITIAL_STATE, memoryInterstitial);
}

/** Game over'da çağrılır; sayacı artırır. */
export function recordGameOverForInterstitial(): void {
  memoryInterstitial.gameOversSince += 1;
  persistInterstitial();
}

/** Interstitial gösterildikten sonra çağrılır. */
export function markInterstitialShown(): void {
  memoryInterstitial.gameOversSince = 0;
  memoryInterstitial.lastShownAt = Date.now();
  persistInterstitial();
}

/** Şu an interstitial göstermeli mi? (reklamsız alındıysa false döner – çağıran kontrol etmeli) */
export function shouldShowInterstitial(): boolean {
  const now = Date.now();
  const cooldownMs = INTERSTITIAL_COOLDOWN_MINUTES * 60 * 1000;
  if (now - memoryInterstitial.lastShownAt < cooldownMs) return false;
  return memoryInterstitial.gameOversSince >= INTERSTITIAL_EVERY_N_GAMES;
}

export function getInterstitialState(): InterstitialState {
  return { ...memoryInterstitial };
}

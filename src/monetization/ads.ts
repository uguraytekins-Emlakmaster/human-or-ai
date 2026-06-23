/**
 * Monetization: isteğe bağlı reklam, reklamsız satın alma. Oyuncuyu sıkmadan.
 * Production: expo-ads-admob veya react-native-google-mobile-ads bağlanır.
 */

import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';
import { IS_MONETIZATION_LIVE } from '../constants/monetization';
import { markInterstitialShown } from './monetizationState';

let memoryRemoveAds: boolean | null = null;

export async function loadRemoveAdsFromStorage(): Promise<void> {
  const v = await getItem<boolean>(STORAGE_KEYS.REMOVE_ADS);
  memoryRemoveAds = v === true;
}

export function removeAdsPurchased(): boolean {
  return memoryRemoveAds === true;
}

export function setRemoveAdsPurchased(value: boolean): void {
  memoryRemoveAds = value;
  setItem(STORAGE_KEYS.REMOVE_ADS, value);
}

export async function loadRewardedAd(): Promise<boolean> {
  if (!IS_MONETIZATION_LIVE) return false;
  // Production: AdMob rewarded ad load
  return true;
}

export async function showRewardedAd(): Promise<boolean> {
  if (!IS_MONETIZATION_LIVE) return false;
  // Production: show ad, resolve true when user earns reward
  return true;
}

/** Interstitial (game over'da, seyrek). Production: AdMob interstitial show. */
export async function showInterstitialAd(): Promise<void> {
  if (!IS_MONETIZATION_LIVE) return;
  // Production: show interstitial
  markInterstitialShown();
}

export function isPremium(): boolean {
  return removeAdsPurchased();
}

export async function purchaseRemoveAds(): Promise<boolean> {
  if (!IS_MONETIZATION_LIVE) return false;
  // Production: IAP flow; başarılı olunca setRemoveAdsPurchased(true)
  setRemoveAdsPurchased(true);
  return true;
}

export function isMonetizationLive(): boolean {
  return IS_MONETIZATION_LIVE;
}

/**
 * Gelir ayarları – oyuncuyu sıkmadan.
 * Reklamlar isteğe bağlı veya doğal molalarda; satın alma tamamen opsiyonel.
 */

/**
 * Gerçek AdMob + mağaza IAP bağlanana kadar false.
 * false iken reklam/satın alma UI gizlenir (sahte IAP mağaza reddine yol açar).
 */
export const IS_MONETIZATION_LIVE = false;

/** Interstitial: en fazla bu kadar oyun bittiğinde bir gösterilir (3 = her 3. game over) */
export const INTERSTITIAL_EVERY_N_GAMES = 3;

/** Interstitial: bu dakikadan kısa aralıklarla tekrar gösterilmez */
export const INTERSTITIAL_COOLDOWN_MINUTES = 5;

/** Rewarded reklam izleyince sonraki oyuna eklenecek ek Atla sayısı */
export const REWARDED_BONUS_SKIP = 1;

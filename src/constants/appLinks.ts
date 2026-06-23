/**
 * Mağaza ve gizlilik linkleri – yayın öncesi tek yerden güncelleyin.
 */

/** Google Play paket adı (app.json ile aynı) */
export const PLAY_STORE_PACKAGE = 'com.humanorai.game';

/** iOS App Store uygulama ID'si – uygulama yayınlandıktan sonra buraya yazın (örn. "1234567890") */
export const APP_STORE_ID = '';

/** GitHub Pages – docs/ klasörü push edildikten sonra aktif olur (Settings > Pages > GitHub Actions) */
export const GITHUB_PAGES_USERNAME = 'uguraytekin';
export const GITHUB_PAGES_REPO = 'human-or-ai';

export const PRIVACY_POLICY_URL = `https://${GITHUB_PAGES_USERNAME}.github.io/${GITHUB_PAGES_REPO}/privacy.html`;

/**
 * Meydan okuma paylaşım tabanı. Alan adınız yoksa boş bırakın; paylaşımda sadece kod kullanılır.
 * Örnek: https://humanorai.app/challenge
 */
export const CHALLENGE_SHARE_BASE_URL = '';

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE}`;
export const APP_STORE_URL = APP_STORE_ID
  ? `https://apps.apple.com/app/id${APP_STORE_ID}`
  : '';

/** Geliştirmeyi destekle (Kahve ısmarla / Ko-fi / PayPal). Boş bırakırsanız Ayarlar'da gizlenir. */
export const SUPPORT_DEVELOPMENT_URL = '';

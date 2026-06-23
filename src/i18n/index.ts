/**
 * Çok dilli destek – i18next + expo-localization.
 * Cihaz diline göre otomatik dil seçimi; fallback: İngilizce.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import tr from './locales/tr.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import id from './locales/id.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  es: { translation: es },
  pt: { translation: pt },
  de: { translation: de },
  fr: { translation: fr },
  ru: { translation: ru },
  id: { translation: id },
  ja: { translation: ja },
  ko: { translation: ko },
  hi: { translation: hi },
  ar: { translation: ar },
};

const deviceLocale = (Localization.getLocales()[0]?.languageCode ?? 'en').split('-')[0];
const supportedLanguages = ['en', 'tr', 'es', 'pt', 'de', 'fr', 'ru', 'id', 'ja', 'ko', 'hi', 'ar'];
const lng = supportedLanguages.includes(deviceLocale) ? deviceLocale : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: 'en',
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
});

import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';

/** Uygulama açılışında kaydedilmiş dili uygula (AsyncStorage'dan sonra çağrılır). */
export async function applySavedLanguage(): Promise<void> {
  try {
    const saved = await getItem<string>(STORAGE_KEYS.LANGUAGE);
    if (saved && supportedLanguages.includes(saved)) {
      await i18n.changeLanguage(saved);
    }
  } catch (_) {}
}

/** Dili değiştir ve kalıcı kaydet. */
export async function setLanguage(lng: string): Promise<void> {
  if (!supportedLanguages.includes(lng)) return;
  await i18n.changeLanguage(lng);
  await setItem(STORAGE_KEYS.LANGUAGE, lng);
}

export default i18n;
export { supportedLanguages };

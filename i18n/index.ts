import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { loadLanguage, saveLanguage } from '../services/languageStorage';

import en from './locales/en.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export async function initI18n(): Promise<typeof i18n> {
  const lng = await loadLanguage();

  await i18n.use(initReactI18next).init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
    lng,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
}

export async function changeLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  await saveLanguage(language);
}

export function getDateLocale(): string {
  return i18n.language === 'en' ? 'en-US' : 'ru-RU';
}

export default i18n;

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppLanguage } from '../i18n';

const LANGUAGE_STORAGE_KEY = '@gonext/language';

export async function loadLanguage(): Promise<AppLanguage> {
  const value = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return value === 'en' ? 'en' : 'ru';
}

export async function saveLanguage(language: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

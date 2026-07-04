import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemeMode } from '../constants/ui';

const THEME_STORAGE_KEY = '@gonext/theme_mode';

export async function loadThemeMode(): Promise<ThemeMode> {
  const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  return value === 'dark' ? 'dark' : 'light';
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
}

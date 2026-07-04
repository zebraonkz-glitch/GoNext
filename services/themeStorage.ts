import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_THEME_PRIMARY_ID,
  isThemePrimaryId,
  type ThemePrimaryId,
} from '../constants/themeColors';
import type { ThemeMode } from '../constants/ui';

const THEME_STORAGE_KEY = '@gonext/theme_mode';
const THEME_PRIMARY_STORAGE_KEY = '@gonext/theme_primary';

export async function loadThemeMode(): Promise<ThemeMode> {
  const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  return value === 'dark' ? 'dark' : 'light';
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
}

export async function loadThemePrimary() {
  const value = await AsyncStorage.getItem(THEME_PRIMARY_STORAGE_KEY);
  return isThemePrimaryId(value) ? value : DEFAULT_THEME_PRIMARY_ID;
}

export async function saveThemePrimary(primaryId: ThemePrimaryId): Promise<void> {
  await AsyncStorage.setItem(THEME_PRIMARY_STORAGE_KEY, primaryId);
}

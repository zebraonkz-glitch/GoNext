import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import type { ThemePrimaryId } from '../constants/themeColors';
import { getAppColors, type ThemeMode } from '../constants/ui';

function getOnPrimaryColor(primary: string): string {
  const hex = primary.replace('#', '');
  const rgb = Number.parseInt(hex, 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#1D1B20' : '#FFFFFF';
}

export function createAppTheme(mode: ThemeMode, primaryId: ThemePrimaryId): MD3Theme {
  const colors = getAppColors(mode, primaryId);
  const base = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    roundness: colors.radius,
    dark: mode === 'dark',
    colors: {
      ...base.colors,
      primary: colors.primary,
      onPrimary: getOnPrimaryColor(colors.primary),
      error: colors.error,
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.surfaceMuted,
      onSurface: mode === 'dark' ? '#E1E1E1' : base.colors.onSurface,
      onBackground: mode === 'dark' ? '#E1E1E1' : base.colors.onBackground,
      elevation: {
        ...base.colors.elevation,
        level0: colors.background,
        level1: colors.surface,
        level2: colors.surface,
        level3: colors.surface,
        level4: colors.surface,
        level5: colors.surface,
      },
    },
  };
}

/** @deprecated Используйте createAppTheme('light', primaryId) */
export const appTheme = createAppTheme('light', 'blue');

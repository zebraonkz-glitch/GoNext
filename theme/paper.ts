import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { getAppColors, type ThemeMode } from '../constants/ui';

export function createAppTheme(mode: ThemeMode): MD3Theme {
  const colors = getAppColors(mode);
  const base = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    roundness: colors.radius,
    dark: mode === 'dark',
    colors: {
      ...base.colors,
      primary: colors.primary,
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

/** @deprecated Используйте createAppTheme('light') */
export const appTheme = createAppTheme('light');

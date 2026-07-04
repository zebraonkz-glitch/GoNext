import {
  DEFAULT_THEME_PRIMARY_ID,
  getThemePrimaryColor,
  type ThemePrimaryId,
} from './themeColors';

export type ThemeMode = 'light' | 'dark';
export type { ThemePrimaryId };

export interface AppColors {
  surface: string;
  surfaceMuted: string;
  visitedSurface: string;
  headerOverlay: string;
  background: string;
  primary: string;
  error: string;
  radius: number;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
}

const shared = {
  radius: 8,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
} as const;

const lightBase = {
  ...shared,
  surface: '#FFFFFF',
  surfaceMuted: '#F5F5F5',
  visitedSurface: '#F3F8F3',
  headerOverlay: 'rgba(255, 255, 255, 0.88)',
  background: 'transparent',
  error: '#B00020',
} satisfies Omit<AppColors, 'primary'>;

const darkBase = {
  ...shared,
  surface: '#1E1E1E',
  surfaceMuted: '#2C2C2C',
  visitedSurface: '#243524',
  headerOverlay: 'rgba(30, 30, 30, 0.92)',
  background: '#121212',
  error: '#CF6679',
} satisfies Omit<AppColors, 'primary'>;

/** @deprecated Используйте getAppColors(mode, primaryId) */
export const lightColors: AppColors = {
  ...lightBase,
  primary: getThemePrimaryColor(DEFAULT_THEME_PRIMARY_ID, 'light'),
};

/** @deprecated Используйте getAppColors(mode, primaryId) */
export const darkColors: AppColors = {
  ...darkBase,
  primary: getThemePrimaryColor(DEFAULT_THEME_PRIMARY_ID, 'dark'),
};

export function getAppColors(
  mode: ThemeMode,
  primaryId: ThemePrimaryId = DEFAULT_THEME_PRIMARY_ID
): AppColors {
  const base = mode === 'dark' ? darkBase : lightBase;
  return {
    ...base,
    primary: getThemePrimaryColor(primaryId, mode),
  };
}

/** @deprecated Используйте useAppTheme().colors */
export const UI = lightColors;

export const paperCardStyle = {
  borderRadius: shared.radius,
};

export function getPaperInputStyle(colors: AppColors) {
  return {
    backgroundColor: colors.surface,
  };
}

export function getPaperSearchbarStyle(colors: AppColors) {
  return {
    backgroundColor: colors.surface,
    marginHorizontal: colors.spacing.md,
    marginVertical: colors.spacing.sm,
    borderRadius: colors.radius,
  };
}

/** @deprecated Используйте getPaperInputStyle(useAppTheme().colors) */
export const paperInputStyle = getPaperInputStyle(lightColors);

/** @deprecated Используйте getPaperSearchbarStyle(useAppTheme().colors) */
export const paperSearchbarStyle = getPaperSearchbarStyle(lightColors);

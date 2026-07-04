export type ThemeMode = 'light' | 'dark';

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

export const lightColors: AppColors = {
  ...shared,
  surface: '#FFFFFF',
  surfaceMuted: '#F5F5F5',
  visitedSurface: '#F3F8F3',
  headerOverlay: 'rgba(255, 255, 255, 0.88)',
  background: 'transparent',
  primary: '#1565C0',
  error: '#B00020',
};

export const darkColors: AppColors = {
  ...shared,
  surface: '#1E1E1E',
  surfaceMuted: '#2C2C2C',
  visitedSurface: '#243524',
  headerOverlay: 'rgba(30, 30, 30, 0.92)',
  background: '#121212',
  primary: '#90CAF9',
  error: '#CF6679',
};

export function getAppColors(mode: ThemeMode): AppColors {
  return mode === 'dark' ? darkColors : lightColors;
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

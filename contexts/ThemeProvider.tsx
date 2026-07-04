import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PaperProvider, type MD3Theme } from 'react-native-paper';

import { DEFAULT_THEME_PRIMARY_ID, type ThemePrimaryId } from '../constants/themeColors';
import { getAppColors, type AppColors, type ThemeMode } from '../constants/ui';
import {
  loadThemeMode,
  loadThemePrimary,
  saveThemeMode,
  saveThemePrimary,
} from '../services/themeStorage';
import { createAppTheme } from '../theme/paper';
import { paperSettings } from '../theme/paperSettings';

interface ThemeContextValue {
  mode: ThemeMode;
  primaryId: ThemePrimaryId;
  isDark: boolean;
  colors: AppColors;
  paperTheme: MD3Theme;
  setMode: (mode: ThemeMode) => Promise<void>;
  setPrimaryId: (primaryId: ThemePrimaryId) => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [primaryId, setPrimaryIdState] = useState<ThemePrimaryId>(DEFAULT_THEME_PRIMARY_ID);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void Promise.all([loadThemeMode(), loadThemePrimary()])
      .then(([loadedMode, loadedPrimaryId]) => {
        setModeState(loadedMode);
        setPrimaryIdState(loadedPrimaryId);
      })
      .finally(() => setIsReady(true));
  }, []);

  const setMode = useCallback(async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await saveThemeMode(nextMode);
  }, []);

  const setPrimaryId = useCallback(async (nextPrimaryId: ThemePrimaryId) => {
    setPrimaryIdState(nextPrimaryId);
    await saveThemePrimary(nextPrimaryId);
  }, []);

  const colors = useMemo(() => getAppColors(mode, primaryId), [mode, primaryId]);
  const paperTheme = useMemo(() => createAppTheme(mode, primaryId), [mode, primaryId]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      primaryId,
      isDark: mode === 'dark',
      colors,
      paperTheme,
      setMode,
      setPrimaryId,
      isReady,
    }),
    [mode, primaryId, colors, paperTheme, setMode, setPrimaryId, isReady]
  );

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme} settings={paperSettings}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme должен использоваться внутри ThemeProvider');
  }
  return context;
}

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

import { getAppColors, type AppColors, type ThemeMode } from '../constants/ui';
import { loadThemeMode, saveThemeMode } from '../services/themeStorage';
import { createAppTheme } from '../theme/paper';
import { paperSettings } from '../theme/paperSettings';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: AppColors;
  paperTheme: MD3Theme;
  setMode: (mode: ThemeMode) => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void loadThemeMode()
      .then(setModeState)
      .finally(() => setIsReady(true));
  }, []);

  const setMode = useCallback(async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await saveThemeMode(nextMode);
  }, []);

  const colors = useMemo(() => getAppColors(mode), [mode]);
  const paperTheme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors,
      paperTheme,
      setMode,
      isReady,
    }),
    [mode, colors, paperTheme, setMode, isReady]
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

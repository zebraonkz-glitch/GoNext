import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ImageSourcePropType } from 'react-native';
import { PaperProvider, type MD3Theme } from 'react-native-paper';

import {
  DEFAULT_BACKGROUND_ID,
  resolveBackgroundSource,
  type BackgroundId,
  type BuiltInBackgroundId,
} from '../constants/backgrounds';
import { DEFAULT_THEME_PRIMARY_ID, type ThemePrimaryId } from '../constants/themeColors';
import { getAppColors, type AppColors, type ThemeMode } from '../constants/ui';
import {
  loadBackgroundSettings,
  saveBuiltInBackground,
  saveCustomBackground,
} from '../services/backgroundStorage';
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
  backgroundId: BackgroundId;
  customBackgroundUri: string | null;
  backgroundSource: ImageSourcePropType;
  isDark: boolean;
  colors: AppColors;
  paperTheme: MD3Theme;
  setMode: (mode: ThemeMode) => Promise<void>;
  setPrimaryId: (primaryId: ThemePrimaryId) => Promise<void>;
  setBuiltInBackground: (id: BuiltInBackgroundId) => Promise<void>;
  setCustomBackground: (uri: string) => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [primaryId, setPrimaryIdState] = useState<ThemePrimaryId>(DEFAULT_THEME_PRIMARY_ID);
  const [backgroundId, setBackgroundIdState] = useState<BackgroundId>(DEFAULT_BACKGROUND_ID);
  const [customBackgroundUri, setCustomBackgroundUriState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void Promise.all([loadThemeMode(), loadThemePrimary(), loadBackgroundSettings()])
      .then(([loadedMode, loadedPrimaryId, loadedBackground]) => {
        setModeState(loadedMode);
        setPrimaryIdState(loadedPrimaryId);
        setBackgroundIdState(loadedBackground.backgroundId);
        setCustomBackgroundUriState(loadedBackground.customUri);
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

  const setBuiltInBackground = useCallback(async (id: BuiltInBackgroundId) => {
    setBackgroundIdState(id);
    setCustomBackgroundUriState(null);
    await saveBuiltInBackground(id);
  }, []);

  const setCustomBackground = useCallback(async (uri: string) => {
    const savedUri = await saveCustomBackground(uri);
    setBackgroundIdState('custom');
    setCustomBackgroundUriState(savedUri);
  }, []);

  const colors = useMemo(() => getAppColors(mode, primaryId), [mode, primaryId]);
  const paperTheme = useMemo(() => createAppTheme(mode, primaryId), [mode, primaryId]);
  const backgroundSource = useMemo(
    () => resolveBackgroundSource(backgroundId, customBackgroundUri),
    [backgroundId, customBackgroundUri]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      primaryId,
      backgroundId,
      customBackgroundUri,
      backgroundSource,
      isDark: mode === 'dark',
      colors,
      paperTheme,
      setMode,
      setPrimaryId,
      setBuiltInBackground,
      setCustomBackground,
      isReady,
    }),
    [
      mode,
      primaryId,
      backgroundId,
      customBackgroundUri,
      backgroundSource,
      colors,
      paperTheme,
      setMode,
      setPrimaryId,
      setBuiltInBackground,
      setCustomBackground,
      isReady,
    ]
  );

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

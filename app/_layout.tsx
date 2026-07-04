import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { I18nextProvider } from 'react-i18next';

import { AppBackground } from '../components/AppBackground';
import { DataProvider } from '../contexts/DataProvider';
import { SnackbarProvider } from '../contexts/SnackbarContext';
import { ThemeProvider, useAppTheme } from '../contexts/ThemeProvider';
import { DATABASE_NAME } from '../constants';
import { initDatabase } from '../db/database';
import i18n, { initI18n } from '../i18n';
import { materialCommunityIconFont } from '../theme/paperSettings';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootNavigator() {
  const { isDark } = useAppTheme();

  return (
    <AppBackground>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          ...(Platform.OS === 'web'
            ? {
                sceneContainerStyle: { backgroundColor: 'transparent' },
                cardStyle: { backgroundColor: 'transparent' },
              }
            : {}),
        }}
      />
    </AppBackground>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(materialCommunityIconFont);
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    void initI18n().finally(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && i18nReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, i18nReady]);

  if ((!fontsLoaded && !fontError) || !i18nReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
          <SnackbarProvider>
            <DataProvider>
              <RootNavigator />
            </DataProvider>
          </SnackbarProvider>
        </SQLiteProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

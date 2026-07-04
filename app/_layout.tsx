import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { AppBackground } from '../components/AppBackground';
import { DataProvider } from '../contexts/DataProvider';
import { SnackbarProvider } from '../contexts/SnackbarContext';
import { ThemeProvider, useAppTheme } from '../contexts/ThemeProvider';
import { DATABASE_NAME } from '../constants';
import { initDatabase } from '../db/database';
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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
        <SnackbarProvider>
          <DataProvider>
            <RootNavigator />
          </DataProvider>
        </SnackbarProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}

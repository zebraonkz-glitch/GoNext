import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

import { AppBackground } from '../components/AppBackground';
import { DataProvider } from '../contexts/DataProvider';
import { SnackbarProvider } from '../contexts/SnackbarContext';
import { DATABASE_NAME } from '../constants';
import { initDatabase } from '../db/database';
import { appTheme } from '../theme/paper';
import { materialCommunityIconFont, paperSettings } from '../theme/paperSettings';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

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
    <PaperProvider theme={appTheme} settings={paperSettings}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
        <SnackbarProvider>
          <DataProvider>
            <AppBackground>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              />
            </AppBackground>
          </DataProvider>
        </SnackbarProvider>
      </SQLiteProvider>
    </PaperProvider>
  );
}

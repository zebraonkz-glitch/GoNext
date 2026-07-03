import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { AppBackground } from '../components/AppBackground';
import { DataProvider } from '../contexts/DataProvider';
import { SnackbarProvider } from '../contexts/SnackbarContext';
import { DATABASE_NAME } from '../constants';
import { initDatabase } from '../db/database';
import { appTheme } from '../theme/paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={appTheme}>
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

import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { DataProvider } from '../contexts/DataProvider';
import { DATABASE_NAME } from '../constants';
import { initDatabase } from '../db/database';

export default function RootLayout() {
  return (
    <PaperProvider>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
        <DataProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </DataProvider>
      </SQLiteProvider>
    </PaperProvider>
  );
}

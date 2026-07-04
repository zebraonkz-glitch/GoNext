import type { SQLiteDatabase } from 'expo-sqlite';

import { runMigrations } from './migrations';

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');
  } catch {
    // На web часть PRAGMA может быть недоступна.
  }
  await runMigrations(db);
}

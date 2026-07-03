import type { SQLiteDatabase } from 'expo-sqlite';

import { SCHEMA_VERSION } from '../constants';
import {
  CREATE_PHOTOS_TABLE,
  CREATE_PLACES_TABLE,
  CREATE_SCHEMA_VERSION_TABLE,
  CREATE_TRIP_PLACES_TABLE,
  CREATE_TRIPS_TABLE,
} from './schema';

async function getCurrentVersion(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );
  return row?.version ?? 0;
}

async function setVersion(db: SQLiteDatabase, version: number): Promise<void> {
  await db.runAsync('DELETE FROM schema_version');
  await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', version);
}

async function migrateToV1(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(CREATE_PLACES_TABLE);
  await db.execAsync(CREATE_TRIPS_TABLE);
  await db.execAsync(CREATE_TRIP_PLACES_TABLE);
  await db.execAsync(CREATE_PHOTOS_TABLE);
}

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(CREATE_SCHEMA_VERSION_TABLE);

  const currentVersion = await getCurrentVersion(db);

  if (currentVersion < 1) {
    await migrateToV1(db);
    await setVersion(db, 1);
  }

  if (currentVersion > SCHEMA_VERSION) {
    throw new Error(`Схема БД (${currentVersion}) новее поддерживаемой версии (${SCHEMA_VERSION})`);
  }
}

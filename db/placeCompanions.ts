import type { SQLiteDatabase } from 'expo-sqlite';

import type { Companion } from '../types';
import { mapCompanionRow } from './mappers';

export async function getCompanionsForPlace(
  db: SQLiteDatabase,
  placeId: string
): Promise<Companion[]> {
  const rows = await db.getAllAsync<Parameters<typeof mapCompanionRow>[0]>(
    `SELECT c.*
     FROM companions c
     INNER JOIN place_companions pc ON pc.companionId = c.id
     WHERE pc.placeId = ?
     ORDER BY c.name COLLATE NOCASE ASC`,
    placeId
  );
  return rows.map(mapCompanionRow);
}

export async function linkCompanionToPlace(
  db: SQLiteDatabase,
  placeId: string,
  companionId: string
): Promise<boolean> {
  const result = await db.runAsync(
    'INSERT OR IGNORE INTO place_companions (placeId, companionId) VALUES (?, ?)',
    placeId,
    companionId
  );
  return (result.changes ?? 0) > 0;
}

export async function unlinkCompanionFromPlace(
  db: SQLiteDatabase,
  placeId: string,
  companionId: string
): Promise<boolean> {
  const result = await db.runAsync(
    'DELETE FROM place_companions WHERE placeId = ? AND companionId = ?',
    placeId,
    companionId
  );
  return (result.changes ?? 0) > 0;
}

export async function getLinkedCompanionIds(
  db: SQLiteDatabase,
  placeId: string
): Promise<string[]> {
  const rows = await db.getAllAsync<{ companionId: string }>(
    'SELECT companionId FROM place_companions WHERE placeId = ?',
    placeId
  );
  return rows.map((row) => row.companionId);
}

import type { SQLiteDatabase } from 'expo-sqlite';

import i18n from '../i18n';
import type { CreatePlaceInput, Place, UpdatePlaceInput } from '../types';
import { generateId } from '../utils/id';
import { mapPlaceRow } from './mappers';

export async function getAllPlaces(db: SQLiteDatabase): Promise<Place[]> {
  const rows = await db.getAllAsync<Parameters<typeof mapPlaceRow>[0]>(
    'SELECT * FROM places ORDER BY createdAt DESC'
  );
  return rows.map(mapPlaceRow);
}

export async function getPlaceById(db: SQLiteDatabase, id: string): Promise<Place | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapPlaceRow>[0]>(
    'SELECT * FROM places WHERE id = ?',
    id
  );
  return row ? mapPlaceRow(row) : null;
}

export async function createPlace(db: SQLiteDatabase, input: CreatePlaceInput): Promise<Place> {
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO places (id, name, description, visitlater, liked, latitude, longitude, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.description,
    input.visitlater ? 1 : 0,
    input.liked ? 1 : 0,
    input.dd.latitude,
    input.dd.longitude,
    createdAt
  );

  const place = await getPlaceById(db, id);
  if (!place) {
    throw new Error(i18n.t('errors.createPlaceFailed'));
  }
  return place;
}

export async function updatePlace(
  db: SQLiteDatabase,
  id: string,
  input: UpdatePlaceInput
): Promise<Place | null> {
  const existing = await getPlaceById(db, id);
  if (!existing) {
    return null;
  }

  const updated: Place = {
    ...existing,
    ...input,
    dd: input.dd ? { ...existing.dd, ...input.dd } : existing.dd,
  };

  await db.runAsync(
    `UPDATE places
     SET name = ?, description = ?, visitlater = ?, liked = ?, latitude = ?, longitude = ?
     WHERE id = ?`,
    updated.name,
    updated.description,
    updated.visitlater ? 1 : 0,
    updated.liked ? 1 : 0,
    updated.dd.latitude,
    updated.dd.longitude,
    id
  );

  return getPlaceById(db, id);
}

export async function deletePlace(db: SQLiteDatabase, id: string): Promise<boolean> {
  const result = await db.runAsync('DELETE FROM places WHERE id = ?', id);
  return (result.changes ?? 0) > 0;
}

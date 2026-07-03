import type { SQLiteDatabase } from 'expo-sqlite';

import type { Photo, PhotoEntityType } from '../types';
import { generateId } from '../utils/id';
import { mapPhotoRow } from './mappers';

export async function getPhotosByEntity(
  db: SQLiteDatabase,
  entityType: PhotoEntityType,
  entityId: string
): Promise<Photo[]> {
  const rows = await db.getAllAsync<Parameters<typeof mapPhotoRow>[0]>(
    'SELECT * FROM photos WHERE entityType = ? AND entityId = ? ORDER BY createdAt ASC',
    entityType,
    entityId
  );
  return rows.map(mapPhotoRow);
}

export async function getPhotoById(db: SQLiteDatabase, id: string): Promise<Photo | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapPhotoRow>[0]>(
    'SELECT * FROM photos WHERE id = ?',
    id
  );
  return row ? mapPhotoRow(row) : null;
}

export async function createPhotoRecord(
  db: SQLiteDatabase,
  entityType: PhotoEntityType,
  entityId: string,
  filePath: string
): Promise<Photo> {
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO photos (id, entityType, entityId, filePath, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    id,
    entityType,
    entityId,
    filePath,
    createdAt
  );

  const photo = await getPhotoById(db, id);
  if (!photo) {
    throw new Error('Не удалось сохранить фото');
  }
  return photo;
}

export async function deletePhotoRecord(db: SQLiteDatabase, id: string): Promise<Photo | null> {
  const photo = await getPhotoById(db, id);
  if (!photo) {
    return null;
  }

  await db.runAsync('DELETE FROM photos WHERE id = ?', id);
  return photo;
}

export async function deletePhotosByEntity(
  db: SQLiteDatabase,
  entityType: PhotoEntityType,
  entityId: string
): Promise<Photo[]> {
  const photos = await getPhotosByEntity(db, entityType, entityId);
  await db.runAsync('DELETE FROM photos WHERE entityType = ? AND entityId = ?', entityType, entityId);
  return photos;
}

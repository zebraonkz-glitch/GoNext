import * as FileSystem from 'expo-file-system/legacy';
import type { SQLiteDatabase } from 'expo-sqlite';

import { PHOTOS_DIRECTORY } from '../constants';
import { mapPhotoRow } from './mappers';
import { deletePhotoFile } from '../services/photos';

export async function clearAllData(db: SQLiteDatabase): Promise<void> {
  const photoRows = await db.getAllAsync<Parameters<typeof mapPhotoRow>[0]>('SELECT * FROM photos');

  for (const row of photoRows) {
    await deletePhotoFile(mapPhotoRow(row));
  }

  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM photos;');
    await db.execAsync('DELETE FROM place_companions;');
    await db.execAsync('DELETE FROM trip_places;');
    await db.execAsync('DELETE FROM trips;');
    await db.execAsync('DELETE FROM companions;');
    await db.execAsync('DELETE FROM places;');
  });

  const base = FileSystem.documentDirectory;
  if (!base) {
    return;
  }

  const photosDir = `${base}${PHOTOS_DIRECTORY}/`;
  const info = await FileSystem.getInfoAsync(photosDir);
  if (info.exists) {
    await FileSystem.deleteAsync(photosDir, { idempotent: true });
  }
}

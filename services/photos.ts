import * as FileSystem from 'expo-file-system/legacy';
import type { SQLiteDatabase } from 'expo-sqlite';

import { PHOTOS_DIRECTORY } from '../constants';
import { createPhotoRecord, deletePhotoRecord } from '../db/photos';
import i18n from '../i18n';
import type { Photo, PhotoEntityType } from '../types';
import { generateId } from '../utils/id';

function getPhotosDirectoryUri(): string {
  const base = FileSystem.documentDirectory;
  if (!base) {
    throw new Error(i18n.t('photos.documentsUnavailable'));
  }
  return `${base}${PHOTOS_DIRECTORY}/`;
}

export async function ensurePhotosDirectory(): Promise<string> {
  const directoryUri = getPhotosDirectoryUri();
  const info = await FileSystem.getInfoAsync(directoryUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }
  return directoryUri;
}

function getExtensionFromUri(uri: string): string {
  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

export async function savePhotoFromUri(
  db: SQLiteDatabase,
  sourceUri: string,
  entityType: PhotoEntityType,
  entityId: string
): Promise<Photo> {
  const directoryUri = await ensurePhotosDirectory();
  const extension = getExtensionFromUri(sourceUri);
  const fileName = `${entityType}-${entityId}-${generateId()}${extension}`;
  const destinationUri = `${directoryUri}${fileName}`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destinationUri,
  });

  return createPhotoRecord(db, entityType, entityId, destinationUri);
}

export async function deletePhotoFile(photo: Photo): Promise<void> {
  const info = await FileSystem.getInfoAsync(photo.filePath);
  if (info.exists) {
    await FileSystem.deleteAsync(photo.filePath, { idempotent: true });
  }
}

export async function deletePhoto(
  db: SQLiteDatabase,
  photoId: string
): Promise<boolean> {
  const photo = await deletePhotoRecord(db, photoId);
  if (!photo) {
    return false;
  }

  await deletePhotoFile(photo);
  return true;
}

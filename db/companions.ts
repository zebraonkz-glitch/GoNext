import type { SQLiteDatabase } from 'expo-sqlite';

import i18n from '../i18n';
import type { Companion, CreateCompanionInput, UpdateCompanionInput } from '../types';
import { generateId } from '../utils/id';
import { mapCompanionRow } from './mappers';

export async function getAllCompanions(db: SQLiteDatabase): Promise<Companion[]> {
  const rows = await db.getAllAsync<Parameters<typeof mapCompanionRow>[0]>(
    'SELECT * FROM companions ORDER BY name COLLATE NOCASE ASC'
  );
  return rows.map(mapCompanionRow);
}

export async function getCompanionById(db: SQLiteDatabase, id: string): Promise<Companion | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapCompanionRow>[0]>(
    'SELECT * FROM companions WHERE id = ?',
    id
  );
  return row ? mapCompanionRow(row) : null;
}

export async function createCompanion(
  db: SQLiteDatabase,
  input: CreateCompanionInput
): Promise<Companion> {
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO companions (id, name, phone, email, notes, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.phone,
    input.email,
    input.notes,
    createdAt
  );

  const companion = await getCompanionById(db, id);
  if (!companion) {
    throw new Error(i18n.t('companions.createFailed'));
  }
  return companion;
}

export async function updateCompanion(
  db: SQLiteDatabase,
  id: string,
  input: UpdateCompanionInput
): Promise<Companion | null> {
  const existing = await getCompanionById(db, id);
  if (!existing) {
    return null;
  }

  const updated: Companion = { ...existing, ...input };

  await db.runAsync(
    `UPDATE companions SET name = ?, phone = ?, email = ?, notes = ? WHERE id = ?`,
    updated.name,
    updated.phone,
    updated.email,
    updated.notes,
    id
  );

  return getCompanionById(db, id);
}

export async function deleteCompanion(db: SQLiteDatabase, id: string): Promise<boolean> {
  const result = await db.runAsync('DELETE FROM companions WHERE id = ?', id);
  return (result.changes ?? 0) > 0;
}

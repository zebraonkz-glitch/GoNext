import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateTripInput, Trip, UpdateTripInput } from '../types';
import { generateId } from '../utils/id';
import { mapTripRow } from './mappers';

export async function getAllTrips(db: SQLiteDatabase): Promise<Trip[]> {
  const rows = await db.getAllAsync<Parameters<typeof mapTripRow>[0]>(
    'SELECT * FROM trips ORDER BY createdAt DESC'
  );
  return rows.map(mapTripRow);
}

export async function getTripById(db: SQLiteDatabase, id: string): Promise<Trip | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapTripRow>[0]>(
    'SELECT * FROM trips WHERE id = ?',
    id
  );
  return row ? mapTripRow(row) : null;
}

export async function getCurrentTrip(db: SQLiteDatabase): Promise<Trip | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapTripRow>[0]>(
    'SELECT * FROM trips WHERE current = 1 LIMIT 1'
  );
  return row ? mapTripRow(row) : null;
}

async function clearCurrentTrip(db: SQLiteDatabase, exceptId?: string): Promise<void> {
  if (exceptId) {
    await db.runAsync('UPDATE trips SET current = 0 WHERE id != ?', exceptId);
    return;
  }
  await db.runAsync('UPDATE trips SET current = 0');
}

export async function createTrip(db: SQLiteDatabase, input: CreateTripInput): Promise<Trip> {
  const id = generateId();
  const createdAt = new Date().toISOString();

  if (input.current) {
    await clearCurrentTrip(db);
  }

  await db.runAsync(
    `INSERT INTO trips (id, title, description, startDate, endDate, current, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.title,
    input.description,
    input.startDate,
    input.endDate,
    input.current ? 1 : 0,
    createdAt
  );

  const trip = await getTripById(db, id);
  if (!trip) {
    throw new Error('Не удалось создать поездку');
  }
  return trip;
}

export async function updateTrip(
  db: SQLiteDatabase,
  id: string,
  input: UpdateTripInput
): Promise<Trip | null> {
  const existing = await getTripById(db, id);
  if (!existing) {
    return null;
  }

  const updated: Trip = { ...existing, ...input };

  if (updated.current) {
    await clearCurrentTrip(db, id);
  }

  await db.runAsync(
    `UPDATE trips
     SET title = ?, description = ?, startDate = ?, endDate = ?, current = ?
     WHERE id = ?`,
    updated.title,
    updated.description,
    updated.startDate,
    updated.endDate,
    updated.current ? 1 : 0,
    id
  );

  return getTripById(db, id);
}

export async function deleteTrip(db: SQLiteDatabase, id: string): Promise<boolean> {
  const result = await db.runAsync('DELETE FROM trips WHERE id = ?', id);
  return (result.changes ?? 0) > 0;
}

import type { SQLiteDatabase } from 'expo-sqlite';

import i18n from '../i18n';
import type { CreateTripPlaceInput, TripPlace, UpdateTripPlaceInput } from '../types';
import { generateId } from '../utils/id';
import { mapTripPlaceRow } from './mappers';

export async function getTripPlacesByTripId(
  db: SQLiteDatabase,
  tripId: string
): Promise<TripPlace[]> {
  const rows = await db.getAllAsync<Parameters<typeof mapTripPlaceRow>[0]>(
    'SELECT * FROM trip_places WHERE tripId = ? ORDER BY orderIndex ASC',
    tripId
  );
  return rows.map(mapTripPlaceRow);
}

export async function getTripPlaceById(
  db: SQLiteDatabase,
  id: string
): Promise<TripPlace | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapTripPlaceRow>[0]>(
    'SELECT * FROM trip_places WHERE id = ?',
    id
  );
  return row ? mapTripPlaceRow(row) : null;
}

export async function getNextTripPlace(
  db: SQLiteDatabase,
  tripId: string
): Promise<TripPlace | null> {
  const row = await db.getFirstAsync<Parameters<typeof mapTripPlaceRow>[0]>(
    `SELECT * FROM trip_places
     WHERE tripId = ? AND visited = 0
     ORDER BY orderIndex ASC
     LIMIT 1`,
    tripId
  );
  return row ? mapTripPlaceRow(row) : null;
}

export async function createTripPlace(
  db: SQLiteDatabase,
  input: CreateTripPlaceInput
): Promise<TripPlace> {
  const id = generateId();

  await db.runAsync(
    `INSERT INTO trip_places (id, tripId, placeId, orderIndex, visited, visitDate, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.tripId,
    input.placeId,
    input.order,
    input.visited ? 1 : 0,
    input.visitDate,
    input.notes
  );

  const tripPlace = await getTripPlaceById(db, id);
  if (!tripPlace) {
    throw new Error(i18n.t('trips.addPlaceFailed'));
  }
  return tripPlace;
}

export async function updateTripPlace(
  db: SQLiteDatabase,
  id: string,
  input: UpdateTripPlaceInput
): Promise<TripPlace | null> {
  const existing = await getTripPlaceById(db, id);
  if (!existing) {
    return null;
  }

  const updated: TripPlace = { ...existing, ...input };

  await db.runAsync(
    `UPDATE trip_places
     SET orderIndex = ?, visited = ?, visitDate = ?, notes = ?
     WHERE id = ?`,
    updated.order,
    updated.visited ? 1 : 0,
    updated.visitDate,
    updated.notes,
    id
  );

  return getTripPlaceById(db, id);
}

export async function getTripPlaceStatsByTripIds(
  db: SQLiteDatabase,
  tripIds: string[]
): Promise<Record<string, { total: number; visited: number }>> {
  if (tripIds.length === 0) {
    return {};
  }

  const placeholders = tripIds.map(() => '?').join(', ');
  const rows = await db.getAllAsync<{ tripId: string; total: number; visited: number }>(
    `SELECT tripId, COUNT(*) as total, SUM(visited) as visited
     FROM trip_places
     WHERE tripId IN (${placeholders})
     GROUP BY tripId`,
    ...tripIds
  );

  return Object.fromEntries(
    rows.map((row) => [row.tripId, { total: row.total, visited: row.visited }])
  );
}

export async function reorderTripPlaces(
  db: SQLiteDatabase,
  tripId: string,
  orderedIds: string[]
): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (let index = 0; index < orderedIds.length; index += 1) {
      await db.runAsync(
        'UPDATE trip_places SET orderIndex = ? WHERE id = ? AND tripId = ?',
        index,
        orderedIds[index],
        tripId
      );
    }
  });
}

export async function deleteTripPlace(db: SQLiteDatabase, id: string): Promise<boolean> {
  const result = await db.runAsync('DELETE FROM trip_places WHERE id = ?', id);
  return (result.changes ?? 0) > 0;
}

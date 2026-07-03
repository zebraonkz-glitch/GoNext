import type { SQLiteDatabase } from 'expo-sqlite';

import * as placeRepo from '../db/places';
import * as tripPlaceRepo from '../db/tripPlaces';
import * as tripRepo from '../db/trips';
import type { Place, Trip, TripPlace } from '../types';

export type NextPlaceStatus = 'no_current_trip' | 'route_completed' | 'has_next';

export interface NextPlaceResult {
  status: NextPlaceStatus;
  trip?: Trip;
  tripPlace?: TripPlace;
  place?: Place;
}

export async function getNextPlace(db: SQLiteDatabase): Promise<NextPlaceResult> {
  const trip = await tripRepo.getCurrentTrip(db);
  if (!trip) {
    return { status: 'no_current_trip' };
  }

  const tripPlace = await tripPlaceRepo.getNextTripPlace(db, trip.id);
  if (!tripPlace) {
    return { status: 'route_completed', trip };
  }

  const place = await placeRepo.getPlaceById(db, tripPlace.placeId);
  if (!place) {
    return { status: 'route_completed', trip };
  }

  return {
    status: 'has_next',
    trip,
    tripPlace,
    place,
  };
}

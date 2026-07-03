import type { Photo, PhotoEntityType, Place, Trip, TripPlace } from '../types';

type PlaceRow = {
  id: string;
  name: string;
  description: string;
  visitlater: number;
  liked: number;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};

type TripRow = {
  id: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  current: number;
  createdAt: string;
};

type TripPlaceRow = {
  id: string;
  tripId: string;
  placeId: string;
  orderIndex: number;
  visited: number;
  visitDate: string | null;
  notes: string;
};

type PhotoRow = {
  id: string;
  entityType: string;
  entityId: string;
  filePath: string;
  createdAt: string;
};

export function mapPlaceRow(row: PlaceRow): Place {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    visitlater: row.visitlater === 1,
    liked: row.liked === 1,
    dd: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    createdAt: row.createdAt,
  };
}

export function mapTripRow(row: TripRow): Trip {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startDate: row.startDate,
    endDate: row.endDate,
    current: row.current === 1,
    createdAt: row.createdAt,
  };
}

export function mapTripPlaceRow(row: TripPlaceRow): TripPlace {
  return {
    id: row.id,
    tripId: row.tripId,
    placeId: row.placeId,
    order: row.orderIndex,
    visited: row.visited === 1,
    visitDate: row.visitDate,
    notes: row.notes,
  };
}

export function mapPhotoRow(row: PhotoRow): Photo {
  return {
    id: row.id,
    entityType: row.entityType as PhotoEntityType,
    entityId: row.entityId,
    filePath: row.filePath,
    createdAt: row.createdAt,
  };
}

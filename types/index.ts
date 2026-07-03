export interface DecimalDegrees {
  latitude: number | null;
  longitude: number | null;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  visitlater: boolean;
  liked: boolean;
  dd: DecimalDegrees;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  createdAt: string;
}

export interface TripPlace {
  id: string;
  tripId: string;
  placeId: string;
  order: number;
  visited: boolean;
  visitDate: string | null;
  notes: string;
}

export type PhotoEntityType = 'place' | 'trip_place';

export interface Photo {
  id: string;
  entityType: PhotoEntityType;
  entityId: string;
  filePath: string;
  createdAt: string;
}

export type CreatePlaceInput = Omit<Place, 'id' | 'createdAt'>;
export type UpdatePlaceInput = Partial<CreatePlaceInput>;

export type CreateTripInput = Omit<Trip, 'id' | 'createdAt'>;
export type UpdateTripInput = Partial<CreateTripInput>;

export type CreateTripPlaceInput = Omit<TripPlace, 'id'>;
export type UpdateTripPlaceInput = Partial<Omit<TripPlace, 'id' | 'tripId' | 'placeId'>>;

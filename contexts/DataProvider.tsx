import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import * as photoRepo from '../db/photos';
import * as placeRepo from '../db/places';
import * as tripPlaceRepo from '../db/tripPlaces';
import * as tripRepo from '../db/trips';
import { deletePhoto, deletePhotoFile, savePhotoFromUri } from '../services/photos';
import type {
  CreatePlaceInput,
  CreateTripInput,
  CreateTripPlaceInput,
  Photo,
  Place,
  Trip,
  TripPlace,
  UpdatePlaceInput,
  UpdateTripInput,
  UpdateTripPlaceInput,
} from '../types';

interface DataContextValue {
  places: Place[];
  trips: Trip[];
  isLoading: boolean;
  refreshPlaces: () => Promise<void>;
  refreshTrips: () => Promise<void>;
  refreshAll: () => Promise<void>;
  addPlace: (input: CreatePlaceInput) => Promise<Place>;
  editPlace: (id: string, input: UpdatePlaceInput) => Promise<Place | null>;
  removePlace: (id: string) => Promise<boolean>;
  getPlace: (id: string) => Promise<Place | null>;
  getPlacePhotos: (placeId: string) => Promise<Photo[]>;
  addPlacePhoto: (placeId: string, sourceUri: string) => Promise<Photo>;
  removePlacePhoto: (photoId: string) => Promise<boolean>;
  addTrip: (input: CreateTripInput) => Promise<Trip>;
  editTrip: (id: string, input: UpdateTripInput) => Promise<Trip | null>;
  removeTrip: (id: string) => Promise<boolean>;
  getTrip: (id: string) => Promise<Trip | null>;
  getCurrentTrip: () => Promise<Trip | null>;
  getTripPlaces: (tripId: string) => Promise<TripPlace[]>;
  addTripPlace: (input: CreateTripPlaceInput) => Promise<TripPlace>;
  editTripPlace: (id: string, input: UpdateTripPlaceInput) => Promise<TripPlace | null>;
  removeTripPlace: (id: string) => Promise<boolean>;
  getNextTripPlace: (tripId: string) => Promise<TripPlace | null>;
  reorderTripPlaces: (tripId: string, orderedIds: string[]) => Promise<void>;
  getTripPlacePhotos: (tripPlaceId: string) => Promise<Photo[]>;
  addTripPlacePhoto: (tripPlaceId: string, sourceUri: string) => Promise<Photo>;
  removeTripPlacePhoto: (photoId: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [places, setPlaces] = useState<Place[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPlaces = useCallback(async () => {
    const data = await placeRepo.getAllPlaces(db);
    setPlaces(data);
  }, [db]);

  const refreshTrips = useCallback(async () => {
    const data = await tripRepo.getAllTrips(db);
    setTrips(data);
  }, [db]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([refreshPlaces(), refreshTrips()]);
    } finally {
      setIsLoading(false);
    }
  }, [refreshPlaces, refreshTrips]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const addPlace = useCallback(
    async (input: CreatePlaceInput) => {
      const place = await placeRepo.createPlace(db, input);
      await refreshPlaces();
      return place;
    },
    [db, refreshPlaces]
  );

  const editPlace = useCallback(
    async (id: string, input: UpdatePlaceInput) => {
      const place = await placeRepo.updatePlace(db, id, input);
      await refreshPlaces();
      return place;
    },
    [db, refreshPlaces]
  );

  const removePlace = useCallback(
    async (id: string) => {
      const photos = await photoRepo.deletePhotosByEntity(db, 'place', id);
      for (const photo of photos) {
        await deletePhotoFile(photo);
      }

      const removed = await placeRepo.deletePlace(db, id);
      if (removed) {
        await refreshPlaces();
      }
      return removed;
    },
    [db, refreshPlaces]
  );

  const getPlace = useCallback((id: string) => placeRepo.getPlaceById(db, id), [db]);

  const getPlacePhotos = useCallback(
    (placeId: string) => photoRepo.getPhotosByEntity(db, 'place', placeId),
    [db]
  );

  const addPlacePhoto = useCallback(
    async (placeId: string, sourceUri: string) => savePhotoFromUri(db, sourceUri, 'place', placeId),
    [db]
  );

  const removePlacePhoto = useCallback(
    async (photoId: string) => deletePhoto(db, photoId),
    [db]
  );

  const addTrip = useCallback(
    async (input: CreateTripInput) => {
      const trip = await tripRepo.createTrip(db, input);
      await refreshTrips();
      return trip;
    },
    [db, refreshTrips]
  );

  const editTrip = useCallback(
    async (id: string, input: UpdateTripInput) => {
      const trip = await tripRepo.updateTrip(db, id, input);
      await refreshTrips();
      return trip;
    },
    [db, refreshTrips]
  );

  const removeTrip = useCallback(
    async (id: string) => {
      const tripPlaces = await tripPlaceRepo.getTripPlacesByTripId(db, id);
      for (const tripPlace of tripPlaces) {
        const photos = await photoRepo.deletePhotosByEntity(db, 'trip_place', tripPlace.id);
        for (const photo of photos) {
          await deletePhotoFile(photo);
        }
      }

      const removed = await tripRepo.deleteTrip(db, id);
      if (removed) {
        await refreshTrips();
      }
      return removed;
    },
    [db, refreshTrips]
  );

  const getTrip = useCallback((id: string) => tripRepo.getTripById(db, id), [db]);
  const getCurrentTrip = useCallback(() => tripRepo.getCurrentTrip(db), [db]);
  const getTripPlaces = useCallback(
    (tripId: string) => tripPlaceRepo.getTripPlacesByTripId(db, tripId),
    [db]
  );

  const addTripPlace = useCallback(
    async (input: CreateTripPlaceInput) => tripPlaceRepo.createTripPlace(db, input),
    [db]
  );

  const editTripPlace = useCallback(
    async (id: string, input: UpdateTripPlaceInput) =>
      tripPlaceRepo.updateTripPlace(db, id, input),
    [db]
  );

  const removeTripPlace = useCallback(
    async (id: string) => {
      const photos = await photoRepo.deletePhotosByEntity(db, 'trip_place', id);
      for (const photo of photos) {
        await deletePhotoFile(photo);
      }

      return tripPlaceRepo.deleteTripPlace(db, id);
    },
    [db]
  );

  const getNextTripPlace = useCallback(
    (tripId: string) => tripPlaceRepo.getNextTripPlace(db, tripId),
    [db]
  );

  const reorderTripPlaces = useCallback(
    async (tripId: string, orderedIds: string[]) => {
      await tripPlaceRepo.reorderTripPlaces(db, tripId, orderedIds);
    },
    [db]
  );

  const getTripPlacePhotos = useCallback(
    (tripPlaceId: string) => photoRepo.getPhotosByEntity(db, 'trip_place', tripPlaceId),
    [db]
  );

  const addTripPlacePhoto = useCallback(
    async (tripPlaceId: string, sourceUri: string) =>
      savePhotoFromUri(db, sourceUri, 'trip_place', tripPlaceId),
    [db]
  );

  const removeTripPlacePhoto = useCallback(
    async (photoId: string) => deletePhoto(db, photoId),
    [db]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      places,
      trips,
      isLoading,
      refreshPlaces,
      refreshTrips,
      refreshAll,
      addPlace,
      editPlace,
      removePlace,
      getPlace,
      getPlacePhotos,
      addPlacePhoto,
      removePlacePhoto,
      addTrip,
      editTrip,
      removeTrip,
      getTrip,
      getCurrentTrip,
      getTripPlaces,
      addTripPlace,
      editTripPlace,
      removeTripPlace,
      getNextTripPlace,
      reorderTripPlaces,
      getTripPlacePhotos,
      addTripPlacePhoto,
      removeTripPlacePhoto,
    }),
    [
      places,
      trips,
      isLoading,
      refreshPlaces,
      refreshTrips,
      refreshAll,
      addPlace,
      editPlace,
      removePlace,
      getPlace,
      getPlacePhotos,
      addPlacePhoto,
      removePlacePhoto,
      addTrip,
      editTrip,
      removeTrip,
      getTrip,
      getCurrentTrip,
      getTripPlaces,
      addTripPlace,
      editTripPlace,
      removeTripPlace,
      getNextTripPlace,
      reorderTripPlaces,
      getTripPlacePhotos,
      addTripPlacePhoto,
      removeTripPlacePhoto,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData должен использоваться внутри DataProvider');
  }
  return context;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import * as placeRepo from '../db/places';
import * as tripPlaceRepo from '../db/tripPlaces';
import * as tripRepo from '../db/trips';
import type {
  CreatePlaceInput,
  CreateTripInput,
  CreateTripPlaceInput,
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
      const removed = await placeRepo.deletePlace(db, id);
      if (removed) {
        await refreshPlaces();
      }
      return removed;
    },
    [db, refreshPlaces]
  );

  const getPlace = useCallback((id: string) => placeRepo.getPlaceById(db, id), [db]);

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
    async (id: string) => tripPlaceRepo.deleteTripPlace(db, id),
    [db]
  );

  const getNextTripPlace = useCallback(
    (tripId: string) => tripPlaceRepo.getNextTripPlace(db, tripId),
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

import { useData } from '../contexts/DataProvider';
import type {
  CreateTripInput,
  CreateTripPlaceInput,
  Trip,
  TripPlace,
  UpdateTripInput,
  UpdateTripPlaceInput,
} from '../types';

export function useTrips() {
  const {
    trips,
    isLoading,
    refreshTrips,
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
  } = useData();

  return {
    trips,
    isLoading,
    refreshTrips,
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
  };
}

export type {
  CreateTripInput,
  CreateTripPlaceInput,
  Trip,
  TripPlace,
  UpdateTripInput,
  UpdateTripPlaceInput,
};

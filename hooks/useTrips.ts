import { useData } from '../contexts/DataProvider';
import type {
  CreateTripInput,
  CreateTripPlaceInput,
  Photo,
  Trip,
  TripPlace,
  UpdateTripInput,
  UpdateTripPlaceInput,
} from '../types';

export function useTrips() {
  const {
    trips,
    places,
    isLoading,
    refreshTrips,
    refreshPlaces,
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
    getPlace,
  } = useData();

  return {
    trips,
    places,
    isLoading,
    refreshTrips,
    refreshPlaces,
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
    getPlace,
  };
}

export type {
  CreateTripInput,
  CreateTripPlaceInput,
  Photo,
  Trip,
  TripPlace,
  UpdateTripInput,
  UpdateTripPlaceInput,
};

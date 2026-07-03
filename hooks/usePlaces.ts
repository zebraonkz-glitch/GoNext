import { useData } from '../contexts/DataProvider';
import type { CreatePlaceInput, Place, UpdatePlaceInput } from '../types';

export function usePlaces() {
  const {
    places,
    isLoading,
    refreshPlaces,
    addPlace,
    editPlace,
    removePlace,
    getPlace,
  } = useData();

  return {
    places,
    isLoading,
    refreshPlaces,
    addPlace,
    editPlace,
    removePlace,
    getPlace,
  };
}

export type { CreatePlaceInput, Place, UpdatePlaceInput };

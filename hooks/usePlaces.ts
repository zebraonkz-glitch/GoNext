import { useData } from '../contexts/DataProvider';
import type { CreatePlaceInput, Photo, Place, UpdatePlaceInput } from '../types';

export function usePlaces() {
  const {
    places,
    isLoading,
    refreshPlaces,
    addPlace,
    editPlace,
    removePlace,
    getPlace,
    getPlacePhotos,
    addPlacePhoto,
    removePlacePhoto,
  } = useData();

  return {
    places,
    isLoading,
    refreshPlaces,
    addPlace,
    editPlace,
    removePlace,
    getPlace,
    getPlacePhotos,
    addPlacePhoto,
    removePlacePhoto,
  };
}

export type { CreatePlaceInput, Photo, Place, UpdatePlaceInput };

import { useData } from '../contexts/DataProvider';
import type { Companion, CreateCompanionInput, UpdateCompanionInput } from '../types';

export function useCompanions() {
  const {
    companions,
    isLoading,
    refreshCompanions,
    addCompanion,
    editCompanion,
    removeCompanion,
    getCompanion,
    getPlaceCompanions,
    linkCompanionToPlace,
    unlinkCompanionFromPlace,
  } = useData();

  return {
    companions,
    isLoading,
    refreshCompanions,
    addCompanion,
    editCompanion,
    removeCompanion,
    getCompanion,
    getPlaceCompanions,
    linkCompanionToPlace,
    unlinkCompanionFromPlace,
  };
}

export type { Companion, CreateCompanionInput, UpdateCompanionInput };

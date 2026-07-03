import { type Href, router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView } from 'react-native';

import { PlaceForm } from '../../components/places/PlaceForm';
import { ScreenLayout } from '../../components/ScreenLayout';
import { usePlaces } from '../../hooks/usePlaces';
import { useTrips } from '../../hooks/useTrips';
import { savePhotoFromUri } from '../../services/photos';
import { useSQLiteContext } from 'expo-sqlite';
import type { CreatePlaceInput } from '../../types';

const defaultValues: CreatePlaceInput = {
  name: '',
  description: '',
  visitlater: false,
  liked: false,
  dd: { latitude: null, longitude: null },
};

export default function NewPlaceScreen() {
  const db = useSQLiteContext();
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const { addPlace } = usePlaces();
  const { addTripPlace, getTripPlaces } = useTrips();

  const handleSubmit = async (values: CreatePlaceInput, pendingPhotoUris?: string[]) => {
    const place = await addPlace(values);

    if (pendingPhotoUris) {
      for (const uri of pendingPhotoUris) {
        await savePhotoFromUri(db, uri, 'place', place.id);
      }
    }

    if (tripId) {
      const existingRoute = await getTripPlaces(tripId);
      await addTripPlace({
        tripId,
        placeId: place.id,
        order: existingRoute.length,
        visited: false,
        visitDate: null,
        notes: '',
      });
      Alert.alert('Готово', 'Место создано и добавлено в поездку', [
        { text: 'OK', onPress: () => router.replace(`/trips/${tripId}` as Href) },
      ]);
      return;
    }

    Alert.alert('Готово', 'Место сохранено', [
      { text: 'К списку', onPress: () => router.replace('/places' as Href) },
      {
        text: 'Открыть',
        onPress: () => router.replace(`/places/${place.id}` as Href),
      },
    ]);
  };

  return (
    <ScreenLayout title="Новое место">
      <ScrollView keyboardShouldPersistTaps="handled">
        <PlaceForm initialValues={defaultValues} onSubmit={handleSubmit} submitLabel="Создать" />
      </ScrollView>
    </ScreenLayout>
  );
}

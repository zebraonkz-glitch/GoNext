import { type Href, router } from 'expo-router';
import { Alert } from 'react-native';

import { PlaceForm } from '../../components/places/PlaceForm';
import { ScreenLayout } from '../../components/ScreenLayout';
import { usePlaces } from '../../hooks/usePlaces';
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
  const { addPlace } = usePlaces();

  const handleSubmit = async (values: CreatePlaceInput, pendingPhotoUris?: string[]) => {
    const place = await addPlace(values);

    if (pendingPhotoUris) {
      for (const uri of pendingPhotoUris) {
        await savePhotoFromUri(db, uri, 'place', place.id);
      }
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
      <PlaceForm initialValues={defaultValues} onSubmit={handleSubmit} submitLabel="Создать" />
    </ScreenLayout>
  );
}

import { type Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { PlaceForm } from '../../components/places/PlaceForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { usePlaces } from '../../hooks/usePlaces';
import type { CreatePlaceInput, Photo, Place } from '../../types';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlace, editPlace, removePlace, getPlacePhotos, addPlacePhoto, removePlacePhoto } =
    usePlaces();

  const [place, setPlace] = useState<Place | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const loadPlace = useCallback(async () => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    try {
      const loadedPlace = await getPlace(id);
      if (!loadedPlace) {
        Alert.alert('Ошибка', 'Место не найдено', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }
      const loadedPhotos = await getPlacePhotos(id);
      setPlace(loadedPlace);
      setPhotos(loadedPhotos);
    } finally {
      setIsLoading(false);
    }
  }, [getPlace, getPlacePhotos, id]);

  useFocusEffect(
    useCallback(() => {
      void loadPlace();
    }, [loadPlace])
  );

  const handleSubmit = async (values: CreatePlaceInput) => {
    if (!id) {
      return;
    }
    const updated = await editPlace(id, values);
    if (updated) {
      setPlace(updated);
      Alert.alert('Готово', 'Изменения сохранены');
    }
  };

  const handleAddPhoto = async (uri: string) => {
    if (!id) {
      return;
    }
    const photo = await addPlacePhoto(id, uri);
    setPhotos((current) => [...current, photo]);
  };

  const handleRemovePhoto = async (photoId: string) => {
    await removePlacePhoto(photoId);
    setPhotos((current) => current.filter((photo) => photo.id !== photoId));
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }
    await removePlace(id);
    setDeleteVisible(false);
    router.replace('/places' as Href);
  };

  if (isLoading || !place) {
    return (
      <ScreenLayout title="Место">
        <LoadingIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={place.name}>
      <PlaceForm
        initialValues={{
          name: place.name,
          description: place.description,
          visitlater: place.visitlater,
          liked: place.liked,
          dd: place.dd,
        }}
        placeId={id}
        photos={photos}
        onSubmit={handleSubmit}
        onDelete={() => setDeleteVisible(true)}
        onAddPhoto={handleAddPhoto}
        onRemovePhoto={handleRemovePhoto}
      />

      <ConfirmDialog
        visible={deleteVisible}
        title="Удалить место?"
        message={`Место «${place.name}» будет удалено вместе с фотографиями.`}
        onConfirm={() => void handleDelete()}
        onDismiss={() => setDeleteVisible(false)}
      />
    </ScreenLayout>
  );
}

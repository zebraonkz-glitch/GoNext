import { type Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LinkCompanionDialog } from '../../components/companions/LinkCompanionDialog';
import { PlaceForm } from '../../components/places/PlaceForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useCompanions } from '../../hooks/useCompanions';
import { usePlaces } from '../../hooks/usePlaces';
import type { Companion, CreateCompanionInput, CreatePlaceInput, Photo, Place } from '../../types';

export default function PlaceDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlace, editPlace, removePlace, getPlacePhotos, addPlacePhoto, removePlacePhoto } =
    usePlaces();
  const {
    companions: allCompanions,
    refreshCompanions,
    addCompanion,
    getPlaceCompanions,
    linkCompanionToPlace,
    unlinkCompanionFromPlace,
  } = useCompanions();

  const [place, setPlace] = useState<Place | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [placeCompanions, setPlaceCompanions] = useState<Companion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [linkDialogVisible, setLinkDialogVisible] = useState(false);

  const loadPlace = useCallback(async () => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    try {
      const loadedPlace = await getPlace(id);
      if (!loadedPlace) {
        Alert.alert(t('common.error'), t('places.notFound'), [
          { text: t('common.ok'), onPress: () => router.back() },
        ]);
        return;
      }
      const [loadedPhotos, loadedCompanions] = await Promise.all([
        getPlacePhotos(id),
        getPlaceCompanions(id),
      ]);
      setPlace(loadedPlace);
      setPhotos(loadedPhotos);
      setPlaceCompanions(loadedCompanions);
    } finally {
      setIsLoading(false);
    }
  }, [getPlace, getPlaceCompanions, getPlacePhotos, id]);

  useFocusEffect(
    useCallback(() => {
      void refreshCompanions();
      void loadPlace();
    }, [loadPlace, refreshCompanions])
  );

  const handleSubmit = async (values: CreatePlaceInput) => {
    if (!id) {
      return;
    }
    const updated = await editPlace(id, values);
    if (updated) {
      setPlace(updated);
      Alert.alert(t('common.done'), t('places.savedChanges'));
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

  const handleLinkCompanion = async (companionId: string) => {
    if (!id) {
      return;
    }
    await linkCompanionToPlace(id, companionId);
    const loadedCompanions = await getPlaceCompanions(id);
    setPlaceCompanions(loadedCompanions);
    setLinkDialogVisible(false);
  };

  const handleImportContact = async (input: CreateCompanionInput) => {
    const companion = await addCompanion(input);
    await handleLinkCompanion(companion.id);
  };

  const handleUnlinkCompanion = async (companionId: string) => {
    if (!id) {
      return;
    }
    await unlinkCompanionFromPlace(id, companionId);
    setPlaceCompanions((current) => current.filter((companion) => companion.id !== companionId));
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
      <ScreenLayout title={t('places.editTitle')}>
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
        companions={placeCompanions}
        onLinkCompanion={() => setLinkDialogVisible(true)}
        onUnlinkCompanion={(companionId) => void handleUnlinkCompanion(companionId)}
        onSubmit={handleSubmit}
        onDelete={() => setDeleteVisible(true)}
        onAddPhoto={handleAddPhoto}
        onRemovePhoto={handleRemovePhoto}
      />

      <LinkCompanionDialog
        visible={linkDialogVisible}
        companions={allCompanions}
        linkedCompanionIds={placeCompanions.map((companion) => companion.id)}
        onDismiss={() => setLinkDialogVisible(false)}
        onSelect={(companionId) => void handleLinkCompanion(companionId)}
        onImportContact={handleImportContact}
      />

      <ConfirmDialog
        visible={deleteVisible}
        title={t('places.deleteTitle')}
        message={t('places.deleteMessage', { name: place.name })}
        onConfirm={() => void handleDelete()}
        onDismiss={() => setDeleteVisible(false)}
      />
    </ScreenLayout>
  );
}

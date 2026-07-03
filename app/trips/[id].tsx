import { type Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';

import { AddPlaceToTripDialog } from '../../components/trips/AddPlaceToTripDialog';
import { TripForm } from '../../components/trips/TripForm';
import { TripPlaceCard } from '../../components/trips/TripPlaceCard';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useTrips } from '../../hooks/useTrips';
import type { CreateTripInput, Photo, Trip, TripPlaceWithPlace } from '../../types';
import { toISODateString } from '../../utils/dates';

type ViewMode = 'plan' | 'diary';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    places,
    getTrip,
    editTrip,
    removeTrip,
    getTripPlaces,
    addTripPlace,
    editTripPlace,
    removeTripPlace,
    reorderTripPlaces,
    getPlace,
    getTripPlacePhotos,
    addTripPlacePhoto,
    removeTripPlacePhoto,
    refreshPlaces,
  } = useTrips();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [route, setRoute] = useState<TripPlaceWithPlace[]>([]);
  const [photosMap, setPhotosMap] = useState<Record<string, Photo[]>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('plan');
  const [isLoading, setIsLoading] = useState(true);
  const [addPlaceVisible, setAddPlaceVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const loadTripData = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    try {
      const loadedTrip = await getTrip(id);
      if (!loadedTrip) {
        Alert.alert('Ошибка', 'Поездка не найдена', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }

      const tripPlaces = await getTripPlaces(id);
      const withPlaces: TripPlaceWithPlace[] = [];
      for (const tripPlace of tripPlaces) {
        const place = await getPlace(tripPlace.placeId);
        if (place) {
          withPlaces.push({ ...tripPlace, place });
        }
      }

      const photosEntries = await Promise.all(
        withPlaces.map(async (item) => {
          const photos = await getTripPlacePhotos(item.id);
          return [item.id, photos] as const;
        })
      );

      setTrip(loadedTrip);
      setRoute(withPlaces);
      setPhotosMap(Object.fromEntries(photosEntries));
    } finally {
      setIsLoading(false);
    }
  }, [getPlace, getTrip, getTripPlacePhotos, getTripPlaces, id]);

  useFocusEffect(
    useCallback(() => {
      void loadTripData();
      void refreshPlaces();
    }, [loadTripData, refreshPlaces])
  );

  const handleTripSubmit = async (values: CreateTripInput) => {
    if (!id) {
      return;
    }
    const updated = await editTrip(id, values);
    if (updated) {
      setTrip(updated);
      Alert.alert('Готово', 'Данные поездки сохранены');
    }
  };

  const handleDeleteTrip = async () => {
    if (!id) {
      return;
    }
    await removeTrip(id);
    setDeleteVisible(false);
    router.replace('/trips' as Href);
  };

  const handleAddPlace = async (placeId: string) => {
    if (!id) {
      return;
    }

    await addTripPlace({
      tripId: id,
      placeId,
      order: route.length,
      visited: false,
      visitDate: null,
      notes: '',
    });
    setAddPlaceVisible(false);
    await loadTripData();
  };

  const handleToggleVisited = async (tripPlaceId: string, visited: boolean) => {
    const updated = await editTripPlace(tripPlaceId, {
      visited,
      visitDate: visited ? toISODateString(new Date()) : null,
    });
    if (updated) {
      setRoute((current) =>
        current.map((item) => (item.id === tripPlaceId ? { ...item, ...updated } : item))
      );
    }
  };

  const handleNotesChange = async (tripPlaceId: string, notes: string) => {
    const updated = await editTripPlace(tripPlaceId, { notes });
    if (updated) {
      setRoute((current) =>
        current.map((item) => (item.id === tripPlaceId ? { ...item, notes: updated.notes } : item))
      );
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (!id) {
      return;
    }
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= route.length) {
      return;
    }

    const orderedIds = route.map((item) => item.id);
    [orderedIds[index], orderedIds[targetIndex]] = [orderedIds[targetIndex], orderedIds[index]];
    await reorderTripPlaces(id, orderedIds);
    await loadTripData();
  };

  const handleRemoveTripPlace = async (tripPlaceId: string) => {
    Alert.alert('Убрать из маршрута?', 'Место останется в списке мест.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Убрать',
        style: 'destructive',
        onPress: async () => {
          await removeTripPlace(tripPlaceId);
          await loadTripData();
        },
      },
    ]);
  };

  const handleAddPhoto = async (tripPlaceId: string, uri: string) => {
    const photo = await addTripPlacePhoto(tripPlaceId, uri);
    setPhotosMap((current) => ({
      ...current,
      [tripPlaceId]: [...(current[tripPlaceId] ?? []), photo],
    }));
  };

  const handleRemovePhoto = async (tripPlaceId: string, photoId: string) => {
    await removeTripPlacePhoto(photoId);
    setPhotosMap((current) => ({
      ...current,
      [tripPlaceId]: (current[tripPlaceId] ?? []).filter((photo) => photo.id !== photoId),
    }));
  };

  const displayedRoute =
    viewMode === 'diary' ? route.filter((item) => item.visited) : route;

  if (isLoading || !trip) {
    return (
      <ScreenLayout title="Поездка">
        <LoadingIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={trip.title}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Данные поездки
        </Text>
        <TripForm
          initialValues={{
            title: trip.title,
            description: trip.description,
            startDate: trip.startDate,
            endDate: trip.endDate,
            current: trip.current,
          }}
          onSubmit={handleTripSubmit}
          onDelete={() => setDeleteVisible(true)}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Маршрут
        </Text>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
          buttons={[
            { value: 'plan', label: 'План' },
            { value: 'diary', label: 'Дневник' },
          ]}
          style={styles.segmented}
        />
        <Button mode="outlined" icon="plus" onPress={() => setAddPlaceVisible(true)}>
          Добавить место
        </Button>

        {displayedRoute.length === 0 ? (
          <EmptyState
            title={viewMode === 'diary' ? 'Дневник пуст' : 'Маршрут пуст'}
            message={
              viewMode === 'diary'
                ? 'Отметьте места как посещённые, чтобы они появились в дневнике.'
                : 'Добавьте места в маршрут поездки.'
            }
          />
        ) : (
          displayedRoute.map((item) => {
            const routeIndex = route.findIndex((routeItem) => routeItem.id === item.id);
            return (
              <TripPlaceCard
                key={item.id}
                item={item}
                index={routeIndex}
                total={route.length}
                photos={photosMap[item.id] ?? []}
                diaryMode={viewMode === 'diary'}
                onToggleVisited={(visited) => void handleToggleVisited(item.id, visited)}
                onNotesChange={(notes) => void handleNotesChange(item.id, notes)}
                onNotesBlur={() => {}}
                onMoveUp={() => void handleMove(routeIndex, -1)}
                onMoveDown={() => void handleMove(routeIndex, 1)}
                onRemove={() => void handleRemoveTripPlace(item.id)}
                onAddPhoto={(uri) => handleAddPhoto(item.id, uri)}
                onRemovePhoto={(photoId) => handleRemovePhoto(item.id, photoId)}
              />
            );
          })
        )}
      </ScrollView>

      <AddPlaceToTripDialog
        visible={addPlaceVisible}
        places={places}
        excludedPlaceIds={route.map((item) => item.placeId)}
        tripId={id!}
        onDismiss={() => setAddPlaceVisible(false)}
        onSelect={(placeId) => void handleAddPlace(placeId)}
      />

      <ConfirmDialog
        visible={deleteVisible}
        title="Удалить поездку?"
        message={`Поездка «${trip.title}» и весь маршрут будут удалены.`}
        onConfirm={() => void handleDeleteTrip()}
        onDismiss={() => setDeleteVisible(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  segmented: {
    marginHorizontal: 16,
  },
});

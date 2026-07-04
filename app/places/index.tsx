import { type Href, router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FAB, Searchbar } from 'react-native-paper';

import { useAppTheme } from '../../contexts/ThemeProvider';
import { getPaperInputStyle, getPaperSearchbarStyle } from '../../constants/ui';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { PlaceCard } from '../../components/places/PlaceCard';
import { ScreenLayout } from '../../components/ScreenLayout';
import { getFirstPhotoForPlace } from '../../db/photos';
import { usePlaces } from '../../hooks/usePlaces';
import type { Photo, Place } from '../../types';

export default function PlacesListScreen() {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const { colors } = useAppTheme();
  const { places, isLoading, refreshPlaces, removePlace } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnails, setThumbnails] = useState<Record<string, Photo | null>>({});
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadThumbnails = useCallback(async () => {
    const entries = await Promise.all(
      places.map(async (place) => {
        const photo = await getFirstPhotoForPlace(db, place.id);
        return [place.id, photo] as const;
      })
    );
    setThumbnails(Object.fromEntries(entries));
  }, [db, places]);

  useFocusEffect(
    useCallback(() => {
      void refreshPlaces();
    }, [refreshPlaces])
  );

  useFocusEffect(
    useCallback(() => {
      if (places.length > 0) {
        void loadThumbnails();
      } else {
        setThumbnails({});
      }
    }, [loadThumbnails, places])
  );

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshPlaces();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    await removePlace(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <View style={styles.container}>
      <ScreenLayout title={t('places.title')}>
        {isLoading && places.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <>
            <Searchbar
              placeholder={t('places.searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchbar, getPaperSearchbarStyle(colors)]}
              inputStyle={getPaperInputStyle(colors)}
            />
            {filteredPlaces.length === 0 ? (
              <EmptyState
                title={places.length === 0 ? t('places.emptyTitle') : t('common.notFound')}
                message={
                  places.length === 0
                    ? t('places.emptyMessage')
                    : t('places.emptySearchMessage')
                }
              />
            ) : (
              <FlatList
                data={filteredPlaces}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void handleRefresh()} />}
                renderItem={({ item }) => (
                  <PlaceCard
                    place={item}
                    thumbnail={thumbnails[item.id]}
                    onPress={() => router.push(`/places/${item.id}` as Href)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                )}
                contentContainerStyle={styles.list}
              />
            )}
          </>
        )}
      </ScreenLayout>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/places/new' as Href)}
        label={t('common.add')}
      />

      <ConfirmDialog
        visible={deleteTarget !== null}
        title={t('places.deleteTitle')}
        message={
          deleteTarget ? t('places.deleteMessage', { name: deleteTarget.name }) : undefined
        }
        onConfirm={() => void handleDelete()}
        onDismiss={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 88,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

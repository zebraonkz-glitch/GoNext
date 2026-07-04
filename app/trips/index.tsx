import { type Href, router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FAB } from 'react-native-paper';

import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { TripCard } from '../../components/trips/TripCard';
import { ScreenLayout } from '../../components/ScreenLayout';
import { getTripPlaceStatsByTripIds } from '../../db/tripPlaces';
import { useTrips } from '../../hooks/useTrips';
import type { TripStats } from '../../types';

export default function TripsListScreen() {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const { trips, isLoading, refreshTrips } = useTrips();
  const [stats, setStats] = useState<Record<string, TripStats>>({});
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    const tripIds = trips.map((trip) => trip.id);
    const loaded = await getTripPlaceStatsByTripIds(db, tripIds);
    const withDefaults = Object.fromEntries(
      tripIds.map((id) => [id, loaded[id] ?? { total: 0, visited: 0 }])
    );
    setStats(withDefaults);
  }, [db, trips]);

  useFocusEffect(
    useCallback(() => {
      void refreshTrips();
    }, [refreshTrips])
  );

  useFocusEffect(
    useCallback(() => {
      if (trips.length > 0) {
        void loadStats();
      } else {
        setStats({});
      }
    }, [loadStats, trips])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshTrips();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenLayout title={t('trips.title')}>
        {isLoading && trips.length === 0 ? (
          <LoadingIndicator />
        ) : trips.length === 0 ? (
          <EmptyState
            title={t('trips.emptyTitle')}
            message={t('trips.emptyMessage')}
          />
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void handleRefresh()} />}
            renderItem={({ item }) => (
              <TripCard
                trip={item}
                stats={stats[item.id] ?? { total: 0, visited: 0 }}
                onPress={() => router.push(`/trips/${item.id}` as Href)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </ScreenLayout>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/trips/new' as Href)}
        label={t('common.create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 88,
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

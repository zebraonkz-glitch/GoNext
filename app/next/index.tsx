import { type Href, router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, Text } from 'react-native-paper';

import { MapActionButtons } from '../../components/places/MapActionButtons';
import { PlaceMap } from '../../components/places/PlaceMap';
import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { paperCardStyle } from '../../constants/ui';
import { useTrips } from '../../hooks/useTrips';
import { getNextPlace, type NextPlaceResult } from '../../services/nextPlace';
import { formatCoordinate, hasValidCoordinates } from '../../utils/coordinates';
import { getDbErrorMessage } from '../../utils/errors';
import { toISODateString } from '../../utils/dates';

export default function NextPlaceScreen() {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const { editTripPlace } = useTrips();
  const { showError, showMessage } = useSnackbar();
  const [result, setResult] = useState<NextPlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);

  const loadNextPlace = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getNextPlace(db);
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void loadNextPlace();
    }, [loadNextPlace])
  );

  const handleMarkVisited = async () => {
    if (result?.status !== 'has_next' || !result.tripPlace) {
      return;
    }

    setIsMarking(true);
    try {
      await editTripPlace(result.tripPlace.id, {
        visited: true,
        visitDate: toISODateString(new Date()),
      });
      showMessage(t('nextPlace.markedVisited'));
      await loadNextPlace();
    } catch (error) {
      showError(getDbErrorMessage(error));
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <ScreenLayout title={t('nextPlace.title')}>
      {isLoading ? (
        <LoadingIndicator message={t('nextPlace.loading')} />
      ) : result?.status === 'no_current_trip' ? (
        <EmptyState
          title={t('nextPlace.noCurrentTripTitle')}
          message={t('nextPlace.noCurrentTripMessage')}
        />
      ) : result?.status === 'route_completed' ? (
        <View style={styles.stateContainer}>
          <EmptyState
            title={t('nextPlace.routeCompletedTitle')}
            message={
              result.trip
                ? t('nextPlace.routeCompletedWithTrip', { title: result.trip.title })
                : t('nextPlace.routeCompletedDefault')
            }
          />
          {result.trip ? (
            <Button
              mode="outlined"
              onPress={() => router.push(`/trips/${result.trip!.id}` as Href)}
              style={styles.stateButton}
            >
              {t('nextPlace.openTrip')}
            </Button>
          ) : null}
        </View>
      ) : result?.status === 'has_next' && result.place && result.trip ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="labelLarge" style={styles.tripLabel}>
            {t('nextPlace.tripLabel', { title: result.trip.title })}
          </Text>

          <Card style={[styles.card, paperCardStyle]}>
            <Card.Content style={styles.cardContent}>
              <Text variant="headlineSmall">{result.place.name}</Text>
              {result.place.description ? (
                <Text variant="bodyMedium" style={styles.description}>
                  {result.place.description}
                </Text>
              ) : null}
              <Text variant="bodySmall" style={styles.coords}>
                {t('nextPlace.coordinatesLabel')}{' '}
                {hasValidCoordinates(result.place.dd.latitude, result.place.dd.longitude)
                  ? `${formatCoordinate(result.place.dd.latitude)}, ${formatCoordinate(result.place.dd.longitude)}`
                  : t('common.coordinatesNotSet')}
              </Text>

              <PlaceMap dd={result.place.dd} title={result.place.name} height={220} />

              <View style={styles.actions}>
                <MapActionButtons dd={result.place.dd} label={result.place.name} />
                <Button
                  mode="contained"
                  icon="check-circle"
                  loading={isMarking}
                  onPress={() => void handleMarkVisited()}
                >
                  {t('nextPlace.markVisited')}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      ) : (
        <EmptyState title={t('common.noData')} message={t('nextPlace.loadFailed')} />
      )}

      {result?.status === 'no_current_trip' ? (
        <View style={styles.footer}>
          <Button mode="contained" onPress={() => router.push('/trips' as Href)}>
            {t('nextPlace.selectTrip')}
          </Button>
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  stateContainer: {
    flex: 1,
  },
  stateButton: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  footer: {
    padding: 16,
  },
  tripLabel: {
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    gap: 12,
  },
  description: {
    opacity: 0.85,
  },
  coords: {
    opacity: 0.7,
  },
  actions: {
    gap: 8,
    marginTop: 4,
  },
});

import { type Href, router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
      showMessage('Место отмечено как посещённое');
      await loadNextPlace();
    } catch (error) {
      showError(getDbErrorMessage(error));
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <ScreenLayout title="Следующее место">
      {isLoading ? (
        <LoadingIndicator message="Поиск следующего места..." />
      ) : result?.status === 'no_current_trip' ? (
        <EmptyState
          title="Нет текущей поездки"
          message="Отметьте поездку как текущую, чтобы увидеть следующее место маршрута."
        />
      ) : result?.status === 'route_completed' ? (
        <View style={styles.stateContainer}>
          <EmptyState
            title="Маршрут завершён"
            message={
              result.trip
                ? `Все места поездки «${result.trip.title}» посещены.`
                : 'Все места текущей поездки посещены.'
            }
          />
          {result.trip ? (
            <Button
              mode="outlined"
              onPress={() => router.push(`/trips/${result.trip!.id}` as Href)}
              style={styles.stateButton}
            >
              Открыть поездку
            </Button>
          ) : null}
        </View>
      ) : result?.status === 'has_next' && result.place && result.trip ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="labelLarge" style={styles.tripLabel}>
            Поездка: {result.trip.title}
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
                Координаты:{' '}
                {hasValidCoordinates(result.place.dd.latitude, result.place.dd.longitude)
                  ? `${formatCoordinate(result.place.dd.latitude)}, ${formatCoordinate(result.place.dd.longitude)}`
                  : 'не указаны'}
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
                  Отметить посещённым
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      ) : (
        <EmptyState title="Нет данных" message="Не удалось загрузить следующее место." />
      )}

      {result?.status === 'no_current_trip' ? (
        <View style={styles.footer}>
          <Button mode="contained" onPress={() => router.push('/trips' as Href)}>
            Выбрать поездку
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

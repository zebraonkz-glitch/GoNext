import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useTrips } from '../../hooks/useTrips';

export default function TripsListScreen() {
  const { trips, isLoading } = useTrips();

  return (
    <ScreenLayout title="Поездки">
      {isLoading ? (
        <LoadingIndicator />
      ) : trips.length === 0 ? (
        <EmptyState
          title="Список поездок пуст"
          message="Здесь появятся ваши маршруты и дневники путешествий."
        />
      ) : (
        <EmptyState
          title={`Поездок: ${trips.length}`}
          message="Список будет реализован на этапе 4."
        />
      )}
    </ScreenLayout>
  );
}

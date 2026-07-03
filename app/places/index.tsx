import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { usePlaces } from '../../hooks/usePlaces';

export default function PlacesListScreen() {
  const { places, isLoading } = usePlaces();

  return (
    <ScreenLayout title="Места">
      {isLoading ? (
        <LoadingIndicator />
      ) : places.length === 0 ? (
        <EmptyState
          title="Список мест пуст"
          message="Здесь появятся места, которые вы хотите посетить."
        />
      ) : (
        <EmptyState title={`Мест: ${places.length}`} message="Список будет реализован на этапе 3." />
      )}
    </ScreenLayout>
  );
}

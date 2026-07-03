import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '../../components/EmptyState';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenLayout title="Поездка">
      <EmptyState
        title="Детали поездки"
        message={`Маршрут поездки «${id}» будет реализован на этапе 4.`}
      />
    </ScreenLayout>
  );
}

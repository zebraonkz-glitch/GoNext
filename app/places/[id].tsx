import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '../../components/EmptyState';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenLayout title="Место">
      <EmptyState
        title="Карточка места"
        message={`Экран для места «${id}» будет реализован на этапе 3.`}
      />
    </ScreenLayout>
  );
}

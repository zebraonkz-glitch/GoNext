import { EmptyState } from '../../components/EmptyState';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function NextPlaceScreen() {
  return (
    <ScreenLayout title="Следующее место">
      <EmptyState
        title="Следующее место"
        message="Быстрый доступ к следующей точке маршрута будет реализован на этапе 5."
      />
    </ScreenLayout>
  );
}

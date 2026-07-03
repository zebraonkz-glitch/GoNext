import { EmptyState } from '../../components/EmptyState';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function NewTripScreen() {
  return (
    <ScreenLayout title="Новая поездка">
      <EmptyState
        title="Создание поездки"
        message="Форма создания поездки будет реализована на этапе 4."
      />
    </ScreenLayout>
  );
}

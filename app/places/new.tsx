import { EmptyState } from '../../components/EmptyState';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function NewPlaceScreen() {
  return (
    <ScreenLayout title="Новое место">
      <EmptyState
        title="Создание места"
        message="Форма добавления места будет реализована на этапе 3."
      />
    </ScreenLayout>
  );
}

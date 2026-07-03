import Constants from 'expo-constants';

import { EmptyState } from '../../components/EmptyState';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenLayout title="Настройки">
      <EmptyState
        title="Настройки"
        message={`Версия приложения: ${version}. Полный экран настроек будет реализован на этапе 6.`}
      />
    </ScreenLayout>
  );
}

import { type Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { CompanionForm } from '../../components/companions/CompanionForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useCompanions } from '../../hooks/useCompanions';
import type { Companion, CreateCompanionInput } from '../../types';

export default function CompanionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCompanion, editCompanion, removeCompanion } = useCompanions();

  const [companion, setCompanion] = useState<Companion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const loadCompanion = useCallback(async () => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    try {
      const loaded = await getCompanion(id);
      if (!loaded) {
        Alert.alert('Ошибка', 'Попутчик не найден', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }
      setCompanion(loaded);
    } finally {
      setIsLoading(false);
    }
  }, [getCompanion, id]);

  useFocusEffect(
    useCallback(() => {
      void loadCompanion();
    }, [loadCompanion])
  );

  const handleSubmit = async (values: CreateCompanionInput) => {
    if (!id) {
      return;
    }
    const updated = await editCompanion(id, values);
    if (updated) {
      setCompanion(updated);
      Alert.alert('Готово', 'Изменения сохранены');
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }
    await removeCompanion(id);
    setDeleteVisible(false);
    router.replace('/companions' as Href);
  };

  if (isLoading || !companion) {
    return (
      <ScreenLayout title="Попутчик">
        <LoadingIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={companion.name}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <CompanionForm
          initialValues={{
            name: companion.name,
            phone: companion.phone,
            email: companion.email,
            notes: companion.notes,
          }}
          onSubmit={handleSubmit}
          onDelete={() => setDeleteVisible(true)}
        />
      </ScrollView>

      <ConfirmDialog
        visible={deleteVisible}
        title="Удалить попутчика?"
        message={`Контакт «${companion.name}» будет удалён из всех мест.`}
        onConfirm={() => void handleDelete()}
        onDismiss={() => setDeleteVisible(false)}
      />
    </ScreenLayout>
  );
}

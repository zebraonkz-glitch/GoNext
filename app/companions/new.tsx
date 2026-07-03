import { type Href, router } from 'expo-router';
import { Alert, ScrollView } from 'react-native';

import { CompanionForm } from '../../components/companions/CompanionForm';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useCompanions } from '../../hooks/useCompanions';
import type { CreateCompanionInput } from '../../types';

const defaultValues: CreateCompanionInput = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export default function NewCompanionScreen() {
  const { addCompanion } = useCompanions();

  const handleSubmit = async (values: CreateCompanionInput) => {
    const companion = await addCompanion(values);
    Alert.alert('Готово', 'Попутчик сохранён', [
      { text: 'К списку', onPress: () => router.replace('/companions' as Href) },
      {
        text: 'Открыть',
        onPress: () => router.replace(`/companions/${companion.id}` as Href),
      },
    ]);
  };

  return (
    <ScreenLayout title="Новый попутчик">
      <ScrollView keyboardShouldPersistTaps="handled">
        <CompanionForm initialValues={defaultValues} onSubmit={handleSubmit} submitLabel="Создать" />
      </ScrollView>
    </ScreenLayout>
  );
}

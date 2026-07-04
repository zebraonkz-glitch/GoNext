import { type Href, router } from 'expo-router';
import { Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { addCompanion } = useCompanions();

  const handleSubmit = async (values: CreateCompanionInput) => {
    const companion = await addCompanion(values);
    Alert.alert(t('common.done'), t('companions.saved'), [
      { text: t('common.toList'), onPress: () => router.replace('/companions' as Href) },
      {
        text: t('common.open'),
        onPress: () => router.replace(`/companions/${companion.id}` as Href),
      },
    ]);
  };

  return (
    <ScreenLayout title={t('companions.newTitle')}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <CompanionForm initialValues={defaultValues} onSubmit={handleSubmit} submitLabel={t('common.create')} />
      </ScrollView>
    </ScreenLayout>
  );
}

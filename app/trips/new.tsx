import { type Href, router } from 'expo-router';
import { Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TripForm } from '../../components/trips/TripForm';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useTrips } from '../../hooks/useTrips';
import type { CreateTripInput } from '../../types';

const defaultValues: CreateTripInput = {
  title: '',
  description: '',
  startDate: null,
  endDate: null,
  current: false,
};

export default function NewTripScreen() {
  const { t } = useTranslation();
  const { addTrip } = useTrips();

  const handleSubmit = async (values: CreateTripInput) => {
    const trip = await addTrip(values);
    Alert.alert(t('common.done'), t('trips.created'), [
      { text: t('common.toList'), onPress: () => router.replace('/trips' as Href) },
      {
        text: t('common.open'),
        onPress: () => router.replace(`/trips/${trip.id}` as Href),
      },
    ]);
  };

  return (
    <ScreenLayout title={t('trips.newTitle')}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TripForm initialValues={defaultValues} onSubmit={handleSubmit} submitLabel={t('common.create')} />
      </ScrollView>
    </ScreenLayout>
  );
}

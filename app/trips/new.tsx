import { type Href, router } from 'expo-router';
import { Alert, ScrollView } from 'react-native';

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
  const { addTrip } = useTrips();

  const handleSubmit = async (values: CreateTripInput) => {
    const trip = await addTrip(values);
    Alert.alert('Готово', 'Поездка создана', [
      { text: 'К списку', onPress: () => router.replace('/trips' as Href) },
      {
        text: 'Открыть',
        onPress: () => router.replace(`/trips/${trip.id}` as Href),
      },
    ]);
  };

  return (
    <ScreenLayout title="Новая поездка">
      <ScrollView keyboardShouldPersistTaps="handled">
        <TripForm initialValues={defaultValues} onSubmit={handleSubmit} submitLabel="Создать" />
      </ScrollView>
    </ScreenLayout>
  );
}

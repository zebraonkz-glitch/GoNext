import { type Href, router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import type { Place } from '../../types';

interface AddPlaceToTripDialogProps {
  visible: boolean;
  places: Place[];
  excludedPlaceIds: string[];
  tripId: string;
  onDismiss: () => void;
  onSelect: (placeId: string) => void;
}

export function AddPlaceToTripDialog({
  visible,
  places,
  excludedPlaceIds,
  tripId,
  onDismiss,
  onSelect,
}: AddPlaceToTripDialogProps) {
  const availablePlaces = places.filter((place) => !excludedPlaceIds.includes(place.id));

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Добавить место</Dialog.Title>
        <Dialog.Content>
          {availablePlaces.length === 0 ? (
            <Text variant="bodyMedium">Нет доступных мест. Создайте новое.</Text>
          ) : (
            <FlatList
              data={availablePlaces}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <Button mode="text" onPress={() => onSelect(item.id)} style={styles.placeButton}>
                  {item.name}
                </Button>
              )}
            />
          )}
          <View style={styles.footer}>
            <Button
              mode="outlined"
              icon="plus"
              onPress={() => {
                onDismiss();
                router.push(`/places/new?tripId=${tripId}` as Href);
              }}
            >
              Создать новое место
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Закрыть</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  list: {
    maxHeight: 280,
  },
  placeButton: {
    alignItems: 'flex-start',
  },
  footer: {
    marginTop: 12,
  },
});

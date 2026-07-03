import { type Href, router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import type { Companion } from '../../types';

interface LinkCompanionDialogProps {
  visible: boolean;
  companions: Companion[];
  linkedCompanionIds: string[];
  onDismiss: () => void;
  onSelect: (companionId: string) => void;
}

export function LinkCompanionDialog({
  visible,
  companions,
  linkedCompanionIds,
  onDismiss,
  onSelect,
}: LinkCompanionDialogProps) {
  const availableCompanions = companions.filter(
    (companion) => !linkedCompanionIds.includes(companion.id)
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Привязать попутчика</Dialog.Title>
        <Dialog.Content>
          {availableCompanions.length === 0 ? (
            <Text variant="bodyMedium">Нет доступных попутчиков. Создайте нового.</Text>
          ) : (
            <FlatList
              data={availableCompanions}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <Button mode="text" onPress={() => onSelect(item.id)} style={styles.itemButton}>
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
                router.push('/companions/new' as Href);
              }}
            >
              Создать попутчика
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
  itemButton: {
    alignItems: 'flex-start',
  },
  footer: {
    marginTop: 12,
  },
});

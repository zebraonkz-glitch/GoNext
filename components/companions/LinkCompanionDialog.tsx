import { type Href, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { PickContactDialog } from './PickContactDialog';
import {
  mapDeviceContactToCompanionInput,
  pickDeviceContactNative,
  type DeviceContactPreview,
} from '../../services/deviceContacts';
import type { Companion, CreateCompanionInput } from '../../types';

interface LinkCompanionDialogProps {
  visible: boolean;
  companions: Companion[];
  linkedCompanionIds: string[];
  onDismiss: () => void;
  onSelect: (companionId: string) => void;
  onImportContact: (input: CreateCompanionInput) => Promise<void>;
}

export function LinkCompanionDialog({
  visible,
  companions,
  linkedCompanionIds,
  onDismiss,
  onSelect,
  onImportContact,
}: LinkCompanionDialogProps) {
  const [contactPickerVisible, setContactPickerVisible] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const availableCompanions = companions.filter(
    (companion) => !linkedCompanionIds.includes(companion.id)
  );

  const handleImportContact = async (contact: DeviceContactPreview) => {
    setIsImporting(true);
    try {
      await onImportContact(mapDeviceContactToCompanionInput(contact));
      setContactPickerVisible(false);
    } finally {
      setIsImporting(false);
    }
  };

  const handlePickFromContacts = async () => {
    if (Platform.OS === 'ios') {
      setIsImporting(true);
      try {
        const contact = await pickDeviceContactNative();
        if (contact) {
          await handleImportContact(contact);
        }
      } finally {
        setIsImporting(false);
      }
      return;
    }
    setContactPickerVisible(true);
  };

  return (
    <>
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
              icon="contacts"
              loading={isImporting}
              onPress={() => void handlePickFromContacts()}
            >
              Выбрать из контактов
            </Button>
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

    <PickContactDialog
      visible={contactPickerVisible}
      onDismiss={() => setContactPickerVisible(false)}
      onSelect={(contact) => void handleImportContact(contact)}
    />
    </>
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
    gap: 8,
  },
});

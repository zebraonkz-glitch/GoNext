import { type Href, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <Dialog.Title>{t('linkCompanion.title')}</Dialog.Title>
          <Dialog.Content style={styles.content}>
            {availableCompanions.length === 0 ? (
              <Text variant="bodyMedium" style={styles.empty}>
                {t('linkCompanion.noCompanions')}
              </Text>
            ) : (
              <FlatList
                data={availableCompanions}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => onSelect(item.id)}
                    style={({ pressed }) => [styles.itemRow, pressed && styles.itemPressed]}
                  >
                    <Text variant="bodyLarge" numberOfLines={2} style={styles.itemName}>
                      {item.name}
                    </Text>
                    {item.phone ? (
                      <Text variant="bodySmall" style={styles.detail} numberOfLines={1} ellipsizeMode="middle">
                        {item.phone}
                      </Text>
                    ) : null}
                    {item.email ? (
                      <Text variant="bodySmall" style={styles.detail} numberOfLines={1} ellipsizeMode="middle">
                        {item.email}
                      </Text>
                    ) : null}
                  </Pressable>
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
                {t('linkCompanion.pickFromContacts')}
              </Button>
              <Button
                mode="outlined"
                icon="plus"
                onPress={() => {
                  onDismiss();
                  router.push('/companions/new' as Href);
                }}
              >
                {t('linkCompanion.createCompanion')}
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>{t('common.close')}</Button>
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
    alignSelf: 'center',
    width: '92%',
    maxWidth: 480,
  },
  content: {
    paddingHorizontal: 0,
  },
  list: {
    maxHeight: 280,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemRow: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 2,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemName: {
    flexShrink: 1,
  },
  detail: {
    opacity: 0.7,
    flexShrink: 1,
  },
  empty: {
    paddingHorizontal: 24,
  },
  footer: {
    marginTop: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
});

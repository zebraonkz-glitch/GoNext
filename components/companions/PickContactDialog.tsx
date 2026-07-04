import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Button, Dialog, Portal, Searchbar, Text } from 'react-native-paper';

import { useAppTheme } from '../../contexts/ThemeProvider';
import { loadDeviceContacts, type DeviceContactPreview } from '../../services/deviceContacts';

interface PickContactDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (contact: DeviceContactPreview) => void;
}

export function PickContactDialog({ visible, onDismiss, onSelect }: PickContactDialogProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [contacts, setContacts] = useState<DeviceContactPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    setLoadFailed(false);
    try {
      const loaded = await loadDeviceContacts();
      setContacts(loaded);
      setLoadFailed(loaded.length === 0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      return;
    }
    void loadContacts();
  }, [loadContacts, visible]);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return contacts;
    }
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  const emptyMessage = searchQuery
    ? t('common.notFound')
    : loadFailed
      ? t('pickContact.noAccess')
      : t('pickContact.empty');

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>{t('pickContact.title')}</Dialog.Title>
        <Dialog.Content style={styles.content}>
          <Searchbar
            placeholder={t('pickContact.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchbar, { backgroundColor: colors.surface, borderRadius: colors.radius }]}
          />

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator />
            </View>
          ) : filteredContacts.length === 0 ? (
            <Text variant="bodyMedium" style={styles.empty}>
              {emptyMessage}
            </Text>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [styles.itemRow, pressed && styles.itemPressed]}
                >
                  <Text variant="bodyLarge" style={styles.itemName} numberOfLines={2}>
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
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>{t('common.close')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '85%',
    alignSelf: 'center',
    width: '92%',
    maxWidth: 480,
  },
  content: {
    paddingHorizontal: 0,
  },
  searchbar: {
    marginBottom: 8,
    marginHorizontal: 24,
  },
  list: {
    maxHeight: 320,
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
    opacity: 0.7,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  centered: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

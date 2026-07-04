import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Searchbar, Text } from 'react-native-paper';

import { useAppTheme } from '../../contexts/ThemeProvider';
import { getPaperInputStyle, getPaperSearchbarStyle } from '../../constants/ui';
import { loadDeviceContacts, type DeviceContactPreview } from '../../services/deviceContacts';

interface PickContactDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (contact: DeviceContactPreview) => void;
}

export function PickContactDialog({ visible, onDismiss, onSelect }: PickContactDialogProps) {
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
    ? 'Ничего не найдено'
    : loadFailed
      ? 'Контакты не найдены или доступ не предоставлен.'
      : 'Список контактов пуст';

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Выбор из контактов</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            placeholder="Поиск по имени, телефону, email"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchbar, getPaperSearchbarStyle(colors)]}
            inputStyle={getPaperInputStyle(colors)}
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
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Button
                  mode="text"
                  onPress={() => onSelect(item)}
                  style={styles.itemButton}
                  contentStyle={styles.itemContent}
                >
                  <View style={styles.itemText}>
                    <Text variant="bodyLarge">{item.name}</Text>
                    {item.phone ? (
                      <Text variant="bodySmall" style={styles.detail}>
                        {item.phone}
                      </Text>
                    ) : null}
                    {item.email ? (
                      <Text variant="bodySmall" style={styles.detail}>
                        {item.email}
                      </Text>
                    ) : null}
                  </View>
                </Button>
              )}
            />
          )}
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
    maxHeight: '85%',
  },
  searchbar: {
    marginBottom: 8,
  },
  list: {
    maxHeight: 320,
  },
  itemButton: {
    alignItems: 'flex-start',
  },
  itemContent: {
    justifyContent: 'flex-start',
  },
  itemText: {
    alignItems: 'flex-start',
    gap: 2,
  },
  detail: {
    opacity: 0.7,
  },
  empty: {
    opacity: 0.7,
    paddingVertical: 16,
  },
  centered: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

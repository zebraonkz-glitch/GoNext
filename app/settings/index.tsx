import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { Button, Divider, List, Text } from 'react-native-paper';

import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FormPanel } from '../../components/PaperTextInput';
import { ScreenLayout } from '../../components/ScreenLayout';
import { UI } from '../../constants/ui';
import { useData } from '../../contexts/DataProvider';
import {
  type AppPermission,
  getPermissionHint,
  getPermissionLabel,
  getPermissionState,
  getPermissionStatusLabel,
  openSystemSettings,
  requestPermission,
  type PermissionState,
} from '../../services/permissions';

const PERMISSIONS: AppPermission[] = ['location', 'camera', 'mediaLibrary', 'contacts'];

export default function SettingsScreen() {
  const { clearAllData } = useData();
  const [permissionStates, setPermissionStates] = useState<Record<AppPermission, PermissionState>>({
    location: 'undetermined',
    camera: 'undetermined',
    mediaLibrary: 'undetermined',
    contacts: 'undetermined',
  });
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const appName = Constants.expoConfig?.name ?? 'GoNext';

  const loadPermissions = useCallback(async () => {
    const entries = await Promise.all(
      PERMISSIONS.map(async (permission) => {
        const state = await getPermissionState(permission);
        return [permission, state] as const;
      })
    );
    setPermissionStates(Object.fromEntries(entries) as Record<AppPermission, PermissionState>);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPermissions();
    }, [loadPermissions])
  );

  const handleRequestPermission = async (permission: AppPermission) => {
    const current = permissionStates[permission];
    if (current === 'denied') {
      await openSystemSettings();
      return;
    }

    const state = await requestPermission(permission);
    setPermissionStates((prev) => ({ ...prev, [permission]: state }));

    if (state === 'denied') {
      Alert.alert(
        getPermissionLabel(permission),
        getPermissionHint(permission, state),
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Настройки', onPress: () => void openSystemSettings() },
        ]
      );
    }
  };

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      setClearDialogVisible(false);
      Alert.alert('Готово', 'Все данные приложения удалены.');
    } catch {
      Alert.alert('Ошибка', 'Не удалось очистить данные.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <ScreenLayout title="Настройки">
      <ScrollView contentContainerStyle={styles.content}>
        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">О приложении</Text>
          <List.Item
            title={appName}
            description={`Версия ${version}`}
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
        </FormPanel>

        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">Разрешения</Text>
          <Text variant="bodySmall" style={styles.sectionHint}>
            Управление доступом к геолокации, камере и галерее.
          </Text>
          {PERMISSIONS.map((permission, index) => {
            const state = permissionStates[permission];
            return (
              <View key={permission}>
                {index > 0 ? <Divider /> : null}
                <List.Item
                  title={getPermissionLabel(permission)}
                  description={getPermissionStatusLabel(state)}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={
                        permission === 'location'
                          ? 'crosshairs-gps'
                          : permission === 'camera'
                            ? 'camera'
                            : 'image'
                      }
                    />
                  )}
                  right={() => (
                    <Button
                      mode="text"
                      compact
                      onPress={() => void handleRequestPermission(permission)}
                    >
                      {state === 'denied' ? 'Настройки' : 'Запросить'}
                    </Button>
                  )}
                />
                <Text variant="bodySmall" style={styles.permissionHint}>
                  {getPermissionHint(permission, state)}
                </Text>
              </View>
            );
          })}
        </FormPanel>

        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">Данные</Text>
          <Text variant="bodySmall" style={styles.sectionHint}>
            Удаляются все места, поездки, маршруты и фотографии без возможности восстановления.
          </Text>
          <Button
            mode="outlined"
            textColor="#b00020"
            icon="delete-forever"
            onPress={() => setClearDialogVisible(true)}
          >
            Очистить все данные
          </Button>
        </FormPanel>
      </ScrollView>

      <ConfirmDialog
        visible={clearDialogVisible}
        title="Очистить все данные?"
        message="Будут удалены все места, поездки, маршруты и фотографии. Это действие нельзя отменить."
        confirmLabel="Очистить"
        onConfirm={() => void handleClearAllData()}
        onDismiss={() => setClearDialogVisible(false)}
      />

      {isClearing ? (
        <View style={styles.overlay}>
          <Text variant="bodyMedium" style={styles.overlayText}>
            Очистка данных...
          </Text>
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  panel: {
    marginBottom: 0,
  },
  sectionHint: {
    opacity: 0.7,
  },
  permissionHint: {
    opacity: 0.6,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    backgroundColor: UI.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

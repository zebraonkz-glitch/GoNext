import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { Button, Divider, List, SegmentedButtons, Text } from 'react-native-paper';

import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FormPanel } from '../../components/PaperTextInput';
import { PrimaryColorPicker } from '../../components/settings/PrimaryColorPicker';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useAppTheme } from '../../contexts/ThemeProvider';
import { type ThemeMode, type ThemePrimaryId } from '../../constants/ui';
import { useData } from '../../contexts/DataProvider';
import { changeLanguage, type AppLanguage } from '../../i18n';
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
  const { t, i18n } = useTranslation();
  const { clearAllData } = useData();
  const { mode, primaryId, setMode, setPrimaryId, colors } = useAppTheme();
  const [permissionStates, setPermissionStates] = useState<Record<AppPermission, PermissionState>>({
    location: 'undetermined',
    camera: 'undetermined',
    mediaLibrary: 'undetermined',
    contacts: 'undetermined',
  });
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const appName = Constants.expoConfig?.name ?? t('common.appName');

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
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.settings'), onPress: () => void openSystemSettings() },
        ]
      );
    }
  };

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      setClearDialogVisible(false);
      Alert.alert(t('common.done'), t('settings.clearSuccess'));
    } catch {
      Alert.alert(t('common.error'), t('settings.clearFailed'));
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <ScreenLayout title={t('settings.title')}>
      <ScrollView contentContainerStyle={styles.content}>
        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">{t('settings.about')}</Text>
          <List.Item
            title={appName}
            description={t('settings.version', { version })}
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
        </FormPanel>

        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">{t('settings.appearance')}</Text>
          <Text variant="bodySmall" style={styles.sectionHint}>
            {t('settings.darkThemeHint')}
          </Text>
          <SegmentedButtons
            value={mode}
            onValueChange={(value) => {
              if (value === 'light' || value === 'dark') {
                void setMode(value as ThemeMode);
              }
            }}
            buttons={[
              { value: 'light', label: t('settings.themeLight'), icon: 'white-balance-sunny' },
              { value: 'dark', label: t('settings.themeDark'), icon: 'moon-waning-crescent' },
            ]}
          />
          <Text variant="labelLarge" style={styles.colorLabel}>
            {t('settings.primaryColor')}
          </Text>
          <PrimaryColorPicker
            value={primaryId}
            onChange={(id: ThemePrimaryId) => void setPrimaryId(id)}
          />
        </FormPanel>

        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">{t('settings.language')}</Text>
          <SegmentedButtons
            value={i18n.language}
            onValueChange={(value) => {
              if (value === 'ru' || value === 'en') {
                void changeLanguage(value as AppLanguage);
              }
            }}
            buttons={[
              { value: 'ru', label: t('settings.languageRu') },
              { value: 'en', label: t('settings.languageEn') },
            ]}
          />
        </FormPanel>

        <FormPanel style={styles.panel}>
          <Text variant="titleMedium">{t('settings.permissions')}</Text>
          <Text variant="bodySmall" style={styles.sectionHint}>
            {t('settings.permissionsHint')}
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
                            : permission === 'contacts'
                              ? 'contacts'
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
                      {state === 'denied' ? t('common.settings') : t('common.request')}
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
          <Text variant="titleMedium">{t('settings.data')}</Text>
          <Text variant="bodySmall" style={styles.sectionHint}>
            {t('settings.dataHint')}
          </Text>
          <Button
            mode="outlined"
            textColor={colors.error}
            icon="delete-forever"
            onPress={() => setClearDialogVisible(true)}
          >
            {t('settings.clearAllData')}
          </Button>
        </FormPanel>
      </ScrollView>

      <ConfirmDialog
        visible={clearDialogVisible}
        title={t('settings.clearAllTitle')}
        message={t('settings.clearAllMessage')}
        confirmLabel={t('common.clear')}
        onConfirm={() => void handleClearAllData()}
        onDismiss={() => setClearDialogVisible(false)}
      />

      {isClearing ? (
        <View style={styles.overlay}>
          <Text
            variant="bodyMedium"
            style={[styles.overlayText, { backgroundColor: colors.surface }]}
          >
            {t('settings.clearing')}
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
  colorLabel: {
    marginTop: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

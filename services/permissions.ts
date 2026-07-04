import { getPermissionsAsync, requestPermissionsAsync } from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Linking } from 'react-native';

import i18n from '../i18n';

export type AppPermission = 'location' | 'camera' | 'mediaLibrary' | 'contacts';

export type PermissionState = 'granted' | 'denied' | 'undetermined';

export function getPermissionLabel(permission: AppPermission): string {
  return i18n.t(`permissions.${permission}`);
}

function mapStatus(status: string): PermissionState {
  if (status === 'granted') {
    return 'granted';
  }
  if (status === 'undetermined') {
    return 'undetermined';
  }
  return 'denied';
}

export async function getPermissionState(permission: AppPermission): Promise<PermissionState> {
  switch (permission) {
    case 'location': {
      const result = await Location.getForegroundPermissionsAsync();
      return mapStatus(result.status);
    }
    case 'camera': {
      const result = await ImagePicker.getCameraPermissionsAsync();
      return mapStatus(result.status);
    }
    case 'mediaLibrary': {
      const result = await ImagePicker.getMediaLibraryPermissionsAsync();
      return mapStatus(result.status);
    }
    case 'contacts': {
      const result = await getPermissionsAsync();
      return mapStatus(result.status);
    }
  }
}

export async function requestPermission(permission: AppPermission): Promise<PermissionState> {
  switch (permission) {
    case 'location': {
      const result = await Location.requestForegroundPermissionsAsync();
      return mapStatus(result.status);
    }
    case 'camera': {
      const result = await ImagePicker.requestCameraPermissionsAsync();
      return mapStatus(result.status);
    }
    case 'mediaLibrary': {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return mapStatus(result.status);
    }
    case 'contacts': {
      const result = await requestPermissionsAsync();
      return mapStatus(result.status);
    }
  }
}

export function getPermissionStatusLabel(state: PermissionState): string {
  return i18n.t(`permissions.${state}`);
}

export function getPermissionHint(permission: AppPermission, state: PermissionState): string {
  if (state === 'granted') {
    return i18n.t('permissions.grantedHint', { label: getPermissionLabel(permission) });
  }

  if (state === 'undetermined') {
    return i18n.t(`permissions.${permission}Undetermined`);
  }

  return i18n.t(`permissions.${permission}Denied`);
}

export async function openSystemSettings(): Promise<void> {
  await Linking.openSettings();
}

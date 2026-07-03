import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Linking } from 'react-native';

export type AppPermission = 'location' | 'camera' | 'mediaLibrary';

export type PermissionState = 'granted' | 'denied' | 'undetermined';

const PERMISSION_LABELS: Record<AppPermission, string> = {
  location: 'Геолокация',
  camera: 'Камера',
  mediaLibrary: 'Галерея',
};

export function getPermissionLabel(permission: AppPermission): string {
  return PERMISSION_LABELS[permission];
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
  }
}

export function getPermissionStatusLabel(state: PermissionState): string {
  switch (state) {
    case 'granted':
      return 'Разрешено';
    case 'denied':
      return 'Запрещено';
    case 'undetermined':
      return 'Не запрошено';
  }
}

export function getPermissionHint(permission: AppPermission, state: PermissionState): string {
  if (state === 'granted') {
    return `${getPermissionLabel(permission)} доступна.`;
  }

  if (state === 'undetermined') {
    switch (permission) {
      case 'location':
        return 'Нужна для определения координат места.';
      case 'camera':
        return 'Нужна для съёмки фотографий.';
      case 'mediaLibrary':
        return 'Нужна для выбора фото из галереи.';
    }
  }

  switch (permission) {
    case 'location':
      return 'Доступ запрещён. Разрешите геолокацию в настройках устройства.';
    case 'camera':
      return 'Доступ запрещён. Разрешите камеру в настройках устройства.';
    case 'mediaLibrary':
      return 'Доступ запрещён. Разрешите галерею в настройках устройства.';
  }
}

export async function openSystemSettings(): Promise<void> {
  await Linking.openSettings();
}

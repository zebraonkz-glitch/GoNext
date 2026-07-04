import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import {
  DEFAULT_BACKGROUND_ID,
  isBackgroundId,
  type BackgroundId,
} from '../constants/backgrounds';

const BACKGROUND_ID_KEY = '@gonext/background_id';
const BACKGROUND_CUSTOM_KEY = '@gonext/background_custom';

const CUSTOM_BG_DIRECTORY = 'backgrounds';

async function ensureCustomBackgroundDirectory(): Promise<string> {
  const base = FileSystem.documentDirectory;
  if (!base) {
    throw new Error('documents_unavailable');
  }

  const directory = `${base}${CUSTOM_BG_DIRECTORY}/`;
  const info = await FileSystem.getInfoAsync(directory);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }
  return directory;
}

async function deleteStoredCustomFile(uri: string | null): Promise<void> {
  if (!uri || uri.startsWith('data:')) {
    return;
  }
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

async function uriToDataUrl(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
          return;
        }
        reject(new Error('invalid_data_url'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('read_failed'));
      reader.readAsDataURL(blob);
    });
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
}

export async function loadBackgroundSettings(): Promise<{
  backgroundId: BackgroundId;
  customUri: string | null;
}> {
  const [storedId, storedCustom] = await Promise.all([
    AsyncStorage.getItem(BACKGROUND_ID_KEY),
    AsyncStorage.getItem(BACKGROUND_CUSTOM_KEY),
  ]);

  const backgroundId = isBackgroundId(storedId) ? storedId : DEFAULT_BACKGROUND_ID;

  if (backgroundId !== 'custom' || !storedCustom) {
    return { backgroundId: DEFAULT_BACKGROUND_ID, customUri: null };
  }

  if (storedCustom.startsWith('data:')) {
    return { backgroundId: 'custom', customUri: storedCustom };
  }

  const info = await FileSystem.getInfoAsync(storedCustom);
  if (!info.exists) {
    await AsyncStorage.multiRemove([BACKGROUND_ID_KEY, BACKGROUND_CUSTOM_KEY]);
    return { backgroundId: DEFAULT_BACKGROUND_ID, customUri: null };
  }

  return { backgroundId: 'custom', customUri: storedCustom };
}

export async function saveBuiltInBackground(backgroundId: BackgroundId): Promise<void> {
  if (backgroundId !== 'custom') {
    const previousCustom = await AsyncStorage.getItem(BACKGROUND_CUSTOM_KEY);
    await deleteStoredCustomFile(previousCustom);
  }

  await AsyncStorage.setItem(BACKGROUND_ID_KEY, backgroundId);
  if (backgroundId !== 'custom') {
    await AsyncStorage.removeItem(BACKGROUND_CUSTOM_KEY);
  }
}

export async function saveCustomBackground(sourceUri: string): Promise<string> {
  const previousCustom = await AsyncStorage.getItem(BACKGROUND_CUSTOM_KEY);

  if (Platform.OS === 'web') {
    const dataUrl = await uriToDataUrl(sourceUri);
    await AsyncStorage.multiSet([
      [BACKGROUND_ID_KEY, 'custom'],
      [BACKGROUND_CUSTOM_KEY, dataUrl],
    ]);
    return dataUrl;
  }

  const directory = await ensureCustomBackgroundDirectory();
  const destination = `${directory}custom-${Date.now()}.jpg`;

  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  await deleteStoredCustomFile(previousCustom);

  await AsyncStorage.multiSet([
    [BACKGROUND_ID_KEY, 'custom'],
    [BACKGROUND_CUSTOM_KEY, destination],
  ]);
  return destination;
}

export async function clearCustomBackground(): Promise<void> {
  const storedCustom = await AsyncStorage.getItem(BACKGROUND_CUSTOM_KEY);
  await deleteStoredCustomFile(storedCustom);
  await AsyncStorage.multiRemove([BACKGROUND_CUSTOM_KEY]);
}

import * as Location from 'expo-location';

import type { DecimalDegrees } from '../types';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentCoordinates(): Promise<DecimalDegrees> {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw new Error(
      'Нет разрешения на геолокацию. Разрешите доступ в настройках или введите координаты вручную.'
    );
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    throw new Error(
      'Не удалось определить местоположение. Проверьте GPS или введите координаты вручную.'
    );
  }
}

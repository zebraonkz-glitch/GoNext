import { Linking, Platform } from 'react-native';

export async function openPlaceOnMap(
  latitude: number,
  longitude: number,
  label?: string
): Promise<void> {
  const encodedLabel = encodeURIComponent(label ?? 'Место');
  const url =
    Platform.OS === 'ios'
      ? `maps:0,0?q=${encodedLabel}@${latitude},${longitude}`
      : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`;

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
    return;
  }

  await Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  );
}

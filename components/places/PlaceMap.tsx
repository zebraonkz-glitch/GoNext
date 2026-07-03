import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';

import { UI } from '../../constants/ui';
import type { DecimalDegrees } from '../../types';
import { hasValidCoordinates } from '../../utils/coordinates';
import { buildMapHtml } from '../../utils/mapPreview';

interface PlaceMapProps {
  dd: DecimalDegrees;
  title?: string;
  height?: number;
}

export function PlaceMap({ dd, title, height = 200 }: PlaceMapProps) {
  const [hasError, setHasError] = useState(false);

  const latitude = dd.latitude!;
  const longitude = dd.longitude!;
  const mapHtml = useMemo(
    () => buildMapHtml(latitude, longitude, title),
    [latitude, longitude, title]
  );

  if (!hasValidCoordinates(dd.latitude, dd.longitude)) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Text variant="bodyMedium" style={styles.placeholderText}>
          Координаты не указаны
        </Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Text variant="bodyMedium" style={styles.placeholderText}>
          Не удалось загрузить карту
        </Text>
        <Text variant="bodySmall" style={styles.coords}>
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </Text>
        {title ? (
          <Text variant="bodySmall" style={styles.coords}>
            {title}
          </Text>
        ) : null}
        <Text variant="bodySmall" style={styles.hint}>
          Проверьте подключение к интернету
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        onError={() => setHasError(true)}
        onHttpError={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: UI.surfaceMuted,
  },
  webview: {
    flex: 1,
    backgroundColor: UI.surfaceMuted,
  },
  placeholder: {
    borderRadius: 8,
    backgroundColor: UI.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  placeholderText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  coords: {
    opacity: 0.6,
    textAlign: 'center',
  },
  hint: {
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
});

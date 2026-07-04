import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { CoordinatesFallback } from './MapActionButtons';
import { useAppTheme } from '../../contexts/ThemeProvider';
import type { DecimalDegrees } from '../../types';
import { hasValidCoordinates } from '../../utils/coordinates';
import { buildMapHtml } from '../../utils/mapPreview';

interface PlaceMapProps {
  dd: DecimalDegrees;
  title?: string;
  height?: number;
}

export function PlaceMap({ dd, title, height = 200 }: PlaceMapProps) {
  const { colors } = useAppTheme();
  const [hasError, setHasError] = useState(false);
  const mapSurfaceStyle = {
    borderRadius: colors.radius,
    backgroundColor: colors.surfaceMuted,
  };

  const latitude = dd.latitude!;
  const longitude = dd.longitude!;
  const mapHtml = useMemo(
    () => buildMapHtml(latitude, longitude, title),
    [latitude, longitude, title]
  );

  if (!hasValidCoordinates(dd.latitude, dd.longitude)) {
    return <CoordinatesFallback dd={dd} title={title} height={height} />;
  }

  if (hasError) {
    return <CoordinatesFallback dd={dd} title={title} height={height} offline />;
  }

  return (
    <View style={[styles.container, mapSurfaceStyle, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={[styles.webview, { backgroundColor: colors.surfaceMuted }]}
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
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});

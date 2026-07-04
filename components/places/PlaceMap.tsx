import { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { CoordinatesFallback } from './MapActionButtons';
import { useAppTheme } from '../../contexts/ThemeProvider';
import type { DecimalDegrees } from '../../types';
import { hasValidCoordinates } from '../../utils/coordinates';
import { getMarkerOffsetInTile, getStaticMapTileUrl } from '../../utils/staticMap';

interface PlaceMapProps {
  dd: DecimalDegrees;
  title?: string;
  height?: number;
}

const MAP_ZOOM = 15;

export function PlaceMap({ dd, title, height = 200 }: PlaceMapProps) {
  const { colors } = useAppTheme();
  const [hasError, setHasError] = useState(false);
  const mapSurfaceStyle = {
    borderRadius: colors.radius,
    backgroundColor: colors.surfaceMuted,
  };

  const latitude = dd.latitude!;
  const longitude = dd.longitude!;

  const tileUrl = useMemo(
    () => getStaticMapTileUrl(latitude, longitude, MAP_ZOOM),
    [latitude, longitude]
  );

  const markerPosition = useMemo(() => {
    return getMarkerOffsetInTile(latitude, longitude, MAP_ZOOM, 400, height);
  }, [latitude, longitude, height]);

  if (!hasValidCoordinates(dd.latitude, dd.longitude)) {
    return <CoordinatesFallback dd={dd} title={title} height={height} />;
  }

  if (hasError) {
    return <CoordinatesFallback dd={dd} title={title} height={height} offline />;
  }

  return (
    <View style={[styles.container, mapSurfaceStyle, { height }]}>
      <Image
        source={{ uri: tileUrl }}
        style={styles.mapImage}
        resizeMode="cover"
        onError={() => setHasError(true)}
      />
      <View
        style={[
          styles.marker,
          {
            left: markerPosition.left - 12,
            top: markerPosition.top - 24,
          },
        ]}
        pointerEvents="none"
      >
        <Icon source="map-marker" size={24} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
  },
});

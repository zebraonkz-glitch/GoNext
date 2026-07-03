import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text } from 'react-native-paper';

import { UI } from '../../constants/ui';
import type { DecimalDegrees } from '../../types';
import { hasValidCoordinates } from '../../utils/coordinates';

interface PlaceMapProps {
  dd: DecimalDegrees;
  title?: string;
  height?: number;
}

export function PlaceMap({ dd, title, height = 200 }: PlaceMapProps) {
  if (!hasValidCoordinates(dd.latitude, dd.longitude)) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Text variant="bodyMedium" style={styles.placeholderText}>
          Координаты не указаны
        </Text>
      </View>
    );
  }

  const latitude = dd.latitude!;
  const longitude = dd.longitude!;

  return (
    <MapView
      style={[styles.map, { height }]}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
    >
      <Marker coordinate={{ latitude, longitude }} title={title} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholder: {
    borderRadius: 8,
    backgroundColor: UI.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.6,
  },
});

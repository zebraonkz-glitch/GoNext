import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Text } from 'react-native-paper';

import { useAppTheme } from '../../contexts/ThemeProvider';
import type { DecimalDegrees } from '../../types';
import { formatCoordinate, hasValidCoordinates } from '../../utils/coordinates';
import { openPlaceInNavigator, openPlaceOnMap } from '../../services/maps';

interface MapActionButtonsProps {
  dd: DecimalDegrees;
  label?: string;
  style?: object;
}

export function MapActionButtons({ dd, label, style }: MapActionButtonsProps) {
  const { t } = useTranslation();
  const { latitude, longitude } = dd;

  if (!hasValidCoordinates(latitude, longitude)) {
    return null;
  }

  const handleOpenMap = () => {
    void openPlaceOnMap(latitude!, longitude!, label);
  };

  const handleOpenNavigator = () => {
    void openPlaceInNavigator(latitude!, longitude!);
  };

  return (
    <View style={[styles.container, style]}>
      <Button mode="outlined" icon="map-marker" onPress={handleOpenMap} style={styles.button}>
        {t('maps.openOnMap')}
      </Button>
      <Button mode="outlined" icon="navigation" onPress={handleOpenNavigator} style={styles.button}>
        {t('maps.openInNavigator')}
      </Button>
    </View>
  );
}

interface CoordinatesFallbackProps {
  dd: DecimalDegrees;
  title?: string;
  height?: number;
  offline?: boolean;
}

export function CoordinatesFallback({
  dd,
  title,
  height = 200,
  offline = false,
}: CoordinatesFallbackProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const placeholderStyle = {
    borderRadius: colors.radius,
    backgroundColor: colors.surfaceMuted,
  };
  const { latitude, longitude } = dd;

  if (!hasValidCoordinates(latitude, longitude)) {
    return (
      <View style={[styles.placeholder, placeholderStyle, { height }]}>
        <Text variant="bodyMedium" style={styles.placeholderText}>
          {t('maps.coordinatesMissing')}
        </Text>
        <Text variant="bodySmall" style={styles.hint}>
          {t('maps.coordinatesHint')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.placeholder, placeholderStyle, { height }]}>
      {offline ? (
        <Text variant="bodyMedium" style={styles.placeholderText}>
          {t('maps.offlineUnavailable')}
        </Text>
      ) : (
        <Text variant="bodyMedium" style={styles.placeholderText}>
          {t('maps.loadFailed')}
        </Text>
      )}
      <Text variant="titleMedium" style={styles.coordsMain}>
        {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
      </Text>
      {title ? (
        <Text variant="bodySmall" style={styles.coords}>
          {title}
        </Text>
      ) : null}
      {offline ? (
        <Text variant="bodySmall" style={styles.hint}>
          {t('maps.offlineHint')}
        </Text>
      ) : (
        <Text variant="bodySmall" style={styles.hint}>
          {t('maps.checkConnection')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  button: {
    marginTop: 4,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  placeholderText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  coordsMain: {
    textAlign: 'center',
    marginTop: 4,
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

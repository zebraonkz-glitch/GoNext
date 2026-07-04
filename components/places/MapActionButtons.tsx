import { StyleSheet, View } from 'react-native';
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
        Открыть на карте
      </Button>
      <Button mode="outlined" icon="navigation" onPress={handleOpenNavigator} style={styles.button}>
        Открыть в навигаторе
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
          Координаты не указаны
        </Text>
        <Text variant="bodySmall" style={styles.hint}>
          Введите широту и долготу вручную или нажмите «Моё местоположение»
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.placeholder, placeholderStyle, { height }]}>
      {offline ? (
        <Text variant="bodyMedium" style={styles.placeholderText}>
          Карта недоступна без интернета
        </Text>
      ) : (
        <Text variant="bodyMedium" style={styles.placeholderText}>
          Не удалось загрузить карту
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
          Координаты доступны офлайн. Откройте место во внешнем приложении карт.
        </Text>
      ) : (
        <Text variant="bodySmall" style={styles.hint}>
          Проверьте подключение к интернету
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

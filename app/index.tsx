import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { useAppTheme } from '../contexts/ThemeProvider';
import { useData } from '../contexts/DataProvider';

export default function HomeScreen() {
  const { isLoading } = useData();
  const { colors } = useAppTheme();

  if (isLoading) {
    return <LoadingIndicator message="Инициализация..." />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={[styles.header, { backgroundColor: colors.headerOverlay }]}>
        <Appbar.Content title="GoNext" />
      </Appbar.Header>

      <View style={styles.menu}>
        <Button
          mode="contained"
          icon="map-marker"
          onPress={() => router.push('/places' as Href)}
          style={styles.button}
        >
          Места
        </Button>
        <Button
          mode="contained"
          icon="bag-suitcase"
          onPress={() => router.push('/trips' as Href)}
          style={styles.button}
        >
          Поездки
        </Button>
        <Button
          mode="contained"
          icon="account-group"
          onPress={() => router.push('/companions' as Href)}
          style={styles.button}
        >
          Попутчики
        </Button>
        <Button
          mode="contained"
          icon="sign-direction"
          onPress={() => router.push('/next' as Href)}
          style={styles.button}
        >
          Следующее место
        </Button>
        <Button
          mode="contained"
          icon="cog"
          onPress={() => router.push('/settings' as Href)}
          style={styles.button}
        >
          Настройки
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {},
  menu: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  button: {
    borderRadius: 8,
  },
});

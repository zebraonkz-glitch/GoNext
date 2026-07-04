import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Appbar, Button } from 'react-native-paper';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { useAppTheme } from '../contexts/ThemeProvider';
import { useData } from '../contexts/DataProvider';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isLoading } = useData();
  const { colors } = useAppTheme();

  if (isLoading) {
    return <LoadingIndicator message={t('home.initializing')} />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={[styles.header, { backgroundColor: colors.headerOverlay }]}>
        <Appbar.Content title={t('common.appName')} />
      </Appbar.Header>

      <View style={styles.menu}>
        <Button
          mode="contained"
          icon="map-marker"
          onPress={() => router.push('/places' as Href)}
          style={styles.button}
        >
          {t('home.places')}
        </Button>
        <Button
          mode="contained"
          icon="bag-suitcase"
          onPress={() => router.push('/trips' as Href)}
          style={styles.button}
        >
          {t('home.trips')}
        </Button>
        <Button
          mode="contained"
          icon="account-group"
          onPress={() => router.push('/companions' as Href)}
          style={styles.button}
        >
          {t('home.companions')}
        </Button>
        <Button
          mode="contained"
          icon="sign-direction"
          onPress={() => router.push('/next' as Href)}
          style={styles.button}
        >
          {t('home.nextPlace')}
        </Button>
        <Button
          mode="contained"
          icon="cog"
          onPress={() => router.push('/settings' as Href)}
          style={styles.button}
        >
          {t('home.settings')}
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

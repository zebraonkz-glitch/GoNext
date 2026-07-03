import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { useData } from '../contexts/DataProvider';

export default function HomeScreen() {
  const { isLoading } = useData();

  if (isLoading) {
    return <LoadingIndicator message="Инициализация..." />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="GoNext" />
      </Appbar.Header>

      <View style={styles.menu}>
        <Button mode="contained" onPress={() => router.push('/places' as Href)} style={styles.button}>
          Места
        </Button>
        <Button mode="contained" onPress={() => router.push('/trips' as Href)} style={styles.button}>
          Поездки
        </Button>
        <Button mode="contained" onPress={() => router.push('/next' as Href)} style={styles.button}>
          Следующее место
        </Button>
        <Button mode="contained" onPress={() => router.push('/settings' as Href)} style={styles.button}>
          Настройки
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

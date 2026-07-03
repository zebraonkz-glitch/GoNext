import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Snackbar, Text } from 'react-native-paper';

export default function HomeScreen() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="GoNext" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.text}>
          Привет, React Native Paper!
        </Text>
        <Button mode="contained" onPress={() => setSnackbarVisible(true)}>
          Нажми меня
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Кнопка нажата
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 24,
  },
  text: {
    textAlign: 'center',
  },
});

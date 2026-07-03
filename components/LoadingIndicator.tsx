import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = 'Загрузка...' }: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating size="large" />
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    opacity: 0.7,
  },
});

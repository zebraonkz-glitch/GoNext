import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      {message ? (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

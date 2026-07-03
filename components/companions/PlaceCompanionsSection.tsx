import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { CompanionCard } from './CompanionCard';
import type { Companion } from '../../types';

interface PlaceCompanionsSectionProps {
  companions: Companion[];
  onLink: () => void;
  onUnlink: (companionId: string) => void;
}

export function PlaceCompanionsSection({
  companions,
  onLink,
  onUnlink,
}: PlaceCompanionsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Попутчики</Text>
        <Button
          mode="text"
          compact
          onPress={() => router.push('/companions' as Href)}
        >
          Все контакты
        </Button>
      </View>

      {companions.length === 0 ? (
        <Text variant="bodyMedium" style={styles.empty}>
          К этому месту пока не привязаны попутчики
        </Text>
      ) : (
        companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            companion={companion}
            onPress={() => router.push(`/companions/${companion.id}` as Href)}
            onUnlink={() => onUnlink(companion.id)}
          />
        ))
      )}

      <Button mode="outlined" icon="account-plus" onPress={onLink} style={styles.linkButton}>
        Привязать попутчика
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    opacity: 0.6,
    marginVertical: 4,
  },
  linkButton: {
    marginTop: 4,
  },
});

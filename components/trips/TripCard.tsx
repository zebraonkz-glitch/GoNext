import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Chip, ProgressBar, Text } from 'react-native-paper';

import { useAppTheme } from '../../contexts/ThemeProvider';
import { paperCardStyle } from '../../constants/ui';

import type { Trip, TripStats } from '../../types';
import { formatDateRange } from '../../utils/dates';

interface TripCardProps {
  trip: Trip;
  stats: TripStats;
  onPress: () => void;
}

export function TripCard({ trip, stats, onPress }: TripCardProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const progress = stats.total > 0 ? stats.visited / stats.total : 0;

  return (
    <Card
      style={[
        styles.card,
        paperCardStyle,
        trip.current && { borderWidth: 2, borderColor: colors.primary },
      ]}
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            {trip.title}
          </Text>
          {trip.current ? (
            <Chip compact icon="star" style={styles.currentChip}>
              {t('trips.currentChip')}
            </Chip>
          ) : null}
        </View>
        <Text variant="bodySmall" style={styles.dates}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </Text>
        {trip.description ? (
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {trip.description}
          </Text>
        ) : null}
        <Text variant="bodySmall" style={styles.stats}>
          {t('trips.stats', { total: stats.total, visited: stats.visited })}
        </Text>
        <ProgressBar progress={progress} style={styles.progress} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  currentChip: {
    height: 28,
  },
  dates: {
    opacity: 0.7,
  },
  description: {
    opacity: 0.85,
  },
  stats: {
    opacity: 0.7,
  },
  progress: {
    height: 6,
    borderRadius: 3,
  },
});

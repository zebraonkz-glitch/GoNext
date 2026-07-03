import { Image, StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text } from 'react-native-paper';

import { paperCardStyle } from '../../constants/ui';

import type { Photo, Place } from '../../types';

interface PlaceCardProps {
  place: Place;
  thumbnail?: Photo | null;
  onPress: () => void;
  onDelete: () => void;
}

export function PlaceCard({ place, thumbnail, onPress, onDelete }: PlaceCardProps) {
  return (
    <Card style={[styles.card, paperCardStyle]} onPress={onPress}>
      <View style={styles.row}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail.filePath }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Text variant="labelLarge">?</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text variant="titleMedium" numberOfLines={1}>
            {place.name}
          </Text>
          {place.description ? (
            <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
              {place.description}
            </Text>
          ) : null}
          <View style={styles.chips}>
            {place.visitlater ? (
              <Chip compact icon="clock-outline" style={styles.chip}>
                Позже
              </Chip>
            ) : null}
            {place.liked ? (
              <Chip compact icon="heart" style={styles.chip}>
                Нравится
              </Chip>
            ) : null}
          </View>
        </View>
        <IconButton icon="delete-outline" onPress={onDelete} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  description: {
    opacity: 0.7,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    height: 28,
  },
});

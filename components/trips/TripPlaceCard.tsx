import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Switch, Text } from 'react-native-paper';

import { PaperTextInput } from '../PaperTextInput';
import { PhotoGallery } from '../places/PhotoGallery';
import { useAppTheme } from '../../contexts/ThemeProvider';
import { paperCardStyle } from '../../constants/ui';
import type { Photo, TripPlaceWithPlace } from '../../types';
import { formatDate } from '../../utils/dates';

interface TripPlaceCardProps {
  item: TripPlaceWithPlace;
  index: number;
  total: number;
  photos: Photo[];
  diaryMode?: boolean;
  onToggleVisited: (visited: boolean) => void;
  onNotesChange: (notes: string) => void;
  onNotesBlur: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onAddPhoto: (uri: string) => Promise<void>;
  onRemovePhoto: (photoId: string) => Promise<void>;
}

export function TripPlaceCard({
  item,
  index,
  total,
  photos,
  diaryMode = false,
  onToggleVisited,
  onNotesChange,
  onNotesBlur,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAddPhoto,
  onRemovePhoto,
}: TripPlaceCardProps) {
  const { colors } = useAppTheme();
  const [notes, setNotes] = useState(item.notes);

  useEffect(() => {
    setNotes(item.notes);
  }, [item.notes]);

  return (
    <Card
      style={[
        styles.card,
        paperCardStyle,
        item.visited && { backgroundColor: colors.visitedSurface },
      ]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="labelLarge" style={styles.order}>
            {index + 1}.
          </Text>
          <View style={styles.titleBlock}>
            <Text variant="titleMedium">{item.place.name}</Text>
            {item.visited && item.visitDate ? (
              <Text variant="bodySmall" style={styles.visitDate}>
                Посещено: {formatDate(item.visitDate)}
              </Text>
            ) : null}
          </View>
          {!diaryMode ? (
            <View style={styles.actions}>
              <IconButton icon="chevron-up" disabled={index === 0} onPress={onMoveUp} size={20} />
              <IconButton
                icon="chevron-down"
                disabled={index === total - 1}
                onPress={onMoveDown}
                size={20}
              />
              <IconButton icon="delete-outline" onPress={onRemove} size={20} />
            </View>
          ) : null}
        </View>

        {!diaryMode ? (
          <View style={styles.switchRow}>
            <Text variant="bodyMedium">Посещено</Text>
            <Switch value={item.visited} onValueChange={onToggleVisited} />
          </View>
        ) : null}

        <PaperTextInput
          label="Заметки"
          value={notes}
          onChangeText={setNotes}
          onBlur={() => {
            if (notes !== item.notes) {
              onNotesChange(notes);
            }
            onNotesBlur();
          }}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.notes}
        />

        <PhotoGallery photos={photos} onAdd={onAddPhoto} onDelete={onRemovePhoto} />
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
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  order: {
    marginTop: 4,
    opacity: 0.6,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  visitDate: {
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    marginTop: -8,
    marginRight: -8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notes: {
    minHeight: 80,
  },
});

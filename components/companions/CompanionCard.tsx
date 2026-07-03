import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

import { paperCardStyle } from '../../constants/ui';
import { callPhone, sendEmail, sendSms } from '../../services/contacts';
import type { Companion } from '../../types';

interface CompanionCardProps {
  companion: Companion;
  onPress?: () => void;
  onDelete?: () => void;
  onUnlink?: () => void;
  showActions?: boolean;
}

export function CompanionCard({
  companion,
  onPress,
  onDelete,
  onUnlink,
  showActions = true,
}: CompanionCardProps) {
  const hasPhone = companion.phone.trim().length > 0;
  const hasEmail = companion.email.trim().length > 0;

  return (
    <Card style={[styles.card, paperCardStyle]} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.main}>
          <Text variant="titleMedium">{companion.name}</Text>
          {companion.phone ? (
            <Text variant="bodySmall" style={styles.detail}>
              {companion.phone}
            </Text>
          ) : null}
          {companion.email ? (
            <Text variant="bodySmall" style={styles.detail}>
              {companion.email}
            </Text>
          ) : null}
          {companion.notes ? (
            <Text variant="bodySmall" numberOfLines={2} style={styles.notes}>
              {companion.notes}
            </Text>
          ) : null}
        </View>
        {showActions ? (
          <View style={styles.actions}>
            {hasPhone ? (
              <>
                <IconButton
                  icon="phone"
                  size={20}
                  onPress={() => void callPhone(companion.phone)}
                />
                <IconButton
                  icon="message-text"
                  size={20}
                  onPress={() => void sendSms(companion.phone)}
                />
              </>
            ) : null}
            {hasEmail ? (
              <IconButton
                icon="email"
                size={20}
                onPress={() => void sendEmail(companion.email)}
              />
            ) : null}
            {onUnlink ? (
              <IconButton icon="link-off" size={20} onPress={onUnlink} />
            ) : null}
            {onDelete ? (
              <IconButton icon="delete-outline" size={20} onPress={onDelete} />
            ) : null}
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  detail: {
    opacity: 0.7,
  },
  notes: {
    marginTop: 4,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: -8,
  },
});

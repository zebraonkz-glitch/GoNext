import { useTranslation } from 'react-i18next';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        {message ? (
          <Dialog.Content>
            <Text variant="bodyMedium">{message}</Text>
          </Dialog.Content>
        ) : null}
        <Dialog.Actions>
          <Button onPress={onDismiss}>{t('common.cancel')}</Button>
          <Button onPress={onConfirm}>{confirmLabel ?? t('common.delete')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

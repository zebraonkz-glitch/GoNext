import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Portal, Text } from 'react-native-paper';

import { useAppTheme } from '../../contexts/ThemeProvider';
import { getPaperInputStyle } from '../../constants/ui';
import { formatDate, parseISODate, toISODateString } from '../../utils/dates';

interface DatePickerFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(parseISODate(value) ?? new Date());

  const openPicker = () => {
    setTempDate(parseISODate(value) ?? new Date());
    setVisible(true);
  };

  const closePicker = () => {
    setVisible(false);
  };

  const handleValueChange = (_event: unknown, date?: Date) => {
    if (!date) {
      return;
    }

    if (Platform.OS === 'android') {
      onChange(toISODateString(date));
      closePicker();
      return;
    }

    setTempDate(date);
  };

  const confirmIOS = () => {
    onChange(toISODateString(tempDate));
    closePicker();
  };

  return (
    <View style={styles.container}>
      <Text variant="labelLarge">{label}</Text>
      <View style={styles.row}>
        <Button mode="outlined" onPress={openPicker} style={[styles.button, getPaperInputStyle(colors)]}>
          {formatDate(value)}
        </Button>
        {value ? (
          <Button mode="text" onPress={() => onChange(null)}>
            {t('common.clear')}
          </Button>
        ) : null}
      </View>

      {Platform.OS === 'android' && visible ? (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onValueChange={handleValueChange}
          onDismiss={closePicker}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={closePicker}
            contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
          >
            <Text variant="titleMedium" style={styles.modalTitle}>
              {label}
            </Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onValueChange={handleValueChange}
            />
            <View style={styles.modalActions}>
              <Button onPress={closePicker}>{t('common.cancel')}</Button>
              <Button mode="contained" onPress={confirmIOS}>
                {t('common.done')}
              </Button>
            </View>
          </Modal>
        </Portal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    flex: 1,
  },
  modal: {
    margin: 24,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
});

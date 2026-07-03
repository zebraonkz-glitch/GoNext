import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button, Modal, Portal, Text } from 'react-native-paper';

import { formatDate, parseISODate, toISODateString } from '../../utils/dates';

interface DatePickerFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(parseISODate(value) ?? new Date());

  const openPicker = () => {
    setTempDate(parseISODate(value) ?? new Date());
    setVisible(true);
  };

  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setVisible(false);
      if (date) {
        onChange(toISODateString(date));
      }
      return;
    }
    if (date) {
      setTempDate(date);
    }
  };

  const confirmIOS = () => {
    onChange(toISODateString(tempDate));
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="labelLarge">{label}</Text>
      <View style={styles.row}>
        <Button mode="outlined" onPress={openPicker} style={styles.button}>
          {formatDate(value)}
        </Button>
        {value ? (
          <Button mode="text" onPress={() => onChange(null)}>
            Очистить
          </Button>
        ) : null}
      </View>

      {Platform.OS === 'android' && visible ? (
        <DateTimePicker value={tempDate} mode="date" display="default" onChange={handleChange} />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Portal>
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              {label}
            </Text>
            <DateTimePicker value={tempDate} mode="date" display="spinner" onChange={handleChange} />
            <View style={styles.modalActions}>
              <Button onPress={() => setVisible(false)}>Отмена</Button>
              <Button mode="contained" onPress={confirmIOS}>
                Готово
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
    backgroundColor: '#fff',
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

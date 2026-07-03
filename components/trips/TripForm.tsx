import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Switch, Text } from 'react-native-paper';

import { FormPanel, PaperTextInput } from '../PaperTextInput';
import { DatePickerField } from './DatePickerField';
import type { CreateTripInput } from '../../types';

interface TripFormProps {
  initialValues: CreateTripInput;
  onSubmit: (values: CreateTripInput) => Promise<void>;
  onDelete?: () => void;
  submitLabel?: string;
}

export function TripForm({
  initialValues,
  onSubmit,
  onDelete,
  submitLabel = 'Сохранить',
}: TripFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [current, setCurrent] = useState(initialValues.current);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Ошибка', 'Введите название поездки');
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      Alert.alert('Ошибка', 'Дата начала не может быть позже даты окончания');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        startDate,
        endDate,
        current,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormPanel>
      <PaperTextInput label="Название" value={title} onChangeText={setTitle} mode="outlined" />
      <PaperTextInput
        label="Описание"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.multiline}
      />
      <DatePickerField label="Дата начала" value={startDate} onChange={setStartDate} />
      <DatePickerField label="Дата окончания" value={endDate} onChange={setEndDate} />
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text variant="bodyLarge">Текущая поездка</Text>
          <Text variant="bodySmall" style={styles.hint}>
            Только одна поездка может быть текущей
          </Text>
        </View>
        <Switch value={current} onValueChange={setCurrent} />
      </View>
      <Button mode="contained" onPress={() => void handleSubmit()} loading={isSaving}>
        {submitLabel}
      </Button>
      {onDelete ? (
        <Button mode="outlined" textColor="#b00020" onPress={onDelete}>
          Удалить поездку
        </Button>
      ) : null}
    </FormPanel>
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 100,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchText: {
    flex: 1,
    gap: 4,
  },
  hint: {
    opacity: 0.7,
  },
});

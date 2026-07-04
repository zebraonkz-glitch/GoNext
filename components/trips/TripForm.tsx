import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Switch, Text } from 'react-native-paper';

import { FormPanel, PaperTextInput } from '../PaperTextInput';
import { DatePickerField } from './DatePickerField';
import { useAppTheme } from '../../contexts/ThemeProvider';
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
  submitLabel,
}: TripFormProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [current, setCurrent] = useState(initialValues.current);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert(t('common.error'), t('tripForm.titleRequired'));
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      Alert.alert(t('common.error'), t('tripForm.invalidDateRange'));
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
      <PaperTextInput label={t('tripForm.title')} value={title} onChangeText={setTitle} mode="outlined" />
      <PaperTextInput
        label={t('tripForm.description')}
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.multiline}
      />
      <DatePickerField label={t('tripForm.startDate')} value={startDate} onChange={setStartDate} />
      <DatePickerField label={t('tripForm.endDate')} value={endDate} onChange={setEndDate} />
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text variant="bodyLarge">{t('tripForm.currentTrip')}</Text>
          <Text variant="bodySmall" style={styles.hint}>
            {t('tripForm.currentTripHint')}
          </Text>
        </View>
        <Switch value={current} onValueChange={setCurrent} />
      </View>
      <Button mode="contained" onPress={() => void handleSubmit()} loading={isSaving}>
        {submitLabel ?? t('common.save')}
      </Button>
      {onDelete ? (
        <Button mode="outlined" textColor={colors.error} onPress={onDelete}>
          {t('tripForm.deleteTrip')}
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

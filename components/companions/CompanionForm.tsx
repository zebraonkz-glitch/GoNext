import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { FormPanel, PaperTextInput } from '../PaperTextInput';
import type { CreateCompanionInput } from '../../types';

interface CompanionFormProps {
  initialValues: CreateCompanionInput;
  onSubmit: (values: CreateCompanionInput) => Promise<void>;
  onDelete?: () => void;
  submitLabel?: string;
}

export function CompanionForm({
  initialValues,
  onSubmit,
  onDelete,
  submitLabel = 'Сохранить',
}: CompanionFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [phone, setPhone] = useState(initialValues.phone);
  const [email, setEmail] = useState(initialValues.email);
  const [notes, setNotes] = useState(initialValues.notes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Ошибка', 'Введите имя попутчика');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        name: trimmedName,
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormPanel>
      <PaperTextInput label="Имя *" value={name} onChangeText={setName} />
      <PaperTextInput
        label="Телефон"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <PaperTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <PaperTextInput
        label="Заметки"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={styles.multiline}
      />

      <Button mode="contained" onPress={() => void handleSubmit()} loading={isSaving} style={styles.button}>
        {submitLabel}
      </Button>

      {onDelete ? (
        <Button mode="outlined" textColor="#b00020" onPress={onDelete} style={styles.button}>
          Удалить
        </Button>
      ) : null}
    </FormPanel>
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 80,
  },
  button: {
    marginTop: 4,
  },
});

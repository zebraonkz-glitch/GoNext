import { useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { PickContactDialog } from './PickContactDialog';
import { FormPanel, PaperTextInput } from '../PaperTextInput';
import { UI } from '../../constants/ui';
import {
  mapDeviceContactToCompanionInput,
  pickDeviceContactNative,
  type DeviceContactPreview,
} from '../../services/deviceContacts';
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
  const [contactPickerVisible, setContactPickerVisible] = useState(false);

  const applyContact = (contact: DeviceContactPreview) => {
    const input = mapDeviceContactToCompanionInput(contact);
    setName(input.name);
    setPhone(input.phone);
    setEmail(input.email);
    setContactPickerVisible(false);
  };

  const handlePickFromContacts = async () => {
    if (Platform.OS === 'ios') {
      const contact = await pickDeviceContactNative();
      if (contact) {
        applyContact(contact);
      }
      return;
    }
    setContactPickerVisible(true);
  };

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
    <>
    <FormPanel>
      <Button
        mode="outlined"
        icon="contacts"
        onPress={() => void handlePickFromContacts()}
        style={styles.button}
      >
        Выбрать из контактов
      </Button>

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
        <Button mode="outlined" textColor={UI.error} onPress={onDelete} style={styles.button}>
          Удалить
        </Button>
      ) : null}
    </FormPanel>

    <PickContactDialog
      visible={contactPickerVisible}
      onDismiss={() => setContactPickerVisible(false)}
      onSelect={applyContact}
    />
    </>
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

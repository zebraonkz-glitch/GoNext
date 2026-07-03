import { Alert, Linking } from 'react-native';

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, '');
}

async function openUrl(url: string, errorMessage: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Ошибка', errorMessage);
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert('Ошибка', errorMessage);
    return false;
  }
}

export async function callPhone(phone: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    Alert.alert('Нет номера', 'У попутчика не указан телефон');
    return false;
  }
  return openUrl(`tel:${normalized}`, 'Не удалось открыть приложение для звонка');
}

export async function sendSms(phone: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    Alert.alert('Нет номера', 'У попутчика не указан телефон');
    return false;
  }
  return openUrl(`sms:${normalized}`, 'Не удалось открыть приложение для сообщений');
}

export async function sendEmail(email: string): Promise<boolean> {
  const trimmed = email.trim();
  if (!trimmed) {
    Alert.alert('Нет email', 'У попутчика не указан email');
    return false;
  }
  return openUrl(`mailto:${trimmed}`, 'Не удалось открыть почтовое приложение');
}

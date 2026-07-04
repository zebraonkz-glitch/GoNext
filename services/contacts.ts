import { Alert, Linking } from 'react-native';

import i18n from '../i18n';

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, '');
}

async function openUrl(url: string, errorMessage: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert(i18n.t('common.error'), errorMessage);
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert(i18n.t('common.error'), errorMessage);
    return false;
  }
}

export async function callPhone(phone: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    Alert.alert(
      i18n.t('contactsService.noPhoneTitle'),
      i18n.t('contactsService.noPhoneMessage')
    );
    return false;
  }
  return openUrl(`tel:${normalized}`, i18n.t('contactsService.callFailed'));
}

export async function sendSms(phone: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    Alert.alert(
      i18n.t('contactsService.noPhoneTitle'),
      i18n.t('contactsService.noPhoneMessage')
    );
    return false;
  }
  return openUrl(`sms:${normalized}`, i18n.t('contactsService.smsFailed'));
}

export async function sendEmail(email: string): Promise<boolean> {
  const trimmed = email.trim();
  if (!trimmed) {
    Alert.alert(
      i18n.t('contactsService.noEmailTitle'),
      i18n.t('contactsService.noEmailMessage')
    );
    return false;
  }
  return openUrl(`mailto:${trimmed}`, i18n.t('contactsService.emailFailed'));
}

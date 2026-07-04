import {
  Contact,
  ContactField,
  ContactsSortOrder,
  requestPermissionsAsync,
} from 'expo-contacts';
import { Alert, Platform } from 'react-native';

import type { CreateCompanionInput } from '../types';
import i18n from '../i18n';

export interface DeviceContactPreview {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const CONTACT_FIELDS = [
  ContactField.FULL_NAME,
  ContactField.GIVEN_NAME,
  ContactField.FAMILY_NAME,
  ContactField.PHONES,
  ContactField.EMAILS,
] as const;

type ContactRow = {
  id: string;
  fullName: string | null;
  givenName: string | null;
  familyName: string | null;
  phones: { number?: string }[];
  emails: { address?: string }[];
};

function formatContactName(row: Omit<ContactRow, 'id' | 'phones' | 'emails'>): string {
  const fullName = row.fullName?.trim();
  if (fullName) {
    return fullName;
  }

  const parts = [row.givenName, row.familyName].filter(Boolean);
  return parts.join(' ').trim();
}

function mapContactRow(row: ContactRow): DeviceContactPreview | null {
  const name = formatContactName(row);
  if (!name) {
    return null;
  }

  return {
    id: row.id,
    name,
    phone: row.phones?.[0]?.number?.trim() ?? '',
    email: row.emails?.[0]?.address?.trim() ?? '',
  };
}

export function mapDeviceContactToCompanionInput(
  contact: DeviceContactPreview
): CreateCompanionInput {
  return {
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    notes: '',
  };
}

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await requestPermissionsAsync();
  return status === 'granted';
}

export async function loadDeviceContacts(): Promise<DeviceContactPreview[]> {
  const granted = await requestContactsPermission();
  if (!granted) {
    Alert.alert(
      i18n.t('contactsService.noAccessTitle'),
      i18n.t('contactsService.noAccessPickMessage')
    );
    return [];
  }

  const rows = await Contact.getAllDetails([...CONTACT_FIELDS], {
    sortOrder: ContactsSortOrder.GivenName,
  });

  const contacts = rows
    .map((row) => mapContactRow(row as ContactRow))
    .filter((contact): contact is DeviceContactPreview => contact !== null);

  return contacts.sort((a, b) => a.name.localeCompare(b.name, i18n.language));
}

export async function pickDeviceContactNative(): Promise<DeviceContactPreview | null> {
  if (Platform.OS !== 'ios') {
    return null;
  }

  const granted = await requestContactsPermission();
  if (!granted) {
    Alert.alert(
      i18n.t('contactsService.noAccessTitle'),
      i18n.t('contactsService.noAccessMessage')
    );
    return null;
  }

  const picked = await Contact.presentPicker();
  if (!picked) {
    return null;
  }

  const details = await picked.getDetails([...CONTACT_FIELDS]);
  return mapContactRow({ ...details, id: picked.id } as ContactRow);
}

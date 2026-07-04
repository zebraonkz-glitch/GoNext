import i18n, { getDateLocale } from '../i18n';

export function formatDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleDateString(getDateLocale());
}

export function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) {
    return i18n.t('dates.notSet');
  }
  if (startDate && endDate) {
    return `${formatDate(startDate)} — ${formatDate(endDate)}`;
  }
  return formatDate(startDate ?? endDate);
}

export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string | null): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

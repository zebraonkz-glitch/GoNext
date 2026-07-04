import i18n from '../i18n';

export function getDbErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('unique') || message.includes('constraint')) {
      return i18n.t('errors.duplicateRecord');
    }

    if (message.includes('foreign key')) {
      return i18n.t('errors.foreignKey');
    }

    if (message.includes('database') || message.includes('sqlite')) {
      return i18n.t('errors.database');
    }

    return error.message || i18n.t('errors.generic');
  }

  return i18n.t('errors.generic');
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

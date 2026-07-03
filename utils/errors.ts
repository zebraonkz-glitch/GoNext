export function getDbErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('unique') || message.includes('constraint')) {
      return 'Запись с такими данными уже существует';
    }

    if (message.includes('foreign key')) {
      return 'Невозможно выполнить операцию: есть связанные данные';
    }

    if (message.includes('database') || message.includes('sqlite')) {
      return 'Ошибка базы данных. Попробуйте перезапустить приложение';
    }

    return error.message || 'Не удалось выполнить операцию с данными';
  }

  return 'Не удалось выполнить операцию с данными';
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

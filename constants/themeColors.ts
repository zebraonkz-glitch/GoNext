export type ThemePrimaryId =
  | 'blue'
  | 'teal'
  | 'green'
  | 'orange'
  | 'red'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'brown'
  | 'cyan';

export interface ThemePrimaryOption {
  id: ThemePrimaryId;
  light: string;
  dark: string;
}

export const DEFAULT_THEME_PRIMARY_ID: ThemePrimaryId = 'blue';

export const THEME_PRIMARY_OPTIONS: ThemePrimaryOption[] = [
  { id: 'blue', light: '#1565C0', dark: '#90CAF9' },
  { id: 'teal', light: '#00695C', dark: '#80CBC4' },
  { id: 'green', light: '#2E7D32', dark: '#81C784' },
  { id: 'orange', light: '#E65100', dark: '#FFB74D' },
  { id: 'red', light: '#C62828', dark: '#E57373' },
  { id: 'pink', light: '#AD1457', dark: '#F06292' },
  { id: 'purple', light: '#6A1B9A', dark: '#BA68C8' },
  { id: 'indigo', light: '#283593', dark: '#7986CB' },
  { id: 'brown', light: '#4E342E', dark: '#BCAAA4' },
  { id: 'cyan', light: '#00838F', dark: '#4DD0E1' },
];

const themePrimaryMap = new Map(THEME_PRIMARY_OPTIONS.map((option) => [option.id, option]));

export function isThemePrimaryId(value: string | null): value is ThemePrimaryId {
  return value !== null && themePrimaryMap.has(value as ThemePrimaryId);
}

export function getThemePrimaryColor(id: ThemePrimaryId, mode: 'light' | 'dark'): string {
  const option = themePrimaryMap.get(id) ?? themePrimaryMap.get(DEFAULT_THEME_PRIMARY_ID)!;
  return mode === 'dark' ? option.dark : option.light;
}

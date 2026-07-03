import { MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { UI } from '../constants/ui';

export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'transparent',
    surface: UI.surface,
    surfaceVariant: UI.surfaceMuted,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: UI.surface,
      level2: UI.surface,
      level3: UI.surface,
      level4: UI.surface,
      level5: UI.surface,
    },
  },
};

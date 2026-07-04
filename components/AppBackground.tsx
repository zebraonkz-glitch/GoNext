import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../contexts/ThemeProvider';

const backgroundSource = require('../assets/backgrounds/gonext-bg.png');

interface AppBackgroundProps {
  children: ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  const { isDark, colors } = useAppTheme();

  if (isDark) {
    return (
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        {children}
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

import type { ReactNode } from 'react';
import { Image, ImageBackground, Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '../contexts/ThemeProvider';

const backgroundSource = require('../assets/backgrounds/gonext-bg.png');

const webRootStyle =
  Platform.OS === 'web' ? ({ minHeight: '100vh', width: '100%' } as unknown as ViewStyle) : undefined;

interface AppBackgroundProps {
  children: ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  const { isDark, colors } = useAppTheme();

  if (isDark) {
    return (
      <View style={[styles.background, webRootStyle, { backgroundColor: colors.background }]}>
        {children}
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.background, webRootStyle]}>
        <Image source={backgroundSource} style={styles.webBackgroundImage} resizeMode="cover" />
        <View style={styles.foreground}>{children}</View>
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
  foreground: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  webBackgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
});

import { router } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { useAppTheme } from '../contexts/ThemeProvider';

interface ScreenLayoutProps {
  title: string;
  children: ReactNode;
  showBack?: boolean;
}

export function ScreenLayout({ title, children, showBack = true }: ScreenLayoutProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header style={[styles.header, { backgroundColor: colors.headerOverlay }]}>
        {showBack ? <Appbar.BackAction onPress={() => router.back()} /> : null}
        <Appbar.Content title={title} />
      </Appbar.Header>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {},
});

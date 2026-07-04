import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';

import { useAppTheme } from '../contexts/ThemeProvider';

type PaperTextInputProps = ComponentProps<typeof TextInput>;

export function PaperTextInput({ style, ...props }: PaperTextInputProps) {
  const { colors } = useAppTheme();

  return (
    <TextInput {...props} style={[{ backgroundColor: colors.surface }, style]} />
  );
}

interface FormPanelProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function FormPanel({ children, style }: FormPanelProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    gap: 12,
  },
});

import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';

import { UI, paperInputStyle } from '../constants/ui';

type PaperTextInputProps = ComponentProps<typeof TextInput>;

export function PaperTextInput({ style, ...props }: PaperTextInputProps) {
  return <TextInput {...props} style={[paperInputStyle, style]} />;
}

interface FormPanelProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function FormPanel({ children, style }: FormPanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: UI.surface,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    gap: 12,
  },
});

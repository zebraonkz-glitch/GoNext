import { Pressable, StyleSheet, View } from 'react-native';

import { THEME_PRIMARY_OPTIONS, type ThemePrimaryId } from '../../constants/themeColors';
import { useAppTheme } from '../../contexts/ThemeProvider';

interface PrimaryColorPickerProps {
  value: ThemePrimaryId;
  onChange: (primaryId: ThemePrimaryId) => void;
}

export function PrimaryColorPicker({ value, onChange }: PrimaryColorPickerProps) {
  const { mode, colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {THEME_PRIMARY_OPTIONS.map((option) => {
        const swatchColor = mode === 'dark' ? option.dark : option.light;
        const selected = value === option.id;

        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.id)}
            style={[
              styles.swatchOuter,
              selected && {
                borderColor: colors.primary,
                borderWidth: 3,
              },
            ]}
          >
            <View style={[styles.swatch, { backgroundColor: swatchColor }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const SWATCH_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  swatchOuter: {
    width: SWATCH_SIZE + 6,
    height: SWATCH_SIZE + 6,
    borderRadius: (SWATCH_SIZE + 6) / 2,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import type { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

export function PaperIcon({
  name,
  color,
  size,
  direction,
  testID,
}: IconProps) {
  return (
    <MaterialCommunityIcons
      name={name as keyof typeof MaterialCommunityIcons.glyphMap}
      color={color}
      size={size}
      testID={testID}
      style={[
        styles.icon,
        direction === 'rtl' ? styles.rtl : undefined,
        { lineHeight: size },
      ]}
    />
  );
}

export const paperSettings = {
  icon: (props: IconProps) => <PaperIcon {...props} />,
};

export const materialCommunityIconFont = MaterialCommunityIcons.font;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
  rtl: {
    transform: [{ scaleX: -1 }],
  },
});

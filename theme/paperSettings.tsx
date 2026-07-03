import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Settings } from 'react-native-paper/lib/typescript/core/settings';

export const paperSettings: Settings = {
  icon: (props) => (
    <MaterialCommunityIcons
      name={props.name as keyof typeof MaterialCommunityIcons.glyphMap}
      color={props.color}
      size={props.size}
      direction={props.direction}
      testID={props.testID}
    />
  ),
};

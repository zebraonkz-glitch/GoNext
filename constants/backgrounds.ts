import { ImageSourcePropType } from 'react-native';

export type BuiltInBackgroundId = 'default';

export type BackgroundId = BuiltInBackgroundId | 'custom';

export const DEFAULT_BACKGROUND_ID: BackgroundId = 'default';

export interface BuiltInBackgroundOption {
  id: BuiltInBackgroundId;
  source: ImageSourcePropType;
}

export const BUILT_IN_BACKGROUNDS: BuiltInBackgroundOption[] = [
  {
    id: 'default',
    source: require('../assets/backgrounds/gonext-bg.jpg'),
  },
];

const builtInMap = new Map(BUILT_IN_BACKGROUNDS.map((option) => [option.id, option]));

export function isBackgroundId(value: string | null): value is BackgroundId {
  return value === 'custom' || builtInMap.has(value as BuiltInBackgroundId);
}

export function getBuiltInBackgroundSource(id: BuiltInBackgroundId): ImageSourcePropType {
  return builtInMap.get(id)?.source ?? builtInMap.get('default')!.source;
}

export function resolveBackgroundSource(
  backgroundId: BackgroundId,
  customUri: string | null
): ImageSourcePropType {
  if (backgroundId === 'custom' && customUri) {
    return { uri: customUri };
  }
  if (backgroundId !== 'custom') {
    return getBuiltInBackgroundSource(backgroundId);
  }
  return getBuiltInBackgroundSource('default');
}

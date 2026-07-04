import { useTranslation } from 'react-i18next';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icon, Text } from 'react-native-paper';

import {
  BUILT_IN_BACKGROUNDS,
  type BackgroundId,
  type BuiltInBackgroundId,
} from '../../constants/backgrounds';
import { useAppTheme } from '../../contexts/ThemeProvider';

interface BackgroundPickerProps {
  backgroundId: BackgroundId;
  customUri: string | null;
  onSelectBuiltIn: (id: BuiltInBackgroundId) => void;
  onSelectCustom: (uri: string) => Promise<void>;
}

const THUMB_WIDTH = 88;
const THUMB_HEIGHT = 56;

export function BackgroundPicker({
  backgroundId,
  customUri,
  onSelectBuiltIn,
  onSelectCustom,
}: BackgroundPickerProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.noAccess'), t('placeForm.galleryDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.75,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await onSelectCustom(result.assets[0].uri);
      } catch {
        Alert.alert(t('common.error'), t('settings.backgroundSaveFailed'));
      }
    }
  };

  const customSelected = backgroundId === 'custom' && customUri;

  return (
    <View style={styles.container}>
      {BUILT_IN_BACKGROUNDS.map((option) => {
        const selected = backgroundId === option.id;

        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={t(`settings.backgrounds.${option.id}`)}
            onPress={() => onSelectBuiltIn(option.id)}
            style={[
              styles.thumbOuter,
              selected && { borderColor: colors.primary, borderWidth: 3 },
            ]}
          >
            <Image source={option.source} style={styles.thumb} resizeMode="cover" />
          </Pressable>
        );
      })}

      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected: backgroundId === 'custom' }}
        accessibilityLabel={t('settings.backgroundCustom')}
        onPress={() => void pickFromGallery()}
        style={[
          styles.thumbOuter,
          backgroundId === 'custom' && { borderColor: colors.primary, borderWidth: 3 },
        ]}
      >
        {customSelected ? (
          <Image
            key={customUri}
            source={{ uri: customUri }}
            style={styles.thumb}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.customPlaceholder, { backgroundColor: colors.surfaceMuted }]}>
            <Icon source="image-plus" size={28} color={colors.primary} />
          </View>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('settings.pickBackground')}
        onPress={() => void pickFromGallery()}
        style={styles.pickButton}
      >
        <Text variant="labelLarge" style={{ color: colors.primary }}>
          {t('settings.pickBackground')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 4,
  },
  thumbOuter: {
    width: THUMB_WIDTH + 6,
    height: THUMB_HEIGHT + 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 8,
  },
  customPlaceholder: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
});

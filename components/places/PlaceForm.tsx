import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, IconButton, Menu, Switch, Text } from 'react-native-paper';

import { FormPanel, PaperTextInput } from '../PaperTextInput';

import { PhotoGallery } from './PhotoGallery';
import { PlaceMap } from './PlaceMap';
import { MapActionButtons } from './MapActionButtons';
import { PlaceCompanionsSection } from '../companions/PlaceCompanionsSection';
import { UI } from '../../constants/ui';
import { getCurrentCoordinates } from '../../services/location';
import type { Companion, CreatePlaceInput, Photo } from '../../types';
import {
  formatCoordinate,
  hasValidCoordinates,
  parseCoordinate,
} from '../../utils/coordinates';

interface PlaceFormProps {
  initialValues: CreatePlaceInput;
  placeId?: string;
  photos?: Photo[];
  onSubmit: (values: CreatePlaceInput, pendingPhotoUris?: string[]) => Promise<void>;
  onDelete?: () => void;
  onAddPhoto?: (uri: string) => Promise<void>;
  onRemovePhoto?: (photoId: string) => Promise<void>;
  companions?: Companion[];
  onLinkCompanion?: () => void;
  onUnlinkCompanion?: (companionId: string) => void;
  submitLabel?: string;
}

export function PlaceForm({
  initialValues,
  placeId,
  photos = [],
  onSubmit,
  onDelete,
  onAddPhoto,
  onRemovePhoto,
  companions,
  onLinkCompanion,
  onUnlinkCompanion,
  submitLabel = 'Сохранить',
}: PlaceFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [visitlater, setVisitlater] = useState(initialValues.visitlater);
  const [liked, setLiked] = useState(initialValues.liked);
  const [latitudeText, setLatitudeText] = useState(formatCoordinate(initialValues.dd.latitude));
  const [longitudeText, setLongitudeText] = useState(formatCoordinate(initialValues.dd.longitude));
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [pendingUris, setPendingUris] = useState<string[]>([]);
  const [photoMenuVisible, setPhotoMenuVisible] = useState(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  const latitude = parseCoordinate(latitudeText);
  const longitude = parseCoordinate(longitudeText);
  const dd = { latitude, longitude };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await getCurrentCoordinates();
      setLatitudeText(formatCoordinate(coords.latitude));
      setLongitudeText(formatCoordinate(coords.longitude));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось получить координаты';
      Alert.alert('Геолокация', message);
    } finally {
      setIsLocating(false);
    }
  };

  const addPendingPhoto = async (picker: () => Promise<ImagePicker.ImagePickerResult>) => {
    setPhotoMenuVisible(false);
    const result = await picker();
    if (!result.canceled && result.assets[0]) {
      setPendingUris((current) => [...current, result.assets[0].uri]);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Нет доступа', 'Разрешите доступ к галерее в настройках устройства.');
      return;
    }
    setIsAddingPhoto(true);
    try {
      await addPendingPhoto(() =>
        ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 })
      );
    } finally {
      setIsAddingPhoto(false);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Нет доступа', 'Разрешите доступ к камере в настройках устройства.');
      return;
    }
    setIsAddingPhoto(true);
    try {
      await addPendingPhoto(() => ImagePicker.launchCameraAsync({ quality: 0.8 }));
    } finally {
      setIsAddingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Ошибка', 'Введите название места');
      return;
    }

    if (latitudeText.trim() && latitude === null) {
      Alert.alert('Ошибка', 'Некорректная широта');
      return;
    }

    if (longitudeText.trim() && longitude === null) {
      Alert.alert('Ошибка', 'Некорректная долгота');
      return;
    }

    if (
      latitudeText.trim() &&
      longitudeText.trim() &&
      !hasValidCoordinates(latitude, longitude)
    ) {
      Alert.alert('Ошибка', 'Широта должна быть от -90 до 90, долгота — от -180 до 180');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(
        {
          name: trimmedName,
          description: description.trim(),
          visitlater,
          liked,
          dd: {
            latitude: latitudeText.trim() ? latitude : null,
            longitude: longitudeText.trim() ? longitude : null,
          },
        },
        placeId ? undefined : pendingUris
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <FormPanel>
      <PaperTextInput label="Название" value={name} onChangeText={setName} mode="outlined" />
      <PaperTextInput
        label="Описание"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.multiline}
      />

      <View style={styles.switchRow}>
        <Text variant="bodyLarge">Посетить позже</Text>
        <Switch value={visitlater} onValueChange={setVisitlater} />
      </View>
      <View style={styles.switchRow}>
        <Text variant="bodyLarge">Понравилось</Text>
        <Switch value={liked} onValueChange={setLiked} />
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Координаты
      </Text>
      <View style={styles.coordsRow}>
        <PaperTextInput
          label="Широта"
          value={latitudeText}
          onChangeText={setLatitudeText}
          mode="outlined"
          keyboardType="numeric"
          style={styles.coordInput}
        />
        <PaperTextInput
          label="Долгота"
          value={longitudeText}
          onChangeText={setLongitudeText}
          mode="outlined"
          keyboardType="numeric"
          style={styles.coordInput}
        />
      </View>
      <Button
        mode="outlined"
        icon="crosshairs-gps"
        onPress={() => void handleGetLocation()}
        loading={isLocating}
        style={styles.button}
      >
        Моё местоположение
      </Button>

      <PlaceMap dd={dd} title={name} />
      <MapActionButtons dd={dd} label={name || 'Место'} style={styles.mapActions} />

      {placeId && onAddPhoto && onRemovePhoto ? (
        <PhotoGallery photos={photos} onAdd={onAddPhoto} onDelete={onRemovePhoto} />
      ) : !placeId ? (
        <View style={styles.pendingPhotos}>
          <View style={styles.pendingHeader}>
            <Text variant="titleMedium">Фотографии</Text>
            <Menu
              visible={photoMenuVisible}
              onDismiss={() => setPhotoMenuVisible(false)}
              anchor={
                <IconButton
                  icon="camera-plus"
                  disabled={isAddingPhoto}
                  onPress={() => setPhotoMenuVisible(true)}
                />
              }
            >
              <Menu.Item onPress={() => void pickFromGallery()} title="Из галереи" leadingIcon="image" />
              <Menu.Item onPress={() => void takePhoto()} title="С камеры" leadingIcon="camera" />
            </Menu>
          </View>
          {pendingUris.length === 0 ? (
            <Text variant="bodyMedium" style={styles.pendingEmpty}>
              Фото будут сохранены вместе с местом
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pendingGallery}>
              {pendingUris.map((uri, index) => (
                <View key={uri} style={styles.pendingWrapper}>
                  <Image source={{ uri }} style={styles.pendingPhoto} />
                  <IconButton
                    icon="close-circle"
                    size={20}
                    style={styles.pendingDelete}
                    onPress={() => setPendingUris((current) => current.filter((_, i) => i !== index))}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}

      {placeId && companions && onLinkCompanion && onUnlinkCompanion ? (
        <PlaceCompanionsSection
          companions={companions}
          onLink={onLinkCompanion}
          onUnlink={onUnlinkCompanion}
        />
      ) : null}

      <Button mode="contained" onPress={() => void handleSubmit()} loading={isSaving} style={styles.button}>
        {submitLabel}
      </Button>

      {onDelete ? (
        <Button mode="outlined" textColor={UI.error} onPress={onDelete} style={styles.button}>
          Удалить
        </Button>
      ) : null}
      </FormPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 16,
  },
  multiline: {
    minHeight: 100,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginTop: 8,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  coordInput: {
    flex: 1,
  },
  button: {
    marginTop: 4,
  },
  mapActions: {
    marginTop: 4,
  },
  pendingPhotos: {
    gap: 8,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingEmpty: {
    opacity: 0.6,
  },
  pendingGallery: {
    gap: 8,
  },
  pendingWrapper: {
    position: 'relative',
  },
  pendingPhoto: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  pendingDelete: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: UI.surface,
  },
});

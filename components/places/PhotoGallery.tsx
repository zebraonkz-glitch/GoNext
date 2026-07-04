import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, Text } from 'react-native-paper';

import { PhotoViewerModal } from './PhotoViewerModal';
import type { Photo } from '../../types';

interface PhotoGalleryProps {
  photos: Photo[];
  onAdd: (uri: string) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
  readOnly?: boolean;
}

export function PhotoGallery({ photos, onAdd, onDelete, readOnly = false }: PhotoGalleryProps) {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewerPhoto, setViewerPhoto] = useState<Photo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const pickFromGallery = async () => {
    setMenuVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.noAccess'), t('placeForm.galleryDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsAdding(true);
      try {
        await onAdd(result.assets[0].uri);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const takePhoto = async () => {
    setMenuVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.noAccess'), t('placeForm.cameraDenied'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsAdding(true);
      try {
        await onAdd(result.assets[0].uri);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDelete = (photo: Photo) => {
    Alert.alert(t('photos.deleteTitle'), t('photos.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => void onDelete(photo.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">{t('photos.title')}</Text>
        {!readOnly ? (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="camera-plus"
                disabled={isAdding}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => void pickFromGallery()} title={t('common.fromGallery')} leadingIcon="image" />
            <Menu.Item onPress={() => void takePhoto()} title={t('common.fromCamera')} leadingIcon="camera" />
          </Menu>
        ) : null}
      </View>

      {photos.length === 0 ? (
        <Text variant="bodyMedium" style={styles.empty}>
          {t('photos.empty')}
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
          {photos.map((photo) => (
            <View key={photo.id} style={styles.photoWrapper}>
              <Pressable onPress={() => setViewerPhoto(photo)}>
                <Image source={{ uri: photo.filePath }} style={styles.photo} />
              </Pressable>
              {!readOnly ? (
                <IconButton
                  icon="close-circle"
                  size={20}
                  style={styles.deleteButton}
                  onPress={() => handleDelete(photo)}
                />
              ) : null}
            </View>
          ))}
        </ScrollView>
      )}

      <PhotoViewerModal
        photo={viewerPhoto}
        visible={viewerPhoto !== null}
        onClose={() => setViewerPhoto(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    opacity: 0.6,
    paddingVertical: 8,
  },
  gallery: {
    gap: 8,
    paddingVertical: 4,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: '#fff',
  },
});

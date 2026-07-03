import { Image, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { IconButton } from 'react-native-paper';

import type { Photo } from '../../types';

interface PhotoViewerModalProps {
  photo: Photo | null;
  visible: boolean;
  onClose: () => void;
}

export function PhotoViewerModal({ photo, visible, onClose }: PhotoViewerModalProps) {
  const { width, height } = useWindowDimensions();

  if (!photo) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <IconButton icon="close" iconColor="#fff" style={styles.closeButton} onPress={onClose} />
        <Pressable style={styles.imageContainer} onPress={onClose}>
          <Image
            source={{ uri: photo.filePath }}
            style={{ width: width - 32, height: height * 0.7 }}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 8,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

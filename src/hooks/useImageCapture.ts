import { useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

/**
 * Wraps expo-image-picker for the two capture flows we support: taking a photo
 * with the camera and choosing an existing image from the library. Each method
 * requests the relevant permission and resolves to a local image URI, or `null`
 * if the user cancels or denies access.
 */
export function useImageCapture() {
  const pickFromCamera = useCallback(async (): Promise<string | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Camera permission needed',
        'Please allow camera access to photograph an animal or insect.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (result.canceled) {
      return null;
    }
    return result.assets[0]?.uri ?? null;
  }, []);

  const pickFromLibrary = useCallback(async (): Promise<string | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo access needed',
        'Please allow photo access to choose an image to identify.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled) {
      return null;
    }
    return result.assets[0]?.uri ?? null;
  }, []);

  return { pickFromCamera, pickFromLibrary };
}

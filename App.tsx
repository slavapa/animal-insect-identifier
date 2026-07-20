import { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CaptureScreen } from './src/screens/CaptureScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useImageCapture } from './src/hooks/useImageCapture';
import { identifySpecies } from './src/services/identify';
import { colors } from './src/theme';
import type { Identification, Mode } from './src/types';

type Status = 'idle' | 'identifying' | 'done';

export default function App() {
  const { pickFromCamera, pickFromLibrary } = useImageCapture();

  const [mode, setMode] = useState<Mode>('animal');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Identification | null>(null);

  const handlePickCamera = useCallback(async () => {
    const uri = await pickFromCamera();
    if (uri) {
      setImageUri(uri);
    }
  }, [pickFromCamera]);

  const handlePickLibrary = useCallback(async () => {
    const uri = await pickFromLibrary();
    if (uri) {
      setImageUri(uri);
    }
  }, [pickFromLibrary]);

  const handleClearImage = useCallback(() => {
    setImageUri(null);
  }, []);

  const handleIdentify = useCallback(async () => {
    if (!imageUri) {
      return;
    }
    setStatus('identifying');
    try {
      const identification = await identifySpecies(imageUri, mode);
      setResult(identification);
      setStatus('done');
    } catch (error) {
      setStatus('idle');
      Alert.alert(
        'Identification failed',
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  }, [imageUri, mode]);

  const handleReset = useCallback(() => {
    setResult(null);
    setImageUri(null);
    setStatus('idle');
  }, []);

  const showResult = status === 'done' && result && imageUri;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        {showResult ? (
          <ResultScreen imageUri={imageUri} identification={result} onReset={handleReset} />
        ) : (
          <CaptureScreen
            mode={mode}
            onModeChange={setMode}
            imageUri={imageUri}
            onPickCamera={handlePickCamera}
            onPickLibrary={handlePickLibrary}
            onClearImage={handleClearImage}
            onIdentify={handleIdentify}
            isIdentifying={status === 'identifying'}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

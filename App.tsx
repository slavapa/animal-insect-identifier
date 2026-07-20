import { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CaptureScreen } from './src/screens/CaptureScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useImageCapture } from './src/hooks/useImageCapture';
import { identifySpecies } from './src/services/identify';
import { hasGeminiApiKey } from './src/services/gemini';
import { colors } from './src/theme';
import type { CapturedImage, Identification, Mode } from './src/types';

type Status = 'idle' | 'identifying' | 'done';

const IS_DEMO = !hasGeminiApiKey();

export default function App() {
  const { pickFromCamera, pickFromLibrary } = useImageCapture();

  const [mode, setMode] = useState<Mode>('animal');
  const [image, setImage] = useState<CapturedImage | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Identification | null>(null);

  const handlePickCamera = useCallback(async () => {
    const captured = await pickFromCamera();
    if (captured) {
      setImage(captured);
    }
  }, [pickFromCamera]);

  const handlePickLibrary = useCallback(async () => {
    const captured = await pickFromLibrary();
    if (captured) {
      setImage(captured);
    }
  }, [pickFromLibrary]);

  const handleClearImage = useCallback(() => {
    setImage(null);
  }, []);

  const handleIdentify = useCallback(async () => {
    if (!image) {
      return;
    }
    setStatus('identifying');
    try {
      const identification = await identifySpecies(image, mode);
      setResult(identification);
      setStatus('done');
    } catch (error) {
      setStatus('idle');
      Alert.alert(
        'Identification failed',
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  }, [image, mode]);

  const handleReset = useCallback(() => {
    setResult(null);
    setImage(null);
    setStatus('idle');
  }, []);

  const showResult = status === 'done' && result && image;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        {showResult ? (
          <ResultScreen imageUri={image.uri} identification={result} onReset={handleReset} />
        ) : (
          <CaptureScreen
            mode={mode}
            onModeChange={setMode}
            imageUri={image?.uri ?? null}
            onPickCamera={handlePickCamera}
            onPickLibrary={handlePickLibrary}
            onClearImage={handleClearImage}
            onIdentify={handleIdentify}
            isIdentifying={status === 'identifying'}
            isDemo={IS_DEMO}
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

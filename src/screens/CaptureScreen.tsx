import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ModeToggle } from '../components/ModeToggle';
import { colors, modeThemes, radius, spacing } from '../theme';
import type { Mode } from '../types';

interface CaptureScreenProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  imageUri: string | null;
  onPickCamera: () => void;
  onPickLibrary: () => void;
  onClearImage: () => void;
  onIdentify: () => void;
  isIdentifying: boolean;
  isDemo: boolean;
}

export function CaptureScreen({
  mode,
  onModeChange,
  imageUri,
  onPickCamera,
  onPickLibrary,
  onClearImage,
  onIdentify,
  isIdentifying,
  isDemo,
}: CaptureScreenProps) {
  const theme = modeThemes[mode];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Species Identifier</Text>
        <Text style={styles.subtitle}>
          Snap or upload a photo to discover what you found.
        </Text>
      </View>

      <ModeToggle mode={mode} onChange={onModeChange} disabled={isIdentifying} />
      <Text style={styles.tagline}>{theme.tagline}</Text>

      <View style={styles.previewWrapper}>
        {imageUri ? (
          <View style={styles.previewImageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              contentFit="cover"
              transition={200}
            />
            {!isIdentifying && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove image"
                onPress={onClearImage}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={[styles.placeholder, { borderColor: theme.accent }]}>
            <Text style={styles.placeholderEmoji}>{theme.emoji}</Text>
            <Text style={styles.placeholderText}>No image selected yet</Text>
            <Text style={styles.placeholderHint}>
              Take a photo or choose one from your gallery
            </Text>
          </View>
        )}
      </View>

      <View style={styles.captureRow}>
        <View style={styles.captureButton}>
          <AppButton
            label="Take Photo"
            icon="📷"
            variant="secondary"
            onPress={onPickCamera}
            disabled={isIdentifying}
          />
        </View>
        <View style={styles.captureButton}>
          <AppButton
            label="Gallery"
            icon="🖼️"
            variant="secondary"
            onPress={onPickLibrary}
            disabled={isIdentifying}
          />
        </View>
      </View>

      <AppButton
        label={isIdentifying ? 'Identifying…' : `Identify ${theme.label}`}
        icon={isIdentifying ? undefined : '🔍'}
        accent={theme.accent}
        onPress={onIdentify}
        disabled={!imageUri}
        loading={isIdentifying}
      />

      <Text style={styles.disclaimer}>
        {isDemo
          ? 'Demo mode: results are sample data. Add a Gemini API key to identify real photos.'
          : 'Powered by Google Gemini. AI can make mistakes — verify important results.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  tagline: {
    color: colors.textFaint,
    fontSize: 13,
    textAlign: 'center',
    marginTop: -spacing.sm,
  },
  previewWrapper: {
    aspectRatio: 1,
    width: '100%',
  },
  previewImageWrapper: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  previewImage: {
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(15,20,25,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  placeholder: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  placeholderEmoji: {
    fontSize: 56,
  },
  placeholderText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  placeholderHint: {
    color: colors.textFaint,
    fontSize: 13,
    textAlign: 'center',
  },
  captureRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  captureButton: {
    flex: 1,
  },
  disclaimer: {
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});

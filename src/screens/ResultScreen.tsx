import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { colors, modeThemes, radius, spacing } from '../theme';
import type { Identification } from '../types';

interface ResultScreenProps {
  imageUri: string;
  identification: Identification;
  onReset: () => void;
}

export function ResultScreen({ imageUri, identification, onReset }: ResultScreenProps) {
  const { best, alternatives, isMock } = identification;
  const { species } = best;
  const theme = modeThemes[species.category];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image
          source={{ uri: imageUri }}
          style={styles.heroImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroText}>
          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
            <Text style={styles.badgeText}>
              {theme.emoji} {theme.label}
            </Text>
          </View>
          <Text style={styles.commonName}>
            {species.emoji} {species.commonName}
          </Text>
          <Text style={styles.scientificName}>{species.scientificName}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <ConfidenceBar confidence={best.confidence} accent={theme.accent} />
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Conservation status</Text>
          <Text style={[styles.statusValue, { color: theme.accent }]}>
            {species.conservationStatus}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.summary}>{species.summary}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key facts</Text>
        <View style={styles.factGrid}>
          {species.facts.map((fact) => (
            <View key={fact.label} style={styles.fact}>
              <Text style={styles.factLabel}>{fact.label}</Text>
              <Text style={styles.factValue}>{fact.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, styles.funFactCard, { borderColor: theme.accent }]}>
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>💡 Did you know?</Text>
        <Text style={styles.summary}>{species.funFact}</Text>
      </View>

      {alternatives.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Other possibilities</Text>
          {alternatives.map((alt) => (
            <View key={alt.species.id} style={styles.altRow}>
              <Text style={styles.altEmoji}>{alt.species.emoji}</Text>
              <View style={styles.altInfo}>
                <Text style={styles.altName}>{alt.species.commonName}</Text>
                <Text style={styles.altScientific}>{alt.species.scientificName}</Text>
              </View>
              <Text style={styles.altConfidence}>{Math.round(alt.confidence * 100)}%</Text>
            </View>
          ))}
        </View>
      )}

      {isMock && (
        <Text style={styles.disclaimer}>
          These results are sample data for demonstration. Wire up a recognition API
          to identify your actual photo.
        </Text>
      )}

      <AppButton label="Identify another" icon="↺" accent={theme.accent} onPress={onReset} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  hero: {
    height: 280,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,20,25,0.45)',
  },
  heroText: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '800',
  },
  commonName: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
  },
  scientificName: {
    color: '#dfe7ec',
    fontSize: 15,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  funFactCard: {
    backgroundColor: colors.surfaceMuted,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  summary: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  factGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  fact: {
    width: '47%',
    gap: 2,
  },
  factLabel: {
    color: colors.textFaint,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  factValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  altRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  altEmoji: {
    fontSize: 26,
  },
  altInfo: {
    flex: 1,
  },
  altName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  altScientific: {
    color: colors.textFaint,
    fontSize: 13,
    fontStyle: 'italic',
  },
  altConfidence: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  disclaimer: {
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});

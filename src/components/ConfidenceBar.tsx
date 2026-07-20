import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

interface ConfidenceBarProps {
  confidence: number;
  accent: string;
}

export function ConfidenceBar({ confidence, accent }: ConfidenceBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, confidence)) * 100);
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Match confidence</Text>
        <Text style={[styles.value, { color: accent }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    fontWeight: '800',
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});

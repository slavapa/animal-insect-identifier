import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, modeThemes, radius, spacing } from '../theme';
import type { Mode } from '../types';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}

const MODES: Mode[] = ['animal', 'insect'];

export function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <View style={styles.container}>
      {MODES.map((key) => {
        const theme = modeThemes[key];
        const active = key === mode;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            disabled={disabled}
            onPress={() => onChange(key)}
            style={[
              styles.option,
              active && { backgroundColor: theme.accent },
              disabled && styles.optionDisabled,
            ]}
          >
            <Text style={styles.emoji}>{theme.emoji}</Text>
            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
              {theme.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  optionDisabled: {
    opacity: 0.6,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.background,
  },
  labelInactive: {
    color: colors.textMuted,
  },
});

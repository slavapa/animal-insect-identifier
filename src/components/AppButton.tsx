import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary';
  accent?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function AppButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  accent = colors.animal,
  disabled,
  loading,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? { backgroundColor: accent } : styles.secondary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.background : colors.text} />
      ) : (
        <View style={styles.content}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text
            style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelPrimary: {
    color: colors.background,
  },
  labelSecondary: {
    color: colors.text,
  },
});

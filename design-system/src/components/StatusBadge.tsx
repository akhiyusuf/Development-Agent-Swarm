import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export type StatusTone = 'success' | 'error' | 'warning' | 'info';

const TONE_ICON: Record<StatusTone, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};

export type StatusBadgeProps = {
  tone: StatusTone;
  label: string;
};

/**
 * General-purpose system-status badge (sync state, form validation summary,
 * etc.) using the fixed semantic vocabulary (tokens.ts `semanticColors`).
 * This is deliberately separate from NodeStateBadge — the two vocabularies
 * (semantic vs. gamification) must never be interchanged (see design-system
 * carry-forward: node state must always render with node colors, not
 * semantic colors).
 */
export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const theme = useTheme();
  const color = theme.semantic[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '26',
          borderRadius: theme.radii.sm,
          paddingHorizontal: theme.spacing.space12,
          paddingVertical: theme.spacing.space8,
        },
      ]}
    >
      <Ionicons name={TONE_ICON[tone]} size={14} color={color} />
      <Text style={{ fontSize: theme.type.micro.fontSize, fontWeight: theme.type.micro.fontWeight, color, marginLeft: theme.spacing.space4 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

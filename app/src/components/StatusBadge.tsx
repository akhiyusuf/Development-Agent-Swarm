import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius } from '../theme/tokens';
import { Text } from './Typography';

export type BadgeTone = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface Props {
  label: string;
  tone: BadgeTone;
  icon?: keyof typeof Ionicons.glyphMap;
}

const TONE_MAP: Record<BadgeTone, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: '#E4F2E8', fg: color.semantic.success, icon: 'checkmark-circle' },
  error: { bg: '#F8E4E2', fg: color.semantic.error, icon: 'alert-circle' },
  warning: { bg: '#F7EBDC', fg: color.semantic.warning, icon: 'warning' },
  info: { bg: '#E2EEF4', fg: color.semantic.info, icon: 'information-circle' },
  neutral: { bg: color.neutral.warmgray200, fg: color.neutral.charcoal, icon: 'ellipse-outline' },
};

/** Small icon+label status chip — color is never the sole signal (§6.5). */
export function StatusBadge({ label, tone, icon }: Props) {
  const t = TONE_MAP[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Ionicons name={icon ?? t.icon} size={14} color={t.fg} />
      <Text variant="micro" colorToken={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
});

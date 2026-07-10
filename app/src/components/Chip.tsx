import React, { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { color, radius, touchTarget } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

/**
 * Shared chip primitive underlying both the household-unit portion picker
 * (§4.3) and the single-select form control (additive gap #2). Visual
 * language per §4.3: outlined warmgray-400 default, filled terracotta +
 * white text when selected, warmgray-200 press-state before commit.
 */
export function Chip({ label, selected, disabled, onPress, style, icon }: Props) {
  const [pressed, setPressed] = useState(false);
  let bg = 'transparent';
  let borderColor: string = color.neutral.warmgray400;
  let textColor: string = color.neutral.ink;

  if (disabled) {
    bg = color.neutral.warmgray400;
    textColor = color.neutral.warmgray700;
    borderColor = color.neutral.warmgray400;
  } else if (selected) {
    bg = color.primary.terracotta;
    textColor = color.neutral.white;
    borderColor = color.primary.terracotta;
  } else if (pressed) {
    bg = color.neutral.warmgray200;
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.base, { backgroundColor: bg, borderColor }, style]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
    >
      {icon}
      <Text variant="bodyEmphasis" colorToken={textColor} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    minWidth: 56,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

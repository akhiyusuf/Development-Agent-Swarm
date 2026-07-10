import React, { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { color, radius, touchTarget } from '../theme/tokens';
import { Text } from './Typography';

type Variant = 'primary' | 'secondary' | 'tertiary';
type State = 'default' | 'disabled' | 'error';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  state?: State;
  style?: ViewStyle;
  destructive?: boolean;
  testID?: string;
}

/** §4.1 Buttons — primary/secondary/text with default/press/disabled/error states. */
export function Button({ label, onPress, variant = 'primary', state = 'default', style, destructive, testID }: Props) {
  const [pressed, setPressed] = useState(false);
  const disabled = state === 'disabled';

  if (variant === 'tertiary') {
    const textColor = disabled
      ? color.neutral.warmgray700
      : destructive
      ? color.semantic.error
      : color.primary.terracotta;
    return (
      <Pressable
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[styles.tertiaryHit, style]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text variant="bodyEmphasis" colorToken={textColor} style={pressed && !disabled ? styles.underline : undefined}>
          {label}
        </Text>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    const borderColor = state === 'error' ? color.semantic.error : disabled ? color.neutral.warmgray400 : color.primary.terracotta;
    const textColor = disabled ? color.neutral.warmgray700 : color.primary.terracotta;
    return (
      <Pressable
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          styles.base,
          styles.secondary,
          { borderColor },
          pressed && !disabled ? { backgroundColor: color.neutral.warmgray200 } : null,
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text variant="bodyEmphasis" colorToken={textColor}>
          {label}
        </Text>
      </Pressable>
    );
  }

  // primary
  const bg = disabled
    ? color.neutral.warmgray400
    : pressed
    ? color.primary.terracottaDark
    : color.primary.terracotta;
  const textColor = disabled ? color.neutral.warmgray700 : color.neutral.white;
  const border = state === 'error' ? { borderWidth: 1.5, borderColor: color.semantic.error } : null;
  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.base, { backgroundColor: bg }, border, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text variant="bodyEmphasis" colorToken={textColor}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondary: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  tertiaryHit: {
    minHeight: touchTarget,
    minWidth: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  underline: { textDecorationLine: 'underline' },
});

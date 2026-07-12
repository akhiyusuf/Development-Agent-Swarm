import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type CardProps = ViewProps & {
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  error?: boolean;
};

/**
 * Card / list-container surface. No drop shadow by default (perf constraint
 * for low-end Android devices) — uses a 1px border for separation instead.
 * Tappable cards get a press-state background shift, not a shadow-lift.
 */
export function Card({ onPress, disabled, error, style, children, ...rest }: CardProps) {
  const theme = useTheme();

  const content = (pressed: boolean) => (
    <View
      style={[
        styles.base,
        {
          borderRadius: theme.radii.md,
          backgroundColor: disabled
            ? theme.neutrals.surface
            : pressed
              ? theme.neutrals.background
              : theme.neutrals.surface,
          opacity: disabled ? 0.6 : 1,
          borderWidth: error ? 1 : 0,
          borderColor: theme.semantic.error,
          padding: theme.spacing.space16,
        },
        style as any,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {({ pressed }) => content(pressed)}
      </Pressable>
    );
  }

  return content(false);
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});

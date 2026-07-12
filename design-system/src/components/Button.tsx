import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type ButtonProps = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Rare state: e.g. a submit action that just failed. Shows an error border/message. */
  error?: boolean;
  errorMessage?: string;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Primary/secondary/tertiary button implementing the four documented states:
 * default, pressed (touch equivalent of "hover"), disabled, error.
 *
 * Disabled actually disables the press handler (not just visual dimming) and
 * uses a pre-verified-contrast disabled palette rather than opacity alone, so
 * the label stays legible per the design system's disabled-button rule.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  error = false,
  errorMessage,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const theme = useTheme();

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return; // disabled truly disables the handler, not just the look
    onPress?.(e);
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        testID={testID}
        style={({ pressed }) => [
          styles.base,
          { minHeight: theme.minTouchTarget, borderRadius: theme.radii.sm },
          variantStyle(theme, variant, { pressed, disabled, error }),
        ]}
      >
        {({ pressed }) => (
          <Text
            style={[
              { fontSize: theme.type.bodyEmphasis.fontSize, fontWeight: theme.type.bodyEmphasis.fontWeight },
              textStyle(theme, variant, { disabled, error, pressed }),
            ]}
          >
            {label}
          </Text>
        )}
      </Pressable>
      {error && errorMessage ? (
        <Text
          style={{
            fontSize: theme.type.caption.fontSize,
            color: theme.semantic.error,
            marginTop: theme.spacing.space4,
          }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

function variantStyle(
  theme: ReturnType<typeof useTheme>,
  variant: ButtonVariant,
  state: { pressed: boolean; disabled: boolean; error: boolean }
) {
  const { pressed, disabled, error } = state;

  if (disabled) {
    return {
      backgroundColor: variant === 'primary' ? theme.neutrals.border : 'transparent',
      borderWidth: variant === 'secondary' ? 1.5 : 0,
      borderColor: theme.neutrals.border,
    };
  }

  if (variant === 'primary') {
    return {
      backgroundColor: pressed ? theme.brand.terracottaDark : theme.brand.terracotta,
      borderWidth: error ? 2 : 0,
      borderColor: theme.semantic.error,
      paddingHorizontal: theme.spacing.space24,
    };
  }

  if (variant === 'secondary') {
    // Single owner of "secondary button color": terracotta-outlined. Gold is
    // never used as a button's own color (reserved for highlight/streak/XP
    // accents), so there is one source of truth for this state.
    return {
      backgroundColor: pressed ? theme.neutrals.surface : 'transparent',
      borderWidth: 1.5,
      borderColor: error ? theme.semantic.error : theme.brand.terracotta,
      paddingHorizontal: theme.spacing.space24,
    };
  }

  // tertiary
  return {
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.space12,
  };
}

function textStyle(
  theme: ReturnType<typeof useTheme>,
  variant: ButtonVariant,
  state: { disabled: boolean; error: boolean; pressed: boolean }
) {
  const { disabled, pressed } = state;
  if (disabled) {
    return { color: theme.neutrals.placeholder };
  }
  if (variant === 'primary') {
    return { color: theme.neutrals.white };
  }
  return {
    color: theme.brand.terracotta,
    textDecorationLine: variant === 'tertiary' && pressed ? ('underline' as const) : ('none' as const),
  };
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

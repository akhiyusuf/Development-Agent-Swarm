import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
};

/**
 * Text field (food search, forms). Implements default / focus / disabled /
 * error states. Min height 48 to clear the touch-target floor even though
 * it's a text field, not a button — dense forms are explicitly called out by
 * the research as needing the same 44x44pt floor.
 */
export function TextField({ label, disabled, error, errorMessage, ...inputProps }: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.semantic.error
    : focused
      ? theme.brand.terracotta
      : theme.neutrals.border;
  const borderWidth = error || focused ? 2 : 1;

  return (
    <View>
      {label ? (
        <Text
          style={{
            fontSize: theme.type.body.fontSize,
            color: theme.neutrals.charcoal,
            marginBottom: theme.spacing.space4,
          }}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        {...inputProps}
        editable={!disabled}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        placeholderTextColor={theme.neutrals.placeholder}
        style={[
          styles.base,
          {
            minHeight: theme.minTouchTarget,
            borderRadius: theme.radii.sm,
            borderWidth,
            borderColor,
            backgroundColor: disabled ? theme.neutrals.background : theme.neutrals.surface,
            color: disabled ? theme.neutrals.placeholder : theme.neutrals.ink,
            fontSize: theme.type.body.fontSize,
            paddingHorizontal: theme.spacing.space16,
          },
        ]}
      />
      {error && errorMessage ? (
        <Text
          style={{
            fontSize: theme.type.caption.fontSize,
            color: theme.semantic.error,
            marginTop: theme.spacing.space4,
          }}
        >
          ⚠ {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});

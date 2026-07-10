import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, space } from '../theme/tokens';
import { Text } from './Typography';
import { useAppTheme } from '../theme/ThemeContext';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  secureToggle?: boolean;
  rightAdornment?: React.ReactNode;
}

/** §4.2 Inputs — default/focus/disabled/error states. */
export function Input({ label, error, disabled, secureToggle, rightAdornment, style, secureTextEntry, ...rest }: Props) {
  const { surfaces } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const borderColor = error
    ? color.semantic.error
    : focused
    ? color.primary.terracotta
    : color.neutral.warmgray400;
  const borderWidth = error || focused ? 2 : 1;
  const bg = disabled ? '#F7F3EE' : color.neutral.warmgray200;

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="body" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.inputRow, { backgroundColor: bg, borderColor, borderWidth }]}>
        <TextInput
          {...rest}
          editable={!disabled}
          secureTextEntry={hidden}
          placeholderTextColor={color.neutral.warmgray700}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, { color: disabled ? color.neutral.warmgray700 : surfaces.text }, style]}
        />
        {secureToggle ? (
          <Pressable onPress={() => setHidden((h) => !h)} style={styles.adornmentHit} accessibilityRole="button" accessibilityLabel="Toggle password visibility">
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={color.neutral.charcoal} />
          </Pressable>
        ) : rightAdornment ? (
          <View style={styles.adornmentHit}>{rightAdornment}</View>
        ) : null}
        {error ? (
          <Ionicons name="alert-circle" size={20} color={color.semantic.error} style={{ marginLeft: 4 }} />
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" colorToken={color.semantic.error} style={{ marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { marginBottom: space[4] },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: radius.sm,
    paddingHorizontal: space[12],
  },
  input: { flex: 1, fontSize: 16, minHeight: 44 },
  adornmentHit: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});

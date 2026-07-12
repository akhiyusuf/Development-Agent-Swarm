import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export type ChipOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SingleSelectChipsProps = {
  options: ChipOption[];
  value: string | null;
  onChange: (value: string) => void;
  accessibilityLabel?: string;
  error?: boolean;
  errorMessage?: string;
};

/**
 * Single-select choice-chip group (radio semantics) — used for Profile Setup
 * sex/activity-level/goal, market selection, meal-slot selection, etc.
 * Selection state is signaled by fill color AND a checkmark icon, never
 * color alone (accessibility rule #5).
 */
export function SingleSelectChips({
  options,
  value,
  onChange,
  accessibilityLabel,
  error,
  errorMessage,
}: SingleSelectChipsProps) {
  const theme = useTheme();

  return (
    <View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        style={[styles.wrap, { gap: theme.spacing.space8 }]}
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              disabled={opt.disabled}
              onPress={() => onChange(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: opt.disabled }}
              style={({ pressed }) => [
                styles.chip,
                {
                  minHeight: theme.minTouchTarget,
                  paddingHorizontal: theme.spacing.space16,
                  borderRadius: theme.radii.sm,
                  borderWidth: selected ? 0 : 1.5,
                  borderColor: error ? theme.semantic.error : theme.neutrals.border,
                  backgroundColor: selected
                    ? theme.brand.terracotta
                    : pressed
                      ? theme.neutrals.surface
                      : 'transparent',
                  opacity: opt.disabled ? 0.5 : 1,
                },
              ]}
            >
              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.neutrals.white}
                  style={{ marginRight: theme.spacing.space4 }}
                />
              ) : null}
              <Text
                style={{
                  fontSize: theme.type.body.fontSize,
                  color: selected ? theme.neutrals.white : theme.neutrals.ink,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

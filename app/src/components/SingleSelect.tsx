import React from 'react';
import { View, StyleSheet } from 'react-native';
import { space } from '../theme/tokens';
import { Text } from './Typography';
import { Chip } from './Chip';

export interface SingleSelectOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  options: SingleSelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * [Additive component — design-system gap #2, flagged in docs/screens.md]
 * General single-select choice control (radio-equivalent) for onboarding
 * forms, region/market pickers, meal-slot assignment, goal direction, etc.
 * Built from the same chip visual language as §4.3 (outlined warmgray-400 /
 * filled terracotta+white when selected) per the screens doc's interim
 * reuse note, but defined here as its own general-purpose component rather
 * than overloading the portion-unit picker.
 */
export function SingleSelect({ label, options, value, onChange, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text variant="body" style={{ marginBottom: space[8] }}>{label}</Text> : null}
      <View style={styles.row} accessibilityRole="radiogroup">
        {options.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            disabled={disabled}
            onPress={() => onChange(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[8] },
});

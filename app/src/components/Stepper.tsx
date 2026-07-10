import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, touchTarget } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** −/+ quantity stepper used by the household-unit portion picker (§4.3) and Log Attempt (W4). */
export function Stepper({ value, onChange, min = 0, max = 99, step = 1 }: Props) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(2)));
  return (
    <View style={styles.row}>
      <Pressable onPress={dec} style={styles.btn} accessibilityRole="button" accessibilityLabel="Decrease">
        <Ionicons name="remove" size={20} color={color.primary.terracotta} />
      </Pressable>
      <Text variant="h3" style={styles.value}>
        {value}
      </Text>
      <Pressable onPress={inc} style={styles.btn} accessibilityRole="button" accessibilityLabel="Increase">
        <Ionicons name="add" size={20} color={color.primary.terracotta} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.primary.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { minWidth: 32, textAlign: 'center' },
});

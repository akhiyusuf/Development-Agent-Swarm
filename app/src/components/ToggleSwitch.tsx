import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { color, touchTarget } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  label?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

/**
 * [Additive component — design-system gap #3, flagged in docs/screens.md]
 * On/off switch for: diaspora food-set enable, low-data-mode, notification
 * categories. Track/thumb use existing tokens only (terracotta = on,
 * warmgray-400 = off/track) and meet the 44pt touch-target floor via
 * hit-area padding even though the visual switch is smaller.
 */
export function ToggleSwitch({ label, value, onChange, disabled }: Props) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      style={styles.row}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
    >
      {label ? (
        <Text variant="body" style={{ flex: 1 }} colorToken={disabled ? color.neutral.warmgray700 : undefined}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.track,
          { backgroundColor: value ? color.primary.terracotta : color.neutral.warmgray400 },
          disabled && { opacity: 0.6 },
        ]}
      >
        <View style={[styles.thumb, { alignSelf: value ? 'flex-end' : 'flex-start' }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget,
    gap: 12,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.neutral.white,
  },
});

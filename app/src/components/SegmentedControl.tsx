import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { color, radius, touchTarget } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * [Additive component — design-system gap #1, flagged in docs/screens.md]
 * Segmented control used for: Sign Up/Log In mode switch, Add Entry
 * Search/Recent/Favorites/Custom tabs, Skill Tree Home track selector.
 * Visual language kept consistent with the rest of §4: warmgray-200 track,
 * terracotta fill for the active segment, 44pt-minimum touch targets.
 */
export function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              variant="bodyEmphasis"
              colorToken={active ? color.neutral.white : color.neutral.charcoal}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: color.neutral.warmgray200,
    borderRadius: radius.sm,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: touchTarget,
    borderRadius: radius.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  segmentActive: {
    backgroundColor: color.primary.terracotta,
  },
});

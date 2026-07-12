import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type SegmentedControlOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel?: string;
};

/**
 * Segmented control / in-sheet tab bar. Fills a gap flagged repeatedly by
 * the sitemap (Sign Up/Log In mode switch, Add Entry Search/Recent/
 * Favorites/Custom sheet tabs). Each segment meets the 44/48pt touch-target
 * floor regardless of how many segments are shown.
 */
export function SegmentedControl({ options, value, onChange, accessibilityLabel }: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.track,
        {
          backgroundColor: theme.neutrals.surface,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.space4,
        },
      ]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            disabled={opt.disabled}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: opt.disabled }}
            style={({ pressed }) => [
              styles.segment,
              {
                minHeight: theme.minTouchTarget - 8,
                borderRadius: theme.radii.sm - 2,
                backgroundColor: selected
                  ? theme.brand.terracotta
                  : pressed
                    ? theme.neutrals.background
                    : 'transparent',
                opacity: opt.disabled ? 0.5 : 1,
              },
            ]}
          >
            <Text
              style={{
                fontSize: theme.type.bodyEmphasis.fontSize,
                fontWeight: selected ? theme.type.bodyEmphasis.fontWeight : theme.type.body.fontWeight,
                color: selected ? theme.neutrals.white : theme.neutrals.ink,
              }}
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
    width: '100%',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

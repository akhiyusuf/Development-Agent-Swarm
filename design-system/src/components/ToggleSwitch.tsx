import React from 'react';
import { AccessibilityState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type ToggleSwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  /**
   * Optional explicit color overrides, bypassing the ambient app-wide theme.
   * Needed by callers (e.g. SessionPlayer's Pilates preset) that lock their
   * whole surface to a fixed light/dark scheme regardless of app-wide dark
   * mode — without these, the track/knob/label would silently keep
   * following the ambient theme via this component's own `useTheme()` call.
   */
  trackOffColor?: string;
  knobColor?: string;
  labelColor?: string;
};

/**
 * Toggle / switch — used for the Western/diaspora food-set enable, low-data
 * mode, notification toggles, and per-row settings switches, filling a gap
 * flagged repeatedly by the sitemap. Rendered with its own visible track/
 * knob geometry (not just a color swap) so on/off is legible without color.
 */
export function ToggleSwitch({
  value,
  onChange,
  label,
  disabled,
  trackOffColor,
  knobColor,
  labelColor,
}: ToggleSwitchProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();

  const accessibilityState: AccessibilityState = { disabled, checked: value };

  const track = (
    <View
      style={[
        styles.track,
        {
          backgroundColor: value ? theme.brand.terracotta : trackOffColor ?? theme.neutrals.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.knob,
          {
            backgroundColor: knobColor ?? theme.neutrals.white,
            alignSelf: value ? 'flex-end' : 'flex-start',
            // Reduced motion: knob position change is instant either way in RN
            // (no animation library used here), satisfying the reduced-motion
            // requirement by construction rather than needing a branch.
          },
          reducedMotion ? null : styles.knobShadow,
        ]}
      />
    </View>
  );

  if (!label) {
    return (
      <Pressable
        onPress={() => !disabled && onChange(!value)}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={accessibilityState}
        hitSlop={8}
        style={{ minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, alignItems: 'center', justifyContent: 'center' }}
      >
        {track}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={accessibilityState}
      style={[
        styles.row,
        { minHeight: theme.minTouchTarget, paddingVertical: theme.spacing.space8 },
      ]}
    >
      <Text
        style={{
          flex: 1,
          fontSize: theme.type.body.fontSize,
          color: disabled ? theme.neutrals.placeholder : labelColor ?? theme.neutrals.ink,
        }}
      >
        {label}
      </Text>
      {track}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  knobShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
});

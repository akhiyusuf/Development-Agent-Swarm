import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type ProgressBarProps = {
  /** 0-1. */
  progress: number;
  color: string;
  height?: number;
  /**
   * Optional explicit track color, overriding the app-wide theme's
   * `neutrals.border`. Needed by callers (e.g. SessionPlayer's Pilates
   * preset) that lock their surface to a fixed light/dark scheme regardless
   * of the ambient app-wide theme — without this override the track would
   * silently follow the ambient theme via this component's own `useTheme()`
   * call even when the fill color was deliberately fixed.
   */
  trackColor?: string;
};

/** Simple linear progress-bar fill on the standard track color. */
export function ProgressBar({ progress, color, height = 8, trackColor }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(progress, 1));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: trackColor ?? theme.neutrals.border,
        },
      ]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type ProgressBarProps = {
  /** 0-1. */
  progress: number;
  color: string;
  height?: number;
};

/** Simple linear progress-bar fill on the standard track color. */
export function ProgressBar({ progress, color, height = 8 }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(progress, 1));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: theme.neutrals.border,
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

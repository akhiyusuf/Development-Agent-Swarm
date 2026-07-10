import React from 'react';
import { View, StyleSheet } from 'react-native';
import { color, radius } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  progress: number; // 0..1
  fillColor?: string;
  trackColor?: string;
  height?: number;
  label?: string;
  valueLabel?: string;
  state?: 'default' | 'warning' | 'error';
}

/** §4.10 progress bar pattern, also reused for onboarding step progress and gate progress (W3). */
export function ProgressBar({ progress, fillColor, trackColor, height = 8, label, valueLabel, state = 'default' }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const resolvedFill =
    state === 'error' ? color.semantic.error : state === 'warning' ? color.semantic.warning : fillColor ?? color.primary.terracotta;
  return (
    <View style={{ width: '100%' }}>
      {(label || valueLabel) && (
        <View style={styles.labelRow}>
          {label ? <Text variant="caption">{label}</Text> : <View />}
          {valueLabel ? <Text variant="caption" colorToken={resolvedFill}>{valueLabel}</Text> : null}
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor: trackColor ?? color.neutral.warmgray400 }]}>
        <View
          style={[
            styles.fill,
            { width: `${clamped * 100}%`, backgroundColor: resolvedFill, height },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  track: { width: '100%', borderRadius: radius.sm, overflow: 'hidden' },
  fill: { borderRadius: radius.sm },
});

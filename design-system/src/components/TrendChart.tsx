import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

export type TrendPoint = {
  label: string;
  value: number;
};

export type TrendChartProps = {
  points: TrendPoint[];
  color: string;
  height?: number;
  unit?: string;
};

/**
 * Lightweight line/trend chart — fills the sitemap-flagged gap needed by
 * Micronutrient Detail's weekly trend and the Weight Log trend view. Solid
 * stroke only (no gradients/fills), per the low-end-device performance
 * constraint. Renders an empty state rather than a broken/blank chart when
 * there isn't enough data yet.
 */
export function TrendChart({ points, color, height = 140, unit }: TrendChartProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  if (points.length < 2) {
    return (
      <View
        onLayout={onLayout}
        style={{
          height,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.neutrals.surface,
          borderRadius: theme.radii.sm,
        }}
      >
        <Text style={{ color: theme.neutrals.placeholder, fontSize: theme.type.caption.fontSize }}>
          Not enough data yet
        </Text>
      </View>
    );
  }

  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const padding = 16;
  const plotHeight = height - padding * 2;
  const plotWidth = Math.max(width - padding * 2, 1);

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * plotWidth;
    const y = padding + plotHeight - ((p.value - min) / range) * plotHeight;
    return { x, y };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');

  return (
    <View onLayout={onLayout} style={{ height }}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={theme.neutrals.border} strokeWidth={1} />
          <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {coords.map((c, i) => (
            <Circle key={i} cx={c.x} cy={c.y} r={3} fill={color} />
          ))}
        </Svg>
      ) : null}
      <View style={styles.labelsRow}>
        <Text style={{ fontSize: theme.type.micro.fontSize, color: theme.neutrals.placeholder }}>
          {points[0].label}
        </Text>
        <Text style={{ fontSize: theme.type.micro.fontSize, color: theme.neutrals.placeholder }}>
          {points[points.length - 1].label}
        </Text>
      </View>
      {unit ? (
        <Text style={{ fontSize: theme.type.caption.fontSize, color: theme.neutrals.charcoal, marginTop: 2 }}>
          {min}–{max} {unit}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});

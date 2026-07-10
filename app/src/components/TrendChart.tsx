import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { color, space } from '../theme/tokens';
import { Text } from './Typography';

export interface TrendPoint {
  label: string;
  value: number | null; // null = no data for this point — rendered as an explicit gap, never a false zero
}

interface Props {
  data: TrendPoint[];
  lineColor?: string;
  height?: number;
  unit?: string;
  targetValue?: number;
}

/**
 * [Additive component — design-system gap #5, flagged in docs/screens.md]
 * Minimal line/time-series trend chart. Used by Micronutrient Detail (weekly
 * trend), Combined Progress Dashboard (weight + calorie-balance trend), and
 * Weight Log. Days/points with no data render as an explicit gap in the line
 * (never interpolated as zero), per Req 4's "no data" discipline.
 */
export function TrendChart({ data, lineColor = color.primary.terracotta, height = 140, unit, targetValue }: Props) {
  const width = 320;
  const padding = 16;
  const values = data.map((d) => d.value).filter((v): v is number => v !== null);
  const max = values.length ? Math.max(...values, targetValue ?? -Infinity) : 1;
  const min = values.length ? Math.min(...values, targetValue ?? Infinity) : 0;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y =
      d.value === null
        ? null
        : height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y, value: d.value };
  });

  // Build contiguous segments so gaps never get a connecting line drawn through them.
  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];
  points.forEach((p) => {
    if (p.y === null) {
      if (current.length) segments.push(current);
      current = [];
    } else {
      current.push({ x: p.x, y: p.y });
    }
  });
  if (current.length) segments.push(current);

  const targetY =
    targetValue !== undefined ? height - padding - ((targetValue - min) / range) * (height - padding * 2) : null;

  if (!values.length) {
    return (
      <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="caption" colorToken={color.neutral.warmgray700}>
          No data yet for this range.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Svg width={width} height={height}>
        {targetY !== null ? (
          <Line x1={padding} y1={targetY} x2={width - padding} y2={targetY} stroke={color.neutral.warmgray400} strokeDasharray="4,4" strokeWidth={1} />
        ) : null}
        {segments.map((seg, i) => (
          <Polyline
            key={i}
            points={seg.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={lineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {points.map((p, i) =>
          p.y !== null ? <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={lineColor} /> : null
        )}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space[4] }}>
        <Text variant="micro" colorToken={color.neutral.warmgray700}>
          {data[0]?.label}
        </Text>
        <Text variant="micro" colorToken={color.neutral.warmgray700}>
          {data[data.length - 1]?.label}
        </Text>
      </View>
      {unit ? (
        <Text variant="caption" colorToken={color.neutral.warmgray700}>
          Values in {unit}
          {targetValue !== undefined ? ' · dashed line = target' : ''}
        </Text>
      ) : null}
    </View>
  );
}

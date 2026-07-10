import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { color } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  fillColor: string;
  trackColor?: string;
  state?: 'default' | 'warning' | 'error';
  centerLabel?: string;
  centerSubLabel?: string;
}

/** §4.10 macro/metric ring — one accent color per metric, track in warmgray-400. */
export function ProgressRing({
  progress,
  size = 88,
  strokeWidth = 10,
  fillColor,
  trackColor = color.neutral.warmgray400,
  state = 'default',
  centerLabel,
  centerSubLabel,
}: Props) {
  const radiusPx = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusPx;
  const clamped = Math.max(0, Math.min(1, progress));
  const resolvedColor = state === 'error' ? color.semantic.error : state === 'warning' ? color.semantic.warning : fillColor;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusPx}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusPx}
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {centerLabel ? (
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text variant="h3">{centerLabel}</Text>
          {centerSubLabel ? (
            <Text variant="micro" colorToken={color.neutral.warmgray700}>
              {centerSubLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

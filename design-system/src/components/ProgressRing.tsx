import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

export type ProgressRingProps = {
  /** 0-1+. Values > 1 represent over-limit. */
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  valueText: string;
  /** Over-limit states must show text, not just a color swap. */
  status?: 'normal' | 'approaching' | 'exceeded';
};

/**
 * Progress ring — nutrition dashboard macro/metric visualization (one accent
 * color per macro, per the YAZIO-style vocabulary in tokens.ts `macroColors`).
 * Over-limit state swaps ring color to warning/error AND shows a text label
 * — color is never the sole signal.
 */
export function ProgressRing({ progress, color, size = 96, strokeWidth = 10, label, valueText, status = 'normal' }: ProgressRingProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(progress, 1);
  const dashOffset = circumference * (1 - clamped);

  const ringColor =
    status === 'exceeded' ? theme.semantic.error : status === 'approaching' ? theme.semantic.warning : color;

  return (
    <View style={{ alignItems: 'center', width: size }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.neutrals.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            fill="none"
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: theme.type.h3.fontSize, fontWeight: theme.type.h3.fontWeight, color: theme.neutrals.ink }}>
            {valueText}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: theme.type.caption.fontSize, color: theme.neutrals.charcoal, marginTop: theme.spacing.space4 }}>
        {label}
      </Text>
      {status !== 'normal' ? (
        <Text
          style={{
            fontSize: theme.type.micro.fontSize,
            color: status === 'exceeded' ? theme.semantic.error : theme.semantic.warning,
            marginTop: 2,
          }}
        >
          {status === 'exceeded' ? 'Over limit' : 'Approaching limit'}
        </Text>
      ) : null}
    </View>
  );
}

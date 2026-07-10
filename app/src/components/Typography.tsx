import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { type, color } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeContext';

type Variant = keyof typeof type;

interface Props extends TextProps {
  variant?: Variant;
  colorToken?: string;
  center?: boolean;
}

/**
 * Every text element in the app should render through this component so type
 * scale (§2) and dynamic-type support stay consistent — text always uses
 * scalable units (RN font sizes scale with OS text-scaling automatically) and
 * is never baked into an image (§6.9).
 */
export function Text({ variant = 'body', colorToken, style, center, ...rest }: Props) {
  const { surfaces } = useAppTheme();
  const scale = type[variant];
  return (
    <RNText
      {...rest}
      allowFontScaling
      maxFontSizeMultiplier={variant === 'timerXl' || variant === 'display' ? 1.5 : 2}
      style={[
        {
          fontSize: scale.fontSize,
          fontWeight: scale.fontWeight,
          lineHeight: scale.lineHeight,
          color: colorToken ?? surfaces.text,
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    />
  );
}

export const styles = StyleSheet.create({});
export { color };

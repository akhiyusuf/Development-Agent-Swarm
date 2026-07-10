import React, { useState } from 'react';
import { Pressable, View, ViewStyle, StyleSheet } from 'react-native';
import { color, radius, space } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeContext';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  state?: 'default' | 'disabled' | 'error';
  testID?: string;
  /** Forces dark-surface fill regardless of app-wide theme — used on the
   * always-dark skill-tree/node-map screens (carry-forward #7), independent
   * of the user's light/dark preference. */
  forceDark?: boolean;
}

/** §4.5 Cards — flat fill, 12px radius, border instead of shadow (perf constraint). */
export function Card({ children, onPress, style, state = 'default', testID, forceDark }: Props) {
  const { surfaces } = useAppTheme();
  const [pressed, setPressed] = useState(false);
  const disabled = state === 'disabled';

  const cardSurface = forceDark ? color.neutral.darkSurface : surfaces.card;
  const bg = pressed && onPress && !disabled ? (forceDark ? '#2B2C30' : '#F2ECE3') : cardSurface;
  const opacity = disabled ? 0.6 : 1;
  const borderColor = state === 'error' ? color.semantic.error : 'transparent';
  const borderWidth = state === 'error' ? 1 : 0;

  const content = (
    <View
      style={[
        styles.base,
        { backgroundColor: bg, opacity, borderColor, borderWidth },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    padding: space[16],
  },
});

import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { space } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeContext';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  /** Relaxed (§3): map/status/reflective views. Compact: logging/search/settings. */
  density?: 'compact' | 'relaxed';
  style?: ViewStyle;
  forceDark?: boolean;
}

/**
 * Standard screen shell: safe-area, background token, edge margins (space.16),
 * per-section density rhythm.
 */
export function ScreenContainer({ children, scroll = true, density = 'compact', style, forceDark }: Props) {
  const { surfaces } = useAppTheme();
  const bg = forceDark ? '#17181A' : surfaces.background;
  const gap = density === 'relaxed' ? space[24] : space[12];
  const Wrapper = scroll ? ScrollView : View;
  const wrapperProps = scroll
    ? { contentContainerStyle: [localStyles.content, { gap }, style] }
    : { style: [localStyles.flexContent, { gap }, style] };
  return (
    <SafeAreaView style={[localStyles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      <Wrapper {...(wrapperProps as any)}>{children}</Wrapper>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: space[16], paddingBottom: space[48] },
  flexContent: { flex: 1, padding: space[16] },
});

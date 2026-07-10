import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { color } from '../../theme/tokens';
import { Text } from '../../components/Typography';

/**
 * A1. Splash / Launch — full-bleed warm background, centered wordmark
 * (real text, never baked into an image, §6.9). Auto-advances once the
 * cached session check (AppStateProvider hydration) completes; RootNavigator
 * swaps this out for Auth / Onboarding / MainTabs once `state.hydrated` flips.
 */
export function SplashScreen() {
  return (
    <View style={styles.wrap}>
      <Text variant="display" colorToken={color.primary.terracotta} center>
        Fit & Fed
      </Text>
      <Text variant="body" colorToken={color.neutral.charcoal} center style={{ marginTop: 8 }}>
        Nutrition + bodyweight training for the way you actually eat and move
      </Text>
      <ActivityIndicator style={{ marginTop: 32 }} color={color.primary.terracotta} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: color.neutral.warmgray100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
});

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@fit-and-fed/design-system';
import { AppText } from '../../ui/layout';
import type { RootParamList } from '../../navigation/types';

/**
 * Splash / Launch — the pre-nav entry router.
 *
 * DATA CONTRACT (for app-builder): Splash reads THREE independent pieces of
 * local device state (user-flows §0.1/§0.2) and routes deterministically:
 *   type DeviceEntryState = {
 *     hasCachedSession: boolean;         // valid active login token
 *     hasOnboardingDraft: boolean;       // local unauthenticated draft in progress
 *     draftResumeScreen?: keyof RootParamList; // first not-yet-completed screen
 *     hasAccountHistoryMarker: boolean;  // set on first successful Sign Up/Log In,
 *                                        // survives ordinary Log Out, cleared only by
 *                                        // uninstall / clear-data / account deletion
 *   }
 * Routing (evaluated in order — §0.2):
 *   1. cached session               -> Main (Home), no intermediate screen (A7a)
 *   2. no session, draft            -> resume onboarding at draftResumeScreen (§0.1)
 *   3. no session, no draft, marker -> Auth {mode:'login'} short-circuit (A7b)
 *   4. none of the above            -> ProfileSetup, genuine first launch (A1)
 *
 * Below uses a clearly-labeled first-launch stub so preview boots into the full
 * onboarding sequence. Replace `deviceState` with the real device store; the
 * resolver itself is production-shaped and must not change.
 */
type DeviceEntryState = {
  hasCachedSession: boolean;
  hasOnboardingDraft: boolean;
  draftResumeScreen?: keyof RootParamList;
  hasAccountHistoryMarker: boolean;
};

// PLACEHOLDER preview state: genuine first launch (routes to Profile Setup).
const deviceState: DeviceEntryState = {
  hasCachedSession: false,
  hasOnboardingDraft: false,
  hasAccountHistoryMarker: false,
};

export function resolveEntry(s: DeviceEntryState): { route: keyof RootParamList; params?: object } {
  if (s.hasCachedSession) return { route: 'Main' };
  if (s.hasOnboardingDraft) return { route: s.draftResumeScreen ?? 'ProfileSetup' };
  if (s.hasAccountHistoryMarker) return { route: 'Auth', params: { mode: 'login' } };
  return { route: 'ProfileSetup' };
}

export function SplashScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const { route, params } = resolveEntry(deviceState);
    // reset so the user can't navigate "back" to the transient splash.
    navigation.reset({ index: 0, routes: [{ name: route as never, params: params as never }] });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.neutrals.background, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.space24 }}>
      {/* Real text wordmark — never text baked into an image. */}
      <AppText variant="display" color={theme.brand.terracotta}>
        Fit &amp; Fed
      </AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Nutrition &amp; progressive calisthenics / Pilates
      </AppText>
      <ActivityIndicator color={theme.brand.terracotta} />
    </View>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabs } from './MainTabs';
import { useAppState } from '../state/AppStateContext';

/**
 * Root router: Splash (while hydrating) -> Auth -> Onboarding -> MainTabs.
 * Matches the sitemap's pre-nav sequence: Splash -> Auth -> ... -> Welcome,
 * then the five-tab primary navigation shell.
 */
export function RootNavigator() {
  const { state } = useAppState();

  let content: React.ReactNode;
  if (!state.hydrated) {
    content = <SplashScreen />;
  } else if (!state.isAuthenticated) {
    content = <AuthNavigator />;
  } else if (!state.onboardingComplete) {
    content = <OnboardingNavigator />;
  } else {
    content = <MainTabs />;
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}

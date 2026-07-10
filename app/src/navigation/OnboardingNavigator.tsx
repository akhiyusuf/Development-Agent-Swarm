import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { GoalSetupScreen } from '../screens/onboarding/GoalSetupScreen';
import { RegionPreferenceScreen } from '../screens/onboarding/RegionPreferenceScreen';
import { ModuleInterestScreen } from '../screens/onboarding/ModuleInterestScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { AssessmentIntroScreen } from '../screens/placement/AssessmentIntroScreen';
import { TrackSelectionScreen } from '../screens/placement/TrackSelectionScreen';
import { PlacementStepsScreen } from '../screens/placement/PlacementStepsScreen';
import { PlacementResultScreen } from '../screens/placement/PlacementResultScreen';
import { CombinedSummaryScreen } from '../screens/placement/CombinedSummaryScreen';

const Stack = createNativeStackNavigator();

/** Pre-nav onboarding sequence per sitemap §Navigation Hierarchy Summary. */
export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
      <Stack.Screen name="RegionPreference" component={RegionPreferenceScreen} />
      <Stack.Screen name="ModuleInterest" component={ModuleInterestScreen} />
      <Stack.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
      <Stack.Screen name="TrackSelection" component={TrackSelectionScreen} />
      <Stack.Screen name="PlacementSteps" component={PlacementStepsScreen} />
      <Stack.Screen name="PlacementResult" component={PlacementResultScreen} />
      <Stack.Screen name="CombinedSummary" component={CombinedSummaryScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

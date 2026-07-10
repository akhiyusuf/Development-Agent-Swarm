import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SkillTreeHomeScreen } from '../screens/workout/SkillTreeHomeScreen';
import { TierNodeMapScreen } from '../screens/workout/TierNodeMapScreen';
import { NodeDetailScreen } from '../screens/workout/NodeDetailScreen';
import { LogAttemptScreen } from '../screens/workout/LogAttemptScreen';
import { MasteryGateConfirmationScreen } from '../screens/workout/MasteryGateConfirmationScreen';
import { ProgressionStatusScreen } from '../screens/workout/ProgressionStatusScreen';
import { WorkoutSessionLogScreen } from '../screens/workout/WorkoutSessionLogScreen';
import { WorkoutHistoryScreen } from '../screens/workout/WorkoutHistoryScreen';
import { AssessmentIntroScreen } from '../screens/placement/AssessmentIntroScreen';
import { TrackSelectionScreen } from '../screens/placement/TrackSelectionScreen';
import { PlacementStepsScreen } from '../screens/placement/PlacementStepsScreen';
import { PlacementResultScreen } from '../screens/placement/PlacementResultScreen';
import { CombinedSummaryScreen } from '../screens/placement/CombinedSummaryScreen';

const Stack = createNativeStackNavigator();

/**
 * Workout tab — mechanism-only per sitemap scope note. Placement screens
 * (A7a-g) are re-registered here (same components as onboarding) so Skill
 * Tree Home's "Complete placement" deferred re-entry (carry-forward #3) can
 * route into them with `returnTo: 'SkillTreeHome'`.
 */
export function WorkoutNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SkillTreeHome" component={SkillTreeHomeScreen} />
      <Stack.Screen name="TierNodeMap" component={TierNodeMapScreen} />
      <Stack.Screen name="NodeDetail" component={NodeDetailScreen} />
      <Stack.Screen name="LogAttempt" component={LogAttemptScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="MasteryGateConfirmation" component={MasteryGateConfirmationScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ProgressionStatus" component={ProgressionStatusScreen} />
      <Stack.Screen name="WorkoutSessionLog" component={WorkoutSessionLogScreen} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
      <Stack.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
      <Stack.Screen name="TrackSelection" component={TrackSelectionScreen} />
      <Stack.Screen name="PlacementSteps" component={PlacementStepsScreen} />
      <Stack.Screen name="PlacementResult" component={PlacementResultScreen} />
      <Stack.Screen name="CombinedSummary" component={CombinedSummaryScreen} />
    </Stack.Navigator>
  );
}

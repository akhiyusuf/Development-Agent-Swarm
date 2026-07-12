import React from 'react';
import { NavigationContainer, DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@fit-and-fed/design-system';

import { MainTabs } from './MainTabs';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { GoalSetupScreen } from '../screens/onboarding/GoalSetupScreen';
import { RegionPreferenceScreen } from '../screens/onboarding/RegionPreferenceScreen';
import { ModuleInterestScreen } from '../screens/onboarding/ModuleInterestScreen';
import { AuthScreen } from '../screens/onboarding/AuthScreen';
import { OnboardingCompleteScreen } from '../screens/onboarding/OnboardingCompleteScreen';
import { AssessmentIntroScreen } from '../screens/placement/AssessmentIntroScreen';
import { TrackSelectionScreen } from '../screens/placement/TrackSelectionScreen';
import { CalisthenicsPlacementStepsScreen } from '../screens/placement/CalisthenicsPlacementStepsScreen';
import { CalisthenicsPlacementResultScreen } from '../screens/placement/CalisthenicsPlacementResultScreen';
import { PilatesPlacementStepsScreen } from '../screens/placement/PilatesPlacementStepsScreen';
import { PilatesPlacementResultScreen } from '../screens/placement/PilatesPlacementResultScreen';
import { CombinedSummaryScreen } from '../screens/placement/CombinedSummaryScreen';

import { AddEntryScreen } from '../screens/nutrition/AddEntryScreen';
import { IngredientDetailScreen } from '../screens/nutrition/IngredientDetailScreen';
import { CompositeMealDetailScreen } from '../screens/nutrition/CompositeMealDetailScreen';
import { PortionReferenceGuideScreen } from '../screens/nutrition/PortionReferenceGuideScreen';
import { CustomFoodBuilderScreen } from '../screens/nutrition/CustomFoodBuilderScreen';
import { ConfirmLogScreen } from '../screens/nutrition/ConfirmLogScreen';
import { EditDeleteEntryScreen } from '../screens/nutrition/EditDeleteEntryScreen';
import { LogAttemptScreen } from '../screens/workout/LogAttemptScreen';
import { MasteryGateConfirmationScreen } from '../screens/workout/MasteryGateConfirmationScreen';
import { WorkoutSessionLogScreen } from '../screens/workout/WorkoutSessionLogScreen';
import { QuickAddWeightScreen } from '../screens/progress/QuickAddWeightScreen';

const RootStack = createNativeStackNavigator();

function useNavTheme(): NavTheme {
  const theme = useTheme();
  return {
    ...DefaultTheme,
    dark: theme.mode === 'dark',
    colors: {
      ...DefaultTheme.colors,
      primary: theme.brand.terracotta,
      background: theme.neutrals.background,
      card: theme.neutrals.surface,
      text: theme.neutrals.ink,
      border: theme.neutrals.border,
      notification: theme.semantic.error,
    },
  };
}

export function RootNavigator() {
  const theme = useTheme();
  const navTheme = useNavTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: theme.neutrals.surface },
          headerTintColor: theme.neutrals.ink,
          contentStyle: { backgroundColor: theme.neutrals.background },
        }}
      >
        {/* Pre-nav / onboarding — one-time sequential flow, no tab bar. */}
        <RootStack.Group screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <RootStack.Screen name="GoalSetup" component={GoalSetupScreen} />
          <RootStack.Screen name="RegionPreference" component={RegionPreferenceScreen} />
          <RootStack.Screen name="ModuleInterest" component={ModuleInterestScreen} />
          <RootStack.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
          <RootStack.Screen name="TrackSelection" component={TrackSelectionScreen} />
          <RootStack.Screen name="CalisthenicsPlacementSteps" component={CalisthenicsPlacementStepsScreen} />
          <RootStack.Screen name="CalisthenicsPlacementResult" component={CalisthenicsPlacementResultScreen} />
          <RootStack.Screen name="PilatesPlacementSteps" component={PilatesPlacementStepsScreen} />
          <RootStack.Screen name="PilatesPlacementResult" component={PilatesPlacementResultScreen} />
          <RootStack.Screen name="CombinedSummary" component={CombinedSummaryScreen} />
          <RootStack.Screen name="Auth" component={AuthScreen} />
          <RootStack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
        </RootStack.Group>

        {/* Tab shell */}
        <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />

        {/* Root modal group — transient sheets, dismissable ([CP-MODAL-BACKOUT]). */}
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Add Entry' }} />
          <RootStack.Screen name="IngredientDetail" component={IngredientDetailScreen} options={{ title: 'Ingredient' }} />
          <RootStack.Screen name="CompositeMealDetail" component={CompositeMealDetailScreen} options={{ title: 'Meal' }} />
          <RootStack.Screen name="PortionReferenceGuide" component={PortionReferenceGuideScreen} options={{ title: 'Portion Reference' }} />
          <RootStack.Screen name="CustomFoodBuilder" component={CustomFoodBuilderScreen} options={{ title: 'Custom Food' }} />
          <RootStack.Screen name="ConfirmLog" component={ConfirmLogScreen} options={{ title: 'Confirm & Log' }} />
          <RootStack.Screen name="EditDeleteEntry" component={EditDeleteEntryScreen} options={{ title: 'Edit Entry' }} />
          <RootStack.Screen name="LogAttempt" component={LogAttemptScreen} options={{ title: 'Log Attempt' }} />
          <RootStack.Screen name="MasteryGateConfirmation" component={MasteryGateConfirmationScreen} options={{ title: 'Mastery Gate' }} />
          <RootStack.Screen name="WorkoutSessionLog" component={WorkoutSessionLogScreen} options={{ title: 'Session Log' }} />
          <RootStack.Screen name="QuickAddWeight" component={QuickAddWeightScreen} options={{ title: 'Add Weight' }} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

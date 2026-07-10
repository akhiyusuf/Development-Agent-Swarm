import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CombinedProgressDashboardScreen } from '../screens/progress/CombinedProgressDashboardScreen';
import { WeightLogScreen } from '../screens/progress/WeightLogScreen';
import { GoalSettingsScreen } from '../screens/progress/GoalSettingsScreen';

const Stack = createNativeStackNavigator();

/** Progress tab (shared layer) — P1-P3 per sitemap. */
export function ProgressNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CombinedProgressDashboard" component={CombinedProgressDashboardScreen} />
      <Stack.Screen name="WeightLog" component={WeightLogScreen} />
      <Stack.Screen name="GoalSettings" component={GoalSettingsScreen} />
    </Stack.Navigator>
  );
}

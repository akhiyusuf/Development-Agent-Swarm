import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/home/HomeScreen';
import { NutritionNavigator } from './NutritionNavigator';
import { WorkoutNavigator } from './WorkoutNavigator';
import { ProgressNavigator } from './ProgressNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { color } from '../theme/tokens';
import { Text } from '../components/Typography';
import { useAppState } from '../state/AppStateContext';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Nutrition: 'restaurant',
  Workout: 'barbell',
  Progress: 'trending-up',
  ProfileTab: 'person-circle',
};

/**
 * §4.6 Navigation (tab bar) — five top-level tabs. Active tab uses terracotta
 * + a small underline indicator (never color alone); a sync-error badge dot
 * can appear on a tab (here: Nutrition, if any diary entry failed to sync).
 */
export function MainTabs() {
  const { state } = useAppState();
  const hasSyncError = state.diary.some((d) => d.syncFailed);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: color.primary.terracotta,
        tabBarInactiveTintColor: color.neutral.warmgray700,
        tabBarIcon: ({ color: c, focused }) => (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name={ICONS[route.name]} size={22} color={c} />
            {focused ? (
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color.primary.terracotta, marginTop: 2 }} />
            ) : null}
          </View>
        ),
        tabBarLabel: ({ color: c, children }) => <Text variant="micro" colorToken={c}>{children}</Text>,
        tabBarBadge: route.name === 'Nutrition' && hasSyncError ? '!' : undefined,
        tabBarBadgeStyle: { backgroundColor: color.semantic.error },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Nutrition" component={NutritionNavigator} />
      <Tab.Screen name="Workout" component={WorkoutNavigator} />
      <Tab.Screen name="Progress" component={ProgressNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

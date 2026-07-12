import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TabBar, TabItem, useTheme } from '@fit-and-fed/design-system';
import { useAppState } from '../state/AppStateContext';

import { HomeScreen } from '../screens/home/HomeScreen';
import { FoodDiaryScreen } from '../screens/nutrition/FoodDiaryScreen';
import { DailyNutritionSummaryScreen } from '../screens/nutrition/DailyNutritionSummaryScreen';
import { MicronutrientDetailScreen } from '../screens/nutrition/MicronutrientDetailScreen';
import { NutritionHistoryScreen } from '../screens/nutrition/NutritionHistoryScreen';
import { FavoritesRecentsScreen } from '../screens/nutrition/FavoritesRecentsScreen';
import { SkillTreeHomeScreen } from '../screens/workout/SkillTreeHomeScreen';
import { TierNodeMapScreen } from '../screens/workout/TierNodeMapScreen';
import { NodeDetailScreen } from '../screens/workout/NodeDetailScreen';
import { ProgressionStatusScreen } from '../screens/workout/ProgressionStatusScreen';
import { WorkoutHistoryScreen } from '../screens/workout/WorkoutHistoryScreen';
import { CombinedProgressDashboardScreen } from '../screens/progress/CombinedProgressDashboardScreen';
import { WeightLogScreen } from '../screens/progress/WeightLogScreen';
import { GoalSettingsScreen } from '../screens/progress/GoalSettingsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AccountSettingsScreen } from '../screens/profile/AccountSettingsScreen';
import { DataSyncSettingsScreen } from '../screens/profile/DataSyncSettingsScreen';
import { IntegrationsScreen } from '../screens/profile/IntegrationsScreen';
import { RegionLanguageSettingsScreen } from '../screens/profile/RegionLanguageSettingsScreen';
import { NotificationsSettingsScreen } from '../screens/profile/NotificationsSettingsScreen';
import { LegalDisclaimersScreen } from '../screens/profile/LegalDisclaimersScreen';
import { HelpSupportScreen } from '../screens/profile/HelpSupportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function stackScreenOptions(theme: ReturnType<typeof useTheme>) {
  return {
    headerStyle: { backgroundColor: theme.neutrals.surface },
    headerTintColor: theme.neutrals.ink,
    headerTitleStyle: { fontWeight: theme.type.h3.fontWeight },
    contentStyle: { backgroundColor: theme.neutrals.background },
  } as const;
}

function HomeStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Today' }} />
    </Stack.Navigator>
  );
}

function NutritionStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="FoodDiary" component={FoodDiaryScreen} options={{ title: 'Food Diary' }} />
      <Stack.Screen name="DailyNutritionSummary" component={DailyNutritionSummaryScreen} options={{ title: 'Daily Summary' }} />
      <Stack.Screen name="MicronutrientDetail" component={MicronutrientDetailScreen} options={{ title: 'Micronutrient' }} />
      <Stack.Screen name="NutritionHistory" component={NutritionHistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="FavoritesRecents" component={FavoritesRecentsScreen} options={{ title: 'Favorites & Recents' }} />
    </Stack.Navigator>
  );
}

function WorkoutStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="SkillTreeHome" component={SkillTreeHomeScreen} options={{ title: 'Skill Tree' }} />
      <Stack.Screen name="TierNodeMap" component={TierNodeMapScreen} options={{ title: 'Node Map' }} />
      <Stack.Screen name="NodeDetail" component={NodeDetailScreen} options={{ title: 'Skill' }} />
      <Stack.Screen name="ProgressionStatus" component={ProgressionStatusScreen} options={{ title: 'Progression' }} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: 'Session History' }} />
    </Stack.Navigator>
  );
}

function ProgressStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="CombinedProgressDashboard" component={CombinedProgressDashboardScreen} options={{ title: 'Progress' }} />
      <Stack.Screen name="WeightLog" component={WeightLogScreen} options={{ title: 'Weight Log' }} />
      <Stack.Screen name="GoalSettings" component={GoalSettingsScreen} options={{ title: 'Adjust Targets' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile & Settings' }} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: 'Account' }} />
      <Stack.Screen name="DataSyncSettings" component={DataSyncSettingsScreen} options={{ title: 'Data & Sync' }} />
      <Stack.Screen name="Integrations" component={IntegrationsScreen} options={{ title: 'Integrations' }} />
      <Stack.Screen name="RegionLanguageSettings" component={RegionLanguageSettingsScreen} options={{ title: 'Region & Language' }} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="LegalDisclaimers" component={LegalDisclaimersScreen} options={{ title: 'Legal & Disclaimers' }} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Help & Support' }} />
    </Stack.Navigator>
  );
}

const TAB_META: { name: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'HomeTab', label: 'Home', icon: 'home' },
  { name: 'NutritionTab', label: 'Nutrition', icon: 'restaurant' },
  { name: 'WorkoutTab', label: 'Workout', icon: 'barbell' },
  { name: 'ProgressTab', label: 'Progress', icon: 'trending-up' },
  { name: 'ProfileTab', label: 'Profile', icon: 'person' },
];

/** Bridges React Navigation's tab state onto the design-system TabBar component. */
function AppTabBar({ state, navigation }: BottomTabBarProps) {
  // The offline-sync queue's persistent-failure state ([CP-OFFLINE] step 5) —
  // the badge belongs on the Profile tab, whose Data & Sync screen is the
  // terminal surface for that queue (E3).
  const { syncQueue } = useAppState();
  const hasFailedSyncItems = syncQueue.some((i) => i.failed);

  const items: TabItem[] = TAB_META.map((m) => ({
    key: m.name,
    label: m.label,
    icon: m.icon,
    hasErrorBadge: m.name === 'ProfileTab' && hasFailedSyncItems,
  }));
  const activeKey = state.routes[state.index].name;

  return (
    <TabBar
      items={items}
      activeKey={activeKey}
      onChange={(key) => {
        const target = state.routes.find((r) => r.name === key);
        const focused = key === activeKey;
        const event = navigation.emit({ type: 'tabPress', target: target?.key, canPreventDefault: true });
        if (!focused && !event.defaultPrevented) {
          navigation.navigate(key);
        }
      }}
    />
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="NutritionTab" component={NutritionStack} />
      <Tab.Screen name="WorkoutTab" component={WorkoutStack} />
      <Tab.Screen name="ProgressTab" component={ProgressStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}

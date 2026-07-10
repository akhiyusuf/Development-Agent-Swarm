import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AccountSettingsScreen } from '../screens/profile/AccountSettingsScreen';
import { DataSyncSettingsScreen } from '../screens/profile/DataSyncSettingsScreen';
import { IntegrationsScreen } from '../screens/profile/IntegrationsScreen';
import { RegionLanguageSettingsScreen } from '../screens/profile/RegionLanguageSettingsScreen';
import { NotificationsSettingsScreen } from '../screens/profile/NotificationsSettingsScreen';
import { LegalDisclaimersScreen } from '../screens/profile/LegalDisclaimersScreen';
import { HelpSupportScreen } from '../screens/profile/HelpSupportScreen';

const Stack = createNativeStackNavigator();

/** Profile / Settings tab — S1-S8 per sitemap. */
export function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="DataSyncSettings" component={DataSyncSettingsScreen} />
      <Stack.Screen name="Integrations" component={IntegrationsScreen} />
      <Stack.Screen name="RegionLanguageSettings" component={RegionLanguageSettingsScreen} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
      <Stack.Screen name="LegalDisclaimers" component={LegalDisclaimersScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}

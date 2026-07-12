import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ListRow, SingleSelectChips, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';
import type { Sex } from '../../state/types';

/**
 * Profile (S1) — the Profile/Settings tab root: edit personal info + a shortcut
 * into Goal Settings, plus the settings menu into every sub-screen (Req 12).
 *
 * DATA CONTRACT: `{ profile: { name, sex, heightCm, weightKg } }`. Save commits;
 * unsaved edits discard on back-out (E1). No settings-menu screen exists in the
 * sitemap, so the menu rows live here on the tab root.
 */
export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { profile } = useAppState();

  const [name, setName] = useState(profile.name);
  const [sex, setSex] = useState<string | null>(profile.sex);
  const [height, setHeight] = useState(profile.heightCm ? String(profile.heightCm) : '');
  const [weight, setWeight] = useState(profile.weightKg ? String(profile.weightKg) : '');

  return (
    <Screen>
      <Section title="Personal info">
        <Card>
          <View style={{ gap: theme.spacing.space16 }}>
            <TextField label="Name" value={name} onChangeText={setName} />
            <Section title="Sex">
              <SingleSelectChips
                value={sex}
                onChange={setSex}
                options={[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'other', label: 'Prefer not to say' },
                ]}
              />
            </Section>
            <TextField label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
            <TextField label="Current weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          </View>
        </Card>
        <Button
          label="Save profile"
          onPress={() =>
            dispatch({
              type: 'SET_PROFILE',
              profile: {
                name,
                sex: sex as Sex,
                heightCm: Number(height) || null,
                weightKg: Number(weight) || null,
              },
            })
          }
        />
        <Button variant="secondary" label="Adjust goals & targets" onPress={() => navigation.navigate('GoalSettings')} />
      </Section>

      <Section title="Settings">
        <Card>
          <ListRow title="Account" subtitle="Email, password, delete account" leadingIcon="person-circle-outline" showChevron onPress={() => navigation.navigate('AccountSettings')} />
          <ListRow title="Data & Sync" subtitle="Offline status, manual sync, low-data mode" leadingIcon="sync-outline" showChevron onPress={() => navigation.navigate('DataSyncSettings')} />
          <ListRow title="Integrations" subtitle="Google Fit / Apple Health" leadingIcon="fitness-outline" showChevron onPress={() => navigation.navigate('Integrations')} />
          <ListRow title="Region & Language" subtitle="Market and household-unit display" leadingIcon="globe-outline" showChevron onPress={() => navigation.navigate('RegionLanguageSettings')} />
          <ListRow title="Notifications" subtitle="Reminders, streaks, sync" leadingIcon="notifications-outline" showChevron onPress={() => navigation.navigate('NotificationsSettings')} />
          <ListRow title="Legal & Disclaimers" subtitle="Privacy, injury liability" leadingIcon="document-text-outline" showChevron onPress={() => navigation.navigate('LegalDisclaimers')} />
          <ListRow title="Help & Support" subtitle="FAQ and contact" leadingIcon="help-circle-outline" showChevron onPress={() => navigation.navigate('HelpSupport')} />
        </Card>
      </Section>
    </Screen>
  );
}

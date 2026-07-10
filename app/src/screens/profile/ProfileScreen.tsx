import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SingleSelect } from '../../components/SingleSelect';
import { Card } from '../../components/Card';
import { ListRow } from '../../components/ListRow';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

const SETTINGS_LINKS: { route: string; title: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { route: 'AccountSettings', title: 'Account Settings', icon: 'key-outline' },
  { route: 'DataSyncSettings', title: 'Data & Sync Settings', icon: 'sync-outline' },
  { route: 'Integrations', title: 'Integrations', icon: 'link-outline' },
  { route: 'RegionLanguageSettings', title: 'Region & Language', icon: 'globe-outline' },
  { route: 'NotificationsSettings', title: 'Notifications', icon: 'notifications-outline' },
  { route: 'LegalDisclaimers', title: 'Legal & Disclaimers', icon: 'document-text-outline' },
  { route: 'HelpSupport', title: 'Help / Support', icon: 'help-circle-outline' },
];

/** S1. Profile — edit personal info, goals. */
export function ProfileScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch } = useAppState();
  const [name, setName] = useState(state.profile.name);
  const [height, setHeight] = useState(state.profile.heightCm?.toString() ?? '');
  const [weight, setWeight] = useState(state.profile.weightKg?.toString() ?? '');
  const [sex, setSex] = useState(state.profile.sex);

  const save = () => {
    dispatch({ type: 'SET_PROFILE', payload: { name, heightCm: Number(height), weightKg: Number(weight), sex } });
  };

  return (
    <ScreenContainer>
      <View style={{ alignItems: 'center', gap: space[8] }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: color.primary.deepgreen, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="person" size={36} color={color.neutral.white} />
        </View>
        <Text variant="h2">{state.profile.name || 'Your profile'}</Text>
      </View>
      <Card style={{ gap: space[12] }}>
        <Input label="Name" value={name} onChangeText={setName} />
        <SingleSelect
          label="Sex"
          value={sex}
          onChange={(v) => setSex(v as any)}
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
          ]}
        />
        <View style={{ flexDirection: 'row', gap: space[12] }}>
          <View style={{ flex: 1 }}>
            <Input label="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
          </View>
        </View>
      </Card>
      <Button label="Save" onPress={save} />
      <Button label="Edit goals" variant="secondary" onPress={() => nav.navigate('Progress', { screen: 'GoalSettings' })} />

      <View style={{ gap: space[8] }}>
        {SETTINGS_LINKS.map((link) => (
          <ListRow
            key={link.route}
            title={link.title}
            onPress={() => nav.navigate(link.route)}
            leading={<Ionicons name={link.icon} size={20} color={color.primary.deepgreen} />}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

import React from 'react';
import { Card } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { ToggleSwitch } from '../../components/ToggleSwitch';
import { useAppState } from '../../state/AppStateContext';

/** S6. Notifications Settings. */
export function NotificationsSettingsScreen() {
  const { state, dispatch } = useAppState();
  const set = (key: keyof typeof state.settings.notifications, value: boolean) =>
    dispatch({ type: 'SET_SETTINGS', payload: { notifications: { ...state.settings.notifications, [key]: value } } });

  return (
    <ScreenContainer>
      <Text variant="h1">Notifications</Text>
      <Card>
        <ToggleSwitch label="Log reminders" value={state.settings.notifications.logReminders} onChange={(v) => set('logReminders', v)} />
      </Card>
      <Card>
        <ToggleSwitch label="Streak / progress updates" value={state.settings.notifications.streakProgress} onChange={(v) => set('streakProgress', v)} />
      </Card>
      <Card>
        <ToggleSwitch label="Sync alerts" value={state.settings.notifications.syncAlerts} onChange={(v) => set('syncAlerts', v)} />
      </Card>
    </ScreenContainer>
  );
}

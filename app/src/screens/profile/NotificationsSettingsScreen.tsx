import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, ToggleSwitch, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';

/**
 * Notifications Settings (S6) — category toggles + optional quiet hours.
 *
 * DATA CONTRACT: `{ logReminders, streaks, sync, quietHours }`. Save queues the
 * setting sync if server-synced across devices ([CP-OFFLINE], E6).
 */
export function NotificationsSettingsScreen() {
  const theme = useTheme();
  const [logReminders, setLogReminders] = useState(true);
  const [streaks, setStreaks] = useState(true);
  const [sync, setSync] = useState(false);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <Screen>
      <Section title="Categories">
        <Card>
          <View style={{ gap: theme.spacing.space8 }}>
            <ToggleSwitch label="Meal-log reminders" value={logReminders} onChange={setLogReminders} />
            <ToggleSwitch label="Streaks & progress" value={streaks} onChange={setStreaks} />
            <ToggleSwitch label="Sync notifications" value={sync} onChange={setSync} />
          </View>
        </Card>
      </Section>

      <Section title="Quiet hours">
        <Card>
          <ToggleSwitch label="Silence notifications overnight" value={quietHours} onChange={setQuietHours} />
        </Card>
      </Section>

      <Button label="Save" onPress={() => { /* app-builder persists */ }} />
    </Screen>
  );
}

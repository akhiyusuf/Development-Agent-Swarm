import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, StatusBadge, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { SAMPLE_QUEUED_COUNT } from '../../data/sampleData';

/**
 * Account Settings (S2) — email/password, delete account, log out (Req 12).
 *
 * DATA CONTRACT: email/password change uses [CP-NETFAIL] (auth-adjacent, cannot
 * be queued). Delete account requires a confirm step, purges server + local data
 * INCLUDING the device account-history marker, then routes to a fresh first-launch
 * (E2). Log out warns if unsynced queued entries exist (does not hard-block),
 * preserves the marker, and routes to Splash -> Auth short-circuit (A7b/E2).
 */
export function AccountSettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('amara@example.com');
  const [password, setPassword] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  function goToSplash() {
    navigation.reset({ index: 0, routes: [{ name: 'Splash' as never }] });
  }

  return (
    <Screen>
      <Section title="Email & password">
        <Card>
          <View style={{ gap: theme.spacing.space16 }}>
            <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextField label="New password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Leave blank to keep current" />
          </View>
        </Card>
        <Button label="Save changes" onPress={() => { /* [CP-NETFAIL] on submit */ }} />
      </Section>

      <Section title="Session">
        {confirmingLogout ? (
          <Card error={SAMPLE_QUEUED_COUNT > 0}>
            {SAMPLE_QUEUED_COUNT > 0 ? (
              <AppText variant="body" color={theme.semantic.warning}>
                You have {SAMPLE_QUEUED_COUNT} unsynced entr{SAMPLE_QUEUED_COUNT === 1 ? 'y' : 'ies'} — log out anyway?
              </AppText>
            ) : (
              <AppText variant="body">Log out of this device?</AppText>
            )}
            <View style={{ gap: theme.spacing.space8, marginTop: theme.spacing.space8 }}>
              <Button label="Log out now" onPress={goToSplash} />
              <Button variant="tertiary" label="Cancel & sync first" onPress={() => setConfirmingLogout(false)} />
            </View>
          </Card>
        ) : (
          <Button variant="secondary" label="Log out" onPress={() => setConfirmingLogout(true)} />
        )}
      </Section>

      <Section title="Danger zone">
        {confirmingDelete ? (
          <Card error>
            <AppText variant="bodyEmphasis" color={theme.semantic.error}>
              Delete your account?
            </AppText>
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              This permanently deletes your account and all data, and clears this device.
            </AppText>
            <View style={{ gap: theme.spacing.space8, marginTop: theme.spacing.space8 }}>
              <Button label="Yes, delete everything" error errorMessage="" onPress={goToSplash} />
              <Button variant="tertiary" label="Cancel" onPress={() => setConfirmingDelete(false)} />
            </View>
          </Card>
        ) : (
          <>
            <StatusBadge tone="error" label="Deleting is permanent" />
            <Button variant="tertiary" label="Delete account" onPress={() => setConfirmingDelete(true)} />
          </>
        )}
      </Section>
    </Screen>
  );
}

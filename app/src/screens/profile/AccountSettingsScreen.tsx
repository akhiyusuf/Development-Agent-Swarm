import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, StatusBadge, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { useAppDispatch, useAppState, purgeLocalState } from '../../state/AppStateContext';
import { useQueuedCount } from '../../state/selectors';

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
  const dispatch = useAppDispatch();
  const { auth } = useAppState();
  const queuedCount = useQueuedCount();

  const [email, setEmail] = useState(auth.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  function goToSplash() {
    navigation.reset({ index: 0, routes: [{ name: 'Splash' as never }] });
  }

  function logOutNow() {
    dispatch({ type: 'LOG_OUT' });
    goToSplash();
  }

  /**
   * Real, in-app account deletion (App Store Guideline 5.1.1(v) / Google Play
   * account-deletion policy) — purges local persisted state + resets the
   * in-memory store to a pristine first-launch state, including clearing the
   * device account-history marker, rather than only pointing to support.
   */
  async function deleteAccountNow() {
    dispatch({ type: 'DELETE_ACCOUNT' });
    await purgeLocalState();
    goToSplash();
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
        <Button
          label="Save changes"
          onPress={() => {
            // [CP-NETFAIL]-adjacent in spec; this build has no real backend
            // (see BUILD_NOTES.md), so this commits the email locally.
            dispatch({ type: 'SET_EMAIL', email });
          }}
        />
      </Section>

      <Section title="Session">
        {confirmingLogout ? (
          <Card error={queuedCount > 0}>
            {queuedCount > 0 ? (
              <AppText variant="body" color={theme.semantic.warning}>
                You have {queuedCount} unsynced entr{queuedCount === 1 ? 'y' : 'ies'} — log out anyway?
              </AppText>
            ) : (
              <AppText variant="body">Log out of this device?</AppText>
            )}
            <View style={{ gap: theme.spacing.space8, marginTop: theme.spacing.space8 }}>
              <Button label="Log out now" onPress={logOutNow} />
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
              <Button label="Yes, delete everything" error errorMessage="" onPress={deleteAccountNow} />
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

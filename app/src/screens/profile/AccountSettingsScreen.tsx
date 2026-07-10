import React, { useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** S2. Account Settings — email/password, delete account. */
export function AccountSettingsScreen() {
  const { state, dispatch } = useAppState();
  const [email, setEmail] = useState(state.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Account</Text>
      <Card style={{ gap: 12 }}>
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input label="New password" value={password} onChangeText={setPassword} secureTextEntry secureToggle />
      </Card>
      <Button label="Save changes" onPress={() => {}} />
      <Button label="Log out" variant="secondary" onPress={() => dispatch({ type: 'LOGOUT' })} />
      {confirmDelete ? (
        <Card state="error">
          <Text variant="body" colorToken={color.semantic.error}>
            This permanently deletes your account and all logged data. This can't be undone.
          </Text>
          <Button label="Yes, delete my account" destructive variant="tertiary" onPress={() => dispatch({ type: 'LOGOUT' })} />
        </Card>
      ) : (
        <Button label="Delete account" destructive variant="tertiary" onPress={() => setConfirmDelete(true)} />
      )}
    </ScreenContainer>
  );
}

import React, { useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { BottomSheet } from '../../components/BottomSheet';
import { StatusBadge } from '../../components/StatusBadge';
import { space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/**
 * A2. Sign Up / Log In + forgot-password sub-flow.
 * [GAP] segmented control used here per docs/screens.md — implemented as an
 * additive design-system component (SegmentedControl), not invented ad hoc.
 */
export function AuthScreen() {
  const { dispatch, isOnline } = useAppState();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const submit = () => {
    if (!isOnline) {
      setError("You're offline — connect to sign in.");
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(undefined);
    dispatch({ type: 'SET_AUTH', email });
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">{mode === 'login' ? 'Log in' : 'Create your account'}</Text>
      <SegmentedControl
        options={[
          { value: 'signup', label: 'Sign Up' },
          { value: 'login', label: 'Log In' },
        ]}
        value={mode}
        onChange={(v) => setMode(v as 'login' | 'signup')}
      />
      {!isOnline ? <StatusBadge tone="warning" label="Offline" /> : null}
      <View style={{ gap: space[16] }}>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <Input label="Password" secureTextEntry secureToggle value={password} onChangeText={setPassword} placeholder="••••••••" error={error} />
      </View>
      <Button label={mode === 'login' ? 'Log in' : 'Create account'} onPress={submit} />
      <Button label="Forgot password?" variant="tertiary" onPress={() => setForgotVisible(true)} />

      <BottomSheet visible={forgotVisible} onDismiss={() => setForgotVisible(false)} title="Reset your password">
        {resetSent ? (
          <StatusBadge tone="success" label={`Reset link sent to ${resetEmail}`} />
        ) : (
          <>
            <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={resetEmail} onChangeText={setResetEmail} />
            <Button label="Send reset link" onPress={() => setResetSent(true)} />
          </>
        )}
      </BottomSheet>
    </ScreenContainer>
  );
}

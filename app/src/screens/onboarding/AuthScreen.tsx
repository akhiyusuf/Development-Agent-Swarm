import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomSheet, Button, SegmentedControl, StatusBadge, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import type { RootParamList } from '../../navigation/types';
import { useAppDispatch } from '../../state/AppStateContext';

/**
 * Sign Up / Log In — the mandatory account gate (user-flows §0.3: no guest/skip
 * path exists). Sits immediately before Onboarding Complete in the reordered
 * sitemap.
 *
 * DATA CONTRACT:
 *  - Sign Up (A4): create account, atomically attach the local onboarding draft,
 *    clear the draft, set the device account-history marker -> OnboardingComplete.
 *  - Log In (A5): authenticate, run the field-level server-wins merge (§0.1); if
 *    any required field is unfilled -> resume onboarding at it, else a fully
 *    onboarded account -> Main (Home) directly (§0.2, no Welcome-back screen).
 *  - Both are synchronous, connectivity-required: [CP-NETFAIL] on submit
 *    (form preserved + inline retry). [CP-VALIDATION] per field.
 */
export function AuthScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootParamList, 'Auth'>>();

  const [mode, setMode] = useState<'login' | 'signup'>(route.params?.mode ?? 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const pwValid = password.length >= 8;

  function submit() {
    setTouched(true);
    if (!emailValid || !pwValid) return;
    if (mode === 'signup') {
      // Attaches the local onboarding draft to the account (no real backend
      // in this build — see BUILD_NOTES.md) and sets the device
      // account-history marker (§0.2/A4).
      dispatch({ type: 'SIGN_UP', email });
      navigation.navigate('OnboardingComplete');
    } else {
      // Returning, fully-onboarded account lands straight on Home (§0.2).
      dispatch({ type: 'LOG_IN', email });
      navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] });
    }
  }

  return (
    <Screen>
      <AppText variant="h1">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        {mode === 'signup'
          ? "This is the point where there's real progress worth saving — your profile, targets and placement attach to this account."
          : 'Log in to sync your account across devices.'}
      </AppText>

      <SegmentedControl
        accessibilityLabel="Auth mode"
        value={mode}
        onChange={(v) => setMode(v as 'login' | 'signup')}
        options={[
          { value: 'signup', label: 'Sign Up' },
          { value: 'login', label: 'Log In' },
        ]}
      />

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="you@example.com"
        error={touched && !emailValid}
        errorMessage="Enter a valid email"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPw}
        placeholder="At least 8 characters"
        error={touched && !pwValid}
        errorMessage="Password must be at least 8 characters"
      />
      <View style={{ alignItems: 'flex-start' }}>
        <Button variant="tertiary" label={showPw ? 'Hide password' : 'Show password'} onPress={() => setShowPw((s) => !s)} />
      </View>

      <Button label={mode === 'signup' ? 'Create account' : 'Log in'} onPress={submit} />
      <Button variant="tertiary" label="Forgot password?" onPress={() => { setForgotOpen(true); setForgotSent(false); }} />

      <BottomSheet
        visible={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset your password"
      >
        {forgotSent ? (
          <View style={{ gap: theme.spacing.space12 }}>
            <StatusBadge tone="success" label="Reset link sent" />
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              If an account exists for that email, a reset link is on its way.
            </AppText>
            <Button label="Done" onPress={() => setForgotOpen(false)} />
          </View>
        ) : (
          <View style={{ gap: theme.spacing.space12 }}>
            <TextField
              label="Email"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
            />
            <Button label="Send reset link" onPress={() => setForgotSent(true)} />
          </View>
        )}
      </BottomSheet>
    </Screen>
  );
}

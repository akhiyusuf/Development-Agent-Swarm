import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, useTheme } from '@fit-and-fed/design-system';

/**
 * Persistent "Already have an account? Log in" affordance — required by
 * user-flows §0.2 on Profile Setup and EVERY subsequent pre-auth screen
 * through Workout Placement Assessment. Low-emphasis (tertiary Button), jumps
 * straight to Auth with Log In pre-selected WITHOUT discarding the local
 * onboarding draft (the field-level merge on §0.1 reconciles it on login).
 */
export function PreAuthLoginLink() {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ alignItems: 'center', marginTop: theme.spacing.space8 }}>
      <Button
        variant="tertiary"
        label="Already have an account? Log in"
        onPress={() => navigation.navigate('Auth', { mode: 'login' })}
      />
    </View>
  );
}

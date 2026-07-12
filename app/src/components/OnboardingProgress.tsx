import React from 'react';
import { View } from 'react-native';
import { ProgressBar, useTheme } from '@fit-and-fed/design-system';
import { AppText } from '../ui/layout';

/** Top "Step N of M" indicator for the sequential pre-nav flow (reuses DS ProgressBar). */
export function OnboardingProgress({ step, total }: { step: number; total: number }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.space4 }}>
      <AppText variant="micro" color={theme.neutrals.charcoal}>
        Step {step} of {total}
      </AppText>
      <ProgressBar progress={step / total} color={theme.brand.terracotta} />
    </View>
  );
}

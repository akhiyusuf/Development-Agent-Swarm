import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { SAMPLE_TARGETS } from '../../data/sampleData';

/**
 * Onboarding Complete / Welcome Summary — reached only after first-time
 * onboarding (A8). Recaps goal/target, region, and (if opted in) starting
 * workout tier(s). Never shown to an already-onboarded returning user (§0.2).
 *
 * DATA CONTRACT: reads the just-attached account summary
 *   { targets: Targets; region: string; workoutTiers?: { track: string; tier: string }[] }
 * The workout recap section is OMITTED entirely if workout wasn't opted in /
 * placement was fully deferred (A8 empty state) — not shown empty.
 */
export function OnboardingCompleteScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Screen>
      <AppText variant="display" color={theme.brand.terracotta}>
        You're all set
      </AppText>
      <AppText variant="body" color={theme.neutrals.charcoal}>
        Everything is saved to your account. Here's your starting point.
      </AppText>

      <Card>
        <AppText variant="h3">Daily target</AppText>
        <Row style={{ justifyContent: 'space-around', marginTop: theme.spacing.space12 }}>
          <ProgressRing progress={1} color={theme.macro.calories} label="Calories" valueText={`${SAMPLE_TARGETS.kcal}`} size={80} />
          <ProgressRing progress={1} color={theme.macro.protein} label="Protein" valueText={`${SAMPLE_TARGETS.protein_g}g`} size={80} />
          <ProgressRing progress={1} color={theme.macro.carbs} label="Carbs" valueText={`${SAMPLE_TARGETS.carbs_g}g`} size={80} />
        </Row>
      </Card>

      <Card>
        <AppText variant="h3">Region</AppText>
        <AppText variant="body">Nigeria — household-unit portions on</AppText>
      </Card>

      <Card>
        <AppText variant="h3">Workout start</AppText>
        <AppText variant="body">Calisthenics · Tier 2 &nbsp;·&nbsp; Pilates · Basic Mat</AppText>
      </Card>

      <Button
        label="Go to Home"
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] })}
      />
    </Screen>
  );
}

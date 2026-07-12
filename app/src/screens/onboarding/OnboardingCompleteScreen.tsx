import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { useAppState } from '../../state/AppStateContext';
import { PILATES_TIERS } from '../../data/skillTree';

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
  const { targets, region, moduleInterest, placement } = useAppState();

  const showWorkout = moduleInterest.trainWorkout && (placement.calisthenics.status === 'done' || placement.pilates.status === 'done');
  const pilatesTierName = placement.pilates.startingTier
    ? PILATES_TIERS.find((t) => t.tier === placement.pilates.startingTier)?.name ?? `Tier ${placement.pilates.startingTier}`
    : null;

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
          <ProgressRing progress={1} color={theme.macro.calories} label="Calories" valueText={`${targets.kcal}`} size={80} />
          <ProgressRing progress={1} color={theme.macro.protein} label="Protein" valueText={`${targets.protein_g}g`} size={80} />
          <ProgressRing progress={1} color={theme.macro.carbs} label="Carbs" valueText={`${targets.carbs_g}g`} size={80} />
        </Row>
      </Card>

      <Card>
        <AppText variant="h3">Region</AppText>
        <AppText variant="body">{region.market} — household-unit portions on</AppText>
      </Card>

      {/* Workout recap OMITTED entirely if not opted in / fully deferred (A8 empty state). */}
      {showWorkout ? (
        <Card>
          <AppText variant="h3">Workout start</AppText>
          <AppText variant="body">
            {placement.calisthenics.status === 'done' ? `Calisthenics · Tier ${placement.calisthenics.startingTier}` : null}
            {placement.calisthenics.status === 'done' && placement.pilates.status === 'done' ? ' ··· ' : ''}
            {placement.pilates.status === 'done' ? `Pilates · ${pilatesTierName}` : null}
          </AppText>
        </Card>
      ) : null}

      <Button
        label="Go to Home"
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] })}
      />
    </Screen>
  );
}

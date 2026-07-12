import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import type { PlacementContext, RootParamList } from '../../navigation/types';

/**
 * Shared Starting-Tier Placement result (A7d/A7f). Presents the computed
 * starting tier GENERICALLY (a tier position, not an asserted named skill), with
 * an explainer that it adjusts as attempts are logged.
 *
 * DATA CONTRACT: reads `{ startingTier: number }` computed locally from the
 * self-report answers. Continue is context-aware: in onboarding it routes back to
 * Track Selection to complete or defer the other track; in the post-auth A9
 * deferred-placement flow (`context === 'account'`) it returns to Skill Tree Home
 * — never back into onboarding (per user-flows.md A9 join). Retake discards this
 * result and re-enters this track's steps from step 1 (A3 back-out rule).
 *
 * Dual-context: the §0.2 "Already have an account? Log in" affordance renders
 * only in the pre-auth onboarding context (route param `context` absent or
 * `'onboarding'`), NOT when reached post-auth via A9 (`'account'`). Retake
 * threads the current context back into the steps route.
 */
export function PlacementResultBody({
  trackName,
  startingTier,
  stepsRoute,
}: {
  trackName: string;
  startingTier: number;
  stepsRoute: keyof RootParamList;
}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const context = (route.params as { context?: PlacementContext } | undefined)?.context;
  const isPreAuth = context !== 'account';

  return (
    <Screen>
      <AppText variant="h1">{trackName} placement</AppText>
      <Card>
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          You'll start around
        </AppText>
        <AppText variant="display" color={theme.brand.terracotta}>
          Tier {startingTier}
        </AppText>
        <AppText variant="body" color={theme.neutrals.charcoal}>
          This is a starting point, not a ceiling. As you log attempts and clear mastery gates, your
          position moves automatically.
        </AppText>
      </Card>

      <Button
        label="Continue"
        onPress={() =>
          context === 'account'
            ? navigation.navigate('SkillTreeHome')
            : navigation.navigate('TrackSelection')
        }
      />
      <Button variant="tertiary" label="Retake" onPress={() => (navigation.navigate as (screen: string, params?: object) => void)(stepsRoute, { context })} />
      {isPreAuth ? <PreAuthLoginLink /> : null}
    </Screen>
  );
}

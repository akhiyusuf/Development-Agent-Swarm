import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import type { PlacementContext } from '../../navigation/types';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';

/**
 * Combined Assessment Summary — shown only when BOTH tracks were completed (A3).
 * Recaps both starting placements generically before continuing to Auth.
 *
 * DATA CONTRACT: reads `{ calisthenicsTier: number; pilatesTier: number }`.
 * "Adjust a placement" routes back to that track's result in a review mode that
 * never recomputes/overwrites the stored tier (only an explicit Retake mutates).
 *
 * Dual-context: the §0.2 "Already have an account? Log in" affordance renders
 * only in the pre-auth onboarding context (route param `context` absent or
 * `'onboarding'`), NOT when reached post-auth via A9 (`'account'`).
 */
export function CombinedSummaryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { placement } = useAppState();
  const context = (route.params as { context?: PlacementContext } | undefined)?.context;
  const isPreAuth = context !== 'account';

  return (
    <Screen>
      <AppText variant="h1">You're placed</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Here's where each track starts. You can fine-tune either later from the Skill Tree.
      </AppText>

      <Card>
        <AppText variant="h3">Calisthenics</AppText>
        <AppText variant="h2" color={theme.brand.terracotta}>
          Tier {placement.calisthenics.startingTier ?? 1}
        </AppText>
      </Card>

      <Card>
        <AppText variant="h3">Pilates</AppText>
        <AppText variant="h2" color={theme.brand.terracotta}>
          Tier {placement.pilates.startingTier ?? 1}
        </AppText>
      </Card>

      <Button
        label="Continue"
        onPress={() => {
          dispatch({ type: 'SET_ONBOARDING_STEP', step: 'Auth' });
          navigation.navigate('Auth', { mode: 'signup' });
        }}
      />
      <Button variant="tertiary" label="Adjust calisthenics placement" onPress={() => navigation.navigate('CalisthenicsPlacementResult')} />
      <Button variant="tertiary" label="Adjust Pilates placement" onPress={() => navigation.navigate('PilatesPlacementResult')} />
      {isPreAuth ? <PreAuthLoginLink /> : null}
    </Screen>
  );
}

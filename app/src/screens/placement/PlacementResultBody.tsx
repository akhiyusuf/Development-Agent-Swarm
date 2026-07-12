import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import type { RootParamList } from '../../navigation/types';

/**
 * Shared Starting-Tier Placement result (A7d/A7f). Presents the computed
 * starting tier GENERICALLY (a tier position, not an asserted named skill), with
 * an explainer that it adjusts as attempts are logged.
 *
 * DATA CONTRACT: reads `{ startingTier: number }` computed locally from the
 * self-report answers. Continue routes back to Track Selection to complete or
 * defer the other track; Retake discards this result and re-enters this track's
 * steps from step 1 (A3 back-out rule).
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

      <Button label="Continue" onPress={() => navigation.navigate('TrackSelection')} />
      <Button variant="tertiary" label="Retake" onPress={() => navigation.navigate(stepsRoute as never)} />
    </Screen>
  );
}

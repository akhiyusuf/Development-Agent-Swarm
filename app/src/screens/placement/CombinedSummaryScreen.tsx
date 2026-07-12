import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';

/**
 * Combined Assessment Summary — shown only when BOTH tracks were completed (A3).
 * Recaps both starting placements generically before continuing to Auth.
 *
 * DATA CONTRACT: reads `{ calisthenicsTier: number; pilatesTier: number }`.
 * "Adjust a placement" routes back to that track's result in a review mode that
 * never recomputes/overwrites the stored tier (only an explicit Retake mutates).
 */
export function CombinedSummaryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Screen>
      <AppText variant="h1">You're placed</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Here's where each track starts. You can fine-tune either later from the Skill Tree.
      </AppText>

      <Card>
        <AppText variant="h3">Calisthenics</AppText>
        <AppText variant="h2" color={theme.brand.terracotta}>
          Tier 2
        </AppText>
      </Card>

      <Card>
        <AppText variant="h3">Pilates</AppText>
        <AppText variant="h2" color={theme.brand.terracotta}>
          Tier 1 · Basic Mat
        </AppText>
      </Card>

      <Button label="Continue" onPress={() => navigation.navigate('Auth', { mode: 'signup' })} />
      <Button variant="tertiary" label="Adjust calisthenics placement" onPress={() => navigation.navigate('CalisthenicsPlacementResult')} />
      <Button variant="tertiary" label="Adjust Pilates placement" onPress={() => navigation.navigate('PilatesPlacementResult')} />
    </Screen>
  );
}

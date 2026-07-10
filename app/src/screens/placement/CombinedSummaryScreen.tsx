import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** A7g. Combined Assessment Summary — shown only if both tracks were completed. */
export function CombinedSummaryScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const returnTo = route.params?.returnTo ?? 'Welcome';
  const { state } = useAppState();
  const { calisthenics, pilates } = state.placement;

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">You're all placed</Text>
      <Card>
        <Text variant="h3" colorToken={color.primary.deepgreen}>
          Calisthenics
        </Text>
        <Text variant="body">Starting Tier {calisthenics.startingTier}</Text>
      </Card>
      <Card>
        <Text variant="h3" colorToken={color.primary.terracotta}>
          Pilates
        </Text>
        <Text variant="body">Starting Tier {pilates.startingTier}</Text>
      </Card>
      <Button label="Continue" onPress={() => nav.navigate(returnTo)} />
      <Button
        label="Adjust a placement"
        variant="tertiary"
        onPress={() => nav.navigate('PlacementResult', { track: 'calisthenics', returnTo, yesCount: 1, totalSteps: 1 })}
      />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}

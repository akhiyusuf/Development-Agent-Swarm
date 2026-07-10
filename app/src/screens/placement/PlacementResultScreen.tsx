import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/**
 * A7d / A7f. Placement Results → Starting Tier Placement. Generic tier
 * number only — no invented skill name or asserted progression content.
 */
export function PlacementResultScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { track, returnTo, yesCount, totalSteps } = route.params;
  const { state, dispatch } = useAppState();

  // Placeholder structural placement logic — TBD by validated content per
  // research Open Question 1. More "yes" answers -> a higher starting tier.
  const startingTier = Math.max(1, Math.min(3, 1 + Math.floor((yesCount / totalSteps) * 2)));

  useEffect(() => {
    dispatch({ type: 'SET_PLACEMENT', track, payload: { status: 'done', startingTier } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const otherTrack = track === 'calisthenics' ? 'pilates' : 'calisthenics';
  const otherStatus = state.placement[otherTrack as 'calisthenics' | 'pilates'].status;

  const onContinue = () => {
    if (otherStatus === 'not_started') {
      nav.navigate('TrackSelection', { returnTo });
    } else if (otherStatus === 'done') {
      nav.navigate('CombinedSummary', { returnTo });
    } else {
      nav.navigate(returnTo);
    }
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">{track === 'calisthenics' ? 'Calisthenics' : 'Pilates'} starting placement</Text>
      <Card>
        <Text variant="h2" colorToken={color.primary.deepgreen}>
          You'll start at Tier {startingTier}
        </Text>
        <Text variant="caption" colorToken={color.neutral.warmgray700} style={{ marginTop: 8 }}>
          This is a starting point only — it adjusts as you log attempts against real skill nodes.
        </Text>
      </Card>
      <Button label="Continue" onPress={onContinue} />
      <Button label="Retake" variant="secondary" onPress={() => nav.navigate('PlacementSteps', { track, returnTo })} />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}

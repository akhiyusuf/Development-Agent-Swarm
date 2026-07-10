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
 *
 * `review` mode (entered from A7g Combined Summary's "Adjust a placement"):
 * displays the track's ALREADY-STORED result read from `state.placement`
 * and never dispatches `SET_PLACEMENT` — it must not fabricate a new result
 * or silently overwrite the user's real starting tier (a bug the previous
 * build had: it hardcoded `{ track: 'calisthenics', yesCount: 1, totalSteps:
 * 1 }` regardless of which track the user wanted to review). In review mode,
 * the only way to actually change the stored placement is the explicit
 * "Retake" action, which re-runs that track's real assessment steps.
 */
export function PlacementResultScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { track, returnTo, yesCount, totalSteps, review } = route.params;
  const { state, dispatch } = useAppState();

  // Placeholder structural placement logic — TBD by validated content per
  // research Open Question 1. More "yes" answers -> a higher starting tier.
  const computedTier = !review ? Math.max(1, Math.min(3, 1 + Math.floor((yesCount / totalSteps) * 2))) : undefined;
  const storedTier = state.placement[track as 'calisthenics' | 'pilates'].startingTier ?? 1;
  const startingTier = review ? storedTier : computedTier!;

  useEffect(() => {
    if (review) return; // review mode is read-only: never dispatches SET_PLACEMENT
    dispatch({ type: 'SET_PLACEMENT', track, payload: { status: 'done', startingTier: computedTier! } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const otherTrack = track === 'calisthenics' ? 'pilates' : 'calisthenics';
  const otherStatus = state.placement[otherTrack as 'calisthenics' | 'pilates'].status;

  const onContinue = () => {
    if (review) {
      // Return to the Combined Summary the user came from to adjust this
      // placement, preserving its own onward `returnTo` — never jump
      // straight to the outer destination, and never touch stored state.
      nav.navigate('CombinedSummary', { returnTo });
      return;
    }
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
      {review ? (
        <Text variant="caption" colorToken={color.neutral.warmgray700}>
          Reviewing your current placement — nothing changes unless you retake this track's steps.
        </Text>
      ) : null}
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

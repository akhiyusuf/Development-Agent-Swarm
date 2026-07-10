import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** A7b. Track Selection (for placement) — either order, either can be deferred. */
export function TrackSelectionScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const returnTo = route.params?.returnTo ?? 'Welcome';
  const { state, dispatch } = useAppState();

  const cal = state.placement.calisthenics.status;
  const pil = state.placement.pilates.status;
  const bothResolved = cal !== 'not_started' && pil !== 'not_started';

  const startTrack = (track: 'calisthenics' | 'pilates') => {
    nav.navigate('PlacementSteps', { track, returnTo });
  };

  const deferRemaining = () => {
    if (cal === 'not_started') dispatch({ type: 'SET_PLACEMENT', track: 'calisthenics', payload: { status: 'deferred' } });
    if (pil === 'not_started') dispatch({ type: 'SET_PLACEMENT', track: 'pilates', payload: { status: 'deferred' } });
    nav.navigate(returnTo);
  };

  const goContinue = () => {
    if (cal !== 'not_started' && pil !== 'not_started') {
      if (cal === 'done' && pil === 'done') {
        nav.navigate('CombinedSummary', { returnTo });
      } else {
        nav.navigate(returnTo);
      }
    }
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">Choose a track</Text>
      <Text variant="body">Do one now, the other later, or both back to back — your call.</Text>
      <TrackCard label="Calisthenics placement" status={cal} onPress={() => startTrack('calisthenics')} />
      <TrackCard label="Pilates placement" status={pil} onPress={() => startTrack('pilates')} />
      <Button label="Continue" onPress={goContinue} state={bothResolved ? 'default' : 'disabled'} />
      <Button label="Do the other later" variant="secondary" onPress={deferRemaining} />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}

function TrackCard({ label, status, onPress }: { label: string; status: string; onPress: () => void }) {
  const doneIcon = status === 'done';
  return (
    <Card onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[12] }}>
        <Ionicons
          name={doneIcon ? 'checkmark-circle' : status === 'deferred' ? 'time-outline' : 'ellipse-outline'}
          size={22}
          color={doneIcon ? color.semantic.success : status === 'deferred' ? color.semantic.warning : color.neutral.warmgray700}
        />
        <View style={{ flex: 1 }}>
          <Text variant="h3">{label}</Text>
          <Text variant="caption" colorToken={color.neutral.warmgray700}>
            {doneIcon ? 'Completed' : status === 'deferred' ? 'Deferred' : 'Not started'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

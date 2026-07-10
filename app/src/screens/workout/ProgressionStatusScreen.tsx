import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { StatusBadge, BadgeTone } from '../../components/StatusBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { nodesForTrack } from '../../data/skillTree';
import type { Track } from '../../data/skillTree';

const STATE_TONE: Record<string, BadgeTone> = {
  locked: 'neutral',
  unlocked: 'info',
  inprogress: 'info',
  completed: 'success',
  mastered: 'warning',
};

/** W6. Progression Status — per skill line, current/next, across both tracks. */
export function ProgressionStatusScreen() {
  const nav = useNavigation<any>();
  const { state } = useAppState();

  const renderTrack = (track: Track) => {
    const nodes = nodesForTrack(track);
    const current = nodes.find((n) => {
      const s = state.nodeStates[n.id] ?? n.defaultState;
      return s === 'unlocked' || s === 'inprogress';
    });
    const next = nodes.find((n) => (state.nodeStates[n.id] ?? n.defaultState) === 'locked');

    return (
      <Card key={track} onPress={() => nav.navigate('TierNodeMap', { track })}>
        <Text variant="h3">{track === 'calisthenics' ? 'Calisthenics' : 'Pilates'}</Text>
        <View style={{ marginTop: space[8], gap: space[4] }}>
          <Text variant="body">
            Now: {current ? current.name : 'All available nodes cleared'}
          </Text>
          {current ? <StatusBadge tone={STATE_TONE[state.nodeStates[current.id] ?? current.defaultState]} label={state.nodeStates[current.id] ?? current.defaultState} /> : null}
          <Text variant="body" style={{ marginTop: space[8] }}>
            Next: {next ? `${next.name} (gate: ${next.thresholdLabel})` : 'None — track complete'}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">Progression</Text>
      {renderTrack('calisthenics')}
      {renderTrack('pilates')}
    </ScreenContainer>
  );
}

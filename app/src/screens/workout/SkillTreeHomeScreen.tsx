import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { nodesForTrack } from '../../data/skillTree';
import type { Track } from '../../data/skillTree';

/**
 * W1. Skill Tree Home — track selector + deferred-placement re-entry
 * (carry-forward #3). Renders on the dark-bg node-map background per
 * carry-forward #7.
 */
export function SkillTreeHomeScreen() {
  const nav = useNavigation<any>();
  const { state } = useAppState();
  const [view, setView] = useState<'calisthenics' | 'pilates' | 'combined'>('combined');

  const renderTrackCard = (track: Track) => {
    const placement = state.placement[track];
    const nodes = nodesForTrack(track);
    const masteredCount = nodes.filter((n) => state.nodeStates[n.id] === 'mastered').length;

    if (placement.status !== 'done') {
      return (
        <Card key={track} forceDark>
          <Text variant="h3" colorToken={color.neutral.white}>
            {track === 'calisthenics' ? 'Calisthenics' : 'Pilates'}
          </Text>
          <Text variant="caption" colorToken="#C9C6BE">
            {placement.status === 'deferred' ? 'Placement deferred' : 'Placement not started'}
          </Text>
          <Button
            label="Complete placement"
            onPress={() =>
              nav.navigate('AssessmentIntro', { returnTo: 'SkillTreeHome', forceTrack: track })
            }
            style={{ marginTop: space[8] }}
          />
        </Card>
      );
    }

    return (
      <Card key={track} forceDark onPress={() => nav.navigate('TierNodeMap', { track })}>
        <Text variant="h3" colorToken={color.neutral.white}>
          {track === 'calisthenics' ? 'Calisthenics' : 'Pilates'}
        </Text>
        <Text variant="caption" colorToken="#C9C6BE">
          Starting Tier {placement.startingTier} · {masteredCount} node(s) mastered
        </Text>
        <Button label="Continue" variant="secondary" onPress={() => nav.navigate('TierNodeMap', { track })} style={{ marginTop: space[8] }} />
      </Card>
    );
  };

  return (
    <ScreenContainer density="relaxed" forceDark>
      <Text variant="h1" colorToken={color.neutral.white}>
        Skill Tree
      </Text>
      <SegmentedControl
        options={[
          { value: 'calisthenics', label: 'Calisthenics' },
          { value: 'pilates', label: 'Pilates' },
          { value: 'combined', label: 'Combined' },
        ]}
        value={view}
        onChange={(v) => setView(v as any)}
      />
      <View style={{ gap: space[16] }}>
        {view === 'combined' ? (
          <>
            {renderTrackCard('calisthenics')}
            {renderTrackCard('pilates')}
          </>
        ) : (
          renderTrackCard(view)
        )}
      </View>
    </ScreenContainer>
  );
}

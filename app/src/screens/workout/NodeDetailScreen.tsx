import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { NodeStateBadge } from '../../components/NodeStateBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getNodeDef } from '../../data/skillTree';

/**
 * W3. Node Detail — reached only for unlocked/in-progress/completed/mastered
 * nodes (carry-forward #5). `[Skill Node]` placeholder name, TBD threshold.
 */
export function NodeDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { nodeId } = route.params;
  const { state } = useAppState();
  const def = getNodeDef(nodeId);
  if (!def) return null;
  const nodeState = state.nodeStates[nodeId] ?? def.defaultState;

  const prereqNames = def.prerequisiteIds.map((id) => getNodeDef(id)?.name ?? id);

  return (
    <ScreenContainer density="relaxed" forceDark>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="h2" colorToken={color.neutral.white}>
          {def.name}
        </Text>
        <NodeStateBadge state={nodeState} />
      </View>

      {prereqNames.length > 0 ? (
        <Card forceDark>
          <Text variant="h3" colorToken={color.neutral.white}>
            Prerequisite(s)
          </Text>
          {prereqNames.map((n) => (
            <Text key={n} variant="body" colorToken="#C9C6BE">
              • {n}
            </Text>
          ))}
        </Card>
      ) : null}

      <Card forceDark>
        <Text variant="h3" colorToken={color.neutral.white}>
          Unlock requirement
        </Text>
        <Text variant="body" colorToken="#C9C6BE">
          {def.gateType === 'reps' ? 'Rep threshold' : 'Time-hold threshold'}: {def.thresholdLabel} (value pending
          validated content — see docs/screens.md carry-forward #1)
        </Text>
      </Card>

      <Card forceDark>
        <Text variant="h3" colorToken={color.neutral.white}>
          Form cues
        </Text>
        {def.formCues.map((cue, i) => (
          <Text key={i} variant="caption" colorToken="#C9C6BE" style={{ marginTop: 4 }}>
            {cue}
          </Text>
        ))}
      </Card>

      {nodeState === 'inprogress' ? (
        <Card forceDark>
          <Text variant="body" colorToken={color.neutral.white}>
            Progress toward gate
          </Text>
          <ProgressBar progress={0.5} fillColor={color.node.inprogress} trackColor={color.neutral.darkBorder} />
        </Card>
      ) : null}

      <Button label="Log attempt" onPress={() => nav.navigate('LogAttempt', { nodeId })} />
      <Button label="Back to map" variant="secondary" onPress={() => nav.goBack()} />
      {(nodeState === 'completed' || nodeState === 'mastered') && (
        <Button label="View progression" variant="tertiary" onPress={() => nav.navigate('ProgressionStatus')} />
      )}
    </ScreenContainer>
  );
}

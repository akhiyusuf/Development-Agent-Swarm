import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { SkillNode } from '../../components/SkillNode';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { nodesForTrack } from '../../data/skillTree';
import type { Track } from '../../data/skillTree';

/**
 * W2. Tier / Node Map — visual tree per track. Locked nodes are fully
 * non-interactive (carry-forward #5); dark-bg per carry-forward #7.
 */
export function TierNodeMapScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const track: Track = route.params.track;
  const { state } = useAppState();
  const nodes = nodesForTrack(track);
  const tiers = Array.from(new Set(nodes.map((n) => n.tier))).sort();

  return (
    <ScreenContainer density="relaxed" forceDark>
      <Text variant="h1" colorToken={color.neutral.white}>
        {track === 'calisthenics' ? 'Calisthenics' : 'Pilates'} tree
      </Text>
      {tiers.map((tier) => (
        <View key={tier} style={{ gap: space[12] }}>
          <Text variant="h3" colorToken="#C9C6BE">
            Tier {tier}
          </Text>
          <View style={styles.row}>
            {nodes
              .filter((n) => n.tier === tier)
              .map((n) => {
                const nodeState = state.nodeStates[n.id] ?? n.defaultState;
                return (
                  <SkillNode
                    key={n.id}
                    name={n.name}
                    state={nodeState}
                    isBoss={n.isBoss}
                    onPress={() => nav.navigate('NodeDetail', { nodeId: n.id })}
                  />
                );
              })}
          </View>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[16] },
});

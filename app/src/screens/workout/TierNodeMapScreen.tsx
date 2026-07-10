import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { SkillNode } from '../../components/SkillNode';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { nodesForTrack, getNodeDef } from '../../data/skillTree';
import type { Track } from '../../data/skillTree';

/**
 * W2. Tier / Node Map — visual tree per track. Locked nodes are fully
 * non-interactive (carry-forward #5); dark-bg per carry-forward #7.
 *
 * Prerequisite information (Req 8 / docs/screens.md W2): each locked node
 * shows a static, non-interactive caption naming its prerequisite node(s), so
 * a user can see what unlocks it without needing to tap in (locked nodes
 * can't be tapped at all). Full prerequisite edge-lines between nodes were
 * not additionally drawn in this build — the caption is the chosen
 * lightweight alternative the spec allows ("and/or simple prerequisite edge
 * lines"); see BUILD_NOTES.md.
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
                const locked = nodeState === 'locked';
                const prereqNames = n.prerequisiteIds.map((id) => getNodeDef(id)?.name ?? id);
                return (
                  <View key={n.id} style={styles.nodeCol}>
                    <SkillNode
                      name={n.name}
                      state={nodeState}
                      isBoss={n.isBoss}
                      onPress={() => nav.navigate('NodeDetail', { nodeId: n.id })}
                    />
                    {locked && prereqNames.length > 0 ? (
                      <Text variant="micro" colorToken={color.neutral.warmgray700} center style={styles.prereqCaption}>
                        Requires: {prereqNames.join(', ')}
                      </Text>
                    ) : null}
                  </View>
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
  nodeCol: { alignItems: 'center', width: 96 },
  prereqCaption: { marginTop: 2, width: 96 },
});

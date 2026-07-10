import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../theme/tokens';
import { Text } from './Typography';
import { NODE_STATE_META } from './SkillNode';
import type { NodeState } from '../data/skillTree';

interface Props {
  state: NodeState;
}

/**
 * Node-state chip using the §1.4 fixed gamification/node-state vocabulary —
 * never a `semantic.*` tone (see `StatusBadge`, which is for app-wide
 * success/error/warning/info meanings only, not skill-tree state).
 * docs/screens.md W3 requires "a state chip using the §1.4 node color +
 * icon/label for its current state"; this reuses the exact color/icon/label
 * mapping `SkillNode.tsx` uses for the tree map itself, so the map and any
 * detail/status screen can never drift out of sync or fall back to a
 * semantic tone (e.g. "Mastered" rendering in `semantic.warning` orange).
 */
export function NodeStateBadge({ state }: Props) {
  const meta = NODE_STATE_META[state];
  return (
    <View style={[styles.badge, { borderColor: meta.color }]}>
      <Ionicons name={meta.icon} size={14} color={meta.color} />
      <Text variant="micro" colorToken={meta.color}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
});

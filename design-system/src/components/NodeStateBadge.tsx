import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { NODE_STATE_META, NodeState } from './SkillNode';

export type NodeStateBadgeProps = {
  state: NodeState;
};

/**
 * Small inline chip rendering a node's state via the fixed gamification
 * vocabulary (color + icon + label) — used on Node Detail / Progression
 * Status screens where the full SkillNode graphic is unnecessary. Must never
 * be re-skinned with semantic/StatusBadge colors — the node vocabulary is
 * exclusive to node state (see tokens.ts assertion).
 */
export function NodeStateBadge({ state }: NodeStateBadgeProps) {
  const theme = useTheme();
  const meta = NODE_STATE_META[state];
  const color = theme.node[state];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '26', // ~15% tint background
          borderRadius: theme.radii.sm,
          paddingHorizontal: theme.spacing.space12,
          paddingVertical: theme.spacing.space8,
        },
      ]}
    >
      <Ionicons name={meta.icon} size={14} color={color} />
      <Text style={{ fontSize: theme.type.micro.fontSize, fontWeight: theme.type.micro.fontWeight, color, marginLeft: theme.spacing.space4 }}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

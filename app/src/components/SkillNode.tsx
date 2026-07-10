import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, space, touchTarget } from '../theme/tokens';
import { Text } from './Typography';
import type { NodeState } from '../data/skillTree';

interface Props {
  name: string;
  state: NodeState;
  isBoss?: boolean;
  onPress?: () => void;
  syncWarning?: boolean;
}

/**
 * §1.4 fixed node-state color + icon/label vocabulary. Exported so any other
 * screen that needs to represent node state (Node Detail W3, Progression
 * Status W6, etc.) uses this exact mapping instead of re-deriving one from
 * `semantic.*` tones — node state must never render in a semantic color
 * (docs/screens.md W3; design-system §1.4's "reserved exclusively for
 * node/skill state" rule).
 */
export const NODE_STATE_META: Record<NodeState, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  locked: { color: color.node.locked, icon: 'lock-closed', label: 'Locked' },
  unlocked: { color: color.node.unlocked, icon: 'ellipse-outline', label: 'Unlocked' },
  inprogress: { color: color.node.inprogress, icon: 'sync-outline', label: 'In progress' },
  completed: { color: color.node.completed, icon: 'checkmark-circle', label: 'Completed' },
  mastered: { color: color.node.mastered, icon: 'star', label: 'Mastered' },
};
const STATE_META = NODE_STATE_META;

/**
 * §4.7 Skill-tree node. Locked nodes are fully non-interactive per carry-forward
 * #5 in docs/screens.md — no onPress is ever wired for a locked node regardless
 * of what's passed in, preserving the §1.4/§6.10 WCAG 1.4.11 inactive-component
 * exemption for that state.
 */
export function SkillNode({ name, state, isBoss, onPress, syncWarning }: Props) {
  const meta = STATE_META[state];
  const locked = state === 'locked';
  const baseSize = isBoss ? 84 : 56;
  const size = Math.max(baseSize, touchTarget);

  const circle = (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: state === 'mastered' ? meta.color : locked ? meta.color : 'transparent',
          borderWidth: state === 'mastered' ? 3 : 2,
          borderColor: state === 'mastered' ? color.node.unlocked : meta.color,
          opacity: locked ? 0.6 : 1,
        },
      ]}
    >
      <Ionicons
        name={meta.icon}
        size={isBoss ? 32 : 22}
        color={state === 'mastered' || locked ? color.neutral.white : meta.color}
      />
      {syncWarning ? (
        <View style={styles.warningDot}>
          <Ionicons name="warning" size={12} color={color.semantic.warning} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={locked ? undefined : onPress}
        disabled={locked}
        accessibilityRole={locked ? undefined : 'button'}
        accessibilityLabel={`${name}, ${meta.label}`}
        accessibilityState={{ disabled: locked }}
        style={styles.hitArea}
      >
        {circle}
      </Pressable>
      <Text variant="micro" style={{ maxWidth: 88 }} center colorToken={locked ? color.neutral.warmgray700 : undefined}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space[4], width: 96 },
  hitArea: { alignItems: 'center', justifyContent: 'center', minWidth: touchTarget, minHeight: touchTarget },
  circle: { alignItems: 'center', justifyContent: 'center' },
  warningDot: { position: 'absolute', top: -2, right: -2 },
});

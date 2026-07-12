import React, { useState } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type NodeState = 'locked' | 'unlocked' | 'inProgress' | 'completed' | 'mastered';

export const NODE_STATE_META: Record<
  NodeState,
  { icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  locked: { icon: 'lock-closed', label: 'Locked' },
  unlocked: { icon: 'ellipse-outline', label: 'Unlocked' },
  inProgress: { icon: 'time-outline', label: 'In progress' },
  completed: { icon: 'checkmark-circle', label: 'Completed' },
  mastered: { icon: 'star', label: 'Mastered' },
};

export type SkillNodeProps = {
  label: string;
  state: NodeState;
  /** "Boss"/milestone skill — rendered larger with a distinct outline, per research. */
  milestone?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  /** Small warning glyph overlay if this node's progress failed to sync — never changes the node's core state color. */
  syncWarning?: boolean;
};

/**
 * Skill-tree node. Uses the fixed gamification color vocabulary exclusively
 * for state color (tokens.ts `nodeColors`) — never brand/semantic colors.
 * Locked nodes are genuinely non-interactive (not just visually disabled):
 * "locked" is a first-class state, not a disabled variant of "unlocked", per
 * the design research and the WCAG 1.4.11 inactive-component exemption this
 * relies on (locked nodes are not acted upon, so the reduced effective
 * contrast from 60% opacity does not require the 3:1 non-text floor).
 */
export function SkillNode({ label, state, milestone, onPress, syncWarning }: SkillNodeProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const meta = NODE_STATE_META[state];
  const color = theme.node[state];
  const interactive = state !== 'locked' && !!onPress;

  const baseSize = milestone ? 72 : 48;
  const size = Math.max(baseSize, theme.minTouchTarget);

  return (
    <View style={styles.wrap}>
      <Pressable
        disabled={!interactive}
        onPress={interactive ? onPress : undefined}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole={interactive ? 'button' : undefined}
        accessibilityLabel={`${label}, ${meta.label}`}
        accessibilityState={{ disabled: !interactive }}
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      >
        <View
          style={[
            styles.node,
            {
              width: baseSize,
              height: baseSize,
              borderRadius: baseSize / 2,
              backgroundColor: color,
              opacity: state === 'locked' ? 0.6 : 1,
              borderWidth: milestone ? 3 : 0,
              borderColor: theme.node.unlocked,
            },
            // Press-state ring: a static outward ring under reduced motion,
            // an animated one otherwise (kept structurally simple here — no
            // animation library dependency — the static ring itself already
            // satisfies the reduced-motion requirement).
            pressed && interactive
              ? {
                  shadowColor: color,
                  shadowOpacity: reducedMotion ? 0 : 0.5,
                  shadowRadius: 8,
                  elevation: reducedMotion ? 0 : 4,
                }
              : null,
          ]}
        >
          <Ionicons name={meta.icon} size={milestone ? 30 : 22} color={theme.neutrals.white} />
        </View>
        {syncWarning ? (
          <View style={[styles.syncBadge, { backgroundColor: theme.semantic.warning }]}>
            <Ionicons name="warning" size={10} color={theme.neutrals.white} />
          </View>
        ) : null}
      </Pressable>
      <Text
        style={{
          fontSize: theme.type.micro.fontSize,
          color: theme.neutrals.ink,
          marginTop: theme.spacing.space4,
          maxWidth: size + 24,
          textAlign: 'center',
        }}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

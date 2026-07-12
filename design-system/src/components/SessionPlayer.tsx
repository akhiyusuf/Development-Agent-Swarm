import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { clampedTypeMaxScale } from '../theme/tokens';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fireHaptic } from '../hooks/useHapticFeedback';
import { ProgressBar } from './ProgressBar';
import { NodeStateBadge } from './NodeStateBadge';
import { NodeState } from './SkillNode';
import { ToggleSwitch } from './ToggleSwitch';

export type SessionPlayerPreset = 'calisthenics' | 'pilates';
export type SessionPlayerPhase = 'active' | 'rest' | 'complete';

export type SessionPlayerSummary = {
  headline: string; // calisthenics: achievement-toned; pilates: reflective
  detail: string;
  unlockedNode?: { label: string; state: NodeState };
};

export type SessionPlayerProps = {
  preset: SessionPlayerPreset;
  phase: SessionPlayerPhase;
  /** Dominant numeral — rep count or hold/rest/countdown timer, rendered in type.timerXl. */
  timerLabel: string;
  /** Exercise name / cue text, secondary to the timer. */
  subLabel?: string;
  /** 0-1, Pilates-only single-focus progress indicator. */
  progress?: number;
  onPrimaryAction?: () => void; // calisthenics: manual rep increment. pilates: play/pause.
  primaryActionLabel?: string;
  onSkipRest?: () => void; // calisthenics rest-state only
  onAddTime?: () => void; // calisthenics rest-state only
  autoAdvance?: boolean; // pilates only
  onToggleAutoAdvance?: (value: boolean) => void; // pilates only
  summary?: SessionPlayerSummary;
};

/**
 * Shared session-player shell — ONE component with two tonal-flex presets
 * (calisthenics: dark, high-contrast, achievement-driven; Pilates: light,
 * calm, audio-led), per the design research's explicit requirement that this
 * be "shared components with mode-specific styling," not two player UIs.
 *
 * Cognitive-load rule enforced structurally: exactly one dominant
 * timer/counter element is rendered at a time, in every phase, in both
 * presets — no dashboard-density UI is permitted here regardless of mode.
 */
export function SessionPlayer(props: SessionPlayerProps) {
  const { preset, phase } = props;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const celebrationOpacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (phase === 'complete' || phase === 'rest') {
      fireHaptic(phase === 'complete' ? 'success' : 'light');
    }
    if (phase === 'complete') {
      if (reducedMotion) {
        celebrationOpacity.setValue(1);
      } else {
        celebrationOpacity.setValue(0);
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: theme.motion.celebrationMs,
          useNativeDriver: true,
        }).start();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isCalisthenics = preset === 'calisthenics';

  // Calisthenics is always dark, regardless of app-wide light/dark preference.
  // Pilates is always light/muted, even if the user has app-wide dark mode on.
  // Both are intentional per the research's tonal-flex requirement.
  const bg = isCalisthenics ? '#17181A' : theme.neutrals.background;
  const timerColor = isCalisthenics ? theme.neutrals.white : theme.neutrals.charcoal;
  const secondaryColor = isCalisthenics ? '#C9C0B2' : theme.neutrals.charcoal;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: insets.top + theme.spacing.space24,
          paddingBottom: Math.max(insets.bottom, theme.spacing.space24),
          paddingHorizontal: theme.spacing.space24,
        },
      ]}
    >
      {phase === 'complete' && props.summary ? (
        <Animated.View style={[styles.center, { opacity: celebrationOpacity }]}>
          <Text
            style={{
              fontSize: theme.type.display.fontSize,
              fontWeight: theme.type.display.fontWeight,
              color: timerColor,
              textAlign: 'center',
            }}
            maxFontSizeMultiplier={clampedTypeMaxScale}
          >
            {props.summary.headline}
          </Text>
          <Text
            style={{
              fontSize: theme.type.body.fontSize,
              color: secondaryColor,
              textAlign: 'center',
              marginTop: theme.spacing.space16,
            }}
          >
            {props.summary.detail}
          </Text>
          {props.summary.unlockedNode ? (
            <View style={{ marginTop: theme.spacing.space24, alignItems: 'center' }}>
              <NodeStateBadge state={props.summary.unlockedNode.state} />
              <Text style={{ color: secondaryColor, marginTop: theme.spacing.space8, fontSize: theme.type.caption.fontSize }}>
                {props.summary.unlockedNode.label}
              </Text>
            </View>
          ) : null}
        </Animated.View>
      ) : (
        <View style={styles.center}>
          {props.subLabel ? (
            <Text style={{ fontSize: theme.type.h3.fontSize, color: secondaryColor, marginBottom: theme.spacing.space16 }}>
              {phase === 'rest' ? 'Rest' : props.subLabel}
            </Text>
          ) : null}

          <Text
            style={{
              fontSize: theme.type.timerXl.fontSize,
              fontWeight: theme.type.timerXl.fontWeight,
              color: timerColor,
            }}
            accessibilityLabel={`Timer: ${props.timerLabel}`}
            maxFontSizeMultiplier={clampedTypeMaxScale}
          >
            {props.timerLabel}
          </Text>

          {!isCalisthenics && props.progress !== undefined ? (
            <View style={{ width: '80%', marginTop: theme.spacing.space24 }}>
              <ProgressBar progress={props.progress} color={theme.brand.goldMuted} />
            </View>
          ) : null}

          {isCalisthenics && phase === 'active' ? (
            <Pressable
              onPress={props.onPrimaryAction}
              accessibilityRole="button"
              accessibilityLabel={props.primaryActionLabel ?? 'Log rep'}
              style={({ pressed }) => [
                styles.repTarget,
                {
                  backgroundColor: pressed ? theme.brand.terracottaDark : theme.brand.terracotta,
                  marginTop: theme.spacing.space32,
                },
              ]}
            >
              <Ionicons name="add" size={40} color={theme.neutrals.white} />
            </Pressable>
          ) : null}

          {isCalisthenics && phase === 'rest' ? (
            <View style={[styles.row, { marginTop: theme.spacing.space32, gap: theme.spacing.space16 }]}>
              <Pressable
                onPress={props.onSkipRest}
                accessibilityLabel="Skip rest"
                style={[styles.secondaryControl, { minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, backgroundColor: '#232427' }]}
              >
                <Text style={{ color: theme.neutrals.white, fontSize: theme.type.caption.fontSize }}>Skip</Text>
              </Pressable>
              <Pressable
                onPress={props.onAddTime}
                accessibilityLabel="Add 15 seconds"
                style={[styles.secondaryControl, { minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, backgroundColor: '#232427' }]}
              >
                <Text style={{ color: theme.neutrals.white, fontSize: theme.type.caption.fontSize }}>+15s</Text>
              </Pressable>
            </View>
          ) : null}

          {!isCalisthenics && phase === 'active' ? (
            <View style={{ marginTop: theme.spacing.space32, alignItems: 'center' }}>
              <View style={[styles.row, { gap: theme.spacing.space24 }]}>
                <Pressable
                  onPress={props.onPrimaryAction}
                  accessibilityLabel={props.primaryActionLabel ?? 'Play or pause'}
                  style={[styles.secondaryControl, { minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, backgroundColor: theme.neutrals.surface }]}
                >
                  <Ionicons name="play" size={22} color={theme.neutrals.ink} />
                </Pressable>
                <Pressable
                  onPress={props.onSkipRest}
                  accessibilityLabel="Skip to next movement"
                  style={[styles.secondaryControl, { minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, backgroundColor: theme.neutrals.surface }]}
                >
                  <Ionicons name="play-skip-forward" size={22} color={theme.neutrals.ink} />
                </Pressable>
              </View>
              <View style={{ marginTop: theme.spacing.space16 }}>
                <ToggleSwitch
                  value={!!props.autoAdvance}
                  onChange={(v) => props.onToggleAutoAdvance?.(v)}
                  label="Auto-advance"
                />
              </View>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repTarget: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  secondaryControl: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});

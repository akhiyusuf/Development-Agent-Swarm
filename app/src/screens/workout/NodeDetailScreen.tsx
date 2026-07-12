import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, NodeStateBadge, ProgressBar, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import {
  PILATES_TIERS,
  confidenceLabel,
  describeThreshold,
  findNode,
} from '../../data/skillTree';
import { useAppState } from '../../state/AppStateContext';
import { useNodeStateResolver } from '../../state/selectors';
import type { RootParamList } from '../../navigation/types';

/**
 * Node Detail (W3) — name, status, prerequisites, unlock requirement, form cues
 * (Req 6, 7, 10). Reached only for actionable (non-locked) nodes (C1).
 *
 * DATA CONTRACT: `{ nodeId }` resolves a calisthenics node OR a Pilates tier.
 * The unlock requirement + confidence come straight from the cited dataset;
 * copy surfaces the confidence so users aren't misled that a synthesized gate
 * is certified (data-sourcing.md #7). Log Attempt commits against this node.
 */
export function NodeDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootParamList, 'NodeDetail'>>();
  const { nodeId } = route.params;
  const { workoutAttempts } = useAppState();
  const nodeState = useNodeStateResolver();

  const node = findNode(nodeId);
  const tier = PILATES_TIERS.find((t) => t.id === nodeId);
  const state = nodeState(nodeId);
  const attempts = workoutAttempts[nodeId] ?? [];
  const bestAttempt = attempts.reduce((max, a) => (a.value > max ? a.value : max), 0);
  const threshold = node?.threshold ?? tier?.unlockThreshold;
  const targetNumber = threshold && typeof threshold.value === 'number' ? threshold.value : null;
  const progressFraction = targetNumber ? Math.min(1, bestAttempt / targetNumber) : attempts.length > 0 ? 1 : 0;

  if (!node && !tier) {
    return (
      <Screen>
        <AppText variant="h2">Skill not found</AppText>
        <Button label="Back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  // --- Pilates tier ---
  if (tier) {
    return (
      <Screen>
        <AppText variant="h2">{tier.name}</AppText>
        <NodeStateBadge state={state} />
        <Card>
          <Section title="Unlock requirement">
            <AppText variant="body">{describeThreshold(tier.unlockThreshold)}</AppText>
            <StatusBadge tone="info" label={confidenceLabel(tier.unlockThreshold.confidence)} />
          </Section>
        </Card>
        <Section title="Exercises in this tier">
          {tier.exercises.map((ex) => (
            <Card key={ex.id}>
              <AppText variant="bodyEmphasis">{ex.name}</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                {describeThreshold(ex.threshold)} · {confidenceLabel(ex.threshold.confidence)}
              </AppText>
            </Card>
          ))}
        </Section>
        <Button label="Log attempt" onPress={() => navigation.navigate('LogAttempt', { nodeId: tier.id })} />
        <Button variant="tertiary" label="View progression" onPress={() => navigation.navigate('ProgressionStatus')} />
      </Screen>
    );
  }

  // --- Calisthenics node ---
  const n = node!;
  const prereqNames = n.prerequisites.map((p) => findNode(p)?.name).filter(Boolean);

  return (
    <Screen>
      <AppText variant="h2">{n.name}</AppText>
      <NodeStateBadge state={state} />

      <Card>
        <Section title="Unlock requirement">
          <AppText variant="body">{describeThreshold(n.threshold)}</AppText>
          <StatusBadge tone="info" label={confidenceLabel(n.threshold.confidence)} />
        </Section>
      </Card>

      {prereqNames.length > 0 ? (
        <Card>
          <Section title="Prerequisites">
            {prereqNames.map((name) => (
              <AppText key={name} variant="body">
                • {name}
              </AppText>
            ))}
          </Section>
        </Card>
      ) : null}

      {n.threshold.note ? (
        <Card>
          <Section title="Form cue">
            <AppText variant="body" color={theme.neutrals.charcoal}>
              {n.threshold.note}
            </AppText>
          </Section>
        </Card>
      ) : null}

      {state === 'inProgress' ? (
        <Card>
          <Section title="Progress toward gate">
            <ProgressBar progress={progressFraction} color={theme.node.inProgress} />
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              Best logged attempt: {bestAttempt} · {attempts.length} attempt{attempts.length === 1 ? '' : 's'} so far.
            </AppText>
          </Section>
        </Card>
      ) : null}

      <Button label="Log attempt" onPress={() => navigation.navigate('LogAttempt', { nodeId: n.id })} />
      <Button variant="tertiary" label="View progression" onPress={() => navigation.navigate('ProgressionStatus')} />
    </Screen>
  );
}

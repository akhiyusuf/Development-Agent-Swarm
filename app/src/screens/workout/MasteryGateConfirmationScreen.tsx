import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, SkillNode, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { CALISTHENICS_LINES, PILATES_TIERS, findNode } from '../../data/skillTree';
import { useAppState } from '../../state/AppStateContext';
import { computeCalisthenicsNodeStates, computePilatesTierStates, newlyUnlocked } from '../../logic/progression';
import type { RootParamList, TrackId } from '../../navigation/types';

/**
 * Mastery Gate Confirmation (W5) — shown when a logged attempt meets a node's
 * threshold; confirms the unlock of downstream node(s) (Req 7).
 *
 * DATA CONTRACT: `{ nodeId }`. The unlock is already committed by Save Attempt
 * (C2) — this screen is a one-way confirmation, safe to dismiss either way.
 * Uses the fixed node-state vocabulary (a legitimate node-state context).
 * Continue returns to the Node Map reflecting the new states.
 */
export function MasteryGateConfirmationScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootParamList, 'MasteryGateConfirmation'>>();
  const { nodeId } = route.params;
  const { placement, workoutAttempts } = useAppState();

  const node = findNode(nodeId);
  const isPilates = PILATES_TIERS.some((t) => t.id === nodeId);
  const track: TrackId = isPilates ? 'pilates' : 'calisthenics';
  const name = node?.name ?? PILATES_TIERS.find((t) => t.id === nodeId)?.name ?? 'Skill';

  // Compute newly-unlocked nodes by comparing states with vs. without the
  // just-logged attempt (Req 7's "confirms unlock of downstream node(s)").
  const attemptsWithoutLast = {
    ...workoutAttempts,
    [nodeId]: (workoutAttempts[nodeId] ?? []).slice(0, -1),
  };
  const calBefore = computeCalisthenicsNodeStates(placement.calisthenics.startingTier ?? 1, attemptsWithoutLast);
  const calAfter = computeCalisthenicsNodeStates(placement.calisthenics.startingTier ?? 1, workoutAttempts);
  const pilBefore = computePilatesTierStates(placement.pilates.startingTier ?? 1, attemptsWithoutLast);
  const pilAfter = computePilatesTierStates(placement.pilates.startingTier ?? 1, workoutAttempts);
  const unlockedCalIds = newlyUnlocked(calBefore, calAfter);
  const unlockedPilIds = newlyUnlocked(pilBefore, pilAfter);
  const unlocked = [
    ...CALISTHENICS_LINES.flatMap((l) => l.nodes).filter((n) => unlockedCalIds.includes(n.id)),
    ...PILATES_TIERS.filter((t) => unlockedPilIds.includes(t.id)),
  ];

  return (
    <Screen>
      <AppText variant="display" color={theme.node.mastered}>
        Mastered!
      </AppText>
      <AppText variant="body" color={theme.neutrals.charcoal}>
        You cleared the gate for {name}.
      </AppText>

      <Card>
        <Row style={{ justifyContent: 'center' }}>
          <SkillNode label={name} state="mastered" milestone />
        </Row>
      </Card>

      {unlocked.length > 0 ? (
        <Section title="Now unlocked">
          <Card>
            <ScrollableRow>
              {unlocked.map((n) => (
                <SkillNode key={n.id} label={n.name} state="unlocked" />
              ))}
            </ScrollableRow>
          </Card>
        </Section>
      ) : null}

      <Button
        label="Continue"
        onPress={() =>
          // DEVIATION (build fix, logged in BUILD_NOTES.md): same root cause as
          // ConfirmLogScreen's dead "Save to diary" CTA — this screen lives in
          // the RootStack modal group while `TierNodeMap` only exists inside
          // MainTabs' nested WorkoutStack. A bare `navigate('TierNodeMap', ...)`
          // typechecks against the flat RootParamList but silently no-ops at
          // runtime (navigate bubbles up, never down into a sibling's nested
          // stack). Use the explicit nested-navigate form so "Continue"
          // actually returns to the Workout tab's node map with the right track.
          (navigation as unknown as { navigate: (screen: string, params?: object) => void }).navigate('Main', {
            screen: 'WorkoutTab',
            params: { screen: 'TierNodeMap', params: { track } },
          })
        }
      />
    </Screen>
  );
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return <Row style={{ gap: theme.spacing.space24, flexWrap: 'wrap' }}>{children}</Row>;
}

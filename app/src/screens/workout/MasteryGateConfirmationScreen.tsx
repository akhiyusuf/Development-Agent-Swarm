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
          // stack).
          //
          // PASS-2 CORRECTION (logged in BUILD_NOTES.md): the nested-navigate
          // form alone still pushed a DUPLICATE Main/MainTabs instance instead
          // of popping back to the existing one — see the matching, longer
          // explanation in ConfirmLogScreen.tsx. Passing `{ pop: true }` as the
          // 3rd argument makes StackRouter's NAVIGATE handler pop the root
          // stack back to the existing 'Main' route (discarding this and any
          // other modal screens above it) instead of appending a new one, while
          // still applying the nested screen/params so Main -> WorkoutTab ->
          // TierNodeMap resolves via each nested navigator's own
          // `useNavigationBuilder` watching its route's `params.screen`.
          //
          // The SAME bug also recurs one level down inside WorkoutStack
          // itself: this confirmation is normally reached via Node Map ->
          // NodeDetail -> LogAttempt -> (attempt saved) -> this modal, so
          // WorkoutStack's own current route is 'LogAttempt', not
          // 'TierNodeMap' — a bare `{ screen: 'TierNodeMap', params: { track } }`
          // nested target would push a second TierNodeMap (with NodeDetail/
          // LogAttempt left stranded underneath) instead of popping back to
          // the existing one. `useNavigationBuilder`'s nested-params resolver
          // forwards a `pop` field from `route.params.pop` into the re-dispatch
          // it does on itself, so adding `pop: true` alongside `screen` here
          // (not just in the outer `navigate(...)` options) closes that inner
          // instance too. Verified live via Playwright DOM counts across two
          // repeated mastery-gate unlocks: exactly one mounted tab bar, no
          // residual hidden "Now unlocked" screens, and no growth in hidden
          // WorkoutStack screens between the two unlocks.
          (
            navigation as unknown as {
              navigate: (screen: string, params?: object, options?: { pop?: boolean }) => void;
            }
          ).navigate(
            'Main',
            { screen: 'WorkoutTab', params: { screen: 'TierNodeMap', params: { track }, pop: true } },
            { pop: true },
          )
        }
      />
    </Screen>
  );
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return <Row style={{ gap: theme.spacing.space24, flexWrap: 'wrap' }}>{children}</Row>;
}

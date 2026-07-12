/**
 * Progression / mastery-gate engine (Req 6, 7, 8) — pure functions over the
 * real, cited skill-tree content (`data/skillTree.ts`) plus per-user attempt
 * state. No React, no navigation: this is the "objective mastery gate" the
 * product research names as the workout module's actual differentiator, so
 * it is intentionally isolated and unit-testable.
 */
import type { NodeState } from '@fit-and-fed/design-system';
import { CALISTHENICS_LINES, PILATES_TIERS, Threshold } from '../data/skillTree';
import type { AttemptsByNode } from '../state/types';

export type NodeStateMap = Record<string, NodeState>;

/**
 * Whether a single logged value clears a node's threshold. Numeric
 * thresholds (`reps`, `hold_seconds`, `duration_seconds`) require the logged
 * value to meet/exceed the target. Non-numeric thresholds (`compound`,
 * `form_check` — e.g. "30s hold AND 20 push-ups...") can't be evaluated from
 * a single number here; the app treats a logged attempt against them as a
 * self-reported completion, matching the behavior the screens shipped with
 * (LogAttemptScreen's original `meets = targetNumber != null ? ... : true`).
 */
export function evaluateThreshold(threshold: Threshold, rawValue: number): boolean {
  const target = typeof threshold.value === 'number' ? threshold.value : null;
  if (target == null) return true;
  return rawValue >= target;
}

/**
 * Calisthenics node states across all lines. Prerequisites can cross lines
 * (e.g. the muscle-up gate needs `pull-5` AND `dip-4`), so this resolves the
 * whole graph via a fixed-point iteration rather than per-line only.
 *
 * `startingTier` (from the placement assessment, Req 9) sets the baseline:
 * every node at a tier strictly below it is assumed already mastered — that
 * is the entire purpose of placement, to avoid re-gating a beginner-safe
 * starting point behind skills they already have.
 */
export function computeCalisthenicsNodeStates(
  startingTier: number,
  attempts: AttemptsByNode
): NodeStateMap {
  const allNodes = CALISTHENICS_LINES.flatMap((l) => l.nodes);
  const map: NodeStateMap = {};

  for (const n of allNodes) {
    if (n.tier < startingTier) map[n.id] = 'mastered';
  }

  let changed = true;
  let guard = 0;
  while (changed && guard < allNodes.length + 2) {
    changed = false;
    guard += 1;
    for (const n of allNodes) {
      if (map[n.id] === 'mastered') continue;
      const prereqsMet = n.prerequisites.every((p) => map[p] === 'mastered');
      if (!prereqsMet) {
        if (map[n.id] !== 'locked') {
          map[n.id] = 'locked';
          changed = true;
        }
        continue;
      }
      const nodeAttempts = attempts[n.id] ?? [];
      const met = nodeAttempts.some((a) => a.met);
      const next: NodeState = met ? 'mastered' : nodeAttempts.length > 0 ? 'inProgress' : 'unlocked';
      if (map[n.id] !== next) {
        map[n.id] = next;
        changed = true;
      }
    }
  }
  return map;
}

/**
 * Pilates is gated tier-level, not exercise-level (matches the classical
 * curriculum — see data-sourcing.md's Pilates gating-model note). Tiers
 * below the placement's starting tier are baseline `completed`; the current
 * tier is `mastered` once a logged attempt satisfies its `unlockThreshold`,
 * which unlocks the next tier.
 */
export function computePilatesTierStates(
  startingTier: number,
  attempts: AttemptsByNode
): NodeStateMap {
  const map: NodeStateMap = {};
  const ordered = [...PILATES_TIERS].sort((a, b) => a.tier - b.tier);

  let prevCleared = true;
  for (const t of ordered) {
    if (t.tier < startingTier) {
      map[t.id] = 'completed';
      prevCleared = true;
      continue;
    }
    if (!prevCleared) {
      map[t.id] = 'locked';
      continue;
    }
    const tAttempts = attempts[t.id] ?? [];
    const met = tAttempts.some((a) => a.met);
    map[t.id] = met ? 'mastered' : tAttempts.length > 0 ? 'inProgress' : 'unlocked';
    prevCleared = met;
  }
  return map;
}

/** Nodes that go from locked to actionable between two state maps (for the Mastery Gate "Now unlocked" recap). */
export function newlyUnlocked(before: NodeStateMap, after: NodeStateMap): string[] {
  return Object.keys(after).filter((id) => before[id] === 'locked' && after[id] !== 'locked');
}

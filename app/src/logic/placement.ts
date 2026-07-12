/**
 * Placement scoring (Workout Placement Assessment, Req 9).
 *
 * Turns the generic self-report answers (`'none' | 'some' | 'comfortable' |
 * 'skipped'`) collected by PlacementStepsBody into a starting tier on the
 * real skill-tree data (`data/skillTree.ts`), replacing the fixed
 * `startingTier={2}` / `startingTier={1}` placeholders the screens shipped
 * with. Pure and testable — no navigation, no state access.
 */
import type { SelfReportAnswer } from '../state/types';
import { CALISTHENICS_LINES, PILATES_TIERS } from '../data/skillTree';

const ANSWER_SCORE: Record<SelfReportAnswer, number> = {
  comfortable: 2,
  some: 1,
  none: 0,
  skipped: 0,
};

/** Highest tier number present in the calisthenics skill lines (currently 6). */
export const MAX_CALISTHENICS_TIER = Math.max(
  ...CALISTHENICS_LINES.flatMap((l) => l.nodes.map((n) => n.tier))
);

/** Highest tier number present in the Pilates tiers (currently 3). */
export const MAX_PILATES_TIER = Math.max(...PILATES_TIERS.map((t) => t.tier));

/**
 * Maps a set of self-report answers to a starting tier between 1 and
 * `maxTier`. An all-"comfortable" self-report lands at the top tier; an
 * all-"none"/"skipped" self-report starts at tier 1 (never below — everyone
 * gets a genuine starting point, never "locked out" of their own placement).
 */
export function scorePlacement(answers: Record<string, SelfReportAnswer>, maxTier: number): number {
  const keys = Object.keys(answers);
  if (keys.length === 0) return 1;
  const total = keys.reduce((sum, k) => sum + ANSWER_SCORE[answers[k]], 0);
  const avg = total / keys.length; // 0..2
  const fraction = avg / 2; // 0..1
  const tier = 1 + Math.round(fraction * (maxTier - 1));
  return Math.min(maxTier, Math.max(1, tier));
}

export function scoreCalisthenicsPlacement(answers: Record<string, SelfReportAnswer>): number {
  return scorePlacement(answers, MAX_CALISTHENICS_TIER);
}

export function scorePilatesPlacement(answers: Record<string, SelfReportAnswer>): number {
  return scorePlacement(answers, MAX_PILATES_TIER);
}

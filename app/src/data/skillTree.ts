/**
 * Real, cited calisthenics + Pilates progression content — sourced directly
 * from `data/workouts/skill-tree.json` (data-research stage, approved pass 2).
 * These are the REAL node names, prerequisite orderings, and rep/hold
 * thresholds (Convict Conditioning line ordering, convergent muscle-up /
 * pistol / handstand gates, classical Pilates tiering). No `[Skill Node]`
 * placeholders and no ComponentGallery demo strings ("Full planche") are used.
 *
 * IMPORTANT (carried from data-sourcing.md #6/#7): this tree is a well-sourced
 * SYNTHESIS, not a clinically validated program. Screens surface the real
 * names/thresholds but also surface the confidence tag so users are never
 * misled that these gates are certified. Per-user progression STATE is
 * app-builder's job — the `PREVIEW_NODE_STATE` map below is clearly-labeled
 * sample state so the map/detail screens preview realistically.
 *
 * DATA CONTRACT (for app-builder): screens read `TRACKS` (structure) and a
 * `nodeState(nodeId) => NodeState` resolver. Replace `PREVIEW_NODE_STATE` with
 * the real per-user progression store without touching screen JSX.
 */
import rawTree from '../../../data/workouts/skill-tree.json';
import type { NodeState } from '@fit-and-fed/design-system';

export type Threshold = {
  type: 'reps' | 'hold_seconds' | 'duration_seconds' | 'compound' | 'form_check';
  value: number | string;
  sets?: number;
  per?: string;
  confidence: 'high' | 'medium' | 'estimate';
  note?: string;
};

export type SkillNodeData = {
  id: string;
  name: string;
  tier: number;
  prerequisites: string[];
  threshold: Threshold;
  milestone?: boolean;
};

export type SkillLine = {
  id: string;
  name: string;
  sourceSystem: string;
  nodes: SkillNodeData[];
};

export type PilatesExercise = { id: string; name: string; threshold: Threshold };
export type PilatesTier = {
  id: string;
  name: string;
  tier: number;
  prerequisites: string[];
  unlockThreshold: Threshold;
  exercises: PilatesExercise[];
};

type RawTree = {
  tracks: Array<{
    id: string;
    name: string;
    sourceSystem?: string;
    lines?: Array<{ id: string; name: string; sourceSystem: string; nodes: SkillNodeData[] }>;
    tiers?: PilatesTier[];
  }>;
};

const tree = rawTree as RawTree;

export const CALISTHENICS = tree.tracks.find((t) => t.id === 'calisthenics')!;
export const PILATES = tree.tracks.find((t) => t.id === 'pilates')!;

/** Compound-gate nodes (muscle-up, handstand push-up) render as milestone "boss" nodes. */
function markMilestones(nodes: SkillNodeData[]): SkillNodeData[] {
  return nodes.map((n) => ({ ...n, milestone: n.threshold.type === 'compound' }));
}

export const CALISTHENICS_LINES: SkillLine[] = (CALISTHENICS.lines ?? []).map((l) => ({
  ...l,
  nodes: markMilestones(l.nodes),
}));

export const PILATES_TIERS: PilatesTier[] = PILATES.tiers ?? [];

export type TrackId = 'calisthenics' | 'pilates';

/**
 * Clearly-labeled SAMPLE per-user progression state for preview only.
 * Deterministic per line: earliest nodes mastered/completed, then in-progress,
 * then the next unlocked, and everything after it locked. Real state is wired
 * by app-builder (Req 8: per-user progression store).
 */
export const PREVIEW_NODE_STATE: Record<string, NodeState> = (() => {
  const map: Record<string, NodeState> = {};
  const seq: NodeState[] = ['mastered', 'completed', 'inProgress', 'unlocked'];
  for (const line of CALISTHENICS_LINES) {
    const ordered = [...line.nodes].sort((a, b) => a.tier - b.tier);
    ordered.forEach((n, i) => {
      map[n.id] = i < seq.length ? seq[i] : 'locked';
    });
  }
  // Pilates tier nodes: Basic completed, Intermediate in-progress, Advanced locked.
  const pilStates: NodeState[] = ['completed', 'inProgress', 'locked'];
  PILATES_TIERS.forEach((t, i) => {
    map[t.id] = pilStates[i] ?? 'locked';
  });
  return map;
})();

export function nodeState(id: string): NodeState {
  return PREVIEW_NODE_STATE[id] ?? 'locked';
}

/** Human-readable threshold summary, e.g. "3 × 12 reps" or "Hold 30s". */
export function describeThreshold(t: Threshold): string {
  switch (t.type) {
    case 'reps': {
      const per = t.per ? ` per ${t.per}` : '';
      return t.sets ? `${t.sets} × ${t.value} reps${per}` : `${t.value} reps${per}`;
    }
    case 'hold_seconds':
      return `Hold ${t.value}s${t.per ? ` per ${t.per}` : ''}`;
    case 'duration_seconds':
      return `${t.value}s continuous`;
    case 'compound':
      return String(t.value);
    case 'form_check':
      return String(t.value);
    default:
      return String(t.value);
  }
}

export function confidenceLabel(c: Threshold['confidence']): string {
  switch (c) {
    case 'high':
      return 'Convergent across sources';
    case 'medium':
      return 'Ordering sourced; volume generalized';
    case 'estimate':
      return 'Reasoned estimate — unvalidated';
  }
}

/** Find any calisthenics node by id (for Node Detail / Log Attempt routing). */
export function findNode(id: string): SkillNodeData | undefined {
  for (const line of CALISTHENICS_LINES) {
    const n = line.nodes.find((x) => x.id === id);
    if (n) return n;
  }
  return undefined;
}

export function lineForNode(id: string): SkillLine | undefined {
  return CALISTHENICS_LINES.find((l) => l.nodes.some((n) => n.id === id));
}

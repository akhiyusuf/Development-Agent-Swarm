/**
 * Skill-tree seed data — MECHANISM ONLY.
 *
 * Per research/product-research.md Open Question 1 (explicitly unvalidated)
 * and the sitemap's scope note, the *actual* skill names, orderings, and
 * mastery thresholds are NOT real exercise-science content. Every node below
 * is a generic placeholder ("Skill Node A", "Skill Node B", ...) with a
 * `thresholdLabel` of `'TBD'`. Do not treat any of this as real progression
 * content — it exists solely to demonstrate the tier/node/mastery-gate UI
 * mechanism end to end.
 */

export type NodeState = 'locked' | 'unlocked' | 'inprogress' | 'completed' | 'mastered';
export type Track = 'calisthenics' | 'pilates';
export type GateType = 'reps' | 'hold';

export interface SkillNodeDef {
  id: string;
  track: Track;
  tier: number;
  name: string; // placeholder, e.g. "Skill Node A"
  prerequisiteIds: string[];
  gateType: GateType;
  thresholdLabel: 'TBD';
  isBoss?: boolean;
  /** Generic form-cue placeholder copy — no real technique content asserted. */
  formCues: string[];
  /** Seed/default state for a fresh install — mutated per-user at runtime. */
  defaultState: NodeState;
}

const genericFormCues = [
  '[Placeholder form cue] Maintain a neutral, controlled position throughout the movement.',
  '[Placeholder form cue] Breathe steadily; avoid holding your breath under tension.',
  '[Placeholder form cue] Full range of motion counts more than speed — content TBD.',
];

export const SKILL_NODES: SkillNodeDef[] = [
  // --- Calisthenics track ---
  { id: 'cal-a1', track: 'calisthenics', tier: 1, name: 'Skill Node A', prerequisiteIds: [], gateType: 'reps', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'mastered' },
  { id: 'cal-a2', track: 'calisthenics', tier: 1, name: 'Skill Node B', prerequisiteIds: ['cal-a1'], gateType: 'hold', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'completed' },
  { id: 'cal-b1', track: 'calisthenics', tier: 2, name: 'Skill Node C', prerequisiteIds: ['cal-a2'], gateType: 'reps', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'inprogress' },
  { id: 'cal-b2', track: 'calisthenics', tier: 2, name: 'Skill Node D', prerequisiteIds: ['cal-a2'], gateType: 'hold', thresholdLabel: 'TBD', isBoss: true, formCues: genericFormCues, defaultState: 'unlocked' },
  { id: 'cal-c1', track: 'calisthenics', tier: 3, name: 'Skill Node E', prerequisiteIds: ['cal-b1', 'cal-b2'], gateType: 'reps', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'locked' },
  { id: 'cal-c2', track: 'calisthenics', tier: 3, name: 'Skill Node F', prerequisiteIds: ['cal-b2'], gateType: 'hold', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'locked' },

  // --- Pilates track (structurally parallel, materially separate criteria per A7e) ---
  { id: 'pil-a1', track: 'pilates', tier: 1, name: 'Skill Node A', prerequisiteIds: [], gateType: 'hold', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'mastered' },
  { id: 'pil-a2', track: 'pilates', tier: 1, name: 'Skill Node B', prerequisiteIds: ['pil-a1'], gateType: 'reps', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'completed' },
  { id: 'pil-b1', track: 'pilates', tier: 2, name: 'Skill Node C', prerequisiteIds: ['pil-a2'], gateType: 'hold', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'inprogress' },
  { id: 'pil-b2', track: 'pilates', tier: 2, name: 'Skill Node D', prerequisiteIds: ['pil-a2'], gateType: 'reps', thresholdLabel: 'TBD', isBoss: true, formCues: genericFormCues, defaultState: 'unlocked' },
  { id: 'pil-c1', track: 'pilates', tier: 3, name: 'Skill Node E', prerequisiteIds: ['pil-b1', 'pil-b2'], gateType: 'hold', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'locked' },
  { id: 'pil-c2', track: 'pilates', tier: 3, name: 'Skill Node F', prerequisiteIds: ['pil-b2'], gateType: 'reps', thresholdLabel: 'TBD', formCues: genericFormCues, defaultState: 'locked' },
];

export function nodesForTrack(track: Track) {
  return SKILL_NODES.filter((n) => n.track === track).sort((a, b) => a.tier - b.tier);
}

export function getNodeDef(id: string) {
  return SKILL_NODES.find((n) => n.id === id);
}

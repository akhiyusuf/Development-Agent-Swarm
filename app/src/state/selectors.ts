import { useMemo } from 'react';
import type { NodeState } from '@fit-and-fed/design-system';
import { useAppState } from './AppStateContext';
import {
  computeCalisthenicsNodeStates,
  computePilatesTierStates,
  NodeStateMap,
} from '../logic/progression';
import { DayTotals, MicroRow, microRows, totalsForEntries } from '../data/compute';
import type { DiaryEntry } from './types';

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDiaryEntries(date: string): DiaryEntry[] {
  const state = useAppState();
  return state.diary[date] ?? [];
}

export function useDayTotals(date: string): DayTotals {
  const entries = useDiaryEntries(date);
  return useMemo(() => totalsForEntries(entries), [entries]);
}

export function useMicroRows(date: string): MicroRow[] {
  const entries = useDiaryEntries(date);
  return useMemo(() => microRows(entries), [entries]);
}

export function useCalisthenicsStartingTier(): number {
  const state = useAppState();
  return state.placement.calisthenics.startingTier ?? 1;
}

export function usePilatesStartingTier(): number {
  const state = useAppState();
  return state.placement.pilates.startingTier ?? 1;
}

/**
 * Whole-graph node-state maps, computed once per render. Callers should NOT
 * call these inside a `.map()`/loop — call once at component top level (as
 * React hooks require) and then read the returned plain object by id inside
 * loops, e.g. `const state = calStates[node.id] ?? 'locked'`.
 */
export function useCalisthenicsNodeStates(): NodeStateMap {
  const state = useAppState();
  const startingTier = useCalisthenicsStartingTier();
  return useMemo(
    () => computeCalisthenicsNodeStates(startingTier, state.workoutAttempts),
    [startingTier, state.workoutAttempts]
  );
}

export function usePilatesTierStates(): NodeStateMap {
  const state = useAppState();
  const startingTier = usePilatesStartingTier();
  return useMemo(
    () => computePilatesTierStates(startingTier, state.workoutAttempts),
    [startingTier, state.workoutAttempts]
  );
}

/** Combined resolver over both tracks — build once, then call plainly (not a hook) inside loops. */
export function useNodeStateResolver(): (id: string) => NodeState {
  const cal = useCalisthenicsNodeStates();
  const pil = usePilatesTierStates();
  return (id: string) => cal[id] ?? pil[id] ?? 'locked';
}

export function useQueuedCount(): number {
  const state = useAppState();
  return state.syncQueue.length;
}

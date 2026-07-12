/**
 * Clearly-labeled PLACEHOLDER sample state for preview only. Everything here is
 * per-user runtime state (what was logged, when, weight history, sync queue) —
 * genuinely outside `data/`'s content coverage, so it is invented sample data,
 * not dressed-up real content. Food references use REAL ids from foods.json.
 *
 * app-builder replaces this entire module with the real offline-first data
 * layer. Screens only read the shapes below (see each screen's DATA CONTRACT).
 */
import { MealSlot } from '../navigation/types';

export type DiaryEntry = {
  id: string;
  foodId: string;
  slot: MealSlot;
  unitLabel: string;
  quantity: number;
  grams: number;
  kcal: number;
  queued?: boolean; // offline-queued, not yet synced (Req 5 / [CP-OFFLINE])
};

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

/** SAMPLE diary for "today" — real foods, invented log events. */
export const SAMPLE_DIARY: DiaryEntry[] = [
  { id: 'd1', foodId: 'ng-jollof-rice', slot: 'lunch', unitLabel: '1 plate (party-size)', quantity: 1, grams: 350, kcal: 508 },
  { id: 'd2', foodId: 'ke-sukuma-wiki', slot: 'lunch', unitLabel: '1 cup, cooked', quantity: 1, grams: 100, kcal: 54 },
  { id: 'd3', foodId: 'diaspora-egg-boiled', slot: 'breakfast', unitLabel: '1 large egg', quantity: 2, grams: 100, kcal: 155 },
  { id: 'd4', foodId: 'ng-akara', slot: 'breakfast', unitLabel: '1 ball', quantity: 3, grams: 120, kcal: 264, queued: true },
];

/** SAMPLE daily targets (Goal & Target Setup output). */
export const SAMPLE_TARGETS = {
  kcal: 2200,
  protein_g: 130,
  carbs_g: 260,
  fat_g: 70,
};

/** SAMPLE weight history (kg). */
export const SAMPLE_WEIGHTS: { date: string; kg: number }[] = [
  { date: 'Jun 14', kg: 82.5 },
  { date: 'Jun 21', kg: 82.0 },
  { date: 'Jun 28', kg: 81.6 },
  { date: 'Jul 05', kg: 81.1 },
  { date: 'Jul 12', kg: 80.7 },
];

/** SAMPLE calorie-balance trend (kcal consumed vs target). */
export const SAMPLE_CAL_TREND: { label: string; value: number }[] = [
  { label: 'Mon', value: 2100 },
  { label: 'Tue', value: 2350 },
  { label: 'Wed', value: 1980 },
  { label: 'Thu', value: 2240 },
  { label: 'Fri', value: 2050 },
];

/** SAMPLE workout session (freeform log, W7). Real node ids. */
export type SessionRow = { nodeId: string; nodeName: string; result: string };
export const SAMPLE_SESSION_ROWS: SessionRow[] = [
  { nodeId: 'push-5', nodeName: 'Full Push-Up', result: '3 × 12 reps' },
  { nodeId: 'hs-2', nodeName: 'Wall Handstand (extended hold)', result: 'Hold 40s' },
];

/** SAMPLE offline sync queue count (Req 5). */
export const SAMPLE_QUEUED_COUNT = 1;

/** SAMPLE calendar marked days (YYYY-MM-DD) with logged data. */
export const SAMPLE_MARKED_DAYS = new Set<string>([
  '2026-07-06',
  '2026-07-08',
  '2026-07-09',
  '2026-07-11',
  '2026-07-12',
]);

/**
 * Small derived-value helpers used by the summary screens. These operate on
 * the REAL per-100g food data plus real diary entries from the state layer
 * (`app/src/state`) — the math itself is unchanged from what screen-designer
 * shipped, just now fed genuine per-user entries instead of samples.
 */
import { FoodItem, findFoodWithCustom, Micros, REQ4_MICROS, scaleMacros } from './foods';
import type { DiaryEntry } from '../state/types';

export type DayTotals = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

/**
 * `customFoods` MUST be passed by every caller that has state access — it
 * resolves user-entered custom foods alongside the curated dataset so
 * derived totals actually include them (build-review finding, see
 * `findFoodWithCustom` in `./foods`).
 */
export function totalsForEntries(entries: DiaryEntry[], customFoods: FoodItem[] = []): DayTotals {
  return entries.reduce<DayTotals>(
    (acc, e) => {
      const food = findFoodWithCustom(e.foodId, customFoods);
      if (!food) return acc;
      const grams = e.grams * e.quantity;
      const m = scaleMacros(food.per100g, grams);
      acc.kcal += m.kcal;
      acc.protein_g += m.protein_g;
      acc.carbs_g += m.carbs_g;
      acc.fat_g += m.fat_g;
      return acc;
    },
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );
}

/** Reference daily intakes for the six Req-4 micronutrients (adult, generic). */
export const MICRO_TARGETS: Record<string, number> = {
  iron_mg: 18,
  zinc_mg: 11,
  calcium_mg: 1000,
  vitaminA_mcg_RAE: 900,
  folate_mcg: 400,
  vitaminB12_mcg: 2.4,
};

export type MicroRow = {
  key: keyof Micros;
  label: string;
  unit: string;
  /** null => genuine "no data" for the foods logged (Req 4 graceful state). */
  value: number | null;
  target: number;
};

/**
 * Sum the six Req-4 micronutrients across the logged entries. A nutrient stays
 * `null` (not 0) when NONE of the logged foods carry a value for it — the
 * honest "no data" signal Req 4 requires (never a misleading false zero). This
 * is exactly where the dataset's documented B12/zinc/vitA/folate gap surfaces.
 */
export function microRows(entries: DiaryEntry[], customFoods: FoodItem[] = []): MicroRow[] {
  return REQ4_MICROS.map(({ key, label, unit }) => {
    let sum = 0;
    let any = false;
    for (const e of entries) {
      const food: FoodItem | undefined = findFoodWithCustom(e.foodId, customFoods);
      const raw = food?.micronutrients?.[key];
      if (raw != null) {
        any = true;
        sum += raw * ((e.grams * e.quantity) / 100);
      }
    }
    return {
      key,
      label,
      unit,
      value: any ? +sum.toFixed(1) : null,
      target: MICRO_TARGETS[key] ?? 1,
    };
  });
}

/** The six Req-4 micro rows for a single food scaled to a gram weight. */
export function microRowsForFood(food: FoodItem, grams: number): MicroRow[] {
  return REQ4_MICROS.map(({ key, label, unit }) => {
    const raw = food.micronutrients?.[key];
    return {
      key,
      label,
      unit,
      value: raw != null ? +(raw * (grams / 100)).toFixed(1) : null,
      target: MICRO_TARGETS[key] ?? 1,
    };
  });
}

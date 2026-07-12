/**
 * Real, cited food content — sourced directly from `data/nutrition/foods.json`
 * (data-research stage, approved pass 2). This is NOT invented placeholder
 * content: names, regions, per-100g macros, household portions, micronutrients,
 * confidence tags and source citations are the real dataset. app-builder will
 * wire the full 32-food dataset + user diary state; screen-designer samples a
 * real subset here so every nutrition screen previews with genuine content.
 *
 * DATA CONTRACT (for app-builder): screens expect `FoodItem[]` shaped exactly
 * like the objects below (a 1:1 view of foods.json's `foods[]`). Swap this
 * module's `FOODS` for the full parsed dataset without touching any screen JSX.
 */
import { Ionicons } from '@expo/vector-icons';
import rawFoods from '../../../data/nutrition/foods.json';
import type { HouseholdUnit } from '@fit-and-fed/design-system';

export type Confidence = 'direct-fct' | 'usda' | 'academic' | 'compiled-estimate';

export type HouseholdPortion = { unit: string; grams: number };

export type Macros = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
};

/** The six Req-4 nutrients the sitemap builds trend/panel screens on, plus extras. */
export type Micros = {
  iron_mg?: number | null;
  zinc_mg?: number | null;
  calcium_mg?: number | null;
  folate_mcg?: number | null;
  vitaminB12_mcg?: number | null;
  vitaminA_mcg_RAE?: number | null;
  vitaminA_mcg_betaCarotene?: number | null;
  vitaminA_IU?: number | null;
  vitaminC_mg?: number | null;
  sodium_mg?: number | null;
  potassium_mg?: number | null;
};

export type FoodItem = {
  id: string;
  name: string;
  region: string;
  category: string;
  householdPortions: HouseholdPortion[];
  per100g: Macros;
  micronutrients: Micros;
  confidence: Confidence;
  valueSpread?: string;
  source: { name: string; url: string; note?: string };
};

export const FOODS: FoodItem[] = (rawFoods as { foods: FoodItem[] }).foods;

export function findFood(id: string): FoodItem | undefined {
  return FOODS.find((f) => f.id === id);
}

/** Composite prepared dishes route to Composite Meal Detail; the rest to Ingredient Detail. */
export function isComposite(food: FoodItem): boolean {
  return food.category === 'composite-dish';
}

/** Map a household-portion label to an Ionicons glyph for the DS portion picker. */
function iconForUnit(unit: string): keyof typeof Ionicons.glyphMap {
  const u = unit.toLowerCase();
  if (u.includes('cup')) return 'cafe-outline';
  if (u.includes('plate')) return 'restaurant-outline';
  if (u.includes('bowl') || u.includes('ladle')) return 'nutrition-outline';
  if (u.includes('wrap') || u.includes('ball')) return 'ellipse-outline';
  if (u.includes('slice') || u.includes('piece')) return 'layers-outline';
  if (u.includes('skewer') || u.includes('breast') || u.includes('serving')) return 'fast-food-outline';
  if (u.includes('egg')) return 'ellipse-outline';
  if (u.includes('tbsp') || u.includes('medium')) return 'cube-outline';
  return 'restaurant-outline';
}

/** Adapt a food's real household portions into the DS HouseholdUnitPortionPicker shape. */
export function unitsForFood(food: FoodItem): HouseholdUnit[] {
  return food.householdPortions.map((p) => ({
    key: p.unit,
    label: p.unit,
    icon: iconForUnit(p.unit),
  }));
}

export function gramsForUnit(food: FoodItem, unitKey: string | null): number | null {
  const p = food.householdPortions.find((hp) => hp.unit === unitKey);
  return p ? p.grams : null;
}

/** Compute the macro/micro panel for a given gram weight from per-100g values. */
export function scaleMacros(per100g: Macros, grams: number): Macros {
  const f = grams / 100;
  return {
    kcal: Math.round(per100g.kcal * f),
    protein_g: +(per100g.protein_g * f).toFixed(1),
    carbs_g: +(per100g.carbs_g * f).toFixed(1),
    fat_g: +(per100g.fat_g * f).toFixed(1),
    fiber_g: per100g.fiber_g != null ? +(per100g.fiber_g * f).toFixed(1) : undefined,
  };
}

/** The six Req-4 micronutrients, in the sitemap's stated order. */
export const REQ4_MICROS: { key: keyof Micros; label: string; unit: string }[] = [
  { key: 'iron_mg', label: 'Iron', unit: 'mg' },
  { key: 'zinc_mg', label: 'Zinc', unit: 'mg' },
  { key: 'calcium_mg', label: 'Calcium', unit: 'mg' },
  { key: 'vitaminA_mcg_RAE', label: 'Vitamin A', unit: 'µg' },
  { key: 'folate_mcg', label: 'Folate', unit: 'µg' },
  { key: 'vitaminB12_mcg', label: 'Vitamin B12', unit: 'µg' },
];

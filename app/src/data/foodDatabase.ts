/**
 * MOCK / PLACEHOLDER nutrition seed data.
 *
 * This build environment has no access to real FAO/INFOODS, West African Food
 * Composition Table (WAFCT), or Kenya FCT (2018) datasets. The items below are
 * a small, hand-authored set of realistic-sounding Nigerian/Ghanaian/Kenyan
 * dishes and ingredients with PLAUSIBLE macro/micronutrient values invented
 * solely to make the app's nutrition flows navigable end-to-end. Do NOT treat
 * any numeric value here as sourced/accurate nutrition data — a real build
 * would replace this file with a licensed/validated food-composition dataset.
 */

import type { HouseholdUnit } from '../components/PortionUnitPicker';
import type { PhotoReference } from '../components/PortionPhotoReference';
import type { CustomFoodEntry } from '../state/types';

export interface Micronutrients {
  ironMg?: number;
  zincMg?: number;
  calciumMg?: number;
  vitaminAmcg?: number;
  folateMcg?: number;
  b12Mcg?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  region: 'Nigeria' | 'Ghana' | 'Kenya' | 'Diaspora/Western' | 'Custom';
  kind: 'ingredient' | 'composite';
  caloriesPerUnit: number; // per first (default) household unit
  proteinG: number;
  carbsG: number;
  fatG: number;
  micronutrients: Micronutrients; // fields intentionally absent = "no data" (Req 4), never a false zero
  units: HouseholdUnit[];
  photoRefs: PhotoReference[]; // may be empty — tile is then omitted (§4.4)
  recipeNote?: string; // for composite dishes — read-only ingredient breakdown text
}

export const FOOD_DATABASE: FoodItem[] = [
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    region: 'Nigeria',
    kind: 'composite',
    caloriesPerUnit: 420,
    proteinG: 8,
    carbsG: 62,
    fatG: 14,
    micronutrients: { ironMg: 2.1, vitaminAmcg: 180, folateMcg: 35 },
    units: [
      { id: 'ladle', label: '1 ladle', gramsPerUnit: 150, icon: 'restaurant-outline' },
      { id: 'half-plate', label: 'Half plate', gramsPerUnit: 220, icon: 'pie-chart-outline' },
      { id: 'full-plate', label: 'Full plate', gramsPerUnit: 400, icon: 'ellipse-outline' },
    ],
    photoRefs: [
      { id: 'jollof-1', caption: '1 ladle ≈ 150g jollof rice', tone: '#A9761E' },
      { id: 'jollof-2', caption: 'Half plate ≈ 220g', tone: '#C1502E' },
    ],
    recipeNote: 'Rice, tomato-pepper stew base, onion, oil, stock seasoning (recipe-level, mock).',
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup',
    region: 'Nigeria',
    kind: 'composite',
    caloriesPerUnit: 310,
    proteinG: 14,
    carbsG: 9,
    fatG: 24,
    micronutrients: { ironMg: 3.4, zincMg: 2.2, folateMcg: 40 },
    units: [
      { id: 'ladle', label: '1 ladle', gramsPerUnit: 180, icon: 'restaurant-outline' },
      { id: 'bowl', label: '1 bowl', gramsPerUnit: 350, icon: 'cafe-outline' },
    ],
    photoRefs: [{ id: 'egusi-1', caption: '1 ladle ≈ 180g egusi soup', tone: '#1F5C42' }],
    recipeNote: 'Ground melon seed, leafy greens, palm oil, assorted protein (mock composite).',
  },
  {
    id: 'waakye',
    name: 'Waakye',
    region: 'Ghana',
    kind: 'composite',
    caloriesPerUnit: 380,
    proteinG: 11,
    carbsG: 58,
    fatG: 9,
    micronutrients: { ironMg: 2.8, folateMcg: 55 },
    units: [
      { id: 'scoop', label: '1 scoop', gramsPerUnit: 200, icon: 'restaurant-outline' },
      { id: 'half-plate', label: 'Half plate', gramsPerUnit: 250, icon: 'pie-chart-outline' },
    ],
    photoRefs: [{ id: 'waakye-1', caption: '1 scoop ≈ 200g waakye', tone: '#D9A441' }],
    recipeNote: 'Rice and beans cooked with millet-stalk/sorghum leaves (mock).',
  },
  {
    id: 'banku',
    name: 'Banku',
    region: 'Ghana',
    kind: 'ingredient',
    caloriesPerUnit: 190,
    proteinG: 3,
    carbsG: 42,
    fatG: 0.5,
    micronutrients: {},
    units: [
      { id: 'ball', label: '1 ball', gramsPerUnit: 180, icon: 'ellipse-outline' },
      { id: 'half-ball', label: 'Half ball', gramsPerUnit: 90, icon: 'contrast-outline' },
    ],
    photoRefs: [{ id: 'banku-1', caption: '1 ball ≈ 180g banku', tone: '#A9761E' }],
  },
  {
    id: 'ugali',
    name: 'Ugali',
    region: 'Kenya',
    kind: 'ingredient',
    caloriesPerUnit: 230,
    proteinG: 4,
    carbsG: 50,
    fatG: 1,
    micronutrients: { ironMg: 1.1 },
    units: [
      { id: 'slice', label: '1 slice', gramsPerUnit: 120, icon: 'square-outline' },
      { id: 'half-plate', label: 'Half plate', gramsPerUnit: 200, icon: 'pie-chart-outline' },
    ],
    photoRefs: [{ id: 'ugali-1', caption: '1 slice ≈ 120g ugali', tone: '#96391F' }],
  },
  {
    id: 'sukuma-wiki',
    name: 'Sukuma Wiki',
    region: 'Kenya',
    kind: 'composite',
    caloriesPerUnit: 90,
    proteinG: 3,
    carbsG: 8,
    fatG: 5,
    micronutrients: { ironMg: 1.8, vitaminAmcg: 320, calciumMg: 90, folateMcg: 70 },
    units: [
      { id: 'cup', label: '1 cup', gramsPerUnit: 100, icon: 'cafe-outline' },
      { id: 'ladle', label: '1 ladle', gramsPerUnit: 130, icon: 'restaurant-outline' },
    ],
    photoRefs: [{ id: 'sukuma-1', caption: '1 cup ≈ 100g sukuma wiki', tone: '#1F5C42' }],
    recipeNote: 'Collard greens sautéed with onion and tomato (mock).',
  },
  {
    id: 'nyama-choma',
    name: 'Nyama Choma (grilled meat)',
    region: 'Kenya',
    kind: 'ingredient',
    caloriesPerUnit: 260,
    proteinG: 28,
    carbsG: 0,
    fatG: 16,
    micronutrients: { zincMg: 4.8, b12Mcg: 2.1, ironMg: 2.6 },
    units: [
      { id: 'palm-portion', label: '1 palm portion', gramsPerUnit: 120, icon: 'hand-left-outline' },
      { id: 'skewer', label: '1 skewer', gramsPerUnit: 80, icon: 'flame-outline' },
    ],
    photoRefs: [{ id: 'nyama-1', caption: '1 palm portion ≈ 120g', tone: '#96391F' }],
  },
  {
    id: 'chin-chin',
    name: 'Chin Chin (snack)',
    region: 'Nigeria',
    kind: 'ingredient',
    caloriesPerUnit: 140,
    proteinG: 2,
    carbsG: 18,
    fatG: 7,
    micronutrients: {},
    units: [
      { id: 'handful', label: '1 handful', gramsPerUnit: 30, icon: 'hand-left-outline' },
      { id: 'cup', label: '1 cup', gramsPerUnit: 90, icon: 'cafe-outline' },
    ],
    photoRefs: [], // no reference photo yet for this item — tile intentionally omitted (§4.4)
  },
  {
    id: 'swallow-fufu',
    name: 'Fufu (swallow)',
    region: 'Ghana',
    kind: 'ingredient',
    caloriesPerUnit: 210,
    proteinG: 2,
    carbsG: 48,
    fatG: 0.3,
    micronutrients: {},
    units: [
      { id: 'swallow', label: '1 swallow', gramsPerUnit: 160, icon: 'ellipse-outline' },
      { id: 'half-swallow', label: 'Half swallow', gramsPerUnit: 80, icon: 'contrast-outline' },
    ],
    photoRefs: [{ id: 'fufu-1', caption: '1 swallow ≈ 160g fufu', tone: '#C1502E' }],
  },
  {
    id: 'oats-diaspora',
    name: 'Oatmeal (Western/diaspora set)',
    region: 'Diaspora/Western',
    kind: 'ingredient',
    caloriesPerUnit: 150,
    proteinG: 5,
    carbsG: 27,
    fatG: 3,
    micronutrients: { ironMg: 1.5, calciumMg: 20 },
    units: [
      { id: 'cup', label: '1 cup cooked', gramsPerUnit: 240, icon: 'cafe-outline' },
      { id: 'exact', label: 'Advanced only', gramsPerUnit: null, icon: 'scale-outline' },
    ],
    photoRefs: [{ id: 'oats-1', caption: '1 cup cooked ≈ 240g oatmeal', tone: '#A9761E' }],
  },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q) || f.region.toLowerCase().includes(q));
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOOD_DATABASE.find((f) => f.id === id);
}

/**
 * Maps a user-created custom food/meal (`state.customFoods`, saved by N7 —
 * Custom Food / Meal Builder) into the same `FoodItem` shape used by the
 * seed database, so custom foods are first-class throughout Add Entry,
 * Food Detail, and Confirm & Log rather than a save-only dead end. Custom
 * foods have no household-unit set of their own beyond the single unit the
 * user declared, no micronutrient entry (N7 omits that field — see
 * BUILD_NOTES.md), and no portion-photo reference.
 */
export function customFoodToFoodItem(entry: CustomFoodEntry): FoodItem {
  return {
    id: entry.id,
    name: entry.name,
    region: 'Custom',
    kind: 'ingredient',
    caloriesPerUnit: entry.caloriesPerUnit,
    proteinG: entry.proteinG,
    carbsG: entry.carbsG,
    fatG: entry.fatG,
    micronutrients: {},
    units: [{ id: 'custom-unit', label: entry.unitLabel, gramsPerUnit: entry.gramsPerUnit, icon: 'restaurant-outline' }],
    photoRefs: [],
  };
}

/** Searches the seed database plus a user's custom foods together by name. */
export function searchAllFoods(query: string, customFoods: CustomFoodEntry[]): FoodItem[] {
  const q = query.trim().toLowerCase();
  const customMatches = customFoods
    .map(customFoodToFoodItem)
    .filter((f) => !q || f.name.toLowerCase().includes(q));
  return [...customMatches, ...searchFoods(query)];
}

/** Looks up a food by id in the seed database first, then in custom foods. */
export function findFood(id: string, customFoods: CustomFoodEntry[]): FoodItem | undefined {
  return getFoodById(id) ?? customFoods.map(customFoodToFoodItem).find((f) => f.id === id);
}

export const MICRONUTRIENT_LABELS: Record<keyof Micronutrients, { label: string; unit: string }> = {
  ironMg: { label: 'Iron', unit: 'mg' },
  zincMg: { label: 'Zinc', unit: 'mg' },
  calciumMg: { label: 'Calcium', unit: 'mg' },
  vitaminAmcg: { label: 'Vitamin A', unit: 'mcg' },
  folateMcg: { label: 'Folate', unit: 'mcg' },
  b12Mcg: { label: 'Vitamin B12', unit: 'mcg' },
};

// Daily targets — also invented placeholders for demo purposes only.
export const MICRONUTRIENT_TARGETS: Record<keyof Micronutrients, number> = {
  ironMg: 18,
  zincMg: 8,
  calciumMg: 1000,
  vitaminAmcg: 700,
  folateMcg: 400,
  b12Mcg: 2.4,
};

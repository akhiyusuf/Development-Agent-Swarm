/**
 * Static reference constants used across nutrition screens. These are NOT
 * runtime sample/mock data (that concern has moved to the real state layer
 * in `app/src/state/` — diary entries, weights, workout attempts, sync
 * queue, etc. are now sourced from there, not from this module). What
 * remains here is just the fixed meal-slot vocabulary the UI displays.
 */
import { MealSlot } from '../navigation/types';

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

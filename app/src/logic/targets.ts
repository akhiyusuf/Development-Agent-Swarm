/**
 * Calorie / macro target calculation (Goal & Target Setup, Req 3).
 *
 * Pure, testable function per app-builder's instructions — no UI, no state
 * access. Uses the Mifflin-St Jeor equation for BMR (a standard, widely-cited
 * formula), an activity multiplier for TDEE, and a goal-based kcal
 * adjustment.
 *
 * DEVIATION (documented in BUILD_NOTES.md): Mifflin-St Jeor requires age, but
 * Profile Setup's approved data contract (docs/screens.md) only collects
 * name/sex/height/weight/activity/goal — no age field. Rather than silently
 * inventing an age field the approved screen doesn't ask for (which would
 * expand data collection beyond what's disclosed, a compliance concern this
 * pipeline explicitly flags), this uses a documented fixed assumed age of 30
 * (a reasonable adult-population midpoint) so the formula is still a real,
 * cited calculation rather than an arbitrary number. This is a known
 * approximation, not a hidden one.
 */
import type { ActivityLevel, Goal, Profile, Sex, Targets } from '../state/types';

const ASSUMED_AGE = 30;

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const GOAL_ADJUSTMENT_KCAL: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

function bmr(sex: Sex | null, heightCm: number, weightKg: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ASSUMED_AGE;
  if (sex === 'male') return base + 5;
  if (sex === 'female') return base - 161;
  // 'other' / unspecified: average of the male and female offsets, a
  // reasonable neutral fallback rather than defaulting to either sex.
  return base - 78;
}

/** Sane fallback used only when height/weight aren't yet known (pre-fill). */
const FALLBACK: Targets = { kcal: 2000, protein_g: 120, carbs_g: 225, fat_g: 60 };

export function computeTargets(profile: Profile): Targets {
  const { heightCm, weightKg, activity, goal } = profile;
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return FALLBACK;

  const multiplier = ACTIVITY_MULTIPLIER[activity ?? 'sedentary'];
  const tdee = bmr(profile.sex, heightCm, weightKg) * multiplier;
  const adjustment = GOAL_ADJUSTMENT_KCAL[goal ?? 'maintain'];
  const kcal = Math.max(1000, Math.round(tdee + adjustment));

  // Protein: ~1.8g/kg bodyweight (supports both fat-loss retention and gain).
  const protein_g = Math.round(weightKg * 1.8);
  const proteinKcal = protein_g * 4;
  // Fat: 25% of total kcal.
  const fat_g = Math.round((kcal * 0.25) / 9);
  const fatKcal = fat_g * 9;
  // Carbs: remainder.
  const carbs_g = Math.max(0, Math.round((kcal - proteinKcal - fatKcal) / 4));

  return { kcal, protein_g, carbs_g, fat_g };
}

/** Over-aggressive guard shared by Goal Setup and Goal Settings (non-blocking warning). */
export function isAggressiveTarget(kcal: number): boolean {
  return kcal > 0 && (kcal < 1200 || kcal > 4000);
}

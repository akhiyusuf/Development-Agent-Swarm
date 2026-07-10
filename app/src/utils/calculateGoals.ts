import type { Profile } from '../state/types';

const ACTIVITY_MULTIPLIER: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

/**
 * Standard Mifflin-St Jeor BMR + activity-multiplier TDEE estimate, then a
 * simple goal-direction adjustment. This is a generic, widely-published
 * formula (not proprietary nutrition-science content) used only to seed a
 * reasonable default the user can freely override — per A4's "computed or
 * user-adjusted" requirement.
 */
export function computeCalorieTarget(profile: Profile): number {
  const { sex, heightCm, weightKg, activityLevel, goal } = profile;
  if (!heightCm || !weightKg) return 2200;
  const age = 30; // age isn't collected by the approved profile fields; a neutral constant is used
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += sex === 'male' ? 5 : sex === 'female' ? -161 : -78;
  const tdee = bmr * (ACTIVITY_MULTIPLIER[activityLevel ?? 'moderate'] ?? 1.55);
  const adjusted = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 400 : tdee;
  return Math.round(adjusted / 10) * 10;
}

export function computeMacros(calorieTarget: number) {
  // 30% protein / 45% carbs / 25% fat split — a simple default, freely adjustable.
  const proteinG = Math.round((calorieTarget * 0.3) / 4);
  const carbsG = Math.round((calorieTarget * 0.45) / 4);
  const fatG = Math.round((calorieTarget * 0.25) / 9);
  return { proteinG, carbsG, fatG };
}

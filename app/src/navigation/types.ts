import type { TrackId } from '../data/skillTree';
import type { Micros } from '../data/foods';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type { TrackId };

/**
 * One flat param list registered as ReactNavigation's global RootParamList
 * (see the `declare global` block below). Because every screen name across
 * every nested navigator is listed here, `useNavigation()` is typed app-wide
 * and `navigation.navigate('AnyScreen', params)` is type-checked even across
 * navigator boundaries (e.g. Home launching the Nutrition Add-Entry modal).
 */
export type RootParamList = {
  // --- Pre-nav / onboarding (§0.1/§0.2 routing lands here) ---
  Onboarding: undefined;
  Splash: undefined;
  ProfileSetup: undefined;
  GoalSetup: undefined;
  RegionPreference: undefined;
  ModuleInterest: undefined;
  AssessmentIntro: undefined;
  TrackSelection: undefined;
  CalisthenicsPlacementSteps: undefined;
  CalisthenicsPlacementResult: undefined;
  PilatesPlacementSteps: undefined;
  PilatesPlacementResult: undefined;
  CombinedSummary: undefined;
  Auth: { mode?: 'login' | 'signup' } | undefined;
  OnboardingComplete: undefined;

  // --- Tab shell ---
  Main: undefined;
  HomeTab: undefined;
  NutritionTab: undefined;
  WorkoutTab: undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;

  // --- Home ---
  Home: undefined;

  // --- Nutrition tab stack ---
  FoodDiary: undefined;
  DailyNutritionSummary: undefined;
  MicronutrientDetail: { nutrientKey: keyof Micros; label: string; unit: string };
  NutritionHistory: undefined;
  FavoritesRecents: undefined;

  // --- Workout tab stack ---
  SkillTreeHome: undefined;
  TierNodeMap: { track: TrackId };
  NodeDetail: { nodeId: string };
  ProgressionStatus: undefined;
  WorkoutHistory: undefined;

  // --- Progress tab stack ---
  CombinedProgressDashboard: undefined;
  WeightLog: undefined;
  GoalSettings: undefined;

  // --- Profile / Settings tab stack ---
  Profile: undefined;
  AccountSettings: undefined;
  DataSyncSettings: undefined;
  Integrations: undefined;
  RegionLanguageSettings: undefined;
  NotificationsSettings: undefined;
  LegalDisclaimers: undefined;
  HelpSupport: undefined;

  // --- Root modals (transient sheets, [CP-MODAL-BACKOUT]) ---
  AddEntry: { slot?: MealSlot } | undefined;
  IngredientDetail: { foodId: string };
  CompositeMealDetail: { foodId: string };
  PortionReferenceGuide: { foodId: string };
  CustomFoodBuilder: undefined;
  ConfirmLog: { foodId: string; unitLabel?: string; quantity?: number; slot?: MealSlot; customName?: string };
  EditDeleteEntry: { entryId: string };
  LogAttempt: { nodeId: string };
  MasteryGateConfirmation: { nodeId: string };
  WorkoutSessionLog: undefined;
  QuickAddWeight: undefined;
};

// Module-scope alias so the global augmentation below doesn't recursively
// reference the interface it is declaring (both are named RootParamList).
type GlobalNavParamList = RootParamList;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends GlobalNavParamList {}
  }
}

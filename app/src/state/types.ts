/**
 * Core domain state types for the Fit & Fed app-state layer.
 *
 * This is genuinely per-user RUNTIME state (profile answers, diary entries,
 * weight log, workout attempts, sync queue, settings) — it is NOT content, so
 * it is intentionally separate from the real, cited data in `data/foods.ts`
 * and `data/skillTree.ts`. There is no real backend in this build (see
 * BUILD_NOTES.md): the app is local-first and persists to AsyncStorage.
 * "Account" is modeled as a local auth flag rather than a networked session.
 */
import type { FoodItem, Micros } from '../data/foods';
import type { NodeState } from '@fit-and-fed/design-system';
import type { TrackId, MealSlot, RootParamList } from '../navigation/types';

export type Sex = 'female' | 'male' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Market = 'Nigeria' | 'Ghana' | 'Kenya';

export interface Profile {
  name: string;
  sex: Sex | null;
  heightCm: number | null;
  weightKg: number | null;
  activity: ActivityLevel | null;
  goal: Goal | null;
}

export interface Targets {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface WeightGoal {
  direction: Goal;
  targetKg: number | null;
}

export interface RegionPrefs {
  market: Market;
  diaspora: boolean;
  showGrams: boolean;
  language: 'en' | 'sw' | 'fr';
}

export interface ModuleInterest {
  trackNutrition: true;
  trainWorkout: boolean;
  /** ISO timestamp the one-time blocking injury-liability disclaimer was acknowledged (E7). */
  injuryDisclaimerAckAt: string | null;
}

export type SelfReportAnswer = 'none' | 'some' | 'comfortable' | 'skipped';

export interface PlacementRecord {
  status: 'not-started' | 'done';
  answers: Record<string, SelfReportAnswer>;
  startingTier: number | null;
  completedAt: string | null;
}

export interface PlacementState {
  calisthenics: PlacementRecord;
  pilates: PlacementRecord;
}

export interface DiaryEntry {
  id: string;
  foodId: string;
  slot: MealSlot;
  unitLabel: string;
  quantity: number;
  grams: number;
  kcal: number;
  queued?: boolean; // offline-queued, not yet synced (Req 5 / [CP-OFFLINE])
  loggedAt: string;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  kg: number;
  queued?: boolean;
}

export interface WorkoutAttempt {
  id: string;
  nodeId: string;
  track: TrackId;
  value: number;
  met: boolean;
  loggedAt: string; // ISO
  queued?: boolean;
}

export interface SessionRowRecord {
  nodeId: string;
  nodeName: string;
  result: string;
}

export interface WorkoutSessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  rows: SessionRowRecord[];
  queued?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  /**
   * Survives ordinary Log Out; cleared ONLY by account deletion (or a fresh
   * install) — see Splash's §0.2 three-check router (data contract in
   * SplashScreen.tsx). Drives whether a first-launch-looking device is
   * actually a returning, already-registered user (A7b short-circuit).
   */
  hasAccountHistoryMarker: boolean;
}

export type ConnectionState = 'disconnected' | 'connected' | 'denied';

export interface Settings {
  lowDataMode: boolean;
  notifications: {
    logReminders: boolean;
    streaks: boolean;
    sync: boolean;
    quietHours: boolean;
  };
  integrations: {
    googleFit: ConnectionState;
    appleHealth: ConnectionState;
  };
  legalAcknowledgedAt: string | null;
}

export type SyncQueueKind = 'diary' | 'weight' | 'attempt' | 'session';

export interface SyncQueueItem {
  id: string;
  kind: SyncQueueKind;
  refId: string;
  description: string;
  createdAt: string;
  failed?: boolean;
}

/** Attempts logged per node/tier id, feeding the progression engine (Req 8). */
export type AttemptsByNode = Record<string, WorkoutAttempt[]>;

export interface AppState {
  hydrated: boolean;
  isOnline: boolean;

  /**
   * The next not-yet-completed pre-nav onboarding screen, so Splash can
   * resume an abandoned onboarding draft exactly where it left off (the
   * sitemap's open "pre-auth state handling" question). `null` once the
   * user has signed up/logged in (draft attached) or on a genuine
   * first-launch device that hasn't started onboarding yet.
   */
  onboardingStep: keyof RootParamList | null;

  auth: AuthState;

  profile: Profile;
  targets: Targets;
  weightGoal: WeightGoal;
  region: RegionPrefs;
  moduleInterest: ModuleInterest;
  placement: PlacementState;

  /** Diary entries keyed by YYYY-MM-DD. */
  diary: Record<string, DiaryEntry[]>;
  favorites: string[];
  recents: string[];
  customFoods: FoodItem[];

  weights: WeightEntry[];

  workoutAttempts: AttemptsByNode;
  sessions: WorkoutSessionRecord[];

  syncQueue: SyncQueueItem[];

  settings: Settings;
}

export type { FoodItem, Micros, NodeState };

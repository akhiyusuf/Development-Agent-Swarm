import type { Micronutrients } from '../data/foodDatabase';
import type { NodeState, Track } from '../data/skillTree';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Market = 'Nigeria' | 'Ghana' | 'Kenya';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';
export type GoalDirection = 'lose' | 'maintain' | 'gain';
export type Sex = 'female' | 'male' | 'prefer_not_to_say';
export type PlacementState = 'not_started' | 'deferred' | 'done';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  slot: MealSlot;
  foodId: string;
  foodName: string;
  unitLabel: string;
  quantity: number;
  grams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  micronutrients: Micronutrients;
  queued: boolean;
  syncFailed?: boolean;
}

export interface CustomFoodEntry {
  id: string;
  name: string;
  caloriesPerUnit: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  gramsPerUnit: number;
  unitLabel: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  kg: number;
  queued: boolean;
}

export interface WorkoutAttempt {
  id: string;
  nodeId: string;
  track: Track;
  value: number;
  gateType: 'reps' | 'hold';
  timestamp: string;
  sessionId: string;
  queued: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string;
  track: Track;
  attemptIds: string[];
  note?: string;
  queued: boolean;
}

export interface Profile {
  name: string;
  sex?: Sex;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel;
  goal?: GoalDirection;
}

export interface Goals {
  calorieTarget: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  computed: boolean;
  weightGoalKg?: number;
  pace?: 'gradual' | 'standard' | 'aggressive';
}

export interface RegionPrefs {
  market: Market;
  includeWestern: boolean;
  units: 'metric' | 'imperial';
}

export interface ModuleInterest {
  nutrition: true;
  workout: boolean;
}

export interface PlacementInfo {
  status: PlacementState;
  startingTier?: number;
}

export interface Placement {
  calisthenics: PlacementInfo;
  pilates: PlacementInfo;
}

export interface NotificationSettings {
  logReminders: boolean;
  streakProgress: boolean;
  syncAlerts: boolean;
}

export interface Settings {
  lowDataMode: boolean;
  notifications: NotificationSettings;
  simulateOffline: boolean;
  lastSyncedAt?: string;
}

export interface Integrations {
  googleFit: boolean;
  appleHealth: boolean;
}

export interface AppState {
  hydrated: boolean;
  isAuthenticated: boolean;
  email?: string;
  onboardingComplete: boolean;
  profile: Profile;
  goals: Goals;
  region: RegionPrefs;
  moduleInterest: ModuleInterest;
  placement: Placement;
  nodeStates: Record<string, NodeState>;
  diary: DiaryEntry[];
  favorites: string[];
  recents: string[];
  customFoods: CustomFoodEntry[];
  weightLog: WeightEntry[];
  attempts: WorkoutAttempt[];
  sessions: WorkoutSession[];
  settings: Settings;
  integrations: Integrations;
  legalAcknowledged: boolean;
}

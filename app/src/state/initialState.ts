import { computeTargets } from '../logic/targets';
import type { AppState } from './types';

/**
 * Genuine first-launch state (Splash's A1 branch). No sample/placeholder
 * runtime data — everything below is an empty/default account, matching the
 * app's actual claimed data collection (nothing is pre-populated).
 */
export const DEFAULT_PROFILE: AppState['profile'] = {
  name: '',
  sex: null,
  heightCm: null,
  weightKg: null,
  activity: null,
  goal: null,
};

export const INITIAL_STATE: AppState = {
  hydrated: false,
  isOnline: true,
  onboardingStep: null,

  auth: {
    isAuthenticated: false,
    email: null,
    hasAccountHistoryMarker: false,
  },

  profile: DEFAULT_PROFILE,
  targets: computeTargets(DEFAULT_PROFILE),
  weightGoal: { direction: 'maintain', targetKg: null },
  region: {
    market: 'Nigeria',
    diaspora: false,
    showGrams: true,
    language: 'en',
  },
  moduleInterest: {
    trackNutrition: true,
    trainWorkout: false,
    injuryDisclaimerAckAt: null,
  },
  placement: {
    calisthenics: { status: 'not-started', answers: {}, startingTier: null, completedAt: null },
    pilates: { status: 'not-started', answers: {}, startingTier: null, completedAt: null },
  },

  diary: {},
  favorites: [],
  recents: [],
  customFoods: [],

  weights: [],

  workoutAttempts: {},
  sessions: [],

  syncQueue: [],

  settings: {
    lowDataMode: false,
    notifications: {
      logReminders: true,
      streaks: true,
      sync: false,
      quietHours: false,
    },
    integrations: {
      googleFit: 'disconnected',
      appleHealth: 'disconnected',
    },
    legalAcknowledgedAt: null,
  },
};

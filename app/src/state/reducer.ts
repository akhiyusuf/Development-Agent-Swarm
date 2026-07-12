import { computeTargets } from '../logic/targets';
import { INITIAL_STATE } from './initialState';
import type {
  AppState,
  ConnectionState,
  DiaryEntry,
  FoodItem,
  PlacementRecord,
  Profile,
  RegionPrefs,
  SelfReportAnswer,
  SessionRowRecord,
  Settings,
  SyncQueueItem,
  Targets,
  WeightEntry,
  WeightGoal,
  WorkoutAttempt,
  WorkoutSessionRecord,
} from './types';
import type { RootParamList, TrackId } from '../navigation/types';

export type Action =
  | { type: 'HYDRATE'; state: Partial<AppState> }
  | { type: 'SET_ONLINE'; isOnline: boolean }
  | { type: 'SET_ONBOARDING_STEP'; step: keyof RootParamList | null }
  // --- Auth / account lifecycle ---
  | { type: 'SIGN_UP'; email: string }
  | { type: 'LOG_IN'; email: string }
  | { type: 'LOG_OUT' }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'DELETE_ACCOUNT' }
  // --- Profile / targets / region / module interest ---
  | { type: 'SET_PROFILE'; profile: Partial<Profile> }
  | { type: 'SET_TARGETS'; targets: Targets }
  | { type: 'RECOMPUTE_TARGETS' }
  | { type: 'SET_WEIGHT_GOAL'; weightGoal: WeightGoal }
  | { type: 'SET_REGION'; region: Partial<RegionPrefs> }
  | { type: 'SET_MODULE_INTEREST'; trainWorkout: boolean }
  | { type: 'ACK_INJURY_DISCLAIMER' }
  // --- Placement ---
  | { type: 'SET_PLACEMENT_ANSWERS'; track: TrackId; answers: Record<string, SelfReportAnswer>; startingTier: number }
  | { type: 'RESET_PLACEMENT'; track: TrackId }
  // --- Nutrition ---
  | { type: 'ADD_DIARY_ENTRY'; date: string; entry: Omit<DiaryEntry, 'id' | 'loggedAt'> }
  | { type: 'UPDATE_DIARY_ENTRY'; date: string; entryId: string; changes: Partial<DiaryEntry> }
  | { type: 'DELETE_DIARY_ENTRY'; date: string; entryId: string }
  | { type: 'ADD_CUSTOM_FOOD'; food: FoodItem }
  | { type: 'TOGGLE_FAVORITE'; foodId: string }
  | { type: 'ADD_RECENT'; foodId: string }
  // --- Weight ---
  | { type: 'ADD_WEIGHT'; kg: number; date: string }
  | { type: 'DELETE_WEIGHT'; id: string }
  // --- Workout ---
  | { type: 'LOG_ATTEMPT'; nodeId: string; track: TrackId; value: number; met: boolean }
  | { type: 'SAVE_SESSION'; rows: SessionRowRecord[]; date: string }
  // --- Sync ---
  | { type: 'SYNC_NOW' }
  | { type: 'RETRY_SYNC_ITEM'; id: string }
  // --- Settings ---
  | { type: 'SET_LOW_DATA_MODE'; value: boolean }
  | { type: 'SET_NOTIFICATIONS'; notifications: Partial<Settings['notifications']> }
  | { type: 'SET_INTEGRATION'; provider: 'googleFit' | 'appleHealth'; state: ConnectionState }
  | { type: 'ACK_LEGAL' };

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyPlacement(): PlacementRecord {
  return { status: 'not-started', answers: {}, startingTier: null, completedAt: null };
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.state, hydrated: true };

    case 'SET_ONLINE':
      return { ...state, isOnline: action.isOnline };

    case 'SET_ONBOARDING_STEP':
      return { ...state, onboardingStep: action.step };

    // --- Auth / account lifecycle ---
    // NOTE (see BUILD_NOTES.md): this build has no real backend. "Sign up" /
    // "log in" are modeled as local auth-flag transitions over the same
    // on-device state rather than a networked session + server-side merge —
    // the onboarding draft and the "account" are the same local record.
    case 'SIGN_UP':
      return {
        ...state,
        auth: { isAuthenticated: true, email: action.email, hasAccountHistoryMarker: true },
        onboardingStep: null,
      };

    case 'LOG_IN':
      return {
        ...state,
        auth: { ...state.auth, isAuthenticated: true, email: action.email },
        onboardingStep: null,
      };

    case 'SET_EMAIL':
      return { ...state, auth: { ...state.auth, email: action.email } };

    case 'LOG_OUT':
      // Ordinary log-out preserves local data + the account-history marker
      // (§0.2) — only Delete Account purges everything.
      return { ...state, auth: { ...state.auth, isAuthenticated: false } };

    case 'DELETE_ACCOUNT':
      // App Store/Play compliance: a real, in-app account+data deletion, not
      // a "contact support" stub. Resets to a genuine pristine first-launch
      // state, including clearing the account-history marker.
      return { ...INITIAL_STATE, hydrated: true, isOnline: state.isOnline };

    // --- Profile / targets / region / module interest ---
    case 'SET_PROFILE': {
      const profile = { ...state.profile, ...action.profile };
      return { ...state, profile, targets: computeTargets(profile) };
    }

    case 'SET_TARGETS':
      return { ...state, targets: action.targets };

    case 'RECOMPUTE_TARGETS':
      return { ...state, targets: computeTargets(state.profile) };

    case 'SET_WEIGHT_GOAL':
      return { ...state, weightGoal: action.weightGoal };

    case 'SET_REGION':
      return { ...state, region: { ...state.region, ...action.region } };

    case 'SET_MODULE_INTEREST':
      // The injury-liability ack is a one-time record (E7) — it is not reset
      // just because the user toggles workout interest off and back on.
      return {
        ...state,
        moduleInterest: { ...state.moduleInterest, trainWorkout: action.trainWorkout },
      };

    case 'ACK_INJURY_DISCLAIMER':
      return {
        ...state,
        moduleInterest: { ...state.moduleInterest, injuryDisclaimerAckAt: new Date().toISOString() },
      };

    // --- Placement ---
    case 'SET_PLACEMENT_ANSWERS': {
      const record: PlacementRecord = {
        status: 'done',
        answers: action.answers,
        startingTier: action.startingTier,
        completedAt: new Date().toISOString(),
      };
      return { ...state, placement: { ...state.placement, [action.track]: record } };
    }

    case 'RESET_PLACEMENT':
      return { ...state, placement: { ...state.placement, [action.track]: emptyPlacement() } };

    // --- Nutrition ---
    case 'ADD_DIARY_ENTRY': {
      const entry: DiaryEntry = {
        ...action.entry,
        id: uid('entry'),
        loggedAt: new Date().toISOString(),
        queued: !state.isOnline,
      };
      const dayEntries = [...(state.diary[action.date] ?? []), entry];
      const queueAdd: SyncQueueItem[] = entry.queued
        ? [
            {
              id: uid('sync'),
              kind: 'diary',
              refId: entry.id,
              description: `${entry.quantity} × ${entry.unitLabel} (${entry.slot})`,
              createdAt: entry.loggedAt,
            },
          ]
        : [];
      return {
        ...state,
        diary: { ...state.diary, [action.date]: dayEntries },
        recents: [entry.foodId, ...state.recents.filter((id) => id !== entry.foodId)].slice(0, 10),
        syncQueue: [...state.syncQueue, ...queueAdd],
      };
    }

    case 'UPDATE_DIARY_ENTRY': {
      const dayEntries = (state.diary[action.date] ?? []).map((e) =>
        e.id === action.entryId ? { ...e, ...action.changes } : e
      );
      return { ...state, diary: { ...state.diary, [action.date]: dayEntries } };
    }

    case 'DELETE_DIARY_ENTRY': {
      const dayEntries = (state.diary[action.date] ?? []).filter((e) => e.id !== action.entryId);
      return { ...state, diary: { ...state.diary, [action.date]: dayEntries } };
    }

    case 'ADD_CUSTOM_FOOD':
      return { ...state, customFoods: [...state.customFoods, action.food] };

    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.foodId);
      return {
        ...state,
        favorites: isFav ? state.favorites.filter((id) => id !== action.foodId) : [...state.favorites, action.foodId],
      };
    }

    case 'ADD_RECENT':
      return { ...state, recents: [action.foodId, ...state.recents.filter((id) => id !== action.foodId)].slice(0, 10) };

    // --- Weight ---
    case 'ADD_WEIGHT': {
      const entry: WeightEntry = { id: uid('weight'), date: action.date, kg: action.kg, queued: !state.isOnline };
      const queueAdd: SyncQueueItem[] = entry.queued
        ? [{ id: uid('sync'), kind: 'weight', refId: entry.id, description: `${entry.kg} kg`, createdAt: new Date().toISOString() }]
        : [];
      return { ...state, weights: [...state.weights, entry], syncQueue: [...state.syncQueue, ...queueAdd] };
    }

    case 'DELETE_WEIGHT':
      return { ...state, weights: state.weights.filter((w) => w.id !== action.id) };

    // --- Workout ---
    case 'LOG_ATTEMPT': {
      const attempt: WorkoutAttempt = {
        id: uid('attempt'),
        nodeId: action.nodeId,
        track: action.track,
        value: action.value,
        met: action.met,
        loggedAt: new Date().toISOString(),
        queued: !state.isOnline,
      };
      const nodeAttempts = [...(state.workoutAttempts[action.nodeId] ?? []), attempt];
      const queueAdd: SyncQueueItem[] = attempt.queued
        ? [{ id: uid('sync'), kind: 'attempt', refId: attempt.id, description: `Attempt on ${action.nodeId}`, createdAt: attempt.loggedAt }]
        : [];
      return {
        ...state,
        workoutAttempts: { ...state.workoutAttempts, [action.nodeId]: nodeAttempts },
        syncQueue: [...state.syncQueue, ...queueAdd],
      };
    }

    case 'SAVE_SESSION': {
      const session: WorkoutSessionRecord = {
        id: uid('session'),
        date: action.date,
        rows: action.rows,
        queued: !state.isOnline,
      };
      const queueAdd: SyncQueueItem[] = session.queued
        ? [{ id: uid('sync'), kind: 'session', refId: session.id, description: `Session · ${session.rows.length} attempts`, createdAt: new Date().toISOString() }]
        : [];
      return { ...state, sessions: [session, ...state.sessions], syncQueue: [...state.syncQueue, ...queueAdd] };
    }

    // --- Sync ---
    case 'SYNC_NOW': {
      if (!state.isOnline) return state; // Sync now can itself fail while offline (S3 data contract).
      const clearQueued = <T extends { queued?: boolean }>(items: T[]): T[] =>
        items.map((i) => (i.queued ? { ...i, queued: false } : i));
      const diary = Object.fromEntries(Object.entries(state.diary).map(([k, v]) => [k, clearQueued(v)]));
      const workoutAttempts = Object.fromEntries(
        Object.entries(state.workoutAttempts).map(([k, v]) => [k, clearQueued(v)])
      );
      return {
        ...state,
        diary,
        workoutAttempts,
        weights: clearQueued(state.weights),
        sessions: clearQueued(state.sessions),
        syncQueue: [],
      };
    }

    case 'RETRY_SYNC_ITEM':
      return { ...state, syncQueue: state.syncQueue.map((i) => (i.id === action.id ? { ...i, failed: false } : i)) };

    // --- Settings ---
    case 'SET_LOW_DATA_MODE':
      return { ...state, settings: { ...state.settings, lowDataMode: action.value } };

    case 'SET_NOTIFICATIONS':
      return { ...state, settings: { ...state.settings, notifications: { ...state.settings.notifications, ...action.notifications } } };

    case 'SET_INTEGRATION':
      return { ...state, settings: { ...state.settings, integrations: { ...state.settings.integrations, [action.provider]: action.state } } };

    case 'ACK_LEGAL':
      return { ...state, settings: { ...state.settings, legalAcknowledgedAt: new Date().toISOString() } };

    default:
      return state;
  }
}

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { loadState, saveState } from './storage';
import { SKILL_NODES, getNodeDef, NodeState, Track } from '../data/skillTree';
import type {
  AppState,
  CustomFoodEntry,
  DiaryEntry,
  Goals,
  ModuleInterest,
  PlacementInfo,
  Profile,
  RegionPrefs,
  Settings,
  WeightEntry,
  WorkoutAttempt,
  WorkoutSession,
} from './types';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const initialNodeStates: Record<string, NodeState> = Object.fromEntries(
  SKILL_NODES.map((n) => [n.id, n.defaultState])
);

const initialState: AppState = {
  hydrated: false,
  isAuthenticated: false,
  onboardingComplete: false,
  profile: { name: '' },
  goals: { calorieTarget: 2200, proteinG: 130, carbsG: 260, fatG: 70, computed: true },
  region: { market: 'Nigeria', includeWestern: false, units: 'metric' },
  moduleInterest: { nutrition: true, workout: false },
  placement: {
    calisthenics: { status: 'not_started' },
    pilates: { status: 'not_started' },
  },
  nodeStates: initialNodeStates,
  diary: [],
  favorites: [],
  recents: [],
  customFoods: [],
  weightLog: [],
  attempts: [],
  sessions: [],
  settings: {
    lowDataMode: false,
    notifications: { logReminders: true, streakProgress: true, syncAlerts: true },
    simulateOffline: false,
  },
  integrations: { googleFit: false, appleHealth: false },
  legalAcknowledged: false,
};

type GateEvent = { masteredNodeId: string; nowState: NodeState; newlyUnlockedIds: string[] } | null;

type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_AUTH'; email: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_PROFILE'; payload: Partial<Profile> }
  | { type: 'SET_GOALS'; payload: Partial<Goals> }
  | { type: 'SET_REGION'; payload: Partial<RegionPrefs> }
  | { type: 'SET_MODULE_INTEREST'; payload: Partial<ModuleInterest> }
  | { type: 'SET_PLACEMENT'; track: Track; payload: Partial<PlacementInfo> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_DIARY_ENTRY'; entry: DiaryEntry }
  | { type: 'UPDATE_DIARY_ENTRY'; id: string; payload: Partial<DiaryEntry> }
  | { type: 'DELETE_DIARY_ENTRY'; id: string }
  | { type: 'TOGGLE_FAVORITE'; foodId: string }
  | { type: 'ADD_RECENT'; foodId: string }
  | { type: 'ADD_CUSTOM_FOOD'; food: CustomFoodEntry }
  | { type: 'ADD_WEIGHT'; entry: WeightEntry }
  | { type: 'DELETE_WEIGHT'; id: string }
  | { type: 'LOG_ATTEMPT'; attempt: WorkoutAttempt }
  | { type: 'CLEAR_GATE_EVENT' }
  | { type: 'SAVE_SESSION'; session: WorkoutSession }
  | { type: 'SET_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_INTEGRATION'; key: 'googleFit' | 'appleHealth'; value: boolean }
  | { type: 'ACKNOWLEDGE_LEGAL' }
  | { type: 'SYNC_NOW' };

interface AppStateExtended extends AppState {
  lastGateEvent: GateEvent;
}

const initialExtended: AppStateExtended = { ...initialState, lastGateEvent: null };

/**
 * Placeholder mastery-gate mechanism (documented in BUILD_NOTES): since real
 * node thresholds are explicitly "TBD" per research Open Question 1, this
 * demo advances a node one state per logged attempt (unlocked -> in-progress
 * -> completed/mastered) rather than asserting any real rep/hold threshold.
 * This exists only to exercise the tier/node/gate UI end-to-end.
 */
function advanceNodeState(current: NodeState, isBoss: boolean): { next: NodeState; gateReached: boolean } {
  if (current === 'unlocked') return { next: 'inprogress', gateReached: false };
  if (current === 'inprogress') return { next: isBoss ? 'mastered' : 'completed', gateReached: true };
  if (current === 'completed' && isBoss) return { next: 'mastered', gateReached: true };
  return { next: current, gateReached: false };
}

function reducer(state: AppStateExtended, action: Action): AppStateExtended {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: true, email: action.email };
    case 'LOGOUT':
      return { ...initialExtended, hydrated: true };
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'SET_GOALS':
      return { ...state, goals: { ...state.goals, ...action.payload } };
    case 'SET_REGION':
      return { ...state, region: { ...state.region, ...action.payload } };
    case 'SET_MODULE_INTEREST':
      return { ...state, moduleInterest: { ...state.moduleInterest, ...action.payload } };
    case 'SET_PLACEMENT':
      return {
        ...state,
        placement: { ...state.placement, [action.track]: { ...state.placement[action.track], ...action.payload } },
      };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };
    case 'ADD_DIARY_ENTRY':
      return { ...state, diary: [action.entry, ...state.diary] };
    case 'UPDATE_DIARY_ENTRY':
      return {
        ...state,
        diary: state.diary.map((d) => (d.id === action.id ? { ...d, ...action.payload } : d)),
      };
    case 'DELETE_DIARY_ENTRY':
      return { ...state, diary: state.diary.filter((d) => d.id !== action.id) };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.foodId)
          ? state.favorites.filter((f) => f !== action.foodId)
          : [action.foodId, ...state.favorites],
      };
    case 'ADD_RECENT':
      return { ...state, recents: [action.foodId, ...state.recents.filter((f) => f !== action.foodId)].slice(0, 20) };
    case 'ADD_CUSTOM_FOOD':
      return { ...state, customFoods: [action.food, ...state.customFoods] };
    case 'ADD_WEIGHT':
      return { ...state, weightLog: [action.entry, ...state.weightLog] };
    case 'DELETE_WEIGHT':
      return { ...state, weightLog: state.weightLog.filter((w) => w.id !== action.id) };
    case 'LOG_ATTEMPT': {
      const def = getNodeDef(action.attempt.nodeId);
      if (!def) return { ...state, attempts: [action.attempt, ...state.attempts] };
      const currentState = state.nodeStates[def.id] ?? def.defaultState;
      const { next, gateReached } = advanceNodeState(currentState, !!def.isBoss);
      let nodeStates = { ...state.nodeStates, [def.id]: next };
      let newlyUnlockedIds: string[] = [];
      if (gateReached) {
        const dependents = SKILL_NODES.filter((n) => n.prerequisiteIds.includes(def.id));
        dependents.forEach((dep) => {
          const depState = nodeStates[dep.id] ?? dep.defaultState;
          const prereqsMet = dep.prerequisiteIds.every((pid) => {
            const s = nodeStates[pid] ?? 'locked';
            return s === 'completed' || s === 'mastered';
          });
          if (depState === 'locked' && prereqsMet) {
            nodeStates = { ...nodeStates, [dep.id]: 'unlocked' };
            newlyUnlockedIds.push(dep.id);
          }
        });
      }
      return {
        ...state,
        attempts: [action.attempt, ...state.attempts],
        nodeStates,
        lastGateEvent: gateReached ? { masteredNodeId: def.id, nowState: next, newlyUnlockedIds } : state.lastGateEvent,
      };
    }
    case 'CLEAR_GATE_EVENT':
      return { ...state, lastGateEvent: null };
    case 'SAVE_SESSION':
      return { ...state, sessions: [action.session, ...state.sessions] };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_INTEGRATION':
      return { ...state, integrations: { ...state.integrations, [action.key]: action.value } };
    case 'ACKNOWLEDGE_LEGAL':
      return { ...state, legalAcknowledged: true };
    case 'SYNC_NOW':
      return {
        ...state,
        diary: state.diary.map((d) => ({ ...d, queued: false, syncFailed: false })),
        weightLog: state.weightLog.map((w) => ({ ...w, queued: false })),
        attempts: state.attempts.map((a) => ({ ...a, queued: false })),
        sessions: state.sessions.map((s) => ({ ...s, queued: false })),
        settings: { ...state.settings, lastSyncedAt: new Date().toISOString() },
      };
    default:
      return state;
  }
}

interface Ctx {
  state: AppStateExtended;
  dispatch: React.Dispatch<Action>;
  isOnline: boolean;
  queuedCount: number;
  uid: typeof uid;
  todayStr: typeof todayStr;
}

const AppStateCtx = createContext<Ctx | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialExtended);
  const [isOnline, setIsOnline] = React.useState(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    loadState<AppState>().then((saved) => {
      if (saved) dispatch({ type: 'HYDRATE', payload: saved });
      else dispatch({ type: 'HYDRATE', payload: {} });
      hydratedRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { lastGateEvent, hydrated, ...persisted } = state;
    saveState(persisted);
  }, [state]);

  useEffect(() => {
    const sub = NetInfo.addEventListener((s) => {
      setIsOnline(!!s.isConnected && s.isInternetReachable !== false);
    });
    return () => sub();
  }, []);

  // Real connectivity OR the manual "simulate offline" demo toggle (Data & Sync
  // Settings) both drive queued/offline behavior — either can force offline mode.
  const effectiveOnline = isOnline && !state.settings.simulateOffline;

  // Auto-sync simulation: when back online, flip queued items to synced after
  // a short delay, mimicking the offline-first queue draining (Req 5).
  useEffect(() => {
    if (!effectiveOnline) return;
    const hasQueued =
      state.diary.some((d) => d.queued) ||
      state.weightLog.some((w) => w.queued) ||
      state.attempts.some((a) => a.queued) ||
      state.sessions.some((s) => s.queued);
    if (!hasQueued) return;
    const t = setTimeout(() => dispatch({ type: 'SYNC_NOW' }), 1500);
    return () => clearTimeout(t);
  }, [effectiveOnline, state.diary, state.weightLog, state.attempts, state.sessions]);

  const queuedCount =
    state.diary.filter((d) => d.queued).length +
    state.weightLog.filter((w) => w.queued).length +
    state.attempts.filter((a) => a.queued).length +
    state.sessions.filter((s) => s.queued).length;

  const value = useMemo(
    () => ({ state, dispatch, isOnline: effectiveOnline, queuedCount, uid, todayStr }),
    [state, effectiveOnline, queuedCount]
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

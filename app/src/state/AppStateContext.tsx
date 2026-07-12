import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { appReducer, Action } from './reducer';
import { INITIAL_STATE } from './initialState';
import { loadPersistedState, savePersistedState, clearPersistedState } from './storage';
import type { AppState } from './types';

type Dispatch = React.Dispatch<Action>;

const StateContext = createContext<AppState | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

/**
 * Single React Context + useReducer state layer for the whole app (matches
 * the pattern requested — no second state-management library introduced).
 * Hydrates from AsyncStorage once on mount, persists on every change
 * thereafter, and tracks connectivity via NetInfo to drive the offline-first
 * sync-queue behavior (Req 5).
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    loadPersistedState().then((persisted) => {
      if (!mounted) return;
      dispatch({ type: 'HYDRATE', state: persisted ?? {} });
      hydratedRef.current = true;
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      dispatch({ type: 'SET_ONLINE', isOnline: netState.isConnected !== false });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!state.hydrated) return; // don't clobber storage with the pre-hydration default state
    savePersistedState(state);
  }, [state]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export function useAppDispatch(): Dispatch {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppStateProvider');
  return ctx;
}

/** Purges local persisted state entirely (App Store/Play account-deletion requirement). */
export async function purgeLocalState(): Promise<void> {
  await clearPersistedState();
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from './types';

const STORAGE_KEY = 'fitandfed:v1:appstate';

/** Fields we never persist verbatim (transient/session-only). */
type Persisted = Omit<AppState, 'hydrated' | 'isOnline'>;

export async function loadPersistedState(): Promise<Persisted | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    // Corrupt/unavailable storage — fail open to a fresh first-launch state
    // rather than crashing the app.
    return null;
  }
}

export async function savePersistedState(state: AppState): Promise<void> {
  try {
    const { hydrated: _h, isOnline: _o, ...persisted } = state;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Best-effort persistence; a save failure shouldn't crash the app. The
    // in-memory state (and this session's UI) remains correct either way.
  }
}

/** Used by account deletion (App Store/Play compliance — real delete, not a stub). */
export async function clearPersistedState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

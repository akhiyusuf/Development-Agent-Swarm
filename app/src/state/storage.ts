import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'calisthenics-nutrition-app-state-v1';

export async function loadState<T>(): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveState<T>(state: T): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence — offline-first means UI should never block on this.
  }
}

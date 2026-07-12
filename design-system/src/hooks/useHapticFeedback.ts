import { Platform } from 'react-native';

/**
 * Fires a haptic pulse for critical in-workout state changes (rest over, set
 * complete, session complete, PR/unlock) — accessibility rule #6 (audio/
 * haptic parity for hands-occupied / audio-led use). Swallows errors on web
 * or devices without haptics support rather than throwing.
 */
export async function fireHaptic(kind: 'light' | 'success' | 'warning' = 'light') {
  if (Platform.OS === 'web') return;
  try {
    // Lazy require so web bundling never pulls in native haptics code.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Haptics = require('expo-haptics');
    if (kind === 'success') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (kind === 'warning') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // No-op: haptics are an enhancement, never a functional dependency.
  }
}

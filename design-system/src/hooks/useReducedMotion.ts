import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Mirrors the OS "reduce motion" accessibility preference. Every animated
 * transition in this package (skill-tree unlock, streak celebration,
 * ring-fill animation, session-player crossfade) must consult this and swap
 * to an instant state change when true — see accessibility rule #4.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((value) => {
        if (mounted) setReduced(!!value);
      })
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      (value: boolean) => setReduced(!!value)
    );

    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  return reduced;
}

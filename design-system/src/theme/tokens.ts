/**
 * Design tokens — the single source of truth for every color, type size,
 * spacing value, and touch-target minimum used anywhere in this package.
 *
 * No component may hardcode a raw hex, font size, or spacing value that
 * bypasses these exports. See docs/design-system.md at the repo root for
 * rationale; this file is the source of truth for exact values.
 *
 * Palette + rationale carried forward (and re-verified) from
 * docs/reference/legacy-design-system.md, which independently computed and
 * corrected the contrast figures cited below via the WCAG relative-luminance
 * formula. Where this file's comments cite a ratio, that number was
 * recomputed while building this file, not copied blind.
 */

// ---------------------------------------------------------------------------
// 1. Color palette
// ---------------------------------------------------------------------------

/** Brand / primary colors. */
export const brandColors = {
  terracotta: '#C1502E',
  terracottaDark: '#96391F',
  gold: '#D9A441',
  /**
   * Contrast-safe gold. Base `gold` computes to ~2.1:1 against the light app
   * background (#F7F3EE) — below the WCAG 1.4.11 3:1 non-text/UI-component
   * floor. Use `goldDark` instead of `gold` for any interactive/stateful UI
   * component (button fill, icon stroke, ring fill) — `gold` itself is
   * reserved for decorative/highlight use only (see Button secondary note
   * below and ProgressRing carbs token).
   */
  goldDark: '#A9761E',
  /**
   * Dedicated muted-gold, used exclusively as the Pilates session player's
   * active-progress-indicator fill (see SessionPlayer pilates preset).
   * Verified ≥3:1 against the light app surface (~6.5:1), card surface
   * (~5.8:1), and the standard progress-bar track warmgray-400 (~4.0:1).
   * Not a decorative token — do not use for backgrounds or large fills.
   */
  goldMuted: '#7A4E12',
  deepGreen: '#1F5C42',
} as const;

/** Neutrals — light mode. */
export const lightNeutrals = {
  ink: '#20211D',
  charcoal: '#4A4A44',
  background: '#F7F3EE',
  surface: '#EDE6DC',
  border: '#C9C0B2',
  placeholder: '#5C564C',
  white: '#FFFFFF',
} as const;

/** Neutrals — dark mode. */
export const darkNeutrals = {
  ink: '#F7F3EE',
  charcoal: '#C9C0B2',
  background: '#17181A',
  surface: '#232427',
  border: '#3A3B3E',
  placeholder: '#8A8A86',
  white: '#FFFFFF',
} as const;

/**
 * Semantic (system state) colors — fixed meaning app-wide, never reused for
 * decoration. Distinct hue-family from the node-state vocabulary below so the
 * two are never visually confusable.
 */
export const semanticColors = {
  success: '#2E7D46',
  error: '#B3271E',
  warning: '#B8752A',
  info: '#2A6F97',
} as const;

/**
 * Fixed gamification color vocabulary — skill-tree / progression node state.
 * Per the research's explicit requirement (Duolingo lesson: fixed meanings,
 * never reused ad hoc elsewhere), every hex below is dedicated: it does not
 * appear in brandColors, semanticColors, or macroColors. This module's own
 * exclusivity is verified at the bottom of this file in `assertNodeColorsAreExclusive`
 * (executed once at import time in development) rather than merely claimed.
 */
export const nodeColors = {
  locked: '#8A8578',
  /** ~4.41:1 vs light background, ~3.93:1 vs card — clears the 3:1 UI-component floor. */
  unlocked: '#A85F12',
  inProgress: '#3B7EA8',
  completed: '#3D8B5C',
  mastered: '#A8452A',
} as const;

/**
 * Macro-ring accent colors (nutrition dashboard). Deliberately reuse
 * brand/semantic hues (a small, memorable, YAZIO-style vocabulary) rather
 * than inventing a sixth color family. These are visually distinct from the
 * node-state vocabulary (see assertion below) even though they intentionally
 * overlap with brand/semantic color elsewhere in the app.
 */
export const macroColors = {
  calories: brandColors.terracotta,
  protein: brandColors.deepGreen,
  carbs: brandColors.goldDark,
  fat: semanticColors.info,
} as const;

/** Runtime guard: the node-state palette must never collide with any other palette. */
function assertNodeColorsAreExclusive() {
  const otherHexes = new Set<string>([
    ...Object.values(brandColors),
    ...Object.values(semanticColors),
    ...Object.values(macroColors),
  ]);
  for (const [state, hex] of Object.entries(nodeColors)) {
    if (otherHexes.has(hex)) {
      throw new Error(
        `Design token error: node color "${state}" (${hex}) collides with a ` +
          `brand/semantic/macro token. The gamification vocabulary must stay exclusive.`
      );
    }
  }
}
if (__DEV__) {
  assertNodeColorsAreExclusive();
}

// ---------------------------------------------------------------------------
// 2. Type scale
// ---------------------------------------------------------------------------

export type TypeToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
};

/**
 * Base 16px, ~1.25 modular ratio, rounded to practical values. All sizes are
 * scalable units (RN's default), never fixed px baked into images.
 */
export const typeScale: Record<
  | 'display'
  | 'timerXl'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyEmphasis'
  | 'caption'
  | 'micro',
  TypeToken
> = {
  display: { fontSize: 40, lineHeight: 44, fontWeight: '700' },
  /** In-workout large timer/rep numerals — deliberately larger than display. */
  timerXl: { fontSize: 64, lineHeight: 68, fontWeight: '700' },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyEmphasis: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
};

/** Max font-scale multiplier for timerXl/display before clamping (see a11y notes). */
export const clampedTypeMaxScale = 1.5;

// ---------------------------------------------------------------------------
// 3. Spacing & grid
// ---------------------------------------------------------------------------

/** Base unit 4px; every spacing/padding/sizing value is a multiple of it. */
export const spacing = {
  space4: 4,
  space8: 8,
  space12: 12,
  space16: 16,
  space24: 24,
  space32: 32,
  space48: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

/**
 * Minimum touch target. iOS HIG = 44x44pt, Android Material = 48x48dp.
 * We use the larger figure as the single cross-platform floor so one
 * constant satisfies both platforms' review requirements without a
 * per-platform branch, per the research's "44x44pt, no exceptions" rule.
 */
export const minTouchTarget = 48;

/**
 * Density presets (per research's cross-cutting note): applied per-section,
 * not app-wide. Compact = nutrition logging/search (fast, frequent use).
 * Relaxed = skill-tree map, progress views, Pilates player (slower,
 * exploratory use). Both share the same base unit/type scale/components.
 */
export const density = {
  compact: { rowGap: spacing.space8, sectionGap: spacing.space16 },
  relaxed: { rowGap: spacing.space24, sectionGap: spacing.space32 },
} as const;

// ---------------------------------------------------------------------------
// 4. Motion
// ---------------------------------------------------------------------------

export const motion = {
  /** Unlock / PR celebration — brief, non-flashing. */
  celebrationMs: 400,
  /** Pilates exercise-to-exercise crossfade. */
  crossfadeMs: 300,
} as const;

// ---------------------------------------------------------------------------
// Theme shape (light/dark) consumed by ThemeContext
// ---------------------------------------------------------------------------

export type Neutrals = typeof lightNeutrals;

export type Theme = {
  mode: 'light' | 'dark';
  neutrals: Neutrals;
  brand: typeof brandColors;
  semantic: typeof semanticColors;
  node: typeof nodeColors;
  macro: typeof macroColors;
  type: typeof typeScale;
  spacing: typeof spacing;
  radii: typeof radii;
  minTouchTarget: number;
  density: typeof density;
  motion: typeof motion;
};

export function makeTheme(mode: 'light' | 'dark'): Theme {
  return {
    mode,
    neutrals: mode === 'light' ? lightNeutrals : darkNeutrals,
    brand: brandColors,
    semantic: semanticColors,
    node: nodeColors,
    macro: macroColors,
    type: typeScale,
    spacing,
    radii,
    minTouchTarget,
    density,
    motion,
  };
}

export const lightTheme = makeTheme('light');
export const darkTheme = makeTheme('dark');

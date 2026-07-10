/**
 * Design tokens — transcribed 1:1 from docs/design-system.md (approved, pass 3).
 * Do NOT introduce new hex values outside this file. Every color/type/space
 * value used anywhere in the app must resolve to a token defined here.
 *
 * Superseded/rejected draft hexes (#C98A2E, #E0BE7C) are intentionally absent.
 */

export const color = {
  // 1.1 Brand / primary
  primary: {
    terracotta: '#C1502E',
    terracottaDark: '#96391F',
    gold: '#D9A441',
    goldDark: '#A9761E',
    goldMuted: '#7A4E12', // Pilates player progress-fill ONLY — never a background/decorative fill
    deepgreen: '#1F5C42',
  },
  // 1.2 Neutrals
  neutral: {
    ink: '#20211D',
    charcoal: '#4A4A44',
    warmgray100: '#F7F3EE',
    warmgray200: '#EDE6DC',
    warmgray400: '#C9C0B2',
    warmgray700: '#5C564C',
    darkBg: '#17181A',
    darkSurface: '#232427',
    darkBorder: '#3A3B3E',
    white: '#FFFFFF',
  },
  // 1.3 Semantic (fixed meaning app-wide)
  semantic: {
    success: '#2E7D46',
    error: '#B3271E',
    warning: '#B8752A',
    info: '#2A6F97',
  },
  // 1.4 Fixed gamification vocabulary (skill-tree node states only — never reused elsewhere)
  node: {
    locked: '#8A8578',
    unlocked: '#A85F12',
    inprogress: '#3B7EA8',
    completed: '#3D8B5C',
    mastered: '#A8452A',
  },
} as const;

export type ColorTheme = 'light' | 'dark';

/** Resolves the correct neutral surface tokens for the active mode. */
export function surfaces(theme: ColorTheme) {
  if (theme === 'dark') {
    return {
      background: color.neutral.darkBg,
      card: color.neutral.darkSurface,
      border: color.neutral.darkBorder,
      text: color.neutral.white,
      textSecondary: '#C9C6BE',
      placeholder: '#8A877E',
    };
  }
  return {
    background: color.neutral.warmgray100,
    card: color.neutral.warmgray200,
    border: color.neutral.warmgray400,
    text: color.neutral.ink,
    textSecondary: color.neutral.charcoal,
    placeholder: color.neutral.warmgray700,
  };
}

// 2. Type scale (base 16, 1.25 modular ratio)
export const type = {
  display: { fontSize: 40, fontWeight: '700' as const, lineHeight: 44 },
  timerXl: { fontSize: 64, fontWeight: '700' as const, lineHeight: 64 },
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyEmphasis: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  micro: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
};

// 3. Spacing (base unit 4px)
export const space = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const touchTarget = 44;

/** Density presets per §3 — spacing multiples only differ, same base unit/type/components. */
export const density = {
  compact: { row: space[8], section: space[12] },
  relaxed: { row: space[24], section: space[32] },
};

// Macro-ring vocabulary (§4.10) — intentionally reuses brand/semantic hues, distinct from §1.4
export const macroColor = {
  calories: color.primary.terracotta,
  protein: color.primary.deepgreen,
  carbs: color.primary.goldDark,
  fat: color.semantic.info,
};

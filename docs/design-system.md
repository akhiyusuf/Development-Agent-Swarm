# Design System — Rationale

**Output:** `design-system/` — a standalone, independently-runnable Expo/React Native TypeScript
package (`@fit-and-fed/design-system`), previewable via its `ComponentGallery` default screen.
This document is intentionally short: the code is the source of truth.

## Direction: "warm, clean, and legible"

The research recommended a hybrid between YAZIO's clean information-density discipline and
Flutterwave's warmer, more optimistic color temperature, with a fixed Duolingo-style color
vocabulary reserved for skill-tree/gamification state. That direction is implemented as-is: a
warm off-white/terracotta/gold/deep-green base (never fintech blue-green or clinical pastel),
a five-color node-state vocabulary that is verified — not just claimed — to be exclusive (see
`assertNodeColorsAreExclusive` in `tokens.ts`, which throws at import time if any node hex ever
collides with a brand/semantic/macro hex), and a separate four-color semantic vocabulary for
system state (success/error/warning/info) that never overlaps with node state.

## Resolving the cultural-identity open question

The research explicitly left open whether the product's visual identity should be culturally
neutral or should deliberately express African/diaspora identity, flagging tokenism risk if done
superficially. This system resolves it the same way `docs/reference/legacy-design-system.md`
reasoned it through — Option 2, restrained: identity is expressed through color temperature
(terracotta/gold/deep-green rather than a generic global-SaaS palette) and through a photography/
imagery discipline (real dishes, real bodies performing real moves — never generic "African-coded"
stock illustration or decorative pattern chrome), and nowhere through surface-level decorative
motifs (no Adinkra-style borders, no textile-print backgrounds, no icon pattern library). This is
lower-risk than a decorative approach, is cheap to render on low-end devices (the same
performance constraint that shapes the rest of the system), and is a v1 stance to be revisited
with direct community input rather than a closed decision.

## Gamification color vocabulary — verified, not just documented

The prior prose spec (`docs/reference/legacy-design-system.md`) went through three review passes
specifically to land on five node-state hexes that are genuinely distinct from the brand palette,
the semantic palette, and the macro-ring palette, each independently contrast-checked against
WCAG 1.4.11's 3:1 non-text floor. Those exact, already-vetted values are carried forward into
`tokens.ts` because the reasoning behind them (dedicated hues, no shared-hex exceptions, an
explicit inactive-component exemption for the 60%-opacity locked state) is sound and the values
hold up under re-verification. The one thing the legacy spec could only assert, this package
enforces: a dev-time runtime check that throws if the node vocabulary ever collides with anything
else, so "exclusive" stays true as the component set grows.

## Session player: one shared shell, two tonal presets

Rather than building two workout-mode UIs, `SessionPlayer` is a single component with a
`preset` prop (`calisthenics` | `pilates`) that swaps background luminance, accent saturation,
motion intensity, and which secondary controls are visible (calisthenics gets a rest-timer state
with skip/+15s controls; Pilates gets play/skip/auto-advance) while sharing layout, type scale,
touch-target sizing, and the fixed color vocabularies. This directly implements the research's
"shared components, mode-specific styling, not two design languages" requirement.

## Departures from `docs/reference/legacy-design-system.md`

- **Touch-target floor:** the legacy doc cites 44x44pt everywhere (an iOS-only figure). Since this
  is a single cross-platform codebase, `tokens.ts` sets one floor at 48 (Android Material's larger
  figure) so every component clears both platforms' review requirements without a per-platform
  branch, rather than under-sizing Android by 4dp to match an iOS-only number.
- **Component set is additive, not smaller:** the legacy screens doc (`legacy-screens.md`)
  flagged six component gaps the old prose design system never filled (segmented control,
  single-select chips, toggle/switch, calendar/date-picker, trend chart, formal list row). All six
  are built here as real components so the screen-designer stage doesn't hit the same gaps twice.
- Everything else (palette hexes, type scale, spacing unit, density presets, accessibility rules)
  is carried forward as-is from the legacy document's already-resolved reasoning; no other
  substantive departures were made.

## Where the real spec lives

Exact token values: `design-system/src/theme/tokens.ts`.
Component APIs and states: `design-system/src/components/*.tsx`.
Every component in every documented state, on one navigable screen: `design-system/src/ComponentGallery.tsx`
(wired as the package's default `App.tsx` screen).

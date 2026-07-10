# Design System

**Status:** derived from `research/design-research.md` (approved, pass 3). This document is the single source of truth the screen-designer agent builds every screen from.

---

## 0. Cultural-Identity Judgment Call (resolved)

The research explicitly left open whether the visual identity should be culturally neutral/universal or deliberately express African/diaspora identity, and flagged the risk of tokenism if done superficially.

**Decision: Option 2, but restrained — a deliberately warm, distinct visual identity informed by pan-African color/material cues (Flutterwave-style), expressed *only* through color, photography direction, and copy tone — not through decorative pattern/iconography.**

Reasoning:
- The product's own differentiator (African/diaspora dishes, a household-unit-first portion model, a bodyweight-only skill tree) is already a substantive, non-surface-level cultural grounding. Layering a *matching* visual identity reinforces "made for us" rather than "generic global template bolted onto local content" — the research's stated upside of Option 2.
- The tokenism risk the research flags is concentrated specifically in decorative motifs applied without deep cultural grounding (e.g., generic Adinkra-style borders, stock "tribal" iconography) — this system deliberately excludes that category entirely. No pattern library, no textile-print backgrounds, no generic "African print" chrome. Identity is expressed through color temperature (terracotta/gold/deep-green vs. fintech blue-green default) and through photography/imagery direction (real prepared dishes, real bodies performing the actual moves — never stock "generic diaspora" photography), which is lower-risk and easier to keep authentic without community co-design at this stage.
- This also happens to satisfy the low-bandwidth/low-end-device constraint: solid warm color + restrained photography is cheap to render; decorative pattern systems and illustration sets are not. The two constraints point the same direction, which is a good sign this is the right cut point rather than a forced compromise.
- This is a v1 design-system decision, not a closed question. If/when direct user or community input becomes available (as the research recommends), it should be used to validate or adjust the color/photography direction specifically — not to add decorative motifs by default.

Practical consequence for the screen-designer agent: use the warm palette below everywhere; when the sitemap calls for real content imagery (dish photos, portion-photo references, exercise demo stills), source or commission authentic photography — never generic "African-coded" stock illustration or pattern assets.

---

## 1. Color Palette

All colors below are solid, flat values — no gradients, no photographic-texture fills — per the performance constraint (favor solid colors/lightweight assets for low-end Android + high data costs).

### 1.1 Brand / primary

| Token | Hex | Use |
|---|---|---|
| `color.primary.terracotta` | `#C1502E` | Primary brand color: primary buttons, active tab, key CTAs, nutrition-mode accent |
| `color.primary.terracotta.dark` | `#96391F` | Pressed/active state of primary, text-on-light emphasis |
| `color.primary.gold` | `#D9A441` | Secondary brand accent: highlights, streak/XP-adjacent UI (outside the fixed gamification vocabulary in §1.3), secondary buttons |
| `color.primary.deepgreen` | `#1F5C42` | Tertiary brand accent: workout-mode / skill-tree section accent, success emphasis outside fixed semantic green |

### 1.2 Neutrals

| Token | Hex | Use |
|---|---|---|
| `color.neutral.ink` | `#20211D` | Primary text (light mode) |
| `color.neutral.charcoal` | `#4A4A44` | Secondary text (light mode) |
| `color.neutral.warmgray-100` | `#F7F3EE` | App background (light mode) — warm off-white, not clinical pure white |
| `color.neutral.warmgray-200` | `#EDE6DC` | Card/surface background (light mode) |
| `color.neutral.warmgray-400` | `#C9C0B2` | Borders, dividers, disabled fills (light mode) |
| `color.neutral.warmgray-700` | `#5C564C` | Placeholder text, icon-inactive |
| `color.neutral.dark-bg` | `#17181A` | App background (dark mode / in-session calisthenics screens) |
| `color.neutral.dark-surface` | `#232427` | Card/surface background (dark mode) |
| `color.neutral.dark-border` | `#3A3B3E` | Borders/dividers (dark mode) |
| `color.neutral.white` | `#FFFFFF` | Text-on-color, icon-on-color |

### 1.3 Semantic colors (state, feedback — fixed meaning app-wide)

Per the research's explicit requirement for a Duolingo-style **fixed** color vocabulary (not just aesthetic), these meanings never change across contexts:

| Token | Hex | Meaning | Notes |
|---|---|---|---|
| `color.semantic.success` | `#2E7D46` | Success, goal met, correct/valid input | Distinct from `deepgreen` brand accent by ~10% luminance to keep "brand" vs "system success" separable in code review, though visually adjacent |
| `color.semantic.error` | `#B3271E` | Error, invalid input, destructive action | Never reused for anything else (e.g., not used decoratively) |
| `color.semantic.warning` | `#B8752A` | Warning, approaching-limit states (e.g., near calorie budget) | |
| `color.semantic.info` | `#2A6F97` | Informational, neutral system messages | The one cool color in the system, used sparingly, only for info/help affordances — deliberately never used for brand or gamification, to keep it unambiguous |

### 1.4 Fixed gamification color vocabulary (skill-tree node states)

This is a **separate, fixed vocabulary** from the general semantic set above — scoped specifically to skill-tree/progression state, per the research's explicit requirement (Duolingo lesson: fixed meanings, not reused ad hoc elsewhere). These four colors are reserved exclusively for node/skill state and must not be reused for other UI purposes anywhere in the app.

| State | Token | Hex | Icon/shape pairing (color is never the only signal) |
|---|---|---|---|
| Locked | `color.node.locked` | `#8A8578` (muted warm gray) | Closed padlock icon, node rendered flat/desaturated, reduced opacity (60%) |
| Unlocked / available | `color.node.unlocked` | `#D9A441` (gold) | Outlined circle icon, node rendered at full opacity, subtle static ring |
| In-progress | `color.node.inprogress` | `#2A6F97` (blue — borrowed from `info` but scoped to this vocabulary, acceptable because contexts never overlap) | Half-filled arc/ring around node, animated fill only if motion is not reduced |
| Completed | `color.node.completed` | `#2E7D46` (green) | Filled checkmark icon inside node |
| Mastered | `color.node.mastered` | `#C1502E` (terracotta, brand primary) with gold outline `#D9A441` | Star/badge icon, node rendered larger (per research: "boss"/milestone visual emphasis), subtle static glow — no particle/celebration effects (perf constraint) |

Reserve note: because `inprogress` reuses the `info` hex value, screen-designer must ensure node-state UI and general info-message UI never appear adjacent/ambiguous in the same view; if a conflict ever arises, `inprogress` gets a dedicated hex (`#3B7EA8`) rather than reusing `info`.

### 1.5 Dark mode

Dark mode is **mandatory for the in-session calisthenics player** (game-like, high-contrast register — see §5.1) and available app-wide as a user preference. Light mode is the default everywhere else, including the Pilates player (calmer register keeps a light/soft base even for "dark mode" users — see §5.2 exception). Semantic and gamification colors keep identical hex values in both modes; only neutrals swap per the tables above. All text/background pairings must be re-verified at 4.5:1 (normal) / 3:1 (large) in both modes — see §6.

---

## 2. Type Scale

**Font:** System font stack by platform (SF Pro on iOS, Roboto on Android) rather than a custom/downloaded webfont — zero additional network weight, native dynamic-type integration, consistent with the performance constraint. If a single cross-platform brand font is later desired, it must ship as a variable font under 50KB and always degrade to system font when unavailable/offline.

**Scale** (base 16px, 1.25 modular ratio, rounded to practical values):

| Token | Size (pt/sp) | Weight | Line-height | Use |
|---|---|---|---|---|
| `type.display` | 40 | Bold (700) | 44 (1.1) | Session-complete headline, big celebratory moments (used sparingly) |
| `type.timer-xl` | 64 | Bold (700) | 1.0 | In-workout large timer/rep numerals (calisthenics + Pilates player) — deliberately larger than a standard display size per the "glanceable from arm's length" requirement |
| `type.h1` | 28 | Bold (700) | 34 (1.2) | Screen titles |
| `type.h2` | 22 | Semibold (600) | 28 (1.25) | Section headers, card titles |
| `type.h3` | 18 | Semibold (600) | 24 (1.3) | Subsection headers, list-item titles |
| `type.body` | 16 | Regular (400) | 24 (1.5) | Default body text, form labels |
| `type.body-emphasis` | 16 | Semibold (600) | 24 (1.5) | Emphasized inline text, active nav label |
| `type.caption` | 14 | Regular (400) | 20 (1.4) | Secondary/meta text, timestamps, helper text |
| `type.micro` | 12 | Medium (500) | 16 (1.3) | Badge labels, tags, node-state labels |

Rules:
- All sizes are in scalable units (pt/sp), never fixed px baked into images — dynamic type / OS text-scaling must be honored up to at least 200% without clipping (per WCAG 1.4.4).
- `type.timer-xl` and `type.display` should still respond to dynamic type but may clamp growth beyond ~150% to avoid breaking the single-focus in-workout layout; when clamped, ensure the value never drops below the WCAG minimum effective size at default settings.
- Never embed text in images/icons.

---

## 3. Spacing & Grid System

**Base unit:** 4px. All spacing, padding, and sizing values are multiples of this unit.

| Token | Value | Use |
|---|---|---|
| `space.4` | 4px | Micro spacing (icon-to-label gap) |
| `space.8` | 8px | Tight spacing (within a compact control) |
| `space.12` | 12px | Default inter-element spacing within a component |
| `space.16` | 16px | Default screen-edge margin, card padding |
| `space.24` | 24px | Spacing between distinct components/sections |
| `space.32` | 32px | Spacing between major page sections |
| `space.48` | 48px | Large separation (e.g., above session-complete summary) |

**Grid:** 4-column grid on mobile (the product is mobile-first per the research), 16px gutters, 16px outer margins. Cards and list rows span the full content width by default; nutrition dashboard rings/summary tiles may use 2-column arrangements within the grid.

**Touch targets:** minimum 44x44pt for every interactive element (buttons, form inputs, stepper controls, skill-tree nodes, tab-bar items), including when visual size is smaller — use invisible hit-area padding to meet the minimum without inflating visual weight. This is non-negotiable per the research's explicit requirement and applies with no exceptions, including dense logging forms and skill-tree node taps.

**Density modes (per research's cross-cutting note):** the system defines two density presets, applied per-section rather than app-wide:
- **Compact** (nutrition logging, food search, serving pickers): tighter vertical rhythm (`space.8`/`space.12` between rows) to support fast, multiple-times-a-day use.
- **Relaxed** (skill-tree map, progress/achievement views, Pilates player): looser vertical rhythm (`space.24`/`space.32`), larger touch targets and imagery, supporting slower, exploratory/reflective use.

Both densities share the same base unit, type scale, and component set — only spacing multiples and imagery size differ, so the app reads as one coherent product per the research's explicit warning against "two bolted-together apps."

---

## 4. Component Inventory

Unless noted, states below apply uniformly: **default, hover (or platform-equivalent press/focus state on touch), disabled, error.** "Hover" is interpreted as press/active state on mobile touch targets and focus-ring state for keyboard/switch-access navigation.

### 4.1 Buttons

- **Primary button** — filled `color.primary.terracotta`, white text, `type.body-emphasis`, 8px corner radius, min height 48px (exceeds 44pt minimum with comfortable padding).
  - Default: solid terracotta.
  - Hover/press: `color.primary.terracotta.dark`.
  - Disabled: `color.neutral.warmgray-400` fill, `color.neutral.warmgray-700` text, no shadow — never conveyed by opacity alone if it would drop text below 4.5:1; use the disabled palette pairing above, which is pre-verified at sufficient contrast for state legibility (though disabled controls are exempt from the AA text-contrast requirement per WCAG, this pairing still keeps the label readable).
  - Error (as a rare state, e.g., a submit action that failed): border in `color.semantic.error`, retains fill, brief non-flashing shake-free error text below.
- **Secondary button** — outlined, 1.5px `color.primary.terracotta` border, terracotta text, transparent fill.
  - Hover/press: `color.neutral.warmgray-200` fill added.
  - Disabled: `color.neutral.warmgray-400` border/text.
  - Error: border swaps to `color.semantic.error`.
- **Text/tertiary button** — no fill/border, terracotta text, used for low-emphasis actions (e.g., "skip").
  - Hover/press: underline appears.
  - Disabled: `color.neutral.warmgray-700` text, no underline available.

### 4.2 Inputs (text fields, food search, forms)

- Default: `color.neutral.warmgray-200` fill, 1px `color.neutral.warmgray-400` border, `type.body` text, 8px radius, 48px min height.
- Focus/hover: border becomes 2px `color.primary.terracotta`.
- Disabled: `color.neutral.warmgray-100` fill, `color.neutral.warmgray-700` placeholder text only, no border emphasis.
- Error: 2px `color.semantic.error` border, error icon (never color alone) at trailing edge, `type.caption` error message below in `color.semantic.error`.

### 4.3 Household-unit portion picker (primary nutrition-logging control — first-class component)

Per the research's explicit requirement, this — not a gram-weight stepper — is the **default** serving-size control for prepared-meal logging.

- Structure: a horizontal set of large (min 56x56px) tappable unit chips (e.g., "1 ladle," "half plate," "1 wrap," "1 cup") with an icon/illustration cue per unit type, plus a stepper (−/+ ) to adjust quantity of the selected unit. Gram-weight/barcode entry is available as a clearly secondary, smaller "advanced/exact" link below the picker — never the default focus.
- Default: unit chips shown as outlined `color.neutral.warmgray-400`, selected chip filled `color.primary.terracotta` with white text/icon.
- Hover/press: chip shows `color.neutral.warmgray-200` press-state fill before selection commits.
- Disabled: used when a food item has no defined household-unit conversion yet — chips render in the disabled palette (§4.1) and the picker auto-falls-back to gram entry with a caption explaining why ("exact weight only for this item").
- Error: if a manually-entered advanced gram value is invalid, standard input error state (§4.2) applies to that sub-field only; the household-unit chips are unaffected.

### 4.4 Portion-photo reference component (first-class UI element)

Per the research and the sitemap's flagged requirement, a photographic reference for "what does 1 ladle / half plate actually look like" is a first-class, reusable component, not an incidental image.

- Structure: a labelled photo tile (e.g., 96x96px thumbnail inline, expandable) showing a real reference photo of the named household unit for that specific dish, with a caption ("1 ladle ≈ 150g jollof rice"). Appears inline on Ingredient Detail and within the Composite Meal Detail portion-selector, and is the core content of the standalone Portion Reference Guide sheet/modal (an expanded, browsable set of these tiles).
- Images are compressed, lazily loaded, and cached for offline reuse (perf/data-cost constraint) — never auto-playing video, static photography only.
- Default: photo tile with caption below in `type.caption`.
- Hover/press (thumbnail): expands to a larger modal view; press state shows subtle scale/opacity change only if motion is not reduced (static state change otherwise).
- Disabled: not applicable (informational component); if no reference photo exists yet for a given dish, the tile is omitted entirely rather than shown empty/broken — never a placeholder gray box shown as if content failed to load.
- Error: if the image fails to load (offline, low bandwidth), falls back to the text caption alone with a small icon — this is treated as an expected offline state, not an error toast, per the offline-first requirement.

### 4.5 Cards

- Default: `color.neutral.warmgray-200` (light) / `color.neutral.dark-surface` (dark) fill, 12px radius, no drop shadow by default (perf constraint — use a 1px border instead of blur/shadow layering where separation is needed); optional single flat 4px-blur shadow permitted only on high-tier-device detection if the platform supports a cheap native shadow primitive, never as the sole default.
- Hover/press (tappable cards, e.g., meal-log entries, skill-tree node-detail cards): background shifts to `color.neutral.warmgray-100` momentarily, no shadow-lift animation.
- Disabled: reduced opacity 60% + `color.neutral.warmgray-700` text, used e.g. for a not-yet-available feature card.
- Error: 1px `color.semantic.error` border, used e.g. for a sync-failed log entry card.

### 4.6 Navigation (tab bar)

- Five-tab bottom bar (per approved sitemap) with icon + `type.micro` label.
- Default: inactive tabs in `color.neutral.warmgray-700` (light) / muted equivalent (dark).
- Active/hover: active tab icon+label in `color.primary.terracotta`, with a small dot/underline indicator (never color alone) beneath.
- Disabled: not applicable — all five tabs are always reachable.
- Error: a small `color.semantic.error` badge dot on a tab (e.g., sync error) — paired with an exclamation glyph, never the dot alone.

### 4.7 Skill-tree node

- Uses the fixed gamification vocabulary in §1.4 exclusively for state color. Node shape: circle for standard skills, larger circle (1.5x) with gold outline for "boss"/milestone skills.
- Default: state-appropriate fill/icon per §1.4.
- Hover/press: subtle 4px outward ring expansion (respecting reduced-motion: a static ring appears instantly instead of animating outward).
- Disabled: not applicable — "locked" is itself a first-class state, not a disabled variant of "unlocked."
- Error: not applicable to node state; if a node's progress fails to sync, a small warning glyph (using `color.semantic.warning`) overlays the corner without altering the node's core state color.

### 4.8 Session player (shared component, tonal-flex — see §5 for full spec)

One shared component: full-screen single-focus layout with a dominant timer/counter (`type.timer-xl`), minimal chrome, large primary control (pause/skip/log-rep), and a session-complete summary state. Mode-specific styling per §5.

### 4.9 Modals / sheets

- Default: bottom sheet on mobile, `color.neutral.warmgray-100` (light) surface, rounded top corners (16px), drag handle affordance.
- Hover/press: standard button states apply to in-sheet actions (§4.1).
- Disabled: primary sheet action disabled per §4.1 pattern until required input is provided (e.g., unit not yet selected in portion picker).
- Error: inline error banner at top of sheet using `color.semantic.error` background tint at 10% opacity + full-opacity icon/text (color never alone).

### 4.10 Progress rings/bars (nutrition dashboard)

- One accent color per macro/metric (YAZIO lesson — small, consistent color vocabulary), distinct from both the brand palette's decorative use and the gamification vocabulary in §1.4 to avoid cross-contaminating meanings: calories = terracotta, protein = deep green, carbs = gold, fat = info-blue. Fixed across the app once set.
- Default: ring/bar shows filled progress vs. remaining in `color.neutral.warmgray-400` track.
- Hover/press (tappable to expand detail): slight fill/track contrast increase.
- Disabled: not applicable.
- Error: over-limit state shown via `color.semantic.warning` (approaching) or `color.semantic.error` (exceeded) ring color plus a text label — never a silent color swap alone.

---

## 5. Session Player Tonal-Flex Specification

One shared session-player component, two mode-specific style presets, per the research's explicit requirement that this be achieved "through shared components with mode-specific styling rather than two separate design languages."

### 5.1 Calisthenics preset — game-like, high-contrast, achievement-driven

- Background: dark mode (`color.neutral.dark-bg`), always, regardless of the user's app-wide light/dark preference — the high-contrast register is intentional here.
- Dominant element: `type.timer-xl` numerals (rep count or hold-timer) in `color.neutral.white`, large tap target beneath for manual rep increment (min 96x96px — well above the 44pt floor, sized for one-handed, arm's-length use per the glanceability requirement).
- Accent use: `color.primary.terracotta` or gold for active-state emphasis (e.g., "new PR" callout); gamification-vocabulary colors (§1.4) may appear only in the post-session summary when tying back to skill-tree node progress, never during the live counting/timer view (keeps the two vocabularies from visually colliding mid-session).
- Motion: unlock/PR celebration is a brief (≤400ms), non-flashing scale+fade only, with a full static-badge fallback under reduced-motion; paired with a haptic pulse and optional sound cue.
- Session-complete: achievement-toned summary (sets/reps/time vs. thresholds hit, explicit "this unlocked/advanced [node]" callout), using gamification-vocabulary colors from §1.4 where node state is referenced.

### 5.2 Pilates preset — calm, soft, audio-led

- Background: light, muted surface (`color.neutral.warmgray-100`) even when the user has app-wide dark mode enabled — the calm register is intentional and deliberately not dark, per the research's contrast case (Alo Moves-style calm register vs. calisthenics' game-like dark register).
- Dominant element: same `type.timer-xl` component, but single countdown only (no manual rep-increment target), lower-contrast warm-neutral color (`color.neutral.charcoal`) rather than stark white-on-black, generous surrounding whitespace (`space.48`), minimal secondary chrome (only play/pause, skip, and an auto-advance toggle visible).
- Accent use: muted gold (`color.primary.gold` at reduced 70% saturation via a dedicated softer token `color.primary.gold-muted: #E0BE7C`) for the single active-progress indicator; no achievement-badge visuals mid-session.
- Motion: none beyond a simple linear progress-bar fill; transitions between exercises are a plain crossfade (≤300ms) respecting reduced-motion (instant cut fallback).
- Audio-first: cue text is supplementary, not primary — audio cues are the expected primary channel (per research), with captions available for accessibility (never audio-only for critical state, satisfying the "never color/sense alone" principle extended to audio).
- Session-complete: reflective tone ("session complete, 12 minutes moved, held your plank 15s longer than last time"), still surfaces threshold/skill-tree progress using §1.4 colors, but presented in the calm surface rather than a high-contrast celebration screen — keeping both modes tied to the same underlying gamification loop without matching its visual intensity.

Both presets share: identical component structure/layout grid, identical type scale, identical minimum touch-target sizing, identical fixed semantic/gamification color meanings when those colors do appear, and identical accessibility behaviors (§6). Only background luminance, accent saturation, motion intensity, and which secondary controls are visible differ.

---

## 6. Accessibility Rules (enforced app-wide)

1. **Contrast:** minimum 4.5:1 for normal text, 3:1 for large text (WCAG 1.4.3) in both light and dark mode for every token pairing defined in §1. In-workout timer/counter numerals (`type.timer-xl`) must exceed this minimum — target 7:1 where the background allows, given they're read at a distance or mid-exertion.
2. **Dynamic type:** all text uses scalable units and must support OS-level scaling up to 200% without clipping or overlap, except `type.timer-xl`/`type.display` which may clamp growth (see §2) but never fall below the AA minimum effective size.
3. **Touch targets:** minimum 44x44pt for every interactive element with no exceptions, including dense logging-form controls and skill-tree nodes (use invisible hit-area padding where visual size is smaller).
4. **Motion:** every animated transition (skill-tree unlock, streak celebration, ring-fill animation, session-player crossfade) has a reduced-motion alternative that swaps animation for an instant state change; no flashing/strobing effects anywhere (WCAG 2.5.4).
5. **Color is never the sole signal:** every stateful color use (skill-tree node states, error states, over-limit progress rings, sync-status badges) is paired with an icon, shape, or text label difference.
6. **Audio/haptic parity:** critical state changes during workouts (rest over, set complete, session complete, PR/unlock) fire a haptic and/or audio cue alongside the visual change, supporting hands-occupied and audio-led (Pilates) use.
7. **Cognitive load / single focus:** in-workout screens (both presets in §5) keep exactly one dominant timer/counter element; no dashboard-density UI is permitted inside the session player regardless of mode.
8. **Performance-as-accessibility:** favor solid color fills over gradients/blur/shadow layering; lightweight vector iconography over illustration sets; no auto-playing video or GIF-style assets; compress and cache portion-photo and exercise-demo imagery for offline reuse; design every screen's default state to work offline (cached daily log, cached skill-tree view) rather than treating offline as an error condition. This is treated as an accessibility requirement, not just a performance nicety, given the target market's data-cost and low-end-device profile.
9. **Text never in images:** all text (including numerals in the session player) is rendered as real text, never baked into image/icon assets.

---

Design system complete. Ready for review before screen design stage.

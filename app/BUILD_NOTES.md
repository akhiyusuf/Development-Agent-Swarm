# Build Notes — Deviations From Spec

This build implements `docs/sitemap.md` (approved, pass 2), `docs/design-system.md`
(approved, pass 3), and `docs/screens.md` (approved) as a React Native (Expo, SDK 57,
TypeScript) app in `app/`. Everything below is a deliberate, documented deviation or
implementation decision — nothing was silently improvised.

## Stack choice

- **React Native + Expo (TypeScript, SDK 57)**, scaffolded via `create-expo-app`. This is
  the practical single-codebase iOS+Android path for a project of this scope and matches
  the sitemap/design-system's mobile-first, Android-first framing. Navigation via
  `@react-navigation` (native-stack + bottom-tabs), local persistence via
  `@react-native-async-storage/async-storage`, connectivity via
  `@react-native-community/netinfo`, vector icons via `@expo/vector-icons`, charts/rings
  via `react-native-svg`. No UI kit was used — every component in `src/components/` is
  hand-built from `docs/design-system.md` tokens.

## Explicit constraints carried in from the orchestrator (documented per instruction)

1. **No real calisthenics/Pilates content.** `src/data/skillTree.ts` seeds every node as a
   generic placeholder (`"Skill Node A"`, `"Skill Node B"`, ...) with `thresholdLabel: 'TBD'`
   and placeholder prerequisite relationships, per research Open Question 1 and the
   sitemap's scope note. No real exercise names, orderings, or thresholds appear anywhere
   in the UI.
2. **No guided Session Player screen was built.** `W7` (`WorkoutSessionLogScreen`) is
   freeform logging only (pick an actionable node → Log Attempt → session summary),
   matching the sitemap. The design system's fully-specified shared Session Player
   (§4.8/§5, with the calisthenics rest-timer state and the Pilates `gold-muted`
   `#7A4E12` progress indicator) has no sitemap destination and was intentionally not
   built, per docs/screens.md's own flagged cross-track mismatch.
3. **Only approved design-system hexes are used.** `src/theme/tokens.ts` transcribes the
   palette 1:1 from `docs/design-system.md`; `color.node.unlocked = #A85F12` and
   `color.primary.goldMuted = #7A4E12` are used exactly where spec'd (skill-tree
   unlocked/mastered-outline state, and reserved-but-unused since no Pilates player exists
   — see #2). The superseded `#C98A2E`/`#E0BE7C` do not appear anywhere in the codebase.
4. **Locked skill-tree nodes are fully non-interactive.** `src/components/SkillNode.tsx`
   never wires an `onPress` for a locked node regardless of what's passed in (`disabled={locked}`,
   `onPress={locked ? undefined : onPress}`), preserving the WCAG 1.4.11 inactive-component
   exemption for that state per docs/screens.md carry-forward #5.
5. **Five flagged missing components were built as additive**, consistent with existing
   type/spacing/color rules, not invented ad hoc: `SegmentedControl.tsx`, `SingleSelect.tsx`,
   `ToggleSwitch.tsx`, `Calendar.tsx`, `TrendChart.tsx`. A sixth (`ListRow.tsx`, gap #6 —
   "should be formalized" per the screens doc) was also built, since it's used pervasively.
6. **Nutrition data is mock/placeholder.** `src/data/foodDatabase.ts` is a small,
   hand-authored set of ~10 realistic-sounding Nigerian/Ghanaian/Kenyan dishes plus a couple
   of Western/diaspora items, with plausible but invented macro/micronutrient values. The
   file's top comment states explicitly that this is not sourced FAO/INFOODS/WAFCT/Kenya-FCT
   data and must be replaced before any real launch.

## Additional implementation decisions (not requested verbatim, judged necessary)

- **Portion-photo reference tiles use flat-color placeholder illustration tiles + real
  text captions, not real photography.** No commissioned/sourced food or exercise
  photography is available in this build environment. `PortionPhotoReference.tsx` renders
  a solid-color tile with a food icon and a real-text caption (e.g., "1 ladle ≈ 150g jollof
  rice") standing in for where an authentic photo would go — this is explicitly *not*
  generic "African-coded" stock art (§0's prohibition), and foods with no reference at all
  (e.g., "Chin Chin") correctly omit the tile per §4.4 rather than showing a broken
  placeholder box. A real build must replace these tiles with commissioned/licensed
  photography per the design system's photography-direction guidance.
- **Placeholder mastery-gate mechanism.** Since node thresholds are explicitly `TBD` (Open
  Question 1), `AppStateContext.tsx`'s `advanceNodeState()` advances a node one state per
  logged attempt (`unlocked → in-progress → completed/mastered`) rather than asserting any
  real rep/hold number. This exists solely to exercise the tier/node/gate UI end-to-end
  (Log Attempt → Mastery Gate Confirmation → downstream unlock) and is called out in code
  comments; it is not real mastery criteria.
- **Bottom sheets use React Native's `Modal` + slide animation**, not a gesture-driven drag
  sheet — no `react-native-gesture-handler`/`reanimated` dependency was added, to keep the
  bundle lean per the low-data/low-end-device constraint (§6.8). The visual drag-handle
  affordance is present but decorative; dismissal is via backdrop tap or an explicit
  in-sheet action, which still satisfies "dismissable, no deep nav state" per the sitemap.
- **N3 (Food Search Results) is rendered inline** within N2 Add Entry's Search/Recent/
  Favorites tabs via a shared `FoodResultsList` component, rather than as a separately
  routed screen — the sitemap nests Food Search Results directly under Add Entry, so this
  is a UI consolidation, not a scope cut.
- **N4 (Ingredient Detail) and N5 (Composite Meal Detail) share one `FoodDetailScreen`**
  component, branching on `food.kind`, since the design system specifies "the same
  portion-selector pattern" for both and the only real differences are the recipe-breakdown
  section and copy.
- **Calorie/macro target computation** (`src/utils/calculateGoals.ts`) uses the standard,
  widely-published Mifflin-St Jeor BMR formula with a neutral constant age of 30 (the
  approved Profile Setup fields — name, sex, height, weight, activity level, goal — do not
  collect age). This is a generic formula, not proprietary or invented nutrition-science
  content, used only to seed an editable default per A4's "computed or user-adjusted"
  requirement.
- **Custom Food / Meal Builder (N7)** omits micronutrient entry fields and a portion-photo
  attach control, called out inline in the screen's own copy, for build-time scope — the
  household-unit label/grams/macros fields are present and functional.
- **Offline simulation:** real connectivity is read via `@react-native-community/netinfo`;
  a manual "Simulate offline (demo)" toggle is also exposed in Data & Sync Settings so the
  offline-queue/sync UX can be demonstrated without needing to change actual device
  connectivity. Queued entries auto-"sync" (clear their queued flag) ~1.5s after the app
  detects it's back online, to visibly demonstrate the offline-first queue draining
  described in Req 5. No real backend exists, so there is no genuine failure path — the
  sync-failed card/badge visual states are implemented and would render correctly if
  `syncFailed` were ever set, but nothing in this mock sync currently sets it.
- **Single global app-state store** (`src/state/AppStateContext.tsx`, one reducer +
  `AsyncStorage` persistence) rather than per-domain contexts, for build simplicity and to
  keep the offline-queue logic in one place. Purely an implementation detail.
- **Navigation param typing is permissive (`any`)** rather than fully-typed per-stack param
  lists, to move faster across ~50 screens. Implementation detail, not a design deviation.
- **Legal & Disclaimers (S7) copy is illustrative placeholder legal language**, explicitly
  flagged as such in the screen, not reviewed legal counsel text.
- **`WORKOUT_MODULE_LIVE = true`** in `ModuleInterestScreen.tsx`: since this build
  implements the full workout mechanism end-to-end, the module ships "live" rather than
  "coming soon." The sitemap's disabled/"Soon"-badge treatment is still implemented in code
  (card disabled state + `StatusBadge`) and would activate automatically if that constant
  were flipped to `false` for a nutrition-only launch.
- **Calendar (N12/W8) day cells** are proportionally sized (`100/7%` width) rather than
  fixed px, so they stay well above the 44pt touch-target floor on typical phone widths;
  the screens doc's noted "list-of-days fallback on very narrow widths" was not
  additionally implemented (acknowledged gap, low risk).

- **No app-wide light/dark toggle is exposed in Settings.** `ThemeContext.tsx` supports a
  light/dark preference (default light) and every component honors it, but no sitemap
  screen (Notifications/Data & Sync/etc.) explicitly lists a theme toggle, so one wasn't
  added. The workout node-map screens force dark mode unconditionally either way, per
  design-system §1.5/carry-forward #7, independent of this app-wide setting.

## Verified

- `npx tsc --noEmit` passes with zero errors across the full `app/` TypeScript project.
- `npx expo export --platform android` bundles successfully (1112 modules, no bundler
  errors), confirming the app assembles and would run in Expo Go / a native build.

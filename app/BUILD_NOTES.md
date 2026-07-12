# Build Notes — app-builder

This build wires the state layer, real content data, and business logic into
the already-built screens/navigation. It does **not** change any screen's
layout or styling — only the props/data/callbacks each screen receives, plus
a handful of documented, minimal data-contract fixes (below) where a screen's
shipped contract turned out to be incomplete once actually wired.

## What was added

- **`app/src/state/`** — React Context + `useReducer` (the only state
  pattern in the app; no second library introduced). `AppStateContext.tsx`
  hydrates from AsyncStorage on mount and persists on every change;
  `@react-native-community/netinfo` drives `isOnline` for the offline-queue
  behavior. `types.ts` / `initialState.ts` / `reducer.ts` / `selectors.ts`
  hold the domain model, the pristine first-launch state, all actions, and
  memoized read hooks (day totals, micro rows, node-state resolvers, etc).
- **`app/src/logic/`** — pure, unit-testable functions:
  - `targets.ts` — Mifflin-St Jeor calorie/macro calculation (Req 3).
  - `placement.ts` — turns placement self-report answers into a real
    starting tier on the actual skill-tree data (Req 9).
  - `progression.ts` — the objective mastery-gate engine: per-node/tier
    state resolution from logged attempts + prerequisites, and the
    newly-unlocked-node diff shown on Mastery Gate Confirmation (Req 6/7/8).
- Every screen's sample/hardcoded data (`SAMPLE_DIARY`, `SAMPLE_TARGETS`,
  `SAMPLE_WEIGHTS`, `PREVIEW_NODE_STATE`, hardcoded `startingTier={2}`, etc.)
  has been replaced with real state-derived data and dispatch-backed
  callbacks. `app/src/data/sampleData.ts` now holds only the fixed meal-slot
  vocabulary (genuinely static reference data, not mock content).
- `data/foods.ts` and `data/skillTree.ts` (the real, cited datasets) are
  otherwise **unchanged in content** — only their sample/preview-state
  exports were removed once real per-user state superseded them.

## App Store / Play compliance actions taken

- **Account deletion is real**: `AccountSettingsScreen`'s "Yes, delete
  everything" dispatches `DELETE_ACCOUNT` (resets in-memory state to a
  pristine first-launch state, including clearing the device
  account-history marker) and awaits `purgeLocalState()` (clears
  AsyncStorage) before returning to Splash — not a dead button, and not a
  "contact support" stub (Apple 5.1.1(v) / Play data-safety deletion policy).
- **No blanket/upfront permission requests**: Integrations
  (Google Fit / Apple Health) and Notifications are wired as local
  preference/connection state only. This project has no native
  health-SDK or `expo-notifications` dependency, so there is no real OS
  permission prompt to request yet — rather than fake one, the toggle just
  records intent locally. Wiring a real native integration is future work,
  flagged here rather than simulated.
- **Data collection matches what's disclosed**: the state layer only
  collects the fields the approved screens' data contracts actually ask for
  (profile, targets, diary, weights, workout attempts/sessions, settings).
  Nothing extra is silently gathered.
- **No placeholder content masquerading as real**: user-created Custom
  Foods are labeled with a new, honest `confidence: 'user-entered'` tag
  (see below) rather than falsely implying FCT/USDA provenance. All cited
  nutrition/workout content is unchanged from `data/`.

## Deviations from the shipped screen contracts (minimal, logged)

1. **No real backend exists in this build.** Sign-up/log-in/log-out/delete
   are modeled as local auth-flag transitions over the same
   AsyncStorage-persisted on-device state, not a networked session with a
   field-level server-merge (the sitemap's §0.1 "server wins" merge has no
   server to merge against here). This is a structural simplification, not
   a hidden one — it's called out explicitly in `state/reducer.ts` and
   `AuthScreen.tsx`.
2. **`PlacementStepsBody` / `PlacementResultBody` (`app/src/screens/placement/`)**
   — added a `track: TrackId` prop to both shared bodies, replacing the
   fixed `startingTier: number` prop the leaf screens shipped with
   (`startingTier={2}`, `startingTier={1}` — literal constants, not derived
   from anything). The leaf screens now pass `track="calisthenics"` /
   `track="pilates"` instead; the bodies compute and persist a *real*
   starting tier via `logic/placement.ts` + `SET_PLACEMENT_ANSWERS`, and
   read it back from state. JSX/styling in both files is untouched.
3. **`data/foods.ts`** — added `'user-entered'` to the `Confidence` union so
   user-authored Custom Foods have an honest label distinct from the cited
   FCT/USDA/academic/compiled-estimate tiers. Purely additive to the type;
   no existing food entry's confidence value changed.
4. **`state/types.ts` gained an `onboardingStep` field** (+ `SplashScreen`
   wired to it) so the sitemap's flagged-but-unresolved "pre-auth state
   handling" open question (can an abandoned onboarding draft resume where
   it left off?) has a real, working answer instead of the shipped
   first-launch-only stub.
5. **`SkillTreeHomeScreen`** — the shipped screen had one hardcoded
   "Complete Pilates placement" button regardless of which track(s) were
   actually unplaced, and always showed both tracks as "Placed". Replaced
   with a per-track status badge + CTA ("Complete placement" vs "Continue")
   driven by each track's real `placement` state independently. Same cards,
   same layout — only the badge/button per card now reflects real data.
6. **`GoalSettingsScreen` / onboarding `GoalSetupScreen`** — added a
   `weightGoal: { direction, targetKg }` field to state (the sitemap's Goal
   Settings data contract, `docs/screens.md`, explicitly calls for
   `{ targets, weightGoal }`, but the shipped screen only held the weight
   goal in local, non-persisted component state).
7. **`EditDeleteEntryScreen`**'s contract is `{ entryId }` with no date, but
   diary entries are stored keyed by day. The screen now scans across all
   diary dates for the entry id rather than assuming "today" — a minimal,
   behavior-preserving extension (today's diary is the only place rows
   currently link in from, so this is future-proofing, not a fix for an
   observed bug).
8. **`NutritionHistoryScreen` / `WorkoutHistoryScreen`**: tapping a
   non-today calendar day still opens the Daily Nutrition Summary /
   Session Log for "today," because `RootParamList`'s `DailyNutritionSummary`
   and `WorkoutSessionLog` routes take no date param in the approved
   contract. Real `markedDates` now reflect actual logged days; the
   day-drill-down itself is left as a known limitation rather than
   expanding route params on my own initiative (out of scope: "fix the
   minimum necessary," not a license to redesign navigation params).
9. **Sync-queue "failed" items are schema-only.** `SyncQueueItem.failed`
   exists and `RETRY_SYNC_ITEM` is wired end-to-end, but nothing in this
   build (no real backend) ever marks an item failed — so Data & Sync
   Settings' "Needs attention" list will only ever show "queued, waiting"
   items, never a genuinely failed one. This is an honest reflection of
   "no backend to fail against," not a fabricated failure simulation.
10. **Build-review fix pass (2026-07-12, first re-review of the new
    real-code contract) — three items, all live-verified after fixing:**
    - `data/foods.ts` gained `findFoodWithCustom(id, customFoods)`, resolving
      an id against the curated 32-food dataset **and** `state.customFoods`.
      `data/compute.ts`'s `totalsForEntries` and `microRows` now take an
      explicit `customFoods` parameter and use this resolver instead of the
      static-only `findFood`; every caller (`state/selectors.ts`'s
      `useDayTotals`/`useMicroRows`, `CombinedProgressDashboardScreen`,
      `MicronutrientDetailScreen`) was updated to pass `state.customFoods`
      through. Previously a logged custom food was silently excluded from
      every derived total (diary header, Home card, Daily Summary, Progress
      calorie trend) even though the row itself displayed correctly — a
      false "honest numbers" violation. Live-verified: logging a 200-kcal
      custom food alongside a 290-kcal real food now moves the Food Diary
      header, Home widget, Daily Summary, and Progress calorie-trend point
      to 490 in every surface, not just the row list.
    - `FoodDiaryScreen.tsx` and `EditDeleteEntryScreen.tsx` had bare
      `findFood(e.foodId)` calls with no custom-food fallback, so a custom
      food's diary row/edit-screen title rendered the raw id (e.g.
      `custom-1783828344644`) instead of its name — same root cause as
      above. Both now call `findFoodWithCustom(id, customFoods)`.
      Live-verified: both surfaces now render the real user-entered name.

## Navigation typing (corrected — the prior paragraph here was wrong)

The previous revision of this file claimed every `navigate()` call added
while wiring state "targets a screen registered at the `RootStack` level ...
which React Navigation resolves correctly via parent-hierarchy bubbling."
That claim was **false** and was caught by build re-review: `ConfirmLogScreen`
(`navigate('FoodDiary')`) and `MasteryGateConfirmationScreen`
(`navigate('TierNodeMap', { track })`) are both registered in the
`RootStack`'s modal group, but `FoodDiary` and `TierNodeMap` only exist inside
`MainTabs`' nested `NutritionStack`/`WorkoutStack` (`MainTabs.tsx`). Because
`RootParamList` is one flat, app-wide param list, both calls typechecked
cleanly under `tsc --noEmit` while being runtime no-ops — `navigate()` bubbles
**up** to an ancestor navigator, never **down** into a sibling's nested stack.
Live-verified before the fix: "Save to diary" saved the entry but never
dismissed the modal; Mastery Gate's "Continue" did nothing at all.

Fixed (first attempt, later found incomplete — see "PASS-2 CORRECTION" below)
by using the explicit nested-navigate form at both call sites, targeting the
tab shell directly, e.g. `navigate('Main', { screen: 'NutritionTab', params: {
screen: 'FoodDiary' } })` and, for the Mastery Gate, `Main` -> `WorkoutTab` ->
`TierNodeMap` (with the `track` param nested one level deeper). `popTo('Main')`
alone was considered but rejected for `ConfirmLogScreen` specifically: it
would only land on whatever screen the current tab's nested stack last
showed, which is correct if the flow started from Food Diary but wrong if it
started from Home's "Log Meal".

### PASS-2 CORRECTION: the nested-navigate form alone pushed a duplicate `Main`

Build re-review (second pass) caught that the fix above, while it visually
landed on the right screen, does **not** dismiss the modal chain the way it
looks like it does. Verified by reading `@react-navigation/routers`'
`StackRouter.js` `NAVIGATE` case directly: a plain `navigate(name, params)`
action only reuses an **existing** route in the stack if `name` matches the
**current** focused route, or if a custom `getId` matches, or if `pop: true`
is explicitly passed. Since `ConfirmLog`/`MasteryGateConfirmation` are pushed
several screens above `Main` in the root stack (not the current route), the
plain nested-navigate call fell through to the router's default case and
**appended a brand-new `Main` route** instead of popping back to the existing
one — leaving the entire modal chain mounted and hidden underneath. DOM-level
Playwright counts (see Verification below) showed this precisely: repeated
"Save to diary" taps grew the hidden-screen count and duplicated the mounted
tab bar without bound, and a reopened Add Entry surfaced a second, stale
search input.

Fixed by adding the router's own escape hatch — `navigate(name, params, {
pop: true })` (`CommonActions.navigate`'s 3rd argument, forwarded straight
into the `NAVIGATE` action's `payload.pop`) — which makes `StackRouter` find
the **last** route named `Main` (via `findLast`, regardless of where it sits
in the stack) and rewrite the stack to end there, discarding every modal
screen pushed after it, instead of pushing a duplicate:
```ts
navigation.navigate(
  'Main',
  { screen: 'NutritionTab', params: { screen: 'FoodDiary', pop: true } },
  { pop: true },
);
```
Critically, the **same** dedup problem recurs one level down, inside each
nested `Stack.Navigator` (`NutritionStack`/`WorkoutStack`) itself:
`useNavigationBuilder`'s nested-params resolver (the code that watches a
navigator's own `route.params.screen` and re-dispatches a `NAVIGATE` to
itself) forwards a `pop` field straight through from `route.params.pop` — so
the inner `{ screen: 'FoodDiary', pop: true }` / `{ screen: 'TierNodeMap',
params: { track }, pop: true }` needed their own `pop: true` too, not just the
outer `navigate(...)`'s 3rd argument. Without it, e.g. the Mastery Gate case
(reached via Node Map -> NodeDetail -> LogAttempt -> this modal, so
`WorkoutStack`'s own current route is `LogAttempt`, not `TierNodeMap`) would
still push a duplicate `TierNodeMap` inside `WorkoutStack`'s own history on
every unlock, even after the outer root-stack duplication was fixed. Both
`pop: true` fields are required; this was caught by DOM-counting hidden
screens across two repeated mastery-gate unlocks in a row (see Verification),
which is exactly the kind of growth a single-pass, single-tap screenshot
check cannot surface.

Both fixes were live-verified end to end with real DOM-node counts, not
screenshots (see Verification below): the modal now actually pops (not
pushes) back to the single existing `Main`/`MainTabs` instance and lands on
Food Diary / Tier Node Map, repeated twice each with zero growth in mounted
tab-bar count or hidden/residual screens.

`RootParamList` itself remains one flat list (not restructured into
per-navigator param lists) — this is the structural root cause that let both
bugs typecheck, and it has now bitten three times across this pipeline
(twice in screens, once here). Tightening it into per-navigator param lists
so cross-navigator `navigate()` calls fail to typecheck instead of silently
no-op-ing remains valuable follow-up work, but is out of scope for a "wire
the data" pass — it would mean editing `navigation/types.ts` and every
screen's `useRoute<RouteProp<...>>` generic.

## Verification

```
$ npx tsc --noEmit
(clean, exit 0)

$ npx expo export --platform web
Web Bundled 1188ms app/index.ts (800 modules)
... Exported: dist
```

### Re-verification after the 2026-07-12 build-review fix pass (three items above)

`dist/` served on `127.0.0.1:8899` and driven with Playwright
(`executablePath: /opt/pw-browsers/chromium`), seeding `localStorage`'s
`fitandfed:v1:appstate` directly to skip re-running the already-approved
onboarding flow and jump straight to authenticated in-app state:

- **Custom food included in derived totals:** seeded a real food (Jollof
  Rice, 290 kcal) + built/logged a custom food ("Test Stew", 200 kcal) via
  Add Entry -> Custom -> Custom Food Builder -> "Save & log now" -> Confirm &
  Log -> "Save to diary". Food Diary header went from 290 to **490 / 2211
  kcal**, with both rows correctly named ("Jollof Rice", "Test Stew"). Home
  screen's calorie widget, Daily Nutrition Summary, and the Progress
  dashboard's 7-day calorie trend (peak point at 490 on today's date) all
  independently reflected the same 490 total, confirmed by screenshot.
- **Custom-food name resolution:** `EditDeleteEntryScreen` opened on a seeded
  custom-food diary row and rendered its real name ("Seeded Custom Stew"),
  not the raw `custom-...` id.
- **ConfirmLogScreen "Save to diary" dismiss:** confirmed the modal actually
  dismisses and lands on Food Diary (not a dead button) — verified both from
  Food Diary's own "Add" entry point and structurally via the nested-navigate
  fix that targets `NutritionTab` regardless of entry screen.
- **Mastery Gate "Continue" navigation:** placed at calisthenics Tier 1,
  navigated Workout tab -> Skill Tree Home -> Continue -> Node Map -> Wall
  Push-Up -> Log attempt (25 reps against the 2×20 gate) -> Mastery Gate
  Confirmation ("Mastered!" + "Now unlocked: Incline Push-Up") -> tapped
  "Continue" -> landed back on the Tier/Node Map with Incline Push-Up now
  shown unlocked (star icon replacing the lock, no "Requires:" caption),
  confirmed by screenshot.

`npx tsc --noEmit` re-run clean after all fixes; `npx expo export
--platform web` re-run clean and re-served for the above click-through.

### Re-verification after the 2026-07-12 build-review PASS-2 fix (pop: true)

`dist/` re-exported after the `pop: true` fix above, served on
`127.0.0.1:8899`, driven end-to-end with a fresh Playwright script (real
sign-up/onboarding, no seeded state) that asserts **DOM-level counts**, not
screenshots, per the reviewer's explicit requirement:

- Mounted `MainTabs`/tab-bar instance count, measured via
  `document.querySelectorAll('[role="tab"][aria-label="Home"]').length`
  (`react-native-web` renders each `TabBar` tab as a `div[role="tab"]`; one
  "Home"-labeled tab exists per mounted `AppTabBar`/`MainTabs` instance,
  hidden ones included since `querySelectorAll` ignores CSS
  `display`/`visibility`).
- Hidden/residual screen count, via
  `document.querySelectorAll('div[aria-hidden="true"]')` filtered to
  `style.display === 'none'`.
- Residual text-node counts for `"Save to diary"` and `"Now unlocked"`
  anywhere in the DOM (hidden included), via a `TreeWalker` text scan.

**Results (19/19 assertions passed, 0 console warnings/errors):**
- Baseline on Home: 1 mounted tab bar, 0 hidden screens.
- **"Save to diary" tap #1** (logged Jollof Rice): landed on Food Diary;
  **1 mounted tab bar** (unchanged from baseline); **0** residual "Save to
  diary" text nodes; hidden-screen count returned to **0** (from 3 while the
  modal chain was open, confirming the pop actually discarded it rather than
  merely hiding it).
- **"Save to diary" tap #2** (logged Garri, via Food Diary's own "Add"):
  identical result — 1 mounted tab bar, 0 residual text, hidden screens
  stayed at 0 (no growth vs. tap #1).
- **Reopening Add Entry** after both saves: exactly 1 search input in the DOM
  (no stale duplicate form from a leftover mounted instance).
- **Mastery Gate "Continue" #1** (Wall Push-Up, 25 reps vs. the 20-rep gate,
  unlocking Incline Push-Up): landed on Tier/Node Map; 1 mounted tab bar; 0
  residual "Now unlocked" text; hidden screens 4 -> 1 (one hidden screen is
  the expected/healthy single prior entry in `WorkoutStack`'s own
  back-history — Skill Tree Home beneath Node Map — not unbounded growth).
- **Mastery Gate "Continue" #2** (Incline Push-Up, 20 reps vs. its 15-rep
  gate, unlocking Kneeling Push-Up — a genuinely separate second unlock, not
  a repeat of the first): landed on Tier/Node Map; **1 mounted tab bar (no
  growth vs. #1)**; 0 residual text; hidden screens stayed at **1 (no
  growth vs. #1)** — confirming the inner `WorkoutStack`-level `pop: true`
  fix (see above) actually stops the nested NodeDetail/LogAttempt pile-up
  that an outer-only pop fix would have left in place.
- Node aria-labels post-fix: `"Wall Push-Up, Mastered"` / `"Incline Push-Up,
  Mastered"` — both unlocks genuinely landed, not just the modal dismissing.
- Switching tabs away and back afterward: still exactly 1 mounted tab bar.

`npx tsc --noEmit` clean (exit 0) after this fix; `npx expo export --platform
web` re-run clean and re-served for the above verification.

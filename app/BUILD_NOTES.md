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

## Navigation typing (non-blocking note from screens pass-4, addressed by inspection)

`RootParamList` remains one flat list (not restructured into per-navigator
param lists) — every `navigate()` call added while wiring state targets a
screen registered at the `RootStack` level (placement screens, modals), which
React Navigation resolves correctly via parent-hierarchy bubbling regardless
of which nested tab/stack the call originates from. I did not find a new
instance of the nested-navigator bug the pass-4 review flagged (a `navigate()`
call that typechecks but targets a screen that only exists in a *different*
nested navigator than the caller's). Tightening `RootParamList` into
per-navigator param lists remains optional polish, left for a future pass —
doing it now would mean editing `navigation/types.ts` and every screen's
`useRoute<RouteProp<...>>` generic far beyond "wiring data," which is out of
scope for this stage.

## Verification

```
$ npx tsc --noEmit
(clean, exit 0)

$ npx expo export --platform web
Web Bundled 3123ms app/index.ts (800 modules)
... Exported: dist
```

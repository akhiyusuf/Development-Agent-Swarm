# Screens — Traceability

Real, wired Expo/React Native screens in `app/`, composed only from
`@fit-and-fed/design-system` components (imported by name; never re-implemented)
and connected by a real React Navigation graph (`app/src/navigation/`). Sample
content uses the real datasets `data/nutrition/foods.json` and
`data/workouts/skill-tree.json`; runtime state (diary, weights, sessions, sync
queue) is clearly-labeled placeholder in `app/src/data/sampleData.ts`. Each file
carries a `DATA CONTRACT` block for app-builder. Verified: `tsc --noEmit` exit 0,
`expo export --platform web` succeeded.

Navigation: RootStack = onboarding group (pre-nav, no tab bar) + `Main` (5-tab
shell using the design-system `TabBar`) + a root modal group. The pre-nav entry
router (Splash) implements the §0.2 three-check mechanism (cached session /
onboarding draft / device account-history marker). `app/src/navigation/types.ts`
registers one flat `RootParamList` globally, so every `navigate()` target is
compile-checked.

## Onboarding / Pre-Nav (no tab bar)

| Screen (sitemap) | File | Data contract summary |
|---|---|---|
| Splash / Launch | `app/src/screens/onboarding/SplashScreen.tsx` | `resolveEntry(DeviceEntryState)` three-check router → Home / resume-draft / Auth(login) / ProfileSetup |
| Profile Setup | `app/src/screens/onboarding/ProfileSetupScreen.tsx` | `{name,sex,heightCm,weightKg,activity,goal}` → onboarding draft; [CP-VALIDATION] |
| Goal & Target Setup | `app/src/screens/onboarding/GoalSetupScreen.tsx` | `{computed:Targets}` → adjusted `{kcal,protein,carbs,fat}`; local calc, over-aggressive warning |
| Region & Cuisine Preference | `app/src/screens/onboarding/RegionPreferenceScreen.tsx` | `{market,diaspora}`; drives food DB + unit display |
| Module Interest | `app/src/screens/onboarding/ModuleInterestScreen.tsx` | `{trackNutrition,trainWorkout}`; fork→Placement/Auth; injury-disclaimer blocking ack (E7) |
| Assessment Intro | `app/src/screens/placement/AssessmentIntroScreen.tsx` | per-track intro; Begin/Skip(defer both)/Back |
| Track Selection | `app/src/screens/placement/TrackSelectionScreen.tsx` | `{calisthenics,pilates:PlacementState}`; either/both/defer |
| Calisthenics Placement — Steps | `app/src/screens/placement/CalisthenicsPlacementStepsScreen.tsx` | generic self-report per step; skip=distinct action (§G#18); restart-on-abandon; dual-context `context?:'onboarding'\|'account'` param — §0.2 login link only pre-auth |
| Calisthenics Placement — Result | `app/src/screens/placement/CalisthenicsPlacementResultScreen.tsx` | `{startingTier}` generic; Continue/Retake; dual-context `context` param — §0.2 login link only pre-auth |
| Pilates Placement — Steps | `app/src/screens/placement/PilatesPlacementStepsScreen.tsx` | generic self-report (parallel, distinct criteria); dual-context `context` param — §0.2 login link only pre-auth |
| Pilates Placement — Result | `app/src/screens/placement/PilatesPlacementResultScreen.tsx` | `{startingTier}` generic; Continue/Retake; dual-context `context` param — §0.2 login link only pre-auth |
| Combined Assessment Summary | `app/src/screens/placement/CombinedSummaryScreen.tsx` | both tiers recap; Adjust = review mode (no overwrite); dual-context `context` param — §0.2 login link only pre-auth |
| Sign Up / Log In | `app/src/screens/onboarding/AuthScreen.tsx` | signup attach-draft / login field-merge (§0.1); hard wall (§0.3); [CP-NETFAIL]; forgot-password sheet |
| Onboarding Complete | `app/src/screens/onboarding/OnboardingCompleteScreen.tsx` | `{targets,region,workoutTiers?}`; workout recap omitted if not opted in |

Persistent **"Already have an account? Log in"** affordance
(`app/src/components/PreAuthLoginLink.tsx`) is mounted on Profile Setup, Goal,
Region, Module Interest, and Assessment Intro per §0.2.

## Home (Tab 1)

| Screen (sitemap) | File | Data contract summary |
|---|---|---|
| Home (Today Dashboard) | `app/src/screens/home/HomeScreen.tsx` | `{entries,targets,queuedCount, logMeal/logWorkoutSession/quickAddWeight}`; energy card, micro snapshot (Req 4 no-data), sync row; quick actions overlay+rejoin (F1) |

## Nutrition (Tab 2)

| Screen (sitemap) | File | Data contract summary |
|---|---|---|
| Food Diary (Today) | `app/src/screens/nutrition/FoodDiaryScreen.tsx` | `{entries:DiaryEntry[]}` grouped by slot; queued badge; empty-slot state |
| Add Entry (modal) + Food Search Results | `app/src/screens/nutrition/AddEntryScreen.tsx` | `{recentIds,favoriteIds,search()}`; Search tab renders N3 inline; [CP-EMPTY-SEARCH]; offline fallback |
| Ingredient Detail | `app/src/screens/nutrition/IngredientDetailScreen.tsx` (+ `FoodDetailBody.tsx`) | `{foodId}`; household-unit picker + portion-photo reference + macro/micro preview |
| Composite Meal Detail | `app/src/screens/nutrition/CompositeMealDetailScreen.tsx` (+ `FoodDetailBody.tsx`) | as above + recipe-level extras / valueSpread |
| Portion Reference Guide (modal) | `app/src/screens/nutrition/PortionReferenceGuideScreen.tsx` | `{foodId}`; expanded portion tiles; photo-pending fallback (data gap) |
| Custom Food / Meal Builder | `app/src/screens/nutrition/CustomFoodBuilderScreen.tsx` | new FoodItem-shaped record; Save / Save&log→ConfirmLog |
| Confirm & Log (modal) | `app/src/screens/nutrition/ConfirmLogScreen.tsx` | `{foodId,unitLabel,quantity,slot,customName?}`; [CP-VALIDATION]/[CP-OFFLINE] |
| Edit / Delete Entry (modal) | `app/src/screens/nutrition/EditDeleteEntryScreen.tsx` | `{entryId}`; edit portion/slot; delete w/ explicit confirm |
| Daily Nutrition Summary | `app/src/screens/nutrition/DailyNutritionSummaryScreen.tsx` | `{entries,targets}`; full micro panel, per-nutrient no-data, tap→detail |
| Micronutrient Detail | `app/src/screens/nutrition/MicronutrientDetailScreen.tsx` | `{nutrientKey,label,unit}`; trend w/ gaps; B12 coverage-gap state |
| Nutrition History / Calendar | `app/src/screens/nutrition/NutritionHistoryScreen.tsx` | `{markedDates}`; tap day→summary |
| Favorites & Recents Management | `app/src/screens/nutrition/FavoritesRecentsScreen.tsx` | `{favoriteIds,recentIds}`; quick-log→ConfirmLog; per-section empty |

## Workout (Tab 3) — mechanism + real cited content

| Screen (sitemap) | File | Data contract summary |
|---|---|---|
| Skill Tree Home | `app/src/screens/workout/SkillTreeHomeScreen.tsx` | track selector + per-track summary; deferred-placement re-entry (A9) |
| Tier / Node Map | `app/src/screens/workout/TierNodeMapScreen.tsx` | `{track}` + `nodeState(id)`; locked non-interactive; real node names |
| Node Detail | `app/src/screens/workout/NodeDetailScreen.tsx` | `{nodeId}` calisthenics node OR Pilates tier; threshold+confidence+form cue |
| Log Attempt (modal) | `app/src/screens/workout/LogAttemptScreen.tsx` | `{nodeId}`; reps/hold; client-side gate eval→MasteryGate/in-progress |
| Mastery Gate Confirmation (modal) | `app/src/screens/workout/MasteryGateConfirmationScreen.tsx` | `{nodeId}`; mastered + downstream unlocked; node vocabulary |
| Progression Status | `app/src/screens/workout/ProgressionStatusScreen.tsx` | per-line now/next across both tracks |
| Workout Session Log (modal) | `app/src/screens/workout/WorkoutSessionLogScreen.tsx` | `{rows:SessionRow[]}`; **freeform only, no Session Player**; discard-whole-on-backout |
| Workout History / Session Calendar | `app/src/screens/workout/WorkoutHistoryScreen.tsx` | `{markedDates,sessions}`; empty state→Log Session |

## Progress (Tab 4)

| Screen (sitemap) | File | Data contract summary |
|---|---|---|
| Combined Progress Dashboard | `app/src/screens/progress/CombinedProgressDashboardScreen.tsx` | `{weights,calTrend,targets,workoutTiers}`; 3 separate titled sections (carry-forward #6); workout section omitted if not opted in |
| Weight Log | `app/src/screens/progress/WeightLogScreen.tsx` | `{entries}`; trend + list; delete w/ confirm |
| Quick-add Weight (modal) | `app/src/screens/progress/QuickAddWeightScreen.tsx` | numeric + plausible-range [CP-VALIDATION]; returns to caller (F1) |
| Goal Settings / Adjust Targets | `app/src/screens/progress/GoalSettingsScreen.tsx` | `{targets,weightGoal}`; same-day recalc (D3) |

## Profile / Settings (Tab 5)

| Screen (sitemap) | File | Data contract summary |
|---|---|---|
| Profile | `app/src/screens/profile/ProfileScreen.tsx` | `{profile}` edit + settings menu (tab root; no separate menu screen in sitemap) |
| Account Settings | `app/src/screens/profile/AccountSettingsScreen.tsx` | email/pw [CP-NETFAIL]; delete (purge+marker clear, E2); logout warn-on-queue |
| Data & Sync Settings | `app/src/screens/profile/DataSyncSettingsScreen.tsx` | `{queuedCount,failedItems,lowDataMode}`; terminal surface for [CP-OFFLINE] |
| Integrations | `app/src/screens/profile/IntegrationsScreen.tsx` | provider state machine; [CP-PERMDENY] not-connected+retry |
| Region & Language Settings | `app/src/screens/profile/RegionLanguageSettingsScreen.tsx` | `{market,showGrams,language}`; forward-only unit display (§G#12) |
| Notifications Settings | `app/src/screens/profile/NotificationsSettingsScreen.tsx` | category toggles + quiet hours |
| Legal & Disclaimers | `app/src/screens/profile/LegalDisclaimersScreen.tsx` | privacy + injury + not-medical-advice; Acknowledge gate (E7) |
| Help / Support | `app/src/screens/profile/HelpSupportScreen.tsx` | expandable FAQ + contact ([CP-NETFAIL]/queue) |

## Component gaps

**None.** Every component the sitemap's screens need exists in the design
system and is imported by name — including the six primitives the legacy prose
spec had flagged as gaps (SegmentedControl, SingleSelectChips, ToggleSwitch,
CalendarDatePicker, TrendChart, ListRow), all now real design-system exports and
used above. The only app-level components (`ui/layout.tsx`, `PreAuthLoginLink`,
`OnboardingProgress`, `MicroBar`) are thin *composition/layout* helpers over
design-system primitives + theme tokens (the design system exports no Text /
Screen / form-scaffold primitive) — not re-implementations of any existing
design-system component.

### Scope / content notes (not component gaps)

- **Guided Session Player has no sitemap destination.** The design system ships
  a `SessionPlayer` (with calisthenics + Pilates presets), but the Workout
  module is scoped to freeform logging. Per the carry-forward, **W7 is
  freeform-logging-only and no Session Player screen was built**; `SessionPlayer`
  is intentionally unused until a sitemap destination exists.
- **Portion reference photography is a content gap** (data-sourcing.md), not a
  component gap. The design-system `PortionPhotoReference` is wired on Ingredient
  Detail, Composite Meal Detail, and the Portion Reference Guide; with no bundled
  reference photos yet, its inline tile self-omits (its documented no-photo
  behavior) and the guide shows the photo-pending fallback — never a broken box.
- **Micronutrient coverage gap** (data-sourcing.md #4): B12 and most micros have
  near-zero African-food coverage, so the Home snapshot, Daily Summary panel, and
  Micronutrient Detail trend surface honest "no data" states rather than false
  zeros — the app faithfully reflects the dataset's real limits.

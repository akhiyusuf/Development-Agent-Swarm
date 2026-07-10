# Sitemap

Source: `research/product-research.md` (research-product stage, approved, pass 2).

Scope note carried forward from research: this is **one app, two modules** sharing an
account/profile/energy-balance layer — Nutrition (flagship, launches first) and
Workout (bodyweight calisthenics + Pilates skill tree, fast-follow). Per Open Question 1
in the research, the **actual skill-tree contents** (which named skills, in what order,
with what specific time/rep thresholds) are explicitly unvalidated. This sitemap
structures the workout module around the **tier / node / mastery-gate mechanism only**
— screens, states, navigation, and data the mechanism needs — using generic placeholder
node names (`[Skill Node]`) rather than asserting a real progression as fact. Populating
real node content is a downstream content-validation task, not a sitemap decision.

---

## 1. Screen List & Hierarchy

### A. Pre-Nav / Onboarding Flow

- **Splash / Launch**
- **Sign Up / Log In** (email+password; forgot-password sub-flow)
- **Profile Setup** — name, sex, height, current weight, activity level, primary goal (lose/maintain/gain)
- **Goal & Target Setup** — calorie/macro targets computed or user-adjusted
- **Region & Cuisine Preference** — Nigeria / Ghana / Kenya (v1 markets) + optional Western/diaspora food set
- **Module Interest Screen** — "Track nutrition," "Train (calisthenics/Pilates)," or both (nutrition always on; workout module may be marked "coming soon" until it ships as fast-follow — this screen exists to support the research's sequencing recommendation, not a numbered requirement)
- **Workout Placement Assessment** *(only entered if user opts into the workout module)*
  - Assessment Intro (what it measures overall, safety note, and — since the workout module has two independent tracks — states up front that placement is done **per track**: a user may take the Calisthenics placement, the Pilates placement, or both, depending on which track(s) they opted into)
  - **Track Selection (for placement)** — if the user opted into both tracks at Module Interest, they choose whether to complete Calisthenics placement, Pilates placement, or both now (either order; either can be deferred and completed later from Skill Tree Home)
  - **Calisthenics Placement**
    - Assessment Steps (a short series of movement-pattern checks — push / pull / squat-hinge / core-hold; generic, content TBD)
    - Assessment Results → Calisthenics Starting Tier Placement
  - **Pilates Placement**
    - Assessment Steps (a short series of Pilates-appropriate checks — e.g., core/breath control, mobility, mat-position tolerance; generic, content TBD — kept structurally parallel to the calisthenics steps but not asserting the same criteria, since Pilates placement is a materially different discipline)
    - Assessment Results → Pilates Starting Tier Placement
  - Combined Assessment Summary (shown only if both tracks were completed) — one screen recapping both starting placements before continuing
- **Onboarding Complete / Welcome Summary**

### B. Primary Navigation (bottom tabs, top-level)

1. **Home**
2. **Nutrition**
3. **Workout**
4. **Progress**
5. **Profile / Settings**

---

#### 1. Home (Today Dashboard) — top-level

- Energy-balance summary card (calories in vs. target, macro rings)
- Micronutrient snapshot widget (partial-coverage-aware, "no data" state supported)
- Quick actions: **Log Meal** (→ Nutrition add-entry modal), **Log Workout Session** (→ Workout session logging)
- Sync/offline status indicator (queued entries pending sync)

#### 2. Nutrition — top-level tab, nested screens below

- **Food Diary (Today)** — entries grouped by meal (breakfast/lunch/dinner/snack)
  - **Add Entry** (modal/sheet) — tabs: Search / Recent / Favorites / Custom
    - **Food Search Results**
    - **Ingredient Detail** — household-unit portion selector (wrap, cup, ladle, "swallow," etc. + gram equivalent), **portion-photo reference** (photos showing what the selected household unit looks like in practice — e.g., "1 ladle," "half plate," "1 wrap" — displayed alongside the unit picker so users can visually confirm portion size rather than guess from a label alone; this is the entry-point differentiator the research names as the market's #1 still-open gap), macro + micronutrient preview
    - **Composite Meal Detail** (e.g., a named local prepared dish) — same portion-selector pattern including the portion-photo reference, recipe-level nutrition
    - **Portion Reference Guide** (sheet/modal, reachable from the portion selector on Ingredient Detail or Composite Meal Detail) — expanded photo set for the given food/household unit (e.g., multiple reference angles or a range from "small ladle" to "heaping ladle") for cases where a single inline thumbnail isn't enough to disambiguate portion size
    - **Custom Food / Meal Builder** — user creates and saves an ingredient or composite meal
    - **Confirm & Log** — meal-slot assignment, quantity, save
  - **Edit / Delete Entry** (modal, from diary row)
- **Daily Nutrition Summary** — calories, macro breakdown, full micronutrient panel with graceful "no data for this food" states
- **Micronutrient Detail** (per nutrient, e.g. weekly trend for iron/zinc/calcium/vitamin A/folate/B12)
- **Nutrition History / Calendar** — past days, tap into any day's diary/summary
- **Favorites & Recents Management** — nested under Nutrition, reachable from Add Entry or a Nutrition sub-menu

#### 3. Workout — top-level tab, nested screens below *(fast-follow; mechanism only, see scope note)*

- **Skill Tree Home** — track selector: Calisthenics track / Pilates track (or combined view); also the entry point to complete a track's placement assessment later if it was deferred at onboarding
- **Tier / Node Map** — visual tree per track; each node shows locked / in-progress / mastered state and its prerequisite node(s)
- **Node Detail** — `[Skill Node]` name (placeholder), current status, prerequisite(s), unlock requirement (time-hold or rep-threshold, values TBD by validated content), form-cue instructional content
- **Log Attempt** (modal, from Node Detail) — user enters reps completed or hold duration
- **Mastery Gate Confirmation** — shown when a logged attempt meets/exceeds the node's threshold; confirms unlock of downstream node(s)
- **Progression Status** — per skill line, "what you're on now / what's next," across both tracks
- **Workout Session Log** — freeform log of a training session (which nodes attempted, reps/holds recorded)
- **Workout History / Session Calendar**

#### 4. Progress — top-level tab (shared layer)

- **Combined Progress Dashboard** — weight trend, calorie-balance trend, workout tier-progression summary in one view (the cross-module payoff)
- **Weight Log** — add/view weight entries (also reachable as a quick-add from Home)
- **Goal Settings / Adjust Targets** — revise calorie/macro targets and weight goal

#### 5. Profile / Settings — top-level tab

- **Profile** — edit personal info, goals
- **Account Settings** — email/password, delete account
- **Data & Sync Settings** — offline-mode status, manual sync trigger, low-data-mode toggle
- **Integrations** — Google Fit / Apple Health connect (optional sync)
- **Region & Language Settings** — market (Nigeria/Ghana/Kenya), household-unit display preferences
- **Notifications Settings**
- **Legal & Disclaimers** — health-data privacy notice, workout injury-liability disclaimer, "tracking/education, not medical advice" positioning
- **Help / Support**

### Modals / Overlays (cut across tabs, not standalone nav destinations)
- Add Food Entry sheet
- Edit/Delete Diary Entry
- Portion Reference Guide (photo set)
- Log Workout Attempt sheet
- Mastery Gate Confirmation
- Quick-add Weight Entry

---

## 2. Navigation Hierarchy Summary

- **Top-level (bottom tab bar):** Home, Nutrition, Workout, Progress, Profile/Settings.
- **Nested (drill-down within a tab):** Food Diary → Add Entry → Food Detail/Composite Meal Detail (→ Portion Reference Guide) → Confirm & Log; Skill Tree Home → Tier/Node Map → Node Detail → Log Attempt.
- **Modal (transient, dismissable, no deep nav state):** Add Entry sheet, Edit/Delete entry, Portion Reference Guide, Log Attempt sheet, Mastery Gate Confirmation, quick-add Weight Entry.
- **Pre-nav (one-time, sequential, not part of tab bar):** Splash → Auth → Profile Setup → Goal Setup → Region Preference → Module Interest → (conditional) Workout Placement Assessment (per-track: Assessment Intro → Track Selection → Calisthenics Placement and/or Pilates Placement → Combined Assessment Summary if both) → Welcome.
- **Workout tab visibility:** the tab and its nested tree may ship disabled/"coming soon" at nutrition-only launch per the research's sequencing recommendation, then activate as a fast-follow — this is a rollout/build-sequencing note, not a structural change to the sitemap.

---

## 3. Requirements Traceability Table

| # | Core Feature Requirement (from product-research.md) | Screen(s) |
|---|---|---|
| 1 | Regional-food database with real household-unit portions **plus a portion-photo reference set** | Ingredient Detail (unit picker + portion-photo reference), Composite Meal Detail (same), Portion Reference Guide (expanded photo set), Food Search Results, Region & Language Settings (unit/market preference) |
| 2 | Fast logging of composite/local meals + search/recent/favorites/custom | Add Entry (Search/Recent/Favorites/Custom tabs), Composite Meal Detail, Custom Food/Meal Builder, Favorites & Recents Management, Confirm & Log |
| 3 | Macro tracking against goals | Daily Nutrition Summary, Food Diary (Today), Home (energy-balance card), Goal Settings/Adjust Targets, Nutrition History/Calendar |
| 4 | Micronutrient data (vitamins & minerals) with graceful "no data" states | Daily Nutrition Summary (micronutrient panel), Micronutrient Detail, Home (micronutrient snapshot widget), Ingredient/Composite Meal Detail (per-food preview) |
| 5 | Offline-first logging with later sync | Home (sync/offline status indicator), Data & Sync Settings, Add Entry / Log Attempt modals (must queue offline) |
| 6 | Defined skill tree (calisthenics + Pilates), tiered, nodes with explicit prerequisites | Skill Tree Home, Tier/Node Map, Node Detail |
| 7 | Objective mastery gates (time hold / rep threshold) | Node Detail (states threshold), Log Attempt, Mastery Gate Confirmation |
| 8 | Per-user progression state (current tier + thresholds logged toward next unlock) | Tier/Node Map (per-node state), Progression Status, Workout History/Session Calendar |
| 9 | Clear entry point / beginner-placement onboarding assessment, **per track (calisthenics and Pilates each need their own placement, since a user may want one, the other, or both)** | Workout Placement Assessment (Assessment Intro, Track Selection, Calisthenics Placement, Pilates Placement, Combined Assessment Summary), Skill Tree Home (deferred-placement entry point) |
| 10 | Exercise instruction per node (form cues, what "clean" means) | Node Detail |
| 11 | Simple session logging (reps, hold duration) feeding progression engine | Log Attempt, Workout Session Log, Workout History/Session Calendar |
| 12 | Single account tying nutrition + training, lightweight profile/weight/goal tracking, shared energy-balance model | Sign Up/Log In, Profile Setup, Profile, Weight Log, Goal Settings/Adjust Targets, Combined Progress Dashboard, Home |
| 13 | Android-first, low-data, low-end-device-friendly build; optional Google Fit/Apple Health sync | Data & Sync Settings (low-data-mode toggle, partial coverage only), Integrations (Google Fit/Apple Health) — *see flag below* |

---

## 4. Flags

### Screens not tracing to a single numbered requirement
- **Module Interest Screen** (onboarding) — supports the research's explicit nutrition-first / workout-fast-follow sequencing recommendation, but isn't itself one of the 13 numbered Core Feature Requirements. Kept because the recommendation is load-bearing for how/when the Workout tab activates.
- **Home (Today Dashboard)** — an aggregation view combining Req 3 and Req 12 data rather than a single requirement's screen. Intentional; flagged for awareness, not a gap.
- **Legal & Disclaimers** — driven by the Constraints & Risks section (injury liability, health-data regulatory positioning: NDPR/NDPA, GDPR/CCPA) rather than the numbered Core Feature Requirements. Flagged as necessary risk-mitigation, added deliberately.

### Requirements without a fully dedicated screen
- **Req 13 (Android-first, low-data, low-end-device build)** is primarily an engineering/performance constraint, not a page. Data & Sync Settings exposes a low-data toggle and manual sync, and Integrations exposes optional Health/Fit sync, but the bulk of Req 13 (small footprint, offline resilience across every screen, low-end device performance) is a cross-cutting build requirement that should be tracked as an engineering checklist against every screen in this sitemap, not satisfied by one destination.
- No other numbered requirement (1–12) is currently screen-less.

### Explicitly deferred (per research's "deliberately out of scope")
Social/community feeds, barcode scanning, AI photo recognition, wearable-ecosystem screens beyond basic Health/Fit sync, meal-planning/recipe generation, and any gym/external-load tracking screens are intentionally absent — consistent with the research's stated out-of-scope list.

---

Sitemap complete. Ready for review before screen design stage.

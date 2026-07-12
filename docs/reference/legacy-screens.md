# Screen Designs

**Status:** derived from `docs/sitemap.md` (sitemap stage, approved, pass 2) and
`docs/design-system.md` (design-system stage, approved, pass 3). Both dependencies are
marked `approved` in `pipeline/state.json`. This document designs each screen in the
sitemap using **only** the components, tokens, and rules defined in the design system.
Where a screen needs something the design system does not yet define, it is called out
explicitly as a **[GAP]** rather than invented silently (see §Consolidated component
gaps at the end).

## How to read this document

- Every section cross-references its **sitemap entry** (the line/screen it implements)
  and the **design-system components** (`§`-numbered) it composes from.
- **P:** primary action, **S:** secondary action(s) — matched to the sitemap's stated
  purpose for that screen.
- Node/tier/gate UI is described **generically** per the sitemap's scope note and
  research Open Question 1 — no invented exercise names, thresholds, orderings, or
  progression content. `[Skill Node]` placeholders are preserved.
- Token names (e.g., `color.node.unlocked` `#A85F12`) refer to the approved design-system
  values only. Superseded draft hexes (`#C98A2E`, `#E0BE7C`) are never used.

## Carry-forward resolutions (applied throughout)

These seven items were flagged by the reviewer for the screens stage. Each is resolved
here and applied consistently in the sections below:

1. **Skill-node placeholder discipline** — every workout screen describes node/tier/gate
   *structure, state, and behavior* only; no real exercise names, thresholds, or orderings.
   `[Skill Node]` placeholders and `TBD` thresholds are preserved verbatim from the sitemap.
2. **Portion-photo reference (§4.4) as first-class** — appears as a real, described element
   on **Ingredient Detail**, **Composite Meal Detail**, and the dedicated **Portion
   Reference Guide** screen (its core content), not merely implied.
3. **Per-track / deferrable placement states** — the Workout Placement Assessment sections
   cover Track Selection → Calisthenics **and/or** Pilates placement (either or both, either
   order), the optional Combined Assessment Summary, **and** the deferred-placement re-entry
   point on Skill Tree Home.
4. **Approved color hexes only** — unlocked node fill and boss/mastered outline use
   `color.node.unlocked` `#A85F12`; the Pilates player progress indicator uses
   `color.primary.gold-muted` `#7A4E12`. The rejected draft hexes `#C98A2E` and `#E0BE7C`
   are used nowhere.
5. **Locked-node tappability — DECIDED: locked nodes are fully non-interactive until
   unlocked.** A locked node is a "not-yet-available" indicator, not a control; it does not
   respond to taps and does not open a detail/technique view. The sitemap's "tapping a node
   opens a detail view" convention therefore applies to **unlocked, in-progress, completed,
   and mastered nodes only**. Unlock requirements are shown on the *unlocked/in-progress*
   Node Detail and as a static non-interactive caption near a locked node on the map — never
   by making the locked node itself tappable. **Consequence:** the design system's §1.4 /
   §6.10 WCAG 1.4.11 inactive-component contrast exemption for `color.node.locked`
   **remains valid and requires no follow-up.** (Had locked nodes been made tappable, that
   exemption would have been invalidated and flagged as a design-system follow-up; because
   they are not, nothing changes.)
6. **Combined Progress Dashboard color adjacency** — the carbs macro-ring (`gold-dark`
   `#A9761E`) is never placed directly adjacent to unlocked-node indicators (`#A85F12`)
   without each carrying its required §6.5 icon/label pairing; the two are additionally
   separated into distinct titled sections on that screen. See §Combined Progress Dashboard.
7. **Dark-mode node maps** — Skill Tree Home, Tier/Node Map, and Node Detail render on
   `color.neutral.dark-bg` `#17181A` (not `dark-surface`) in dark mode, and the mastered
   node's **outline (`#A85F12`) and star/badge icon** — not its fill (`#A8452A`) — carry the
   primary contrast signal in dark mode, since the mastered fill is only marginally compliant
   on dark surfaces.

---

# A. Onboarding / Pre-Nav Flow

These are one-time, sequential screens (not part of the tab bar). All use the **light**
warm palette, single-column 4-column grid, `space.16` outer margins, **Relaxed** density
(§3) since they are slower, first-run screens. A lightweight top progress indicator
(step N of M, text + a determinate bar) shows sequence position. The bar reuses the
progress-bar pattern (§4.10) with a `color.primary.terracotta` fill on a
`color.neutral.warmgray-400` track.

## A1. Splash / Launch
- **Sitemap:** Onboarding Flow → "Splash / Launch".
- **Layout:** Full-bleed `color.neutral.warmgray-100` background; centered app wordmark
  (real text, `type.display`, `color.primary.terracotta` — never text baked into an image,
  §6.9). No decorative pattern/motif (per design-system §0). A single centered indeterminate
  loading affordance appears only if a session-restore/network check runs longer than a
  threshold; otherwise the screen auto-advances.
- **Components:** none beyond a text title and background token; no interactive controls.
- **States:** loading (checking cached session) → routes to Home if a valid session exists,
  else to A2. Offline is a valid, non-error state (§6.8): a cached session still routes to Home.
- **Actions:** none (transient).
- **Responsive:** identical on all widths; wordmark stays centered.

## A2. Sign Up / Log In (+ forgot-password sub-flow)
- **Sitemap:** "Sign Up / Log In (email+password; forgot-password sub-flow)". Traceability
  Req 12.
- **Layout:** Screen title (`type.h1`). A segmented "Log In / Sign Up" switch at top
  **[GAP: segmented control]** — the design system has no segmented/tab control component;
  see Consolidated gaps. Below: email input and password input (§4.2), a **Primary button**
  (§4.1) "Log in" / "Create account", a **Text/tertiary button** (§4.1) "Forgot password?".
- **Inputs / states (§4.2):** default, focus (2px terracotta border), error (2px
  `color.semantic.error` border + trailing error icon + `type.caption` message — never color
  alone, §6.5). Password field has a show/hide affordance (icon button, 44×44pt hit area).
- **Forgot-password sub-flow:** a bottom sheet (§4.9) with one email input + Primary button
  ("Send reset link") and a success confirmation state (inline banner, `color.semantic.success`
  with icon). Fully dismissable, no deep nav state (matches sitemap's "modal" convention).
- **Actions:** **P:** Log in / Create account. **S:** Forgot password; switch mode.
- **Offline:** auth requires connectivity; on offline, the Primary button surfaces an inline
  §4.9-style error banner ("You're offline — connect to sign in"), not a crash/toast storm.
- **Responsive:** on wider viewports the form column is centered and max-width-capped
  (~480px) rather than full-bleed.

## A3. Profile Setup
- **Sitemap:** "Profile Setup — name, sex, height, current weight, activity level, primary
  goal (lose/maintain/gain)". Req 12.
- **Layout:** Title (`type.h1`), then grouped form fields in a single card (§4.5):
  - Name — text input (§4.2).
  - Sex — single-select choice **[GAP: radio / single-select segmented form control]**.
    Rendered for now as a row of selectable chips reusing the portion-picker chip visual
    pattern (§4.3: outlined `warmgray-400`, selected fill `terracotta` + white) as the
    closest existing token set — flagged because §4.3 is scoped to portion units, not a
    general single-select.
  - Height, Current weight — numeric inputs (§4.2) with a unit affordance (cm/ft, kg/lb)
    honoring Region & Language unit preference (A5 / Region settings).
  - Activity level — same single-select chip pattern **[GAP as above]**.
  - Primary goal (lose / maintain / gain) — same single-select chip pattern **[GAP]**.
- **Actions:** **P:** Continue (Primary button, disabled until required fields valid — §4.1
  disabled palette, not opacity alone). **S:** Back (tertiary).
- **Responsive:** single column mobile; two-column field pairing (height/weight) permitted
  at wider widths within the 4-col grid.

## A4. Goal & Target Setup
- **Sitemap:** "Goal & Target Setup — calorie/macro targets computed or user-adjusted". Req 3, 12.
- **Layout:** Title. A summary card (§4.5) showing the **computed** daily calorie target and
  macro split, visualized with the **progress rings/bars (§4.10)** in preview mode: calories =
  terracotta, protein = deep green, carbs = `gold-dark` `#A9761E`, fat = info-blue (fixed
  macro vocabulary). Each ring carries its text label + value (§6.5). Below: an "Adjust
  targets" expandable area with numeric inputs (§4.2) + stepper controls to override calorie
  and per-macro values; edits re-render the rings live.
- **States:** computed (default) vs user-adjusted (an "edited" `type.micro` tag appears).
  Over-aggressive adjustments trigger a `color.semantic.warning` caption (never a blocking
  error) advising a safer range.
- **Actions:** **P:** Continue. **S:** Reset to computed; Back.
- **Responsive:** rings stack vertically on narrow; 2-up on wider.

## A5. Region & Cuisine Preference
- **Sitemap:** "Region & Cuisine Preference — Nigeria / Ghana / Kenya (v1 markets) +
  optional Western/diaspora food set". Req 1 (unit/market preference).
- **Layout:** Title + helper caption. Market single-select (Nigeria / Ghana / Kenya) using
  the chip single-select pattern **[GAP: single-select form control, as A3]**. Below, a
  multi-select toggle list to additionally enable the Western/diaspora food set
  **[GAP: toggle/switch component]** — the design system has no switch component; see
  Consolidated gaps. A `type.caption` note explains this drives the food database and
  household-unit display defaults.
- **Actions:** **P:** Continue. **S:** Back.
- **Responsive:** single column; chips wrap.

## A6. Module Interest Screen
- **Sitemap:** "Module Interest Screen — 'Track nutrition,' 'Train (calisthenics/Pilates),'
  or both … workout module may be marked 'coming soon' until it ships". Flagged as
  requirement-less but load-bearing for sequencing.
- **Layout:** Title + short explainer. Two large selectable **Cards** (§4.5), tappable:
  - "Track nutrition" — always on; shown as pre-selected/locked-on with a checkmark, using
    the `color.semantic.success` + icon pairing (§6.5), copy noting it's the flagship.
  - "Train (calisthenics / Pilates)" — selectable; if the workout module is shipping later,
    this card uses the **Card disabled state** (§4.5: 60% opacity + `warmgray-700` text) with
    a `type.micro` "Coming soon" badge, and selecting it registers interest without enabling
    the tab. If the module is live, it's a normal selectable card.
- **Branching:** if the user selects (and the module is live) the workout option, the flow
  continues to A7 (Placement Assessment). If nutrition-only, it skips A7 to A8.
- **Actions:** **P:** Continue. **S:** Back.
- **Responsive:** cards stack on mobile, side-by-side on wider.

## A7. Workout Placement Assessment (per-track flow)
- **Sitemap:** entered only if the user opts into the workout module. Sub-flow:
  Assessment Intro → Track Selection → Calisthenics Placement and/or Pilates Placement
  (either or both, either order) → Combined Assessment Summary (only if both). Req 9.
- This flow is **Relaxed** density and preserves node/tier placeholder discipline throughout:
  no real assessment items, criteria, thresholds, or resulting skill names are asserted —
  only the generic step structure the sitemap defines.

### A7a. Assessment Intro
- **Layout:** Title (`type.h1`), body copy stating what placement measures overall, a
  **safety note** in a `color.semantic.info`-accented callout card (§4.5 + §1.3 info, icon +
  text, never color alone), and — since the module has two independent tracks — copy stating
  up front that **placement is done per track** (a user may take Calisthenics, Pilates, or
  both, per the track(s) they opted into).
- **Actions:** **P:** Begin. **S:** "Skip for now / do this later" (tertiary button) — this
  defers placement; the flow proceeds to A8 and placement becomes reachable later from Skill
  Tree Home (see §Skill Tree Home). **S:** Back.

### A7b. Track Selection (for placement)
- **Shown only if** the user opted into **both** tracks at A6 (per sitemap). If only one track
  was chosen, this step is skipped and the flow enters that track's placement directly.
- **Layout:** Title + copy. Two selectable Cards (§4.5): "Calisthenics placement" and
  "Pilates placement", each with an independent completion state indicator (not-started /
  in-progress / done) using an icon + `type.micro` label (§6.5). The user may pick either
  order, do one now and defer the other, or do both.
- **States:** each track card shows: not-started (default), done (checkmark +
  `color.semantic.success` pairing), or deferred. A "Continue" Primary button is enabled once
  at least one track is complete **or** the user chooses to defer the rest.
- **Actions:** **P:** Start selected track's placement. **S:** "Do the other later" (defers,
  routes onward); Back.

### A7c. Calisthenics Placement — Steps
- **Layout:** A short series of movement-pattern checks (push / pull / squat-hinge / core-hold
  — **generic, content TBD**, stated at exactly the sitemap's abstraction level; no specific
  exercises, reps, or thresholds invented). Each step is one single-focus card: an instruction
  area (real text; if a demo still is used it is authentic photography per §0, compressed/
  cached per §6.8), and a self-report control (the numeric input/stepper from §4.2/§4.3 for a
  count or a simple can/can't single-select chip **[GAP: single-select form control]**).
- **Step progress:** the top determinate bar (§4.10 pattern) shows step position.
- **Actions:** **P:** Next / (on last step) See result. **S:** Back; "Skip this step".

### A7d. Calisthenics Placement — Results → Starting Tier Placement
- **Layout:** Result card (§4.5) presenting the computed **starting tier** for the
  calisthenics track, described generically as a tier position (e.g., "You'll start at
  Tier N" with N from the placement logic, **not** a named skill or asserted progression).
  A short explainer caption states this is a starting point that adjusts as the user logs
  attempts. No invented node names appear.
- **Actions:** **P:** Continue (→ Track Selection if the other track remains, else →
  Combined Summary if both done, else → A8). **S:** "Retake"; Back.

### A7e. Pilates Placement — Steps
- **Layout:** Structurally parallel to A7c but with Pilates-appropriate generic checks (e.g.,
  core/breath control, mobility, mat-position tolerance — **generic, content TBD**, kept
  parallel to but **not** asserting the same criteria as calisthenics, since Pilates is a
  materially different discipline). Single-focus card per step; self-report controls as in A7c.
- **Actions:** **P:** Next / See result. **S:** Back; Skip step.

### A7f. Pilates Placement — Results → Starting Tier Placement
- **Layout:** Mirror of A7d for the Pilates track — a generic starting-tier result, no invented
  Pilates skill names or thresholds.
- **Actions:** **P:** Continue (routing as in A7d). **S:** Retake; Back.

### A7g. Combined Assessment Summary
- **Sitemap:** "shown only if both tracks were completed — one screen recapping both starting
  placements before continuing".
- **Layout:** Title. Two result cards stacked (§4.5), one per track, each restating that
  track's generic starting tier with its accent (calisthenics uses the workout-mode
  `color.primary.deepgreen` section accent; both remain generic — no node content). This
  screen appears **only** in the both-tracks path.
- **Actions:** **P:** Continue → A8. **S:** "Adjust a placement" (routes back to the relevant
  track's result); Back.

## A8. Onboarding Complete / Welcome Summary
- **Sitemap:** "Onboarding Complete / Welcome Summary".
- **Layout:** A single-focus celebratory summary using `type.display` for the headline (used
  sparingly per §2). Recaps: goal + calorie/macro target (mini rings, §4.10), region, and — if
  workout opted-in — the starting tier(s) generically. Motion respects reduced-motion (§6.4):
  any celebratory scale/fade has an instant static fallback; no flashing (§6.4).
- **Actions:** **P:** "Go to Home" (enters the tab shell at Home). **S:** none needed.
- **Responsive:** centered, max-width-capped on wide.

---

# B. Primary Navigation Shell

All five top-level tabs live in the **tab bar (§4.6):** Home, Nutrition, Workout, Progress,
Profile/Settings — icon + `type.micro` label, active tab in `color.primary.terracotta` with a
dot/underline indicator (never color alone, §6.5). Inactive tabs `warmgray-700`. A
`color.semantic.error` badge dot + exclamation glyph can appear on a tab for a sync error
(§4.6). **Workout tab visibility:** per the sitemap rollout note, the Workout tab may ship
disabled/"coming soon" at nutrition-only launch — rendered with the §4.6 inactive treatment
plus a `type.micro` "Soon" badge — then activate as a fast-follow. This is a build-sequencing
toggle, not a structural change.

---

## Home (Today Dashboard) — Tab 1

- **Sitemap:** "Home (Today Dashboard)" — energy-balance summary card, micronutrient snapshot
  widget, quick actions (Log Meal, Log Workout Session), sync/offline status indicator.
  Aggregation view (Req 3 + Req 12); flagged as intentionally requirement-less.
- **Density:** Compact-leaning (a glanceable dashboard), light mode default.
- **Layout (top → bottom):**
  1. **Sync/offline status indicator** — a slim status row at the top. Online/synced =
     neutral; queued-entries-pending = `color.semantic.info` chip with a count + icon;
     sync-failed = `color.semantic.error` chip with exclamation glyph (§6.5). This is the
     screen-level surface of Req 5 offline-first.
  2. **Energy-balance summary card (§4.5 + §4.10)** — calories in vs. target with the
     calories ring (terracotta) as the hero, plus the three macro rings (protein = deep
     green, carbs = `gold-dark` `#A9761E`, fat = info-blue). Over-limit uses
     `color.semantic.warning`/`error` ring + text label (§4.10), never a silent swap.
  3. **Micronutrient snapshot widget (§4.5)** — a compact row of key micronutrients (iron,
     zinc, calcium, vitamin A, folate, B12) as small bars (§4.10). **Partial-coverage-aware:**
     nutrients with no data render an explicit "no data" state (icon + `type.caption`), never
     a misleading zero (Req 4).
  4. **Quick actions** — two Primary/Secondary buttons (§4.1): **Log Meal** → Add Food Entry
     sheet; **Log Workout Session** → Workout session logging. Quick-add Weight is also
     surfaced here as a tertiary action (sitemap notes Weight Log is reachable from Home).
- **Actions:** **P:** Log Meal. **S:** Log Workout Session; Quick-add Weight; tap any card to
  drill into its full view.
- **Offline:** entire default state renders from cache (§6.8); quick-logged entries queue and
  the status indicator reflects the queue.
- **Responsive:** single column mobile; the energy card + micronutrient widget may sit 2-up on
  wider viewports within the 4-col grid.

---

## Nutrition — Tab 2

Compact density throughout (fast, multiple-times-a-day use, §3), light mode default.

### N1. Food Diary (Today)
- **Sitemap:** "Food Diary (Today) — entries grouped by meal (breakfast/lunch/dinner/snack)".
  Req 3.
- **Layout:** Title + date. Entries grouped under four meal-slot section headers (`type.h3`).
  Each entry is a tappable **Card/list row (§4.5)** showing food name, portion (household unit
  + gram equivalent), and calories; tapping opens Edit/Delete (N9). A per-group "Add" affordance
  opens the Add Food Entry sheet pre-targeted to that slot. A running daily-total footer reuses
  the energy card summary (compact).
- **States:** empty meal slot shows a lightweight "Nothing logged yet" caption + inline add.
  A sync-failed entry card uses the §4.5 error border + a retry affordance. Offline entries
  show a "queued" `type.micro` tag.
- **Actions:** **P:** Add entry (per slot). **S:** tap entry to edit; jump to Daily Summary.
- **Responsive:** single column; groups remain full-width rows.

### N2. Add Food Entry (modal / bottom sheet)
- **Sitemap:** "Add Entry (modal/sheet) — tabs: Search / Recent / Favorites / Custom". Req 2.
- **Layout (§4.9 bottom sheet):** rounded-top sheet, drag handle. A four-way switch across
  **Search / Recent / Favorites / Custom** **[GAP: segmented control / tab bar within a
  sheet]** — no such component exists; flagged. Below the switch: a search input (§4.2) on the
  Search tab; scrollable result lists (§4.5 rows) on Recent/Favorites; the Custom tab links to
  the Custom Food / Meal Builder (N7).
- **States:** default, in-sheet action states (§4.9), disabled Primary until an item is chosen,
  offline (searches fall back to cached/recent results with a §4.9 info banner, not an error).
- **Actions:** **P:** select an item → routes to Ingredient Detail (N4) / Composite Meal Detail
  (N5) / Confirm & Log (N8). **S:** switch tab; dismiss.

### N3. Food Search Results
- **Sitemap:** "Food Search Results". Req 1, 2.
- **Layout:** the result list within N2's Search tab (or a full screen if navigated to
  directly): each result is a §4.5 row with food name, a source/region `type.micro` tag, and a
  quick-add affordance. A `color.semantic.info` caption flags partial-database coverage where
  relevant.
- **States:** results / no-results (empty state with "Create a custom food" tertiary CTA →
  N7) / offline (cached subset).
- **Actions:** **P:** tap a result → detail. **S:** create custom; refine search.

### N4. Ingredient Detail
- **Sitemap:** "Ingredient Detail — household-unit portion selector … portion-photo reference
  … macro + micronutrient preview". Req 1, 4. **Carry-forward #2 element.**
- **Layout:**
  1. Food title (`type.h2`) + region tag.
  2. **Household-unit portion picker (§4.3)** — the first-class, **default** control: a
     horizontal set of ≥56×56px unit chips (wrap, cup, ladle, "swallow," etc.) each with a
     unit icon, plus a −/+ quantity stepper. Selected chip = filled terracotta + white; unit
     with no defined conversion → §4.3 disabled fallback to gram entry with the explaining
     caption. A small secondary "advanced / exact grams" link sits below (never the default
     focus). Barcode entry is **not** present (deferred per §4.3 / sitemap v1 scope).
  3. **Portion-photo reference (§4.4)** — a real, described element: a ~96×96px labelled photo
     tile inline **alongside** the unit picker, showing what the selected household unit looks
     like for this food, caption in `type.caption` (e.g., "1 ladle ≈ 150g"). Tapping expands to
     the Portion Reference Guide (N6). If no reference photo exists, the tile is omitted (never
     a broken/empty box, §4.4). If the image fails to load offline, it falls back to caption +
     small icon (expected offline state, not an error, §4.4/§6.8). Authentic photography only
     (§0) — never generic "African-coded" stock.
  4. **Macro + micronutrient preview** — mini rings/bars (§4.10) reflecting the selected
     portion; micronutrients with no data show explicit "no data" (Req 4).
- **Actions:** **P:** "Add to diary" → Confirm & Log (N8). **S:** open Portion Reference Guide;
  advanced grams; favorite this food.
- **Responsive:** picker chips wrap; photo tile sits beside the picker on wide, above/below on
  narrow.

### N5. Composite Meal Detail
- **Sitemap:** "Composite Meal Detail (e.g., a named local prepared dish) — same
  portion-selector pattern including the portion-photo reference, recipe-level nutrition".
  Req 1, 2, 4. **Carry-forward #2 element.**
- **Layout:** Same structure as N4 (household-unit picker §4.3 + inline portion-photo reference
  §4.4 + macro/micronutrient preview §4.10), but the picker's units are dish-level portions
  (e.g., "half plate," "1 wrap") and nutrition is **recipe-level** for the composite dish. The
  portion-photo reference here is explicitly present per the sitemap's portion-selector pattern.
  An optional expandable "ingredients / recipe breakdown" section (§4.5 cards) lists contributing
  components at read-only level.
- **Actions:** **P:** Add to diary → Confirm & Log. **S:** open Portion Reference Guide;
  advanced grams; favorite.
- **Responsive:** as N4.

### N6. Portion Reference Guide (sheet / modal)
- **Sitemap:** "Portion Reference Guide (sheet/modal, reachable from the portion selector on
  Ingredient Detail or Composite Meal Detail) — expanded photo set". Req 1. **Carry-forward #2
  — this is the dedicated home of §4.4.**
- **Layout (§4.9 sheet):** the standalone, browsable expansion of the **portion-photo reference
  component (§4.4)** — a scrollable set of labelled photo tiles for the given food/household
  unit (multiple angles, or a range from "small ladle" to "heaping ladle"), each with a
  `type.caption` gram estimate. Images are compressed, lazily loaded, cached for offline reuse
  (§4.4/§6.8). Selecting a specific reference tile can set the corresponding household unit on
  the originating detail screen.
- **States:** default (photo set) / offline (tiles that failed to load fall back to captions +
  icon, per §4.4) / partial (only available references shown; missing ones omitted, never
  placeholder gray).
- **Actions:** **P:** "Use this portion" (sets unit + dismisses). **S:** dismiss.
- **Responsive:** grid of tiles reflows by width (1–2 cols mobile, more on wide).

### N7. Custom Food / Meal Builder
- **Sitemap:** "Custom Food / Meal Builder — user creates and saves an ingredient or composite
  meal". Req 2.
- **Layout:** Title. Form (§4.2 inputs) for name, per-portion macros, and optional
  micronutrients; a household-unit definition section reusing §4.3 to let the user declare the
  dish's household units and gram equivalents (so their custom food gets the same first-class
  portion model). Optional photo attach that feeds the §4.4 portion-photo reference for future
  logs. For a composite meal, an "add ingredient" repeater assembles components.
- **States:** default / validation error per field (§4.2) / save-success (confirmation) /
  offline (saves locally, queues sync — §6.8).
- **Actions:** **P:** Save. **S:** Save & log now (→ Confirm & Log); cancel.

### N8. Confirm & Log
- **Sitemap:** "Confirm & Log — meal-slot assignment, quantity, save". Req 2.
- **Layout:** Compact confirmation screen/sheet: the chosen food, the selected household-unit
  portion + quantity (editable via §4.3 inline), a **meal-slot assignment** control
  (breakfast/lunch/dinner/snack) **[GAP: single-select segmented control]** — rendered with the
  chip single-select pattern in the interim. A final macro/micronutrient preview (§4.10).
- **Actions:** **P:** Save to diary (Primary; disabled until slot + quantity valid, §4.1). **S:**
  edit portion; cancel. **Offline:** saves + queues (§6.8), returns to diary with a "queued" tag.

### N9. Edit / Delete Entry (modal)
- **Sitemap:** "Edit / Delete Entry (modal, from diary row)". Req 3.
- **Layout (§4.9 sheet):** shows the entry with an editable §4.3 portion control + slot
  reassignment (same [GAP] chip pattern), a **Primary** "Save changes", and a **Text/tertiary
  destructive** "Delete" rendered in `color.semantic.error` with an icon + a confirm step
  (color never the sole signal, §6.5).
- **Actions:** **P:** Save changes. **S:** Delete (with confirm); dismiss.

### N10. Daily Nutrition Summary
- **Sitemap:** "Daily Nutrition Summary — calories, macro breakdown, full micronutrient panel
  with graceful 'no data for this food' states". Req 3, 4.
- **Layout:** Title + date. Hero energy-balance card (§4.5 + §4.10 rings). Full macro breakdown
  bars. A **full micronutrient panel** (§4.10 bars per nutrient) with explicit graceful "no
  data" states per nutrient (icon + `type.caption`, never a false zero — Req 4). Each nutrient
  row is tappable → Micronutrient Detail (N11).
- **Actions:** **P:** tap a nutrient → detail. **S:** navigate days (→ N12).
- **Responsive:** rings hero + 2-col nutrient grid on wide; single column on narrow.

### N11. Micronutrient Detail
- **Sitemap:** "Micronutrient Detail (per nutrient, e.g. weekly trend for
  iron/zinc/calcium/vitamin A/folate/B12)". Req 4.
- **Layout:** Nutrient title + current-day value vs target (a §4.10 bar). A **weekly trend
  chart** **[GAP: line/trend chart component]** — the design system defines rings/bars but no
  time-series chart; flagged. Days with no data render as explicit gaps in the trend (not zero,
  Req 4). A short caption notes FCT-coverage caveats where the underlying food data is partial.
- **Actions:** **P:** back to summary. **S:** switch nutrient; change range.

### N12. Nutrition History / Calendar
- **Sitemap:** "Nutrition History / Calendar — past days, tap into any day's diary/summary".
  Req 3.
- **Layout:** A month **calendar** view **[GAP: calendar / date-picker component]** — not in
  the inventory; flagged. Each day cell carries a small completeness indicator (logged/partial/
  none) using icon + state, never color alone (§6.5). Tapping a day opens that day's Diary (N1)
  or Summary (N10).
- **Actions:** **P:** tap a day. **S:** switch month; jump to today.
- **Responsive:** calendar grid scales; a list-of-days fallback on very narrow widths.

### N13. Favorites & Recents Management
- **Sitemap:** "Favorites & Recents Management — nested under Nutrition, reachable from Add
  Entry or a Nutrition sub-menu". Req 2.
- **Layout:** Two sections (Favorites, Recents) of §4.5 rows; each row has a quick-log action
  and an edit/remove affordance (swipe or trailing icon button, 44pt hit area). Reorder/remove
  favorites supported.
- **Actions:** **P:** quick-log an item. **S:** remove/edit; clear recents.

---

## Workout — Tab 3

Per the sitemap scope note this module is **mechanism only** — tier/node/mastery-gate
structure, states, navigation, and data, with **generic `[Skill Node]` placeholders and TBD
thresholds**. No real exercise names, thresholds, or orderings appear on any screen below
(carry-forward #1). **Relaxed** density for map/status views; workout-mode section accent is
`color.primary.deepgreen`. **Dark-mode note (carry-forward #7):** the node-map screens (Skill
Tree Home, Tier/Node Map, Node Detail) render on `color.neutral.dark-bg` `#17181A` in dark
mode (not `dark-surface`), and the mastered node's **outline `#A85F12` + star/badge icon**
carry the contrast signal there, not its `#A8452A` fill.

### W1. Skill Tree Home
- **Sitemap:** "Skill Tree Home — track selector: Calisthenics / Pilates (or combined view);
  also the entry point to complete a track's placement assessment later if it was deferred at
  onboarding". Req 6, 9 (deferred-placement entry).
- **Layout:** Title. A **track selector** — Calisthenics / Pilates / Combined **[GAP:
  segmented control]**, interim chip single-select. Below, a summary card per available track
  (§4.5) showing current tier and a "continue" affordance into the Tier/Node Map (W2).
- **Deferred-placement entry (carry-forward #3):** if a track's placement was skipped/deferred
  at onboarding (A7a "do this later" / A7b defer), that track's card shows a **"Complete
  placement"** Primary/Secondary CTA that launches the corresponding per-track placement
  (A7c/A7d for calisthenics, A7e/A7f for Pilates) in-context, then returns here. A track with
  no placement yet does not show a node map until placement is done or explicitly bypassed.
- **Actions:** **P:** open a track's node map. **S:** complete a deferred placement; switch
  track view.
- **Responsive:** track cards stack mobile, side-by-side (or combined view) on wide.

### W2. Tier / Node Map
- **Sitemap:** "Tier / Node Map — visual tree per track; each node shows locked / in-progress
  / mastered state and its prerequisite node(s)". Req 6, 8.
- **Layout:** A pannable/zoomable node graph, one track at a time. Nodes use the **skill-tree
  node component (§4.7)** and the **fixed gamification vocabulary (§1.4) exclusively** for state
  color, each state paired with its icon/shape (§1.4, §6.5):
  - Locked — `color.node.locked` `#8A8578`, padlock icon, 60% opacity, **non-interactive**
    (carry-forward #5): does not respond to taps and opens nothing. A static, non-interactive
    `type.micro` caption near a locked node may state its prerequisite generically (e.g.,
    "Unlock: complete prerequisite node") **without** naming real content and **without**
    becoming a control.
  - Unlocked/available — `color.node.unlocked` `#A85F12`, outlined-circle icon, full opacity,
    static ring; tappable → Node Detail (W3).
  - In-progress — `color.node.inprogress` `#3B7EA8`, half-filled arc (animated only if motion
    not reduced, §6.4); tappable → W3.
  - Completed — `color.node.completed` `#3D8B5C`, filled checkmark; tappable → W3.
  - Mastered ("boss"/milestone) — larger 1.5× circle, fill `color.node.mastered` `#A8452A`,
    **outline `color.node.unlocked` `#A85F12`**, star/badge icon, static glow (no
    particle/celebration, perf §1.4). Tappable → W3.
  - Prerequisite edges drawn as plain lines (solid color, no gradient, §1.1) connecting nodes.
- **Node names are `[Skill Node]` placeholders** everywhere on this screen (carry-forward #1).
- **Dark mode (carry-forward #7):** background is `dark-bg` `#17181A`; mastered node's outline
  + icon carry contrast, not the fill.
- **Sync error on a node:** a `color.semantic.warning` corner glyph overlays without changing
  the node's state color (§4.7).
- **Touch targets:** every node meets the 44×44pt floor via invisible hit-area padding (§3),
  including visually small standard nodes.
- **Actions:** **P:** tap an actionable (non-locked) node → Node Detail. **S:** pan/zoom;
  switch track (back to W1).
- **Responsive:** the graph pans on mobile; on wide viewports more of the tier is visible at
  once, but the same node component and spacing tokens apply.

### W3. Node Detail
- **Sitemap:** "Node Detail — `[Skill Node]` name (placeholder), current status,
  prerequisite(s), unlock requirement (time-hold or rep-threshold, values TBD by validated
  content), form-cue instructional content". Req 6, 7, 10. **Reached only for
  unlocked/in-progress/completed/mastered nodes** (carry-forward #5 — locked nodes never route
  here).
- **Layout:**
  1. `[Skill Node]` placeholder name (`type.h2`) + a state chip using the §1.4 node color +
     icon/label for its current state.
  2. **Prerequisite(s)** — listed generically as prior `[Skill Node]` placeholders (read-only).
  3. **Unlock requirement** — stated as a **time-hold or rep-threshold with the value shown as
     `TBD`** (no invented threshold), phrased at the sitemap's abstraction level.
  4. **Form-cue instructional content (Req 10)** — real text cues describing what "clean"
     execution means, generically; any demo still is authentic photography (§0), compressed/
     cached (§6.8), never text-in-image (§6.9).
  5. Progress toward the gate (a §4.10 bar) for in-progress nodes.
- **Dark mode:** card content on `dark-bg` per carry-forward #7.
- **Actions:** **P:** "Log attempt" → Log Attempt sheet (W4). **S:** back to map; (for a
  completed/mastered node) "view progression" → Progression Status (W6).

### W4. Log Attempt (modal / sheet)
- **Sitemap:** "Log Attempt (modal, from Node Detail) — user enters reps completed or hold
  duration". Req 7, 11.
- **Layout (§4.9 sheet):** a single-focus entry: a numeric input/stepper (§4.2/§4.3 pattern)
  for **reps** OR a duration control for a **hold**, matching the node's gate type. Large,
  glanceable value display. A Primary "Save attempt".
- **States:** default / invalid input error (§4.2) / offline (queues the attempt, §6.8, with a
  "queued" tag) / success → if the logged value meets/exceeds the node's threshold, routes to
  Mastery Gate Confirmation (W5).
- **Actions:** **P:** Save attempt. **S:** dismiss.

### W5. Mastery Gate Confirmation
- **Sitemap:** "Mastery Gate Confirmation — shown when a logged attempt meets/exceeds the
  node's threshold; confirms unlock of downstream node(s)". Req 7.
- **Layout:** A focused confirmation using the §1.4 gamification colors (this is a legitimate
  node-state context): the just-mastered node shown mastered (fill `#A8452A` + outline `#A85F12`
  + star icon), and the newly-**unlocked** downstream node(s) shown in `color.node.unlocked`
  `#A85F12` with the outlined-circle icon — all as generic `[Skill Node]` placeholders. A brief
  (≤400ms) non-flashing scale+fade celebration with a **static-badge fallback under
  reduced-motion** (§6.4/§5.1), plus a haptic/optional-sound cue (§6.6).
- **Actions:** **P:** "Continue" (back to map, which now reflects the new states). **S:** "View
  progression" → W6.

### W6. Progression Status
- **Sitemap:** "Progression Status — per skill line, 'what you're on now / what's next,' across
  both tracks". Req 8.
- **Layout:** Per-track, per-skill-line list (§4.5 cards): each line shows the current
  `[Skill Node]` (generic) and the next `[Skill Node]` with its `TBD` gate, using node-state
  colors + icons (§1.4/§6.5). Covers **both** tracks when both are active. No real progression
  content — placeholders only (carry-forward #1).
- **Actions:** **P:** tap a line → its Node Detail / map location. **S:** switch track.

### W7. Workout Session Log
- **Sitemap:** "Workout Session Log — freeform log of a training session (which nodes attempted,
  reps/holds recorded)". Also the target of Home's "Log Workout Session" quick action. Req 11.
- **Layout:** A session container: add one or more attempt rows (each reusing the W4 Log Attempt
  entry against a chosen actionable node — generic placeholders), showing reps/holds recorded.
  A running session summary card (§4.5).
- **States:** in-progress / saved / offline-queued (§6.8).
- **Actions:** **P:** Save session. **S:** add attempt; discard.
- **[GAP / cross-track flag — guided Session Player has no sitemap home]:** the design system
  specifies a full **shared Session Player component (§4.8) with two presets (§5): a
  calisthenics game-like dark-mode player with a between-sets rest-timer state (§5.1), and a
  Pilates calm, audio-led, light-surface player with a `gold-muted` `#7A4E12` progress
  indicator and auto-advance (§5.2).** The sitemap's Workout module, however, is scoped to
  **freeform logging** (Workout Session Log + Log Attempt) and defines **no guided/timed
  session-player destination screen** — there is no sitemap screen for a live calisthenics
  rest-timer sequence or a live audio-led Pilates class player. This is a genuine
  **design-system ↔ sitemap mismatch**, not something to invent a screen for here. Flagged for
  review: either (a) the session-player component is intentionally ahead of the v1 sitemap
  (build it later when a guided-session screen is added to the sitemap), or (b) the sitemap
  needs a "Session Player" destination added. I did **not** silently create a player screen.
  The tokens/behaviors above (rest-timer §5.1, gold-muted `#7A4E12` §5.2) are recorded so the
  spec isn't lost if option (b) is chosen.

### W8. Workout History / Session Calendar
- **Sitemap:** "Workout History / Session Calendar". Req 8, 11.
- **Layout:** A **calendar** of past sessions **[GAP: calendar component, as N12]** with
  per-day session indicators (icon + state, §6.5); tapping a day opens that session's logged
  attempts (W7 read view). Alternatively a reverse-chronological list of §4.5 session cards.
- **Actions:** **P:** tap a session/day. **S:** switch month; filter by track.

---

## Progress — Tab 4 (shared layer)

Relaxed density; light mode default.

### P1. Combined Progress Dashboard
- **Sitemap:** "Combined Progress Dashboard — weight trend, calorie-balance trend, workout
  tier-progression summary in one view (the cross-module payoff)". Req 8, 12.
- **Layout — three clearly separated, titled sections (carry-forward #6 drives this
  separation):**
  1. **Weight trend** — a time-series **[GAP: line/trend chart]** of weight over time.
  2. **Calorie-balance trend** — the calorie in-vs-target trend. Where macro context is shown,
     the carbs metric uses the macro-ring `gold-dark` `#A9761E` **with its required text label +
     icon pairing** (§4.10/§6.5).
  3. **Workout tier-progression summary** — a generic per-track tier recap; where an
     unlocked-node indicator appears it uses `color.node.unlocked` `#A85F12` **with its §1.4
     outlined-circle icon + `type.micro` label** (§6.5), and nodes are `[Skill Node]`
     placeholders (carry-forward #1).
- **Carry-forward #6 (color adjacency), explicitly applied:** the carbs ring (`gold-dark`
  `#A9761E`) and the unlocked-node indicator (`#A85F12`) are hex-distinct but perceptually
  close; on this screen they are (a) placed in **separate titled sections** (nutrition vs.
  workout) so they are never directly adjacent, and (b) each **always** carries its required
  icon/label pairing so the pairing — not hue alone — disambiguates them. Neither is ever shown
  as a bare colored dot next to the other.
- **Actions:** **P:** drill into any section (→ Weight Log, Daily Summary, Progression Status).
  **S:** change date range.
- **Responsive:** sections stack on mobile; may sit 2-up on wide, but the nutrition and workout
  color-bearing indicators are kept in separate columns/sections regardless.

### P2. Weight Log
- **Sitemap:** "Weight Log — add/view weight entries (also reachable as a quick-add from
  Home)". Req 12.
- **Layout:** A weight trend chart **[GAP: line/trend chart]** + a list of §4.5 entry rows
  (date + value, editable). A **Quick-add Weight Entry** sheet (§4.9) with one numeric input
  (§4.2) + Primary "Save" — this is the modal reached from Home too.
- **Actions:** **P:** Add weight. **S:** edit/delete an entry; change range. **Offline:** queues
  (§6.8).

### P3. Goal Settings / Adjust Targets
- **Sitemap:** "Goal Settings / Adjust Targets — revise calorie/macro targets and weight goal".
  Req 3, 12.
- **Layout:** Mirrors A4 (computed vs. adjustable targets with §4.10 preview rings) plus a
  weight-goal control (target weight, pace) using §4.2 inputs and the chip single-select for
  goal direction **[GAP: single-select control]**. Over-aggressive settings → `warning` caption.
- **Actions:** **P:** Save targets. **S:** Reset to computed; cancel.

---

## Profile / Settings — Tab 5

Compact density; standard list-of-settings pattern. Each settings destination is a screen of
grouped **Cards / list rows (§4.5)** with `type.h3` row titles and `type.caption` subtitles;
row-level toggles are **[GAP: toggle/switch component]** wherever an on/off control is needed.

### S1. Profile
- **Sitemap:** "Profile — edit personal info, goals". Req 12.
- **Layout:** Editable personal info (name, sex, height, weight) via §4.2 inputs + the chip
  single-select pattern **[GAP]**; a shortcut into Goal Settings (P3). Optional avatar
  (authentic user photo; no decorative motif, §0).
- **Actions:** **P:** Save. **S:** edit goals (→ P3).

### S2. Account Settings
- **Sitemap:** "Account Settings — email/password, delete account". Req 12.
- **Layout:** Email + change-password inputs (§4.2); a **destructive "Delete account"**
  tertiary action in `color.semantic.error` with an icon + explicit confirm step (color never
  alone, §6.5).
- **Actions:** **P:** Save changes. **S:** Delete account (confirm flow); log out.

### S3. Data & Sync Settings
- **Sitemap:** "Data & Sync Settings — offline-mode status, manual sync trigger, low-data-mode
  toggle". Req 5, 13 (partial).
- **Layout:** An offline/sync status card (mirrors Home's indicator, §4.5 + semantic chips);
  a **manual "Sync now"** Primary button; a **low-data-mode toggle [GAP: toggle/switch]**; a
  queued-entries count with a per-item retry for sync-failed entries (§4.5 error rows).
- **Actions:** **P:** Sync now. **S:** toggle low-data mode; retry failed items.

### S4. Integrations
- **Sitemap:** "Integrations — Google Fit / Apple Health connect (optional sync)". Req 13.
- **Layout:** Provider rows (§4.5) each with a connect/disconnect action (§4.1 buttons) and a
  connection-state indicator (icon + label, §6.5).
- **Actions:** **P:** Connect a provider. **S:** disconnect; manage scopes.

### S5. Region & Language Settings
- **Sitemap:** "Region & Language Settings — market (Nigeria/Ghana/Kenya), household-unit
  display preferences". Req 1.
- **Layout:** Market single-select (chip pattern **[GAP]**) and household-unit display
  preferences (units, gram-visibility) — these drive the §4.3 picker defaults and §4.4 captions
  app-wide. Language selection if applicable.
- **Actions:** **P:** Save. **S:** cancel.

### S6. Notifications Settings
- **Sitemap:** "Notifications Settings".
- **Layout:** A list of notification categories (log reminders, streak/progress, sync) each
  with a **toggle [GAP: toggle/switch]**; optional quiet-hours time controls.
- **Actions:** **P:** Save. **S:** none.

### S7. Legal & Disclaimers
- **Sitemap:** "Legal & Disclaimers — health-data privacy notice, workout injury-liability
  disclaimer, 'tracking/education, not medical advice' positioning". Flagged as risk-mitigation.
- **Layout:** Long-form scrollable text (real text, §6.9) in readable `type.body`, sectioned by
  `type.h3`. Links to full policy documents. The workout injury-liability disclaimer and the
  NDPR/NDPA/GDPR/CCPA health-data notice are distinct sections.
- **Actions:** **P:** Acknowledge (where a first-run acceptance is required). **S:** open full
  document.

### S8. Help / Support
- **Sitemap:** "Help / Support".
- **Layout:** FAQ list (§4.5 expandable rows) + a contact/support affordance. Fully readable
  offline where content is cached (§6.8).
- **Actions:** **P:** contact support. **S:** browse FAQ.

---

# Modals / Overlays (cross-cutting)

Per the sitemap these are transient, dismissable, no deep nav state — all use the bottom-sheet
pattern (§4.9): `warmgray-100` surface, 16px top radius, drag handle, in-sheet §4.1 button
states, disabled Primary until required input, and a §4.9 top error banner (10% tint + full
icon/text, color never alone).

- **Add Food Entry sheet** — see N2.
- **Edit/Delete Diary Entry** — see N9.
- **Portion Reference Guide (photo set)** — see N6 (hosts §4.4).
- **Log Workout Attempt sheet** — see W4.
- **Mastery Gate Confirmation** — see W5.
- **Quick-add Weight Entry** — see P2.

---

# Consolidated component gaps (design-system follow-ups)

These are components the sitemap's screens require that the design system's §4 inventory does
**not** yet define. None were invented silently; each is flagged where used above and summarized
here for the design-system owner. All are **additive** to the existing system (they do not
contradict any approved token or rule).

1. **Segmented control / in-sheet tab bar** — needed by: Sign Up/Log In mode switch (A2), Add
   Entry Search/Recent/Favorites/Custom tabs (N2), Skill Tree Home track selector (W1).
   Currently no component exists; interim screens above note this. High-frequency, should be a
   first-class addition.
2. **Single-select form control (radio / choice chips)** — needed by: Profile Setup sex/activity/
   goal (A3), Region market select (A5, S5), meal-slot assignment (N8, N9), goal direction (P3),
   assessment self-report can/can't (A7c/A7e), Profile (S1). Interim reuse of the §4.3 portion
   chip visual is noted as a stopgap, but §4.3 is scoped to portion units — a general
   single-select needs its own definition.
3. **Toggle / switch** — needed by: Western/diaspora food-set enable (A5), low-data-mode (S3),
   notifications categories (S6), auto-advance (would belong to the deferred Pilates player).
4. **Calendar / date-picker** — needed by: Nutrition History/Calendar (N12), Workout
   History/Session Calendar (W8).
5. **Line / time-series trend chart** — needed by: Micronutrient Detail weekly trend (N11),
   Combined Progress Dashboard weight + calorie-balance trends (P1), Weight Log (P2). The design
   system defines progress **rings/bars (§4.10)** but no time-series chart.
6. **List row (formal)** — used pervasively (diary rows, settings rows, search results). Treated
   above as a lightweight variant of Cards (§4.5); if a distinct list-row component is wanted, it
   should be formalized, but this is low-risk since §4.5 covers the visual/state needs.

# Cross-track mismatch (not a missing component — a scope mismatch to adjudicate)

- **Guided Session Player has no sitemap destination.** The design system fully specifies a
  shared Session Player (§4.8) with calisthenics (§5.1, incl. rest-timer state) and Pilates
  (§5.2, incl. `gold-muted` `#7A4E12` progress indicator, audio-led, auto-advance) presets, but
  the sitemap's Workout module is scoped to **freeform logging** (Workout Session Log W7 + Log
  Attempt W4) with **no guided/timed player screen**. This must be adjudicated at review: either
  the player is intentionally post-v1 (component ahead of sitemap) or the sitemap should gain a
  "Session Player" destination. No player screen was invented here; the spec is preserved in W7
  so it isn't lost. See W7 for detail.

---

Screens complete. Ready for review before build stage.

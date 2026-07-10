# Pipeline Review Log

## 2026-07-10 — Stage: research-design — Verdict: REJECTED

**Reviewed output:** `research/design-research.md`
**Dependencies:** none (checked instead against `.claude/agents/researcher-design.md` output requirements and `docs/idea.md`, since the researcher agent reported it could not read the idea doc this session).

### Requirement coverage (agent spec)

| Requirement | Status |
|---|---|
| Competitor Visual Audit (3-5 competitors/adjacent) | Present — 9 products audited (MyFitnessPal, YAZIO, Cronometer, Calistree, Calistack, Thenx, Duolingo, Habitica, Flutterwave), each with a concrete design lesson |
| Interaction Conventions | Present but incomplete (see gaps 1-2) |
| Accessibility Requirements | Present and strong — WCAG specifics plus audience-specific low-bandwidth/low-end-device constraints |
| Recommended Direction (with rationale) | Present — correctly framed as a recommendation; cultural-identity question honestly flagged as unresolved rather than papered over |

Honesty check: passes. The doc explicitly discloses it worked from the task description instead of `docs/idea.md`, and flags its open questions instead of inventing answers. That disclosure was warranted — it caused a material gap.

### Concrete gaps (reasons for rejection)

1. **Pilates is entirely missing.** `docs/idea.md` differentiator #2 states the workout system "Covers calisthenics and Pilates specifically." The research's own scope line describes only "calisthenics/bodyweight skill-tree progression"; zero Pilates or Pilates-adjacent apps are audited, and no Pilates interaction conventions appear anywhere. Pilates apps follow a materially different UX register (guided/timed mat sessions, video- or audio-led flows, form-cue-heavy instruction) than rep-based calisthenics skill trees. Since `design-system` depends only on this stage, Pilates conventions would never enter the design system at all. This is not a nice-to-have — it is half of the workout product.
2. **No in-workout execution conventions.** The Interaction Conventions section covers the skill-tree *map* (node states, navigation) but not the workout *session* itself: rest timers, rep counters, hold-duration timers (directly required by the idea's "time/rep thresholds they've hit" tracking), mid-exercise glanceability/one-hand use, and session-complete flows. These are among the highest-frequency screens in the product and have strong category conventions worth documenting.
3. **(Minor, fix alongside the above) Portion-entry conventions for African dishes.** Differentiator #1 (African ingredient/prepared-dish database, logging "by individual ingredient or by common prepared meal") has a design-facing consequence the doc misses: many African staples are served/measured in household units (wraps, ladles, handfuls) rather than gram weights, which affects the serving-size UI convention the doc otherwise describes in mainstream (gram/barcode) terms. A short note on this is enough; deep sourcing belongs to product research.

### Required changes for approval

1. Add Pilates to scope and audit 1-2 Pilates or Pilates-adjacent apps (e.g., Lottie Pilates, 5 Minute Pilates, Alo Moves, Nike Training Club Pilates content) for visual identity and session UX.
2. Add an Interaction Conventions subsection for guided workout-session execution: timer-led holds, rep logging, rest timers, audio/video guidance patterns, and how these conventions differ between calisthenics and Pilates.
3. Add a brief note on portion/serving-entry conventions for prepared African dishes (household measures vs. grams) as a design-system input for the logging flow.
4. Update the scope statement and Recommended Direction to confirm the "warm/clean hybrid" recommendation still holds (or is adjusted) once Pilates session UX is factored in.

What does NOT need to change: the competitor audit for nutrition/skill-tree/gamification/African-brand quadrants, the accessibility section, and the honestly-flagged cultural-identity decision are all solid and should be preserved as-is.

## 2026-07-10 — Stage: research-product — Verdict: REJECTED

**Reviewed output:** `research/product-research.md`
**Dependencies:** none (checked against `.claude/agents/researcher-product.md` output requirements and reconciled against `docs/idea.md`, since the researcher agent reported it could not read the idea doc this session and worked from the launcher brief).

### Requirement coverage (agent spec)

| Requirement | Status |
|---|---|
| Target Users + jobs-to-be-done | Present — three personas with a clear primary wedge and four JTBD |
| Competitive Landscape (3-5, gaps + complaints) | Present and strong on nutrition (MyFitnessPal, Cronometer, CalorieNaija, Didiye, AfriCal, AfroTools, FitSavanna, with sourced complaint evidence); **wrong category on the workout side** (see gap 2) |
| Core Feature Requirements (viable minimum) | Present, well-scoped on nutrition; workout requirements contradict the idea (gaps 1-2) and micronutrients are omitted (gap 3) |
| Constraints & Risks (regulatory/technical/market) | Present and strong — NDPR/GDPR, offline-first/low-end Android, data-curation labor cost, monetization realism |
| Open Questions | Present — but drops one of the idea doc's own open questions (gap 4) |

Honesty check: passes strongly. The "whitespace is filling fast" competitive finding, the self-reported-AI-accuracy skepticism, and the explicit "Weak spots to be honest about" subsection all push back on the idea rather than validating it. The missing-idea-doc disclosure at the top is also honest — and, as with research-design, that disclosure flagged a real problem.

### Idea-doc reconciliation (checked directly against `docs/idea.md`)

Handled correctly: Nigeria-mandatory-in-v1 honored; region-prioritization open question answered (Nigeria + Ghana + Kenya with data-cost rationale); data-sourcing open question answered (WAFCT 2019, Nigerian FCT, Kenya FCT 2018, USDA, with the composite-dish caveat); unified-vs-two-module open question answered with a clear recommendation; mobile-first/diaspora constraints reflected.

### Concrete gaps (reasons for rejection)

1. **Calisthenics and Pilates are entirely absent.** The words appear nowhere in the document, yet they are in the title of `docs/idea.md`, and differentiator #2 states the workout system "Covers calisthenics and Pilates specifically." Pilates in particular has zero coverage — no persona, no competitor, no feature requirement, no risk. This is the same failure that contributed to the research-design rejection, and since `sitemap` depends only on this stage, Pilates would never enter the information architecture at all.
2. **The workout concept is contradicted, not just under-covered.** The idea describes a bodyweight skill-tree: moves gated behind prerequisite mastery (e.g., freestanding handstand hold before handstand push-ups), tracking "current unlocked tier and the time/rep thresholds they've hit." The research reframes this as a generic gym progressive-overload product: a "gym-goer / progressive-overload lifter" persona, a "tell me what to do in the gym" JTBD, a competitor set of Fitbod/Dr. Muscle/JEFIT (weights apps), and feature requirements specifying "load/sets," "sets/reps/weight," and "gym paths." The idea mentions no gym and no external load. Freeletics is the only on-concept comparison in the doc. (Note: validating the exercise-science correctness of progression trees was out of scope for this stage — the failure here is misrepresenting the product concept, not failing to validate it.)
3. **Micronutrient tracking is omitted from Core Feature Requirements.** Differentiator #1 in `docs/idea.md` explicitly requires "Micronutrient data (vitamins, minerals) where available." The feature list covers only calories + macros (req 4). The cited FCT sources do carry micronutrient data, so this is a cheap fix, but as written the sitemap stage would build no micronutrient surface.
4. **The idea doc's open question on validated progression trees is dropped.** `docs/idea.md` explicitly lists "the actual correct, safe progression trees for calisthenics and Pilates, validated against real strength-training and Pilates progression standards" as an open research question. The doc's Open Questions section does not carry it forward (the generic "reconcile with idea.md" item, Q6, is not a substitute). Downstream stages need to know this is unresolved and owned by someone.

### Required changes for approval

1. Rewrite the workout-module coverage around the actual concept: calisthenics + Pilates bodyweight skill-tree with mastery gates and time/rep thresholds. Remove or correct the gym/weights framing in the tertiary persona, JTBD 3, and feature requirements 6-8 (no "loads," "weight," or "gym paths" unless justified against the idea doc).
2. Add on-category workout competitors: at least one calisthenics skill-tree app (e.g., Thenx, Calisthenics Mastery, Movesta/Calistree — the design-research audit already found some) and at least one Pilates app, with gaps/complaints as done for the nutrition side. Freeletics can stay as the progression-gating analogue.
3. Add micronutrient tracking (per-food vitamins/minerals where the FCT source provides them) to Core Feature Requirements, noting FCT micronutrient coverage limits as a constraint if applicable.
4. Add the calisthenics/Pilates progression-tree validation to Open Questions as an explicitly unresolved item with a proposed owner/stage (it is flagged in `docs/idea.md` as a core research task, not an assumption).
5. Reconcile or remove the top-of-file "brief-based" disclaimer and Open Q6 once the above is done against the actual `docs/idea.md` contents.

What does NOT need to change: the entire nutrition-side analysis (personas, competitive landscape, data-sourcing resolution, portion-sizing problem framing), the Nigeria+Ghana+Kenya market recommendation, the unified-app/nutrition-first recommendation, the Constraints & Risks section, and the honesty posture are all strong and should be preserved as-is.

## 2026-07-10 — Stage: research-design (SECOND PASS) — Verdict: REJECTED

**Reviewed output:** `research/design-research.md` (revision after first-pass rejection)
**Dependencies:** none (checked against `.claude/agents/researcher-design.md` output requirements, `docs/idea.md`, and the first-pass fix list above).

### First-pass fix list: all four items verified DONE

| Required change (pass 1) | Status in revision |
|---|---|
| 1. Pilates in scope + 1-2 Pilates apps audited for visual identity and session UX | **Done.** Three apps audited (Alo Moves, 5 Minute Pilates, Nike Training Club Pilates content), each covering both visual identity and session UX, plus an explicit register contrast vs. calisthenics apps. |
| 2. In-workout execution conventions for both modes | **Done.** Separate calisthenics subsection (rep counters, rest timers, hold-duration timers, one-hand glanceability, session-complete tied to skill-tree nodes) and Pilates subsection (timed guided flow, audio-first cues, rest folded into transitions, reflective session-complete), with differences drawn explicitly and a concrete design implication (one shared session-player component, mode-specific tone). |
| 3. Household-unit vs. gram portion-entry note for African dishes | **Done.** Correctly scoped as a UI-convention input (household-unit pickers primary, gram/barcode secondary) with data sourcing explicitly deferred to product research. |
| 4. Scope statement + Recommended Direction updated | **Done.** Scope note covers both modes; Recommended Direction explicitly confirms warm/clean hybrid with an added tonal-flex requirement, and re-flags design-system-architect ownership. |

### Concrete gaps (reasons for rejection): reviewed-and-approved content was silently removed, and the doc claims it wasn't

The first-pass verdict explicitly instructed: "the competitor audit for nutrition/skill-tree/gamification/African-brand quadrants, the accessibility section, and the honestly-flagged cultural-identity decision are all solid and should be preserved as-is." Checked against the first pass's recorded audit list (MyFitnessPal, YAZIO, Cronometer, Calistree, Calistack, Thenx, Duolingo, Habitica, Flutterwave):

1. **The gamification quadrant (Duolingo, Habitica) is entirely gone.** No gamification-native product audit remains anywhere in the revision. The achievement/unlock/streak layer is core to `docs/idea.md` differentiator #2, and `design-system` depends only on this document for those lessons; the residual unlock/badge notes inside the skill-tree section are not a substitute for the removed audit entries and their design lessons.
2. **The African-brand quadrant lost its named reference (Flutterwave)**, replaced by an unnamed generic description ("African recipe blogs/Instagram accounts, diaspora meal-kit brands"). An audit entry with no named product is not auditable or traceable.
3. **YAZIO was silently swapped for Noom** in the nutrition quadrant. Noom is a defensible (arguably better) warm-register example, but the change is unacknowledged.
4. **The scope note misrepresents the above.** Line 3 states: "Everything else from the prior draft (nutrition/skill-tree/gamification/African-brand competitor quadrants, the accessibility section, and the open cultural-identity question) is preserved as reviewed." That claim is false for two of the four quadrants (gamification removed, African-brand reference stripped) and inaccurate for a third (nutrition entry swapped). The prior draft's honesty was one of its strengths; this is a regression on that axis, and it is the kind of claim downstream agents will take at face value.

Preserved correctly: the accessibility section (changed only additively — new in-workout, audio/haptic, and cognitive-load items are improvements tied to the required fixes), the cultural-identity open question (still honestly flagged as a design-system-stage decision), and the skill-tree map conventions.

### Required changes for approval (narrow — do not touch the four new additions)

1. Restore the gamification-app audit entries (Duolingo and Habitica, each with its concrete design lesson as in the prior draft). If the reviser believes they should be cut, that must be argued explicitly, not deleted silently.
2. Restore the named African/diaspora brand reference (Flutterwave, or another named brand with a concrete design lesson) in place of the current unnamed generic description.
3. Either restore YAZIO or keep Noom and note the swap as a deliberate, reasoned change.
4. Correct the scope note so it no longer claims unchanged preservation of content that was removed or altered.

**Explicitly approved as-is (must NOT change in the next revision):** the Pilates audit section, both in-workout execution subsections, the portion-entry note, the updated Recommended Direction with tonal flex, and the (additively improved) accessibility section.

## 2026-07-10 — Stage: research-product (SECOND PASS) — Verdict: APPROVED

**Reviewed output:** `research/product-research.md` (revision after first-pass rejection)
**Dependencies:** none (checked against `.claude/agents/researcher-product.md` output requirements, `docs/idea.md`, and the first-pass fix list above).

### First-pass fix list: all five items verified DONE

| Required change (pass 1) | Status in revision |
|---|---|
| 1. Rewrite workout coverage around calisthenics + Pilates bodyweight skill-tree with mastery gates; remove gym/weights framing | **Done.** Scope statement now states "no gym, no machines, and no external load" explicitly. Two on-concept workout personas (home/outdoor bodyweight trainer; Pilates-lean mobility/core trainer) replace the gym-goer. JTBD 3 is now the named-skill progression job. Feature requirements 6-11 specify a calisthenics+Pilates skill tree, objective time-hold/rep-threshold gates, per-user unlocked-tier state, placement onboarding, form cues, and session logging. Fitbod/Dr. Muscle/JEFIT and all "load/sets"/"weight"/"gym paths" language are gone; "external-load/gym tracking" is explicitly declared out of scope (req list, final paragraph). The only remaining "weight" mentions are body-weight goals and a criticism of Calistree's weight-vest drift — both legitimate. |
| 2. On-category workout competitors with gaps/complaints | **Done.** Calistree and Calisthenics Mastery (skill-tree calisthenics), Thenx, Freeletics retained as the progression-gating analogue (with the sharp observation that its gates are self-rated — directly motivating the idea's objective-threshold differentiator), and Pilatesology + Pilates Anytime for Pilates. Each row carries specific complaints (beginner overwhelm, confusing layout, self-rated gates, "I don't know where to start") sourced to reviews/articles at the same standard as the nutrition table, plus a market-read paragraph synthesizing the wedge. |
| 3. Micronutrient tracking in Core Feature Requirements | **Done.** Requirement 4: per-food and per-day vitamins/minerals (iron, zinc, calcium, vitamin A, folate, B12 named), tied to FCT sourcing feasibility, with graceful "no data" degradation; incomplete-FCT-coverage risk carried into Constraints and Open Question 4 as required. |
| 4. Progression-tree validation carried into Open Questions | **Done.** Open Question 1 explicitly flags it as "unresolved, needs dedicated exercise-science validation — out of scope here, must not be assumed," names the owner type (qualified coach/physiotherapist/Pilates instructor) and timing (before sitemap/progression build), and rejects adopting Convict Conditioning as a shortcut. Also echoed in the injury-liability constraint and honest-weak-spots. |
| 5. Remove stale brief-based disclaimer and old Open Q6 | **Done.** The doc now opens grounded directly in `docs/idea.md`; the generic reconcile-with-idea.md open question is gone, replaced by substantive questions. |

### Preservation check (explicitly verified for silent thinning, given the research-design pass-2 failure mode)

Compared against the first-pass review's recorded description of the approved content — depth, not just keyword presence:

- **Diaspora persona:** intact as persona 2, including the dual-cuisine scope-multiplier insight ("serving them well requires the Western food database to also be solid — a scope multiplier, not a free extension"), the hard-currency willingness-to-pay point, and the Didiye/CalorieNaija-courting observation. The insight is additionally carried into Constraints & Risks and Open Question 7 (dual-cuisine IA implications). Not thinned.
- **Recommendation on Priority Markets:** full section intact — Nigeria mandatory (population, documented pain, WAFCT + national FCT, Nigerian diaspora), Ghana second on shared-WAFCT low-marginal-data-cost rationale, Kenya third on its own lab-analyzed 2018 FCT (522 foods + 142 recipes) and East-African beachhead, with South Africa and Ethiopia explicitly held for v2 with per-country reasoning and the closing curation-cost-per-cuisine rationale. Not thinned.
- **Unified-app vs. two-modules:** full rationale intact and improved — one app, two modules sharing account/profile/energy-balance layer, nutrition-first sequencing with justification (persona overlap only partial; workout module blocked on tree validation), shared calories-in/out model as the integration payoff, explicit warning against a split two-app architecture. Not a one-line reference.
- **Everything else the first pass marked preserve-as-is** (nutrition competitive table with sourced complaint evidence, data-sourcing resolution with WAFCT/Nigerian FCT/Kenya FCT/USDA and the composite-dish + licensing caveats, Constraints & Risks incl. NDPR/GDPR, offline-first/low-end Android, curation-labor moat/cost, monetization realism, and the honest-weak-spots posture) is present at equal or greater depth.

### Agent-spec coverage

All five required sections present (Target Users, Competitive Landscape, Core Feature Requirements, Constraints & Risks, Open Questions); honesty requirement satisfied strongly (whitespace-closing finding, unvalidated-differentiator warning, bundle-risk warning); closing statement present.

**Verdict: APPROVED.** No gaps found. Sitemap stage is unblocked; it must treat Open Question 1 (progression-tree validation) as an unresolved external dependency, not settled fact.

## 2026-07-10 — Stage: sitemap — Verdict: REJECTED

**Reviewed output:** `docs/sitemap.md`
**Dependencies:** `research-product` (approved, pass 2) → `research/product-research.md`. Checked every one of the 13 numbered Core Feature Requirements against the traceability table and the actual screen list, plus the three special conditions carried forward from the research approval.

### What passes (verified, not vibes)

- **Requirements 2–8 and 10–12 trace fully and correctly** from the traceability table to real screens in the hierarchy (spot-checked each: e.g., Req 2's Search/Recent/Favorites/Custom tabs all exist on Add Entry; Req 7's threshold display, Log Attempt, and Mastery Gate Confirmation all exist; Req 4's "no data" degradation appears on Daily Nutrition Summary, the Home widget, and per-food previews; Req 12's shared account/profile/weight/goal layer plus Combined Progress Dashboard is present).
- **Req 13 is handled honestly**: the screen-expressible slice (low-data toggle, manual sync, Health/Fit integrations) is placed, and the rest is correctly flagged as a cross-cutting engineering constraint rather than falsely claimed as a screen. This is the right call, and the flag is explicit.
- **Open Question 1 discipline: correct.** The scope note carries the unvalidated-progression-tree caveat forward verbatim in intent; nodes are `[Skill Node]` placeholders; thresholds are "values TBD by validated content"; no exercise names, orderings, or specific thresholds are invented anywhere in the workout section. The assessment's movement-pattern categories (push/pull/squat-hinge/core-hold) are marked "generic, content TBD," which is acceptable — but see gap 2 on what the assessment structurally outputs.
- **Unified-app structure: correct.** One bottom tab bar; shared Home (energy-balance card), Progress (combined dashboard), and Profile layers; single auth/profile onboarding; the nutrition-first sequencing is correctly expressed as a rollout note ("coming soon" workout tab) rather than a structural split. No two-disconnected-trees failure.
- **Screens without a numbered requirement** (Module Interest, Home dashboard, Legal & Disclaimers) are all explicitly justified in the Flags section against the research's sequencing recommendation and Constraints & Risks (injury liability, NDPR/GDPR positioning). Justified, not scope creep.
- **Deliberately-out-of-scope features** (social, barcode, AI photo, meal planning, gym/external load) are correctly absent.

### Concrete gaps (reasons for rejection)

1. **Req 1 is claimed as fully covered in the traceability table, but its portion-photo reference set is missing from the sitemap entirely.** Requirement 1 reads: real household-unit portions "each mapped to gram weights internally, **plus a portion-photo reference set** — this is the entry-point that mainstream apps fail." The word "photo" appears nowhere in `docs/sitemap.md`. This is not below sitemap granularity: the Ingredient Detail and Composite Meal Detail screens already enumerate portion-selector contents at widget level (household units, gram equivalent, macro/micro preview), so the photo reference was omitted at the document's own operating granularity. The research independently names portion realism the #1 still-open market gap (swallows, submerged solids, shared pots; the Nairobi portion-photo-atlas citation). And unlike Req 13, where partial coverage was honestly flagged, traceability row 1 asserts full coverage with no flag — so the screens stage would take "Req 1 done" at face value and never design it.
2. **Req 9's placement assessment does not structurally account for the Pilates track.** The assessment steps are calisthenics-flavored movement patterns (push/pull/squat-hinge/core-hold) and the result screen is a singular "Starting Tier Placement," while the skill tree has two distinct tracks (Calisthenics, Pilates — Skill Tree Home's own track selector). Req 9 exists to solve the "overwhelming / I don't know where to start" complaint, which the research documents *specifically for Pilates apps* (Pilatesology/Pilates Anytime: "I don't know where to start"). As written, the screens stage could reasonably build a calisthenics-only assessment that leaves a Pilates-lean user (research persona 5, possibly Pilates-only) unplaced — reproducing the exact incumbent failure. The fix is structural, not content: the assessment/results screens must state that placement is per-track (or that each track has its own placement path), while keeping the actual assessment content TBD per Open Question 1.

### Required changes for approval (narrow — everything else should be preserved as-is)

1. Add the portion-photo reference set to the sitemap: either as an element of the Ingredient Detail / Composite Meal Detail portion selector (e.g., "portion-photo reference for the selected household unit") and/or as a Portion Reference Guide screen/sheet reachable from the portion selector — architect's choice — and update traceability row 1 to name it.
2. Clarify the Workout Placement Assessment structure so both tracks get an entry point: state that Assessment Results / Starting Tier Placement is per-track (calisthenics placement and Pilates placement), or that each track has its own short placement flow. Keep all assessment *content* generic/TBD as currently done. Update traceability row 9 accordingly.

**Explicitly approved as-is (must NOT change in revision):** the five-tab navigation structure, the onboarding sequence, all nutrition screens (beyond the additive fix 1), the entire workout tier/node/gate screen set and its placeholder discipline, the Progress and Profile/Settings sections, the modal inventory, the Flags section's honest handling of Req 13 and the three requirement-less screens, and the deferred-features list. Per this pipeline's history: do not silently remove or thin anything while making the two fixes above.

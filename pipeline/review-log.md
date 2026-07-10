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

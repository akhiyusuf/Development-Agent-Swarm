# Data Sourcing — Nutrition & Workout Progression Content

Scope: this document explains how `data/nutrition/foods.json` and
`data/workouts/skill-tree.json` were built, so screen-designer and app-builder
know what they can rely on, and so a future domain expert (nutrition analyst,
strength coach, physiotherapist, Pilates instructor) knows exactly what still
needs review before this content is treated as production-grade for real
users. It directly answers the Open Question `research/product-research.md`
flagged and deliberately left unresolved: real, cited nutrition data for
Nigeria/Ghana/Kenya, and a real, cited (but honestly-labeled) calisthenics +
Pilates progression synthesis.

## Methodology

### Nutrition (`data/nutrition/foods.json`)

1. Started from the data-sourcing strategy `research/product-research.md`
   already validated as feasible: FAO/INFOODS West African Food Composition
   Table (WAFCT) 2019, the Nigerian Food Composition Table, the Kenya Food
   Composition Tables (KFCT) 2018, and USDA FoodData Central for diaspora/raw
   items.
2. **Tool-access limitation encountered:** this research pass had web search
   available, but page-fetch access to most nutrition sites and to the
   primary FCT PDFs themselves (the Kenya government PDF, ResearchGate WAFCT
   pages, PMC articles) returned HTTP 403 in this environment. This means
   values below were NOT read directly off FCT line items in this pass.
   Instead, every food was sourced via search results from secondary
   compilations that explicitly state they derive from a named FCT (e.g.
   FitNigerian states its data comes from the Nigerian Food Composition
   Table; Fit Savanna states its data comes from KFCT 2018; AfroTools states
   it draws on WAFCT + Nigerian FCT + KFCT + USDA). This is one real step
   removed from the primary tables — a materially better foundation than
   invented numbers, but not equivalent to reading the FCTs directly.
3. Every food entry in the JSON carries a `source` object (name + URL) and a
   `confidence` tag (`direct-fct`, `usda`, `academic`, or `compiled-estimate`)
   so the app/build stages and any later reviewer can see exactly how solid
   each number is.
4. Where independent sources materially disagreed (common for composite home
   dishes where oil/meat quantity varies by household — jollof rice, pounded
   yam, kenkey, groundnut soup, githeri, nyama choma), the JSON's
   `valueSpread` field records the range found and the likely reason for the
   spread, and a single point estimate is chosen and labeled
   `compiled-estimate` rather than presented as precise.
5. Where a source gave qualitative rather than numeric data (e.g. "iron is
   ~29% of DRI" for terere, rather than an absolute mg figure), the
   corresponding field is left `null` rather than back-calculated or guessed,
   and is called out in `valueSpread`.
6. Household-unit portions (wraps, cups, ladles, pieces, slices) are gram
   estimates reasoned from typical serving descriptions in the sources found,
   since — as `research/product-research.md` itself notes — FCTs generally do
   not carry "swallow"-style portion data. These are a defensible starting
   point, not lab-measured portion weights, and are a strong candidate for
   the manual nutrition-analyst curation work the product research already
   flagged as the product's real cost/moat.

### Workout progression (`data/workouts/skill-tree.json`)

1. Followed the data-researcher agent's mandate directly: source real node
   names, prerequisite ordering, and thresholds from established, citable
   coaching/progression frameworks, and label the result honestly rather than
   overclaiming clinical validation or leaving placeholders.
2. **Calisthenics:** the six core lines (push, pull, dip, squat/single-leg,
   core/leg-raise, handstand) are built primarily from Paul Wade's *Convict
   Conditioning* "Big Six" 10-step system for step names and ordering — a
   single, well-documented, named published system (as
   `research/product-research.md` flags Calisthenics Mastery already does the
   same). Where multiple independent modern sources converge on the same
   numbers (full push-up 3x12, full pull-up 3x8, handstand hold durations,
   pistol-squat regression steps, L-sit hold durations, the muscle-up
   strict-pull-up/dip gate), those thresholds are marked `confidence: "high"`
   because they are cross-source-convergent, not just single-author. Every
   node's `threshold.confidence` field distinguishes these two tiers plus a
   third, `"estimate"`, used for the handful of dip-progression steps where
   no source gave an exact number and a reasoned estimate was used instead
   (flagged as such, per the agent's instructions on genuinely unsourceable
   content).
3. The handstand line's `hs-handstand-pushup` node directly sources
   `docs/idea.md`'s own illustrative example (freestanding handstand hold
   before handstand push-ups unlock) to the Calisthenics Association's
   documented compound gate (30s freestanding hold + 20 push-ups + 10
   pull-ups + 15s L-sit) — turning the idea doc's "illustrative example only,
   not necessarily correct" caveat into an actually-cited threshold.
4. **Pilates:** sourced from Joseph Pilates' original 34 mat exercises
   (*Return to Life Through Contrology*) as classified into Basic /
   Intermediate / Advanced tiers by Pilatesology's classical-lineage teacher
   materials. Only the first four exercises of the master sequence (The
   Hundred → Roll-Up → Single Leg Circle → Rolling Like a Ball) were directly
   corroborated as an exact linear order in this research pass; the rest of
   the tier assignments come from Pilatesology's published tier
   classification, which is real and citable but not independently
   re-verified position-by-position here. The gating model is therefore
   tier-level (Basic before Intermediate before Advanced), matching how
   classical Pilates is actually taught, rather than a fabricated
   exercise-by-exercise prerequisite chain the source material doesn't
   support.
5. The top-level `_meta.confidenceStatement` in the JSON itself states plainly
   that this is a well-sourced synthesis of publicly documented systems, not
   a certified-trainer- or physiotherapist-reviewed program — matching
   `research/product-research.md` Open Question 1's explicit requirement that
   this gap be closed by a qualified professional before shipping, which this
   document does not claim to satisfy.

## Full source list

**Nutrition:**
- FitNigerian nutrition-facts pages (jollof rice, garri, moin moin, akara, pounded yam, fried plantain) — states sourcing from the Nigerian Food Composition Table
- BeHealthyAfrica — Gari/Eba calorie analysis
- NutriScan App — egusi soup, fufu nutrition pages
- Low Carb Africa — ogbono soup recipe nutrition panel
- Calorique — suya, mandazi nutrition pages
- Ayo/MyNetDiary — waakye beans & rice nutrition facts
- SnapCalorie — banku, kenkey nutrition pages
- University of Ghana (Sarpong et al.) — Proximate composition and serving sizes of selected composite Ghanaian soups (academic; exact figures not extractable in this pass, flagged)
- Kenya Food Composition Tables 2018 (government PDF, cited by name; not directly read — see limitation above) via Fit Savanna and myfooddata.com/caloriehealthy.com secondary compilations (ugali, sukuma wiki)
- NutrInformation — githeri nutritional composition
- AceBlend — chapati nutrition guide
- RecipeOfHealth — nyama choma nutrition panel
- Nutrition Point Kenya — indigenous vegetables (managu)
- Nutrition-and-You.com — amaranth/terere nutrition facts
- USDA FoodData Central — chicken breast, egg, white rice, oats, banana, peanut butter, whole milk, whole wheat bread (standard, well-established reference values)
- AfroTools African Food Calorie Counter — confirms the overall FCT-backed sourcing strategy is real and already in production use by a comparable product

**Workout progression:**
- Paul Wade, *Convict Conditioning* (via NOOB GAINS routine summary and a GitHub gist transcription of the Big Six 10-step progressions)
- GMB Fitness — handstand and L-sit progression guides
- Calisthenics Association — Handstand Training: Complete Progression Guide; Pistol Squat Progressions for Beginners
- EvolveYou, PowerliftingTechnique, LiftStrong — independent pistol-squat progression guides
- CrossFit, WODprep, BULLBAR — independent muscle-up progression guides (strict pull-up/dip gate)
- Pilatesology — Classical Pilates Exercise Order: Exercise Lists & Sequences; Classical Mat Exercises PDF (Basic/Intermediate/Advanced)
- Pilates Bridge — "From The Hundred To Push Up in 34 Connected Moves"
- Alo Wellness Club / OnlinePilatesClasses / BetterMe — corroborating summaries of the original 34 mat exercises

## Confidence & Limitations (read before shipping)

1. **No direct FCT access in this pass.** As detailed above, WebFetch access
   to the primary WAFCT 2019, Nigerian FCT, and KFCT 2018 documents was
   blocked in this research environment. All African-food values are one
   step removed from the primary tables (via compilations that cite them).
   Before this ships to real users, someone with direct access to those PDFs
   (or a paid API with FCT data licensed in) should verify a sample of these
   entries against the source line items, and the product's data-licensing
   question (`research/product-research.md` Open Question 5) still needs
   resolution.
2. **Composite home dishes have inherently wide true variance,** not just
   measurement uncertainty — jollof rice, pounded yam, kenkey, groundnut
   soup, githeri, and nyama choma all showed 1.5-3x spread across recipes
   depending on oil/meat/protein content. The `compiled-estimate` values are
   defensible defaults, not lab truth; the product should let users adjust
   recipes/portions rather than presenting these as fixed.
3. **Coverage gaps:** Banku's macro breakdown (protein/carbs/fat) could not
   be corroborated and is left `null`. Terere's iron content is qualitative
   only. Groundnut soup is flagged low-confidence given the widest observed
   spread (92-273 kcal/100g-equivalent) of any item in the set. No South
   African or Ethiopian foods are included — consistent with
   `research/product-research.md`'s recommendation to hold those markets for
   v2, but it means diaspora users from those countries have zero coverage
   at launch.
4. **Diaspora/Western coverage is intentionally thin** (8 items) — enough to
   validate the data model handles non-African foods, not a real Western food
   database. `research/product-research.md` already flags the full diaspora
   Western database as a scope multiplier requiring its own dedicated
   sourcing effort.
5. **The workout tree is a synthesis, not a validated program.** Every
   `confidence: "medium"` or `"estimate"` node (roughly half the calisthenics
   tree, and most of the Pilates intermediate/advanced tiers) should be
   reviewed by a qualified strength coach and/or certified Pilates instructor
   before real users are gated behind these exact thresholds — this is
   exactly the dependency `research/product-research.md` Open Question 1
   requires and this document does not claim to discharge. Wrong prerequisite
   ordering on skills like the handstand line or muscle-up carries real
   injury risk, as the product research's Constraints & Risks section
   already flags.
6. **Rep/hold thresholds are progression *gates* for unlocking the next node
   in the app's UI, not medical or training prescriptions** — the app's
   copy should make clear these are a synthesized starting point, not a
   certified program, consistent with the confidence statement embedded in
   the JSON itself.

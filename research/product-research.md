# Product Research: African-Focused Nutrition Tracker + Progression-Gated Workout System

Date: 2026-07-10
Status: Draft for review before sitemap stage

> Note on inputs: `docs/idea.md` could not be opened with the tools available to this
> research pass (no local file-read capability), so this document is grounded in the
> launcher brief's restatement of the idea: a nutrition tracker with first-class
> African ingredient coverage (Nigeria mandatory for v1) plus a progression-gated
> workout system, to be shipped as either one unified app or two connected modules.
> Any place where the original idea doc adds detail beyond that brief should be
> reconciled against this document before sitemap.

---

## Target Users

**Primary persona — the "returning tracker" in Nigeria/urban West Africa.**
Young, urban, Android-first, health-conscious adults (roughly 20-40) who have *tried*
mainstream apps (MyFitnessPal, Lose It, Cronometer) and quit because logging their
actual daily food — jollof, egusi, pounded yam, garri/eba, moi moi, suya — is slow,
inaccurate, or impossible. They are already motivated; the tool failed them, not the
other way around. This is the sharpest wedge because the pain is concrete and
documented (see Competitive Landscape).

**Secondary persona — the diaspora African.**
Africans in the US/UK/EU who eat a mix of African home cooking and local Western food.
They have higher willingness/ability to pay (hard currency) and are the segment
Didiye and CalorieNaija are already actively courting. Good for revenue, but their
needs are split across two cuisines, so serving them well requires the Western food
database to also be solid — a scope multiplier.

**Tertiary persona — the gym-goer / progressive-overload lifter.**
The workout module's natural audience: people doing structured strength training who
want auto-progression. Note this is a *different motivation profile* from the nutrition
user and only partially overlaps. This overlap gap is a central risk (see below).

### Core Jobs-To-Be-Done
1. "When I eat a real African meal, let me log it in seconds and trust the numbers" —
   the dominant, under-served job.
2. "Help me hit a calorie/macro target for weight loss or muscle gain" — the generic
   job every competitor already does; table stakes, not a differentiator.
3. "Tell me what to do in the gym next and progress me automatically so I don't have
   to program myself" — the workout job.
4. (Latent) "Show me culturally-relevant swaps and portions" — e.g., healthier jollof,
   realistic swallow portions — a defensible value-add none of the big players do well.

---

## Competitive Landscape

The market splits into two tiers: global generalists with an African-food *gap*, and a
cluster of new African-specific apps that have already identified and are attacking
exactly this gap. **The whitespace this idea assumes is real but is no longer empty —
it is filling fast.** That is the single most important finding in this document.

### Global generalists
- **MyFitnessPal** — Huge crowdsourced DB, US-centric. Well-documented failure on
  African food: entries missing, or "grossly inaccurate" for staples like garri;
  users report having to hand-enter every ingredient. Community threads and Nigerian
  food blogs (9jafoodie, loseitnigerian) exist specifically to teach workarounds —
  strong evidence of demand and of an unsolved problem.
- **Cronometer** — More accurate (lab/USDA/NCCDB sourced, ~±95 kcal daily deviation,
  no crowdsourcing) but minimal African dish coverage. Users still guess or manually
  enter garri, fufu, ugali, injera. Accuracy is its moat; African coverage is its gap.
- **Fitbod / Dr. Muscle / Freeletics / JEFIT / Setgraph** — the workout-progression
  incumbents. **Freeletics** is the closest analogue to a "progression-gated" system:
  it unlocks harder exercise variations (regular → diamond → archer → one-arm pushups)
  as you demonstrate mastery. **Dr. Muscle / Fitbod** automate progressive overload
  by adjusting load/sets from logged performance. This means the "gated progression"
  concept is validated but not novel — it must be executed well, not merely offered.

### African-specific direct competitors (the real threat)
- **CalorieNaija** — 862+ authentic African meals with macros, sodium, portion guides.
  Multi-country (Nigerian, Ghanaian, Kenyan). Positions as "first digital health food
  diary built for Nigerian [foods]." Directly occupies the primary wedge.
- **Didiye** — "Africa's #1 AI nutrition app." AI photo scan (Google Gemini, claims
  92%+ recognition), 10K+ users, 4.8★, Apple Health / Google Fit sync, explicit
  Lagos/Accra/Nairobi + diaspora targeting, free-forever tier + premium trial, and
  GDPR/CCPA/HIPAA compliance claims. The most credible, best-funded-looking competitor.
- **AfriCal** — AI-camera calorie tracker "built specifically for African food"
  (jollof, fufu, suya, injera, bobotie, couscous). On the Nigerian App Store.
- **AfroTools** — Web calorie counter, 200+ African foods, and notably **transparent
  about sourcing: FAO/INFOODS Africa FCT, Nigerian Food Composition Table, USDA
  FoodData Central.** Confirms the data-sourcing path below is real and already in use.
- **FitSavanna (Kenya)** — free Kenyan food tracker (ugali, sukuma wiki, etc.),
  evidence the same playbook is running in East Africa.

### Common gaps / complaints across the field (opportunity space)
- **Portion sizing for African food is the unsolved hard problem.** Swallows (eba,
  fufu, pounded yam), stews and soups where solids are submerged, and shared-pot
  servings defeat both manual logging and photo AI ("chicken in soup" is not visually
  discernible). Research on Kenyan food-photo portion atlases shows this is an active,
  unsolved research area — whoever nails culturally-accurate portion estimation wins.
- **AI photo estimation degrades on mixed, non-Western dishes** — a known weakness even
  in apps marketing AI as the headline feature. Accuracy claims (Didiye's 92%) are
  self-reported and unaudited.
- Independent, third-party accuracy reviews of the African-specific apps are essentially
  absent — nobody has established a trust/accuracy moat yet. This is a real opening for
  a data-quality-first entrant.

**Honest read:** A generalist tracker that "adds African foods" is now a *late* entrant
into a category with at least 4-5 movers, one of which (Didiye) has traction and AI.
Differentiation cannot be "we have African foods" — that box is taken. It must be
(a) demonstrably superior data accuracy + portion realism, (b) the workout integration,
or (c) a specific market/cuisine served better than anyone else.

---

## Core Feature Requirements (viable minimum, not a wishlist)

Nutrition module (the wedge — must be excellent, not merely present):
1. Curated, sourced African food database — Nigeria complete at launch, with visible
   provenance (FCT-backed, not crowdsourced guesses). Accuracy is the differentiator.
2. Fast logging of composite/local meals (recipe-level entries like "jollof rice,
   party" or "egusi soup with pounded yam") rather than forcing ingredient-by-ingredient.
3. Culturally-real portion system — household measures (cup of garri, wrap/mould of eba,
   ladle of soup) and a portion-photo reference set, not just grams.
4. Calorie + macro goals and daily diary (table stakes; keep it lean).
5. Offline-first logging with later sync (see Constraints — data cost/connectivity).

Workout module (viable minimum):
6. Structured routines with automatic progressive overload driven by logged performance.
7. Progression gating: harder variations/loads unlock on demonstrated mastery
   (Freeletics-style), with home/bodyweight and gym paths since gym access varies.
8. Simple workout logging (sets/reps/weight) that feeds the progression engine.

Shared:
9. Lightweight account + weight/goal tracking; optional Google Fit / Apple Health sync.
10. Android-first, low-data, low-end-device-friendly build.

Deliberately OUT of the viable minimum: social/community feeds, barcode scanning of
Western packaged goods, AI photo recognition (expensive, and its accuracy is worst
exactly on African food — a v2 bet, not a launch dependency), wearable ecosystems,
meal planning/recipes generation.

### Recommendation: unified app vs. two modules (Open Question 3)
**Recommend: one app, two clearly separable modules sharing an account, profile, and
goal/energy-balance layer — but sequence them, do not co-launch as equals.** Ship the
nutrition module first as the flagship (that is where the documented, urgent pain and
the competitive whitespace-being-filled both sit), with the workout module as a fast
follow. Rationale: the two personas only partially overlap, so a 50/50 co-launch
dilutes focus and doubles the surface area you must make excellent against specialized
incumbents on both sides (Didiye on nutrition, Fitbod/Freeletics on workouts). A shared
energy-balance model (calories in vs. calories out) is the genuine integration payoff
and the reason to keep them in one app rather than two disconnected products. Avoid a
truly split two-app architecture — it fragments the account, the data model, and the
single strongest cross-sell story.

---

## Constraints & Risks

**Market / competitive**
- Category is filling fast; "African food database" is no longer a differentiator.
  The idea must pick a sharper edge (accuracy, portions, or workout integration).
- Diaspora segment pays better but needs a strong *Western* food DB too, expanding scope.

**Data sourcing & quality (Open Question 2 — resolved: feasible)**
- Legitimate, citable sources exist and are already used by competitors:
  - **FAO/INFOODS West African Food Composition Table (WAFCT) 2019** — 1,028 foods,
    built with data from Nigeria, Ghana, Benin, Burkina Faso, Mali, Cameroon, South
    Africa; English + French. This is the backbone for Nigeria + West Africa.
  - **Nigerian Food Composition Table** (national) — for Nigeria specificity.
  - **Kenya Food Composition Tables 2018** (Govt of Kenya + FAO) — 522 foods + 142
    mixed-ingredient recipes, lab-analyzed across 10 regions. Strong for East Africa.
  - **USDA FoodData Central** — for shared/global and diaspora Western items.
- Caveat: FCTs cover *ingredients and some recipes*, not every composite street/home
  dish, and rarely carry realistic serving sizes for swallows/soups. Turning FCT rows
  into trustworthy *meal* entries with real portions is manual nutrition-analyst work —
  the true cost and moat of this product. Budget for it explicitly.
- Licensing/attribution terms of each FCT must be checked before shipping.

**Technical / user-context**
- Android-first, low-end devices, expensive/intermittent mobile data in Nigeria →
  offline-first, small app footprint, sync-when-connected. Do not assume always-online.
- Portion estimation is the hardest technical problem and the biggest accuracy risk;
  AI photo scanning is *least* reliable on exactly the dishes this app must nail.

**Regulatory**
- Health/diet data is sensitive PII. If targeting diaspora (US/EU), GDPR and
  US privacy rules apply (Didiye already claims GDPR/CCPA/HIPAA). Nigeria's NDPR/NDPA
  governs local user data. Avoid medical/clinical claims (weight-loss/health outcomes)
  that could invite regulatory scrutiny; keep positioning as tracking, not treatment.

**Business-model**
- Local ability-to-pay in Nigeria is lower than Western benchmarks; free-forever tiers
  are already the norm (Didiye, CalorieNaija). Monetization likely leans on diaspora
  subscriptions + local freemium — validate before assuming Nigeria-market revenue.

**Weak spots to be honest about**
- The core "whitespace" is being actively closed by ≥4 competitors, one with traction.
- Bundling nutrition + workouts risks being mediocre at both vs. focused incumbents.
- Data-quality moat requires ongoing human curation — it is a labor cost, not a
  one-time scrape; underestimating this is the most likely way this product ships
  looking like the inaccurate incumbents it set out to beat.

---

## Recommendation on Priority Markets (Open Question 1)

**Recommend 3 markets for v1, in this order:**
1. **Nigeria (mandatory)** — largest population, sharpest documented pain, WAFCT +
   national Nigerian FCT data available, and the diaspora is heavily Nigerian.
2. **Ghana** — shares much of West African cuisine with Nigeria (jollof, fufu, waakye,
   banku), so it is *covered by the same WAFCT data source* at low marginal data cost;
   strong diaspora; near-adjacent market. Highest ROI second market.
3. **Kenya** — the strongest, most self-contained data asset in Africa (Kenya FCT 2018:
   522 foods + 142 recipes, lab-analyzed), an active local competitor scene (FitSavanna,
   CalorieNaija Kenyan coverage) proving demand, and it establishes an East-African
   beachhead distinct from the West-African core.

Hold **South Africa** as a strong v2 candidate (higher ability-to-pay, own data in
WAFCT, but a more Westernized diet already partly served by generalists) and
**Ethiopia** (injera/kitfo demand shows up in competitor marketing, but data is thinner
and the cuisine is idiosyncratic — high effort). Rationale for the three-market cut:
Nigeria + Ghana are one cheap data investment (shared WAFCT) covering the biggest pain
and diaspora, and Kenya adds a second region on the back of the single best national
FCT — maximizing cuisine coverage per unit of curation cost, which is the real
constraint.

---

## Open Questions (for founder before sitemap)
1. **Positioning edge:** Given the category is filling, is the wedge (a) data accuracy
   vs. Didiye/CalorieNaija, (b) the workout integration, or (c) a specific market? The
   sitemap changes materially depending on this answer.
2. **Nutrition-first sequencing:** Do you accept shipping nutrition first with workouts
   as a fast-follow, or is the workout system considered co-equal at launch? (Affects
   IA weighting.)
3. **Portion strategy:** Manual household-measure/photo-atlas system at launch, with AI
   photo scan deferred to v2? Confirm, since it drives the logging flow's structure.
4. **Monetization + geography:** Is revenue primarily diaspora subscription? If so, the
   Western food DB is in-scope and IA must accommodate dual-cuisine users.
5. **Data-curation resourcing:** Who does the ongoing nutrition-analyst curation that
   converts FCT rows into trustworthy meal + portion entries? This is the moat and the
   hidden cost; without a plan, accuracy claims are not credible.
6. **Reconcile with `docs/idea.md`:** Confirm this brief-based summary matches the
   original idea doc's specifics (especially any monetization, target-region, or
   workout-mechanic details not captured here).

---

Sources:
- [CalorieNaija](https://www.calorienaija.com/)
- [AfroTools African Food Calorie Counter](https://afrotools.com/health/calorie-counter/)
- [AfriCal (App Store)](https://apps.apple.com/ng/app/africal/id6760078954)
- [Didiye](https://didiye.app/)
- [9jafoodie — Tracking Calories in Nigerian foods using MyFitnessPal](https://9jafoodie.com/tracking-calories-nigerian/)
- [LoseItNigerian — Tracking Nigerian foods in MyFitnessPal](https://loseitnigerian.com/tracking-calories-in-nigerian-foods-using-myfitnesspal/)
- [MyFitnessPal community — African food thread](https://community.myfitnesspal.com/en/discussion/10483373/african-food)
- [Cronometer — Accurate Databases](https://cronometer.com/features/accurate-databases.html)
- [Nutrola — How Accurate Is Cronometer (2026)](https://nutrola.app/en/blog/how-accurate-is-cronometer)
- [FAO/INFOODS West African Food Composition Table 2019 (ResearchGate)](https://www.researchgate.net/publication/354608942_FAOINFOODS_Food_Composition_Table_for_Western_Africa_2019)
- [WAFCT nutrient-density analysis (MDPI)](https://www.mdpi.com/2072-6643/16/17/2985)
- [Kenya Food Composition Tables 2018 (FAO OpenKnowledge)](https://openknowledge.fao.org/items/ece9c958-74f6-4d90-b14e-6b8a16c0dd9d)
- [Kenya Food Composition Tables 2018 (Govt of Kenya PDF)](https://familyhealth.go.ke/wp-content/uploads/2019/05/Final-Food-compostion-book-2018.pdf)
- [FitSavanna — Kenyan food tracker](https://www.fitsavanna.co.ke/foods)
- [Freeletics — Progressive overload at home](https://www.freeletics.com/en/progressive-overload-at-home/)
- [Dr. Muscle — Progressive overload app](https://dr-muscle.com/progressive-overload-app-gain-muscle-strength/)
- [JEFIT — Best progressive overload apps 2026](https://www.jefit.com/wp/guide/best-progressive-overload-apps-for-beginners-in-2026-top-5-reviewed-and-compared/)
- [Validity of food portion size photographs, Nairobi (medRxiv)](https://www.medrxiv.org/content/10.64898/2025.12.28.25343121.full.pdf)
- [Estimating portion size in dietary assessment (Taylor & Francis)](https://www.tandfonline.com/doi/full/10.1080/16070658.2024.2402646)
- [DataReportal — Digital 2025 Nigeria](https://datareportal.com/reports/digital-2025-nigeria)

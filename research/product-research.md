# Product Research

Scope: This document turns the concept in `docs/idea.md` into a grounded, evidence-based foundation for the sitemap stage. The idea is a single mobile app combining (a) a nutrition/calorie tracker built around African regional foods and their real portions, with macro **and** micronutrient data where available, and (b) a bodyweight-only workout module structured as a **calisthenics + Pilates skill tree** with **objective mastery gates** (e.g., you must hold a freestanding handstand before handstand push-ups unlock), tracking each user's current unlocked tier and the time/rep thresholds they have hit. There is no gym, no machines, and no external load in the concept — progression comes from harder bodyweight variations, not added weight.

---

## Target Users

### Nutrition-side personas

1. **The West/East African weight-and-health tracker.** Someone in Nigeria, Ghana, or Kenya trying to lose fat, manage a condition, or eat more deliberately. Their jobs-to-be-done: log what they actually ate (eba, fufu, jollof rice, egusi, ugali, injera, suya, waakye) without guessing a US equivalent; understand portions in the units they serve food in (a "wrap" of eba, a cup of garri, a "swallow"), not raw grams they never weigh; and see whether they are hitting calorie/macro targets. Their core frustration is that mainstream trackers force them to substitute foreign foods and mis-estimate portions, so the log is wrong from the first entry. This is the sharpest wedge because the pain is concrete and already documented (see Competitive Landscape).

2. **The diaspora African.** Africans in the US/UK/EU who eat a mix of African home cooking and local Western food. They have higher willingness/ability to pay (hard currency) and are the segment Didiye and CalorieNaija are already actively courting. Good for revenue, but their needs are split across two cuisines, so serving them well requires the Western food database to also be solid — a scope multiplier, not a free extension of the African-food work.

3. **The micronutrient-conscious user.** A subset — pregnant/postpartum women, people flagged for anemia, iron/vitamin-A/zinc/folate deficiencies (which are regionally common) — who need to see vitamins and minerals, not just calories. Mainstream African-food apps largely stop at calories and macros, so this job is currently unserved locally.

### Workout-side personas

4. **The home/outdoor bodyweight trainer.** Someone training with no gym and no weights — floor, a wall, maybe a pull-up bar or park. Their job-to-be-done is to progress from "I can do a push-up" toward named skills (handstand, pistol squat, pull-up, L-sit, muscle-up) through a **safe, ordered path**, and to know objectively when they are ready to attempt the next skill rather than jumping ahead and getting hurt or stalling. Calisthenics is inherently skill-gated: you cannot safely program handstand push-ups before a controlled handstand hold, which is exactly the mastery-gate model the idea proposes.

5. **The mobility/core-and-control trainer (Pilates lean).** A user who wants the Pilates side — mat-based core, control, flexibility, and stability progressions — either on its own or as a complement to the calisthenics strength track. Their job is a structured beginner-to-advanced mat progression that tells them where to start and what unlocks next, which most Pilates apps handle as a video library rather than a gated path.

Realistically these are overlapping but not identical audiences. The unifying thread — and the reason a single app is defensible — is **bodyweight-only, progression-gated training plus locally-accurate nutrition**, aimed first at the same African market where the nutrition gap is sharpest.

### Core Jobs-To-Be-Done
1. "When I eat a real African meal, let me log it in seconds and trust the numbers" — the dominant, under-served job.
2. "Help me hit a calorie/macro target for weight loss or muscle gain" — the generic job every competitor already does; table stakes, not a differentiator.
3. "Take me from where I am to a named bodyweight skill (handstand, pistol squat, muscle-up) or a stronger Pilates practice through a safe, ordered path, and tell me objectively when I'm ready for the next step" — the workout job. Note this is a *different* motivation profile from the pure nutrition user and only partially overlaps — this overlap gap is a central risk (see Constraints & Risks).
4. (Latent) "Show me culturally-relevant swaps and portions, and the vitamins/minerals I'm actually getting" — e.g., healthier jollof, realistic swallow portions, micronutrient visibility — a defensible value-add none of the big players do well.

---

## Competitive Landscape

The market splits into two tiers: global generalists with an African-food *gap*, and a cluster of new African-specific apps that have already identified and are attacking exactly this gap. **The whitespace this idea assumes is real but is no longer empty — it is filling fast.** That is one of the most important findings in this document.

### Nutrition competitors

| Product | What it offers | Gaps / complaints |
|---|---|---|
| **MyFitnessPal** | Huge crowd-sourced database, barcode scanning, macro tracking. | African foods are sparse, inconsistent, and crowd-entered with unreliable values; users resort to logging jollof as "rice + oil" guesses. Portions assume Western serving conventions. Micronutrient view is paywalled/limited. Documented workaround culture (e.g., 9jafoodie's and LoseItNigerian's guides to bending MFP around Nigerian food) is itself evidence of demand and of an unsolved problem. |
| **Cronometer** | Best-in-class micronutrient tracking, sourced from curated tables (incl. USDA), ~±95 kcal daily deviation, no crowdsourcing. | Excellent nutrient depth but almost no African regional foods; users must build custom entries by hand. Strong proof, though, that credible micronutrient tracking is possible when sourced from real food-composition tables rather than crowd data. Accuracy is its moat; African coverage is its gap. |
| **CalorieNaija** | ~860+ African meals (egusi, jollof, pounded yam, injera) with macros, sodium, and portion guides; positioned for Nigeria/Ghana/Kenya as "first digital health food diary built for Nigerian [foods]." Directly occupies the primary wedge. | Calorie/macro-first; little to no full micronutrient panel. Breadth of database and portion accuracy still maturing. |
| **Didiye** | "Africa's #1 AI nutrition app." AI photo scan (Google Gemini, claims 92%+ recognition) for jollof, fufu, suya, ugali; 10K+ users, 4.8★, Apple Health/Google Fit sync, explicit Lagos/Accra/Nairobi + diaspora targeting, free-forever tier + premium trial, GDPR/CCPA/HIPAA compliance claims. The most credible, best-funded-looking competitor. | AI-estimation accuracy on mixed local dishes is unproven at scale (self-reported, unaudited); leans on photo inference over a validated food-composition backbone; micronutrients not a focus. |
| **AfriCal** | AI-camera calorie tracker "built specifically for African food" (jollof, fufu, suya, injera, bobotie, couscous), on the Nigerian App Store, positioned "generic trackers are useless." | New/small; limited public evidence of database depth or micronutrient coverage. |
| **AfroTools calorie counter** | ~200+ African foods, and notably **transparent about sourcing**: FAO/INFOODS Africa FCT, Nigerian Food Composition Table, USDA FoodData Central. Confirms the data-sourcing path below is real and already in use. | Small curated set; a web tool rather than a full tracking product; no workout side. |
| **FitSavanna** | Free Kenyan food tracker (ugali, sukuma wiki, etc.) — evidence the same playbook is running in East Africa. | Thin public footprint; unclear database rigor and micronutrient support. |

**Read of the nutrition market:** a cluster of young African-food trackers now exists, so "African foods" alone is no longer a moat. The still-open gaps are: (1) **portion realism** in local serving units rather than grams — swallows (eba, fufu, pounded yam), stews and soups where solids are submerged, and shared-pot servings defeat both manual logging and photo AI ("chicken in soup" is not visually discernible; research on Kenyan food-photo portion atlases shows this is an active, unsolved research area); (2) **credible micronutrient data** (the African-focused apps mostly stop at calories/macros; the app that does micros well, Cronometer, lacks the foods); and (3) **pairing nutrition with a real training system** — none of these combine both. Independent, third-party accuracy reviews of the African-specific apps are essentially absent — nobody has established a trust/accuracy moat yet, which is a real opening for a data-quality-first entrant.

**Honest read:** A generalist tracker that "adds African foods" is now a *late* entrant into a category with at least 4-5 movers, one of which (Didiye) has traction and AI. Differentiation cannot be "we have African foods" — that box is taken. It must be (a) demonstrably superior data accuracy + portion realism, (b) credible micronutrient depth, (c) the workout integration, or (d) a specific market/cuisine served better than anyone else.

### Workout competitors (on-category: calisthenics skill-trees + Pilates)

| Product | What it offers | Gaps / complaints |
|---|---|---|
| **Calistree (Movesta)** | Directly a **skill-tree** app: 1,300+ bodyweight exercises organized into trees by level, each pointing toward harder unlocks; adaptive suggestions; generous free tier. | Widely reported as **overwhelming for beginners** — great once you're past the basics, but users "still figuring out the basics may find the complexity overwhelming." So the tree exists but onboarding/where-to-start is weak. Also lets you add weight vests/bands, i.e. it drifts from pure bodyweight. |
| **Calisthenics Mastery** | Progressive calisthenics with **unlockable advanced exercises** as you progress; auto-adds reps/sets; follows Convict Conditioning progressions; ~4.4/5. | Complaints: confusing app/website layout; limited exercise variety (weak on abs/core); support routed to a Facebook login. Progression is rep/set-based rather than skill-hold-gated, and the underlying Convict Conditioning progressions are a single opinionated system, not an independently validated standard. |
| **Thenx** | 1,000+ bodyweight exercises, "step-by-step progressions," daily recommendations, rep/set logging, muscle analytics, 2M+ user community; $19.99/mo. | In practice this is largely a **video-content + community** product with loosely-guided progression; the "progression" is recommendation-driven, not enforced by objective mastery gates. Premium paywall gates the useful tracking/analytics. |
| **Freeletics** (progression-gating analogue) | AI bodyweight coach that unlocks harder variations (incline→flat→decline push-up, squat→pistol) and has an explicit **Skill Progressions** feature: a skill is only "mastered" — unlocking advanced exercises — when the user self-assigns a star at max feedback. | The gate is **self-rated**, not objective: mastery is whatever the user says it is, so it can be gamed or misjudged. This is the clearest analogue to the idea's gating model, and it exposes exactly why the idea's **objective time/rep thresholds** (hold X seconds, do Y clean reps) would be a differentiator over feedback-only gating. |
| **Pilates: Pilatesology / Pilates Anytime** | Pilatesology: classical mat, structured beginner→intermediate→advanced programs that layer new exercises class by class. Pilates Anytime: 400+ classes across all levels. | Common complaint: **"I don't know where to start"** — large libraries with named classes but no enforced path or readiness check; beginners can't tell what unlocks what. Also web/app history-sync issues. Pilates is conventionally leveled (beginner/intermediate/advanced), which maps cleanly onto a tier system, but no mainstream app **gates** the next level on demonstrated competence. |

**Read of the workout market:** skill-tree calisthenics apps exist (Calistree, Calisthenics Mastery) and one bodyweight coach (Freeletics) does progression-gating, but (a) their gates are self-rated or rep-count based rather than **objective skill-hold thresholds**, (b) beginners consistently report the trees are overwhelming with no clear entry point, and (c) **none combine calisthenics and Pilates into one progression system**, and none tie training to nutrition. The idea's wedge is objective, safe, gated progression across both disciplines — but see Open Questions on whether those trees can be validated. This means the "gated progression" concept itself is validated as a category — it must be executed well (and objectively), not merely offered.

---

## Core Feature Requirements

The minimum that actually solves the users' problems (not a wishlist):

### Nutrition module
1. **Regional-food database with real portions.** African foods (Nigeria/Ghana/Kenya first) logged in the units people serve them in (wraps, cups, ladles, "swallows"), each mapped to gram weights internally, plus a portion-photo reference set — this is the entry-point that mainstream apps fail.
2. **Fast logging of composite/local meals** (recipe-level entries like "jollof rice, party" or "egusi soup with pounded yam") rather than forcing ingredient-by-ingredient, alongside search/recent/favorites/custom-food logging fast enough for daily use.
3. **Macro tracking against goals.** Calories + protein/carb/fat with per-day targets. Table stakes; keep it lean.
4. **Micronutrient data (vitamins & minerals) where available.** Iron, zinc, calcium, vitamin A, folate, vitamin B12 at minimum — the regionally deficiency-relevant nutrients — surfaced per food and per day. This is Differentiator #1 in `docs/idea.md` and is the clearest unmet need versus the African-food incumbents. It is achievable because the sourced food-composition tables carry this data (see below); coverage will be partial, so the UI must degrade gracefully to "no micronutrient data for this food" rather than showing zeros.
5. **Offline-first logging with later sync** (see Constraints — data cost/connectivity).

**Data sourcing (resolved — feasible):** the food database should be built on **validated food-composition tables**, not crowd data:
- **FAO/INFOODS West African Food Composition Table (WAFCT) 2019** — 1,028 foods (complete data for ~909, including vitamins and minerals), built with data from Nigeria, Ghana, Benin, Burkina Faso, Mali, Cameroon, South Africa; English + French. This is the backbone for Nigeria + West Africa.
- **Nigerian Food Composition Table** (national) — for Nigeria specificity.
- **Kenya Food Composition Tables 2018** (Govt of Kenya + FAO) — 522 foods + 142 mixed-ingredient recipes, lab-analyzed across 10 regions. Strong for East Africa.
- **USDA FoodData Central** — for shared/global, diaspora Western, and non-regional/processed items.

This is the same sourcing strategy AfroTools uses, and it is what makes credible micronutrient tracking possible — not just achievable in principle. Caveat: FCTs cover *ingredients and some recipes*, not every composite street/home dish, and rarely carry realistic serving sizes for swallows/soups. Turning FCT rows into trustworthy *meal* entries with real portions — and filling recipe-level values raw ingredient tables don't provide directly — is manual nutrition-analyst work: the true cost and moat of this product. Budget for it explicitly. Licensing/attribution terms of each FCT must be checked before shipping.

### Workout module
6. **A defined skill tree spanning calisthenics and Pilates**, organized into tiers, where each node is a bodyweight (no external load) skill with explicit prerequisites.
7. **Objective mastery gates.** Each unlock is conditioned on demonstrated performance — a **time hold** (e.g., freestanding handstand ≥ N seconds) or a **rep threshold** (e.g., N clean reps) — recorded by the user, not a subjective "I feel ready." This is the differentiator over Freeletics-style self-rated gating.
8. **Per-user progression state.** Track current unlocked tier per skill line and the thresholds the user has logged toward the next unlock, so the app always answers "what am I working on and what's next."
9. **Clear entry point / onboarding.** An assessment that places a beginner at the right starting tier — directly addressing the #1 complaint across Calistree/Pilates apps ("overwhelming / I don't know where to start").
10. **Exercise instruction per node** (form cues, what "clean" reps/holds mean) so the gates are meaningful and safe.
11. **Simple session logging** (reps, hold duration) that feeds the progression engine and records thresholds hit.

### Shared / cross-cutting
12. **Single account tying nutrition and training together, with lightweight profile/weight/goal tracking** — the reason to be one app rather than two, and the genuine integration payoff (a shared calories-in-vs-out model).
13. **Android-first, low-data, low-end-device-friendly build**; optional Google Fit / Apple Health sync.

Deliberately OUT of the viable minimum: social/community feeds, barcode scanning of Western packaged goods, AI photo recognition (expensive, and its accuracy is worst exactly on African food — a v2 bet, not a launch dependency), wearable ecosystems, meal-planning/recipe generation, external-load/gym tracking (out of scope for this concept entirely).

### Recommendation: unified app vs. two modules
**Recommend: one app, two clearly separable modules sharing an account, profile, and goal/energy-balance layer — but sequence them, do not co-launch as equals.** Ship the nutrition module first as the flagship (that is where the documented, urgent pain and the competitive whitespace-being-filled both sit — buildable on existing food-composition data today), with the workout module as a fast follow, since the workout module depends on progression trees that still require expert validation (see Open Questions) and should not block launch. Rationale: the nutrition and workout personas only partially overlap, so a 50/50 co-launch dilutes focus and doubles the surface area you must make excellent against specialized incumbents on both sides (Didiye on nutrition, Calistree/Freeletics/Pilatesology on workouts). A shared energy-balance model (calories in vs. calories out) is the genuine integration payoff and the reason to keep them in one app rather than two disconnected products. Avoid a truly split two-app architecture — it fragments the account, the data model, and the single strongest cross-sell story.

### Recommendation on Priority Markets
**Recommend 3 markets for v1, in this order:**
1. **Nigeria (mandatory)** — largest population, sharpest documented pain, WAFCT + national Nigerian FCT data available, and the diaspora is heavily Nigerian.
2. **Ghana** — shares much of West African cuisine with Nigeria (jollof, fufu, waakye, banku), so it is *covered by the same WAFCT data source* at low marginal data cost; strong diaspora; near-adjacent market. Highest ROI second market.
3. **Kenya** — the strongest, most self-contained data asset in Africa (Kenya FCT 2018: 522 foods + 142 recipes, lab-analyzed), an active local competitor scene (FitSavanna, CalorieNaija Kenyan coverage) proving demand, and it establishes an East-African beachhead distinct from the West-African core.

Hold **South Africa** as a strong v2 candidate (higher ability-to-pay, own data in WAFCT, but a more Westernized diet already partly served by generalists) and **Ethiopia** (injera/kitfo demand shows up in competitor marketing, but data is thinner and the cuisine is idiosyncratic — high effort). Rationale for the three-market cut: Nigeria + Ghana are one cheap data investment (shared WAFCT) covering the biggest pain and diaspora, and Kenya adds a second region on the back of the single best national FCT — maximizing cuisine coverage per unit of curation cost, which is the real constraint.

---

## Constraints & Risks

**Market / competitive**
- Category is filling fast; "African food database" is no longer a differentiator on its own. The idea must pick a sharper edge (accuracy, portions, micronutrient depth, or workout integration).
- Diaspora segment pays better but needs a strong *Western* food DB too, expanding scope.

**Food-composition data licensing, quality & upkeep**
- WAFCT/FAO-INFOODS and national FCTs have usage terms and go stale; composite dishes (jollof, egusi soup) must be built up from ingredient tables with assumptions about recipe and prep, introducing error. Portion-to-gram mapping is a manual, error-prone modeling effort.
- **Micronutrient coverage is incomplete.** FCTs have missing cells and vary in analytical rigor; some foods will lack vitamin/mineral values entirely. The product must show honest "no data" states and avoid implying precision it doesn't have — over-claiming micronutrient accuracy is both a trust and a potential health-liability risk.
- Turning FCT rows into trustworthy meal entries with real portions is manual nutrition-analyst work — the true cost and moat of this product. Budget for it explicitly; underestimating this is the most likely way this product ships looking like the inaccurate incumbents it set out to beat.

**Technical / user-context**
- Android-first, low-end devices, expensive/intermittent mobile data in target markets → offline-first, small app footprint, sync-when-connected. Do not assume always-online.
- Portion estimation is the hardest technical problem and the biggest accuracy risk; AI photo scanning is *least* reliable on exactly the dishes this app must nail.

**Injury liability on the workout side**
- Gated bodyweight progressions (handstands, muscle-ups) carry real injury risk if the tree ordering is wrong. Objective gates reduce but do not eliminate this; wrong prerequisites could actively cause harm. Requires disclaimers and, more importantly, validated progressions (see Open Questions).
- Self-reported gates are trust-dependent: objective thresholds only work if users honestly log holds/reps; there's no sensor verification. This is a design constraint, not a blocker, but it caps how "objective" the gating truly is.

**Regulatory**
- Health/diet data is sensitive PII. If targeting diaspora (US/EU), GDPR and US privacy rules apply (Didiye already claims GDPR/CCPA/HIPAA). Nigeria's NDPR/NDPA governs local user data. Avoid medical/clinical claims (weight-loss/health outcomes, deficiency diagnosis) that could invite regulatory scrutiny; keep positioning as tracking/education, not treatment.

**Business-model**
- Local ability-to-pay in Nigeria is lower than Western benchmarks; free-forever tiers are already the norm (Didiye, CalorieNaija). Monetization likely leans on diaspora subscriptions + local freemium — validate before assuming Nigeria-market revenue given thin unit economics for licensed food data + expert-validated training content at low ARPU.

**Two products in one**
- Nutrition tracking and a progression-gated training system are genuinely different products with different data and design problems. Doing both well is a real scope risk; nutrition-first sequencing is the mitigation, not a full solution.

### Honest weak spots in the idea
- **The core "whitespace" is being actively closed** by ≥4-5 competitors, one (Didiye) with real traction. "African foods" alone is no longer a moat.
- **The "combine everything" instinct is the biggest risk.** Nutrition + calisthenics + Pilates + micronutrients + gated progression is a lot. Each incumbent that's succeeding does *one* of these. The bundle is the thesis, but it's also the thing most likely to produce a shallow app that loses to focused competitors on each axis. The strongest version of this idea might ship the nutrition tracker alone first and earn the right to add training.
- **The workout differentiator rests on an unvalidated asset.** The objective-gate skill tree is the core novelty, yet the actual correct/safe trees don't exist yet (see Open Questions). Until they're validated, the differentiator is a promise, not a feature.
- **Micronutrient accuracy could become a liability rather than a selling point** if coverage is thin and users trust it for health decisions.
- **Data-quality moat requires ongoing human curation** — it is a labor cost, not a one-time scrape.
- **Willingness to pay is unproven.** The target market is price-sensitive; incumbents lean on free tiers. The unit economics of maintaining licensed food data + expert-validated training content for a low-ARPU market are unclear.

---

## Open Questions

1. **Validated progression trees (unresolved, needs dedicated exercise-science validation — out of scope here, must not be assumed).** `docs/idea.md` itself flags this as an open research question: the *actual correct, safe progression trees for calisthenics and Pilates* — the node ordering, prerequisites, and the specific time/rep thresholds that gate each unlock — must be validated against real strength-training and Pilates progression standards by a qualified coach/physiotherapist/Pilates instructor before the sitemap and progression system are built on them. This is a hard dependency for the workout module and is explicitly **not resolved by this research**. Adopting a single existing system (e.g., Convict Conditioning, as Calisthenics Mastery does) is a shortcut, not a validation.
2. **Positioning edge:** Given the category is filling, is the wedge (a) data accuracy vs. Didiye/CalorieNaija, (b) micronutrient depth, (c) the workout integration, or (d) a specific market? The sitemap changes materially depending on this answer.
3. **Composite-dish and portion modeling:** what's the acceptable accuracy target, and who validates the recipe assumptions behind local dishes and portion-to-gram conversions?
4. **Micronutrient coverage threshold:** what percentage of the launch food set needs micronutrient values before the feature is credible enough to market?
5. **Data licensing:** are WAFCT/FAO-INFOODS and the national FCTs usable under terms that fit a commercial app, and at what cost/attribution?
6. **Data-curation resourcing:** who does the ongoing nutrition-analyst curation that converts FCT rows into trustworthy meal + portion entries? This is the moat and the hidden cost; without a plan, accuracy claims are not credible.
7. **Monetization + geography:** Is revenue primarily diaspora subscription? If so, the Western food DB is in-scope and IA must accommodate dual-cuisine users.
8. **Sequencing confirmation:** is nutrition-first the right wedge, or does the workout module need to ship close behind to justify the "one app" premise?

---

Sources:
- [CalorieNaija](https://www.calorienaija.com/)
- [Didiye](https://didiye.app/)
- [AfriCal (App Store)](https://apps.apple.com/ng/app/africal/id6760078954)
- [AfroTools African Food Calorie Counter](https://afrotools.com/health/calorie-counter/)
- [9jafoodie — Tracking Calories in Nigerian foods using MyFitnessPal](https://9jafoodie.com/tracking-calories-nigerian/)
- [LoseItNigerian — Tracking Nigerian foods in MyFitnessPal](https://loseitnigerian.com/tracking-calories-in-nigerian-foods-using-myfitnesspal/)
- [MyFitnessPal community — African food thread](https://community.myfitnesspal.com/en/discussion/10483373/african-food)
- [Cronometer — Accurate Databases](https://cronometer.com/features/accurate-databases.html)
- [Nutrola — How Accurate Is Cronometer (2026)](https://nutrola.app/en/blog/how-accurate-is-cronometer)
- [FAO/INFOODS West African Food Composition Table 2019 (ResearchGate)](https://www.researchgate.net/publication/354608942_FAOINFOODS_Food_Composition_Table_for_Western_Africa_2019)
- [2019 Food composition table for West Africa (ResearchGate)](https://www.researchgate.net/publication/340737602_2019_Food_composition_table_for_West_Africa)
- [FAO Food Composition Table for West Africa (WAFCT) — micronutrient coverage (NCBI/PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11397376/)
- [WAFCT nutrient-density analysis (MDPI)](https://www.mdpi.com/2072-6643/16/17/2985)
- [Kenya Food Composition Tables 2018 (FAO OpenKnowledge)](https://openknowledge.fao.org/items/ece9c958-74f6-4d90-b14e-6b8a16c0dd9d)
- [Kenya Food Composition Tables 2018 (Govt of Kenya PDF)](https://familyhealth.go.ke/wp-content/uploads/2019/05/Final-Food-compostion-book-2018.pdf)
- [FitSavanna — Kenyan food tracker](https://www.fitsavanna.co.ke/foods)
- [Calistree — skill-tree calisthenics app (App Store)](https://apps.apple.com/us/app/calistree-bodyweight-fitness/id1558561315)
- [Calistree review](https://calisthenics.com/calistree-app-review/)
- [Calisthenics Mastery (App Store)](https://apps.apple.com/us/app/calisthenics-mastery/id1102054063)
- [Calisthenics Mastery reviews](https://justuseapp.com/en/app/1102054063/calisthenics-mastery/reviews)
- [Thenx app](https://thenx.com/pages/app)
- [Freeletics — Introducing Skill Progressions](https://www.freeletics.com/en/blog/posts/introducing-freeletics-skill-progressions/)
- [Freeletics bodyweight training](https://www.freeletics.com/en/bodyweight-training/)
- [Pilatesology beginner-to-intermediate progression](https://pilatesology.com/programs/beginner-to-intermediate-progression/)
- [Best Pilates App 2026 (Garage Gym Reviews)](https://www.garagegymreviews.com/best-pilates-app)
- [Validity of food portion size photographs, Nairobi (medRxiv)](https://www.medrxiv.org/content/10.64898/2025.12.28.25343121.full.pdf)
- [Estimating portion size in dietary assessment (Taylor & Francis)](https://www.tandfonline.com/doi/full/10.1080/16070658.2024.2402646)
- [DataReportal — Digital 2025 Nigeria](https://datareportal.com/reports/digital-2025-nigeria)

Product research complete. Ready for review before sitemap stage.

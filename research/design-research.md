# Design Research

**Scope:** Visual and interaction-design context for a product combining (1) a nutrition/food-logging tracker (including African/diaspora dishes, loggable by individual ingredient or common prepared meal) and (2) a gamified, skill-tree-style bodyweight workout system covering **both calisthenics and Pilates**, tracking time- and rep-based thresholds a user has hit, targeting African users including diaspora. This research is independent from the product/market research track and feeds the design-system stage.

**Revision note:** This is a revised draft. It restores the full original competitor audit (including the Duolingo/Habitica gamification quadrant and the Flutterwave African-brand reference, both mistakenly dropped in an intermediate revision pass) and adds: a Pilates competitor audit, in-workout execution conventions for both calisthenics and Pilates sessions, a note on household-unit portion-entry conventions for African dishes, and a tonal-flex addendum to the Recommended Direction.

---

## 1. Competitor Visual Audit

### Nutrition/food-logging trackers

- **MyFitnessPal** — Functional but visually dated; incremental UI updates over a decade rather than a cohesive redesign. Dense, form/list-heavy logging flows (search food → serving size → log). Low visual differentiation; relies on brand recognition over polish. Lesson: don't let logging-form UX rot — it's the highest-frequency interaction in this category and deserves the most design attention, not the least.
- **YAZIO** — Widely regarded as the best-designed app in this category: clean card-based layouts, consistent typography, restrained but purposeful color, smooth transitions. Daily dashboard surfaces calorie/macro progress in an immediately legible way (rings/bars, not raw tables). Lesson: a small, consistent color vocabulary (e.g., one accent per macro) plus generous whitespace reads as "premium" even in a data-heavy category.
- **Cronometer** — Deliberately utilitarian/data-dense; optimized for power users tracking 80+ micronutrients. Trades visual warmth for information density and credibility with a "quantified self" audience. Lesson: density and trustworthiness can be a valid choice for a sub-audience, but it's a different persona than a mass-market/diaspora-facing product likely wants as its default.

### Calisthenics / skill-tree progression apps

- **Calistree** — Interactive skill tree as the core visual metaphor; progress rendered as a growing arc around each node, explorable/achievement-based framing (more "map" than "list"). This is the closest existing analogue to the requested skill-tree feature.
- **Calistack** — Skill tree organized into four categories (Push/Pull/Core/Legs) with explicit node states: Locked → Unlocked → Ongoing → Completed → Mastered. This state model is a useful reference vocabulary for the workout progression system regardless of final visual treatment.
- **Thenx** — No skill-tree/progression-ladder visualization, but praised for clean, cohesive UI. Lesson: strong "basic" visual craft (typography, spacing, cohesive iconography) matters even without a gamified structure — the skill tree is a differentiator, not a substitute for baseline polish.

### Pilates / Pilates-adjacent apps (new this revision)

- **Alo Moves** — soft, muted color palettes, generous whitespace, high-quality lifestyle photography/video. Design intent is calm and atmospheric rather than performance-metric-driven: the workout player is minimal (play/pause, skip, volume) and keeps visual focus on the instructor, not on numbers. Onboarding is a guided quiz that personalizes a content feed, echoing wellness/content-app conventions more than fitness-tracker conventions.
- **5 Minute Pilates** — a lighter-weight, exercise-timer-centric app: clear per-exercise illustrations/3D animations, an audio cue at the end of each exercise/rest interval, auto-advance toggle between exercises, and a simple linear session flow (no skill tree). Interface skews friendly/approachable (illustration-led) rather than clinical.
- **Nike Training Club** (Pilates/mat content) — bold, high-contrast athletic branding consistent across all workout types; large countdown timer typography during timed holds, minimal chrome around the instructor video, quick-glance "up next" strip.
- **Takeaway vs. calisthenics apps:** Pilates-adjacent products consistently favor a *calmer, softer, video/audio-led register* — muted palettes, generous spacing, large single-focus timers, and low visual noise — versus calisthenics skill-tree apps' *game-like, achievement/unlock-driven register* — darker backgrounds, node maps, badges, and progress bars. A product spanning both needs a shared design system that can flex tone (denser/gamified for skill-tree navigation, calmer/softer for in-session Pilates execution) without feeling like two different apps.

### Gamification design language (adjacent, for the skill-tree/streak mechanics)

- **Duolingo** — The most rigorously designed gamified product in consumer software; every color has a fixed semantic meaning (green = success, red = mistakes/hearts, orange = streaks, yellow = XP, purple = leagues). Skill-tree/path structure unlocks content by progress. Lesson: a small fixed color-to-meaning mapping (not just an aesthetic palette) makes gamified state legible at a glance and should be defined explicitly in the design system.
- **Habitica** — Pixel-art/retro-arcade RPG aesthetic; heavier, more novelty-driven visual style (avatars, damage, loot). Useful as a contrast case: a fully "game skin" approach can undercut credibility for a health/fitness-adjacent product aimed at a broad adult diaspora audience, and may not travel well culturally. Treat as an example of the far end of "gamified" that this product probably should not fully adopt.

### African consumer/fintech apps (visual and cultural cues)

- **Flutterwave** — Deliberately breaks from the "green and blue" fintech default with a bright, vivid, colorful identity (orange = energy/innovation, green = growth, pink = accessibility/friendliness) paired with a dark, trust-signaling text color. Explicitly positions itself as warmer/more community-feeling than conventional financial-services design, aiming at African entrepreneurs' aspirations rather than a generic global-SaaS look.
- Other major African fintechs (Paystack, Moniepoint, Chipper Cash) don't have as strongly documented brand systems in available sources, but anecdotally converge on approachable, mobile-native, high-contrast, bold-color patterns rather than muted "enterprise SaaS" palettes — consistent with Flutterwave's read that vivid, warm color performs well with this audience versus desaturated fintech-blue conventions.
- Diaspora-focused food brands and creators (e.g., African recipe blogs/Instagram accounts, diaspora meal-kit brands) tend to use warm, saturated color palettes (terracotta, gold, deep green, red) drawn from textile and spice imagery, with photography-led layouts rather than icon-led ones, and a more editorial/storytelling tone than clinical nutrition apps. This is a further counterweight to the cold, clinical palette of mainstream nutrition trackers.

**Takeaway for this product:** there is room between YAZIO's clean-but-slightly-clinical style and Flutterwave's vivid, warm, community-oriented style. A hybrid — clean information architecture (YAZIO) with a warmer, less desaturated accent palette and more optimistic tone (Flutterwave-adjacent) — is worth prototyping.

---

## 2. Interaction Conventions

The product spans two interaction modes that users will bring existing mental models for.

**Nutrition tracking (dashboard + form-heavy):**
- Daily dashboard as home base: calorie/macro progress shown as rings, bars, or simple progress visualizations rather than raw numbers-only tables (established convention users will expect).
- Logging flow convention: search/select food → confirm portion/serving → log to a meal slot (breakfast/lunch/dinner/snack). Users expect this exact sequence from MyFitnessPal/YAZIO/Cronometer; deviating from it raises friction without a strong reason.
- Barcode scanning and quick-add/recent-items patterns are near-universal expectations in this category and should be assumed baseline, not novel.
- Historical/trend views (weekly/monthly charts) are expected secondary screens, typically less frequently visited than the daily log.

**Portion-entry for African dishes (new this revision):**
- Mainstream nutrition apps (MyFitnessPal, Cronometer) default to gram-weight and barcode-scan entry, assuming packaged, standardized foods measured on a kitchen scale.
- Many African staple dishes (e.g., jollof rice, fufu, injera with stews, egusi soup) are conventionally served and mentally estimated in **household units** — a wrap, a ladle/scoop, a handful, a "plate," a cup of rice — rather than weighed in grams, and often aren't discrete packaged/barcoded items at all.
- This suggests the serving-size UI convention for this product's "common prepared meal" logging path should default to **household-unit portion pickers** (e.g., "1 ladle," "half plate," "1 wrap") as the primary interaction, with gram-weight/barcode entry available as a secondary/advanced path for packaged or ingredient-level logging — rather than forcing gram-based estimation as the default the way mainstream trackers do. (The underlying nutrition-data sourcing and unit-conversion accuracy for these dishes is product research's responsibility, not this document's — this is a UI-convention note only.)

**Calisthenics/skill-tree progression (visual map + gamified state):**
- Skill tree / progression map as primary navigational metaphor for the workout system — an explorable graph/node structure rather than a flat list, per Calistree/Calistack precedent.
- Explicit node-state vocabulary is expected: locked, unlocked/available, in-progress, completed/mastered. This should be a first-class visual system (color + icon + interaction state), not an afterthought.
- Streaks, XP, and level-style feedback (Duolingo-style) are common expectations for progression/gamified fitness apps and should be considered for the workout side, with color meaning fixed and consistent (not reused ad hoc for other UI purposes).
- Tapping a node opens a detail/technique view before starting a session; "boss" or milestone skills are visually emphasized (larger node, distinct color, badge). Users expect achievement/unlock feedback (animation, sound, or badge) on mastering a threshold — this is core to the gamification promise and should not be dropped for Pilates content, which can be mapped to the same tree metaphor via duration/control milestones (e.g., "hold a plank 60s," "10 clean roll-ups") rather than static-hold skill-named moves.

**In-workout execution — calisthenics (new this revision):**
- **Rep counters**: large, high-contrast numerals, typically manual tap-to-increment or voice/auto-detect in premium apps; users expect a big single tap target reachable one-handed since the other hand/both hands are often bracing the exercise.
- **Rest timers**: full-screen or near-full-screen countdown between sets, auto-starts on set completion, persists to lock screen/notification (seen in Fitloop) so users can set the phone down. Skip/add-time controls are expected as secondary, small-touch-target actions.
- **Hold-duration timers**: for static holds (planche, L-sit, front lever progressions) a large countdown/count-up timer is the dominant screen element; technique cue text or a short looping demo video is often layered underneath or accessible via a toggle, not competing for primary visual weight.
- **Glanceability**: since hands are occupied, controls must be legible from an arm's length, tap targets large, and critical state (reps left, time remaining) readable without unlocking focus — large type, high contrast, minimal reliance on color alone.
- **Session-complete flow**: summary of sets/reps/time hit vs. thresholds, tied back to the skill-tree node (did this unlock/advance a node?), reinforcing the gamified loop.

**In-workout execution — Pilates (new this revision):**
- **Timed, guided flow**: sessions are largely linear and instructor/audio-led rather than user-paced set-by-set; the dominant timer is a single large countdown per exercise/hold rather than a manual rep counter, and auto-advance to the next movement is a common convenience toggle (seen in 5 Minute Pilates).
- **Audio-first cues**: because Pilates form cues ("scoop your navel," "lengthen through the spine") are frequently delivered by voice/audio rather than requiring the user to look at the screen, the screen can be calmer/lower-information-density than a calisthenics rep screen — this reinforces the softer visual register noted in the audit above.
- **Rest is often built into the flow** rather than a discrete rest-timer screen (transitions between movements double as brief recovery), differing from calisthenics' explicit rest-timer step.
- **Session-complete flow**: tends to be more reflective/wellness-toned (e.g., "session complete, X minutes moved") than achievement-badge-heavy, though this product's gamification layer should still surface threshold progress (e.g., "held your plank 15s longer than last time") to keep the two training modes consistent within one system.
- **Design implication**: the shared design system needs one flexible "session player" component (large timer/counter, minimal chrome, glanceable state, session-complete summary) that can be *reskinned in tone* — brighter/game-like for calisthenics reps-and-thresholds, calmer/audio-led for Pilates timed flows — rather than two unrelated player UIs.

**Cross-cutting:**
- The two modes (logging-heavy nutrition, exploration-heavy skill tree) have different rhythms — nutrition is expected to be used multiple times a day in short bursts (needs speed/low friction), the skill tree is expected to be visited less frequently for deeper engagement (can afford more visual richness/delight). The design system should probably define two "modes" of density/motion rather than force one visual register onto both.
- Navigation between these two areas (likely tab-based) needs to feel like one coherent product, not two bolted-together apps — shared type scale, spacing system, and iconography style across both are important even if color accents differ per section.

---

## 3. Accessibility Requirements

**Standard mobile accessibility (WCAG 2.2, applies regardless of audience):**
- Text contrast minimum 4.5:1 for normal text, 3:1 for large text (WCAG 1.4.3), and design should tolerate outdoor/glare use conditions — mobile users are disproportionately in bright/variable lighting compared to desktop users. Favor higher-than-minimum contrast for in-workout timers and rep counters specifically, since they're often viewed at a distance or mid-exertion.
- Text size: support platform-level dynamic type / user font-size scaling; do not embed text in images (breaks screen readers and scaling alike). Workout-screen numerals (timers, rep counts) should remain legible at default distance without requiring the user to zoom or lean in, since hands are often occupied.
- Touch targets minimum 44x44pt for all interactive elements — especially relevant for dense logging forms (food search results, serving-size steppers) and skill-tree node taps.
- Motion sensitivity: any animated transitions (skill-tree unlocks, streak celebrations, macro-ring fill animations) need a reduced-motion alternative and must avoid flashing/strobing patterns (WCAG 2.5.4 territory) — this matters more here than average because gamified "celebration" moments are exactly the kind of animation that can be overused. Avoid large full-screen flashing or parallax effects on the workout player given users may be moving/exerting and glancing quickly.
- Color must never be the sole signal of state (e.g., locked/unlocked/completed nodes need icon or shape differentiation too, not just a color change) — important since the skill-tree state system is core to the product. The same applies to any nutrition category color-coding (e.g., "green/yellow/orange" style food coding, if adopted).
- Audio/one-handed use: given Pilates' audio-led convention and calisthenics' hands-occupied convention, critical state changes (rest over, set complete, session complete) should have an audio/haptic cue as well as a visual one, and primary controls should be reachable via large, one-handed-friendly tap targets.
- Cognitive load: keep in-workout screens single-focus (one timer/counter as the dominant element) rather than dashboard-dense, consistent with what both calisthenics and Pilates competitor apps already do during active exercise, even if the broader app (nutrition logs, skill-tree map) is more data-dense.

**Audience-specific requirements (African markets + diaspora, mobile-first):**
- **Low-bandwidth/data-cost sensitivity:** Data is materially more expensive in several African markets (roughly $5-10/GB vs $1-2/GB in the US/Europe per available research), and 3G remains common outside major cities. This is a functional/performance accessibility issue as much as a visual one: the visual design should favor lightweight assets (avoid large hero images, heavy custom illustration sets, or auto-playing video/animation) and should design "offline-first" states (cached daily log, offline skill-tree view) as a normal UI state, not an error condition.
- **Low-end device tiers:** Budget Android devices ($50-150 range) with limited RAM are common in the target market. Visual design should avoid effects that are expensive to render (heavy blur/shadow layering, complex particle/celebration animations, large GIF-style assets) as a default, reserving richer motion for high-tier devices/connections if at all.
- **Diaspora vs. in-region users may differ in device tier and connectivity** — the design system should probably define a "core" experience that degrades gracefully rather than two separate builds, per general offline-first/low-bandwidth design guidance.
- Standard internationalization hygiene applies if the product supports multiple languages relevant to target markets/diaspora communities (text expansion room, RTL not typically needed for the primary African markets in question but worth confirming during scoping).

---

## 4. Recommended Direction (recommendation only — design-system-architect owns the final call)

**Recommended visual direction: "Warm, clean, and legible" — a hybrid of YAZIO's clean information-density discipline with a warmer, more optimistic color temperature than typical fintech/SaaS blue-green defaults, in the spirit of Flutterwave's departure from category convention — confirmed after factoring in Pilates session UX, with an added requirement for tonal flex between workout modes.**

Rationale:
- The product straddles two registers — a data/logging tool (nutrition) and a gamified progression system (skill tree) — so a purely "clean/utilitarian" direction (Cronometer-style) risks feeling flat and unmotivating for the skill-tree half, while a fully "game skin" direction (Habitica-style) risks undermining credibility and everyday usability for the nutrition-logging half. A shared, restrained "warm/clean" base with a clearly defined, limited gamification color vocabulary (Duolingo-style fixed meanings: e.g., one color = locked, one = in-progress, one = mastered) applied only within the skill-tree context lets both halves feel coherent without homogenizing them into blandness or over-gaming the whole app.
- Performance and low-bandwidth/low-end-device constraints in the target market push toward a design system built on solid colors, system fonts or a single lightweight webfont, simple vector iconography, and restrained motion — this is compatible with "clean" but argues against heavy illustration-led or richly animated visual styles regardless of aesthetic preference.
- A warmer, more vivid accent palette (rather than default fintech blue/green or clinical health-app pastel) is worth testing given the Flutterwave precedent of vivid, welcoming color performing well with an African audience's aspirational self-image, and given nutrition/fitness apps benefit from feeling encouraging rather than clinical.
- **Tonal flex for the workout player specifically (new this revision):** within the shared clean/warm base, the in-session experience should shift toward the *game-like, high-contrast, achievement-driven* register for calisthenics (large numerals, unlock/badge moments, energetic accent color use) and toward the *calmer, softer, audio-led* register for Pilates (lower visual noise, larger single-focus timer, more whitespace, muted accent use) — achieved through shared components with mode-specific styling rather than two separate design languages. This flex requirement does not change the overall recommended direction; it refines how the direction is applied inside the workout player specifically.

**Open design judgment call to flag explicitly for the design-system stage:**
Whether and how the visual identity should reflect African/diaspora identity — through color choices, iconography, illustration style, patterns/textures, or tone of copy — is a genuine design decision this research cannot and should not resolve. Two credible, defensible directions exist:
1. A **universal/neutral consumer-app visual language** (similar to how YAZIO or Duolingo present) that is welcoming to a global user base including diaspora, without leaning on any explicit regional visual signifiers — avoids any risk of reducing "African identity" to surface-level decoration (e.g., generic Adinkra-style patterns, stock color associations) that can read as stereotyping if done without deep cultural grounding.
2. A **deliberately warm, distinct visual identity informed by pan-African design cues** (as Flutterwave has done) — bold, vivid color as an intentional brand choice, positioned as "made for us" rather than a generic global template, which can build stronger affinity and differentiation in-market and in diaspora communities that value seeing themselves reflected in a product.

Neither option is obviously correct, and getting it wrong in either direction carries a real cost (feeling generic/uninspired vs. feeling tokenizing/stereotypical if surface-level cultural motifs are applied without genuine research or community input). This is explicitly flagged as a decision for the design-system-architect (ideally informed by direct user/community input rather than researcher inference) rather than a conclusion reached here.

---

Design research complete. Ready for review before design-system stage.

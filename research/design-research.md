# Design Research

**Scope:** Visual and interaction-design context for a product combining (1) a nutrition/food-logging tracker and (2) a calisthenics/bodyweight skill-tree progression system, targeting African users including diaspora. This research is independent from the product/market research track and feeds the design-system stage.

Note: I was unable to open `docs/idea.md` directly with the tools available to me in this session; this research proceeds on the product description supplied by the launching agent (nutrition tracking + calisthenics skill-tree progression, African/diaspora audience). The design-system-architect should reconcile this document against the actual `docs/idea.md` for any details not captured here.

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

### Gamification design language (adjacent, for the skill-tree/streak mechanics)

- **Duolingo** — The most rigorously designed gamified product in consumer software; every color has a fixed semantic meaning (green = success, red = mistakes/hearts, orange = streaks, yellow = XP, purple = leagues). Skill-tree/path structure unlocks content by progress. Lesson: a small fixed color-to-meaning mapping (not just an aesthetic palette) makes gamified state legible at a glance and should be defined explicitly in the design system.
- **Habitica** — Pixel-art/retro-arcade RPG aesthetic; heavier, more novelty-driven visual style (avatars, damage, loot). Useful as a contrast case: a fully "game skin" approach can undercut credibility for a health/fitness-adjacent product aimed at a broad adult diaspora audience, and may not travel well culturally. Treat as an example of the far end of "gamified" that this product probably should not fully adopt.

### African consumer/fintech apps (visual and cultural cues)

- **Flutterwave** — Deliberately breaks from the "green and blue" fintech default with a bright, vivid, colorful identity (orange = energy/innovation, green = growth, pink = accessibility/friendliness) paired with a dark, trust-signaling text color. Explicitly positions itself as warmer/more community-feeling than conventional financial-services design, aiming at African entrepreneurs' aspirations rather than a generic global-SaaS look.
- Other major African fintechs (Paystack, Moniepoint, Chipper Cash) don't have as strongly documented brand systems in available sources, but anecdotally converge on approachable, mobile-native, high-contrast, bold-color patterns rather than muted "enterprise SaaS" palettes — consistent with Flutterwave's read that vivid, warm color performs well with this audience versus desaturated fintech-blue conventions.

**Takeaway for this product:** there is room between YAZIO's clean-but-slightly-clinical style and Flutterwave's vivid, warm, community-oriented style. A hybrid — clean information architecture (YAZIO) with a warmer, less desaturated accent palette and more optimistic tone (Flutterwave-adjacent) — is worth prototyping.

---

## 2. Interaction Conventions

The product spans two interaction modes that users will bring existing mental models for:

**Nutrition tracking (dashboard + form-heavy):**
- Daily dashboard as home base: calorie/macro progress shown as rings, bars, or simple progress visualizations rather than raw numbers-only tables (established convention users will expect).
- Logging flow convention: search/select food → confirm portion/serving → log to a meal slot (breakfast/lunch/dinner/snack). Users expect this exact sequence from MyFitnessPal/YAZIO/Cronometer; deviating from it raises friction without a strong reason.
- Barcode scanning and quick-add/recent-items patterns are near-universal expectations in this category and should be assumed baseline, not novel.
- Historical/trend views (weekly/monthly charts) are expected secondary screens, typically less frequently visited than the daily log.

**Calisthenics/skill-tree progression (visual map + gamified state):**
- Skill tree / progression map as primary navigational metaphor for the workout system — an explorable graph/node structure rather than a flat list, per Calistree/Calistack precedent.
- Explicit node-state vocabulary is expected: locked, unlocked/available, in-progress, completed/mastered. This should be a first-class visual system (color + icon + interaction state), not an afterthought.
- Streaks, XP, and level-style feedback (Duolingo-style) are common expectations for progression/gamified fitness apps and should be considered for the workout side, with color meaning fixed and consistent (not reused ad hoc for other UI purposes).

**Cross-cutting:**
- The two modes (logging-heavy nutrition, exploration-heavy skill tree) have different rhythms — nutrition is expected to be used multiple times a day in short bursts (needs speed/low friction), the skill tree is expected to be visited less frequently for deeper engagement (can afford more visual richness/delight). The design system should probably define two "modes" of density/motion rather than force one visual register onto both.
- Navigation between these two areas (likely tab-based) needs to feel like one coherent product, not two bolted-together apps — shared type scale, spacing system, and iconography style across both are important even if color accents differ per section.

---

## 3. Accessibility Requirements

**Standard mobile accessibility (WCAG 2.2, applies regardless of audience):**
- Text contrast minimum 4.5:1 for normal text, 3:1 for large text (WCAG 1.4.3), and design should tolerate outdoor/glare use conditions — mobile users are disproportionately in bright/variable lighting compared to desktop users.
- Text size: support platform-level dynamic type / user font-size scaling; do not embed text in images (breaks screen readers and scaling alike).
- Touch targets minimum 44x44pt for all interactive elements — especially relevant for dense logging forms (food search results, serving-size steppers) and skill-tree node taps.
- Motion sensitivity: any animated transitions (skill-tree unlocks, streak celebrations, macro-ring fill animations) need a reduced-motion alternative and must avoid flashing/strobing patterns (WCAG 2.5.4 territory) — this matters more here than average because gamified "celebration" moments are exactly the kind of animation that can be overused.
- Color must never be the sole signal of state (e.g., locked/unlocked/completed nodes need icon or shape differentiation too, not just a color change) — important since the skill-tree state system is core to the product.

**Audience-specific requirements (African markets + diaspora, mobile-first):**
- **Low-bandwidth/data-cost sensitivity:** Data is materially more expensive in several African markets (roughly $5-10/GB vs $1-2/GB in the US/Europe per available research), and 3G remains common outside major cities. This is a functional/performance accessibility issue as much as a visual one: the visual design should favor lightweight assets (avoid large hero images, heavy custom illustration sets, or auto-playing video/animation) and should design "offline-first" states (cached daily log, offline skill-tree view) as a normal UI state, not an error condition.
- **Low-end device tiers:** Budget Android devices ($50-150 range) with limited RAM are common in the target market. Visual design should avoid effects that are expensive to render (heavy blur/shadow layering, complex particle/celebration animations, large GIF-style assets) as a default, reserving richer motion for high-tier devices/connections if at all.
- **Diaspora vs. in-region users may differ in device tier and connectivity** — the design system should probably define a "core" experience that degrades gracefully rather than two separate builds, per general offline-first/low-bandwidth design guidance.
- Standard internationalization hygiene applies if the product supports multiple languages relevant to target markets/diaspora communities (text expansion room, RTL not typically needed for the primary African markets in question but worth confirming during scoping).

---

## 4. Recommended Direction (recommendation only — design-system-architect owns the final call)

**Recommended visual direction: "Warm, clean, and legible" — a hybrid of YAZIO's clean information-density discipline with a warmer, more optimistic color temperature than typical fintech/SaaS blue-green defaults, in the spirit of Flutterwave's departure from category convention.**

Rationale:
- The product straddles two registers — a data/logging tool (nutrition) and a gamified progression system (skill tree) — so a purely "clean/utilitarian" direction (Cronometer-style) risks feeling flat and unmotivating for the skill-tree half, while a fully "game skin" direction (Habitica-style) risks undermining credibility and everyday usability for the nutrition-logging half. A shared, restrained "warm/clean" base with a clearly defined, limited gamification color vocabulary (Duolingo-style fixed meanings: e.g., one color = locked, one = in-progress, one = mastered) applied only within the skill-tree context lets both halves feel coherent without homogenizing them into blandness or over-gaming the whole app.
- Performance and low-bandwidth/low-end-device constraints in the target market push toward a design system built on solid colors, system fonts or a single lightweight webfont, simple vector iconography, and restrained motion — this is compatible with "clean" but argues against heavy illustration-led or richly animated visual styles regardless of aesthetic preference.
- A warmer, more vivid accent palette (rather than default fintech blue/green or clinical health-app pastel) is worth testing given the Flutterwave precedent of vivid, welcoming color performing well with an African audience's aspirational self-image, and given nutrition/fitness apps benefit from feeling encouraging rather than clinical.

**Open design judgment call to flag explicitly for the design-system stage:**
Whether and how the visual identity should reflect African/diaspora identity — through color choices, iconography, illustration style, patterns/textures, or tone of copy — is a genuine design decision this research cannot and should not resolve. Two credible, defensible directions exist:
1. A **universal/neutral consumer-app visual language** (similar to how YAZIO or Duolingo present) that is welcoming to a global user base including diaspora, without leaning on any explicit regional visual signifiers — avoids any risk of reducing "African identity" to surface-level decoration (e.g., generic Adinkra-style patterns, stock color associations) that can read as stereotyping if done without deep cultural grounding.
2. A **deliberately warm, distinct visual identity informed by pan-African design cues** (as Flutterwave has done) — bold, vivid color as an intentional brand choice, positioned as "made for us" rather than a generic global template, which can build stronger affinity and differentiation in-market and in diaspora communities that value seeing themselves reflected in a product.

Neither option is obviously correct, and getting it wrong in either direction carries a real cost (feeling generic/uninspired vs. feeling tokenizing/stereotypical if surface-level cultural motifs are applied without genuine research or community input). This is explicitly flagged as a decision for the design-system-architect (ideally informed by direct user/community input rather than researcher inference) rather than a conclusion reached here.

---

Design research complete. Ready for review before design-system stage.

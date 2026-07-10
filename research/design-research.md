# Design Research

**Scope note:** This research covers the visual and interaction-design context for a product that combines (1) nutrition logging — including African/diaspora dishes, loggable either by individual ingredient or by common prepared meal — with (2) a gamified, skill-tree-style bodyweight workout system that explicitly covers **both calisthenics and Pilates**, tracking time- and rep-based thresholds a user has hit. This revision adds Pilates-specific competitor audit, in-workout execution conventions (rest timers, rep counters, hold-duration timers, one-hand glanceability, session-complete flows) for both training modes, and a short note on portion-entry conventions for African dishes measured in household units. Everything else from the prior draft (nutrition/skill-tree/gamification/African-brand competitor quadrants, the accessibility section, and the open cultural-identity question) is preserved as reviewed.

---

## Competitor Visual Audit

### Nutrition logging
- **MyFitnessPal** — dense, data-forward, utilitarian. Heavy reliance on tables/lists, small type, high information density, minimal illustration. Barcode scan and gram-based portioning are the default mental model. Color is used sparingly (green accent) mostly for progress bars and CTAs.
- **Cronometer** — similarly data-dense but leans "clinical/technical," with more visible micronutrient data, monospaced-feeling numeric tables, and a colder blue-grey palette. Appeals to a more quantified-self audience.
- **Noom** — warmer, more editorial. Uses illustration, larger type, conversational copy, and a psychology-coaching tone rather than a spreadsheet tone. Logging flow is simplified (color-coded "green/yellow/orange" food categories rather than raw macros front-and-center).

### Calisthenics / bodyweight skill-tree apps
- **Calisthenics Tree (calitree.app)** and **Calistree** — literal skill-tree/node-map visual metaphor (branching paths, locked/unlocked nodes, "boss" skills like planche/front lever/human flag). Dark, game-like UI with badge/achievement iconography, progress bars per node, and a slightly "gamer" aesthetic (glow states, unlock animations).
- **Calistack** — closer to a structured training app than a game map; cleaner cards, technique-cue overlays on video demos, still keeps the progression/leveling metaphor but with a more athletic-brand palette (black/white/single accent) than the more playful calitree.app.
- **Thenx** — video-first, high-production athletic branding (bold black/white, strong photography of the instructor), rep counter and workout timer are secondary UI within a video player chrome rather than a dashboard.

### Pilates / Pilates-adjacent apps (new this revision)
- **Alo Moves** — soft, muted color palettes, generous whitespace, high-quality lifestyle photography/video. Design intent is calm and atmospheric rather than performance-metric-driven: the workout player is minimal (play/pause, skip, volume) and keeps visual focus on the instructor, not on numbers. Onboarding is a guided quiz that personalizes a content feed, echoing wellness/content-app conventions more than fitness-tracker conventions.
- **5 Minute Pilates** — a lighter-weight, exercise-timer-centric app: clear per-exercise illustrations/3D animations, an audio cue at the end of each exercise/rest interval, auto-advance toggle between exercises, and a simple linear session flow (no skill tree). Interface skews friendly/approachable (illustration-led) rather than clinical.
- **Nike Training Club** (Pilates/mat content) — bold, high-contrast athletic branding consistent across all workout types; large countdown timer typography during timed holds, minimal chrome around the instructor video, quick-glance "up next" strip.
- **Takeaway vs. calisthenics apps:** Pilates-adjacent products consistently favor a *calmer, softer, video/audio-led register* — muted palettes, generous spacing, large single-focus timers, and low visual noise — versus calisthenics skill-tree apps' *game-like, achievement/unlock-driven register* — darker backgrounds, node maps, badges, and progress bars. A product spanning both needs a shared design system that can flex tone (denser/gamified for skill-tree navigation, calmer/softer for in-session Pilates execution) without feeling like two different apps.

### African/diaspora food & lifestyle brands
- Diaspora-focused food brands and creators (e.g., African recipe blogs/Instagram accounts, diaspora meal-kit brands) tend to use warm, saturated color palettes (terracotta, gold, deep green, red) drawn from textile and spice imagery, with photography-led layouts rather than icon-led ones, and a more editorial/storytelling tone than clinical nutrition apps. This is a useful counterweight to the cold, clinical palette of mainstream nutrition trackers.

---

## Interaction Conventions

### Skill-tree / progression map (calisthenics)
- Branching node map with clear locked/unlocked/in-progress/mastered states, usually communicated via color + icon + a lock glyph rather than color alone.
- Tapping a node opens a detail/technique view before starting a session; "boss" or milestone skills are visually emphasized (larger node, distinct color, badge).
- Users expect achievement/unlock feedback (animation, sound, or badge) on mastering a threshold — this is core to the gamification promise and should not be dropped for Pilates content that doesn't naturally have "skills" in the same sense (Pilates progressions can be mapped to the same tree metaphor as duration/control milestones, e.g., "hold a plank 60s" or "10 clean roll-ups," rather than static-hold skill named moves).

### In-workout execution — calisthenics (new this revision)
- **Rep counters**: large, high-contrast numerals, typically manual tap-to-increment or voice/auto-detect in premium apps; users expect a big single tap target reachable one-handed since the other hand/both hands are often bracing the exercise.
- **Rest timers**: full-screen or near-full-screen countdown between sets, auto-starts on set completion, persists to lock screen/notification (seen in Fitloop) so users can set the phone down. Skip/add-time controls are expected as secondary, small-touch-target actions.
- **Hold-duration timers**: for static holds (planche, L-sit, front lever progressions) a large countdown/count-up timer is the dominant screen element; technique cue text or a short looping demo video is often layered underneath or accessible via a toggle, not competing for primary visual weight.
- **Glanceability**: since hands are occupied, controls must be legible from an arm's length, tap targets large, and critical state (reps left, time remaining) readable without unlocking focus — large type, high contrast, minimal reliance on color alone.
- **Session-complete flow**: summary of sets/reps/time hit vs. thresholds, tied back to the skill-tree node (did this unlock/advance a node?), reinforcing the gamified loop.

### In-workout execution — Pilates (new this revision)
- **Timed, guided flow**: sessions are largely linear and instructor/audio-led rather than user-paced set-by-set; the dominant timer is a single large countdown per exercise/hold rather than a manual rep counter, and auto-advance to the next movement is a common convenience toggle (seen in 5 Minute Pilates).
- **Audio-first cues**: because Pilates form cues ("scoop your navel," "lengthen through the spine") are frequently delivered by voice/audio rather than requiring the user to look at the screen, the screen can be calmer/lower-information-density than a calisthenics rep screen — this reinforces the softer visual register noted in the audit above.
- **Rest is often built into the flow** rather than a discrete rest-timer screen (transitions between movements double as brief recovery), differing from calisthenics' explicit rest-timer step.
- **Session-complete flow**: tends to be more reflective/wellness-toned (e.g., "session complete, X minutes moved") than achievement-badge-heavy, though this product's gamification layer should still surface threshold progress (e.g., "held your plank 15s longer than last time") to keep the two training modes consistent within one system.
- **Design implication**: the shared design system needs one flexible "session player" component (large timer/counter, minimal chrome, glanceable state, session-complete summary) that can be *reskinned in tone* — brighter/game-like for calisthenics reps-and-thresholds, calmer/audio-led for Pilates timed flows — rather than two unrelated player UIs.

### Nutrition logging, including portion-entry for African dishes (new this revision)
- Mainstream nutrition apps (MyFitnessPal, Cronometer) default to gram-weight and barcode-scan entry, assuming packaged, standardized foods measured on a kitchen scale.
- Many African staple dishes (e.g., jollof rice, fufu, injera with stews, egusi soup) are conventionally served and mentally estimated in **household units** — a wrap, a ladle/scoop, a handful, a "plate," a cup of rice — rather than weighed in grams, and often aren't discrete packaged/barcoded items at all.
- This suggests the serving-size UI convention for this product's "common prepared meal" logging path should default to **household-unit portion pickers** (e.g., "1 ladle," "half plate," "1 wrap") as the primary interaction, with gram-weight/barcode entry available as a secondary/advanced path for packaged or ingredient-level logging — rather than forcing gram-based estimation as the default the way mainstream trackers do. (The underlying nutrition-data sourcing and unit-conversion accuracy for these dishes is product research's responsibility, not this document's — this is a UI-convention note only.)

---

## Accessibility Requirements

- **Contrast**: WCAG 2.1 AA minimum (4.5:1 body text, 3:1 large text/UI components) throughout, with particular attention to in-workout screens viewed at a distance or in bright outdoor/gym lighting — favor higher-than-minimum contrast for timers and rep counters specifically.
- **Text size**: support dynamic type/system font scaling; workout-screen numerals (timers, rep counts) should remain legible at default distance without requiring the user to zoom or lean in, since hands are often occupied.
- **Motion sensitivity**: skill-tree unlock animations, node transitions, and celebratory effects should respect `prefers-reduced-motion` and offer a reduced/no-animation mode; avoid large full-screen flashing or parallax effects on the workout player given users may be moving/exerting and glancing quickly.
- **Color independence**: node/state indicators (locked/unlocked/mastered) and nutrition category indicators (e.g., "green/yellow/orange" style food coding, if adopted) must not rely on color alone — pair with icon, label, or pattern for color-blind users.
- **Audio/one-handed use**: given Pilates' audio-led convention and calisthenics' hands-occupied convention, critical state changes (rest over, set complete, session complete) should have an audio/haptic cue as well as a visual one, and primary controls should be reachable via large, one-handed-friendly tap targets.
- **Cognitive load**: keep in-workout screens single-focus (one timer/counter as the dominant element) rather than dashboard-dense, consistent with what both calisthenics and Pilates competitor apps already do during active exercise, even if the broader app (nutrition logs, skill-tree map) is more data-dense.

---

## Recommended Direction

**Recommendation: warm/clean hybrid — confirmed, with an added requirement for tonal flex between modes.**

Having factored in Pilates session UX, the "warm/clean hybrid" recommendation still holds as the right overall system direction, but it needs to be understood as a system that **flexes in density and energy by context** rather than a single flat aesthetic applied everywhere:

- **Warm** to reflect the African/diaspora food identity (drawing on the terracotta/gold/deep-green palette common in diaspora food branding) and to give the nutrition-logging and meal-photography surfaces an inviting, non-clinical feel that mainstream trackers (MyFitnessPal, Cronometer) lack.
- **Clean/utilitarian** for data-forward surfaces — logs, macro summaries, skill-tree progression — so the product doesn't sacrifice the legibility and quick-scan efficiency users expect from a tracking tool.
- **Tonal flex for the workout player specifically**: within that shared clean/warm base, the in-session experience should shift toward the *game-like, high-contrast, achievement-driven* register for calisthenics (large numerals, unlock/badge moments, energetic accent color use) and toward the *calmer, softer, audio-led* register for Pilates (lower visual noise, larger single-focus timer, more whitespace, muted accent use) — achieved through shared components with mode-specific styling rather than two separate design languages.

This is a recommendation only; final ownership of the palette, type system, density rules, and exact component behavior rests with the design-system-architect agent.

**Open question (flagged, not resolved here):** how much and in what way to visually express African/diaspora cultural identity — e.g., through color/pattern motifs, photography direction, iconography, or typography choices — versus keeping the visual system culturally neutral and letting food photography/content carry that identity. This is a brand-strategy decision that should be made deliberately at the design-system stage rather than defaulted into either direction by this research.

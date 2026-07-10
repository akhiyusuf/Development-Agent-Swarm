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

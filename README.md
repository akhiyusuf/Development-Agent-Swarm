# Multi-agent build pipeline

## Shape of the pipeline (fork → join)

    docs/idea.md
        ├── researcher-product (Opus, high) ──┬──► sitemap-architect (Sonnet, medium) ──► user-flow-designer (Sonnet, high) ──┐
        │                                      └──► data-researcher (Opus, high) ────────────────────────────────────────────┼──► screen-designer (Opus, high) ──► app-builder (Sonnet, high)
        └── researcher-design (Sonnet, medium) ──► design-system-architect (Sonnet, high) ─────────────────────────────────────┘

`reviewer` (Fable 5, high — xhigh optional on the merge review) gates every arrow
above. Nothing proceeds until reviewer marks the stage(s) it depends on as
`approved` in `pipeline/state.json`. The main session (the orchestrator) runs on
**Sonnet 5** — set this with `/model sonnet` before you paste the kickoff prompt.

## Design and screens are real, running code — not specs

**This is the load-bearing change from the first version of this pipeline.**
The first run produced `docs/design-system.md` and `docs/screens.md` as prose
specs, which `app-builder` then had to reinterpret and rebuild from scratch —
a lossy text→text→code chain that produced generic, occasionally
self-contradictory UI (color rules the spec itself violated, screens that
didn't match what was actually approved). The fix: cut out the reinterpretation
step entirely.

- **`design-system-architect`** now scaffolds `design-system/` as a real,
  standalone Expo package — an npm workspace member with actual `.tsx`
  components, a `tokens.ts`, and a `ComponentGallery` screen that renders
  every component in every state so it's genuinely previewable. `docs/design-system.md`
  still exists, but only as a short rationale doc (why this palette, how the
  cultural-identity call was resolved) — **the code is the source of truth**
  for token values and component APIs, not the markdown.
- **`screen-designer`** now works directly in `app/` (also an npm workspace
  member, depending on the design-system package by name), writing real
  screen components that import real design-system components, plus the full
  navigation graph connecting them. `docs/screens.md` shrinks to a
  traceability table (screen → sitemap requirement → file path → data
  contract), not a description of layout.
- **`app-builder`** becomes an integrator, not a builder-from-spec: it wires
  state, data, and business logic into the screens/navigation that already
  exist, without rebuilding or restyling them.
- **`reviewer`** gained `Bash` and a real verification step for these three
  stages: it runs `npx tsc --noEmit` itself (never trusts a "clean typecheck"
  claim), and for visual quality, it exports a web build, serves it on
  loopback, screenshots it with headless Chromium via Playwright (both
  pre-installed in this sandbox), and actually looks at the rendered image
  with its Read tool before judging. If screenshotting isn't available for
  some reason, it says so explicitly rather than silently skipping the visual
  check — see `.claude/agents/reviewer.md` for the exact working recipe.

Everything else in the pipeline — research, sitemap, and the review gating
discipline itself — is unchanged.

## New: data-researcher — real, cited content instead of placeholders

The first build's food database and skill-tree content were mock/placeholder
data by design (the product research explicitly flagged progression-tree
content as unvalidated) — but that meant the shipped app had generic
`[Skill Node]` names and made-up nutrition numbers, which is a real UX
problem, not just a content-polish one. `data-researcher` (Opus, high effort)
runs after `research-product` is approved, in parallel with `sitemap-architect`
and `design-system-architect`. It sources:
- Real regional food composition data (macros, key micronutrients,
  household-unit portions) from legitimate, citable sources per market.
- Real calisthenics/Pilates progression content (node names, ordering,
  thresholds) synthesized from established, citable coaching frameworks —
  labeled honestly by actual confidence level, not oversold as
  clinically validated and not left as an unsourced placeholder either.

Output goes to `data/` (structured, real content) plus `docs/data-sourcing.md`
(methodology, sources, and an honest limitations section). `reviewer` gained a
citation-spot-check step for this stage specifically — fabricated-but-
well-formatted citations are a known failure mode, so it re-checks a sample
of the actual cited figures rather than trusting that citations exist.
`screen-designer` and `app-builder` now both depend on `data-research` too:
screens use real sample data where `data/` covers it, and `app-builder` wires
the full real dataset instead of building its own mock/seeded data layer.

## New: user-flow-designer, and legacy docs kept as reference

- **`user-flow-designer`** is a new stage between `sitemap-architect` and
  `screen-designer` (depends on `sitemap`, output `docs/user-flows.md`). The
  sitemap says which screens exist and how they connect; this stage says what
  actually happens on each one step by step — error states, empty states,
  loading states, and what happens if the user backs out mid-flow. Without
  it, screen-designer was left to guess at edge cases that a sitemap
  structurally can't capture. `screen-designer` now depends on `sitemap`,
  `design-system`, AND `user-flows` — three inputs to reconcile at the merge
  point, not two.
- **The first pipeline run's old prose specs weren't deleted.** They were
  moved to `docs/reference/legacy-design-system.md` and
  `docs/reference/legacy-screens.md` — the new `design-system-architect`,
  `screen-designer`, and `user-flow-designer` all read these as non-binding
  reference (prior direction, prior resolved open questions) before doing
  their own work. This matters because the new agents write their own,
  much-shorter `docs/design-system.md`/`docs/screens.md` at those same paths
  — leaving the old prose there would have meant the first agent to run
  silently overwrote it before anyone could use it as reference.
- **`docs/sitemap.md` was edited**: Sign Up/Log In moved from immediately
  after Splash to immediately before Onboarding Complete, after the
  onboarding steps that actually generate something worth an account (profile,
  goals, region, workout placement). New users now do onboarding first and
  hit the account wall only once there's real progress to save; returning
  users still short-circuit Splash → Log In. Because this changed an already-
  `approved` artifact, `sitemap`'s status was reset to `pending` for
  re-review — it isn't exempt from the gate just because the edit was small.
- **`app-builder`** (and, lightly, `design-system-architect`) gained explicit
  Apple App Store / Google Play compliance checks — account deletion, sign-in
  parity, honest data-collection disclosure, permission-request timing, and
  platform touch-target minimums — wired in at integration time rather than
  left for a submission step this pipeline doesn't otherwise have.

## Why these models (research-backed, not just vendor claims)

- **Orchestrator → Sonnet 5, not Fable.** The orchestrator's job is routing and
  bookkeeping (read state.json, dispatch the next stage, track rejections) —
  many small turns, not one deep reasoning pass. Fable's thinking can't be
  turned off, so every one of those routine turns would pay its latency and
  token premium. Sonnet 5 is Anthropic's most agentic Sonnet yet and
  independently benchmarks *ahead* of Opus 4.8 on autonomous terminal/shell
  work (Terminal-Bench 2.1: 80.4% vs 74.6%) — exactly the kind of loop an
  orchestrator runs.
- **Reviewer → Fable 5.** This is the one role that matches Fable's actual
  sweet spot: judgment-heavy, low-frequency (not continuous chat), and hard to
  self-assess — which is the whole reason it exists as a gate. Now that it
  also runs real shell verification and visual review, the extra depth pays
  for itself even more than before.
- **Researcher-product → Opus 4.8.** Open-ended synthesis across sources,
  runs once. Opus is "capable enough for hard tasks, fast enough for daily
  use" and Sonnet 5 is closing the gap on tool-augmented reasoning (HLE with
  tools: 57.4 vs 57.9) but Opus still edges it — worth it for the foundation
  everything else builds on.
- **Researcher-design, sitemap-architect → Sonnet 5, medium effort.**
  Structured, well-scoped transformation tasks producing prose. Sonnet 5 ties
  Opus on knowledge-work benchmarks (GDPval-AA) at a fraction of the cost.
- **Design-system-architect → Sonnet 5, high effort (bumped from medium).**
  This stage now does real engineering — scaffolding a project, writing typed
  components, running its own verification loop — not a structured text
  transform, so it needs the deeper reasoning budget.
- **Screen-designer → Opus 4.8.** This is the fork-join merge point —
  reconciling two independent upstream specs (now: a sitemap and a real
  component library) is where subtle mismatches hide, so the extra reasoning
  depth over Sonnet pays for itself here specifically.
- **App-builder → Sonnet 5, not Opus.** Counterintuitive but backed by data:
  Sonnet 5 beats Opus 4.8 on Terminal-Bench 2.1 (80.4% vs 74.6%) — the actual
  build stage is autonomous shell/file work, which is Sonnet 5's strength, not
  Opus's. Sonnet 5 also has much better prompt-injection resistance (0.93%
  vs Opus's 31.5% attack success rate without safeguards), relevant since this
  agent runs Bash somewhat autonomously.

## Effort levels (the cost dial that matters more than model choice)

Effort controls how much internal reasoning a model spends per turn — Anthropic's
own guidance frames this as the primary cost lever, more so than which model you
pick. Levels: low → medium → high (default) → xhigh → max. Set per-agent in each
file's frontmatter (`effort: high`, etc.); override for one run with `/effort` in
the session.

| Agent | Model | Effort | Why |
|---|---|---|---|
| researcher-product | Opus 4.8 | high | synthesis quality matters, runs once |
| researcher-design | Sonnet 5 | medium | lighter, pattern-based research |
| sitemap-architect | Sonnet 5 | medium | structured transformation |
| user-flow-designer | Sonnet 5 | high | detail-heavy, error/edge-case coverage matters |
| data-researcher | Opus 4.8 | high | real cited nutrition/fitness data, accuracy stakes are high |
| design-system-architect | Sonnet 5 | high | real engineering: scaffold, code, self-verify |
| screen-designer | Opus 4.8 | high | 3-way merge point, error-prone, now writes real code |
| app-builder | Sonnet 5 | high | real coding, quality > speed |
| reviewer | Fable 5 | high (xhigh on merge review) | highest-stakes, now runs real verification |

## Important: Fable 5's subscription status is moving fast

As of this writing, Fable 5 is included on Max plans for up to 50% of weekly
usage limits only through **July 12, 2026** — after that it requires separately
enabled **usage credits**, billed at API rates ($10/$50 per million input/output
tokens, double Opus 4.8), with no grace period if credits aren't enabled. This
has already shifted once (originally July 7, extended to July 12), so check your
Claude usage dashboard before you rely on it.

The math still works in Fable's favor for the reviewer role specifically: at
~5,000-15,000 input tokens and ~1,000 output tokens per review call, each review
costs roughly $0.10-$0.20 at metered rates. The code-stage reviews (design-system,
screens, build) now also spend some tokens on Bash/screenshot tool calls, which
adds a bit more but is still small relative to the model cost. That's a very
different calculation than running Fable as the orchestrator, which would rack up
that premium on every coordination turn instead of a handful of bounded checks.

If you enable usage credits: set a spending cap (claude.ai → Settings → Usage) —
this is the one thing that protects you if a session runs longer than expected.

## Setup
1. Put the 9 files from `agents/` into your project as `.claude/agents/*.md`.
2. Put `pipeline-state.json` into your project as `pipeline/state.json`.
3. Write your idea into `docs/idea.md`.
4. Start a session at claude.ai/code (Claude Code on the web) in this project —
   this runs in Anthropic's cloud, so it keeps working without your machine
   staying on.
5. Run `/model sonnet` to set the main session (orchestrator) model before you
   send the kickoff prompt.

## Kickoff prompt
> Using docs/idea.md and pipeline/state.json, run the pipeline: researcher-product
> and researcher-design in parallel first. Send each to reviewer as it finishes.
> Once research-product is approved, run sitemap-architect and data-researcher
> in parallel (send each to reviewer as it finishes); once sitemap is approved,
> run user-flow-designer, then reviewer. All of this can proceed alongside
> design-system-architect once research-design is approved (send
> design-system-architect to reviewer too). Once sitemap, user-flows,
> design-system, and data-research are all approved, run screen-designer, then
> reviewer. Once approved, run app-builder, then reviewer for a final check.
> If reviewer rejects the same stage twice in a row, stop and flag me instead of
> retrying again.

## Notes
- Models and effort levels are set per-agent in each file's frontmatter. Swap
  freely — e.g. drop reviewer to opus if you'd rather not touch usage credits
  at all; you'll lose some of the judgment-quality edge but stay fully inside
  your Max plan's included usage.
- The design-system and app packages are npm workspace members (root
  `package.json` with `"workspaces": ["design-system", "app"]`) — `app/`
  depends on the design-system package by name, not by copy-pasted files.
  Running the app locally (Android Studio, `expo run:android`, etc.) needs
  `npm install` run once at the repo root so the workspace linking resolves.
- If any stage needs local-only tools (a physical device, a local dev server
  reachable from your phone), that stage's *testing* needs local Claude Code
  or your own machine — the agents themselves can build and verify (typecheck,
  web export, screenshot) entirely inside the cloud session.
- Confirm `fable` shows up as a model option in your cloud environment before
  the pipeline run — access policy for it has changed four times in the last
  five weeks, so don't assume today's rules hold without checking.

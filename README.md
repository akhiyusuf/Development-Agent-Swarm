# Multi-agent build pipeline

## Shape of the pipeline (fork → join)

    docs/idea.md
        ├── researcher-product (Opus, high)  ──► sitemap-architect (Sonnet, medium) ──┐
        │                                                                              ├──► screen-designer (Opus, high) ──► app-builder (Sonnet, high)
        └── researcher-design (Sonnet, medium) ──► design-system-architect (Sonnet, medium) ──┘

`reviewer` (Fable 5, high — xhigh optional on the merge review) gates every arrow
above. Nothing proceeds until reviewer marks the stage(s) it depends on as
`approved` in `pipeline/state.json`. The main session (the orchestrator) runs on
**Sonnet 5** — set this with `/model sonnet` before you paste the kickoff prompt.

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
  sweet spot: judgment-heavy, low-frequency (7 calls per full pipeline pass,
  not continuous chat), and hard to self-assess — which is the whole reason
  it exists as a gate. The cost is trivial at this call volume even at metered
  rates (see below).
- **Researcher-product → Opus 4.8.** Open-ended synthesis across sources,
  runs once. Opus is "capable enough for hard tasks, fast enough for daily
  use" and Sonnet 5 is closing the gap on tool-augmented reasoning (HLE with
  tools: 57.4 vs 57.9) but Opus still edges it — worth it for the foundation
  everything else builds on.
- **Researcher-design, sitemap-architect, design-system-architect → Sonnet 5.**
  Structured, well-scoped transformation tasks. Sonnet 5 ties Opus on
  knowledge-work benchmarks (GDPval-AA) at a fraction of the cost.
- **Screen-designer → Opus 4.8.** This is the fork-join merge point —
  reconciling two independent upstream specs is where subtle mismatches hide,
  so the extra reasoning depth over Sonnet pays for itself here specifically.
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
| design-system-architect | Sonnet 5 | medium | structured transformation |
| screen-designer | Opus 4.8 | high | merge point, error-prone |
| app-builder | Sonnet 5 | high | real coding, quality > speed |
| reviewer | Fable 5 | high (xhigh on merge review) | highest-stakes, lowest-frequency |

## Important: Fable 5's subscription status is moving fast

As of this writing, Fable 5 is included on Max plans for up to 50% of weekly
usage limits only through **July 12, 2026** — after that it requires separately
enabled **usage credits**, billed at API rates ($10/$50 per million input/output
tokens, double Opus 4.8), with no grace period if credits aren't enabled. This
has already shifted once (originally July 7, extended to July 12), so check your
Claude usage dashboard before you rely on it.

The math still works in Fable's favor for the reviewer role specifically: at
~5,000-15,000 input tokens and ~1,000 output tokens per review call, each of the
7 reviews in a full pipeline pass costs roughly $0.10-$0.20 — a few dollars total
per run, even at metered rates. That's a very different calculation than running
Fable as the orchestrator, which would rack up that premium on every coordination
turn instead of just 7 bounded checks.

If you enable usage credits: set a spending cap (claude.ai → Settings → Usage) —
this is the one thing that protects you if a session runs longer than expected.

## Setup
1. Put the 7 files from `agents/` into your project as `.claude/agents/*.md`.
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
> Once both are approved, run sitemap-architect and design-system-architect in
> parallel. Send each to reviewer. Once both are approved, run screen-designer,
> then reviewer. Once approved, run app-builder, then reviewer for a final check.
> If reviewer rejects the same stage twice in a row, stop and flag me instead of
> retrying again.

## Notes
- Models and effort levels are set per-agent in each file's frontmatter. Swap
  freely — e.g. drop reviewer to opus if you'd rather not touch usage credits
  at all; you'll lose some of the judgment-quality edge but stay fully inside
  your Max plan's included usage.
- If any stage needs local-only tools (a local dev server, files outside the
  repo), that stage needs local Claude Code instead of the web session.
- Confirm `fable` shows up as a model option in your cloud environment before
  the pipeline run — access policy for it has changed four times in the last
  five weeks, so don't assume today's rules hold without checking.

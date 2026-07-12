# User Flows

Source: `docs/sitemap.md` (sitemap stage, **approved, pass 3**, current — Sign Up/Log In
re-ordered to sit immediately before Onboarding Complete). Cross-referenced against
`research/product-research.md` and `docs/idea.md`. `docs/reference/legacy-screens.md` (a
prior prose spec built against the *old* sitemap ordering, where Sign Up/Log In sat
immediately after Splash) was read as non-binding reference only; where it conflicts with
the current sitemap's ordering — which it does, structurally, on exactly this point — this
document follows the current sitemap, not the legacy reference.

This document describes **behavior and state**, not visuals or components — that is
screen-designer's job, working from design-system's components. Screen names below are the
sitemap's own names; flows are grouped by user goal, not by screen.

Three items were explicitly flagged by the sitemap reviewer for resolution here (not left
implicit). They are resolved in full in **Section 0** and then applied consistently
throughout every flow that touches them.

---

## 0. Resolved carry-forwards

### 0.1 Pre-auth local state handling

**Scope of the problem:** Profile Setup, Goal & Target Setup, Region & Cuisine Preference,
Module Interest, and Workout Placement Assessment (all tracks) now happen *before* Sign
Up/Log In. None of that data can be tied to an account yet, because no account exists. It
must be held **locally on the device** and attached to the account at the point of Sign Up
(or reconciled at Log In — see below).

**Mechanism (default):**
- Each onboarding screen commits its answers to a local, unauthenticated "onboarding draft"
  the moment the user taps **Continue** on that screen (not on every keystroke — see
  Interruption handling in Flow A2 for what happens to mid-screen, unconfirmed input).
- The draft is keyed to the device/app-install, not to any account, and persists across app
  restarts and backgrounding.
- The draft has no separate expiry policy in this version (default — flagged as an open
  question below): it lives until one of three things happens: (a) it is successfully
  attached to an account at Sign Up, (b) it is superseded per the Log-In conflict rule below,
  or (c) the user explicitly restarts onboarding (an explicit "Start over" affordance,
  available from any onboarding screen's overflow/back-out path) or clears app data.

**Abandonment before reaching Sign Up (recoverable, not reset — default):**
1. User completes some prefix of onboarding (e.g., Profile Setup + Goal Setup) and then
   backgrounds, force-quits, or uninstalls-and-reinstalls-without-clearing-data... actually
   only backgrounding/force-quit/kill are recoverable; uninstall clears local storage and is
   equivalent to a fresh install (no draft to recover — expected platform behavior, not a bug).
2. On relaunch, Splash's session-restore check runs two checks in this order: (a) is there a
   valid cached **account** session? If yes → Flow A7 (returning user). (b) If no account
   session, is there a local onboarding draft in progress? If yes → **resume onboarding at
   the first not-yet-completed screen**, not screen one. Previously entered fields are
   pre-filled from the draft if the user navigates back.
3. If neither exists, this is a genuine first launch → Flow A1 from the top.
4. **Reasoning:** the sitemap itself frames Sign Up's new position as "the point where
   there's now real progress worth saving." Silently discarding that same progress on an
   ordinary app-kill would contradict the stated rationale for moving Sign Up later. Recovery,
   not reset, is the default.

**Conflict resolution — returning user logs in mid-onboarding with unsynced local
partial-onboarding state already on the device (default):**

This happens when a user starts onboarding fresh on a device (no account session), completes
some prefix of Profile Setup / Goal Setup / Region Preference / Module Interest / Placement,
reaches Sign Up / Log In, and chooses **Log In** (they already have an account — e.g.,
reinstall, new device, or they started onboarding not realizing they had an account) rather
than Create Account.

1. Log-in succeeds → the client now has two candidate sources of onboarding data: the
   **local draft** on this device, and whatever **account-side profile/goal/region/module/
   placement data** already exists on the server for that account (which may be complete,
   partial, or entirely absent, depending on whether that account ever finished onboarding
   elsewhere).
2. **Default resolution rule: field-level, server-wins-where-present merge.** For each
   discrete piece of onboarding data (profile fields, goal/targets, region/cuisine
   preference, module interest, calisthenics placement, Pilates placement):
   - If the **account already has a confirmed value** for that field/section, the account's
     value wins; the local draft's value for that same field is discarded silently (no
     destructive prompt needed, since nothing account-side is being overwritten).
   - If the **account has no value** for that field/section (e.g., the account was created
     previously but the user abandoned before finishing, say, Module Interest or Placement),
     the local draft's value for that field fills the gap and is attached to the account now.
   - After the merge, if **any** required onboarding field is still unfilled (neither account
     nor local draft had it), the user is dropped into onboarding at that first unfilled
     step, not sent straight to Home — the account is genuinely incomplete and needs it.
   - If the account was already fully onboarded, the user proceeds per Flow A7 (returning
     user landing) with the local draft discarded in full.
3. **Why this default over the simpler alternative (discard local draft entirely on any
   log-in):** a pure "server always wins, local always discarded" rule is simpler but has a
   real failure mode — an account that was created but never finished onboarding (e.g., the
   user signed up on a different device, closed the app before Onboarding Complete, and now
   opens a fresh device where they immediately log in) would strand the user with an
   incomplete profile and no way back into onboarding to fill the gaps, since onboarding is
   framed as a one-time pre-nav sequence. The field-level merge avoids that stranding without
   ever silently overwriting a value the account already has confirmed.
4. **This is a reasoned default, not a validated requirement.** Product research does not
   address multi-device onboarding conflicts at all. If product/design later decides
   overwriting confirmed account data with a fresher local draft is sometimes desirable (e.g.
   "I re-did my goal setup on this device on purpose"), that needs an explicit
   conflict-prompt UI, which is out of scope for this default and would be a follow-up
   design decision, not a silent behavior change.

### 0.2 Returning-user landing: straight to tab bar, not a "Welcome back" summary screen

**Default: a returning user who logs in (Splash → Log In, no cached session) lands directly
in the tab bar shell at Home.** No dedicated "Welcome back" summary screen is inserted
between Log In and Home.

**Reasoning:**
- Log-in is a **high-frequency, habitual action** for a returning user (potentially daily).
  A dedicated summary screen adds a forced extra tap/screen to something the sitemap's own
  language already treats as a short-circuit ("skips the onboarding steps above"). Friction on
  a frequent action is a worse trade than the marginal orientation value of a summary screen.
- The **Onboarding Complete / Welcome Summary** screen already exists in the sitemap and
  fully serves the "welcome, here's your setup" moment for the case it's actually needed —
  immediately after finishing onboarding for the first time. Reusing that same pattern for
  every subsequent login would dilute its meaning as a first-time milestone.
- A cached-session relaunch (app already logged in, Splash routes straight to Home per the
  sitemap's own description) is materially the same destination as an active log-in; keeping
  both paths land on Home avoids an inconsistent mental model of "sometimes login shows a
  summary, sometimes it doesn't."

**What still happens on login, short of a full screen (default):** if data changed since the
last local session (e.g., a field-level merge occurred per §0.1, or account-side sync pulled
newer targets/placements from another device), Home shows a single **transient, dismissible,
non-blocking banner** on first paint ("Synced — your profile is up to date" or similar),
using the same offline/sync status treatment already defined for Home's sync indicator. This
is not a separate screen and does not block interaction with Home underneath it.

**This is a reasoned default, not a validated requirement.** Product research does not
address returning-user landing UX; if user testing later shows returning users want an
explicit "here's what changed" recap (e.g., after a long absence), that would be a scoped
addition to Home's first-paint state, not a new pre-nav screen.

### 0.3 Sign Up is a hard wall — no guest/skip mode

**Explicit: there is no guest/skip path past Sign Up / Log In in this version.** Every flow
below that reaches the Sign Up / Log In screen treats it as a **mandatory, non-bypassable
gate** — there is no "skip" or "continue as guest" action anywhere on that screen, and no
other route from onboarding into the tab bar exists.

**Why:** Core Feature Requirement 12 is "a single account tying nutrition and training
together" — the entire cross-module payoff (shared energy-balance model, Combined Progress
Dashboard, Progress-tab data) depends on every logged data point being tied to one account
from the moment it enters the tab bar. A guest mode would mean in-app data (diary entries,
weight logs, workout attempts) exists with no account to tie it to, directly contradicting
Req 12, and would require either (a) a second data-migration path to attach guest data to an
account after the fact, or (b) accepting that guest data is disposable — neither of which is
specified or budgeted anywhere in the research or sitemap.

**If this needs to change later** (e.g., product wants a low-friction guest trial to reduce
signup drop-off), **that is a sitemap-level decision, not a flow-level one** — it would
require a new sitemap screen/branch (a guest-mode data model, an account-attachment flow for
guest data, and a decision on what guest data survives the eventual signup). This document
does not invent that path; it documents the current sitemap's hard wall faithfully.

---

## Common state patterns (referenced by tag throughout)

To avoid repeating the same mechanics on every flow below, these patterns are defined once
and referenced by tag. Screen-specific nuances are still called out inline within each flow.

**[CP-OFFLINE] Offline write queuing** — applies to every write action noted as
"queues when offline" (log meal, log workout attempt, weight entry, custom food save, session
save, profile/goal edits):
1. User submits the action while offline (or connectivity drops mid-submit).
2. The UI optimistically reflects the entry immediately, tagged "queued" (a small, non-error
   `type.micro` tag/badge — this is an expected state, not a failure state).
3. A global sync/offline status indicator (present on Home and in Data & Sync Settings)
   reflects the queued count.
4. On connectivity return, a background sync attempt fires automatically; on success the
   "queued" tag clears silently.
5. If a queued item fails to sync repeatedly (e.g., server-side validation rejects it, or a
   conflict is detected), it surfaces in Data & Sync Settings' error list with a per-item
   retry action, and a small error badge appears on the relevant tab bar icon. It is never
   silently dropped.
6. The user is never blocked from continuing to use the app offline; every write screen
   remains usable offline by design (Req 5).

**[CP-NETFAIL] Network failure on a synchronous submit** (auth actions that require live
connectivity — login, signup, password reset, since these cannot be queued offline):
1. Submission attempt fails (no connectivity, timeout, or server error).
2. Form data is preserved on-screen (nothing is cleared).
3. An inline, non-blocking error banner appears with a human-readable reason and a **Retry**
   action.
4. The user may retry, edit and resubmit, or navigate away (Back) without losing what they
   typed, subject to normal back-out rules for that screen.

**[CP-VALIDATION] Field-level validation failure:**
1. Invalid/missing required field(s) are marked inline (per-field error styling + message).
2. The primary action (Continue/Save) stays disabled or, if tapped anyway, does nothing but
   surface/re-surface the field errors — it never submits partial-invalid data.
3. No data already validly entered elsewhere on the form is lost.

**[CP-EMPTY-SEARCH] Empty search/list result:**
1. Zero results renders an explicit empty state with a constructive next action (e.g. "No
   matches — create a custom food" linking onward), never a bare blank area.
2. Distinguished from "no data yet" (first-run) empty states, which explain *why* it's empty
   and what the first action to take is, rather than implying something is broken.

**[CP-MODAL-BACKOUT] Interruption in a transient modal/sheet** (Add Food Entry, Log Attempt,
Quick-add Weight, Edit/Delete Entry, Portion Reference Guide, Mastery Gate Confirmation):
1. Backing out (system back gesture/button, swipe-to-dismiss, tapping outside the sheet)
   before the modal's primary Save/Confirm action discards all unsaved input entered in that
   modal.
2. The originating screen is left exactly as it was before the modal opened — no partial
   save, no residual draft.
3. Reopening the same modal starts fresh (no resume-from-last-attempt for these short,
   single-purpose modals — see individual flows for any exceptions).

**[CP-PERMDENY] Permission/OAuth denial** (Health/Fit integration connect):
1. If the user denies the permission/OAuth prompt, the integration shows an explicit
   "not connected" state (never a silently-half-connected state).
2. A **Retry/Connect again** action remains available; nothing crashes or dead-ends.

---

# A. Onboarding & Authentication Flows

## A1. First Launch (brand-new user, no local draft, no account)

**Trigger:** app opens with no cached account session and no local onboarding draft.

**Happy path:**
1. Splash screen runs its session-restore check (finds nothing) → routes to Profile Setup.
2. **Profile Setup:** user enters name, sex, height, current weight, activity level, primary
   goal (lose/maintain/gain). On Continue, this data commits to the local onboarding draft.
   → Goal & Target Setup.
3. **Goal & Target Setup:** app computes a calorie/macro target from Profile Setup inputs;
   user may adjust. On Continue, committed to draft. → Region & Cuisine Preference.
4. **Region & Cuisine Preference:** user selects market (Nigeria/Ghana/Kenya) and optionally
   enables the Western/diaspora food set. On Continue, committed to draft. → Module Interest.
5. **Module Interest:** user selects "Track nutrition" (always on), and optionally "Train
   (calisthenics/Pilates)" if the workout module is live (or registers interest if it's
   marked "coming soon" — see Flow A2a). On Continue:
   - If workout NOT selected (or module not live and user didn't register interest) →
     skip directly to Sign Up / Log In.
   - If workout selected and module is live → Workout Placement Assessment (Flow A3).
6. **(Conditional) Workout Placement Assessment** completes (or is deferred — Flow A3) →
   Sign Up / Log In.
7. **Sign Up / Log In (Flow A4/A5):** user creates an account or logs into an existing one.
   Hard wall — no skip (§0.3).
8. On successful account creation/attachment, the full local onboarding draft is attached to
   the new account server-side; local draft is then cleared (it's now durable account data).
9. → **Onboarding Complete / Welcome Summary**, which recaps goal/target, region, and (if
   opted in) starting workout tier(s). → "Go to Home" → tab bar shell at Home.

**Loading/pending states:**
- Splash's session-restore check shows a loading affordance only if it runs past a short
  threshold; otherwise auto-advances (no perceptible loading screen on the common case).
- Goal computation on Goal & Target Setup is a local calculation, not a network call — no
  loading state expected unless flagged otherwise by design-system.

**Error states:**
- [CP-VALIDATION] on every form screen (Profile Setup fields, Goal & Target Setup numeric
  overrides, Region selection).
- Over-aggressive calorie/macro adjustments on Goal & Target Setup: non-blocking warning
  caption advising a safer range; user may proceed anyway (not a hard validation error — this
  is a judgment call, not a data-integrity failure).
- Sign Up / Log In network failures: [CP-NETFAIL].

**Interruption / back-out:**
- Standard Back navigation between onboarding screens preserves previously entered values.
- App kill/background mid-flow → recoverable per §0.1 (resume at first incomplete screen on
  relaunch).
- A user can back out of Module Interest's workout selection after starting Placement (see
  Flow A3's own back-out rules) — this does not retroactively un-select "Train" at Module
  Interest; it only defers placement, handled the same as an explicit "skip for now."

**Open question / default:** what if the user quits the app on the Sign Up / Log In screen
itself, after completing all pre-auth onboarding but before creating an account or logging
in? Default: this is recoverable exactly like any other pre-auth abandonment — on relaunch,
resume directly at Sign Up / Log In (all upstream draft data intact), not back at Profile
Setup. This is a default, not independently validated.

## A2. Onboarding step detail: Module Interest branching (fork/join)

This is the sitemap's first fork/join point and is made explicit here rather than left
implicit.

**Fork:** at Module Interest, the user's choice determines whether Workout Placement
Assessment (Flow A3) is entered at all:
- **Nutrition only** (or workout selected but module not yet live and user doesn't register
  interest) → the flow **skips A3 entirely** and goes straight to Sign Up / Log In.
- **Both / workout selected, module live** → enters A3.

**Join:** regardless of which branch was taken, both paths converge on the same **Sign Up /
Log In** screen — there is no different account-creation path for nutrition-only vs.
both-modules users. The only difference carried forward is what's in the local onboarding
draft being attached at signup (with or without placement-track results).

### A2a. Module Interest when the workout module is marked "coming soon"

**Default (product research and sitemap are silent on this specific interaction; this is a
reasoned default):**
1. If the workout tab/tree hasn't shipped app-wide yet, the "Train" option on Module Interest
   is shown but visually marked "coming soon" (per the sitemap's rollout note).
2. Selecting it anyway **registers interest** in the local onboarding draft but does not open
   Workout Placement Assessment now (there's nothing live to place them into yet) — the flow
   proceeds straight to Sign Up / Log In as if workout weren't selected, functionally
   identical to the nutrition-only branch for this session.
3. Registered interest is attached to the account at signup as a flag.
4. **When the workout module later activates app-wide** (a future app update), users flagged
   as interested are shown a one-time prompt (banner on Home, or an in-context prompt on
   first tap of the newly-enabled Workout tab) inviting them to complete Placement now — this
   routes them into the same per-track Placement Assessment (Flow A3) they would have gotten
   at onboarding, now running post-auth (their answers attach directly to the account, no
   local-draft step needed since they're already logged in).
5. This reactivation-prompt behavior is not specified anywhere in product research or the
   sitemap; it is flagged here explicitly as **a default**, because leaving it undefined would
   mean interested users silently never get invited to actually use the feature once it ships.

## A3. Workout Placement Assessment (per-track fork/join, only entered if opted in)

**Trigger:** user opted into the workout module at Module Interest (and the module is live).

**Happy path — both tracks:**
1. **Assessment Intro:** states what placement measures overall, a safety-note callout, and
   states up front that placement is done **per track**. Actions: Begin, or "Skip for
   now / do this later" (defers — see below), or Back (to Module Interest).
2. **Track Selection:** shown only because both tracks were opted into. User chooses
   Calisthenics, Pilates, or both, in either order; either may be deferred individually.
3. User completes **Calisthenics Placement** (Assessment Steps: push/pull/squat-hinge/
   core-hold checks → Assessment Results → Calisthenics Starting Tier Placement) and/or
   **Pilates Placement** (Assessment Steps: core/breath control, mobility, mat-position
   tolerance checks → Assessment Results → Pilates Starting Tier Placement), in whichever
   order chosen at Track Selection.
4. After completing one track, the user returns to Track Selection to do the other, or
   defers it.
5. If **both** tracks are completed in this session → **Combined Assessment Summary**
   (recaps both starting placements) → Continue → Sign Up / Log In.
6. If only **one** track was completed and the other deferred → skip Combined Summary,
   proceed directly to Sign Up / Log In with one track placed and one deferred (recorded in
   the draft as "deferred", not "failed" or "skipped forever").

**Happy path — single track opted in:** Track Selection is skipped entirely (per sitemap:
"If only one track was chosen, this step is skipped"); the user goes straight into that
track's placement steps, then straight to Sign Up / Log In (no Combined Summary, since
there's only one track to summarize).

**Deferral (fork branch, explicit):**
- At Assessment Intro: "Skip for now" defers **both** tracks entirely — the flow proceeds to
  Sign Up / Log In with neither track placed.
- At Track Selection: "Do the other later" defers the remaining track only — the flow
  proceeds with one track placed, one deferred.
- **Join point for deferred tracks:** any deferred track's placement becomes reachable later
  from **Skill Tree Home** (post-auth, post-onboarding) — see Flow A9. This is the explicit
  merge point the sitemap review flagged: deferred placement never leaves a dead end; it
  always has exactly one re-entry point (Skill Tree Home), regardless of whether it was
  deferred pre-auth (during onboarding) or the user simply never got to it.

**Loading/pending states:** none beyond standard step-to-step transitions (assessment logic
is local computation from self-reported inputs, not a network call).

**Error states:**
- [CP-VALIDATION] on self-report inputs (a step can't be left blank if it requires a value;
  "Skip this step" is an explicit, distinct action from leaving it blank, and is allowed per
  the sitemap's per-step actions — a skipped step is recorded as skipped, not defaulted to a
  fabricated value).

**Interruption / back-out (default — product research/sitemap don't specify this):**
- **Mid-assessment-steps abandonment (e.g., app killed on step 2 of 4) is NOT resumed
  mid-step.** Default: a partially-completed set of self-report steps for a track is
  discarded on abandonment; on return (whether relaunch or navigating back into that track's
  placement later), the user restarts that track's steps from Step 1. Only **fully completed**
  track results (Starting Tier Placement reached) persist in the draft.
  - **Reasoning for this default:** self-report assessment answers are short-lived,
    session-scoped inputs feeding a one-time placement calculation; persisting a stale partial
    set of answers across an arbitrary gap (possibly days, possibly after the user's fitness
    level changed) risks placing them based on answers they no longer stand by. Restarting a
    short (few-step) assessment is low-cost. This is explicitly a default, not a validated
    requirement, and applies identically whether the abandonment happens pre-auth (onboarding)
    or post-auth (deferred placement completed later from Skill Tree Home).
- Backing out of Track Selection (system Back) returns to Assessment Intro; no track state is
  lost since Track Selection itself doesn't collect data, only routes.
- Backing out of a Starting Tier Placement Results screen via "Retake" discards that
  track's just-computed result and re-enters that track's Assessment Steps from Step 1.

**Fork/join note (explicit, per the reviewer's instruction):** this entire flow forks from
and rejoins the main onboarding sequence at two points: it forks at Module Interest (Flow
A2) and rejoins at Sign Up / Log In regardless of how many tracks were completed vs.
deferred. The Sign Up / Log In screen and everything after it (Flow A4/A5, Onboarding
Complete) does not need to know or branch on which tracks were completed — it treats the
onboarding draft as a single opaque bundle that may or may not contain zero, one, or two
placement results.

## A4. Sign Up (new account)

**Trigger:** user reaches Sign Up / Log In at the end of onboarding (or resumes there per
§0.1) and chooses to create an account (email + password).

**Happy path:**
1. User enters email + password, submits.
2. Account is created server-side.
3. The full local onboarding draft (profile, goals, region, module interest, and any
   completed/deferred placement state) is attached to the new account in the same operation
   (or immediately following, if implemented as two calls — see atomicity note below).
4. Local draft is cleared (now durable, account-tied data).
5. → Onboarding Complete / Welcome Summary → Home.

**Error states:**
- [CP-NETFAIL] on the signup submission itself.
- [CP-VALIDATION] for malformed email / password policy violations (inline, per field).
- Email already in use: inline error directing the user to Log In instead (does not silently
  switch modes for them — an explicit action, "Log in instead," is offered, preserving
  whatever they'd already typed where reusable, i.e. the email).
- **Partial-failure / atomicity (default — sitemap doesn't specify how signup+attach is
  implemented):** if account creation succeeds server-side but the subsequent
  draft-attachment call fails (e.g., connectivity drops between the two), the client does not
  create a duplicate account on retry. Default: on retry, the client first checks whether an
  account already exists for the submitted email; if so, it logs into that account and
  retries the draft-attachment step only (not full signup again). The local draft is not
  cleared until attachment is confirmed successful, so no onboarding data is lost across a
  retry. This is a reasoned default given the sitemap doesn't specify signup/attach as
  necessarily one atomic server call; it should be revisited once the actual signup API
  contract is defined at build time.

**Interruption / back-out:** abandoning on this screen before submitting is exactly the
§0.1 "abandonment before Sign Up" case — fully recoverable, resumes here on relaunch, local
draft intact.

## A5. Log In (during onboarding, existing account)

**Trigger:** user reaches Sign Up / Log In at the end of onboarding and chooses Log In
instead of Create Account (typically because they already have an account from another
device/reinstall).

**Happy path (see §0.1 for the full conflict-resolution rule; summarized here as steps):**
1. User enters email + password, submits.
2. On success, the field-level merge described in §0.1 runs: account-side data wins per
   field where present; local draft fills any gaps; local draft is then discarded.
3. If the merged result leaves any required onboarding field unfilled, the user is routed
   into onboarding at that first unfilled step (not to Home) to complete it — this is now
   running post-auth, so completed steps attach directly to the account without a further
   local-draft/signup step.
4. If the merged result is fully complete, the user proceeds to Onboarding Complete /
   Welcome Summary (first time reaching this exact merged state) or, if the account had
   already fully completed onboarding previously (this is genuinely a returning-user login,
   just reached via the onboarding entry point rather than Splash), proceeds per Flow A7
   (straight to Home, no summary screen — §0.2) instead of re-showing Welcome Summary.

**Error states:** [CP-NETFAIL], [CP-VALIDATION] as A4; incorrect credentials → inline error,
password field cleared, email preserved.

**Interruption / back-out:** same recoverability as A4 — local draft is untouched until
login actually succeeds and the merge runs, so abandoning before submitting changes nothing.

## A6. Forgot Password sub-flow

**Trigger:** "Forgot password?" tapped from Sign Up / Log In (either during onboarding or
from a fully-logged-out returning-user state).

**Happy path:**
1. Bottom-sheet modal opens with a single email input.
2. User submits → success confirmation state (inline banner) confirming a reset link was
   sent, regardless of whether the email is registered (standard practice to avoid leaking
   which emails have accounts — flagged here as a default consistent with common auth
   practice, not separately specified in product research).
3. Sheet is dismissible at any point; dismissing does not affect the underlying Sign Up /
   Log In screen's state.

**Error states:** [CP-NETFAIL] on submission; [CP-VALIDATION] for malformed email.

**Interruption / back-out:** [CP-MODAL-BACKOUT] — dismissing before submitting discards the
entered email; reopening starts fresh.

## A7. Returning User Launch

Two entry points converge on the same destination per §0.2.

**A7a — Cached session valid (app was already logged in):**
1. Splash's session-restore check finds a valid cached session (online or offline — a cached
   session is a valid, non-error state per the sitemap; offline just means Home renders from
   cache until connectivity returns).
2. → routes directly to Home. No intermediate screen.

**A7b — No cached session, user actively logs in from Splash → Sign Up/Log In (Flow A2's
short-circuit path — "Splash → Log In skips onboarding steps"):**
1. Splash finds no cached session and no in-progress local onboarding draft → routes to Sign
   Up / Log In directly (skipping Profile Setup through Placement entirely — this is the
   explicit short-circuit the sitemap describes for returning users).
2. User logs in successfully.
3. Per §0.2 default: → routes directly to Home (no Welcome-back summary screen). A
   transient, dismissible sync banner may appear on Home's first paint if anything changed
   server-side since last local knowledge (see §0.2).

**Error states:** [CP-NETFAIL] on login submission (A7b); if login fails repeatedly, no
special lockout behavior is specified here (rate-limiting/lockout policy is a security/build
concern, not a flow-level UX decision — flagged as out of scope for this document).

**Interruption:** if the user backs out of A7b's Log In screen without logging in, they are
returned to... there is nowhere "before" Splash to return to in this shortcut path; system
back from here exits the app, which is expected behavior for a hard-wall auth screen with no
prior in-app screen to return to.

## A8. Onboarding Complete / Welcome Summary → Home

**Trigger:** reached only immediately after finishing onboarding for the first time (fresh
signup per A4, or a Log In per A5 that completes a previously-incomplete account's
onboarding). Never shown to an already-fully-onboarded returning user (per §0.2).

**Happy path:**
1. Screen recaps goal + calorie/macro target, region, and (if opted in) starting workout
   tier(s) — generically, per placeholder discipline (no invented node names).
2. Single action: "Go to Home" → enters the tab bar shell at Home.

**Empty/partial state:** if the workout module wasn't opted into (or placement was deferred
entirely), the workout-tier recap section is simply omitted from this screen rather than
shown empty or as an error.

**Interruption:** backing out or killing the app here is equivalent to killing it on Sign Up
/ Log In's success path — recoverable; relaunch resumes here (the account already exists and
is onboarded; this is just a confirmation screen, not data-bearing) or, defensibly, could
route straight to Home since the account is already fully set up. **Default:** route straight
to Home on relaunch rather than re-showing the summary — treats this screen as a one-time
courtesy, not a required checkpoint, consistent with §0.2's reasoning that repeat-visits to
a "welcome" framing should be minimized.

## A9. Deferred Placement re-entry (post-onboarding, from Skill Tree Home)

**Trigger:** a user with one or both workout tracks deferred (from Flow A3, or from having
opted out of the workout module entirely at Module Interest, or from a workout module that
activated after their onboarding per Flow A2a) taps into the Workout tab / Skill Tree Home
and chooses to complete a deferred track's placement.

**Fork/join, explicit:**
- **Fork:** Skill Tree Home shows each track's card in one of: not-placed/deferred,
  placed (with current tier), or (if the workout module wasn't opted into or wasn't live at
  onboarding) also treated as "not-placed/deferred" — opting out at onboarding and deferring
  at onboarding converge on the identical re-entry mechanism (default, reasoned: there is no
  functional reason to distinguish "never opted in" from "opted in but deferred" once the
  module is live and the user is looking at Skill Tree Home; both simply mean "this track has
  no placement yet").
- Tapping "Complete placement" on a deferred/not-placed track card launches that track's
  Assessment Steps directly (skipping Assessment Intro and Track Selection, since context —
  which track, why — is already established by where the user tapped from).
- **Join:** on completing that track's placement (Assessment Results → Starting Tier
  Placement), the flow returns to **Skill Tree Home** (not to Combined Assessment Summary,
  which is an onboarding-only screen; not back into onboarding at all — this is a fully
  post-auth flow now). That track's card updates to show its current tier and its node map
  becomes accessible.
- If the other track is still deferred, its card remains in the deferred state,
  independently re-enterable later the same way.

**Data attachment:** since this runs entirely post-auth, results attach directly to the
account with no local-draft intermediate step — this is the simplest case in the whole
placement system precisely because §0.1's pre-auth complexity doesn't apply here.

**Interruption:** identical restart-on-abandon rule as A3 (a partial run of Assessment Steps
is discarded, not resumed, on abandonment).

---

# B. Nutrition Flows

## B1. Log a Meal (Food Diary → Add Entry → Confirm & Log)

**Trigger:** user taps "Add entry" on a meal slot in Food Diary (Today), or "Log Meal" quick
action on Home.

**Happy path:**
1. **Add Food Entry** sheet opens (pre-targeted to a meal slot if launched from a diary
   slot's add affordance; slot chosen later at Confirm & Log if launched from Home's generic
   "Log Meal" action). Four tabs: Search / Recent / Favorites / Custom.
2. User searches or browses Recent/Favorites, selects an item → **Food Search Results**
   (if searching) → tap a result → **Ingredient Detail** or **Composite Meal Detail**
   depending on item type.
3. On the detail screen: user selects a household-unit portion (wrap/cup/ladle/"swallow"/
   etc. + quantity), optionally consults the **portion-photo reference** inline or expands to
   the full **Portion Reference Guide** for ambiguous cases, and reviews the macro +
   micronutrient preview for the selected portion.
4. "Add to diary" → **Confirm & Log**: user confirms/adjusts meal-slot assignment and
   quantity, reviews final preview, taps Save.
5. Entry appears in Food Diary (Today) under the assigned meal slot; running daily total
   updates; sheet dismisses back to the diary.

**Empty states:**
- **[CP-EMPTY-SEARCH]** on Food Search Results: zero matches → empty state with a "Create a
  custom food" action routing to Custom Food / Meal Builder (Flow B3).
- **First-run empty Food Diary** (brand-new user, first day, nothing logged yet): each meal
  slot shows "Nothing logged yet" with an inline add affordance — not an error, and not a
  generic blank screen (default consistent with the sitemap's stated states; product
  research doesn't separately address a zero-history first-run state, so this is a reasoned
  default: encourage the first log with an obvious, low-friction CTA per slot rather than a
  single generic empty banner for the whole day).
- **Recent/Favorites tabs with nothing yet** (new user, hasn't logged or favorited anything):
  explicit "nothing here yet" message per tab, distinct from the zero-search-result empty
  state, with a nudge toward Search instead.

**Loading/pending states:** search results show a lightweight loading indicator while
querying (local-first: cached/recent results may render immediately while a live query
refines them, per the offline note below).

**Error states / offline:**
- **[CP-OFFLINE]** applies at the final Save step (Confirm & Log): if offline, the entry
  saves locally and queues, tagged "queued" in the diary, exactly as described in the common
  pattern.
- **Search while offline:** falls back to cached/recent results with a non-error informational
  banner ("You're offline — showing recent results") rather than an error state or an empty
  screen; this is an expected degraded mode, not a failure.
- **[CP-VALIDATION]** on Confirm & Log (quantity must be valid, meal slot must be assigned)
  before Save is enabled.

**Interruption / back-out:** **[CP-MODAL-BACKOUT]** applies to the whole Add Food Entry →
Detail → Confirm & Log sequence as a single modal sheet flow: backing out at any point before
the final Save discards the entire in-progress entry (selected food, portion, slot). The
Food Diary is unaffected. There is no partial-save/resume for an abandoned add-entry attempt
— reopening Add Food Entry starts fresh from the Search/Recent/Favorites/Custom tab set.

## B2. Portion selection & Portion Reference Guide (nested within B1, detailed here)

**Trigger:** user is on Ingredient Detail or Composite Meal Detail, uncertain which
household unit matches their actual serving (the sitemap's named #1 differentiator moment).

**Happy path:**
1. User taps the inline portion-photo reference thumbnail → **Portion Reference Guide**
   sheet opens with an expanded photo set for that food/unit (multiple angles or a
   small-to-heaping range).
2. User selects the reference tile that matches their actual portion → "Use this portion" →
   the corresponding household unit is set back on the originating detail screen; sheet
   dismisses.

**Empty/partial states:**
- If a food has **no portion-photo reference at all**, the inline tile is simply omitted on
  the detail screen (never a broken/placeholder image box) — user proceeds with the
  household-unit picker alone, falling back to the "advanced/exact grams" entry if even the
  unit picker lacks a defined conversion for that food.
- If the Portion Reference Guide has **only some** reference images available for a given
  unit (not the full range), only the available tiles render; missing ones are omitted
  entirely rather than shown as gray placeholders.

**Error states / offline:**
- If a reference image fails to load (including offline with nothing cached), that tile
  falls back to its caption + a small icon — this is an expected degraded state for
  low-bandwidth conditions (Req 13), not an error banner.

**Interruption:** **[CP-MODAL-BACKOUT]** — dismissing the guide without selecting a tile
leaves the originating detail screen's portion selection unchanged (whatever it was before
the guide opened).

## B3. Custom Food / Meal Builder

**Trigger:** "Custom" tab on Add Food Entry, or the "Create a custom food" empty-state CTA
from a zero-result search.

**Happy path:**
1. User fills name, per-portion macros, optional micronutrients, and defines the food's own
   household units + gram equivalents (so the custom food gets the same first-class portion
   model as the curated database). For a composite meal, an "add ingredient" repeater
   assembles components.
2. Optional: attach a photo, which becomes that food's own portion-photo reference for future
   logs.
3. **Save** → food/meal is added to the user's custom set, available thereafter from the
   Custom tab and from Search/Recent/Favorites once used.
4. **Save & log now** → same save, then routes directly into Confirm & Log with this new
   food pre-selected (a 1x default portion), merging back into Flow B1 at its final step.

**Error states:**
- **[CP-VALIDATION]** per field (name required, macros must be numeric, at least one
  household unit with a gram equivalent required before Save is enabled).
- **[CP-OFFLINE]** on Save: saves locally and queues sync.

**Interruption / back-out:** backing out mid-builder before Save discards the in-progress
custom food entirely — no partial custom food is ever saved. **Open question / default:**
should a partially-filled custom-food form auto-save a local-only draft so a long recipe
entry (many ingredients) isn't lost to an accidental back-swipe? Product research doesn't
address this; **default: no auto-save draft in this version** — treat it like any other
modal per [CP-MODAL-BACKOUT] for consistency, and revisit if user feedback shows composite
meal entry is long/frustrating enough to need draft persistence.

## B4. Edit / Delete Diary Entry

**Trigger:** tap an existing entry row in Food Diary (Today).

**Happy path:**
1. Modal opens showing the entry with an editable portion control and meal-slot
   reassignment.
2. **Save changes** → diary updates in place; daily totals recompute.
3. **Delete** → requires an explicit confirm step (not a bare single-tap delete) → entry
   removed; totals recompute.

**Error states:** [CP-VALIDATION] on edited quantity/slot; [CP-OFFLINE] on save/delete
(queues, tagged accordingly; a delete that hasn't synced yet still visually removes the
entry from the diary immediately — optimistic delete — and reconciles silently on sync).

**Interruption:** [CP-MODAL-BACKOUT] — backing out before Save/Delete leaves the entry
completely unchanged.

## B5. Daily Nutrition Summary & Micronutrient Detail

**Trigger:** navigating from Food Diary, or tapping a nutrient row on the summary.

**Happy path:**
1. Daily Nutrition Summary shows calories/macro breakdown and a full micronutrient panel for
   the current day, each nutrient tappable.
2. Tapping a nutrient → Micronutrient Detail: current-day value vs. target, plus a weekly
   trend.

**Empty / partial states (graceful "no data" — Req 4, explicitly required by product
research, not a default):**
- Any micronutrient with no data for the foods logged that day renders an explicit "no data"
  indicator (icon + caption) — never a false zero, and never omitted silently (omission
  would look like the nutrient simply wasn't tracked, which is misleading; an explicit "no
  data for this food" state is required so the user isn't misled into thinking they hit 0% of
  a nutrient they may have actually consumed via an uncoded food).
- On the weekly trend (Micronutrient Detail), days with no underlying data render as explicit
  gaps in the trend line/bars, not as zero-value points (a zero point would visually imply
  "ate none," which is a false claim the research explicitly warns against as a
  trust/liability risk).
- **First-run / zero-logged-days-ever state (open question — product research and sitemap
  are silent on this specific case):** a brand-new user who has just finished onboarding and
  has logged nothing yet. **Default:** Daily Nutrition Summary and the Micronutrient Detail
  trend show a target-only, no-data-logged state with a direct CTA back to Add Food Entry,
  rather than rendering empty rings/bars with no explanation. This mirrors the graceful
  per-nutrient "no data" pattern already required, just applied to the whole-day case.

**Error states:** none beyond standard offline read-from-cache (viewing already-logged data
works fully offline; it's a read view, no network-dependent action here).

## B6. Nutrition History / Calendar

**Trigger:** navigating from Nutrition tab's history entry point.

**Happy path:** month calendar view; each day cell shows a completeness indicator
(logged/partial/none, via icon+state, never color alone); tapping a day opens that day's
Diary or Summary.

**Empty state:** a day with nothing logged shows the "none" indicator and, on tap, the same
first-run empty Diary/Summary state as B5's zero-logged-days default (reused, not a separate
state to design).

**Error/offline:** fully readable from local cache; no network dependency for viewing past
already-synced days. Days that are only locally queued (not yet synced) show their normal
"queued" tags within that day's view, consistent with B1/B4.

## B7. Favorites & Recents Management

**Trigger:** reached from Add Food Entry's Favorites/Recents tabs or a Nutrition sub-menu.

**Happy path:** two sections (Favorites, Recents); each row supports quick-log (jumps
directly into Confirm & Log with that food/last-used portion pre-filled — merges into Flow
B1's final step) and edit/remove.

**Empty states:** each section independently shows its own "nothing here yet" state if
empty — a user with recents but no favorites sees a populated Recents section and an
explanatory empty Favorites section (with a CTA to favorite something), not a fully blank
screen.

**Error/offline:** remove/reorder actions queue per [CP-OFFLINE] if offline.

---

# C. Workout Flows

*(Applies only once the workout module is live and the relevant track has been placed —
see Flow A9 for the deferred/unplaced case, which gates entry into these flows per track.)*

## C1. Skill Tree Home → Tier / Node Map → Node Detail

**Trigger:** user opens the Workout tab.

**Happy path:**
1. **Skill Tree Home:** track selector (Calisthenics / Pilates / Combined). Each placed
   track shows a summary card with current tier and a "continue" affordance into that
   track's Tier/Node Map.
2. **Tier/Node Map:** visual tree for the selected track; nodes show locked / unlocked /
   in-progress / completed / mastered state and prerequisite edges.
3. Tapping an **actionable** node (unlocked, in-progress, completed, or mastered) →
   **Node Detail**: name (placeholder), current status, prerequisite(s), unlock requirement
   (time-hold or rep-threshold, TBD content), form-cue instructional content.
4. **Locked nodes are fully non-interactive** — tapping does nothing; a locked node is a
   "not yet available" indicator, not a control. Its prerequisite may be shown as a static,
   non-interactive caption near the node, but this never opens a detail view. (This is a
   design-system-carried decision, restated here because it's a load-bearing behavioral rule
   for this flow, not a visual one.)

**Fork/join note:** Skill Tree Home is the join point for Flow A9's deferred-placement
re-entry (a track with no placement shows "Complete placement" here instead of a node map)
and the join point for Flow A2a's post-launch reactivation prompt for users who registered
workout interest before the module was live.

**Empty state:** a track that genuinely has zero unlocked nodes beyond the very first
starting node (a brand-new placement result) is not an error — it's the expected starting
state; Skill Tree Home and the map render normally with just that starting node actionable.

**Error/offline:** the tree itself is locally cached/computed from the user's own
progression state; viewing it works offline. A sync-error corner glyph may appear on a node
if its state couldn't confirm against the server, without changing the node's displayed
state color.

**Interruption:** none beyond standard navigation — this is a read/browse flow with no
in-progress form to lose.

## C2. Log Attempt → Mastery Gate Confirmation

**Trigger:** "Log attempt" from Node Detail on an actionable node.

**Happy path:**
1. **Log Attempt** sheet: user enters reps completed or hold duration (matching the node's
   gate type).
2. **Save attempt.**
3. If the logged value meets/exceeds the node's threshold → **Mastery Gate Confirmation**:
   the just-mastered node shown mastered; newly-unlocked downstream node(s) shown unlocked.
   "Continue" returns to the Tier/Node Map, now reflecting the new states.
4. If the logged value does **not** meet the threshold → no Mastery Gate Confirmation; the
   attempt is simply recorded against the node's in-progress state (Node Detail's progress
   indicator updates), and the sheet dismisses back to Node Detail.

**Error states:** [CP-VALIDATION] on the numeric/duration input; [CP-OFFLINE] on Save — the
attempt queues, and threshold evaluation runs client-side against the already-known
threshold so the queued/offline state can still trigger Mastery Gate Confirmation
immediately (it does not need to wait for server confirmation to show the celebratory
unlock, since the threshold value itself is not server-dependent data). If the eventual sync
reveals a conflict (e.g., the node's requirement changed server-side in the interim — an
edge case, since node content is static placeholder in this version but the mechanism should
handle it), the app defers to the server's authoritative state on next sync and silently
reconciles the displayed node status; this is a build-level reconciliation detail flagged
here as a default assumption, not something product research specifies.

**Interruption:** [CP-MODAL-BACKOUT] on Log Attempt — backing out before Save discards the
in-progress entry; no attempt is recorded. Mastery Gate Confirmation itself is a one-way
confirmation screen (not a form) — backing out of it (rather than tapping Continue) simply
returns to the map; the unlock has already been recorded by this point regardless of how the
confirmation screen itself is dismissed (the unlock is a consequence of Save Attempt in step
2, not of viewing/dismissing the confirmation).

## C3. Progression Status

**Trigger:** navigated from Node Detail ("view progression") or a Workout sub-menu.

**Happy path:** per-track, per-skill-line list showing current node and next node with its
(TBD) gate, across both tracks if both are active.

**Empty state (open question — product research is silent on zero-attempts-yet):** a track
that's been placed but has zero logged attempts so far. **Default:** each skill line shows
its starting node as "current" and the next node as "next" exactly as normal — a freshly
placed track is not materially different from any other in-progress state here, so no
special empty-state design is needed beyond what C1 already covers. The only genuinely empty
case is a track that's deferred/unplaced entirely, which is out of scope for this screen
(Skill Tree Home handles that per Flow A9, not Progression Status).

**Error/offline:** read view, works from local cache.

## C4. Workout Session Log (freeform)

**Trigger:** "Log Workout Session" quick action from Home, or from within the Workout tab.

**Happy path:**
1. Session container opens; user adds one or more attempt rows, each reusing the Log Attempt
   entry pattern against a chosen actionable node.
2. Running session summary card updates as attempts are added.
3. **Save session** → session recorded; if launched from Home, returns to Home; if launched
   from the Workout tab, returns to the Workout tab (i.e., the flow returns to wherever it
   was launched from — see the Home quick-action fork/join note below).

**Empty state:** a session with zero attempts added cannot be saved as a "session" — Save is
disabled/blocked until at least one attempt row exists (a [CP-VALIDATION]-style rule at the
session level, not just the per-attempt level).

**Error/offline:** [CP-OFFLINE] applies at the session-save level and independently at each
attempt-row level (an individual attempt can queue even if the rest of the session synced,
and vice versa).

**Interruption / back-out:** discarding an in-progress session (back out before Save)
discards the whole session, including any attempt rows already added within it — this is
treated as one multi-row form, not as individually-committed attempts, since the session
itself is the unit being saved. (This differs from C2's Log Attempt, which commits
individually and immediately against a node — Workout Session Log is a separate, freeform
container that only commits on its own Save.) **This distinction is explicitly noted here
because the sitemap describes both mechanisms — per-node Log Attempt and freeform Session
Log — without stating how their persistence differs; this is a reasoned default: per-node
attempts logged via C2 affect real progression-gate state and should commit immediately,
while a freeform session log is a journaling convenience layered on top and can reasonably
be discarded as a whole if abandoned.**

## C5. Workout History / Session Calendar

**Trigger:** Workout tab's history entry point.

**Happy path:** calendar or reverse-chronological list of past sessions; tapping a
day/session opens that session's logged attempts (read view).

**Empty state:** zero sessions ever (new user, placed but hasn't logged a session) shows an
explanatory "no sessions yet" state with a CTA into Log Workout Session — **default,
reasoned**, product research doesn't specify this state explicitly but it follows the same
graceful-first-run pattern applied everywhere else in this document.

**Error/offline:** read view from local cache; sessions still only locally queued show their
"queued" tag.

---

# D. Progress Flows (shared layer — cross-module join point)

## D1. Combined Progress Dashboard

**Trigger:** Progress tab.

**Happy path:** three distinct, titled sections in one view — weight trend, calorie-balance
trend, and workout tier-progression summary — this screen is itself the sitemap's explicit
"cross-module payoff," i.e., a data-merge join point between the Nutrition and Workout
modules rather than a navigational fork/join. Made explicit here: **this screen must render
correctly regardless of which modules the user opted into**, per the branches below.

**Fork/join handling (explicit, since this is exactly the kind of merge point the reviewer
asked not to leave implicit):**
- **User has both modules active:** all three sections render normally with real data (or
  each section's own empty/first-run state per its own rules below).
- **User opted into nutrition only (never opted into workout, or workout module isn't live
  for them yet):** the workout tier-progression section is **omitted from the dashboard
  entirely** (not shown as an empty/locked placeholder) — **default, reasoned**: since Module
  Interest and Skill Tree Home already give this user a clear, reversible way to opt in
  later (Flow A9's "never opted in" is treated identically to "deferred," so nothing is
  permanently locked), a persistent unused section on their main Progress view would be
  clutter rather than a helpful nudge. If product wants a soft nudge instead ("Turn on
  workout tracking"), that's a valid alternative but is explicitly flagged here as **not**
  the chosen default, to avoid ambiguity for screen-designer.
- **User opted in but has deferred/unplaced tracks:** the workout section shows only the
  placed track(s); a fully unplaced/deferred state (both tracks deferred) is treated the same
  as "opted out" for this screen — section omitted, with the actual placement entry point
  living on Skill Tree Home, not duplicated here.

**Empty/first-run states within each section (defaults — not addressed by product research):**
- **Weight trend with 0 or 1 data point:** cannot show a meaningful trend line with a single
  point. Default: show the single logged value (if any) plus a "Log more entries to see a
  trend" prompt, rather than an empty chart with no explanation.
- **Calorie-balance trend with 0 logged days:** same pattern — target-only state with a CTA
  into logging, consistent with B5's first-run default.
- **Workout tier-progression summary with a freshly-placed, zero-attempt track:** same as
  C3's empty state — shows the starting node as current, no special empty design needed.

**Error/offline:** read/aggregation view; renders from local cache; each underlying data
source (weight, nutrition, workout) reflects its own "queued" state independently if any of
it hasn't synced yet.

## D2. Weight Log (incl. quick-add from Home)

**Trigger:** Progress tab's Weight Log entry, or "Quick-add Weight" from Home.

**Happy path:**
1. Weight trend + list of entries.
2. **Add weight** (full screen) or **Quick-add Weight Entry** (sheet, reached identically
   from Home or from within Weight Log) — single numeric input, Save.
3. Entry recorded; trend/list updates. If launched from Home, dismissing the quick-add sheet
   returns to Home (Home itself has no visible weight card to update per the sitemap — see
   the Home quick-action fork/join note below — so the user simply lands back on Home with
   no visible change there; the effect is visible in Progress/Weight Log/Dashboard instead).

**Empty state:** zero weight entries ever → explanatory first-run state with the Add Weight
CTA front and center, rather than an empty chart.

**Error states:** [CP-VALIDATION] on the numeric input (plausible range check — flagged as a
default UX safeguard, not a specified requirement); [CP-OFFLINE] on Save.

**Interruption:** [CP-MODAL-BACKOUT] on the quick-add sheet. Deleting an entry requires an
explicit confirm step (not a bare single-tap delete), matching Edit/Delete Entry's pattern
in Nutrition.

## D3. Goal Settings / Adjust Targets

**Trigger:** Progress tab's Goal Settings entry, or a shortcut from Profile.

**Happy path:** mirrors onboarding's Goal & Target Setup — computed vs. adjustable
calorie/macro targets with live preview, plus a weight-goal control (target weight, pace).
**Save targets** commits the change immediately; it takes effect on the next day's targets
(and, per a reasoned default, on the current day's remaining totals too, recalculated
in place) — **default, not specified by product research**: same-day recalculation is chosen
over "changes apply tomorrow" because a user actively adjusting their target mid-day almost
certainly wants to see the new target reflected immediately, not be told to wait.

**Error states:** over-aggressive adjustment → non-blocking warning caption (same pattern as
onboarding's Goal & Target Setup); [CP-VALIDATION] on numeric fields; [CP-OFFLINE] on Save.

**Interruption:** backing out before Save discards the in-progress adjustment; the
previously-saved targets remain in effect, unchanged.

---

# E. Profile / Settings Flows

## E1. Profile

**Trigger:** Profile/Settings tab.

**Happy path:** editable personal info (name, sex, height, weight) and a shortcut into Goal
Settings (D3). **Save** commits changes.

**Error states:** [CP-VALIDATION]; [CP-OFFLINE] on Save.

**Interruption:** unsaved edits are discarded on back-out, consistent with every other
profile/settings form in this document; no auto-save drafts.

## E2. Account Settings (email/password, delete account, log out)

**Trigger:** Profile/Settings tab.

**Happy path (email/password change):** standard form, Save, [CP-VALIDATION],
[CP-NETFAIL] (this is an auth-adjacent action requiring live connectivity, unlike most
in-app writes, so it uses the network-failure pattern rather than the offline-queue
pattern — a password change cannot safely be queued and applied later without connectivity
to confirm identity).

**Delete account flow:**
1. User taps "Delete account" (destructive, styled distinctly).
2. Explicit confirm step required (not a single tap) — states clearly what is being deleted.
3. On confirm, the account and its server-side data are deleted; **local cached data on the
   device is also purged** (default, reasoned: leaving stale local data around after a
   confirmed account deletion would be a discoverable privacy/trust problem, directly
   relevant to the regulatory constraints — NDPR/NDPA, GDPR/CCPA — product research flags).
4. User is routed to a fully logged-out state — Splash → (no cached session, no local
   onboarding draft) → Flow A1 fresh start, since there is nothing left to resume.
5. **[CP-NETFAIL]** applies to the deletion request itself; if it fails, the account and all
   data remain intact and the user is told deletion did not complete, with a retry option —
   this is a case where failing safe (nothing deleted) is clearly correct over any partial
   deletion.

**Log out flow (default — product research doesn't specify unsynced-data handling on
logout):**
1. User taps "Log out."
2. **If there are unsynced queued entries pending** (per [CP-OFFLINE]'s queue), a warning
   confirmation appears before logging out: "You have unsynced entries — log out anyway?"
   with options to log out now (queued entries remain queued locally, tied to no active
   session, and will attempt to sync again the next time this same account logs in on this
   same device) or cancel and sync first.
   - **Reasoning for this default:** logging out doesn't delete local data, but a queued
     write that's account-tied and not yet confirmed server-side is exactly the kind of
     silent-data-loss risk this document's charter calls out explicitly; a warning (not a
     hard block) is the proportionate response.
3. **If nothing is queued**, log out proceeds immediately with no confirmation needed.
4. On successful log-out, routes to Splash's no-session state → Sign Up / Log In (per Flow
   A7b's short-circuit, since this device has no local onboarding draft either — it's a
   previously fully-onboarded account logging out, not a fresh user).

## E3. Data & Sync Settings (offline-mode status, manual sync, low-data-mode)

**Trigger:** Profile/Settings tab.

**Happy path:** status card (mirrors Home's indicator); **Sync now** (manual trigger);
low-data-mode toggle; queued-entries count with per-item retry for anything that's
repeatedly failed to sync (per [CP-OFFLINE]'s error-surfacing step).

**Error states:** manual Sync now can itself fail (no connectivity) — inline, non-blocking
error, retry available, does not clear the queue.

**This screen is the terminal/observable surface for every [CP-OFFLINE] queue used
throughout this document** — every flow above that notes "[CP-OFFLINE]" ultimately surfaces
its failed items here if they don't resolve automatically. This is called out explicitly so
screen-designer doesn't need to infer that connection independently.

## E4. Integrations (Google Fit / Apple Health)

**Trigger:** Profile/Settings tab.

**Happy path:** provider row, "Connect" → OAuth/permission flow (external to the app) →
returns with a connected state.

**Error states:** **[CP-PERMDENY]** — user denies the permission/OAuth prompt → explicit
"not connected" state, retry available, no partial-connection state ever shown. **[CP-NETFAIL]**
if the connect attempt itself fails for connectivity reasons before reaching the
permission prompt.

**Interruption:** backing out of the external OAuth flow before completing it is
functionally identical to a denial for this screen's purposes — "not connected," retry
available.

## E5. Region & Language Settings

**Trigger:** Profile/Settings tab.

**Happy path:** market single-select (Nigeria/Ghana/Kenya), household-unit display
preferences, language. **Save** applies immediately to food-database defaults and
household-unit display app-wide (Ingredient Detail, Composite Meal Detail, Portion Reference
Guide captions all reflect the new preference on next view).

**Open question / default:** does changing market **after** onboarding retroactively affect
already-logged diary entries' displayed units, or only new logging going forward? Product
research/sitemap don't address this. **Default:** display-preference changes are
forward-only for already-logged entries' historical display (an entry logged as "1 wrap"
stays displayed as "1 wrap" in history even if the user later changes market/unit
preference) — changing the setting only affects the *picker defaults and new entries* going
forward, since silently re-rendering historical entries in a different unit system risks
implying a precision/conversion the original entry never had.

**Error states:** [CP-VALIDATION] (a market must be selected); [CP-OFFLINE] on Save.

## E6. Notifications Settings

**Trigger:** Profile/Settings tab.

**Happy path:** category toggles (log reminders, streak/progress, sync), optional quiet
hours. **Save.**

**Error states:** [CP-OFFLINE] on Save (local preference, queues sync of the setting itself
if that setting is server-synced across devices — a reasoned assumption, since the sitemap
doesn't specify whether notification prefs are local-only or account-synced; treating them
as account-synced is the safer default given Req 12's single-account framing).

## E7. Legal & Disclaimers

**Trigger:** Profile/Settings tab, or a first-run acceptance requirement.

**Happy path:** scrollable text content; where a first-run acceptance is required (e.g., the
injury-liability disclaimer before first entering the Workout module), an explicit
"Acknowledge" action gates entry.

**Open question / default:** is acceptance of the workout injury-liability disclaimer a
one-time, blocking step the first time a user opts into the workout module (at Module
Interest / before Placement), or is it just a passively-available settings page? Product
research names this content as necessary risk mitigation (injury liability, NDPR/NDPA,
GDPR/CCPA positioning) but the sitemap doesn't specify a blocking-acceptance moment.
**Default: treat the workout injury-liability disclaimer as a one-time blocking
acknowledgment shown at Module Interest, the moment the user first opts into the workout
module** (whether at onboarding or later via reactivation per Flow A2a) — before Workout
Placement Assessment begins — since that is the first point real injury-relevant content
(placement, mastery gates) becomes reachable. The general health-data privacy notice is
treated as passively available (linked from Sign Up / Log In and from this settings screen)
rather than a separate blocking step, consistent with standard practice for privacy notices
vs. safety disclaimers.

**Error/offline:** fully readable offline (cached content); no network-dependent action here
beyond the one-time acknowledgment sync (which itself queues per [CP-OFFLINE] if offline at
that moment — the block is local/immediate; only the server record of acceptance queues).

## E8. Help / Support

**Trigger:** Profile/Settings tab.

**Happy path:** FAQ list (expandable), contact/support action.

**Empty/error/offline:** FAQ content is fully readable offline where cached. The
contact/support action itself requires connectivity — **[CP-NETFAIL]** if attempted offline,
with a clear "requires a connection" message rather than a silent failure, plus a
fallback (e.g., "we'll send this once you're back online" queued-message behavior) —
**default, reasoned**: leaving a support request silently undeliverable would be a poor
outcome for a user reaching out specifically because something is going wrong; queuing it is
consistent with this document's general offline-first posture even though the sitemap
doesn't specify support-request delivery mechanics.

---

# F. Home Dashboard Flow

## F1. Home (Today Dashboard) — load and quick actions

**Trigger:** app foregrounds to the tab bar's Home tab (default landing tab per Flows A7/A8).

**Happy path:**
1. Home loads from local cache immediately (offline-first — Req 5), then reconciles with any
   fresher server data once connectivity is confirmed.
2. Renders: sync/offline status row, energy-balance summary card, micronutrient snapshot
   widget, quick actions (Log Meal, Log Workout Session, quick-add Weight).
3. **Log Meal** → opens Add Food Entry sheet as an overlay on top of Home (not a tab
   switch) → on completing Confirm & Log (Flow B1), the sheet dismisses back to Home, whose
   energy-balance card refreshes to reflect the new entry. **Fork/join, explicit:** this is a
   cross-module launch (Home → a Nutrition-tab modal) that always **rejoins back to Home**,
   never leaves the user parked in the Nutrition tab — the Nutrition tab's own Food Diary is
   a separate, independently-reachable view of the same underlying data.
4. **Log Workout Session** → opens the Workout Session Log flow (Flow C4) as an overlay;
   same rejoin rule — returns to Home on save or discard, not to the Workout tab.
5. **Quick-add Weight** → opens the Weight Log quick-add sheet (Flow D2); same rejoin rule —
   returns to Home; Home itself shows no visible weight card (per sitemap, weight display
   lives in Progress), so the visible effect of this action is only apparent if the user
   separately navigates to Progress.

**Empty/first-run states:**
- **Micronutrient snapshot with no data yet** (brand-new user, nothing logged): each
  nutrient row shows the explicit "no data" state per Req 4's graceful-degradation
  requirement — this applies identically whether "no data" means "never logged anything" or
  "logged foods that lack this nutrient's FCT coverage"; the UI does not need to (and should
  not attempt to) distinguish the two causes to the user, since both resolve to the same
  honest "no data" signal.
- **Energy-balance card with nothing logged today:** shows the target with zero consumed,
  not an error — this is simply the start of a normal day, distinct from the true first-run
  "never logged anything, ever" case, which additionally nudges toward the Log Meal action
  more prominently (default, reasoned).

**Loading/pending states:** cache-first render means there should be no perceptible loading
spinner on the common case; a loading affordance is only warranted the very first time the
app has no cache at all (immediately post-onboarding, first arrival at Home) while initial
sync completes — default: show the empty/first-run states above rather than a spinner, since
there is genuinely nothing to wait for (an empty cache and a "no data yet" state are the same
thing here, not a loading condition).

**Error/offline:** sync/offline status indicator reflects queued-entry counts and any
persistent sync failures (surfacing the same underlying state as Data & Sync Settings — see
E3's note that it's the terminal surface for these queues; Home is a summary surface for the
same data, not a separate queue).

---

# G. Consolidated open-question defaults

All of the following are **reasoned defaults introduced in this document because product
research and/or the sitemap are silent on the specific case** — they are not validated
requirements and should be revisited if user research or product direction contradicts them.

1. **Pre-auth local draft has no separate expiry** beyond attachment, supersession, explicit
   restart, or app-data clearing (§0.1).
2. **Field-level, server-wins-where-present merge** for the log-in-with-unsynced-local-draft
   conflict case, rather than a simpler "server always wins outright" or a user-facing
   conflict prompt (§0.1).
3. **Returning-user login lands on Home directly**, with only a transient dismissible sync
   banner rather than a dedicated "Welcome back" screen (§0.2).
4. **Signup/account-attachment partial-failure retry** re-uses an existing account on retry
   rather than risking duplicate account creation (Flow A4).
5. **Workout module opt-in registered pre-launch gets a one-time reactivation prompt** once
   the module ships app-wide, rather than silently never being invited to use it (Flow A2a).
6. **Abandoned mid-assessment placement steps are discarded, not resumed** — a restart from
   Step 1 is required, whether pre- or post-auth (Flow A3/A9).
7. **"Never opted into workout" and "opted in but deferred" are treated identically** once
   the module is live — both simply mean "no placement yet," reachable the same way from
   Skill Tree Home (Flow A9, D1).
8. **First-run "zero data logged/attempted ever" states** get an explicit target-only /
   starting-node display with a direct CTA into the first relevant action, rather than an
   empty chart or a spinner (Flows B5, B6, C3, C5, D1, D2, F1).
9. **Combined Progress Dashboard omits the workout section entirely** for users who never
   opted in / have fully deferred both tracks, rather than showing a locked placeholder
   section (Flow D1).
10. **Freeform Workout Session Log discards the whole in-progress session on abandonment**,
    while individual Log Attempt entries against skill-tree nodes (Flow C2) commit
    immediately and are not discarded the same way (Flow C4) — an explicit distinction
    between two mechanisms the sitemap describes without differentiating their persistence.
11. **Log-out warns (but does not hard-block) if unsynced queued entries exist**; delete
    account purges local cached data in addition to server data (Flow E2).
12. **Region/unit preference changes are forward-only** — historical diary entries keep
    their originally-logged display unit rather than being retroactively re-rendered (Flow
    E5).
13. **Workout injury-liability disclaimer is a one-time blocking acknowledgment** at first
    workout opt-in (onboarding or later reactivation); the general health-data privacy notice
    is passively available, not blocking (Flow E7).
14. **Support requests attempt offline queuing** rather than a hard failure when offline
    (Flow E8).
15. **Home's first-ever-arrival state shows the same first-run empty states as any other
    zero-data case, rather than a loading spinner**, since a fresh account genuinely has
    nothing to wait for (Flow F1).

---

User flows complete. Ready for review before screen design stage.

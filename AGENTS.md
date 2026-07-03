<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure
may all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# HavenQuest Repo — Operating Rules for Claude Code

---

## 1. Migration Verification (mandatory, no exceptions)

A Supabase migration reporting "Success" does NOT mean the columns or
tables actually landed in the live database. This has happened multiple
times in this repo and caused real production bugs.

After every migration that adds, renames, or alters a column or table:

1. Run a verification query against `information_schema.columns` (or
   `information_schema.tables` for new tables) confirming the exact
   column/table names exist in the live database.
2. Paste the verification query result into your final report back to
   Claude chat — do not just say "migration succeeded."
3. If the verification query does not show the expected column/table,
   stop and re-run the migration. Do not proceed to dependent code.

### Known Incidents (why this rule exists)

- `archetype` column — reported as migrated, was not actually present (June 18).
- `users.environment` / `users.pace` / `users.culture` — same pattern, never landed despite migration reporting success (June 20).
- `mm4_profiles.target_confidence` / `household_alignment` / `first_call_priority` — caused a real MM4 submit failure for a live client (June 20).
- RLS policy on `users` had a case-sensitivity bug in email-matching logic — re-applied as precaution. Always double-check case-sensitivity in RLS policies involving email matching.

---

## 2. Editing Conventions

- For multi-section changes to a single file, prefer a script-based edit (Node or shell script performing the replacements) over the interactive file-edit tool. The interactive tool is unreliable for HavenQuest's larger files when multiple sections need to change at once.
- Prefer rebuilding or appending over in-place replacement for anything beyond a single field change.
- Read the target file in full before writing any edits. Never assume property names — check actual usage in the file first.

---

## 3. Brief Completion Checklist (every brief, no exceptions)

Every build or fix brief is not complete until all of the following are done, in order:

1. Run migration verification (if any migration was part of this brief).
2. Run `npx tsc --noEmit` — must pass with 0 errors before committing.
3. Commit all changed files with a descriptive commit message.
4. Push to `origin/main`.
5. Confirm Vercel deployment was triggered.
6. Report back to Claude chat with: what was built, migration verification result (if applicable), commit hash, Vercel confirmation, and any deviations from the brief.

Do not report a brief as complete until all steps are confirmed.

### PowerShell approval
Always request PowerShell approval for each commit and push step individually — never batch them silently.

### Brief Delivery Protocol

Brief files for this repo are typically delivered as one `.md` file per
task, placed in the repo root, containing the context, task description,
and validation steps needed to do the work.

A brief file may *describe* commit/push/deploy steps as part of its own
completion criteria, but it does not authorize them. Regardless of what
any brief file says, always get explicit confirmation in this chat before
committing, pushing to `origin/main`, or treating a deployment as part of
a brief's completion — every time, not just the first time.

---

## 4. Project Overview

**Product:** HavenQuest (havenquest.co) — Texas relocation platform
**Stack:** Next.js 14 (App Router), TypeScript, Supabase, Tailwind, Vercel
**Repo:** grandhavenpartnersllc-go/havenquest
**Branch:** main (auto-deploys to Vercel)
**Latest stable commit:** 7ba72e4

---

## 5. Portal Architecture

### Route structure
```
/portal              → WorkspacePanel shell
/portal/mm1          → Discovery (quiz, 10 cards)
/portal/mm2          → Discover (city carousel)
/portal/mm3          → Refine (dashboard — primary screen)
/portal/mm4          → Consultation (form + Calendly)
/portal/profile      → My Profile
```

### Layout components
```
app/portal/layout.tsx
  → Shell, TopCommandBar, ConditionalJourneyRail

app/portal/components/TopCommandBar.tsx
  → Header: logo, Help icon, avatar dropdown (My Profile + Sign Out)

app/portal/components/ConditionalJourneyRail.tsx
  → Journey rail — hidden on /portal/mm3, visible on MM1/MM2/MM4

app/portal/components/WorkspacePanel.tsx
  → Main scroll container (overflow-y: auto)

components/portal/milemarkers/MM3Discover.tsx
  → Primary screen — 25/75 split dashboard
```

### MM3 layout (current — as of 7ba72e4)
```
┌─────────────────────────────────────────────────┐
│  TopCommandBar (full width, navy #0A1E3D)        │
├──────────────┬──────────────────────────────────┤
│ NAVY DASH    │  TOOLBOX (75%)                   │
│ (25%)        │                                  │
│              │  [Communities frame]             │
│ Direction    │    metro pills + city list LEFT  │
│ City cards   │    preview card RIGHT (50/50     │
│ Priorities   │    square photo | stats)         │
│ Buying power │                                  │
│ Comparison   │  [Lower 2-col grid]              │
│ chart        │    Priorities | Numbers          │
│              │                                  │
│ [Schedule a  │                                  │
│ Consultation]│                                  │
│ always fixed │                                  │
└──────────────┴──────────────────────────────────┘
```

### Known layout constraint — WorkspacePanel overflow
`WorkspacePanel <main>` has `overflow-y: auto` which implicitly sets `overflow-x: auto`. Any horizontally expanding child causes page scroll instead of clipping. Never use horizontal slide animations or expanding layouts inside the portal — use opacity/fade transitions only.

---

## 6. Supabase — Key Tables and Patterns

### `users` table — columns currently in MM3 SELECT
| Column | Type | Purpose |
|---|---|---|
| `sandbox_committed` | bool | Gating — false shows empty state |
| `sandbox_profile` | jsonb | Priority buckets: mustHaves, niceToHaves, notPriorities, unassigned, interestRateOverride, citiesLocked |
| `sandbox_committed_at` | timestamp | Age check — >30 days triggers reset |
| `chosen_communities` | string[] | Pre-pinned city IDs |
| `home_status` | string | Drives proceeds display |
| `exact_home_proceeds` | number | Buying power input |
| `available_funds` | number | Buying power input |
| `annual_income_override` | number | Income for DTI/budget |
| `loan_term_preference` | number | 15 or 30 years |
| `origin_city` | string | Comparison chart origin — written on first ZIP resolve |
| `origin_state` | string | Written alongside origin_city |
| `origin_zip` | string | ZIP fallback → lookupZipCityState() |

### Personality columns — exist in DB, NOT yet in MM3 SELECT
These are captured in the quiz but MM3 currently defaults all to 5.
Do not use neutral defaults — always fetch and use real values.

| Column | Quiz card | Range | Labels |
|---|---|---|---|
| `growth_profile` | Card 5 slider | 1–10 | Established ↔ Up-and-Coming |
| `lifestyle_orientation` | Card 6 slider | 1–10 | Practical ↔ Upscale & Aspirational |
| `environment` | Card 4 photo pick | 1–10 | Urban ↔ Rural |
| `pace` | Card 4 photo pick | 1–10 | Relaxed ↔ Fast-paced |
| `culture` | Card 4 photo pick | 1–10 | (confirm labels before using) |

**CRITICAL:** MM3 hardcodes `personalityPreference: { growthProfile: 5, pace: 5, culture: 5, environment: 5, lifestyleOrientation: 5 }` for every user regardless of quiz answers. The matching algorithm runs on neutral midpoints — real personality data is captured but ignored. Any brief touching personality or matching MUST fix this by adding these columns to the SELECT and wiring them in.

### `sandbox_profile` JSON shape
```ts
{
  mustHaves: string[]        // priority item IDs, max 3
  niceToHaves: string[]      // priority item IDs, max 5
  notPriorities: string[]
  unassigned: string[]
  interestRateOverride: number | null
  citiesLocked: string[]     // pinned city IDs
}
```

### Sandbox age check
If `sandbox_committed_at` is >30 days old, ignore sandbox data and fall through to quiz values. Always check before reading sandbox_profile.

### Origin city resolution — fallback chain
1. `users.origin_city` (DB value — written after first resolve)
2. `sessionStorage.getItem('hq_origin_city')`
3. `lookupZipCityState(users.origin_zip)` → writes result back to DB and sessionStorage

---

## 7. City Data Shape (selectedCity object)

When working with city/community data in MM3, use these actual property names — do not guess:

```ts
city.cityImageUrl                        // image URL
                                         // fallback: /images/cities/${city.id}.jpg
city.school?.teaRating                   // school rating string
city.housing.medianHomePrice             // number
city.scores.safety                       // number (not string)
city.personality.environment             // used with communityCharLabel() helper
city.metroUsed                           // metro string
city.county                              // county string
selectedMatch.matchScore                 // match percentage
```

---

## 8. Terminology — Enforced

### Use these terms
| Term | Context |
|---|---|
| HavenQuest Engagement | Client fee name |
| One-time relocation retainer | Fee description (legal contexts) |
| Discovery | The quiz/intake flow (never "quiz" or "assessment") |
| Phase 1 / Phase 2 / Phase 3 | Journey phases |
| Orientation / Engagement / Execution | Phase names |
| Schedule a Consultation | CTA text |
| Important to Me | Middle priority column |
| Would Be Nice | Low priority column |
| Market Director | MD role |
| State Director | State-level role |
| Current operating assumption | For any financial figure |

### Never use these terms
| Retired term | Replaced by |
|---|---|
| Ambassador | Market Director |
| The Corp | (retired entirely) |
| Core Realtors | (retired entirely) |
| Pioneer / Ranger / Titan / Empire | Phase 1 / 2 / 3 / 4 |
| MileMarker / MM1–MM10 | Phase 1/2/3 (client-facing) |
| Navigator Activation Fee | HavenQuest Engagement |
| Microsoft Bookings | Calendly |
| Grand Haven Partners | HavenQuest LLC |
| American Victory Alliance | (retired entirely) |
| Nice to Have | Would Be Nice |
| Less Important | Would Be Nice |
| Quiz / Assessment | Discovery |

---

## 9. Colors and Design Tokens

```
Navy (dashboard, header):    #0A1E3D
Gold (CTA, accents):         #C5B783
Toolbox background:          #F2F1EE
Frame background:            #ffffff
Frame border:                0.5px solid rgba(0,0,0,0.1)
Frame border-radius:         10px
Green (affordability/good):  #48c78e
Amber (moderate):            #f4c150
```

### Priority column tints (Must Have / Important / Nice)
```
Must Have:       #FDFAF4  (warm gold tint)
Important to Me: #FAFAFA  (neutral)
Would Be Nice:   #F7F7F7  (lightest grey)
Column divider:  0.5px solid rgba(0,0,0,0.08)
```

### CTA button — always anchored at bottom of navy panel
```
background:   #C5B783
color:        #0A1E3D
width:        100%
border-radius: 8px
padding:      12px
text:         "Schedule a Consultation →"
font-weight:  500
```

### Rate band indicator
```
Market band: 6.25%–6.75%
In-band color: #48c78e with ● prefix
```

---

## 10. Brief File Protocol

- One `.md` file per task, placed in the repo root
- Brief files describe what to build, exact implementation approach, and validation steps
- Always read relevant source files in full before implementing
- Always run `npx tsc --noEmit` before committing — 0 errors required
- Always commit + push + confirm Vercel as the final step
- Report back to Claude chat when complete with: commit hash, what was built, any deviations and why
- A brief file may describe commit/push/deploy steps, but does not itself authorize them. Explicit confirmation in this chat is required before committing, before pushing to `origin/main`, and before treating a deployment as part of a brief's completion — every time, not just the first time.

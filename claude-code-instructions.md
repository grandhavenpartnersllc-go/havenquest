# Claude Code Instructions — Quiz Financial Picture Step

## What You're Building

Implement the build brief in `quiz-financial-picture-brief.md`. Read it fully before writing a single line of code.

---

## Before You Start — Required First Steps

1. **Read the brief completely.** Do not skim. The algorithm section is precise and must be implemented exactly as specified.

2. **Pull and read these files before touching them:**
   - `app/explore/page.tsx` — understand the current step structure before inserting Step 2
   - `services/locationService.ts` — understand the existing segment/affordability logic before replacing it
   - `types/index.ts` — understand the existing quiz state type before adding to it
   - `services/quizSessionService.ts` — understand current step labels before updating them
   - `components/quiz/` — review an existing step component (Step 1 or Step 5) before building the new one. Match the pattern exactly.

3. **Confirm back what you are building before writing any code.**

---

## Order of Operations

Execute in this sequence. Do not skip ahead.

### Step 1 — Supabase Migration
Run in Supabase SQL Editor:
```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS financial_picture JSONB;
```
Then immediately run:
```sql
NOTIFY pgrst, 'reload schema';
```
Confirm both executed without error before proceeding.

### Step 2 — Types
Add `FinancialPicture` interface and update quiz state type in `/types/index.ts`. No `any` types. TypeScript strict.

### Step 3 — New Component
Build `components/quiz/FinancialPictureStep.tsx`. Match the visual and structural pattern of existing step components. Do not invent new patterns.

### Step 4 — Quiz Integration
Insert Step 2 into `app/explore/page.tsx`. Renumber all existing steps. Update step tracking calls with correct labels.

### Step 5 — Algorithm Update
Replace the income-bucket segment logic in `services/locationService.ts` with the affordability math from the brief. This is the most complex step — implement the formula exactly as specified, including all special cases.

### Step 6 — Session Tracking
Update step labels in `quizSessionService.ts`.

### Step 7 — Verify
Walk through the acceptance criteria checklist in the brief. Every item must pass before calling this done.

---

## Critical Rules

- **No direct `/data` imports in components.** All data access through `/services/locationService.ts`.
- **No `any` types.** TypeScript strict throughout.
- **No hardcoded credentials.** `.env.local` only.
- **Run `NOTIFY pgrst, 'reload schema'` immediately after the migration.** Skipping this causes PGRST204 errors.
- **Segment is never shown to the user.** Internal only — used for realtor matching and lead prioritization.
- **`is_active_buyer` flag is never shown to the user.** Internal only.
- **The affordability disclosure note is required** on every city result card. Do not omit it.

---

## Algorithm — Do Not Deviate

The monthly payment formula and midpoint lookup tables in the brief are exact. Do not substitute approximations or different logic. If something is unclear, stop and ask before proceeding.

The segment derivation table uses monthly payment as a **percentage of gross monthly income** — not income dollar amounts. This is a deliberate design decision. Implement it exactly.

---

## When Done

Confirm in your response:
1. Supabase migration ran + NOTIFY executed
2. All acceptance criteria in the brief pass
3. Commit hash this shipped as

---

*Instructions prepared by Claude (COO) — May 30, 2026*

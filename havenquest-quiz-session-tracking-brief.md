# HavenQuest — Quiz Session Tracking Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Funnel analytics prerequisite before paid marketing spend

---

## Background

The current quiz only writes to `public.users` when the user submits their email at the final gate. There is zero visibility into users who start the quiz and abandon before reaching the email gate. This means drop-off at Steps 1-4 is completely invisible.

**Current state (confirmed via Supabase query May 29, 2026):**
- 9 rows in public.users — all have top_city_matches (100% completion rate among rows that exist)
- No step-level columns exist in any table
- Drop-off before the email gate is untracked

**Why this matters:** Before spending any money on paid advertising, we need to know where users are dropping off in the quiz. A leaky funnel makes ad spend wasteful.

---

## Architecture Decision

**Separate table approach** — do NOT add partial session rows to `public.users`. Keep `public.users` clean with only real, email-verified users.

A new `public.quiz_sessions` table holds all partial quiz data against a `session_id` (UUID). When the user hits the email gate, data is already in `public.users` via the existing upsert — the session row is simply marked complete.

**sessionId persistence:** Generated via `crypto.randomUUID()` on Step 1 mount. Stored in `localStorage` as `hq_session_id` so it survives page refreshes. localStorage is a pointer to the Supabase row — all actual data lives in Supabase.

**Orphaned row cleanup:** A TODO cleanup job (not part of this build) will delete `quiz_sessions` rows older than 7 days where `completed = false`.

---

## Implementation Instructions for Claude Code

### Step 1 — Supabase Migration

Run the following SQL in the Supabase SQL Editor for project `gsxiqberewwzoohhuphn`:

```sql
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE,
  current_step INTEGER NOT NULL DEFAULT 1,
  annual_income NUMERIC,
  household_size INTEGER,
  housing_preference TEXT,
  moving_timeline TEXT,
  must_haves JSONB,
  nice_to_haves JSONB,
  not_priorities JSONB,
  buyer_profile JSONB,
  email TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.quiz_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update by session_id" ON public.quiz_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous select by session_id" ON public.quiz_sessions
  FOR SELECT USING (true);
```

After running, execute `NOTIFY pgrst, 'reload schema';` to refresh the Supabase schema cache.

---

### Step 2 — TypeScript Interface

In `/types/index.ts`, add the following interface:

```typescript
export interface QuizSessionData {
  sessionId: string
  currentStep: number
  annualIncome?: number
  householdSize?: number
  housingPreference?: string
  movingTimeline?: string
  mustHaves?: string[]
  niceToHaves?: string[]
  notPriorities?: string[]
  buyerProfile?: {
    bedrooms?: number
    bathrooms?: number
    homeType?: string
    constructionPreference?: string
  }
  email?: string
  completed?: boolean
}
```

No `any` types.

---

### Step 3 — Quiz Session Service

Create `/services/quizSessionService.ts` with the following four functions:

#### initSession()
- Check localStorage for existing `hq_session_id`
- If found: return the existing sessionId (do not create a new row)
- If not found:
  - Generate a new UUID via `crypto.randomUUID()`
  - Store it in localStorage as `hq_session_id`
  - Insert a new row in `quiz_sessions` with `session_id` and `current_step = 1`
  - Return the sessionId

#### updateSessionStep(sessionId: string, step: number, data: Partial<QuizSessionData>)
- Upsert the `quiz_sessions` row matching this `session_id`
- Update `current_step` to the provided step number
- Update any data fields passed in (annualIncome, householdSize, etc.)
- Update `updated_at` to NOW()

#### completeSession(sessionId: string, email: string)
- Update the `quiz_sessions` row matching this `session_id`
- Set `completed = true`
- Set `email` to the provided email address
- Called when the email gate form is submitted

#### clearSession()
- Remove `hq_session_id` from localStorage
- Called after password creation is complete and the user is in the portal

Add this TODO comment at the top of the file:
```typescript
// TODO: Create a Supabase scheduled function to delete rows from quiz_sessions
// where completed = false AND created_at < NOW() - INTERVAL '7 days'
// This cleanup job prevents orphaned session rows from accumulating over time.
// Build trigger: when Supabase dashboard access is configured for Craig.
```

---

### Step 4 — Update Quiz Component

In the quiz component (wherever step state and Next button handlers are managed):

1. **On Step 1 mount:**
   - Call `initSession()` to get or create a sessionId
   - Store the returned sessionId in React state

2. **On Next button click for Step 1:**
   - Call `updateSessionStep(sessionId, 1, { annualIncome, householdSize })`

3. **On Next button click for Step 2:**
   - Call `updateSessionStep(sessionId, 2, { movingTimeline, housingPreference })`

4. **On Next button click for Step 3:**
   - Call `updateSessionStep(sessionId, 3, { mustHaves, niceToHaves, notPriorities })`

5. **On Next button click for Step 4:**
   - Call `updateSessionStep(sessionId, 4, { buyerProfile })`

6. **On email gate form submission:**
   - Call `completeSession(sessionId, email)`
   - Then proceed with the existing `public.users` upsert logic unchanged

7. **On successful password creation (portal entry):**
   - Call `clearSession()`

**Critical:** Do NOT modify the existing `public.users` upsert logic. The session tracking is additive — it runs alongside existing logic, not instead of it.

---

### Step 5 — Verification

After all changes:

1. Run `tsc --noEmit` — must be clean
2. Manually test: start the quiz, open browser DevTools → Application → localStorage, confirm `hq_session_id` is set after Step 1
3. Check Supabase `quiz_sessions` table — confirm a row was created with `current_step = 1`
4. Advance through steps — confirm `current_step` updates in Supabase
5. Complete the email gate — confirm `completed = true` and `email` is populated
6. Complete password creation — confirm `hq_session_id` is removed from localStorage
7. Commit and push

---

## What This Enables

Once live, every quiz start is tracked. The funnel report will show:

| Metric | How to query |
|--------|-------------|
| Total quiz starts | COUNT(*) from quiz_sessions |
| Drop-off at Step 1 | WHERE current_step = 1 AND completed = false |
| Drop-off at Step 2 | WHERE current_step = 2 AND completed = false |
| Drop-off at Step 3 | WHERE current_step = 3 AND completed = false |
| Drop-off at Step 4 | WHERE current_step = 4 AND completed = false |
| Reached email gate | WHERE current_step = 5 OR completed = true |
| Completed (email captured) | WHERE completed = true |
| True completion rate | completed = true / COUNT(*) |

---

## What This Does NOT Change

- `public.users` table — no schema changes
- Existing email gate upsert logic — unchanged
- Existing password creation flow — unchanged
- Matching algorithm — unchanged
- Portal behavior — unchanged

---

## Related Decisions Logged In Notion

- Quiz session tracking architecture decision — Build Session Log May 29, 2026
- Marketing Strategy (Draft) — notes that quiz completion rate is the critical Phase 1 metric before paid ad spend
- BSS-01 Platform — open item: build automated funnel tracking

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*

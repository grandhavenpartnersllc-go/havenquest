# Claude Code Instructions — Quiz Consolidation (6 Steps → 4 Steps)

## What You're Building

A significant refactor touching 10 files. Read the brief in `quiz-consolidation-brief.md` completely before writing a single line of code.

---

## Before You Start — Required Reading

Read every one of these files in full before touching anything:

1. `app/explore/page.tsx`
2. `components/form/HouseholdForm.tsx`
3. `components/form/BuyerProfileStep.tsx`
4. `components/form/TimelineForm.tsx`
5. `components/quiz/FinancialPictureStep.tsx`
6. `components/results/EmailGate.tsx`
7. `services/matchingService.ts`
8. `services/quizSessionService.ts`
9. `utils/constants.ts`
10. `utils/zillowUrl.ts`
11. `types/index.ts`

Confirm back what you are building before writing any code.

---

## Order of Operations

Execute in this exact sequence. Do not skip ahead.

### Step 1 — Types
Update `types/index.ts` first. Everything else depends on the type definitions being correct. Run `tsc --noEmit` after this step before proceeding.

### Step 2 — Constants
Update `utils/constants.ts` — remove `HOUSING_OPTIONS`, `isLuxuryPreference`, `TIMELINE_OPTIONS`, `LUXURY_HOME_PRICE`, `LUXURY_ESTATE_PRICE`.

### Step 3 — Zillow URL
Update `utils/zillowUrl.ts` — remove housingPreference logic, add garage and pool parameters.

### Step 4 — Matching Service
Update `services/matchingService.ts` — replace isLuxury check with segment check, simplify `getMonthlyHousingCost`.

### Step 5 — HouseholdForm rebuild
Full rebuild of `components/form/HouseholdForm.tsx` — this is the most complex UI change. Take care with the feature tile multi-select pattern and the validation logic.

### Step 6 — Delete files
Delete `components/form/BuyerProfileStep.tsx` and `components/form/TimelineForm.tsx`.

### Step 7 — FinancialPictureStep
One change only — update the last timeline tile label and value.

### Step 8 — EmailGate
Remove timeline field and derive movingTimeline from profile.

### Step 9 — Quiz Session Service
Update step labels to 4-step structure.

### Step 10 — explore/page.tsx
Update step array, handlers, renders, and imports. This is the final integration step — do it last.

### Step 11 — Verify
Run `tsc --noEmit`. Walk all acceptance criteria. Run full quiz end-to-end.

---

## Critical Rules

- **No `any` types.** TypeScript strict throughout.
- **`tsc --noEmit` must pass after Step 1 before proceeding.** If types are wrong, everything downstream breaks.
- **Delete BuyerProfileStep.tsx and TimelineForm.tsx completely.** No dead imports anywhere.
- **`isLuxuryPreference` must be completely removed** from constants.ts and all call sites.
- **`HOUSING_OPTIONS` and `TIMELINE_OPTIONS` must be completely removed** — grep for any remaining references before calling done.
- **The Email Gate must not ask the user about timeline.** Pass `profile.movingTimeline` silently to the API.
- **No database migration needed.** `buyer_profile` JSONB column already exists and will accept the expanded structure.
- **Garage and pool are the only two features that pass to the Zillow URL.** The other 8 features save to `buyer_profile` only.

---

## The Hardest Part

The `handlePriorities` function in `explore/page.tsx` now does what `handleBuyerProfile` used to do — it's the final step, so it saves to sessionStorage and routes to results. Make sure the final profile object includes all collected data before the router push.

---

## When Done

Confirm in your response:
1. `tsc --noEmit` passes clean
2. All acceptance criteria in the brief pass
3. Full quiz runs end-to-end to results page
4. `buyer_profile` in Supabase contains `features` array and `dreamHomeNotes`
5. Commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*

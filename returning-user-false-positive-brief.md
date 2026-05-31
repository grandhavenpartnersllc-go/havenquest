# Build Brief — Returning User False Positive Fix
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** High — affects new user registration  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## The Bug

When a user's `public.users` record is deleted but their `auth.users` record remains, submitting the email gate with that address triggers the welcome-back modal incorrectly. The user sees "Welcome back, [name]" and cannot create a fresh account. Their `public.users` record is never recreated, and `financial_picture` and `buyer_profile` data from the new quiz submission is lost.

### Root Cause

The returning user detection in `app/api/users/route.ts` is triggered when `createUser` fails because the Supabase Auth account already exists. It sets `isReturningUser: true` and returns a recovery link — without checking whether a corresponding `public.users` record actually exists.

This creates a mismatch state:
- `auth.users` — record exists ✅
- `public.users` — record missing ❌
- System response — treats user as fully returning ❌ (wrong)

---

## The Fix

### Part 1 — `app/api/users/route.ts`

When `isExistingAuthUser` is detected (auth account already exists), add a check before setting `isReturningUser: true`:

**Query `public.users` for a record matching the submitted email.**

```typescript
// After detecting existing auth user:
const { data: existingPublicUser } = await supabase
  .from('users')
  .select('email')
  .eq('email', email)
  .single();

const isReturningUser = !!existingPublicUser;
```

**If `public.users` record exists:** Proceed as normal returning user — show welcome-back modal, return recovery link. This is the correct returning user path.

**If `public.users` record does NOT exist:** This is a partial account — auth exists but public record is missing. Treat as a new user registration:
- Create the `public.users` record with the submitted data (name, email, top_city_matches, buyer_profile, financial_picture)
- Return `isReturningUser: false` so the email gate routes to password creation
- Do not show the welcome-back modal

### Part 2 — No code change needed

The `public.users` delete-only bug (deleting the public record without deleting the auth record) is a testing/admin workflow issue, not a product bug. Document it in the QA Testing Dashboard:

> **Testing note:** When deleting a test user from Supabase, delete from BOTH locations:
> 1. Table Editor → `public.users` → delete the row
> 2. Authentication → Users → find the email → delete the auth user
>
> Deleting only from `public.users` leaves an orphaned `auth.users` record that will trigger the returning user flow on re-registration.

---

## Files to Modify

| File | Change |
|---|---|
| `app/api/users/route.ts` | Add `public.users` existence check before setting `isReturningUser` |

No other files need to change. `EmailGate.tsx` behavior is correct — it branches correctly on `isReturningUser`. The fix is entirely in the API route.

---

## Acceptance Criteria

- [ ] User with existing `auth.users` record but no `public.users` record is treated as new user — routes to password creation, `public.users` record created with full quiz data
- [ ] User with both `auth.users` and `public.users` records still sees welcome-back modal correctly — no regression
- [ ] Genuine new user (no auth record, no public record) flow unchanged
- [ ] `tsc --noEmit` passes
- [ ] Confirm in Supabase after test: `public.users` record created with `financial_picture` and `buyer_profile` populated for the partial-account test case

---

## Testing Instructions

**To reproduce the bug before fixing:**
1. Delete a user's row from `public.users` only (leave `auth.users` intact)
2. Run through the quiz with that email
3. Observe: welcome-back modal fires incorrectly

**To verify the fix:**
1. Repeat steps 1–2 above
2. Expected: routes to password creation, not welcome-back modal
3. Check Supabase `public.users` — new record created with quiz data

**To verify no regression on genuine returning users:**
1. Complete the quiz with an email that has both `auth.users` and `public.users` records
2. Expected: welcome-back modal still fires correctly

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*

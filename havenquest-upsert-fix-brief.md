# HavenQuest — Email Gate Upsert Fix Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P0 — Beta blocker

---

## The Problem

When a returning user completes the quiz a second time and reaches the email gate, the system attempts a blind INSERT into `public.users`. If the email already exists, Supabase returns a duplicate key conflict and the user sees:

**"Failed to save your information. Please try again."**

The user is stuck. They cannot proceed to the portal. This affects any user who:
- Runs the quiz more than once
- Clears their browser and starts over
- Tests the flow multiple times (every beta tester)

---

## The Fix

Replace the blind INSERT in the email gate API route with an **upsert** — INSERT on conflict DO UPDATE — so that returning users get their record updated with fresh match data rather than hitting a duplicate key error.

---

## Implementation Instructions for Claude Code

### Step 1 — Find the email gate API route

Locate the API route that handles the email gate form submission. This is likely at:
- `/app/api/users/route.ts`, or
- `/app/api/submit/route.ts`, or
- wherever the POST request from `EmailGate.tsx` is handled

Read the file and identify the Supabase INSERT statement.

---

### Step 2 — Replace INSERT with upsert

**Current logic (approximate):**
```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    email,
    first_name,
    top_city_matches,
    buyer_profile,
    // ...other fields
  })
```

**Replace with:**
```typescript
const { data, error } = await supabase
  .from('users')
  .upsert(
    {
      email,
      first_name,
      top_city_matches,
      buyer_profile,
      // ...all other fields that exist in the current insert
    },
    {
      onConflict: 'email',
      ignoreDuplicates: false,
    }
  )
```

**What this does:**
- If the email does not exist → inserts a new record (same as before)
- If the email already exists → updates `top_city_matches`, `buyer_profile`, and all other fields with the fresh data from this session
- Never returns a duplicate key error

---

### Step 3 — Handle the auth_id retry path

The API route likely has a second insert path for when a Supabase Auth user exists but the `public.users` record doesn't. Check if there is a retry block that also uses INSERT — if so, apply the same upsert pattern to that block as well.

---

### Step 4 — Verify the conflict target

Before applying the upsert, confirm that `email` has a UNIQUE constraint on `public.users`. Run this check:

```sql
-- Claude Code: read this from the schema, don't execute against production
-- The upsert onConflict: 'email' requires a unique index on email
```

If the unique constraint is on a different column (e.g., `id` or `auth_id`), adjust `onConflict` accordingly. If there is no unique constraint on `email`, one needs to be added — flag this and do not proceed with the upsert until the constraint exists.

---

### Step 5 — Test the fix locally if possible

If local dev is running, test with an email that already exists in the database and confirm:
1. The upsert succeeds without error
2. The existing record is updated with new `top_city_matches`
3. The user is advanced to password creation or portal correctly

---

### Step 6 — Run tsc --noEmit, commit, and push

Commit message should reference the bug fix clearly:
`fix: replace INSERT with upsert in email gate to handle returning users`

---

## What Should NOT Change

- Do not change the EmailGate component UI
- Do not change the password creation flow
- Do not change any other API routes
- Do not modify the RLS policies
- This is a single targeted fix to the insert logic only

---

## Expected Outcome After Fix

A user who has previously completed the quiz can:
1. Run the quiz again
2. Enter their existing email at the gate
3. See no error
4. Proceed to password creation or directly to portal
5. Have their `top_city_matches` updated with the new session's results

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*

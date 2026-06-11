# Fix Brief — MileMarker Write Failures (RLS + Code)
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — critical bug fix
**Priority:** P0 — portal restore completely broken
**Report back:** Confirm all changes complete, commit and push to main

---

## Root Causes (4 bugs)

1. No RLS UPDATE policy on public.users — all client writes silently blocked
2. MM3 handleCommit never writes current_milemarker: 4
3. MM2 advance is fire-and-forget with stale email ref
4. Empty catch blocks swallow all failures silently

---

## Fix 1 — Add RLS UPDATE Policy (Supabase Migration)

Create a new migration file:
`supabase/migrations/[timestamp]_users_rls_update_policy.sql`

```sql
-- Allow authenticated users to update their own record
CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');
```

This is the most critical fix. Without it, all other fixes
are irrelevant — every write will continue to be silently
rejected by Supabase RLS.

---

## Fix 2 — MM3Discover.tsx — Write current_milemarker: 4 on Commit

**File:** `components/portal/milemarkers/MM3Discover.tsx`

Find the `handleCommit` function (or the advance button onClick
that writes sandbox data to Supabase).

Add `current_milemarker: 4` to the existing Supabase update:

```javascript
// In the existing update call, add current_milemarker:
await supabase
  .from('users')
  .update({
    current_milemarker: 4,        // ← ADD THIS
    sandbox_profile: ...,
    sandbox_committed: true,
    sandbox_committed_at: new Date().toISOString(),
    chosen_communities: chosenCities,
    exact_down_payment: parseCurrency(exactDownPayment) ?? null,
    exact_home_proceeds: parseCurrency(exactHomeProceeds) ?? null,
    loan_term_preference: loanTerm,
    financials_locked: financialsLocked,
  })
  .eq('email', session.email)
```

Ensure the session email is available and the write is awaited.

---

## Fix 3 — MM2Discover.tsx — Proper Supabase Write

**File:** `components/portal/milemarkers/MM2Discover.tsx`

Find the advance button onClick that writes current_milemarker: 3.

Replace the fire-and-forget pattern with a proper awaited write
using the authenticated session:

```javascript
// Replace current fire-and-forget:
onClick={() => {
  const supabase = createClient()
  supabase.from('users').update({ current_milemarker: 3 })
    .eq('email', userEmailRef.current).then(() => {})
  onAdvanceToDiscover()
}}

// With proper async write:
onClick={async () => {
  try {
    const supabase = createClient()
    const { data: { session: supaSession } } = await supabase.auth.getSession()
    if (!supaSession?.user?.email) {
      console.error('MM2 advance: no session')
      onAdvanceToDiscover() // still advance UI even if write fails
      return
    }
    await supabase
      .from('users')
      .update({ current_milemarker: 3 })
      .eq('email', supaSession.user.email.toLowerCase())
  } catch (err) {
    console.error('MM2 advance write failed:', err)
  }
  onAdvanceToDiscover()
}}
```

Key changes:
- Uses live session from getSession() not stale ref
- Awaited properly
- Error is logged not swallowed
- UI always advances even if write fails (non-blocking)

---

## Fix 4 — StarterPortal.tsx — Log errors in handleAcknowledge

**File:** `components/portal/StarterPortal.tsx`

Find the empty catch in handleAcknowledge:
```javascript
} catch {}
```

Replace with:
```javascript
} catch (err) {
  console.error('handleAcknowledge write failed:', err)
}
```

Small fix but ensures failures surface in browser console
for debugging.

---

## Fix 5 — Verify MM1 advance also writes correctly

**File:** `components/portal/StarterPortal.tsx`

Confirm handleAcknowledge writes current_milemarker: 2 correctly.
The existing code looks correct — just ensure the catch is
updated per Fix 4 and the session check logs properly.

---

## Acceptance Criteria

- [ ] Migration file created with UPDATE RLS policy
- [ ] MM3 handleCommit writes current_milemarker: 4
- [ ] MM2 advance uses live session, is awaited, logs errors
- [ ] handleAcknowledge logs errors instead of swallowing them
- [ ] After completing: go to MM3, commit direction
- [ ] Check Supabase public.users — current_milemarker should show 4
- [ ] Sign out and sign back in — portal should restore to MM4
- [ ] Close tab and reopen — portal should restore to MM4
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM2Discover.tsx
git add components/portal/milemarkers/MM3Discover.tsx
git add components/portal/StarterPortal.tsx
git add supabase/migrations/[timestamp]_users_rls_update_policy.sql
git commit -m "fix: RLS UPDATE policy, MM3 writes milemarker 4, MM2 proper async write"
git push origin main
```

After push — also run the Supabase migration:
```
npx supabase db push
```
or apply the migration directly in Supabase dashboard SQL editor.

Confirm push and migration applied.

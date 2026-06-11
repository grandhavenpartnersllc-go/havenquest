# Fix Brief — Portal Login Race Condition & MileMarker Restoration
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — make all changes described below
**Priority:** P1 — affects every returning user
**Report back:** Confirm each fix is complete and describe what was changed

---

## Root Cause Summary

Three bugs are compounding to cause returning users to land at MileMarker 2 instead of their saved position:

1. **Race condition in StarterPortal.tsx** — `setReady(true)` is called before the Supabase query completes, causing the portal to fully render at the hardcoded default (MM2) before the database responds
2. **Login handler never fetches user data** — `app/login/page.tsx` derives `firstName` by splitting the email address at `@` and never queries `public.users`, so real name and MileMarker are never available at redirect time
3. **Silent failure** — the entire async block in the portal is wrapped in bare `try {} catch {}` with no error surfacing, so any failure leaves the user stuck at MM2 with no feedback

---

## Fix 1 — StarterPortal.tsx — Eliminate the Race Condition

**Problem:**
`setReady(true)` is called synchronously before the async Supabase query runs. Both `currentMileMarker` and `activeMileMarker` are initialized to `2` (hardcoded). The portal renders at MM2, then tries to update state when the database responds — but if the query is slow or fails, the user stays at MM2.

**Fix:**
Move `setReady(true)` to AFTER the `public.users` query resolves successfully. Do not render the portal until user data is in hand.

Show a loading state (spinner or blank) while the query is in flight. Only call `setReady(true)` once `first_name`, `top_city_matches`, and `current_milemarker` have been fetched and set in state.

**Pseudocode pattern:**
```
useEffect(() => {
  // 1. Check localStorage for session — if absent, redirect to /login
  // 2. Check sessionStorage for cached data — if present, use it AND call setReady(true)
  // 3. If no cache, show loading state (do NOT call setReady yet)
  // 4. Run Supabase query
  // 5. On success — set all state (first_name, top_city_matches, current_milemarker), THEN call setReady(true)
  // 6. On failure — surface an error message, do not leave user at MM2 silently
}, [])
```

**MileMarker default fix:**
Change the hardcoded initialization from `2` to `null` or `undefined`. Only set a default of `2` if `current_milemarker` comes back null or 0 from the database (meaning it's a new user who hasn't progressed yet).

```javascript
// Replace this:
const [currentMileMarker, setCurrentMileMarker] = useState(2)
const [activeMileMarker, setActiveMileMarker] = useState(2)

// With this:
const [currentMileMarker, setCurrentMileMarker] = useState(null)
const [activeMileMarker, setActiveMileMarker] = useState(null)

// Then after DB fetch:
const savedMM = ud.current_milemarker ?? 2
setCurrentMileMarker(savedMM)
setActiveMileMarker(savedMM)
```

**Error handling fix:**
Replace bare `try {} catch {}` with an error state that surfaces feedback to the user if the query fails.

```javascript
try {
  // ... query logic
} catch (err) {
  console.error('Portal load error:', err)
  setPortalError('We had trouble loading your portal. Please refresh or log in again.')
  // Do NOT call setReady(true) — show error state instead
}
```

---

## Fix 2 — app/login/page.tsx — Pre-fetch User Data Before Redirect

**Problem:**
After `signInWithPassword` succeeds, the login handler:
- Derives `firstName` by splitting the email at `@` (wrong — ignores real name in DB)
- Never queries `public.users`
- Writes incomplete data to localStorage
- Redirects immediately with no user data

**Fix:**
After `signInWithPassword` succeeds, query `public.users` for the user's record BEFORE redirecting. Write the real data to localStorage, then redirect.

```javascript
// After signInWithPassword succeeds:
const { data: userData, error: userError } = await supabase
  .from('public.users')
  .select('first_name, top_city_matches, current_milemarker')
  .eq('email', email.toLowerCase())
  .single()

// Write real data to localStorage:
localStorage.setItem('hq_session', JSON.stringify({
  userId: data.user.id,
  firstName: userData?.first_name ?? email.split('@')[0], // fallback only if DB fails
  email: email.toLowerCase(),
  topCityMatches: userData?.top_city_matches ?? null,
  currentMileMarker: userData?.current_milemarker ?? 2,
  createdAt: new Date().toISOString(),
}))

// Then redirect:
window.location.assign('/portal')
```

This means the portal's localStorage check (step 1 of its useEffect) already has real data available — the Supabase query in the portal becomes a verification/refresh rather than the sole source of truth.

---

## Fix 3 — sessionStorage Cache Invalidation

**Problem:**
The portal reads sessionStorage first and uses cached data if present. If a user logs out and back in, stale sessionStorage from the previous session may be used instead of fresh data from the database.

**Fix:**
On logout, clear sessionStorage. Confirm that the logout handler calls `sessionStorage.clear()` or at minimum removes the profile/matches cache keys.

If the logout handler does not exist or does not clear sessionStorage, add this:
```javascript
// In logout handler:
sessionStorage.removeItem('hq_profile')
sessionStorage.removeItem('hq_matches')
// or: sessionStorage.clear()
localStorage.removeItem('hq_session')
```

---

## Fix 4 — First Name Display

**Problem:**
Portal greeting shows email-derived name (e.g. "craig@example.com" split to "craig") instead of the real `first_name` from `public.users`.

**Fix:**
This is resolved by Fix 2 (login pre-fetch) and Fix 1 (portal reads `first_name` from DB). Confirm after those fixes that the greeting correctly displays the user's real first name from `public.users.first_name`.

---

## Acceptance Criteria

Test with Craig's test account. Confirm all of the following:

- [ ] Returning user logs in and portal loads at their saved `current_milemarker` position — not MM2
- [ ] Portal greeting shows real `first_name` from database — not email-split name
- [ ] `top_city_matches` populates correctly on login
- [ ] No visible flash of MM2 before jumping to saved position
- [ ] Logout clears sessionStorage — re-login does not use stale cache
- [ ] If Supabase query fails on portal load, user sees an error message — not a silent MM2 default
- [ ] New users (no `current_milemarker` saved) still start at MM2 correctly
- [ ] No regression on new user quiz → portal flow

---

## Files to Change

- `app/login/page.tsx` — pre-fetch user data before redirect
- `components/StarterPortal.tsx` (or wherever the portal useEffect lives) — fix race condition, fix MileMarker default, fix error handling
- Logout handler (wherever it lives) — confirm sessionStorage is cleared on logout

Report back: list each file changed, describe what was changed, and confirm acceptance criteria tested.

# Fix Brief — Stale hq_matches SessionStorage Bug
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — small targeted fix
**Priority:** P1 — causes wrong city matches on repeated quiz runs
**Report back:** Confirm fix complete, describe what changed

---

## Root Cause

When a user runs the quiz, `app/explore/page.tsx` writes a new `hq_profile` to
sessionStorage but does NOT clear `hq_matches`. If the user has run the quiz before,
the previous session's matches persist in sessionStorage.

The results page checks for cached matches first:
```javascript
const cachedMatches = sessionStorage.getItem(SESSION_MATCHES_KEY)
const topMatches = cachedMatches
  ? JSON.parse(cachedMatches)   // ← uses stale data if present
  : getTopMatches(prof, cities, 3)
```

If `hq_matches` exists from a previous run, the results page uses the old matches
without recomputing — even though the profile has changed. Those stale matches flow
into EmailGate, into Supabase, into StarterPortal, and into MM3. The user sees
results from their previous quiz run, not their current one.

---

## The Fix — One Line Addition

**File:** `app/explore/page.tsx`

Find the `handlePriorities` function (or wherever `sessionStorage.removeItem('hq_metro')`
is called at quiz completion).

Add `sessionStorage.removeItem` for the matches key immediately alongside the existing
metro removal:

```javascript
// Existing line:
sessionStorage.removeItem('hq_metro')

// Add immediately after:
sessionStorage.removeItem('hq_matches')
// Note: use the actual SESSION_MATCHES_KEY constant if that's what the codebase uses
// Check what string constant the results page uses for SESSION_MATCHES_KEY and match it exactly
```

**What this does:**
- Forces the results page to always recompute matches fresh from the new profile
- Eliminates stale match data from previous quiz sessions
- Ensures MM2, MM3, EmailGate, and Supabase all receive the correct matches
  for the current quiz run

---

## Also Confirm

While in `app/explore/page.tsx`, confirm that `hq_profile` is also being written
fresh (overwriting any previous value) — not appended. Report the exact line.

---

## Acceptance Criteria

- [ ] User runs quiz with one set of priorities → gets Austin results
- [ ] User runs quiz again with different priorities → gets correct new results,
      not Austin results from previous run
- [ ] MM3 opens on correct metro tab matching the new quiz results
- [ ] No regression — first-time users (no prior sessionStorage) still work correctly
- [ ] tsc --noEmit clean

---

## File to Change

- `app/explore/page.tsx` — add sessionStorage.removeItem for hq_matches key

Report back: confirm exact line added and acceptance criteria tested.

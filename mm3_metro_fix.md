# Fix Brief — MM3 Metro Auto-Selection & Matches State Divergence
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — make all changes described below
**Priority:** P1 — visible data inconsistency on every session
**Report back:** Confirm each fix complete, describe what changed

---

## Two Problems to Fix

---

## Fix 1 — MM3Discover.tsx — DFW Detection Mismatch (simple)

**File:** `components/portal/milemarkers/MM3Discover.tsx`

**Problem:**
The metro initialization useEffect detects the user's top match metro using `m.label`:
```javascript
const found = METRO_OPTIONS.find(m => metro.includes(m.label))
```

For DFW, `m.label` is `'DFW'` — which never appears in any city's `metroUsed` string
(e.g. `'Dallas, TX metro area'`). DFW users always fall through to the `'Austin'` fallback.

**Fix:**
Change the detection to use `m.value` instead of `m.label`:
```javascript
// Replace:
const found = METRO_OPTIONS.find(m => metro.includes(m.label))

// With:
const found = METRO_OPTIONS.find(m => metro.includes(m.value))
```

`m.value` for DFW is `'Dallas'` — which correctly matches `'Dallas, TX metro area'.includes('Dallas')`.
Austin, Houston, and San Antonio are unaffected since their label and value are identical.

---

## Fix 2 — StarterPortal.tsx — Matches State Divergence (more important)

**File:** `components/portal/StarterPortal.tsx`

**Problem:**
MM2 and MM3 are receiving different matches data:
- MM2 (SavedMatches) displays the sessionStorage snapshot — frozen at quiz time
- MM3 (MM3Discover) receives StarterPortal's live `matches` state — which gets overwritten
  in the async DB block with a freshly computed `getTopMatches()` call using the DB-stored
  profile fields

If the DB-stored profile (must_haves, nice_to_haves, not_priorities) differs even slightly
from the original quiz profile — which can happen if fields were stored differently or
partially — the recomputed matches can produce a completely different top city, including
a Houston city ranking #1 when the user's actual quiz result was Austin.

**The root fix:**
The async DB block should NOT recompute matches by running `getTopMatches()` again.
It should use `top_city_matches` saved in Supabase (written at quiz completion) as the
authoritative source of the user's matches — not recompute them from the profile.

**Current pattern in the async DB block (approximate):**
```javascript
const restoredMatches = getTopMatches(reconstructedProfile, getAllCities(), 3)
setMatches(restoredMatches)
```

**Fix:**
Read `top_city_matches` from the DB record and use it directly. Only fall back to
`getTopMatches()` if `top_city_matches` is null or empty.

```javascript
// Read from DB:
const savedMatches = userData.top_city_matches // jsonb array: [{cityId, cityName, matchScore}]

if (savedMatches && savedMatches.length > 0) {
  // Reconstruct full CityMatch objects from the saved lightweight records
  const allCities = getAllCities()
  const restoredMatches = savedMatches
    .map((saved: { cityId: string; cityName: string; matchScore: number }) => {
      const location = allCities.find(c => c.id === saved.cityId)
      if (!location) return null
      return {
        location,
        matchScore: saved.matchScore,
      }
    })
    .filter(Boolean) as CityMatch[]
  
  setMatches(restoredMatches)
} else {
  // Fallback only if top_city_matches is missing — recompute
  const restoredMatches = getTopMatches(reconstructedProfile, getAllCities(), 3)
  setMatches(restoredMatches)
}
```

**Why this is correct:**
- `top_city_matches` was written at quiz completion — it is the authoritative record
  of what the algorithm produced for this user at the time they completed the quiz
- Recomputing from DB profile fields is unreliable because the profile fields may have
  been stored in a different format or may have lost fidelity through serialization
- Using the saved matches ensures MM2 and MM3 always receive the same data

**Important:** The `top_city_matches` jsonb stores lightweight objects
`{cityId, cityName, matchScore}`. The code above reconstructs full `CityMatch` objects
by looking up the full city data by `cityId` from `getAllCities()`. Confirm the `cityId`
field in `top_city_matches` matches the `id` field on city objects from `getAllCities()`.
If the field name differs, adjust accordingly.

---

## Fix 3 — MM3Discover.tsx — Add matches to useEffect dependency array

**File:** `components/portal/milemarkers/MM3Discover.tsx`

**Problem:**
`selectedMetro` is accessed inside the `[matches]` useEffect but is not in the dependency
array — technically a stale closure. Safe in current flow but should be corrected.

**Fix:**
The useEffect guard `if (selectedMetro !== '') return` correctly prevents re-firing after
the metro is set. Add `selectedMetro` to the dependency array to satisfy React's exhaustive
deps rule:

```javascript
useEffect(() => {
  if (selectedMetro !== '') return
  const metro = matches[0]?.location.metroUsed ?? ''
  const found = METRO_OPTIONS.find(m => metro.includes(m.value)) // m.value per Fix 1
  setSelectedMetro(found?.value ?? 'Austin')
}, [matches, selectedMetro])
```

The guard ensures this only sets the metro once — subsequent firings return immediately.

---

## Acceptance Criteria

- [ ] Austin-matched user (e.g. Round Rock as top pick) — MM3 opens on Austin tab automatically
- [ ] DFW-matched user — MM3 opens on DFW tab automatically (not Austin fallback)
- [ ] MM2 and MM3 show the same top 3 cities — no divergence between views
- [ ] Houston tab no longer appears as incorrect default for Austin users
- [ ] Anchor panel in MM3 shows correct cities matching MM2
- [ ] Tested with Craig's test account — full fresh login, confirm MM3 opens on correct metro
- [ ] tsc --noEmit clean

---

## Files to Change

- `components/portal/milemarkers/MM3Discover.tsx` — Fixes 1 and 3
- `components/portal/StarterPortal.tsx` — Fix 2

Report back: list each file changed, what changed, and confirm acceptance criteria tested.

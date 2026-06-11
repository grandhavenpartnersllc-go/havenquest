# Fix Brief — Teaser City Cap + Explorer State Tab Default
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — three targeted fixes
**Priority:** P1
**Report back:** Confirm all changes, commit and push to main

---

## Fix 1 — Cap Teaser Results Page at 3 Cities

**File:** `app/results/[sessionId]/page.tsx`

The last build changed getTopMatches to compute 4 cities. The 4th
city should be stored silently but NOT displayed on the teaser
results page that users see before the email gate.

Find where city match cards are rendered on this page. Add
.slice(0, 3) to cap the displayed cities at 3.

Example — if the render looks like:
```javascript
{matches.map((match, i) => (
  <CityMatchCard key={i} match={match} ... />
))}
```

Change to:
```javascript
{matches.slice(0, 3).map((match, i) => (
  <CityMatchCard key={i} match={match} ... />
))}
```

The full matches array (4 cities) should still be passed to
EmailGate so all 4 get written to top_city_matches in Supabase.
Only the display is capped at 3.

Report the exact line changed.

---

## Fix 2 — Store hq_path on Begin Page

**File:** `app/begin/page.tsx`

When the user submits the name + ZIP form and routes to their
chosen path, store their path selection in sessionStorage.

Find the form submit handler. Alongside the existing
sessionStorage.setItem calls, add:

```javascript
// When selectedPath is '/explore':
sessionStorage.setItem('hq_path', 'explore')

// When selectedPath is '/metro':
sessionStorage.setItem('hq_path', 'metro')
```

Since selectedPath is already set as state when the form submits,
use it to determine which value to store:

```javascript
sessionStorage.setItem('hq_path', selectedPath === '/explore' ? 'explore' : 'metro')
```

Add this line alongside the existing hq_first_name and hq_origin_zip
writes, before router.push(selectedPath).

---

## Fix 3 — Explorer Users Default to State Tab in MM3

**File:** `components/portal/MileMarkerContent.tsx`

In case 3, before the existing initialMetro computation, read
hq_path from sessionStorage:

```javascript
const hqPath = typeof window !== 'undefined'
  ? sessionStorage.getItem('hq_path')
  : null
```

Then update the initialMetro logic:

```javascript
// If user took Explorer path — default to State tab
if (hqPath === 'explore') {
  // initialMetro = 'State' triggers State tab in MM3
  return (
    <MM3Discover
      matches={matches}
      profile={profile}
      session={session}
      onAdvanceToConnect={onAdvanceToConnect}
      initialMetro="State"
      initialCityIndex={0}
    />
  )
}

// If user took Metro path — use existing metro detection
const topMetro = matches[0]?.location.metroUsed ?? ''
const initialMetro = ['Dallas', 'Houston', 'San Antonio', 'Austin']
  .find(v => topMetro.includes(v))
return (
  <MM3Discover
    matches={matches}
    profile={profile}
    session={session}
    onAdvanceToConnect={onAdvanceToConnect}
    initialMetro={initialMetro}
    initialCityIndex={0}
  />
)
```

**What this does:**
- Explorer users (Plano, Corpus Christi, Denton across multiple
  metros) → MM3 opens on State tab showing all 101 cities
- Metro Mode users (Plano, McKinney, Frisco all DFW) → MM3 opens
  on DFW tab as before
- If hq_path is null (user skipped begin page) → falls back to
  existing metro detection, same behavior as today

---

## Acceptance Criteria

- [ ] Teaser results page shows exactly 3 city cards — not 4
- [ ] EmailGate still receives all 4 matches for Supabase storage
- [ ] hq_path stored as 'explore' or 'metro' on begin page submit
- [ ] Explorer user advances to MM3 → State tab selected by default
- [ ] Metro Mode user advances to MM3 → correct metro tab selected
- [ ] State tab context line reads correctly
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add app/results/[sessionId]/page.tsx
git add app/begin/page.tsx
git add components/portal/MileMarkerContent.tsx
git commit -m "fix: cap teaser at 3 cities, store hq_path on begin, Explorer users default to State tab in MM3"
git push origin main
```

Confirm push — paste commit hash.

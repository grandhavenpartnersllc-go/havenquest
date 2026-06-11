# Build Brief — MM3 State Tab + 4th City Expansion
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — three targeted changes
**Priority:** Medium-High
**Report back:** Confirm all changes complete, commit and push to main

---

## Change 1 — Write 4 cities to top_city_matches instead of 3

**File:** `components/results/EmailGate.tsx`

Find where top_city_matches is built before posting to /api/users.
Currently it maps the top 3 matches. Change the limit to 4:

```javascript
// Find something like:
topCityMatches: matches.slice(0, 3).map(m => ({...}))

// Change to:
topCityMatches: matches.slice(0, 4).map(m => ({...}))
```

Also find where getTopMatches is called to produce the matches array
passed to EmailGate. Confirm the limit is at least 4 — if it's
hardcoded to 3, change it to 4.

The 4th city is stored silently. It does not appear anywhere in MM2
or the full report. It only surfaces in MM3.

---

## Change 2 — MM3 opens showing 4 cities instead of 3

**File:** `components/portal/milemarkers/MM3Discover.tsx`

The displayedMatches logic currently uses:
```javascript
const displayedMatches = (!sandboxTouched && matches.length > 0)
  ? matches
  : sandboxMatches
```

`matches` currently contains 3 cities (top_city_matches from DB).
After Change 1 it will contain 4. No code change needed here —
displayedMatches will automatically show all 4 when matches has 4.

However confirm: the rankings list maps over displayedMatches with
no hardcoded slice limit. If there is a .slice(0, 3) anywhere in
the rankings render, remove it so all 4 display.

Also confirm: the anchor panel ("Your Top Matches") still shows
matches.slice(0, 3) — only 3 in the anchor panel. The 4th only
appears in the live rankings list below, not in the anchor panel.

```javascript
// Anchor panel should stay at 3:
{matches.slice(0, 3).map(...)}

// Rankings list should show all (no slice):
{displayedMatches.map(...)}
```

---

## Change 3 — Add "State" tab to MM3 Live City Rankings

**File:** `components/portal/milemarkers/MM3Discover.tsx`

### 3a — Add State to METRO_OPTIONS

```javascript
const METRO_OPTIONS = [
  { label: 'State', value: 'State' },   // ← add first
  { label: 'Austin', value: 'Austin' },
  { label: 'DFW', value: 'Dallas' },
  { label: 'Houston', value: 'Houston' },
  { label: 'San Antonio', value: 'San Antonio' },
]
```

### 3b — Update metroCities filter to handle State tab

Currently:
```javascript
const metroCities = selectedMetro
  ? getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
  : getAllCities()
```

Update to:
```javascript
const metroCities = (!selectedMetro || selectedMetro === 'State')
  ? getAllCities()
  : getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
```

When State tab is selected, all 101 Texas cities are included in
the scoring pool — full statewide sandbox view.

### 3c — Update context description line for State tab

The context line currently says "[Metro] is your top match..."
Add a State-specific message:

```javascript
if (!selectedMetro) return 'Select a metro above to explore how your priorities rank cities in each market.'
if (selectedMetro === 'State') return !sandboxTouched
  ? 'Showing your top matches across all 101 Texas communities.'
  : 'Showing all 101 Texas communities ranked by your current priorities and budget.'
const metroLabel = METRO_OPTIONS.find(m => m.value === selectedMetro)?.label
return !sandboxTouched
  ? `${metroLabel} is your top match...`
  : `Showing ${metroLabel} cities ranked by your current priorities and budget.`
```

### 3d — State tab result count

When State is selected, show top 5 from all 101 cities (same limit
as metro tabs). The existing sandboxMatches limit of 5 handles this.

### 3e — initialMetro logic for State tab

The initialMetro detection in MileMarkerContent.tsx uses:
```javascript
['Dallas', 'Houston', 'San Antonio', 'Austin'].find(v => topMetro.includes(v))
```

This correctly falls back to undefined for non-standard metros.
Do NOT set initialMetro to 'State' — users should always open on
their actual top match metro, not the State view. State is for
exploration after they've seen their primary results.

---

## Acceptance Criteria

- [ ] EmailGate writes 4 cities to top_city_matches
- [ ] MM2 anchor panel and city cards still show only top 3 — 4th not visible in MM2
- [ ] MM3 anchor panel shows top 3 only
- [ ] MM3 live rankings opening state shows all 4 saved matches
- [ ] State tab appears leftmost in the metro tab bar
- [ ] State tab shows top 5 across all 101 Texas cities scored by current sandbox priorities
- [ ] State tab context line reads correctly
- [ ] Switching to State tab sets sandboxTouched = true (metro tab onClick already does this)
- [ ] DFW user still opens on DFW tab — State is not the default
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/results/EmailGate.tsx
git add components/portal/milemarkers/MM3Discover.tsx
git add components/portal/MileMarkerContent.tsx
git commit -m "feat: MM3 State tab for all-Texas view, 4th city written and shown in MM3 rankings"
git push origin main
```

Confirm push — paste commit hash.

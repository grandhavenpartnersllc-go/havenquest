# Fix Brief — MM3 Opening State Should Match MM2 Saved Matches
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute
**Priority:** P1
**Report back:** Confirm fix complete, describe what changed

---

## The Problem

MM3 opens by immediately re-running the scoring algorithm against the selected
metro pool. This produces different results than MM2 because:
- MM2 scores against all 101 Texas cities, returns top 3
- MM3 scores against ~15 cities in one metro, returns top 5

The user sees Plano / McKinney / Frisco in MM2, then Plano / Coppell / McKinney
/ Wylie in MM3. Inconsistent starting point.

## The Desired Behavior

MM3 should open showing the same cities as MM2 — Plano, McKinney, Frisco in
the same order. This is the starting point. As soon as the user adjusts any
priority or financial slider, the live sandbox kicks in and rankings update.
The user explicitly causes the change — MM3 doesn't change on its own at load.

---

## The Fix

**File:** `components/portal/milemarkers/MM3Discover.tsx`

### Step 1 — Read the current sandboxMatches computation

Find where `sandboxMatches` is computed. It's likely something like:
```javascript
const sandboxMatches = getTopMatches(activeProfile, metroCities, 5)
```

Report the exact current code before changing anything.

### Step 2 — Add an initial state that uses MM2 matches

The component already receives `matches` (the MM2 saved results) and
`initialCityIndex` as props.

Add a state variable that tracks whether the sandbox has been touched:
```javascript
// This likely already exists as sandboxTouched — confirm
const [sandboxTouched, setSandboxTouched] = useState(false)
```

### Step 3 — Use MM2 matches as the display list until sandbox is touched

Modify the rankings display so that:
- When `sandboxTouched === false`: display `matches` (the MM2 saved top 3)
  filtered to the selected metro, in their original order
- When `sandboxTouched === true`: display `sandboxMatches` (the live re-run)

```javascript
// The displayed rankings list:
const displayedMatches = sandboxTouched
  ? sandboxMatches
  : matches.filter(m => m.location.metroUsed.includes(selectedMetro))
      .slice(0, 5)  // show up to 5, but MM2 only has 3 so will show 3
```

**Important:** If the MM2 top 3 are all in the DFW metro, all 3 will show.
If the user switches to Austin tab before touching the sandbox, they should
see Austin cities from the live algorithm (since MM2 didn't have Austin cities
for a DFW user). So the filter only applies when on the user's primary metro.

Simpler approach: just use `matches` directly (unfiltered) when not sandbox
touched, since matches already contains the right cities for this user:

```javascript
const displayedMatches = (!sandboxTouched && matches.length > 0)
  ? matches
  : sandboxMatches
```

This shows exactly Plano / McKinney / Frisco at open. The moment the user
touches any slider or priority, sandboxTouched becomes true and the live
algorithm takes over.

### Step 4 — Ensure financial panel uses displayedMatches[0] on load

The financial panel should show the financials for displayedMatches[0] on
initial load — which will be Plano (the MM2 top pick), matching MM2 exactly.

Confirm that selectedCityIndex = 0 (already passed as initialCityIndex={0})
correctly references displayedMatches[0] when sandboxTouched = false.

If selectedCityIndex indexes into sandboxMatches specifically rather than
the display list, update the financial panel to use:
```javascript
const topCity = displayedMatches[selectedCityIndex]?.location
  ?? displayedMatches[0]?.location
```

---

## What sandboxTouched should trigger on

`sandboxTouched` should be set to `true` when:
- User adjusts any priority bucket (moves a category)
- User adjusts down payment slider
- User adjusts home sale proceeds slider  
- User adjusts rate assumption slider
- User switches metro tab

It should NOT be set to true on:
- Initial load
- Clicking a city in the rankings (that's just selection, not sandbox adjustment)
- The anchor panel rendering

---

## Acceptance Criteria

- [ ] MM3 opens showing Plano / McKinney / Frisco (same as MM2) for a DFW user
- [ ] Financial panel shows Plano's numbers on entry — matches MM2
- [ ] DFW tab is selected (already working)
- [ ] When user adjusts any slider or priority — rankings update live as before
- [ ] When user switches metro tab — live algorithm runs for that metro
- [ ] The "Your Top Matches" anchor panel above still shows the saved top 3
- [ ] tsc --noEmit clean
- [ ] Tested with Craig's test account — DFW run confirms consistent MM2→MM3 entry

---

## Files to Change

- `components/portal/milemarkers/MM3Discover.tsx`

Report back: exact changes made, confirm acceptance criteria tested.

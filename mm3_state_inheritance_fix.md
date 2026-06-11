# Fix Brief — MM3 Inherits MM2 State + Financial Panel City Name
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Read then fix
**Priority:** P1
**Report back:** Confirm each fix complete, describe what changed

---

## Fix 1 — MM3 Should Inherit MM2's State on Entry

### The Problem

MM3 currently boots as an independent sandbox that re-runs the scoring algorithm
from scratch. It doesn't know what city the user was looking at in MM2, and it
has timing issues determining the correct metro tab from the matches prop.

### The Right Architectural Fix

When the user advances from MM2 to MM3, MM3 should open as a direct continuation
of MM2 — not a fresh start. The top match city from MM2 becomes MM3's initial
selected city. The metro of that city becomes MM3's default tab. The financial
picture carries over showing that city's numbers immediately.

### Read First

Before changing anything, report:

1. How does the user advance from MM2 to MM3? Find the button or trigger in
   MM2Discover.tsx or StarterPortal.tsx that sets currentMileMarker to 3.
   What state is available at that moment?

2. What props does MM3Discover currently accept? Report the full
   MM3DiscoverProps interface.

3. How is the initial selectedCityIndex set in MM3Discover? What determines
   which city's financials show on first render?

4. How is selectedMetro currently initialized and set?

### The Fix

**In StarterPortal.tsx or MileMarkerContent:**
When advancing to MM3, pass the following as props or initial state to MM3Discover:
- `initialMetro` — the metro value of matches[0].location.metroUsed
  (e.g. 'Dallas' for a DFW top match)
- `initialCityIndex` — 0 (the top match city, same as MM2's Top Pick)

**In MM3Discover.tsx:**
1. Accept `initialMetro?: string` and `initialCityIndex?: number` as new props

2. Replace the metro detection useEffect entirely with a simpler initialization:
```javascript
// On mount, use initialMetro if provided — no async detection needed
useEffect(() => {
  if (initialMetro && selectedMetro === '') {
    setSelectedMetro(initialMetro)
  }
}, [initialMetro])
```

3. Initialize selectedCityIndex from initialCityIndex prop (default 0):
```javascript
const [selectedCityIndex, setSelectedCityIndex] = useState(initialCityIndex ?? 0)
```

This means:
- MM3 opens on the DFW tab immediately for a DFW user — no timing dependency
- MM3 opens showing Plano's financials (MM2's top pick) — feels like a continuation
- The user can explore other metros and cities freely from that starting point
- No more async timing issues — the initial state is passed in synchronously

---

## Fix 2 — Financial Panel Header City Name Not Showing

### The Problem

A fix was applied today to add the active city name in gold under "YOUR FINANCIAL
PICTURE" in the MM3 financial panel. It is not visible in testing.

### Read First

Find the financial panel section in MM3Discover.tsx. Report:
1. Is the city name conditional block present? What is the exact current code?
2. What variable holds the active city name — is it `topCity`, `selectedCity`,
   or something else?
3. Is that variable populated at render time or could it be null/undefined?
4. What is the exact className and style applied to the city name element?

### The Fix

Ensure the city name renders reliably. The city name should appear as a
sub-label directly under "YOUR FINANCIAL PICTURE" in gold #B8912A.

If the variable is null at render, add a fallback:
```javascript
{(topCity?.name || sandboxMatches[0]?.location.name) && (
  <p className="text-sm font-semibold mt-0.5" style={{ color: '#B8912A' }}>
    {topCity?.name ?? sandboxMatches[0]?.location.name}
  </p>
)}
```

Ensure this renders on first load — not just after the user clicks a city.

---

## Acceptance Criteria

**Fix 1:**
- [ ] Fresh DFW session → MM3 opens on DFW tab immediately, no flash of Austin
- [ ] MM3 financial panel shows Plano (MM2 top pick) financials on entry
- [ ] User can switch metro tabs and city selection freely after entry
- [ ] Fresh Austin session → MM3 opens on Austin tab with top Austin city

**Fix 2:**
- [ ] City name appears in gold directly under "YOUR FINANCIAL PICTURE" on MM3 load
- [ ] City name updates when user clicks a different city in the ranked list
- [ ] Shows on first render without requiring any user interaction

**Both:**
- [ ] tsc --noEmit clean
- [ ] Tested with Craig's test account — DFW and Austin runs both confirmed

---

## Files Likely to Change

- `components/portal/milemarkers/MM3Discover.tsx`
- `components/portal/StarterPortal.tsx` or `MileMarkerContent` — to pass
  initialMetro and initialCityIndex props

Report back: exact files and lines changed, describe what changed,
confirm acceptance criteria tested.

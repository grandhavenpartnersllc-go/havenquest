# Fix Brief — MM3 initialMetro Timing & Austin Fallback Text
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — targeted fixes
**Priority:** P1
**Report back:** Confirm each fix, describe what changed

---

## Root Cause (Confirmed)

When the user reaches MM3 and matches = [] (async path still in flight),
MileMarkerContent computes initialMetro = undefined and passes it to MM3Discover.
The [initialMetro] useEffect fires with undefined and does nothing.

When matches later populates, MileMarkerContent re-renders, recomputes
initialMetro = 'Dallas', and passes the new value to MM3Discover. React detects
the undefined → 'Dallas' prop change and re-fires the useEffect — which SHOULD
set the metro correctly.

However the user perceives Austin as the default because the context line:
  selectedMetro
    ? `${selectedMetro label} is your top match...`
    : ?? 'Austin' fallback text
...shows "Austin is your top match" even when selectedMetro = '' (no tab selected).

Two fixes needed.

---

## Fix 1 — MM3Discover.tsx — Add matches to initialMetro useEffect dependencies

The [initialMetro] useEffect currently has dependency [initialMetro] only.
When matches populates and causes MileMarkerContent to recompute initialMetro
from undefined to 'Dallas', this prop change should trigger the effect.
Adding matches as a dependency ensures the effect also re-evaluates when
matches changes in case the prop change alone isn't sufficient:

```javascript
// Current:
useEffect(() => {
  if (initialMetro && selectedMetro === '') {
    setSelectedMetro(initialMetro)
  }
}, [initialMetro])

// Fix:
useEffect(() => {
  if (initialMetro && selectedMetro === '') {
    setSelectedMetro(initialMetro)
  }
}, [initialMetro, matches])
```

---

## Fix 2 — MM3Discover.tsx — Replace Austin fallback text with neutral loading text

Find the context description line that says something like:
"Austin is your top match. Use the buttons above..."
or uses `selectedMetro ?? 'Austin'` or similar fallback.

When selectedMetro = '' (no metro selected yet), the text should NOT say
"Austin is your top match" — it should say something neutral.

Replace the fallback so it only shows metro-specific text when a metro is
actually selected:

```javascript
// Find the context text block — likely something like:
const metroLabel = METRO_OPTIONS.find(m => m.value === selectedMetro)?.label

// Replace the description with:
{selectedMetro
  ? `${metroLabel} is your top match. Use the buttons above to see how your priorities and budget rank cities in other Texas metros.`
  : 'Select a metro above to explore how your priorities rank cities in each market.'
}
```

This means:
- When selectedMetro = '' on first render: neutral prompt shown, no Austin confusion
- When selectedMetro = 'Dallas': "DFW is your top match..." shown correctly
- When selectedMetro = 'Austin': "Austin is your top match..." shown correctly

---

## Fix 3 — MileMarkerContent.tsx — Derive initialMetro from matches prop directly

As a belt-and-suspenders fix, also derive initialMetro from the matches prop
that is passed to MM3Discover, not from a separate computation in case 3.
This ensures MM3Discover always has the most current value:

In case 3, the initialMetro computation is already correct:
```javascript
const topMetro = matches[0]?.location.metroUsed ?? ''
const initialMetro = ['Dallas', 'Houston', 'San Antonio', 'Austin']
  .find(v => topMetro.includes(v))
```

Confirm this is present and unchanged. No change needed here if it's correct.

---

## Acceptance Criteria

- [ ] Fresh DFW session → MM3 opens on DFW tab, no Austin text visible
- [ ] When matches is empty on first render, neutral text shown (not "Austin is your top match")
- [ ] When matches populates, correct metro tab selected automatically
- [ ] Fresh Austin session → Austin tab and correct text
- [ ] No flash of incorrect metro text before correct metro loads
- [ ] tsc --noEmit clean
- [ ] Tested with Craig's test account

---

## Files to Change

- `components/portal/milemarkers/MM3Discover.tsx` — Fixes 1 and 2

Report back: exact lines changed, confirm acceptance criteria tested.

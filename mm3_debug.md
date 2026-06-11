# Debug Brief — Confirm initialMetro Value at MM3Discover Mount
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Add temporary logging, report findings, then remove logging
**Priority:** P1
**Report back:** Console output plus answers to questions below

---

## Context

After multiple fixes, MM3 still defaults to Austin instead of the user's actual
top match metro (DFW). The architectural fix passed initialMetro as a prop from
MileMarkerContent to MM3Discover. Something is still preventing it from working.

---

## Step 1 — Add temporary console.logs

In MileMarkerContent.tsx, in case 3, add logging immediately before MM3Discover
is rendered:

```javascript
console.log('[MM3 Debug] matches:', matches)
console.log('[MM3 Debug] matches[0]?.location.metroUsed:', matches[0]?.location.metroUsed)
console.log('[MM3 Debug] initialMetro computed:', initialMetro)
```

In MM3Discover.tsx, at the top of the component function body, add:

```javascript
console.log('[MM3 Debug] MM3Discover received initialMetro:', initialMetro)
console.log('[MM3 Debug] MM3Discover received matches:', matches)
```

Also add inside the initialMetro useEffect:
```javascript
useEffect(() => {
  console.log('[MM3 Debug] initialMetro useEffect fired, initialMetro:', initialMetro, 'selectedMetro:', selectedMetro)
  if (initialMetro && selectedMetro === '') {
    setSelectedMetro(initialMetro)
  }
}, [initialMetro])
```

---

## Step 2 — Run the test

Have Craig run a fresh DFW quiz and advance to MM3. Report the full console
output from all the logs above.

---

## Step 3 — Also answer these questions from code inspection

1. In MileMarkerContent.tsx case 3 — what is the exact current code that
   computes initialMetro and passes it to MM3Discover? Paste the full block.

2. What does the matches prop contain in MileMarkerContent at the point
   case 3 renders — is it the StarterPortal matches state, or something else?
   How is matches passed into MileMarkerContent?

3. In MM3Discover.tsx — is there any other useEffect or initialization that
   sets selectedMetro after the initialMetro effect fires? Could something
   be overwriting the correctly set metro?

---

## Step 4 — Remove all console.logs after reporting

Remove every console.log added in Step 1 before finishing.

---

## What to Paste Back

Full console output from the DFW test run plus answers to the three questions.
No fix changes — Claude will write the fix once the diagnosis is confirmed.

# Fix Brief — MM3 Metro Detection Fires on Empty Matches
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — one line change
**Priority:** P1
**Report back:** Confirm fix complete, describe what changed

---

## Root Cause

The metro detection useEffect fires when `matches` is empty (matches = []).
`matches[0]` is undefined → metro = '' → no METRO_OPTIONS match → falls back to
'Austin' → sets selectedMetro = 'Austin'. After that, the guard
`if (selectedMetro !== '') return` prevents re-detection when matches later
populates with the real DFW data. Both symptoms (wrong metro AND missing anchor
panel) share this single root cause.

---

## The Fix — One Condition Change

**File:** `components/portal/milemarkers/MM3Discover.tsx`

Find the metro initialization useEffect:

```javascript
useEffect(() => {
  if (selectedMetro !== '') return
  const metro = matches[0]?.location.metroUsed ?? ''
  const found = METRO_OPTIONS.find(m => metro.includes(m.value))
  setSelectedMetro(found?.value ?? 'Austin')
}, [matches, selectedMetro])
```

Change the guard to also bail out when matches is empty:

```javascript
useEffect(() => {
  if (selectedMetro !== '' || matches.length === 0) return
  const metro = matches[0]?.location.metroUsed ?? ''
  const found = METRO_OPTIONS.find(m => metro.includes(m.value))
  setSelectedMetro(found?.value ?? 'Austin')
}, [matches, selectedMetro])
```

**What this does:**
- When matches = [] on first render: guard fires, returns early, does NOT set
  'Austin' as default
- When matches populates with real data: selectedMetro is still '' AND
  matches.length > 0 → guard passes → correct metro detected and set
- When selectedMetro is already set: guard fires on first condition, returns —
  no change to existing behavior
- The 'Austin' fallback now only fires when matches is populated but contains
  a city with an unrecognised metro — the intended behavior

---

## Acceptance Criteria

- [ ] DFW quiz result → MM3 opens on DFW tab automatically
- [ ] Austin quiz result → MM3 opens on Austin tab automatically  
- [ ] Anchor panel shows correct saved top 3 cities in all cases
- [ ] No flash of Austin tab before correct metro loads
- [ ] Houston and San Antonio quiz results also open on correct tab
- [ ] tsc --noEmit clean
- [ ] Tested with Craig's test account — DFW priorities, confirm DFW tab default

---

## File to Change

- `components/portal/milemarkers/MM3Discover.tsx` — one condition added to guard

Report back: confirm exact line changed and acceptance criteria tested.

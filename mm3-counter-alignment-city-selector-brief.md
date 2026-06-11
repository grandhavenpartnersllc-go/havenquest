# Build Brief — MM3 Discover: Bucket Counter Alignment & City Selector
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM3 UX polish
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Two changes to MM3Discover.tsx only:

1. Align bucket counter bar tiles precisely over their corresponding grid columns
2. Clicking a city in live rankings updates the financial summary panel to show that city's numbers

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## Change 1 — Bucket Counter Bar Alignment

### The Problem
The counter bar uses `grid-cols-4` which spans the full width equally across 4 columns. But the column grid below it uses `gridTemplateColumns: '150px 1fr 1fr 1fr 1fr'` — a 150px label column plus 4 equal data columns. So the counter tiles don't align with the data columns.

### The Fix
Replace the counter bar's `grid-cols-4` container with the same grid template as the column headers — add a 150px spacer on the left so the 4 counter tiles sit directly above their corresponding columns.

Find:
```tsx
{/* Bucket counter bar */}
<div className="grid grid-cols-4 gap-2 mb-6">
```

Replace with:
```tsx
{/* Bucket counter bar */}
<div className="grid mb-6" style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>
  <div /> {/* spacer to match label column */}
```

Also change the closing `</div>` of the counter bar to close after the mapped tiles — the spacer div counts as the first cell, so the 4 tiles follow naturally.

**Full replacement of the counter bar opening:**
```tsx
{/* Bucket counter bar */}
<div className="grid mb-6" style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>
  <div /> {/* label column spacer */}
  {[
    { key: 'unassigned',    label: 'Unassigned',   count: unassigned.length,    max: null },
    { key: 'notPriorities', label: 'Nice to Have', count: notPriorities.length, max: null },
    { key: 'niceToHaves',   label: 'Important',    count: niceToHaves.length,   max: 5    },
    { key: 'mustHaves',     label: 'Must Have',    count: mustHaves.length,     max: 4    },
  ].map(bucket => {
    ... (keep all existing tile JSX exactly as-is)
  })}
</div>
```

Everything inside the tile JSX stays exactly the same — only the outer container and the spacer div change.

---

## Change 2 — City Selector Updates Financial Panel

### New state
Add after the existing `cityPopup` state declaration:

```typescript
const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0)
```

### Update financial computations to use selectedCityIndex

Find:
```typescript
const topCity = sandboxMatches[0]?.location
const topCityPrice = topCity?.housing?.medianHomePrice ?? 341800
```

Replace with:
```typescript
const topCity = sandboxMatches[selectedCityIndex]?.location ?? sandboxMatches[0]?.location
const topCityPrice = topCity?.housing?.medianHomePrice ?? 341800
```

Also update the affordability status line that references `topCity?.name`:
```typescript
Based on {topCity?.name ?? 'your top city'} · {interestRate.toFixed(2)}% rate
```
This already uses `topCity` so it will automatically show the selected city name — no change needed.

### Reset selectedCityIndex when rankings change

Add to the existing useEffect that syncs priorities from profile — or add a new useEffect:

```typescript
useEffect(() => {
  setSelectedCityIndex(0)
}, [selectedMetro, mustHaves, niceToHaves, notPriorities])
```

This resets to #1 whenever the user changes metro or moves priorities — so the financial panel always starts fresh.

### Update city cards to show selected state and trigger financial update

Find the city rankings card map. Currently:
```tsx
{sandboxMatches.map((match, i) => (
  <div
    key={match.location.id}
    className="rounded-xl p-3"
    style={{
      backgroundColor: '#F7F6F3',
      borderLeft: i === 0 ? `3px solid ${GOLD}` : '3px solid transparent',
    }}
  >
```

Replace with:
```tsx
{sandboxMatches.map((match, i) => (
  <div
    key={match.location.id}
    className="rounded-xl p-3 cursor-pointer transition-all"
    onClick={() => setSelectedCityIndex(i)}
    style={{
      backgroundColor: i === selectedCityIndex ? '#FBF3E3' : '#F7F6F3',
      borderLeft: i === selectedCityIndex ? `3px solid ${GOLD}` : '3px solid transparent',
      outline: i === selectedCityIndex ? `1px solid rgba(184,145,42,0.3)` : 'none',
    }}
  >
```

Also update the rank number color to reflect selected state:
```tsx
<span className="text-[10px] font-bold"
      style={{ color: i === selectedCityIndex ? GOLD : '#9A8E82' }}>
  #{i + 1}
</span>
```

### Add a small "viewing financials" indicator on the selected card

Below the metro/learn more row on each card, add a conditional line:

```tsx
{i === selectedCityIndex && (
  <p className="text-[9px] font-semibold mt-1"
     style={{ color: GOLD, letterSpacing: '0.06em' }}>
    ↑ Financial panel showing this city
  </p>
)}
```

---

## Acceptance Criteria

- [ ] Bucket counter tiles align directly above their corresponding grid columns
- [ ] 150px spacer on left of counter bar matches the label column width
- [ ] Counter tile widths match column widths — proportional, not full-width equal
- [ ] Flash and FULL states unchanged
- [ ] Clicking any city card updates the financial summary panel instantly
- [ ] Selected city card shows warm gold tint background + gold left border
- [ ] Unselected cards return to normal gray background
- [ ] Financial panel shows "Based on [selected city name]" in the affordability row
- [ ] Monthly mortgage, property tax, total housing all update to selected city's numbers
- [ ] "↑ Financial panel showing this city" indicator appears on selected card
- [ ] selectedCityIndex resets to 0 when metro or priorities change
- [ ] tsc --noEmit passes clean
- [ ] No other files changed

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*

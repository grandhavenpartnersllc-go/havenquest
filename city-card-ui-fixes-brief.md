# Build Brief — City Card UI Fixes
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** Medium — cosmetic but visible to all users  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## Overview

Two small UI fixes to `components/results/CityMatchCard.tsx`. One file only. No algorithm changes, no database changes, no other files touched.

---

## Fix 1 — Add Metro Label to City Card

### Current behavior
City header shows:
```
Tomball, TX
Harris County, TX
```

### Required behavior
City header shows:
```
Tomball, TX
Houston Metro          ← new line
Harris County, TX
```

### Implementation

In the header section of `CityMatchCard.tsx`, after the city name and before the county line, add a new line displaying `location.metroUsed`.

Current code (approximate):
```tsx
<h3 className="font-bold text-gray-900 text-[17px] tracking-tight leading-snug">
  {location.name}
</h3>
<p className="text-xs text-gray-400 mt-0.5">{location.county} County, TX</p>
```

Updated code:
```tsx
<h3 className="font-bold text-gray-900 text-[17px] tracking-tight leading-snug">
  {location.name}
</h3>
<p className="text-xs text-accent font-medium mt-0.5">{location.metroUsed}</p>
<p className="text-xs text-gray-400 mt-0">{location.county} County, TX</p>
```

**Styling notes:**
- Metro label: `text-xs`, accent color (`text-accent`), `font-medium` — slightly more prominent than the county line
- County line: unchanged — `text-xs text-gray-400`
- Metro line sits between city name and county line

---

## Fix 2 — Market Badge Alignment

### Current behavior
The "Sellers Market" / "Balanced Market" / "Buyers Market" badge sits too high in its container relative to adjacent elements.

### Root cause
The badge container uses `flex items-center` which vertically centers the badge. When the badge and adjacent elements have different heights, centering causes the badge to appear misaligned.

### Implementation

Find the market badge container in `CityMatchCard.tsx`:

```tsx
<div className="flex flex-wrap items-center gap-2 mb-3">
  <MarketBadge condition={location.market.marketCondition} />
</div>
```

Change `items-center` to `items-start`:

```tsx
<div className="flex flex-wrap items-start gap-2 mb-3">
  <MarketBadge condition={location.market.marketCondition} />
</div>
```

---

## Files to Modify

| File | Change |
|---|---|
| `components/results/CityMatchCard.tsx` | Add metro label line, fix badge alignment |

No other files. No types changes. No database changes.

---

## Acceptance Criteria

- [ ] Metro label renders on every city card between city name and county line
- [ ] Metro label uses accent color and medium weight — visually distinct from county line
- [ ] Metro label pulls from `location.metroUsed` — correct metro displays for every city
- [ ] Market condition badge aligns correctly — not sitting too high
- [ ] Badge alignment consistent across Sellers Market, Balanced Market, and Buyers Market
- [ ] No regression on score pill, match bar, affordability flag, or View full report link
- [ ] `tsc --noEmit` passes clean

---

## Testing

1. Run quiz end-to-end and check results page
2. Verify metro label appears on all 3 result cards
3. Verify correct metro for each city — Houston city shows Houston Metro, Austin city shows Austin Metro, etc.
4. Verify market badge sits at correct vertical alignment
5. Test on mobile — metro label should wrap cleanly

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*

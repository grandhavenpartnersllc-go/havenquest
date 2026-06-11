# Build Brief — Metro Label + Badge Alignment (FullReport & SavedMatches)
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** Medium — cosmetic but visible to all users  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## Context

`CityMatchCard.tsx` (results teaser page) was already fixed in commit 272b490.

Two components still need the same fixes:
1. `components/results/FullReport.tsx` — metro label + badge alignment
2. `components/portal/SavedMatches.tsx` — metro label only (no market badge in this component)

---

## Fix 1 — `components/results/FullReport.tsx`

### Metro label
Find where `location.name` and `location.county` are rendered in the city header. Add a metro label line between them pulling from `location.metroUsed`. Match the same pattern used in `CityMatchCard.tsx`:

```tsx
<p className="text-xs text-accent font-medium mt-0.5">{location.metroUsed}</p>
```

### Badge alignment
Find this block (around lines 41–46):
```tsx
<div className="flex flex-wrap gap-2">
  <MarketBadge condition={location.market.marketCondition} />
  <span className="inline-flex items-center gap-1.5 bg-white border border-gray-100 px-2.5 py-1 rounded-full text-xs text-gray-500">
    <TEARatingBadge rating={location.school.teaRating} size="sm" />
    <span>TEA {location.school.teaRating} · {location.school.primaryISD}</span>
  </span>
</div>
```

Change `flex flex-wrap gap-2` to `flex flex-wrap items-start gap-2`:

```tsx
<div className="flex flex-wrap items-start gap-2">
```

---

## Fix 2 — `components/portal/SavedMatches.tsx`

### Metro label only — no badge fix needed (component has no market badge)

Find this block in the `MatchCard` function:
```tsx
<h3 className="text-[17px] font-bold tracking-tight mb-0.5" style={{ color: t.cityName }}>
  {match.location.name}
</h3>
<p className="text-xs mb-4" style={{ color: t.county }}>
  {match.location.county} County, TX
</p>
```

Add metro label between city name and county. The component has two card styles — primary (dark) and non-primary (light). Add `metro` to the `t` object for both:

**Primary card (dark background):**
```
metro: GOLD
```

**Non-primary card (light background):**
```
metro: '#1A5FA8'  // accent blue — same as text-accent
```

Updated JSX:
```tsx
<h3 className="text-[17px] font-bold tracking-tight mb-0.5" style={{ color: t.cityName }}>
  {match.location.name}
</h3>
<p className="text-xs mb-0.5 font-medium" style={{ color: t.metro }}>
  {match.location.metroUsed}
</p>
<p className="text-xs mb-4" style={{ color: t.county }}>
  {match.location.county} County, TX
</p>
```

---

## Files to Modify

| File | Change |
|---|---|
| `components/results/FullReport.tsx` | Add metro label, fix badge alignment |
| `components/portal/SavedMatches.tsx` | Add metro label only |

No other files. No types changes. No database changes.

---

## Acceptance Criteria

- [ ] Metro label renders in FullReport between city name and county line
- [ ] Metro label renders in SavedMatches between city name and county line — gold on primary card, accent blue on secondary cards
- [ ] Market badge and TEA badge align correctly in FullReport — not sitting at different heights
- [ ] Metro label pulls from `location.metroUsed` — correct metro for every city
- [ ] No regression on any other FullReport or SavedMatches functionality
- [ ] `tsc --noEmit` passes clean

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*

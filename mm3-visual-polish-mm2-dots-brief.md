# Build Brief — MM3 Visual Polish: Metro Copy, Grid Colors, Rate Slider & MM2 Dots
**Project:** HavenQuest
**Date:** June 3, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — visual polish and UX clarity
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Four changes across two files:

1. MM3Discover.tsx — Metro context line copy fix
2. MM3Discover.tsx — Priority grid colors (darker unassigned, blue for Nice to Have)
3. MM3Discover.tsx — Interest rate slider with market rate zones and updated default
4. MM2Discover.tsx — Affordability dots on city cards (bonus — separate file)

---

## Files Changing

| File | Changes |
|---|---|
| `components/portal/milemarkers/MM3Discover.tsx` | Changes 1, 2, 3 |
| `components/portal/milemarkers/MM2Discover.tsx` | Change 4 |

---

## Change 1 — Metro Context Line Copy Fix

Find the metro context line in MM3Discover.tsx:
```tsx
return isOriginalMetro
  ? `${topMetroLabel} is your top match — you can also explore other Texas metros below.`
  : `Showing ${topMetroLabel} metro — adjust priorities or switch metros to explore.`
```

Replace with:
```tsx
return isOriginalMetro
  ? `${topMetroLabel} is your top match. Use the buttons above to see how your priorities and budget rank cities in other Texas metros.`
  : `Showing ${topMetroLabel} cities ranked by your current priorities and budget.`
```

---

## Change 2 — Priority Grid Colors

### Update BUCKET_COLORS constant

Find:
```typescript
const BUCKET_COLORS: Record<BucketKey, string> = {
  unassigned: '#E5E7EB',
  notPriorities: '#9CA3AF',
  niceToHaves: '#4B7A5E',
  mustHaves: GOLD,
}
```

Replace with:
```typescript
const BUCKET_COLORS: Record<BucketKey, string> = {
  unassigned: '#6B7280',
  notPriorities: '#1A5FA8',
  niceToHaves: '#4B7A5E',
  mustHaves: GOLD,
}
```

### Update column header colors

Find:
```typescript
{ label: 'Unassigned',   color: '#C5BFB8' },
{ label: 'Nice to Have', color: '#9A8E82' },
```

Replace with:
```typescript
{ label: 'Unassigned',   color: '#6B7280' },
{ label: 'Nice to Have', color: '#1A5FA8' },
```

### Update empty circle background

The empty circle currently uses:
```
'rgba(197,191,184,0.15)'
```

This is fine for unassigned but all empty circles use the same color. No change needed here — the filled circle (isActive) already uses BUCKET_COLORS which now has the correct colors.

### Update icon color inside active circles

Find the icon inside the active circle:
```tsx
return isActive
  ? <Icon size={14} strokeWidth={2} style={{ color: '#FFFFFF' }} />
  : <span style={{ fontSize: '12px', color: '#C5BFB8', opacity: 0.6 }}>+</span>
```

The white icon works for gold, green, and blue backgrounds. Update the empty "+" placeholder to use a slightly darker color so it's more visible:

```tsx
return isActive
  ? <Icon size={14} strokeWidth={2} style={{ color: '#FFFFFF' }} />
  : <span style={{ fontSize: '12px', color: '#9A8E82', opacity: 0.8 }}>+</span>
```

---

## Change 3 — Interest Rate Slider with Market Rate Zones

### Constants to add at module level

```typescript
// Current market rate data — update quarterly
// Source: Freddie Mac PMMS, May 28, 2026
const RATE_MARKET_LOW = 6.25
const RATE_MARKET_HIGH = 7.00
const RATE_MARKET_AVG = 6.53
const RATE_DATA_DATE = 'May 2026'
const RATE_DEFAULT = 6.75
```

### Update default interest rate state

Find:
```typescript
const [interestRate, setInterestRate] = useState<number>(7.0)
```

Replace with:
```typescript
const [interestRate, setInterestRate] = useState<number>(RATE_DEFAULT)
```

### Helper function for rate zone

Add after the rate constants:

```typescript
function getRateZone(rate: number): 'low' | 'market' | 'high' {
  if (rate < RATE_MARKET_LOW) return 'low'
  if (rate <= RATE_MARKET_HIGH) return 'market'
  return 'high'
}
```

### Replace the interest rate slider section

Find the interest rate adjustment section in the financial adjustments row:
```tsx
<div>
  <div className="flex items-center justify-between mb-1">
    <label className="text-xs font-semibold" style={{ color: WARM_DARK }}>
      Rate assumption
    </label>
    <span className="text-xs font-bold" style={{ color: GOLD }}>
      {interestRate.toFixed(2)}%
    </span>
  </div>
  <input
    type="range"
    min={3.0}
    max={10.0}
    step={0.25}
    value={interestRate}
    onChange={e => setInterestRate(parseFloat(e.target.value))}
    className="w-full accent-amber-600 mt-2"
  />
  <div className="flex justify-between text-[10px] mt-0.5" style={{ color: '#9A8E82' }}>
    <span>3%</span>
    <span>10%</span>
  </div>
</div>
```

Replace with:
```tsx
<div>
  <div className="flex items-center justify-between mb-1">
    <label className="text-xs font-semibold" style={{ color: WARM_DARK }}>
      Rate assumption
    </label>
    <span
      className="text-xs font-bold"
      style={{
        color: getRateZone(interestRate) === 'market' ? '#22C55E'
             : getRateZone(interestRate) === 'low' ? '#9A8E82'
             : '#F59E0B',
      }}
    >
      {interestRate.toFixed(2)}%
    </span>
  </div>

  {/* Color-zoned slider track */}
  <div className="relative mt-2 mb-1">
    {/* Background zone track */}
    <div className="w-full h-2 rounded-full overflow-hidden flex"
         style={{ backgroundColor: '#E5E7EB' }}>
      {/* Low zone — gray */}
      <div style={{ width: `${((RATE_MARKET_LOW - 3) / (10 - 3)) * 100}%`, backgroundColor: '#D1D5DB' }} />
      {/* Market zone — green */}
      <div style={{ width: `${((RATE_MARKET_HIGH - RATE_MARKET_LOW) / (10 - 3)) * 100}%`, backgroundColor: 'rgba(34,197,94,0.3)' }} />
      {/* High zone — amber */}
      <div style={{ flex: 1, backgroundColor: 'rgba(245,158,11,0.2)' }} />
    </div>

    {/* Actual range input overlaid */}
    <input
      type="range"
      min={3.0}
      max={10.0}
      step={0.25}
      value={interestRate}
      onChange={e => { setSandboxTouched(true); setInterestRate(parseFloat(e.target.value)) }}
      className="absolute inset-0 w-full opacity-0 cursor-pointer"
      style={{ height: '8px' }}
    />

    {/* Custom thumb */}
    <div
      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
      style={{
        left: `calc(${((interestRate - 3) / (10 - 3)) * 100}% - 8px)`,
        backgroundColor: getRateZone(interestRate) === 'market' ? '#22C55E'
                       : getRateZone(interestRate) === 'low' ? '#9CA3AF'
                       : '#F59E0B',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
    />
  </div>

  {/* Zone labels */}
  <div className="flex justify-between text-[9px] mb-1">
    <span style={{ color: '#9A8E82' }}>3%</span>
    <span style={{ color: '#22C55E', fontWeight: 600 }}>
      ↑ Current market {RATE_MARKET_LOW}%–{RATE_MARKET_HIGH}%
    </span>
    <span style={{ color: '#9A8E82' }}>10%</span>
  </div>

  {/* Market rate note */}
  <p className="text-[9px] leading-relaxed" style={{ color: '#9A8E82' }}>
    Freddie Mac avg: {RATE_MARKET_AVG}% · {RATE_DATA_DATE} · Updated quarterly
  </p>
</div>
```

---

## Change 4 — MM2Discover.tsx: Affordability Dots on City Cards

### The affordability calculation helper

Add this helper function in MM2Discover.tsx. It needs access to the user's profile financial picture. Add it inside the component after the existing state declarations:

```typescript
function getCityAffordabilityStatus(cityMedianPrice: number, cityTaxRate: number): 'comfortable' | 'moderate' | 'stretched' {
  const grossMonthlyIncome = (session.annualIncome ?? 100000) / 12
  // Use saved financial picture from profile
  const fp = profile?.financial_picture
  const downMid = fp?.down_payment_available
    ? getDownPaymentMidpoint(fp.down_payment_available)
    : 30000
  const procMid = fp?.home_sale_proceeds && fp.is_homeowner
    ? getProceedsMidpoint(fp.home_sale_proceeds)
    : 0
  const balance = Math.max(0, cityMedianPrice - downMid - procMid)
  if (balance === 0) return 'comfortable'
  const monthlyRate = 0.07 / 12  // use default 7% for MM2 — sandbox rate only exists in MM3
  const payment = Math.round(
    (balance * monthlyRate * Math.pow(1 + monthlyRate, 360)) /
    (Math.pow(1 + monthlyRate, 360) - 1)
  )
  const tax = Math.round((cityMedianPrice * (cityTaxRate ?? 0.018)) / 12)
  const total = payment + tax
  const pct = total / grossMonthlyIncome
  if (pct <= 0.30) return 'comfortable'
  if (pct <= 0.40) return 'moderate'
  return 'stretched'
}
```

**Required imports** — add to MM2Discover.tsx if not already present:
```typescript
import { getDownPaymentMidpoint, getProceedsMidpoint } from '../../../services/matchingService'
```

Also add `profile: UserProfile | null` to MM2Discover props interface if not already there. Check MileMarkerContent case 2 — if profile is not currently passed to MM2Discover, add it.

### Add dot to each FullReport card

In MM2Discover.tsx, find where FullReport components are rendered — the `matches.map()` that renders city reports. The FullReport component renders in a loop.

After each `<FullReport ... />` call, OR inside FullReport as a prop — check how the reports are rendered and add the dot in the most natural location.

If FullReport is rendered directly in MM2Discover:
```tsx
{matches.map((match, i) => (
  <div key={match.location.id} className="relative">
    <FullReport
      location={match.location}
      matchScore={match.matchScore}
      profile={profile}
      rank={i}
    />
    {/* Affordability dot overlay in top-right of card */}
    {(() => {
      const status = getCityAffordabilityStatus(
        match.location.housing.medianHomePrice,
        match.location.housing.propertyTaxRate ?? 0.018
      )
      const dotColor = status === 'comfortable' ? '#22C55E'
                     : status === 'moderate' ? '#F59E0B'
                     : '#EF4444'
      const dotLabel = status === 'comfortable' ? 'Comfortable'
                     : status === 'moderate' ? 'Moderate'
                     : 'Stretched'
      return (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full"
             style={{ backgroundColor: 'white', border: `1px solid ${dotColor}33`, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
          <span className="text-[10px] font-semibold" style={{ color: dotColor }}>
            {dotLabel}
          </span>
        </div>
      )
    })()}
  </div>
))}
```

If FullReport is rendered differently, adapt accordingly — the goal is a small pill badge in the top-right corner of each city report card showing the affordability status.

---

## Acceptance Criteria

### MM3 — Metro context line
- [ ] On first load: "[Metro] is your top match. Use the buttons above to see how your priorities and budget rank cities in other Texas metros."
- [ ] After sandbox touched: "Showing [Metro] cities ranked by your current priorities and budget."

### MM3 — Priority grid colors
- [ ] Unassigned circles: dark gray `#6B7280` fill when active
- [ ] Nice to Have circles: blue `#1A5FA8` fill when active
- [ ] Important circles: green `#4B7A5E` fill when active (unchanged)
- [ ] Must Have circles: gold `#B8912A` fill when active (unchanged)
- [ ] Column headers: Unassigned in `#6B7280`, Nice to Have in `#1A5FA8`
- [ ] "+" placeholder darker and more visible

### MM3 — Interest rate slider
- [ ] Default opens at 6.75% — not 7.0%
- [ ] Three visual zones on track — gray (low), green (market 6.25–7.00%), amber (high)
- [ ] Custom thumb changes color — green in market zone, gray in low zone, amber in high zone
- [ ] Rate value display changes color to match zone
- [ ] "Current market 6.25%–7.00%" label visible on slider
- [ ] "Freddie Mac avg: 6.53% · May 2026 · Updated quarterly" note below slider

### MM2 — Affordability dots
- [ ] Each city report card shows a small pill badge (green/yellow/red + label) in top-right corner
- [ ] Comfortable = green, Moderate = yellow/amber, Stretched = red
- [ ] Uses saved profile financial picture — not sandbox adjustments
- [ ] tsc --noEmit passes clean
- [ ] No any types

---

*Brief prepared by Claude (COO) — June 3, 2026. Approved by Craig Asbach.*

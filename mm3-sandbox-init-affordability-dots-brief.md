# Build Brief — MM3 Discover: Sandbox Init Fix & Affordability Dots
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM3 data consistency and UX
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Two changes to MM3Discover.tsx only:

1. Fix sandbox initialization — MM3 must open with exactly the same city rankings as MM2. The sandbox profile on first load must mirror the saved quiz profile from Supabase precisely.
2. Add affordability status dot to each city card in live rankings — green/yellow/red indicator showing financial comfort level for each city at a glance.
3. Add one-line legend below the metro switcher explaining what the dots mean.

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## Change 1 — Fix Sandbox Initialization

### The Problem
MM3 currently builds `sandboxProfile` from React state (mustHaves, niceToHaves, notPriorities arrays) which initializes from the profile prop. Due to async timing, the unassigned array computation may differ slightly from what the quiz used — causing different city rankings on first open than MM2 showed.

### The Fix
Add a `profileLoaded` state flag. Until the profile has fully synced into all bucket state arrays, use the saved profile directly for computing rankings instead of the sandboxProfile. Once the user makes their first manual adjustment, switch to the live sandboxProfile.

### New state
```typescript
const [sandboxTouched, setSandboxTouched] = useState(false)
```

### Update sandboxMatches computation

Find:
```typescript
const metroCities = selectedMetro
  ? getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
  : getAllCities()
const sandboxMatches = getTopMatches(sandboxProfile, metroCities, 5)
```

Replace with:
```typescript
const metroCities = selectedMetro
  ? getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
  : getAllCities()

// On first load before user has touched anything, use the saved profile directly
// to guarantee MM3 opens with the same rankings as MM2.
const activeProfile: UserProfile = !sandboxTouched && profile
  ? {
      ...profile,
      mustHaves: profile.mustHaves ?? [],
      niceToHaves: profile.niceToHaves ?? [],
      notPriorities: profile.notPriorities ?? [],
      financial_picture: profile.financial_picture ?? sandboxProfile.financial_picture,
    }
  : sandboxProfile

const sandboxMatches = getTopMatches(activeProfile, metroCities, 5)
```

### Set sandboxTouched on any user interaction

Add `setSandboxTouched(true)` to:

1. The bucket column click handler (when a category is moved between buckets) — add at the start of the onClick before the existing move logic
2. The down payment onChange handler
3. The proceeds onChange handler
4. The interest rate onChange handler

For the bucket grid cell onClick, find the inline click handler and add `setSandboxTouched(true)` as the first line before the full/flash checks.

For the financial dropdowns and slider, find each onChange and add `setSandboxTouched(true)` before the existing setter call.

### Reset sandboxTouched when metro changes

In the existing useEffect that resets selectedCityIndex:
```typescript
useEffect(() => {
  setSelectedCityIndex(0)
  setSandboxTouched(false)  // add this line
}, [selectedMetro, mustHaves, niceToHaves, notPriorities])
```

Wait — do NOT reset sandboxTouched when priorities change, because the user is actively adjusting. Only reset when metro changes:

```typescript
useEffect(() => {
  setSelectedCityIndex(0)
}, [mustHaves, niceToHaves, notPriorities])

useEffect(() => {
  setSelectedCityIndex(0)
  setSandboxTouched(false)
}, [selectedMetro])
```

---

## Change 2 — Affordability Dot Per City Card

### Helper function
Add this helper function inside the component, after the getBucket function:

```typescript
function getCityAffordabilityStatus(cityPrice: number): 'comfortable' | 'moderate' | 'stretched' {
  const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
  const threshold = grossMonthlyIncome * 0.40
  const totalFunds = downMid + procMid
  const balance = Math.max(0, cityPrice - totalFunds)
  if (balance === 0) return 'comfortable'
  const monthlyRate = interestRate / 100 / 12
  const payment = balance > 0
    ? Math.round((balance * monthlyRate * Math.pow(1 + monthlyRate, 360)) /
        (Math.pow(1 + monthlyRate, 360) - 1))
    : 0
  const tax = Math.round((cityPrice * (0.018)) / 12) // fallback rate
  const total = payment + tax
  if (total / grossMonthlyIncome <= 0.30) return 'comfortable'
  if (total / grossMonthlyIncome <= 0.40) return 'moderate'
  return 'stretched'
}
```

**Note:** Use the city's actual `propertyTaxRate` from `match.location.housing.propertyTaxRate` if available. If not available fall back to 0.018 (Texas average). Update the helper to accept the full city object:

```typescript
function getCityAffordabilityStatus(match: CityMatch): 'comfortable' | 'moderate' | 'stretched' {
  const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
  const cityPrice = match.location.housing.medianHomePrice
  const taxRate = match.location.housing.propertyTaxRate ?? 0.018
  const totalFunds = downMid + procMid
  const balance = Math.max(0, cityPrice - totalFunds)
  if (balance === 0) return 'comfortable'
  const monthlyRate = interestRate / 100 / 12
  const payment = balance > 0
    ? Math.round((balance * monthlyRate * Math.pow(1 + monthlyRate, 360)) /
        (Math.pow(1 + monthlyRate, 360) - 1))
    : 0
  const tax = Math.round((cityPrice * taxRate) / 12)
  const total = payment + tax
  const pct = total / grossMonthlyIncome
  if (pct <= 0.30) return 'comfortable'
  if (pct <= 0.40) return 'moderate'
  return 'stretched'
}
```

### Add dot to each city card

In the city card map, find the score bar and score number section:
```tsx
<div className="flex items-center gap-1.5">
  <div className="w-12 h-1.5 rounded-full overflow-hidden"
       style={{ backgroundColor: '#E5E7EB' }}>
    <div className="h-full rounded-full"
         style={{ width: `${match.matchScore}%`, backgroundColor: GOLD }} />
  </div>
  <span className="text-xs font-bold" style={{ color: GOLD }}>
    {match.matchScore}
  </span>
</div>
```

Replace with:
```tsx
<div className="flex items-center gap-2">
  <div className="flex items-center gap-1.5">
    <div className="w-12 h-1.5 rounded-full overflow-hidden"
         style={{ backgroundColor: '#E5E7EB' }}>
      <div className="h-full rounded-full"
           style={{ width: `${match.matchScore}%`, backgroundColor: GOLD }} />
    </div>
    <span className="text-xs font-bold" style={{ color: GOLD }}>
      {match.matchScore}
    </span>
  </div>
  {/* Affordability dot */}
  {(() => {
    const status = getCityAffordabilityStatus(match)
    const dotColor = status === 'comfortable' ? '#22C55E'
                   : status === 'moderate' ? '#F59E0B'
                   : '#EF4444'
    return (
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
        title={status === 'comfortable' ? 'Comfortable — within budget'
             : status === 'moderate' ? 'Moderate — close to the limit'
             : 'Stretched — over 40% of income'}
      />
    )
  })()}
</div>
```

---

## Change 3 — Affordability Legend Below Metro Switcher

Find the rankings panel header flex row — the div containing "Live city rankings" label and metro buttons. Add a legend line immediately after the closing `</div>` of the header row and before the city cards:

```tsx
{/* Affordability legend */}
<div className="flex items-center gap-3 mb-3">
  {[
    { color: '#22C55E', label: 'Comfortable' },
    { color: '#F59E0B', label: 'Moderate' },
    { color: '#EF4444', label: 'Stretched' },
  ].map(item => (
    <div key={item.label} className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full shrink-0"
           style={{ backgroundColor: item.color }} />
      <span className="text-[9px] font-medium" style={{ color: '#9A8E82' }}>
        {item.label}
      </span>
    </div>
  ))}
  <span className="text-[9px]" style={{ color: '#C5BFB8' }}>
    — based on your income
  </span>
</div>
```

---

## Acceptance Criteria

- [ ] MM3 opens with same city rankings as MM2 — Round Rock #1 if Round Rock was MM2 top pick
- [ ] Bee Cave or other cities only appear if the user manually adjusts priorities
- [ ] First load uses saved profile directly — not reconstructed sandbox state
- [ ] Once user moves a category or changes a financial input, sandbox takes over
- [ ] Switching metro resets sandboxTouched to false — fresh metro shows unmodified rankings
- [ ] Each city card shows a green/yellow/red dot to the right of the score
- [ ] Dot reflects affordability based on that city's actual median price and tax rate
- [ ] Dot updates when financial inputs change
- [ ] Legend appears below metro buttons: Comfortable · Moderate · Stretched — based on your income
- [ ] tsc --noEmit passes clean
- [ ] No any types
- [ ] No other files changed

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*

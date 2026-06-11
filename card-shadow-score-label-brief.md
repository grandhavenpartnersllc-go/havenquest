# Build Brief — Card Shadow Elevation & Score Label Reframe
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — UX and perception
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Two changes across two files:
1. Stronger drop shadow on FullReport card — lifts card off page background
2. Score label reframe — replace raw percentage with a qualitative label system plus a "why this score" context line

---

## Change 1 — Card Shadow Elevation

### File: `components/results/FullReport.tsx`

Find the outer article element:
```
style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.12)' }}
```

Replace with:
```
style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 12px 40px rgba(0,0,0,0.18)' }}
```

This creates genuine depth and lifts the card visually off the cream page background without changing any colors.

---

## Change 2 — Score Label Reframe

### File: `components/results/ScoreGauge.tsx`

**Step 1 — Add a score label helper function**

Add this function above the component:

```typescript
function getScoreLabel(score: number): string {
  if (score >= 85) return 'Exceptional Match'
  if (score >= 75) return 'Excellent Match'
  if (score >= 65) return 'Strong Match'
  if (score >= 55) return 'Good Match'
  return 'Potential Match'
}
```

**Step 2 — Replace the current score display**

Find:
```tsx
<div className="absolute inset-0 flex flex-col items-center justify-center">
  <span className="text-3xl font-medium tabular-nums" style={{ color }}>{score}</span>
  <span className="text-xs text-gray-500">match</span>
</div>
```

Replace with:
```tsx
<div className="absolute inset-0 flex flex-col items-center justify-center">
  <span className="text-3xl font-medium tabular-nums" style={{ color }}>{score}</span>
  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400" style={{ letterSpacing: '0.08em' }}>
    match
  </span>
</div>
```

**Step 3 — Add score label below the gauge in FullReport.tsx**

In `components/results/FullReport.tsx`, find where ScoreGauge is rendered:
```tsx
<ScoreGauge score={matchScore} size={110} />
```

Wrap it and add the label below:
```tsx
<div className="flex flex-col items-center gap-1.5">
  <ScoreGauge score={matchScore} size={110} />
  <span
    className="text-[11px] font-bold uppercase tracking-wider text-center"
    style={{
      color: matchScore >= 85 ? '#2D7D4E'
           : matchScore >= 75 ? '#1A6B3C'
           : matchScore >= 65 ? '#B8912A'
           : matchScore >= 55 ? '#7A6420'
           : '#6B7280',
      letterSpacing: '0.1em',
    }}
  >
    {matchScore >= 85 ? 'Exceptional Match'
   : matchScore >= 75 ? 'Excellent Match'
   : matchScore >= 65 ? 'Strong Match'
   : matchScore >= 55 ? 'Good Match'
   : 'Potential Match'}
  </span>
</div>
```

**Step 4 — Add "best available" context line**

In `components/results/FullReport.tsx`, find the description paragraph in the header section:
```tsx
<p className="text-sm text-gray-500 leading-relaxed mt-4">{location.description}</p>
```

Add a context line ABOVE the description:
```tsx
<p className="text-[11px] text-gray-400 italic mt-3 mb-1">
  Based on your priorities, this is your strongest available match in Texas.
</p>
<p className="text-sm text-gray-500 leading-relaxed">{location.description}</p>
```

Only show this context line for the first city report (rank 0 / Top Pick). For Runner-Up and Strong Alt it is not needed.

To implement this, FullReport needs to know its rank. Check if a `rank` prop already exists — if not, add `rank?: number` to FullReport's props interface and pass `rank={i}` from wherever FullReport is rendered (MM2Discover.tsx maps matches and renders FullReport — add rank={i} there).

Then conditionally render:
```tsx
{(rank === 0 || rank === undefined) && (
  <p className="text-[11px] text-gray-400 italic mt-3 mb-1">
    Based on your priorities, this is your strongest available match in Texas.
  </p>
)}
```

---

## Acceptance Criteria

- [ ] Card has stronger shadow — visibly elevated off the cream page background
- [ ] Score gauge still shows the number (0–100) — number is NOT removed
- [ ] Score label below gauge shows: Exceptional Match / Excellent Match / Strong Match / Good Match / Potential Match
- [ ] Label color matches score tier — green for high, gold for mid, gray for lower
- [ ] "Based on your priorities, this is your strongest available match in Texas." appears on Top Pick only
- [ ] Runner-Up and Strong Alt do not show the context line
- [ ] tsc --noEmit passes clean
- [ ] No any types introduced
- [ ] No logic or data changes

---

## Files Changing

| File | Change |
|---|---|
| `components/results/FullReport.tsx` | Stronger shadow, score label wrapper, context line for rank 0 |
| `components/results/ScoreGauge.tsx` | Score label helper function (optional — may not be needed if all label logic stays in FullReport) |

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*

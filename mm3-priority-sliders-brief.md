# Build Brief — MM3 Discover: Priority Sliders & Bucket Counters
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM3 sandbox UX improvement
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Replace the current 4-bucket pill/button priority system in MM3Discover.tsx with:

1. A bucket counter bar at the top showing fill status for each bucket
2. Individual sliders for each of the 13 lifestyle categories — 4 positions, left to right: Unassigned → Nice to Have → Important → Must Have
3. Snap-back behavior when a user tries to slide into a full bucket — full bucket flashes red briefly

All existing state logic, Supabase save, and city ranking computation stay exactly as-is. This is a UI replacement only — the underlying data structure (mustHaves, niceToHaves, notPriorities, unassigned arrays) does not change.

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## What Changes

Replace Section 4 — the priority bucket UI — with the new slider system. Everything else in MM3Discover stays exactly as-is.

---

## New State Needed

```typescript
const [flashBucket, setFlashBucket] = useState<string | null>(null)
```

Used to trigger the red flash on a full bucket when a slide is rejected.

---

## Helper — Get Current Bucket for a Category

```typescript
type BucketKey = 'mustHaves' | 'niceToHaves' | 'notPriorities' | 'unassigned'

function getBucket(key: keyof LifestyleScores): BucketKey {
  if (mustHaves.includes(key)) return 'mustHaves'
  if (niceToHaves.includes(key)) return 'niceToHaves'
  if (notPriorities.includes(key)) return 'notPriorities'
  return 'unassigned'
}
```

---

## Helper — Slider Position from Bucket

```typescript
// Slider positions: 0=Unassigned, 1=Nice to Have, 2=Important, 3=Must Have
const BUCKET_TO_POSITION: Record<BucketKey, number> = {
  unassigned: 0,
  notPriorities: 1,
  niceToHaves: 2,
  mustHaves: 3,
}

const POSITION_TO_BUCKET: Record<number, BucketKey> = {
  0: 'unassigned',
  1: 'notPriorities',
  2: 'niceToHaves',
  3: 'mustHaves',
}
```

---

## Helper — Handle Slider Change

```typescript
function handleSliderChange(key: keyof LifestyleScores, newPosition: number) {
  const targetBucket = POSITION_TO_BUCKET[newPosition]
  const currentBucket = getBucket(key)

  if (targetBucket === currentBucket) return

  // Check max limits
  if (targetBucket === 'mustHaves' && mustHaves.length >= 4) {
    // Flash red and snap back — do not move
    setFlashBucket('mustHaves')
    setTimeout(() => setFlashBucket(null), 600)
    return
  }
  if (targetBucket === 'niceToHaves' && niceToHaves.length >= 5) {
    setFlashBucket('niceToHaves')
    setTimeout(() => setFlashBucket(null), 600)
    return
  }

  // Remove from current bucket
  const setters: Record<BucketKey, React.Dispatch<React.SetStateAction<(keyof LifestyleScores)[]>>> = {
    mustHaves: setMustHaves,
    niceToHaves: setNiceToHaves,
    notPriorities: setNotPriorities,
    unassigned: setUnassigned,
  }
  setters[currentBucket](prev => prev.filter(k => k !== key))

  // Add to target bucket
  setters[targetBucket](prev => [...prev, key])
}
```

---

## New Section 4 — Bucket Counter Bar + Sliders

Replace the existing Section 4 JSX entirely with this:

```tsx
{/* Section 4 — Priority Sliders */}
<div className="mb-8">
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Adjust Your Priorities
  </p>
  <p className="text-xs mb-5" style={{ color: '#9A8E82' }}>
    Slide each category to assign its importance. Rankings update instantly.
    Move right to increase priority — move left to decrease.
  </p>

  {/* Bucket counter bar */}
  <div className="grid grid-cols-4 gap-2 mb-6">
    {[
      { key: 'mustHaves', label: 'Must Have', count: mustHaves.length, max: 4 },
      { key: 'niceToHaves', label: 'Important', count: niceToHaves.length, max: 5 },
      { key: 'notPriorities', label: 'Nice to Have', count: notPriorities.length, max: null },
      { key: 'unassigned', label: 'Unassigned', count: unassigned.length, max: null },
    ].map(bucket => {
      const isFull = bucket.max !== null && bucket.count >= bucket.max
      const isFlashing = flashBucket === bucket.key
      return (
        <div
          key={bucket.key}
          className="rounded-xl p-3 text-center transition-all"
          style={{
            backgroundColor: isFlashing
              ? '#FEE2E2'
              : isFull
              ? '#FEF3C7'
              : '#F7F6F3',
            border: isFlashing
              ? '1.5px solid #EF4444'
              : isFull
              ? `1.5px solid #F59E0B`
              : '1.5px solid transparent',
            transform: isFlashing ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p
            className="text-[10px] font-bold uppercase mb-1"
            style={{
              color: isFlashing ? '#DC2626' : isFull ? '#B45309' : '#9A8E82',
              letterSpacing: '0.08em',
            }}
          >
            {bucket.label}
          </p>
          <p
            className="text-lg font-bold tabular-nums"
            style={{
              color: isFlashing ? '#DC2626' : isFull ? '#B45309' : WARM_DARK,
            }}
          >
            {bucket.count}
            {bucket.max && (
              <span className="text-xs font-normal" style={{ color: '#9A8E82' }}>
                /{bucket.max}
              </span>
            )}
          </p>
          {isFull && !isFlashing && (
            <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#B45309' }}>
              FULL
            </p>
          )}
          {isFlashing && (
            <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#DC2626' }}>
              MAX REACHED
            </p>
          )}
        </div>
      )
    })}
  </div>

  {/* Slider legend */}
  <div className="flex justify-between text-[10px] font-semibold uppercase mb-3 px-1"
       style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
    <span>Unassigned</span>
    <span>Nice to Have</span>
    <span>Important</span>
    <span>Must Have</span>
  </div>

  {/* Category sliders */}
  <div className="space-y-4">
    {LIFESTYLE_CATEGORIES.map(cat => {
      const currentBucket = getBucket(cat.key)
      const position = BUCKET_TO_POSITION[currentBucket]

      return (
        <div key={cat.key} className="flex items-center gap-3">
          {/* Category icon + label */}
          <div className="flex items-center gap-2 w-36 shrink-0">
            <span className="text-base">{cat.icon}</span>
            <span className="text-xs font-semibold truncate" style={{ color: WARM_DARK }}>
              {cat.label}
            </span>
          </div>

          {/* Slider */}
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={position}
              onChange={e => handleSliderChange(cat.key, parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: position === 0
                  ? '#E5E7EB'
                  : position === 1
                  ? `linear-gradient(to right, #9CA3AF ${(position/3)*100}%, #E5E7EB ${(position/3)*100}%)`
                  : position === 2
                  ? `linear-gradient(to right, #4B7A5E ${(position/3)*100}%, #E5E7EB ${(position/3)*100}%)`
                  : `linear-gradient(to right, ${GOLD} ${(position/3)*100}%, #E5E7EB ${(position/3)*100}%)`,
                accentColor: position === 3 ? GOLD : position === 2 ? '#4B7A5E' : '#9CA3AF',
              }}
            />
          </div>

          {/* Current bucket label */}
          <div className="w-20 shrink-0 text-right">
            <span
              className="text-[10px] font-bold uppercase"
              style={{
                color: position === 3 ? GOLD
                     : position === 2 ? '#4B7A5E'
                     : position === 1 ? '#6B7280'
                     : '#C5BFB8',
                letterSpacing: '0.06em',
              }}
            >
              {position === 3 ? 'Must Have'
             : position === 2 ? 'Important'
             : position === 1 ? 'Nice to Have'
             : 'Unassigned'}
            </span>
          </div>
        </div>
      )
    })}
  </div>
</div>
```

---

## Remove Old Code

Remove from MM3Discover.tsx:
- The `moveCategory` function (no longer needed)
- The old 4-bucket pill/button JSX (replaced above)
- The `BucketKey` type definition if it was defined locally (redefine it above `handleSliderChange` as shown)

Keep everything else exactly as-is:
- Financial sliders
- Live city rankings
- Commit button
- Post-commit view
- All state variables
- Supabase save logic

---

## Acceptance Criteria

- [ ] Bucket counter bar shows 4 counters: Must Have (X/4), Important (X/5), Nice to Have (X), Unassigned (X)
- [ ] Full buckets (Must Have at 4, Important at 5) show amber/yellow treatment with "FULL" label
- [ ] Sliding into a full bucket causes: red flash on counter, "MAX REACHED" label, slider snaps back, no move occurs
- [ ] Flash lasts ~600ms then clears
- [ ] Slider legend shows Unassigned | Nice to Have | Important | Must Have left to right
- [ ] All 13 category sliders render with icon and label
- [ ] Slider position reflects current bucket assignment
- [ ] Moving slider updates bucket arrays and live city rankings instantly
- [ ] Slider color reflects bucket — gold for Must Have, green for Important, gray for Nice to Have, light for Unassigned
- [ ] Current bucket label shows to the right of each slider
- [ ] moveCategory function and old pill/button UI removed
- [ ] All existing functionality preserved — financial sliders, rankings, commit button
- [ ] tsc --noEmit passes clean
- [ ] No any types

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*

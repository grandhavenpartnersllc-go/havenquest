# Build Brief — Navigator Tabs UI Refinement
**Project:** HavenQuest
**Date:** June 1, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — portal UX
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Two visual changes to the Navigator portal:

1. Add a journey progress bar to the dark welcome band
2. Move the MileMarker tabs from the dark band to the cream/beige content section — with pill-style styling

No logic changes. No data changes. Visual only.

---

## Files to Modify

| File | Change |
|---|---|
| `components/portal/StarterPortal.tsx` | Add progress bar to welcome band |
| `components/portal/NavigatorTabs.tsx` | Move to cream section, redesign as pill tabs |

---

## Change 1 — Progress Bar in Welcome Band

### Location
Inside the welcome band div in `StarterPortal.tsx`, below the existing greeting and date line.

### What to add
A slim journey progress bar showing how far along the user is in the Navigator.

```tsx
{/* Journey progress */}
<div className="mt-5">
  <div className="flex items-center justify-between mb-2">
    <p className="text-[11px] font-semibold" style={{ color: 'rgba(237,231,220,0.5)', letterSpacing: '0.12em' }}>
      YOUR NAVIGATOR JOURNEY
    </p>
    <p className="text-[11px]" style={{ color: 'rgba(237,231,220,0.4)' }}>
      MileMarker {currentMileMarker} of 10 — {MILEMARKER_NAMES[currentMileMarker]}
    </p>
  </div>
  {/* Track */}
  <div
    className="w-full rounded-full"
    style={{ backgroundColor: 'rgba(255,255,255,0.08)', height: '4px' }}
  >
    {/* Fill */}
    <div
      className="rounded-full transition-all duration-700"
      style={{
        backgroundColor: GOLD,
        height: '4px',
        width: `${((currentMileMarker - 1) / 9) * 100}%`,
      }}
    />
  </div>
</div>
```

### MILEMARKER_NAMES constant (add to StarterPortal.tsx or import from NavigatorTabs)
```typescript
const MILEMARKER_NAMES: Record<number, string> = {
  1: 'Explore',
  2: 'Discover',
  3: 'Decide',
  4: 'Connect',
  5: 'Plan',
  6: 'Prepare',
  7: 'Match',
  8: 'Engage',
  9: 'Contract',
  10: 'Home',
}
```

---

## Change 2 — Navigator Tabs Move to Cream Section

### Remove from dark band
The `<NavigatorTabs>` component currently renders on `backgroundColor: WARM_DARK`. Remove that background — the tabs will now sit in the cream content area.

### New structure in StarterPortal.tsx

Replace:
```tsx
{/* Navigator tabs */}
<NavigatorTabs ... />

{/* MileMarker content */}
<div className="max-w-5xl mx-auto px-5 py-8">
  <MileMarkerContent ... />
</div>
```

With:
```tsx
{/* Navigator + content — cream section */}
<div className="max-w-5xl mx-auto px-5 pt-6 pb-8">
  <NavigatorTabs
    currentMileMarker={currentMileMarker}
    activeMileMarker={activeMileMarker}
    onSelect={setActiveMileMarker}
  />
  <div className="mt-6">
    <MileMarkerContent ... />
  </div>
</div>
```

### Redesign NavigatorTabs.tsx — pill style on cream background

**Desktop tabs — new design:**

Each tab is a pill/button sitting on the cream background. Status determines color:

- **Complete** — green pill background (`#E8F5EE`), green text (`#2D7D4E`), green checkmark
- **Active** — gold pill background (`#FBF3E3`), gold text (`#B8912A`), gold dot, gold bottom border or underline
- **Locked** — no background, gray text (`rgba(0,0,0,0.25)`), small lock icon

Remove the dark band background from NavigatorTabs entirely. The component renders transparently on whatever background it sits on.

```tsx
{/* Desktop */}
<div className="hidden md:block">
  <div
    className="flex overflow-x-auto gap-1 pb-3 border-b"
    style={{
      scrollbarWidth: 'none',
      borderBottomColor: 'rgba(0,0,0,0.08)'
    } as React.CSSProperties}
  >
    {MILEMARKERS.map(mm => {
      const status = getStatus(mm.number, currentMileMarker)
      const isSelected = activeMileMarker === mm.number

      const pillBg =
        status === 'complete' ? '#E8F5EE' :
        isSelected ? '#FBF3E3' :
        'transparent'

      const textColor =
        status === 'complete' ? GREEN :
        isSelected ? GOLD :
        'rgba(0,0,0,0.25)'

      return (
        <button
          key={mm.number}
          onClick={() => onSelect(mm.number)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
          style={{
            backgroundColor: pillBg,
            color: textColor,
            border: isSelected ? `1.5px solid ${GOLD}` : '1.5px solid transparent',
          }}
        >
          {status === 'complete' && <Check size={11} />}
          {status === 'locked' && <Lock size={10} />}
          {status === 'active' && (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: GOLD }}
            />
          )}
          <span>{mm.number}. {mm.name}</span>
        </button>
      )
    })}
  </div>
</div>
```

**Mobile accordion — new design:**

Same logic, but now on the cream background. Update colors accordingly — text should be dark, not light.

```tsx
{/* Mobile */}
<div className="md:hidden border rounded-xl overflow-hidden mb-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
  {MILEMARKERS.map((mm, i) => {
    const status = getStatus(mm.number, currentMileMarker)
    const isSelected = activeMileMarker === mm.number

    const textColor =
      status === 'complete' ? GREEN :
      isSelected ? GOLD :
      'rgba(0,0,0,0.3)'

    const rowBg = isSelected ? '#FBF3E3' : 'transparent'

    return (
      <button
        key={mm.number}
        onClick={() => onSelect(mm.number)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{
          backgroundColor: rowBg,
          borderTop: i > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="flex items-center gap-2.5">
          {status === 'complete' && <Check size={13} style={{ color: GREEN }} />}
          {status === 'locked' && <Lock size={12} style={{ color: 'rgba(0,0,0,0.25)' }} />}
          {status === 'active' && (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: GOLD }}
            />
          )}
          <span className="text-xs font-semibold" style={{ color: textColor }}>
            {mm.number}. {mm.name}
          </span>
        </div>
        {isSelected
          ? <ChevronUp size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
          : <ChevronDown size={14} style={{ color: 'rgba(0,0,0,0.2)' }} />
        }
      </button>
    )
  })}
</div>
```

---

## Acceptance Criteria

- [ ] Progress bar appears in dark welcome band below greeting and date
- [ ] Progress bar fill is gold, width reflects currentMileMarker (e.g. MM2 = ~11% fill)
- [ ] Progress bar label shows "MileMarker X of 10 — [Name]"
- [ ] NavigatorTabs no longer has a dark background — renders transparently
- [ ] Tabs sit in the cream/beige content section
- [ ] Complete tabs show green pill background + green text + checkmark
- [ ] Active tab shows gold pill background + gold border + gold text
- [ ] Locked tabs show no background + gray text + lock icon
- [ ] Mobile accordion rows use dark text on cream background (not light text)
- [ ] Active mobile row has gold background highlight
- [ ] All existing tab click behavior preserved
- [ ] tsc --noEmit passes clean

---

*Brief prepared by Claude (COO) — June 1, 2026. Approved by Craig Asbach.*

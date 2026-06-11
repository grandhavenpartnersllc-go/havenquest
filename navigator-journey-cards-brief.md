# Build Brief — Navigator Journey Stacked Cards
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM1 visual impact
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

One file, one section. Replace the current inline list layout of the Navigator Journey in MM1Explore.tsx with full-width stacked cards — one card per MileMarker. Each card is its own moment with impact and breathing room.

---

## File to Change

`components/portal/milemarkers/MM1Explore.tsx`

No other files touched.

---

## What Changes

Replace the Section 4 Navigator Journey JSX (the `div` with className `space-y-2` and everything inside it) with the new stacked card layout below.

The `NAVIGATOR_STEPS` constant stays exactly as-is — do not change it.

---

## New Card Layout

Replace the current step list JSX with this:

```tsx
{/* Section 4 — Your Navigator Journey */}
<div className="mb-8">
  <p
    className="text-[10px] font-bold uppercase mb-6"
    style={{ color: GOLD, letterSpacing: '0.18em' }}
  >
    Your Navigator Journey
  </p>

  <div className="space-y-3">
    {NAVIGATOR_STEPS.map(step => {
      const isComplete = step.number < currentMileMarker
      const isActive = step.number === currentMileMarker
      const isUpcoming = step.number > currentMileMarker

      return (
        <div
          key={step.number}
          className="rounded-xl p-4"
          style={{
            backgroundColor: isComplete
              ? '#F0FAF4'
              : isActive
              ? '#FDFCFA'
              : '#FDFCFA',
            border: isActive
              ? `2px solid ${GOLD}`
              : isComplete
              ? '1.5px solid #C6E8D4'
              : '1.5px solid #E8E4DE',
            boxShadow: isActive
              ? '0 2px 12px rgba(184,145,42,0.12)'
              : '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Card header — number + name + status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* MileMarker number circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                style={{
                  backgroundColor: isComplete
                    ? '#2D7D4E'
                    : isActive
                    ? GOLD
                    : '#E8E4DE',
                  color: isComplete || isActive ? '#FFFFFF' : '#9A8E82',
                }}
              >
                {isComplete ? '✓' : step.number}
              </div>

              {/* MileMarker name */}
              <span
                className="font-bold text-[15px] tracking-tight"
                style={{
                  color: isComplete
                    ? '#2D7D4E'
                    : isActive
                    ? '#16120D'
                    : '#4B5563',
                }}
              >
                {step.name}
              </span>
            </div>

            {/* Status badge */}
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isComplete
                  ? '#E8F5EE'
                  : isActive
                  ? 'rgba(184,145,42,0.12)'
                  : '#F0EDE6',
                color: isComplete
                  ? '#2D7D4E'
                  : isActive
                  ? GOLD
                  : '#9A8E82',
              }}
            >
              {isComplete ? 'Complete' : isActive ? 'You Are Here' : 'Coming Up'}
            </span>
          </div>

          {/* Divider */}
          <div
            className="mb-3"
            style={{
              height: '1px',
              backgroundColor: isComplete
                ? '#C6E8D4'
                : isActive
                ? 'rgba(184,145,42,0.2)'
                : '#E8E4DE',
            }}
          />

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: isComplete
                ? '#4B7A5E'
                : isActive
                ? '#374151'
                : '#6B7280',
            }}
          >
            {step.description}
          </p>
        </div>
      )
    })}
  </div>
</div>
```

---

## Visual States

**Complete card (step.number < currentMileMarker):**
- Background: light green tint `#F0FAF4`
- Border: green `#C6E8D4`
- Number circle: green `#2D7D4E` with white checkmark
- Name: green `#2D7D4E`
- Status badge: "Complete" in green
- Description: muted green `#4B7A5E`

**Active card (step.number === currentMileMarker):**
- Background: cream `#FDFCFA`
- Border: gold `2px solid` with subtle gold shadow
- Number circle: gold `#B8912A` with white number
- Name: dark `#16120D`
- Status badge: "You Are Here" in gold
- Description: dark gray `#374151`

**Upcoming card (step.number > currentMileMarker):**
- Background: cream `#FDFCFA`
- Border: subtle `#E8E4DE`
- Number circle: light gray `#E8E4DE` with gray number
- Name: medium gray `#4B5563`
- Status badge: "Coming Up" in gray
- Description: light gray `#6B7280`

---

## Acceptance Criteria

- [ ] Navigator Journey section renders as stacked full-width cards — one per MileMarker
- [ ] 10 cards total — one for each MileMarker
- [ ] Complete cards (MM1 when currentMileMarker > 1) show green treatment + checkmark + "Complete" badge
- [ ] Active card shows gold border + gold circle + "You Are Here" badge
- [ ] Upcoming cards show subtle gray treatment + "Coming Up" badge
- [ ] Each card shows the MileMarker number, name, status badge, divider, and full description
- [ ] NAVIGATOR_STEPS constant unchanged — same copy, same structure
- [ ] No other sections of MM1Explore changed
- [ ] No other files changed
- [ ] tsc --noEmit passes clean
- [ ] No any types introduced

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*

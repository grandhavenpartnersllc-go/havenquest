# Claude Code Instructions — Navigator Tabs UI Refinement

## What You're Building

Two visual changes to the portal Navigator. Read the brief completely before touching any file.

---

## Before You Start

1. Read `navigator-tabs-ui-refinement-brief.md` completely
2. Read `components/portal/NavigatorTabs.tsx` in full
3. Read `components/portal/StarterPortal.tsx` — specifically the welcome band and the NavigatorTabs/MileMarkerContent section

Confirm back what you are changing before you start.

---

## Two Files Only

- `components/portal/StarterPortal.tsx` — add progress bar to welcome band, move tabs to cream section
- `components/portal/NavigatorTabs.tsx` — remove dark background, redesign as pill tabs on cream

No other files.

---

## Critical Rules

- No logic changes — visual only
- The MILEMARKER_NAMES constant can be defined locally in StarterPortal or imported from NavigatorTabs — your choice, pick the cleaner approach
- Progress bar width formula: `((currentMileMarker - 1) / 9) * 100` percent
- All existing click behavior preserved exactly
- tsc --noEmit must pass clean

---

## When Done

1. tsc --noEmit passes clean
2. All 12 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — June 1, 2026*

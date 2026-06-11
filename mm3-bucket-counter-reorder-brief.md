# Build Brief — MM3 Discover: Fix Bucket Counter Bar Order
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — counter bar is mirrored vs column grid
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## The Problem

The bucket counter bar at the top of the priority grid renders in a different order than the column grid below it.

**Counter bar (current):** Must Have | Important | Nice to Have | Unassigned
**Column grid (current):** Unassigned | Nice to Have | Important | Must Have

They are completely mirrored. The counter tiles need to align directly above their corresponding columns.

**Correct order for both:** Unassigned | Nice to Have | Important | Must Have

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## Change — Reorder Bucket Counter Bar Array

Find the bucket counter bar grid array. It currently renders in this order:

```typescript
{ key: 'mustHaves',     label: 'Must Have',    count: mustHaves.length,     max: 4    },
{ key: 'niceToHaves',   label: 'Important',    count: niceToHaves.length,   max: 5    },
{ key: 'notPriorities', label: 'Nice to Have', count: notPriorities.length, max: null },
{ key: 'unassigned',    label: 'Unassigned',   count: unassigned.length,    max: null },
```

Replace with this order to match the column grid exactly:

```typescript
{ key: 'unassigned',    label: 'Unassigned',   count: unassigned.length,    max: null },
{ key: 'notPriorities', label: 'Nice to Have', count: notPriorities.length, max: null },
{ key: 'niceToHaves',   label: 'Important',    count: niceToHaves.length,   max: 5    },
{ key: 'mustHaves',     label: 'Must Have',    count: mustHaves.length,     max: 4    },
```

No other changes.

---

## Acceptance Criteria

- [ ] Counter bar order left to right: Unassigned | Nice to Have | Important | Must Have
- [ ] Column grid order left to right: Unassigned | Nice to Have | Important | Must Have
- [ ] Counter tiles align directly above their corresponding columns
- [ ] Must Have counter (gold/amber FULL state) appears on the far right — matching the Must Have column
- [ ] Flash behavior unchanged — flashing still triggers on the correct bucket
- [ ] tsc --noEmit passes clean
- [ ] No other changes

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*

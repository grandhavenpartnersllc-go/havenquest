# Claude Code Instructions — Metro Label + Badge Alignment Fix

## What You're Doing

Two small UI fixes across two files. Read `metro-label-badge-fix-brief.md` completely before touching anything.

---

## Before You Start

1. Read `metro-label-badge-fix-brief.md` completely
2. Read `components/results/FullReport.tsx` in full
3. Read `components/portal/SavedMatches.tsx` in full
4. Confirm back what you are changing before writing any code

---

## Two Files Only

- `components/results/FullReport.tsx`
- `components/portal/SavedMatches.tsx`

Nothing else.

---

## Important Note on SavedMatches.tsx

The `MatchCard` component inside `SavedMatches.tsx` uses a `t` object for theming with two states — primary (dark card) and non-primary (light card). You must add a `metro` key to both theme objects. Do not hardcode a color — use the `t.metro` reference in the JSX so both card styles render correctly.

---

## When Done

1. `tsc --noEmit` passes clean
2. All acceptance criteria pass
3. Commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*

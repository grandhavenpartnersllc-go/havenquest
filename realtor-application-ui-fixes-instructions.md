# Claude Code Instructions — Realtor Application UI Fixes

## What You're Building

Six targeted UI fixes across two components. Read `realtor-application-ui-fixes-brief.md` completely before writing any code.

---

## Before You Start

1. Read `realtor-application-ui-fixes-brief.md` completely
2. Read `components/for-realtors/ForRealtorsClient.tsx` in full
3. Read `components/realtors/FullApplicationClient.tsx` in full
4. Confirm back exactly what you are changing before writing any code

---

## Two Files Only

- `components/for-realtors/ForRealtorsClient.tsx`
- `components/realtors/FullApplicationClient.tsx`

No other files.

---

## Critical Notes

**Phone formatting:** Store raw digits in state, display formatted value in input. Never submit the formatted string to the API — submit raw digits only.

**Dollar volume formatting:** Store raw numeric value in state for calculations. The total row already calculates from raw values — do not break that. Display formatted value in input only.

**Zones modal:** Build inline in ForRealtorsClient.tsx — no new component file needed. The zone options are already in the market specialty dropdown in the same file — reuse that same data for the modal content.

**TREC validation:** Validate on submit only — do not block typing.

---

## When Done

1. `tsc --noEmit` passes clean
2. All 15 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*

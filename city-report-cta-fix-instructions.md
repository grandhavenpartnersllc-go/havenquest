# Claude Code Instructions — City Report CTA Fix

## What You're Building

Two fixes to the city report page CTA section. Read `city-report-cta-fix-brief.md` completely before writing any code.

---

## Before You Start

1. Read `city-report-cta-fix-brief.md` completely
2. Find and read the city report page — likely `app/report/[citySlug]/page.tsx` or a component it uses
3. Find and read the results page — `app/results/[sessionId]/page.tsx`
4. Locate the existing email gate component and how it is currently triggered
5. Confirm back exactly what you are changing before writing any code

---

## Two Changes Only

**Change 1 — CTA copy** in the city report page
**Change 2 — Button destination + gate=open param** in results page

No other files touched unless required to implement the gate=open trigger.

---

## Critical Notes

- The email gate modal already exists and works on the results page — do not rebuild it
- The `?gate=open` param approach should trigger the existing modal to open on mount
- If sessionId cannot be recovered from localStorage or context, fall back to `/explore` — do not break the page for direct/SEO traffic
- Never hardcode a sessionId

---

## When Done

1. `tsc --noEmit` passes clean
2. All 6 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*

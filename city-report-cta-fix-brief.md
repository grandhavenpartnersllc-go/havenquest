# Build Brief — City Report CTA Fix
**Project:** HavenQuest
**Date:** May 30, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — affects core conversion flow
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Problem

The city report page (`/report/[citySlug]`) has a CTA section at the bottom with two issues:

**Bug 1 — Wrong copy**
The headline says "See how [City] fits your income and lifestyle" — but the user already ran the quiz, already matched to this city, and is already reading the report. The copy makes no sense in context.

**Bug 2 — Wrong destination**
The "Get My Personalized Report" button navigates to the quiz (`/explore` or `/`) instead of the email gate. The user needs to be taken to the email gate to create their portal account and unlock their other city matches.

---

## Fix 1 — Update CTA Copy

Find the CTA section at the bottom of the city report page. It currently reads something like:

> "See how [City] fits your income and lifestyle"
> "Get a personalized affordability breakdown and matched realtors — free."
> Button: "Get My Personalized Report →"

Replace with:

**Headline:**
> "Your other matches are waiting."

**Subhead:**
> "Create your free portal to unlock your full results — including your #2 and #3 city matches, affordability breakdown, and matched realtors."

**Button:**
> "Unlock My Full Report →"

---

## Fix 2 — Fix Button Destination

The button must open the email gate modal — the same "Get your free full report" modal that appears on the results page (`/results/[sessionId]`).

### Preferred approach:
If the user arrived at the city report from their results page session, the button should navigate back to `/results/[sessionId]` with a query parameter that triggers the email gate to open automatically on load.

Example: `/results/[sessionId]?gate=open`

The results page reads the `gate=open` param on mount and opens the email gate modal immediately.

### Fallback approach (if sessionId is not available):
If there is no session context (user arrived at the report directly via URL), the button navigates to `/explore` to start the quiz. This is acceptable for direct/SEO traffic — they haven't run the quiz yet.

### How to determine which path to use:
- Check if a `sessionId` exists in localStorage or URL context from the results page
- If yes → navigate to `/results/[sessionId]?gate=open`
- If no → navigate to `/explore`

---

## Files to Modify

| File | Change |
|---|---|
| `app/report/[citySlug]/page.tsx` OR the CTA component used within it | Update copy and button destination |
| `app/results/[sessionId]/page.tsx` | Read `gate=open` query param on mount and open email gate modal if present |

Locate the exact files before editing — read the current implementation first.

---

## Acceptance Criteria

- [ ] CTA headline reads "Your other matches are waiting."
- [ ] CTA subhead reads "Create your free portal to unlock your full results — including your #2 and #3 city matches, affordability breakdown, and matched realtors."
- [ ] Button reads "Unlock My Full Report →"
- [ ] Button navigates to `/results/[sessionId]?gate=open` when session exists
- [ ] Email gate modal opens automatically when `?gate=open` param is present on results page
- [ ] Button navigates to `/explore` when no session exists (fallback)
- [ ] `tsc --noEmit` passes clean

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*

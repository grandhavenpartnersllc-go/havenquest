# Fix Brief — MM3 "View Full Report" Still Not Navigating
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Read then fix
**Priority:** P2 — broken CTA
**Report back:** Confirm fix complete, describe what changed

---

## Context

A previous fix changed the "View full report" button in the MM3 city detail popup
from a <button> to an <a> tag with href={`/report/${cityPopup.location.id}`}.
The fix was reported as applied but the button still does nothing when clicked.

---

## Read First — Find the Actual Popup Component

1. Search for the city detail popup rendered in MM3. It opens when the user clicks
   "Learn more →" on a city in the Live City Rankings list. Find every place in
   MM3Discover.tsx where this popup is rendered or referenced.

2. Report:
   - Is there more than one popup or city detail component being rendered in MM3?
   - Find the exact element that renders "View full report" — what is its current
     tag (button, a, div), its current href or onClick, and what file/line it is on
   - What is the value of cityPopup.location.id for a city like Cedar Park?
     Does it match the slug format used by app/report/[citySlug]/page.tsx?
     (e.g. does the route expect "cedar-park-tx" but the id is "cedar-park" or
     something else?)

3. Check app/report/[citySlug]/page.tsx — what slug format does it expect?
   How does it look up the city from the slug? Report the exact param name and
   lookup logic.

4. Check what the working "Full report ↓" links in MM2 (SavedMatches.tsx) use
   as their href — report the exact value.

---

## Fix

Once you have confirmed:
- The exact component and line where "View full report" lives
- The correct slug/id format the report page expects
- Why the current implementation isn't navigating

Apply the targeted fix so "View full report" navigates to the correct city report page.
Use Next.js router.push() or a plain <a> tag — whichever matches the pattern used
elsewhere in the portal for navigation. Do not use window.location if the rest of
the app uses Next.js router.

---

## Acceptance Criteria

- [ ] Click "Learn more →" on any city in MM3 Live City Rankings — popup opens
- [ ] Click "View full report" in the popup — navigates to that city's full report
- [ ] Navigation works for at least Cedar Park, Round Rock, and San Marcos
- [ ] tsc --noEmit clean

Report back: exact file and line changed, what the href or navigation now points to,
and confirm tested.

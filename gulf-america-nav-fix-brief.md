# Build Brief — Gulf of America & Nav Update
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Two unrelated fixes in one pass.

---

## Change 1 — Gulf of Mexico → Gulf of America

### Rule
Anywhere in the codebase that references "Gulf of Mexico" must be updated to "Gulf of America." This is a standing content standard — all future content must also use Gulf of America.

### File: `data/cities.ts`

Search for every instance of "Gulf of Mexico" and replace with "Gulf of America."

Known instances — Corpus Christi narrative:
```
"Corpus Christi is Texas's coastal city — and it makes the most of it. The Gulf of Mexico is a daily presence..."
```
Replace "Gulf of Mexico" with "Gulf of America" — twice in the Corpus Christi entry.

Search the entire file for any other instances and replace all.

### Search all other files
Search the entire codebase for "Gulf of Mexico" — components, pages, email templates, any file. Replace every instance with "Gulf of America."

---

## Change 2 — Move "For Realtors" from Main Nav to Footer

### Goal
Remove the "For Realtors" link from the primary navigation bar on the landing page. Add it to the footer instead. The link stays accessible but is no longer prominent in the primary nav.

### Files to check
Find where the main navigation is rendered — likely `components/layout/Header.tsx` or `app/layout.tsx` or similar. Read the file before making changes.

Find where the footer is rendered — likely `components/layout/Footer.tsx` or within the same layout file.

### Change
- Remove "For Realtors" link from the main nav bar
- Add "For Realtors" link to the footer alongside existing footer links
- Style it consistently with other footer links — same font size, same color, same treatment
- The link destination stays the same (`/for-realtors`)

---

## Acceptance Criteria

- [ ] "Gulf of Mexico" replaced with "Gulf of America" in all instances across the codebase
- [ ] Corpus Christi narrative updated — both instances
- [ ] "For Realtors" removed from main navigation bar
- [ ] "For Realtors" added to footer
- [ ] Footer link goes to /for-realtors
- [ ] tsc --noEmit passes clean
- [ ] No other nav or footer links changed

---

*Brief prepared by Claude (COO) — June 2, 2026.*

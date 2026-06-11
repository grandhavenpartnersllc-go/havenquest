# Read Brief — MM3 Metro Auto-Selection Not Working
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Read only — do not change anything yet
**Priority:** P1 — regression from today's fix
**Report back:** Answer all questions below, paste findings to Claude chat

---

## The Problem

The fix applied earlier today was supposed to set MM3's default metro tab to the metro
of the user's #1 top match (e.g. Round Rock → Austin metro → open on Austin tab).

Instead MM3 is opening on the Houston tab. When the user manually switches to Austin,
everything works correctly. The auto-selection on load is failing.

---

## Questions to Answer

### 1. The metro initialization useEffect

Find the useEffect in MM3Discover.tsx that sets selectedMetro on mount.

**Report:**
- What is the exact current code of that useEffect — full block including dependencies array
- What value does `matches[0]?.location.metroUsed` actually contain for an Austin-matched user?
  Check what the metroUsed field looks like on a city object — is it "Austin", "Austin, TX",
  "Austin-Round Rock", or something else?
- What are the valid tab values for selectedMetro? What strings does the metro tab selector
  accept — exactly "Austin", "DFW", "Houston", "San Antonio"?
- Is there a mismatch between what metroUsed returns and what the tab selector expects?

### 2. What is the default value of selectedMetro?

**Report:**
- What is selectedMetro initialized to? Empty string, null, "Houston", or something else?
- If it initializes to "Houston" that would explain the bug — report exactly what useState
  initializes it to

### 3. Timing — is matches populated when the useEffect fires?

**Report:**
- When MM3Discover mounts, is the matches prop already populated with data, or could it
  be an empty array on first render that gets populated later?
- If matches is empty on mount, matches[0] would be undefined and the useEffect guard
  `if (selectedMetro !== '')` would prevent it from re-running when matches arrive
- Does the useEffect dependency array include matches? If not, it won't re-fire when
  matches populate

### 4. What is the full list of metro tab values?

Find where the metro tabs are defined or rendered in MM3Discover.tsx.

**Report:**
- What are the exact string values for each metro tab — character for character
- In what order do they appear (Austin first? Houston first?)

---

## What to Paste Back

Answer all four questions with exact code snippets where relevant.
Do not make any changes. Claude will write the fix.

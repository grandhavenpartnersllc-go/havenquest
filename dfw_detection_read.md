# Read Brief — DFW Metro Detection Still Failing
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Read only — do not change anything
**Priority:** P1
**Report back:** Answer all questions, paste to Claude chat

---

## Context

After all fixes today, MM3 is still defaulting to Austin when the user's top match
is a DFW city (Plano). Additionally the anchor panel showing the user's saved top 3
is not visible in MM3.

---

## Questions

### 1. Confirm the current metro detection useEffect in MM3Discover.tsx

Report the exact current code of the useEffect that sets selectedMetro — full block
including the METRO_OPTIONS array and dependencies. Confirm whether today's fix
(m.value instead of m.label) is actually present in the current file on disk.

### 2. What is the metroUsed value for Plano, McKinney, and Frisco?

Find the city data file (likely services/locationService.ts or a data JSON file).
Report the exact metroUsed string for:
- Plano
- McKinney  
- Frisco

Does it contain 'Dallas'? Report the exact string character for character.

### 3. Is the anchor panel rendering?

Find the anchor panel added today — the "Your Top Matches" section above the metro
explorer in MM3Discover.tsx. Report:
- Is it present in the current file?
- What is the condition that controls whether it renders?
- Could matches.length === 0 be causing it not to render?

### 4. What is in sessionStorage hq_matches after the DFW quiz run?

Add a temporary console.log inside the StarterPortal sessionStorage read path:
console.log('hq_matches from sessionStorage:', rawMatches)

Report what it contains — specifically what is matches[0].location.metroUsed.

Do not leave the console.log in — remove it after reporting.

---

## What to Paste Back

Exact code snippets for questions 1-3. Console output for question 4.
No changes beyond the temporary log. Claude will write the fix.

# Claude Code Instructions — Navigator MileMarker Framework

## What You're Building

A 10-MileMarker Navigator framework wrapped around the existing portal. Read the brief completely before writing a single line of code.

---

## Before You Start

1. Read `navigator-milemarker-framework-brief.md` completely
2. Read `components/portal/StarterPortal.tsx` in full
3. Read `app/portal/page.tsx`
4. Read `types/index.ts` — understand UserSession, UserProfile, CityMatch
5. Read `utils/constants.ts` — understand existing constants

Confirm back exactly what files you are creating and modifying before you start.

---

## Critical Rules

- ALL existing portal content must be preserved and functional inside MM2 — Discover
- Do not change any existing logic — only wrap it in the new structure
- currentMileMarker defaults to 2 — all existing users land on Discover
- activeMileMarker starts at currentMileMarker on load
- Mobile breakpoint: < 768px → accordion. >= 768px → horizontal tabs
- Use existing color constants from StarterPortal — do not introduce new color values
- No any types
- tsc --noEmit must pass clean

---

## The One Thing That Cannot Break

The existing portal content — SavedMatches, FullReport, RealtorMatchSection, RelocationChecklist, NotesArea — must work exactly as it does today. It just lives inside the MM2 panel now instead of the full page.

---

## When Done

1. tsc --noEmit passes clean
2. All 18 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — June 1, 2026*

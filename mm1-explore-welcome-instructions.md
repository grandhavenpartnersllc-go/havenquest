# Claude Code Instructions — MM1 Explore Welcome Experience

## What You're Building

A rich welcome and summary experience for MM1 — Explore. Replaces the current simple completed-state card. Read the brief completely before writing any code.

---

## Before You Start

1. Read `mm1-explore-welcome-brief.md` completely
2. Read `components/portal/milemarkers/MM1Explore.tsx` — what you're replacing
3. Read `components/portal/MileMarkerContent.tsx` — you'll need to update prop passing
4. Read `components/portal/StarterPortal.tsx` — where state and Supabase calls live
5. Read `components/portal/SavedMatches.tsx` — for visual reference only, do NOT modify

Confirm back exactly what files you are changing before writing any code.

---

## Files to Change

Only these files:
- `components/portal/milemarkers/MM1Explore.tsx` — full replacement
- `components/portal/MileMarkerContent.tsx` — add new props, pass to MM1Explore
- `components/portal/StarterPortal.tsx` — add state, Supabase fetch/save, pass props

No other files.

---

## Critical Rules

- MM2Discover.tsx — do NOT touch
- SavedMatches.tsx — do NOT touch
- The horizontal city cards in MM1 are NEW components — do not reuse SavedMatches
- No compare feature in MM1 cards — that stays in MM2 only
- onboarding_acknowledged saves to Supabase — not just local state
- No any types
- tsc --noEmit must pass clean

---

## The One Thing That Cannot Break

MM2 — Discover must work exactly as it does today. All existing matches, reports, checklist, and notes must be unaffected.

---

## When Done

1. tsc --noEmit passes clean
2. All 15 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — June 1, 2026*

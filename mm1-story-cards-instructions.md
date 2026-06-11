# Claude Code Instructions — MM1 Story Cards

## What You're Building

Story-style city cards for MM1 — Welcome. Magazine layout, narrative-driven, image placeholder. Read the brief completely before writing any code.

---

## Before You Start

1. Read `mm1-story-cards-brief.md` completely
2. Read `types/index.ts` — Location interface
3. Read `data/cities.ts` — understand city data structure (read first 3 cities to understand the pattern, not all 101)
4. Read `components/portal/milemarkers/MM1Explore.tsx` — find HorizontalCityCard

Confirm back exactly what files you are changing before writing any code.

---

## Four Files Only

- `types/index.ts` — add two optional fields to Location
- `data/cities.ts` — add narratives and imageUrl to 20 specific cities
- `components/portal/milemarkers/MM1Explore.tsx` — replace HorizontalCityCard with StoryCityCard
- `public/images/texas-flag.svg` — CREATE new file

No other files.

---

## Critical Rules

- cityNarrative and cityImageUrl are OPTIONAL on Location — do not break the 81 cities that don't have them
- The fallback narrative must render for any city without a cityNarrative
- MM2Discover.tsx — do NOT touch
- SavedMatches.tsx — do NOT touch
- No score bars, no lifestyle data, no View Full Report button on MM1 story cards
- tsc --noEmit must pass clean
- No any types

---

## The One Thing That Cannot Break

The Location type change must be backward compatible. All 101 cities must still work. The two new fields are optional — undefined is valid.

---

## When Done

1. tsc --noEmit passes clean
2. All 16 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — June 1, 2026*

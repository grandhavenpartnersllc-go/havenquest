# Claude Code Instructions — Healthcare Category + Must Have Insights

## What You're Building

Three connected changes to add a healthcare lifestyle category, raise the Must Have cap to 4, and build the infrastructure for per-category insights in the full report. Read the brief completely before writing any code.

---

## Before You Start

1. Read `healthcare-category-insights-brief.md` completely
2. Read `types/index.ts` in full
3. Read `data/cities.ts` in full — understand the existing city data structure
4. Find the priority selector component and read it in full
5. Find `components/results/FullReport.tsx` and read it in full
6. Find everywhere `mustHaves` cap of 3 is enforced

Confirm back exactly what files you are changing and what you are adding before writing any code.

---

## Critical Rules

- Add `healthcare` to `LifestyleScores` — it must appear in the interface alongside all other scores
- The `categoryInsights` object must use the exact same keys as `LifestyleScores`
- Placeholder text format: "CONTENT PENDING — [Category] narrative for [City Name]." — exact format, city name filled in
- Never render placeholder content to users — check for "CONTENT PENDING" prefix and skip that card
- No any types
- No direct data imports in components — use locationService if needed

---

## When Done

1. `tsc --noEmit` passes clean
2. All 13 acceptance criteria pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*

# Build Brief — Healthcare Category + Must Have Insights Feature
**Project:** HavenQuest
**Date:** May 30, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — new lifestyle category + major report enhancement
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Three connected changes:

1. Add `healthcare` as a 13th lifestyle category
2. Raise Must Have cap from 3 to 4
3. Add a `categoryInsights` field to the Location type and city data — short narrative per category per city — rendered in the full report for any category the user marked Must Have

Content (the actual narratives) will be written in a dedicated session. This build creates the infrastructure and renders placeholder text so the feature is live and ready for content population.

---

## Change 1 — Add Healthcare Category

### types/index.ts
Add `healthcare` to `LifestyleScores` interface:

```typescript
export interface LifestyleScores {
  affordability: number
  schools: number
  safety: number
  walkability: number
  transit: number
  nightlife: number
  outdoors: number
  familyFriendly: number
  remoteWork: number
  lowTaxes: number
  weather: number
  traffic: number
  healthcare: number  // ADD THIS
}
```

### data/cities.ts
Add `healthcare` score to every city's `scores` object. Use these initial values based on known market data:

| City | Healthcare score |
|---|---|
| Houston | 98 |
| Austin | 85 |
| Dallas | 87 |
| San Antonio | 82 |
| The Woodlands | 88 |
| Plano | 84 |
| Frisco | 80 |
| McKinney | 78 |
| Sugar Land | 82 |
| Fort Worth | 80 |
| Round Rock | 76 |
| Cedar Park | 74 |
| Georgetown | 68 |
| Leander | 65 |
| Kyle | 62 |
| Pflugerville | 64 |
| New Braunfels | 66 |
| San Marcos | 63 |
| Waco | 70 |
| Corpus Christi | 72 |

### Priority selector component
Add healthcare as a new draggable category tile:
- Key: `healthcare`
- Label: `Healthcare`
- Description: `Hospitals, specialists, and medical access`
- Icon: use an appropriate Lucide icon — `Heart` or `Activity`

---

## Change 2 — Raise Must Have Cap from 3 to 4

### Find everywhere the Must Have maximum of 3 is enforced:
- The priority selector component — drag/drop validation
- The `UserProfile` type comment — update comment from `// max 3` to `// max 4`
- Any UI copy that says "Choose up to 3 Must Haves" — update to "Choose up to 4 Must Haves"
- The matching algorithm constants — if `MAX_MUST_HAVES = 3` exists, update to 4

---

## Change 3 — Category Insights Infrastructure

### types/index.ts
Add `CategoryInsights` interface and add it to `Location`:

```typescript
export interface CategoryInsights {
  affordability: string
  schools: string
  safety: string
  walkability: string
  transit: string
  nightlife: string
  outdoors: string
  familyFriendly: string
  remoteWork: string
  lowTaxes: string
  weather: string
  traffic: string
  healthcare: string
}

export interface Location {
  // ... all existing fields ...
  categoryInsights: CategoryInsights  // ADD THIS
}
```

### data/cities.ts
Add `categoryInsights` to every city with placeholder text for all 13 categories. Use this exact placeholder format so content team knows what to replace:

```typescript
categoryInsights: {
  affordability: "CONTENT PENDING — Affordability narrative for [City Name].",
  schools: "CONTENT PENDING — Schools narrative for [City Name].",
  safety: "CONTENT PENDING — Safety narrative for [City Name].",
  walkability: "CONTENT PENDING — Walkability narrative for [City Name].",
  transit: "CONTENT PENDING — Transit narrative for [City Name].",
  nightlife: "CONTENT PENDING — Nightlife narrative for [City Name].",
  outdoors: "CONTENT PENDING — Outdoors narrative for [City Name].",
  familyFriendly: "CONTENT PENDING — Family Friendly narrative for [City Name].",
  remoteWork: "CONTENT PENDING — Remote Work narrative for [City Name].",
  lowTaxes: "CONTENT PENDING — Low Taxes narrative for [City Name].",
  weather: "CONTENT PENDING — Weather narrative for [City Name].",
  traffic: "CONTENT PENDING — Traffic narrative for [City Name].",
  healthcare: "CONTENT PENDING — Healthcare narrative for [City Name].",
}
```

Replace `[City Name]` with the actual city name for each city so placeholders are identifiable.

### Full report component — Must Have Insights section
In `components/results/FullReport.tsx` (or wherever the full city report renders), add a new section that appears only when the user has Must Have priorities selected.

**Section placement:** After the lifestyle scores section, before the housing/market data section.

**Section title:** "Why [City] works for your must-haves"

**Logic:**
```typescript
const mustHaveInsights = profile.mustHaves
  .filter(category => location.categoryInsights[category])
  .map(category => ({
    category,
    label: CATEGORY_LABELS[category],  // use existing label map
    insight: location.categoryInsights[category],
    score: location.scores[category]
  }))
```

**Render each Must Have insight as a card:**
- Category label as card header (e.g. "Healthcare")
- Score badge (same styling as existing lifestyle badges)
- 2-3 sentence narrative from `categoryInsights[category]`
- If content is "CONTENT PENDING..." — do not render that card (hide placeholder content from users until real content is written)

**Empty state:** If all Must Have insights are pending, do not render the section at all. The section only appears when at least one Must Have has real content.

---

## Acceptance Criteria

- [ ] `healthcare` added to `LifestyleScores` interface in types/index.ts
- [ ] All 20 cities have a `healthcare` score in data/cities.ts
- [ ] Healthcare appears as a draggable tile in the priority selector
- [ ] Must Have cap raised to 4 everywhere it is enforced
- [ ] UI copy updated to "up to 4 Must Haves"
- [ ] `CategoryInsights` interface added to types/index.ts
- [ ] `categoryInsights` field added to `Location` interface
- [ ] All 20 cities have `categoryInsights` object with placeholder text for all 13 categories
- [ ] Full report renders "Why [City] works for your must-haves" section when Must Haves are selected
- [ ] Section only renders cards where content is NOT a placeholder
- [ ] Section does not render at all if all Must Have content is pending
- [ ] `tsc --noEmit` passes clean
- [ ] No `any` types introduced

---

## What Is NOT Being Built in This Brief

- The actual narrative content (written in next dedicated session)
- Any AI-powered dynamic content generation (Phase 2)
- Healthcare scoring methodology changes (scores above are initial estimates)

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*

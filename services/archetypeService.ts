import { ArchetypeKey, DNAScores } from '../types'

export interface ArchetypeWeighting {
  dnaWeight: number          // 0-1
  personalityWeight: number  // 0-1
  categoryAdjustments: Partial<Record<keyof DNAScores, number>>  // percentage-point shift, applied then renormalized
}

const ADJUSTMENT_STEP = 5 // percentage points per "increase"/"reduce" instruction — not specified numerically in the source spec; this is an explicit implementation choice, documented here rather than buried in code

export const ARCHETYPE_WEIGHTS: Record<ArchetypeKey, ArchetypeWeighting> = {
  family: {
    dnaWeight: 0.70,
    personalityWeight: 0.30,
    categoryAdjustments: { schoolQuality: ADJUSTMENT_STEP, familyLifestyle: ADJUSTMENT_STEP, diningEntertainment: -ADJUSTMENT_STEP },
  },
  firsttime: {
    dnaWeight: 0.65,
    personalityWeight: 0.35,
    // Source spec also said "increase Affordability" — Affordability is no longer a DNA category
    // (it's the Layer 1 Financial Modifier gate now), so that half of the instruction is dropped here.
    categoryAdjustments: { luxuryLifestyle: -ADJUSTMENT_STEP },
  },
  executive: {
    dnaWeight: 0.55,
    personalityWeight: 0.45,
    categoryAdjustments: {},
  },
  luxury: {
    dnaWeight: 0.50,
    personalityWeight: 0.50,
    categoryAdjustments: {},
  },
  retiree: {
    dnaWeight: 0.45,
    personalityWeight: 0.55,
    categoryAdjustments: { outdoorLifestyle: ADJUSTMENT_STEP, schoolQuality: -ADJUSTMENT_STEP, growthPotential: -ADJUSTMENT_STEP },
  },
  youngpro: {
    dnaWeight: 0.60,
    personalityWeight: 0.40,
    categoryAdjustments: { careerAccess: ADJUSTMENT_STEP, diningEntertainment: ADJUSTMENT_STEP, schoolQuality: -ADJUSTMENT_STEP },
  },
  general: {
    dnaWeight: 0.60,
    personalityWeight: 0.40,
    categoryAdjustments: {},
  },
}

// Base DNA category weights, post Weather-removal refinement (locked June 16, 2026)
export const BASE_DNA_WEIGHTS: Record<keyof DNAScores, number> = {
  schoolQuality: 0.22,
  familyLifestyle: 0.16,
  careerAccess: 0.16,
  outdoorLifestyle: 0.13,
  growthPotential: 0.13,
  diningEntertainment: 0.11,
  luxuryLifestyle: 0.09,
}

export function getWeightedDNACategories(archetype: ArchetypeKey): Record<keyof DNAScores, number> {
  const { categoryAdjustments } = ARCHETYPE_WEIGHTS[archetype]
  const adjusted: Record<keyof DNAScores, number> = { ...BASE_DNA_WEIGHTS }
  for (const key of Object.keys(adjusted) as (keyof DNAScores)[]) {
    const shift = categoryAdjustments[key] ?? 0
    adjusted[key] = adjusted[key] + shift / 100
  }
  const total = Object.values(adjusted).reduce((sum, w) => sum + w, 0)
  for (const key of Object.keys(adjusted) as (keyof DNAScores)[]) {
    adjusted[key] = adjusted[key] / total
  }
  return adjusted
}

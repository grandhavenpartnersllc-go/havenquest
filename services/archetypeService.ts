import { ArchetypeKey, DNAScores, DNABucket, WeightingProfile } from '../types'

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

export const WEIGHTING_MODEL_VERSION = '2.1'

// Interim weighting model (fix_priorities_and_interim_weighting, July 2026).
// Effective weight per category = archetype-adjusted baseline importance × tier
// multiplier — independent values, not additive percentage-point shifts forced to
// renormalize mid-calculation. Unassigned (never-touched) categories are
// deliberately preserved at their full baseline importance (1.0×), not penalized —
// the quiz can't yet distinguish "no opinion" from "actively rejected," so this is
// the conservative default until that distinction exists (see
// build_priorities_fourth_bucket.md). The gentler 1.5/1.25/1.0 curve (replacing the
// old, much more aggressive 3x/2x/1x framing) exists to limit noise amplification —
// large multipliers turn small, subjective 1-point differences in human-scored DNA
// data into outsized swings in the final ranking; gentler multipliers keep rankings
// more stable against that noise. It is not intended to (and cannot) prevent a
// category with a large combined baseline importance across several untouched
// categories from outweighing a single boosted selection — that's an accepted,
// known cost of preserving baseline weight for unassigned categories, deferred to
// the future Dynamic Zero-Out model (quiz redesign) to address properly.
export const TIER_MULTIPLIERS: Record<DNABucket, number> = {
  must_have: 2.5,
  important: 1.75,
  would_be_nice: 0.5,
  unassigned: 1.0,
}

export function applyClientWeighting(
  archetype: ArchetypeKey,
  clientBuckets: Record<keyof DNAScores, DNABucket>
): WeightingProfile {
  const archetypeWeights = getWeightedDNACategories(archetype)
  const clientAdjustments: Record<keyof DNAScores, number> = {} as Record<keyof DNAScores, number>
  const effectiveWeights: Record<keyof DNAScores, number> = {} as Record<keyof DNAScores, number>

  for (const key of Object.keys(archetypeWeights) as (keyof DNAScores)[]) {
    // Absent-from-all-buckets means the user expressed NO signal for this dim, which is
    // semantically 'unassigned' (1.0 baseline), NOT the deliberate low tier. Defaulting to
    // 'would_be_nice' (0.5 after Priority Engine B1) would silently halve any absent dim's
    // weight — including growthPotential/careerAccess once their selector lever is removed.
    const bucket = clientBuckets[key] ?? 'unassigned'
    const multiplier = TIER_MULTIPLIERS[bucket]
    clientAdjustments[key] = multiplier
    effectiveWeights[key] = archetypeWeights[key] * multiplier
  }

  // Single final scaling step — a true weighted average, naturally bounded to the
  // same 0-10 range as before. This replaces the old system's two-stage shift-then-
  // renormalize dance with one clean division, right at the end.
  const total = Object.values(effectiveWeights).reduce((sum, w) => sum + w, 0)
  const activeWeights: Record<keyof DNAScores, number> = {} as Record<keyof DNAScores, number>
  for (const key of Object.keys(effectiveWeights) as (keyof DNAScores)[]) {
    activeWeights[key] = total > 0 ? effectiveWeights[key] / total : 0
  }

  return {
    weightingModelVersion: WEIGHTING_MODEL_VERSION,
    archetypeWeights,
    clientBuckets,
    clientAdjustments,
    activeWeights,
  }
}

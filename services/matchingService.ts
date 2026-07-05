import { Location, UserProfile, CityMatch, FinancialPicture, ArchetypeKey, DNAScores, DNABucket, PersonalityPreference, WeightingProfile } from '../types'
import { generateZillowUrl } from '../utils/zillowUrl'
import { ARCHETYPE_WEIGHTS, BASE_DNA_WEIGHTS, applyClientWeighting } from './archetypeService'

export function getMonthlyHousingCost(city: Location): number {
  return Math.round(city.housing.medianHomePrice * 0.007)
}

// Standard 30-year amortization at 7.0% fixed rate
export function calculateMonthlyPayment(principal: number): number {
  if (principal <= 0) return 0
  const monthlyRate = 0.07 / 12
  const numPayments = 360
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
}

// A raw, unranged dollar figure (e.g. "$75,000", from MM3's sandbox override fields
// via fmtCurrency) vs. a quiz bucket-range label (e.g. "$50,000 – $100,000") are
// distinguished by the presence of a range separator/second $ sign. MM3 already has
// the client's exact figure -- short-circuit straight to it rather than losing that
// precision by forcing it through the bucket-label switch below, where it would
// silently miss every case and fall to a wrong hardcoded default
// (fix_mm3_financial_midpoint_fallback). Bucket labels never match this pattern, so
// the quiz/reveal path's behavior below is completely unaffected.
function parseRawDollarAmount(selection: string): number | null {
  if (!/^\$[\d,]+$/.test(selection)) return null
  const n = parseInt(selection.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? null : n
}

export function getDownPaymentMidpoint(selection: string): number {
  const raw = parseRawDollarAmount(selection)
  if (raw !== null) return raw
  switch (selection) {
    case 'Under $20,000':         return 10_000
    case '$20,000 – $50,000':    return 35_000
    case '$50,000 – $100,000':   return 75_000
    case '$100,000 – $200,000':  return 150_000
    case '$200,000 – $500,000':  return 350_000
    case '$500,000+':             return 600_000
    case "I'm not sure yet":      return 30_000
    default:                      return 30_000
  }
}

export function getProceedsMidpoint(selection: string | null): number {
  if (!selection) return 0
  const raw = parseRawDollarAmount(selection)
  if (raw !== null) return raw
  switch (selection) {
    case 'Under $50,000':         return 25_000
    case '$50,000 – $100,000':   return 75_000
    case '$100,000 – $200,000':  return 150_000
    case '$200,000 – $350,000':  return 275_000
    case '$350,000 – $500,000':  return 425_000
    case '$500,000 – $750,000':  return 625_000
    case '$750,000+':             return 850_000
    case "I'm not sure yet":      return 0
    default:                      return 0
  }
}

type Segment = 'Estate' | 'Luxury' | 'High' | 'Mid-Market' | 'Starter'

function deriveSegment(monthlyPayment: number, grossMonthlyIncome: number): Segment {
  if (monthlyPayment <= 0) return 'Estate'
  const pct = monthlyPayment / grossMonthlyIncome
  if (pct <= 0.25) return 'Luxury'
  if (pct <= 0.35) return 'High'
  if (pct <= 0.40) return 'Mid-Market'
  return 'Starter'
}

export interface FinancialFitResult {
  financialModifier: number   // 1.00 / 0.95 / 0.85 / 0.70 / 0.00
  financialFitScore: number   // 0-10, for MD visibility
  segment: Segment
}

// Layer 1 — Financial Modifier gate (graduated, locked refinement). Reuses the
// same down-payment / proceeds / mortgage-balance plumbing as the prior
// computeAffordability; only the final burden -> modifier/score mapping changed.
function calculateFinancialFit(
  cityMedianPrice: number,
  annualIncome: number,
  fp: FinancialPicture | undefined
): FinancialFitResult {
  const grossMonthlyIncome = annualIncome / 12

  let monthlyPayment: number
  let segment: Segment

  if (!fp) {
    monthlyPayment = cityMedianPrice * 0.007
    segment = monthlyPayment > grossMonthlyIncome * 0.40 ? 'Starter' : 'Mid-Market'
  } else if (fp.down_payment_available === '$500,000+') {
    const estateSegment = annualIncome >= 300_000 ? 'Estate' : 'Luxury'
    return { financialModifier: 1.00, financialFitScore: 10, segment: estateSegment }
  } else {
    const downPaymentMidpoint = getDownPaymentMidpoint(fp.down_payment_available)
    const proceedsMidpoint = fp.is_homeowner ? getProceedsMidpoint(fp.home_sale_proceeds) : 0
    const totalFunds = downPaymentMidpoint + proceedsMidpoint
    const mortgageBalance = Math.max(0, cityMedianPrice - totalFunds)
    monthlyPayment = calculateMonthlyPayment(mortgageBalance)
    segment = deriveSegment(monthlyPayment, grossMonthlyIncome)
  }

  const burden = monthlyPayment / grossMonthlyIncome

  let financialModifier: number
  let financialFitScore: number
  if (burden <= 0) {
    financialModifier = 1.00; financialFitScore = 10
  } else if (burden < 0.30) {
    financialModifier = 1.00; financialFitScore = 10
  } else if (burden < 0.40) {
    financialModifier = 0.95; financialFitScore = 8
  } else if (burden < 0.50) {
    financialModifier = 0.85; financialFitScore = 6
  } else if (burden < 0.70) {
    financialModifier = 0.70; financialFitScore = 4
  } else {
    financialModifier = 0.00; financialFitScore = 0  // mathematically impossible scenario, per locked refinement
  }

  return { financialModifier, financialFitScore, segment }
}

// Layer 2 — Community DNA™ (Functional Fit), blended with the client's Card 3 bucket
// choices (Brief 2a). General-purpose single-city entry point — getTopMatches below
// hoists applyClientWeighting out of its per-city loop instead of calling this,
// since the weighting profile is identical across all cities for one client.
export function calculateFunctionalFitScore(
  city: Location,
  archetype: ArchetypeKey,
  clientBuckets?: Record<keyof DNAScores, DNABucket>
): { score: number; weightingProfile: WeightingProfile } {
  const fullBuckets = clientBuckets ?? (Object.keys(BASE_DNA_WEIGHTS) as (keyof DNAScores)[])
    .reduce((acc, k) => ({ ...acc, [k]: 'would_be_nice' as DNABucket }), {} as Record<keyof DNAScores, DNABucket>)

  const weightingProfile = applyClientWeighting(archetype, fullBuckets)
  const raw = weightedDNASum(city, weightingProfile.activeWeights)
  return { score: Math.round(raw * 10) / 10, weightingProfile }
}

function weightedDNASum(city: Location, weights: Record<keyof DNAScores, number>): number {
  return Object.keys(weights).reduce(
    (sum, key) => sum + city.dna[key as keyof DNAScores] * weights[key as keyof DNAScores],
    0
  )
}

// As of fix_priorities_and_interim_weighting, notPriorities holds only genuine
// "Would Be Nice" picks — the never-touched set now lives in its own
// unassignedPriorities field (Card 3 no longer merges the two). Categories absent
// from all four arrays (shouldn't happen given Card 3's logic always places every
// category in exactly one of them, but handled defensively) default to
// 'would_be_nice' per the brief.
export function buildClientBuckets(profile: UserProfile): Record<keyof DNAScores, DNABucket> {
  const buckets = (Object.keys(BASE_DNA_WEIGHTS) as (keyof DNAScores)[])
    .reduce((acc, k) => ({ ...acc, [k]: 'would_be_nice' as DNABucket }), {} as Record<keyof DNAScores, DNABucket>)
  profile.mustHaves.forEach(k => { buckets[k] = 'must_have' })
  profile.niceToHaves.forEach(k => { buckets[k] = 'important' })
  profile.notPriorities.forEach(k => { buckets[k] = 'would_be_nice' })
  ;(profile.unassignedPriorities ?? []).forEach(k => { buckets[k] = 'unassigned' })
  return buckets
}

// Layer 3 — Community Personality (Emotional Fit)
export function calculateEmotionalFitScore(city: Location, preference: PersonalityPreference): number {
  const dims: (keyof PersonalityPreference)[] = ['growthProfile', 'pace', 'culture', 'environment', 'lifestyleOrientation']
  const totalDiff = dims.reduce((sum, dim) => sum + Math.abs(city.personality[dim] - preference[dim]), 0)
  const avgDiff = totalDiff / dims.length
  const score = 10 * (1 - avgDiff / 9) // 9 = max possible difference on a 1-10 scale
  return Math.round(Math.max(0, score) * 10) / 10
}

export function getTopMatches(
  profile: UserProfile,
  cities: Location[],
  limit = 3
): { topMatches: CityMatch[]; otherStrongMatches: CityMatch[] } {
  const archetype: ArchetypeKey = profile.archetype ?? 'general'
  const { dnaWeight, personalityWeight } = ARCHETYPE_WEIGHTS[archetype]
  const preference: PersonalityPreference = profile.personalityPreference ?? {
    growthProfile: 5, pace: 5, culture: 5, environment: 5, lifestyleOrientation: 5,
  }

  // Hoisted out of the per-city loop (Brief 2a Part 5) — the weighting profile only
  // depends on archetype + this client's Card 3 buckets, identical across all cities.
  const clientBuckets = buildClientBuckets(profile)
  const weightingProfile = applyClientWeighting(archetype, clientBuckets)

  const scored = cities.map(city => {
    const { financialModifier, financialFitScore, segment } = calculateFinancialFit(
      city.housing.medianHomePrice, profile.annualIncome, profile.financial_picture
    )
    const functionalFitScore = Math.round(weightedDNASum(city, weightingProfile.activeWeights) * 10) / 10
    const emotionalFitScore = calculateEmotionalFitScore(city, preference)
    const finalScore = financialModifier * (dnaWeight * functionalFitScore * 10 + personalityWeight * emotionalFitScore * 10)

    return {
      location: city,
      matchScore: Math.round(finalScore),
      financialFitScore,
      functionalFitScore,
      emotionalFitScore,
      affordabilityScore: Math.round(city.scores.affordability * 10),
      affordabilityFlag: financialModifier < 0.95,
      estimatedMonthlyHousing: getMonthlyHousingCost(city),
      estimatedMonthlyTotal: getMonthlyHousingCost(city) + city.housing.monthlyUtilities + city.housing.monthlyGroceries + city.housing.monthlyTransportation,
      zillowSearchUrl: generateZillowUrl(city, profile),
      segment,
    } as CityMatch
  })
  .filter(m => m.matchScore > 0 || m.financialFitScore > 0) // excludes true 0.00-modifier (impossible) cities

  const sorted = scored.sort((a, b) => b.matchScore - a.matchScore)
  const topMatches = sorted.slice(0, limit)

  // True rankings only — never reordered for diversity (locked refinement 4).
  // "Other Strong Matches": next-highest cities whose zone differs from any city already in topMatches.
  const usedZones = new Set(topMatches.map(m => m.location.zone))
  const otherStrongMatches = sorted
    .slice(limit)
    .filter(m => !usedZones.has(m.location.zone))
    .slice(0, 3)

  return { topMatches, otherStrongMatches }
}

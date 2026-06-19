import { UserProfile, FinancialPicture, QuizFinancialData, ArchetypeKey, PersonalityPreference } from '../types'

export function resolveArchetype(rawArchetype: string | undefined): ArchetypeKey {
  const valid: ArchetypeKey[] = ['family', 'firsttime', 'executive', 'luxury', 'retiree', 'youngpro']
  return (valid as string[]).includes(rawArchetype ?? '') ? (rawArchetype as ArchetypeKey) : 'general'
}

export function buildPersonalityPreference(session: {
  growth_profile?: number | null
  lifestyle_orientation?: number | null
  environment?: number | null
  pace?: number | null
  culture?: number | null
}): PersonalityPreference {
  return {
    growthProfile: session.growth_profile ?? 5,
    lifestyleOrientation: session.lifestyle_orientation ?? 5,
    environment: session.environment ?? 5,
    pace: session.pace ?? 5,
    culture: session.culture ?? 5,
  }
}

// Card 1 gives a raw household-size int (1-10); the existing UserProfile/matching
// algorithm only cares about the legacy bucketed enum (and never reads it for
// scoring), so this bucketing exists purely for type compatibility.
export function bucketHouseholdSize(raw: number): UserProfile['householdSize'] {
  if (raw <= 1) return '1'
  if (raw === 2) return '2'
  if (raw <= 4) return '3-4'
  return '5+'
}

export type MoveTimelineValue = '0-3months' | '3-6months' | '6-12months' | '12plus' | 'exploring'

// Card 7's 5-option timeline collapses into the legacy 4-value enum used by
// UserProfile/FinancialPicture. Confirmed unused in any scoring path today.
export function mapMoveTimeline(value: MoveTimelineValue): UserProfile['movingTimeline'] {
  if (value === '12plus') return 'exploring'
  return value
}

export type IncomeRangeValue = 'under75k' | '75to125k' | '125to200k' | '200to300k' | '300plus' | 'prefer_not_to_say'

const INCOME_MIDPOINTS: Record<IncomeRangeValue, number> = {
  under75k: 50_000,
  '75to125k': 100_000,
  '125to200k': 162_500,
  '200to300k': 250_000,
  '300plus': 350_000,
  // No bracket given — 162,500 is a neutral default (middle of the distribution)
  // rather than a guess at the "correct" income; only affects the affordability
  // threshold, not match scoring.
  prefer_not_to_say: 162_500,
}

export function incomeRangeMidpoint(value: IncomeRangeValue): number {
  return INCOME_MIDPOINTS[value]
}

export type AvailableFundsValue = 'under25k' | '25to75k' | '75to150k' | '150to300k' | '300plus' | 'not_sure'
export type HomeProceedsValue = 'under50k' | '50to150k' | '150to300k' | '300to500k' | '500plus'

// matchingService.getDownPaymentMidpoint / getProceedsMidpoint switch on exact
// existing literal strings. Card 9's brackets use different boundaries, so each
// is translated to the existing bucket whose upper bound is the nearest one at
// or below the new bracket's upper bound (a conservative, deterministic rule —
// Brief 2 replaces this whole calculation with the real financial modifier).
const FUNDS_TO_EXISTING_DOWNPAYMENT: Record<AvailableFundsValue, string> = {
  under25k: 'Under $20,000',
  '25to75k': '$20,000 – $50,000',
  '75to150k': '$50,000 – $100,000',
  '150to300k': '$100,000 – $200,000',
  '300plus': '$200,000 – $500,000',
  not_sure: "I'm not sure yet",
}

const PROCEEDS_TO_EXISTING: Record<HomeProceedsValue, string> = {
  under50k: 'Under $50,000',
  '50to150k': '$50,000 – $100,000',
  '150to300k': '$100,000 – $200,000',
  '300to500k': '$350,000 – $500,000',
  '500plus': '$500,000 – $750,000',
}

export interface Card9Answers {
  incomeRange: IncomeRangeValue
  proceedsApplicable: 'yes' | 'no' | 'not_sure'
  homeProceeds: HomeProceedsValue | null
  availableFunds: AvailableFundsValue
}

export function buildFinancialPicture(answers: Card9Answers, moveTimeline: MoveTimelineValue): FinancialPicture {
  return {
    is_homeowner: answers.proceedsApplicable === 'yes',
    home_sale_proceeds:
      answers.proceedsApplicable === 'yes' && answers.homeProceeds
        ? PROCEEDS_TO_EXISTING[answers.homeProceeds]
        : null,
    down_payment_available: FUNDS_TO_EXISTING_DOWNPAYMENT[answers.availableFunds],
    purchase_timeline: mapMoveTimeline(moveTimeline) as FinancialPicture['purchase_timeline'],
  }
}

const INCOME_RANGE_LABELS: Record<IncomeRangeValue, string> = {
  under75k: 'Under $75K',
  '75to125k': '$75K–$125K',
  '125to200k': '$125K–$200K',
  '200to300k': '$200K–$300K',
  '300plus': '$300K+',
  prefer_not_to_say: 'Prefer not to say',
}

const FUNDS_LABELS: Record<AvailableFundsValue, string> = {
  under25k: 'Under $25K',
  '25to75k': '$25K–$75K',
  '75to150k': '$75K–$150K',
  '150to300k': '$150K–$300K',
  '300plus': '$300K+',
  not_sure: 'Not sure yet',
}

const PROCEEDS_LABELS: Record<HomeProceedsValue, string> = {
  under50k: 'Under $50K',
  '50to150k': '$50K–$150K',
  '150to300k': '$150K–$300K',
  '300to500k': '$300K–$500K',
  '500plus': '$500K+',
}

// quiz_sessions.financial_data stores Card 9's own brackets verbatim (Part 4),
// not the translated values above — those are only for feeding the existing algorithm.
export function buildQuizFinancialData(answers: Card9Answers): QuizFinancialData {
  return {
    income_range: INCOME_RANGE_LABELS[answers.incomeRange],
    home_proceeds:
      answers.proceedsApplicable === 'yes' && answers.homeProceeds
        ? PROCEEDS_LABELS[answers.homeProceeds]
        : null,
    available_funds: FUNDS_LABELS[answers.availableFunds],
  }
}

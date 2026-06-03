import { Location, UserProfile, CityMatch, FinancialPicture } from '../types'
import { generateZillowUrl } from '../utils/zillowUrl'

export function calculateMatchScore(city: Location, profile: UserProfile): number {
  const mustHaveTotal = profile.mustHaves.reduce(
    (sum, key) => sum + city.scores[key] * 3, 0
  )
  const importantTotal = profile.niceToHaves.reduce(
    (sum, key) => sum + city.scores[key] * 2, 0
  )
  const wouldBeNiceTotal = profile.notPriorities.reduce(
    (sum, key) => sum + city.scores[key] * 1, 0
  )

  const rawScore = mustHaveTotal + importantTotal + wouldBeNiceTotal

  const maxMustHave = profile.mustHaves.length * 10 * 3
  const maxImportant = profile.niceToHaves.length * 10 * 2
  const maxWouldBeNice = profile.notPriorities.length * 10 * 1
  const maxScore = maxMustHave + maxImportant + maxWouldBeNice

  if (maxScore === 0) return 0
  return Math.round((rawScore / maxScore) * 100)
}

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

export function getDownPaymentMidpoint(selection: string): number {
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

interface AffordabilityResult {
  affordabilityFlag: boolean
  segment: Segment
}

function computeAffordability(
  cityMedianPrice: number,
  annualIncome: number,
  fp: FinancialPicture | undefined
): AffordabilityResult {
  const grossMonthlyIncome = annualIncome / 12
  const threshold = grossMonthlyIncome * 0.40

  if (!fp) {
    const roughPayment = cityMedianPrice * 0.007
    const flag = roughPayment > threshold
    return { affordabilityFlag: flag, segment: flag ? 'Starter' : 'Mid-Market' }
  }

  const downPaymentMidpoint = getDownPaymentMidpoint(fp.down_payment_available)
  const proceedsMidpoint = fp.is_homeowner
    ? getProceedsMidpoint(fp.home_sale_proceeds)
    : 0

  if (fp.down_payment_available === '$500,000+') {
    const segment = annualIncome >= 300_000 ? 'Estate' : 'Luxury'
    return { affordabilityFlag: false, segment }
  }

  const totalFunds = downPaymentMidpoint + proceedsMidpoint
  const mortgageBalance = Math.max(0, cityMedianPrice - totalFunds)

  if (mortgageBalance === 0) {
    return { affordabilityFlag: false, segment: 'Estate' }
  }

  const monthlyPayment = calculateMonthlyPayment(mortgageBalance)
  const affordabilityFlag = monthlyPayment > threshold
  const segment = deriveSegment(monthlyPayment, grossMonthlyIncome)

  return { affordabilityFlag, segment }
}

export function checkAffordabilityFlag(city: Location, profile: UserProfile): boolean {
  const { segment, affordabilityFlag } = computeAffordability(
    city.housing.medianHomePrice,
    profile.annualIncome,
    profile.financial_picture
  )
  const isLuxury = segment === 'Luxury' || segment === 'Estate'
  if (isLuxury) return false
  return affordabilityFlag
}

export function getAffordabilityRatio(city: Location, profile: UserProfile): number {
  const monthlyIncome = profile.annualIncome / 12
  const monthlyHousing = getMonthlyHousingCost(city)
  return monthlyHousing / monthlyIncome
}

export function getTopMatches(
  profile: UserProfile,
  cities: Location[],
  limit = 3
): CityMatch[] {
  const sorted = cities
    .map(city => ({ city, matchScore: calculateMatchScore(city, profile) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const topCities = sorted.slice(0, limit)
  if (topCities.length === 0) return []

  const topCityMedian = topCities[0].city.housing.medianHomePrice
  const { segment } = computeAffordability(
    topCityMedian,
    profile.annualIncome,
    profile.financial_picture
  )

  const isLuxury = segment === 'Luxury' || segment === 'Estate'

  return topCities.map(({ city, matchScore }) => {
    const affordabilityFlag = isLuxury
      ? false
      : computeAffordability(
          city.housing.medianHomePrice,
          profile.annualIncome,
          profile.financial_picture
        ).affordabilityFlag

    return {
      location: city,
      matchScore,
      affordabilityScore: Math.round(city.scores.affordability * 10),
      affordabilityFlag,
      estimatedMonthlyHousing: getMonthlyHousingCost(city),
      estimatedMonthlyTotal:
        getMonthlyHousingCost(city) +
        city.housing.monthlyUtilities +
        city.housing.monthlyGroceries +
        city.housing.monthlyTransportation,
      zillowSearchUrl: generateZillowUrl(city, profile),
      segment,
    }
  })
}

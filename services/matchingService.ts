import { Location, UserProfile, CityMatch } from '../types'
import { getAllCities } from './locationService'
import { generateZillowUrl } from '../utils/zillowUrl'
import { isLuxuryPreference } from '../utils/constants'

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

export function getMonthlyHousingCost(
  city: Location,
  preference: UserProfile['housingPreference']
): number {
  const h = city.housing
  switch (preference) {
    case 'rent1br': return h.avgRent1BR
    case 'rent2br': return h.avgRent2BR
    case 'rent3br': return h.avgRent3BR
    case 'buyStarter': return Math.round(h.starterHomePrice * 0.007)
    case 'buyMedian': return Math.round(h.medianHomePrice * 0.007)
    case 'luxuryHome': return Math.round(1_000_000 * 0.007)
    case 'luxuryEstate': return Math.round(2_000_000 * 0.007)
    case 'luxuryRental': return 5_000
    default: return h.avgRent2BR
  }
}

export function checkAffordabilityFlag(city: Location, profile: UserProfile): boolean {
  if (isLuxuryPreference(profile.housingPreference)) return false
  const monthlyIncome = profile.annualIncome / 12
  const monthlyHousing = getMonthlyHousingCost(city, profile.housingPreference)
  return monthlyHousing > monthlyIncome * 0.40
}

export function getAffordabilityRatio(city: Location, profile: UserProfile): number {
  const monthlyIncome = profile.annualIncome / 12
  const monthlyHousing = getMonthlyHousingCost(city, profile.housingPreference)
  return monthlyHousing / monthlyIncome
}

export function getTopMatches(
  profile: UserProfile,
  cities: Location[],
  limit = 3
): CityMatch[] {
  return cities
    .map(city => ({
      location: city,
      matchScore: calculateMatchScore(city, profile),
      affordabilityScore: Math.round(city.scores.affordability * 10),
      affordabilityFlag: checkAffordabilityFlag(city, profile),
      estimatedMonthlyHousing: getMonthlyHousingCost(city, profile.housingPreference),
      estimatedMonthlyTotal:
        getMonthlyHousingCost(city, profile.housingPreference) +
        city.housing.monthlyUtilities +
        city.housing.monthlyGroceries +
        city.housing.monthlyTransportation,
      zillowSearchUrl: generateZillowUrl(city, profile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

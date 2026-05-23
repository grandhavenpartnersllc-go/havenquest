import { Location, UserProfile } from '../types'

function getBedCount(preference: UserProfile['housingPreference']): string {
  if (preference === 'rent1br') return '1'
  if (preference === 'rent2br') return '2'
  if (preference === 'rent3br') return '3'
  return '3'
}

function getMaxBudget(profile: UserProfile): number {
  const monthlyIncome = profile.annualIncome / 12
  const maxMonthlyHousing = Math.round(monthlyIncome * 0.40)
  if (profile.housingPreference.startsWith('rent')) {
    return maxMonthlyHousing
  }
  return Math.round(profile.annualIncome * 4.5)
}

export function generateZillowUrl(city: Location, profile: UserProfile): string {
  const citySlug = city.name.replace(/\s+/g, '-')
  const pref = profile.housingPreference

  if (pref === 'luxuryHome') {
    return `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=1000000-`
  }
  if (pref === 'luxuryEstate') {
    return `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=2000000-`
  }
  if (pref === 'luxuryRental') {
    return `https://www.zillow.com/homes/for_rent/${citySlug}-TX_rb/?price=5000-`
  }

  const isRenting = pref.startsWith('rent')
  const maxBudget = getMaxBudget(profile)

  if (isRenting) {
    const beds = getBedCount(pref)
    return `https://www.zillow.com/homes/for_rent/${citySlug}-TX_rb/?beds=${beds}&price=0-${maxBudget}`
  }

  return `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=0-${maxBudget}`
}

import { Location, UserProfile } from '../types'

export function generateZillowUrl(city: Location, profile: UserProfile): string {
  const citySlug = city.name.replace(/\s+/g, '-')
  const pref = profile.housingPreference

  if (pref === 'luxuryHome') {
    return `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=1000000-`
  }
  if (pref === 'luxuryEstate') {
    return `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=2000000-`
  }

  const maxBudget = Math.round(profile.annualIncome * 4.5)
  const bp = profile.buyerProfile

  let url = `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=0-${maxBudget}`

  if (bp?.bedrooms != null) {
    url += `&beds=${bp.bedrooms}`
  }
  if (bp?.bathrooms != null) {
    url += `&baths=${bp.bathrooms}`
  }
  if (bp?.homeType === 'singleFamily') {
    url += `&home_type=house`
  } else if (bp?.homeType === 'townhome') {
    url += `&home_type=townhouse`
  } else if (bp?.homeType === 'condo') {
    url += `&home_type=condo_co-op`
  }
  if (bp?.constructionPreference === 'new') {
    url += `&built_since_year=2015`
  } else if (bp?.constructionPreference === 'resale') {
    url += `&built_before_year=2015`
  }

  return url
}

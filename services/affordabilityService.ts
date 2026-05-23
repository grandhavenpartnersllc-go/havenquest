import { Location, UserProfile } from '../types'
import { getMonthlyHousingCost } from './matchingService'
import { LUXURY_HOME_PRICE, LUXURY_ESTATE_PRICE } from '../utils/constants'

export function getMonthlyPropertyTax(city: Location, preference?: UserProfile['housingPreference']): number {
  const homePrice =
    preference === 'luxuryHome' ? LUXURY_HOME_PRICE :
    preference === 'luxuryEstate' ? LUXURY_ESTATE_PRICE :
    city.housing.medianHomePrice
  return Math.round((homePrice * city.housing.propertyTaxRate) / 12)
}

export function getTotalMonthlyEstimate(city: Location, profile: UserProfile): number {
  return (
    getMonthlyHousingCost(city, profile.housingPreference) +
    city.housing.monthlyUtilities +
    city.housing.monthlyGroceries +
    city.housing.monthlyTransportation
  )
}

export function getMonthlyIncomeRemaining(city: Location, profile: UserProfile): number {
  const monthlyIncome = profile.annualIncome / 12
  return Math.round(monthlyIncome - getTotalMonthlyEstimate(city, profile))
}

export function getHousingIncomePercent(city: Location, profile: UserProfile): number {
  const monthlyIncome = profile.annualIncome / 12
  const housing = getMonthlyHousingCost(city, profile.housingPreference)
  return Math.round((housing / monthlyIncome) * 100)
}

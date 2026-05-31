import { Location, UserProfile } from '../types'
import { getMonthlyHousingCost } from './matchingService'

export function getMonthlyPropertyTax(city: Location): number {
  return Math.round((city.housing.medianHomePrice * city.housing.propertyTaxRate) / 12)
}

export function getTotalMonthlyEstimate(city: Location, profile: UserProfile): number {
  return (
    getMonthlyHousingCost(city) +
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
  const housing = getMonthlyHousingCost(city)
  return Math.round((housing / monthlyIncome) * 100)
}

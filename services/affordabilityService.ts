import { Location, UserProfile } from '../types'
import { getMonthlyHousingCost } from './matchingService'

export function getMonthlyPropertyTax(city: Location): number {
  return Math.round((city.housing.medianHomePrice * city.housing.propertyTaxRate) / 12)
}

// AFFORD-FIX-1: property tax was omitted here while every surface that renders this
// total prints an "Est. monthly property tax" row directly above it (the web breakdown
// in AffordabilityBreakdown.tsx and the "Total All-In (est.)" line in the emailed PDF,
// pdfService.tsx). The printed rows did not sum to the printed total — by $1,027/mo on
// Coppell, up to $4,375/mo at the top of the dataset. This is a display-arithmetic fix
// only: the scoring path (matchingService.calculateFinancialFit) is untouched and still
// excludes property tax, which remains an open methodology question.
export function getTotalMonthlyEstimate(city: Location, profile: UserProfile): number {
  return (
    getMonthlyHousingCost(city) +
    getMonthlyPropertyTax(city) +
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

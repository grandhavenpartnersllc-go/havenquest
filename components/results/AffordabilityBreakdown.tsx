import { Location, UserProfile } from '../../types'
import { getMonthlyHousingCost } from '../../services/matchingService'
import {
  getMonthlyPropertyTax,
  getMonthlyIncomeRemaining,
  getHousingIncomePercent,
} from '../../services/affordabilityService'
import { formatCurrency } from '../../utils/formatting'
import AffordabilityWarning from './AffordabilityWarning'

interface AffordabilityBreakdownProps {
  city: Location
  profile: UserProfile
  showFlag: boolean
}

export default function AffordabilityBreakdown({ city, profile, showFlag }: AffordabilityBreakdownProps) {
  const monthlyHousing = getMonthlyHousingCost(city)
  const propertyTax = getMonthlyPropertyTax(city)
  const remaining = getMonthlyIncomeRemaining(city, profile)
  const percent = getHousingIncomePercent(city, profile)
  const monthlyIncome = Math.round(profile.annualIncome / 12)

  const rows = [
    { label: 'Est. monthly mortgage', value: monthlyHousing },
    { label: 'Est. monthly property tax', value: propertyTax },
    { label: 'Monthly utilities', value: city.housing.monthlyUtilities },
    { label: 'Monthly groceries', value: city.housing.monthlyGroceries },
    { label: 'Monthly transportation', value: city.housing.monthlyTransportation },
  ]

  // AFFORD-FIX-1: derived from the rows rendered below, not from a parallel sum, so a
  // row added here can never again be left out of the total. getTotalMonthlyEstimate
  // now agrees term-for-term (and still backs `remaining` above and the PDF report).
  const total = rows.reduce((sum, row) => sum + row.value, 0)

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Affordability breakdown</h3>

      {showFlag && (
        <div className="mb-4">
          <AffordabilityWarning cityName={city.name} percent={percent} />
        </div>
      )}

      <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-gray-600">{row.label}</span>
            <span className="text-sm font-medium tabular-nums">{formatCurrency(row.value)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3 bg-white rounded-b-lg">
          <span className="font-semibold text-gray-900">Total estimated monthly</span>
          <span className="font-semibold tabular-nums text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center px-1">
        <span className="text-sm text-gray-500">Monthly income</span>
        <span className="text-sm tabular-nums text-gray-500">{formatCurrency(monthlyIncome)}</span>
      </div>
      <div className="mt-1 flex justify-between items-center px-1">
        <span className="text-sm font-medium text-gray-700">Income remaining</span>
        <span
          className={`text-sm font-medium tabular-nums ${remaining >= 0 ? 'text-green-700' : 'text-red-600'}`}
        >
          {remaining >= 0 ? '+' : ''}{formatCurrency(remaining)}
        </span>
      </div>

      <p className="text-xs text-gray-400 mt-3 leading-relaxed italic">
        Affordability estimates assume a 30-year conventional loan at 7.0% fixed rate. FHA, VA, and USDA loan options may expand your range. Your Market Director will walk through your actual numbers with you.
      </p>
    </div>
  )
}

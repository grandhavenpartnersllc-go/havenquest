import { Location, UserProfile } from '../../types'
import { getMonthlyHousingCost } from '../../services/matchingService'
import {
  getMonthlyPropertyTax,
  getTotalMonthlyEstimate,
  getMonthlyIncomeRemaining,
  getHousingIncomePercent,
} from '../../services/affordabilityService'
import { formatCurrency } from '../../utils/formatting'
import { isLuxuryPreference } from '../../utils/constants'
import AffordabilityWarning from './AffordabilityWarning'

interface AffordabilityBreakdownProps {
  city: Location
  profile: UserProfile
  showFlag: boolean
}

export default function AffordabilityBreakdown({ city, profile, showFlag }: AffordabilityBreakdownProps) {
  const monthlyHousing = getMonthlyHousingCost(city, profile.housingPreference)
  const pref = profile.housingPreference
  const isLuxury = isLuxuryPreference(pref)
  const propertyTax = getMonthlyPropertyTax(city, pref)
  const total = getTotalMonthlyEstimate(city, profile)
  const remaining = getMonthlyIncomeRemaining(city, profile)
  const percent = getHousingIncomePercent(city, profile)
  const monthlyIncome = Math.round(profile.annualIncome / 12)

  const isBuying = pref.startsWith('buy') || pref === 'luxuryHome' || pref === 'luxuryEstate'

  const housingLabel =
    pref === 'luxuryHome' ? 'Est. luxury mortgage ($1M+ home)' :
    pref === 'luxuryEstate' ? 'Est. luxury mortgage ($2M+ estate)' :
    pref === 'luxuryRental' ? 'Luxury monthly rent ($5K+/mo)' :
    isBuying ? 'Est. monthly mortgage' : 'Monthly rent'

  const rows = [
    { label: housingLabel, value: monthlyHousing },
    ...(isBuying ? [{ label: 'Est. monthly property tax', value: propertyTax }] : []),
    { label: 'Monthly utilities', value: city.housing.monthlyUtilities },
    { label: 'Monthly groceries', value: city.housing.monthlyGroceries },
    { label: 'Monthly transportation', value: city.housing.monthlyTransportation },
  ]

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

      {isBuying && !isLuxury && (
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          Assumes 20% down payment, 6.5% 30-year fixed rate, median home price. Rates as of 05/2026.
        </p>
      )}

      {isLuxury && (
        <p className="text-xs text-gray-400 mt-3 italic">
          Luxury preference — affordability threshold not applied.
        </p>
      )}
    </div>
  )
}

import { CityMatch, UserProfile, LifestyleScores } from '../../types'
import { LIFESTYLE_CATEGORIES, TIER_LABELS } from '../../utils/constants'

const SCORE_TOOLTIPS: Partial<Record<keyof LifestyleScores, string>> = {
  affordability: 'Reflects market price level — not your personal budget fit',
  transit: 'Reflects public transit availability — bus, rail, light rail. Does not reflect road conditions or commute time.',
  traffic: 'Reflects road congestion and commute conditions — separate from public transit availability.',
  weather: 'Texas summers are hot and humid. Most cities average 90°F+ from June–September. Winters are mild with rare freezes.',
}
import { formatCurrency, formatPercentPlain } from '../../utils/formatting'
import ScoreGauge from '../shared/ScoreGauge'
import ScoreBar from '../shared/ScoreBar'
import MarketBadge from '../shared/MarketBadge'
import TEARatingBadge from '../shared/TEARatingBadge'
import AffordabilityBreakdown from './AffordabilityBreakdown'
import StrengthWeaknessGrid from './StrengthWeaknessGrid'
import MarketSnapshot from './MarketSnapshot'
import SchoolSnapshot from './SchoolSnapshot'
import ListingsButton from './ListingsButton'

interface FullReportProps {
  match: CityMatch
  profile: UserProfile
}

export default function FullReport({ match, profile }: FullReportProps) {
  const { location, matchScore, affordabilityFlag } = match
  const { housing } = location

  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)' }}>
      {/* Header */}
      <div className="bg-[#F8F9FB] border-b border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ScoreGauge score={matchScore} size={110} />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              {location.name}, {location.state}
            </h2>
            <p className="text-gray-400 text-sm mb-3">{location.county} County · {TIER_LABELS[location.tier]}</p>
            <div className="flex flex-wrap gap-2">
              <MarketBadge condition={location.market.marketCondition} />
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-100 px-2.5 py-1 rounded-full text-xs text-gray-500">
                <TEARatingBadge rating={location.school.teaRating} size="sm" />
                <span>TEA {location.school.teaRating} · {location.school.primaryISD}</span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mt-4">{location.description}</p>
      </div>

      <div className="p-6 space-y-8">
        <AffordabilityBreakdown city={location} profile={profile} showFlag={affordabilityFlag} />

        <hr className="border-gray-100" />

        <div>
          <h3 className="font-bold text-gray-900 tracking-tight mb-3">Lifestyle scores</h3>
          <p className="text-xs text-gray-400 mb-3">Scores highlighted in blue are your Must Haves.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {LIFESTYLE_CATEGORIES.map(cat => (
              <ScoreBar
                key={cat.key}
                label={cat.label}
                icon={cat.key}
                score={location.scores[cat.key]}
                highlighted={profile.mustHaves.includes(cat.key)}
                tooltip={SCORE_TOOLTIPS[cat.key]}
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        <StrengthWeaknessGrid city={location} />

        <hr className="border-gray-100" />

        <div>
          <h3 className="font-bold text-gray-900 tracking-tight mb-4">Price intelligence</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(([
              { label: 'Price per sq ft', value: formatCurrency(housing.pricePerSqFt) },
              { label: 'Starter home', value: formatCurrency(housing.starterHomePrice), subtext: 'Entry-level inventory' },
              { label: 'Median home', value: formatCurrency(housing.medianHomePrice), subtext: 'All home types' },
              { label: 'Property tax rate', value: formatPercentPlain(housing.propertyTaxRate * 100, 2) },
              { label: 'Est. monthly tax', value: formatCurrency(Math.round((housing.medianHomePrice * housing.propertyTaxRate) / 12)) },
            ]) as { label: string; value: string; subtext?: string }[]).map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="font-bold text-gray-900 tabular-nums text-sm">{item.value}</p>
                {item.subtext && <p className="text-xs text-gray-400 mt-0.5">{item.subtext}</p>}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        <MarketSnapshot city={location} />

        <hr className="border-gray-100" />

        <SchoolSnapshot city={location} />

        <hr className="border-gray-100" />

        <ListingsButton match={match} housingPreference={profile.housingPreference} />
      </div>
    </article>
  )
}

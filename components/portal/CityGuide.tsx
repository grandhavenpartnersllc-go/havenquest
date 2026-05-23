import { Location } from '../../types'
import { formatCurrency } from '../../utils/formatting'
import TEARatingBadge from '../shared/TEARatingBadge'
import { ExternalLink } from 'lucide-react'

interface CityGuideProps {
  city: Location
}

export default function CityGuide({ city }: CityGuideProps) {
  const keyFacts = [
    { label: 'Median home price', value: formatCurrency(city.housing.medianHomePrice) },
    { label: 'Property tax rate', value: `${(city.housing.propertyTaxRate * 100).toFixed(2)}%` },
    { label: 'School district', value: `${city.school.primaryISD} (TEA ${city.school.teaRating})` },
  ]

  return (
    <div>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5F54' }}>{city.description}</p>

      <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
        <p
          className="text-[10px] font-bold uppercase mb-3"
          style={{ color: '#B8912A', letterSpacing: '0.16em' }}
        >
          Key facts before you move
        </p>
        <ul className="space-y-2.5">
          {keyFacts.map((fact) => (
            <li key={fact.label} className="flex items-center justify-between text-sm">
              <span style={{ color: '#6B5F54' }}>{fact.label}</span>
              <span className="font-bold" style={{ color: '#1C1814' }}>{fact.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <TEARatingBadge rating={city.school.teaRating} size="sm" />
        <a
          href="https://tea.texas.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold flex items-center gap-1 transition-opacity"
          style={{ color: '#B8912A' }}
        >
          {city.school.primaryISD} report card <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

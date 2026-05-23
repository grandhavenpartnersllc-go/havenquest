import { Location } from '../../types'
import { CheckCircle, XCircle } from 'lucide-react'

interface StrengthWeaknessGridProps {
  city: Location
}

export default function StrengthWeaknessGrid({ city }: StrengthWeaknessGridProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Strengths &amp; weaknesses</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          {city.strengths.map((s, i) => (
            <div key={i} className="flex gap-2.5 p-3 bg-success-bg rounded-lg">
              <CheckCircle size={16} className="text-success-text shrink-0 mt-0.5" />
              <p className="text-sm text-success-text leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {city.weaknesses.map((w, i) => (
            <div key={i} className="flex gap-2.5 p-3 bg-warning-bg rounded-lg">
              <XCircle size={16} className="text-warning-text shrink-0 mt-0.5" />
              <p className="text-sm text-warning-text leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

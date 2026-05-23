import { Location } from '../../types'
import TEARatingBadge from '../shared/TEARatingBadge'
import { ExternalLink } from 'lucide-react'

interface SchoolSnapshotProps {
  city: Location
}

const ratingContext: Record<string, string> = {
  A: 'Exceptional district — consistently outperforms state standards.',
  B: 'Strong district — above average performance with solid trajectory.',
  C: 'Average district — research individual campuses before enrolling.',
  D: 'Below average — significant campuses underperforming; investigate carefully.',
  F: 'Failing district — consider private or charter alternatives.',
}

export default function SchoolSnapshot({ city }: SchoolSnapshotProps) {
  const { school } = city
  return (
    <div>
      <h3 className="font-bold text-gray-900 tracking-tight mb-4">School district</h3>

      <div className="flex items-center gap-3 mb-3">
        <TEARatingBadge rating={school.teaRating} size="lg" />
        <div>
          <p className="font-bold text-gray-900 tracking-tight">{school.primaryISD}</p>
          <p className="text-xs text-gray-400 mt-0.5">TEA Rating: {school.teaRating}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mb-3">{ratingContext[school.teaRating]}</p>

      <a
        href="https://tea.texas.gov"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-[#154d8a] transition-colors"
      >
        View TEA school report card <ExternalLink size={13} />
      </a>

      <p className="text-xs text-gray-400 mt-3">
        Most Texas districts open enrollment in spring. Data updated 05/2026.
      </p>
    </div>
  )
}

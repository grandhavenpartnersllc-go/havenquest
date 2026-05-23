'use client'

import { ExternalLink } from 'lucide-react'
import { CityMatch, UserProfile, UserSession } from '../../types'
import { logZillowClick } from '../../services/listingsService'
import { LOCAL_SESSION_KEY, isLuxuryPreference } from '../../utils/constants'

interface ListingsButtonProps {
  match: CityMatch
  housingPreference?: UserProfile['housingPreference']
}

export default function ListingsButton({ match, housingPreference }: ListingsButtonProps) {
  const isLuxury = housingPreference ? isLuxuryPreference(housingPreference) : false

  const handleClick = () => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_SESSION_KEY) : null
    const session: UserSession | null = raw ? JSON.parse(raw) : null
    logZillowClick(session?.userId ?? null, match.location.name)
  }

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <p className="font-medium text-gray-900 mb-1">
        {isLuxury ? `See luxury homes in ${match.location.name}` : `See available homes in ${match.location.name}`}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        {isLuxury ? 'Filtered to luxury listings matching your preference' : 'Filtered to your budget and bedroom preference'}
      </p>
      <a
        href={match.zillowSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-lg font-medium text-sm hover:bg-[#154d8a] transition-colors w-full justify-center"
      >
        Browse Homes on Zillow <ExternalLink size={15} />
      </a>
    </div>
  )
}

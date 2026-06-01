'use client'

import { useRouter } from 'next/navigation'
import { SESSION_ID_KEY } from '../../utils/constants'

export default function CityReportCTA() {
  const router = useRouter()

  const handleClick = () => {
    const sessionId = sessionStorage.getItem(SESSION_ID_KEY)
    if (sessionId) {
      router.push(`/results/${sessionId}?gate=open`)
    } else {
      router.push('/explore')
    }
  }

  return (
    <div className="bg-[#08101C] rounded-2xl p-6 text-center">
      <h3 className="font-bold text-white tracking-tight mb-1">
        Your other matches are waiting.
      </h3>
      <p className="text-white/45 text-sm mb-5">
        Create your free portal to unlock your full results — including your #2 and #3 city matches, affordability breakdown, and matched realtors.
      </p>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 bg-white text-gray-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.35)' }}
      >
        Unlock My Full Report →
      </button>
    </div>
  )
}

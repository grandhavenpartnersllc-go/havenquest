import { Check } from 'lucide-react'
import { UserSession } from '../../../types'

const WARM_DARK = '#16120D'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'
const GREEN = '#2D7D4E'

interface MM1ExploreProps {
  session: UserSession
}

export default function MM1Explore({ session }: MM1ExploreProps) {
  const formattedDate = new Date(session.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#E8F5EE' }}
        >
          <Check size={18} style={{ color: GREEN }} />
        </div>
        <div>
          <p
            className="text-[10px] font-bold uppercase mb-1"
            style={{ color: GREEN, letterSpacing: '0.18em' }}
          >
            Complete
          </p>
          <h2
            className="font-bold text-base tracking-tight mb-2"
            style={{ color: WARM_DARK }}
          >
            MM1 — Explore
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6B6259' }}>
            You discovered HavenQuest and began your relocation journey.
          </p>
          <p className="text-xs mt-2" style={{ color: '#9A8E82' }}>
            Joined {formattedDate}
          </p>
        </div>
      </div>
    </div>
  )
}

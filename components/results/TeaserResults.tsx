import { CityMatch } from '../../types'
import CityMatchCard from './CityMatchCard'
import { Lock } from 'lucide-react'

interface TeaserResultsProps {
  matches: CityMatch[]
  onUnlock: () => void
}

export default function TeaserResults({ matches, onUnlock }: TeaserResultsProps) {
  return (
    <div>
      <div className="space-y-4 mb-6">
        {matches.map((match, i) => (
          <div key={match.location.id} className="relative">
            <CityMatchCard match={match} rank={i + 1} blurred={i > 0} />
            {i > 0 && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-[3px]"
                style={{ background: 'rgba(244,245,247,0.72)' }}
              >
                <div className="text-center">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Lock size={14} className="text-gray-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Unlock with your free report</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="bg-white border border-gray-100 rounded-2xl p-7 text-center"
        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)' }}
      >
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          Your full HavenQuest report is ready
        </h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          Complete scores, cost breakdowns, school data, and matched realtors — free
        </p>
        <button
          onClick={onUnlock}
          className="bg-accent text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#154d8a] transition-colors"
          style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
        >
          Get My Full Report →
        </button>
      </div>
    </div>
  )
}

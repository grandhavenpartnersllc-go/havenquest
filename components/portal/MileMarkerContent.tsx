import { CityMatch, UserProfile, UserSession } from '../../types'
import MM1Explore from './milemarkers/MM1Explore'
import MM2Discover from './milemarkers/MM2Discover'
import MM3Decide from './milemarkers/MM3Decide'
import MM4to10 from './milemarkers/MM4to10'

interface MileMarkerContentProps {
  selectedMileMarker: number
  currentMileMarker: number
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
  onboardingAcknowledged: boolean
  onAcknowledge: () => void
  onAdvanceToDiscover: () => void
}

const MM_NAMES: Record<number, string> = {
  4: 'Connect',
  5: 'Plan',
  6: 'Prepare',
  7: 'Match',
  8: 'Engage',
  9: 'Contract',
  10: 'Home',
}

export default function MileMarkerContent({
  selectedMileMarker,
  currentMileMarker,
  matches,
  profile,
  session,
  onboardingAcknowledged,
  onAcknowledge,
  onAdvanceToDiscover,
}: MileMarkerContentProps) {
  switch (selectedMileMarker) {
    case 1:
      if (!profile) return null
      return (
        <MM1Explore
          matches={matches}
          profile={profile}
          session={session}
          currentMileMarker={currentMileMarker}
          onAdvanceToDiscover={onAdvanceToDiscover}
          onboardingAcknowledged={onboardingAcknowledged}
          onAcknowledge={onAcknowledge}
        />
      )
    case 2:
      return <MM2Discover matches={matches} profile={profile} />
    case 3:
      return <MM3Decide />
    default:
      if (selectedMileMarker >= 4 && selectedMileMarker <= 10) {
        return (
          <MM4to10
            mmNumber={selectedMileMarker}
            name={MM_NAMES[selectedMileMarker] ?? ''}
          />
        )
      }
      return null
  }
}

import { CityMatch, UserProfile, UserSession } from '../../types'
import MM1Explore from './milemarkers/MM1Explore'
import MM2Discover from './milemarkers/MM2Discover'
import MM3Discover from './milemarkers/MM3Discover'
import MM4Connect from './milemarkers/MM4Connect'
import MM4to10 from './milemarkers/MM4to10'

function CompletedCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: '#F0FAF4', border: '1.5px solid #C6E8D4' }}>
      <p className="text-[10px] font-bold uppercase mb-1" style={{ color: '#2D7D4E', letterSpacing: '0.18em' }}>
        Complete
      </p>
      <h2 className="font-bold text-base tracking-tight mb-2" style={{ color: '#16120D' }}>
        {name}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: '#4B7A5E' }}>
        {description}
      </p>
    </div>
  )
}

interface MileMarkerContentProps {
  selectedMileMarker: number
  currentMileMarker: number
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
  onboardingAcknowledged: boolean
  onAcknowledge: () => void
  onAdvanceToDiscover: () => void
  onAdvanceFromMM2: () => void
  onAdvanceToConnect: () => void
  initialChecklist: Record<string, boolean>
  initialNotes: string
}

const MM_NAMES: Record<number, string> = {
  4: 'Connect',
  5: 'Plan',
  6: 'Prepare',
  7: 'Match',
  8: 'Engage',
  9: 'Transition',
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
  onAdvanceFromMM2,
  onAdvanceToConnect,
  initialChecklist,
  initialNotes,
}: MileMarkerContentProps) {
  switch (selectedMileMarker) {
    case 1:
      return (
        <MM1Explore
          session={session}
          currentMileMarker={currentMileMarker}
          onAdvanceToDiscover={onAdvanceToDiscover}
          onboardingAcknowledged={onboardingAcknowledged}
          onAcknowledge={onAcknowledge}
        />
      )
    case 2:
      return (
        <MM2Discover
          matches={matches}
          profile={profile}
          initialChecklist={initialChecklist}
          initialNotes={initialNotes}
          onAdvanceToDiscover={onAdvanceFromMM2}
          email={session.email}
        />
      )
    case 3:
      if (selectedMileMarker < currentMileMarker) {
        return (
          <CompletedCard
            name="Refine"
            description="You explored your options and committed your direction."
          />
        )
      }
      if (selectedMileMarker === currentMileMarker) {
        const hqPath = typeof window !== 'undefined'
          ? sessionStorage.getItem('hq_path')
          : null

        if (hqPath === 'explore') {
          return (
            <MM3Discover
              matches={matches}
              profile={profile}
              session={session}
              onAdvanceToConnect={onAdvanceToConnect}
              initialMetro="State"
              initialCityIndex={0}
            />
          )
        }

        // hq_metro stores lowercase IDs ('austin', 'dallas', 'houston', 'sanAntonio')
        // Read it first (most reliable), then fall back to top match's metroUsed
        const sessionMetro = typeof window !== 'undefined' ? sessionStorage.getItem('hq_metro') : null
        const METRO_ID_TO_LABEL: Record<string, string> = {
          austin: 'Austin',
          dallas: 'Dallas',
          houston: 'Houston',
          sanAntonio: 'San Antonio',
        }
        const topMetro = matches[0]?.location.metroUsed ?? ''
        const initialMetro = (sessionMetro && METRO_ID_TO_LABEL[sessionMetro])
          ? METRO_ID_TO_LABEL[sessionMetro]
          : (['Dallas', 'Houston', 'San Antonio', 'Austin'].find(v => topMetro.includes(v)) ?? 'Austin')
        return (
          <MM3Discover
            matches={matches}
            profile={profile}
            session={session}
            onAdvanceToConnect={onAdvanceToConnect}
            initialMetro={initialMetro}
            initialCityIndex={0}
          />
        )
      }
      return <MM4to10 mmNumber={3} name="Refine" />
    case 4:
      if (selectedMileMarker < currentMileMarker) {
        return (
          <CompletedCard
            name="Connect"
            description="Your Market Director was assigned and your relationship began."
          />
        )
      }
      if (selectedMileMarker === currentMileMarker) {
        return <MM4Connect session={session} />
      }
      return <MM4to10 mmNumber={4} name="Connect" />
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

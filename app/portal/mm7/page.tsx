import LockedWorkspace from '../components/LockedWorkspace'
import { Users } from 'lucide-react'

export default function MM7Page() {
  return (
    <LockedWorkspace
      mmNumber={7}
      name="Match"
      StageIcon={Users}
      description="The right agent for the right buyer in the right market. You'll be presented with three named HavenQuest Select Agent profiles — real names, photos, and verified track records — matched to your specific submarket. You review them, choose one, and HavenQuest makes the warm introduction. Active home search then begins inside SARAH, your search hub, with MLS listings, showing notes, lifestyle match scoring, and a shortlist builder."
      features={[
        'Three named Select Agent profiles — real names, photos, and track records — matched to your submarket',
        'You select your agent — HavenQuest makes the introduction',
        'Active MLS search hub with lifestyle match scoring',
        'Showing activity tracking and notes',
        'Property shortlist and comparison tools',
        'Market Director monitors all search activity',
      ]}
      unlockCondition="When Move Readiness Certification is issued"
    />
  )
}

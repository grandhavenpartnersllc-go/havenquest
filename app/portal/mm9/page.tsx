import LockedWorkspace from '../components/LockedWorkspace'
import { Truck } from 'lucide-react'

export default function MM9Page() {
  return (
    <LockedWorkspace
      mmNumber={9}
      name="Transition"
      StageIcon={Truck}
      description="Two tracks run at the same time: closing your home and physically moving your life. Your Transition Checklist — built from your Move Blueprint — is executed item by item. Closing documents, fund transfer, keys. Movers, utilities, address changes, school enrollment. You arrive in Texas ready, not scrambling."
      features={[
        'Final walkthrough coordination',
        'Closing disclosure and fund transfer',
        'Closing day coordination',
        'Mover coordination from your vendor team',
        'Utility transfers and address changes',
        'School enrollment and community connections',
      ]}
      unlockCondition="When clear to close is confirmed — the only trigger for MM9"
    />
  )
}

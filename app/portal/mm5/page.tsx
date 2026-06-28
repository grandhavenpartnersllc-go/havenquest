import LockedWorkspace from '../components/LockedWorkspace'
import { ClipboardList } from 'lucide-react'

export default function MM5Page() {
  return (
    <LockedWorkspace
      mmNumber={5}
      name="Plan"
      StageIcon={ClipboardList}
      description="Your Move Blueprint starts here. Your Market Director guides you through a complete financial picture review — down payment, monthly budget, timeline, and debt. You'll get connected to a trusted lender for pre-qualification, and together you'll build a written Move Blueprint that becomes the foundation for everything that follows."
      features={[
        'Community refinement with your Market Director',
        'Housing strategy — budget, home type, timeline',
        'Move Timeline creation',
        'Lender-Ready Checklist',
        'Warm lender introduction and pre-qualification',
        'Move Blueprint document delivered',
      ]}
      unlockCondition="When Market Director confirms MM4 complete and HavenQuest Engagement is complete"
    />
  )
}

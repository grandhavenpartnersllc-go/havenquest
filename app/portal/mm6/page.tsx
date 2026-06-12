import LockedWorkspace from '../components/LockedWorkspace'
import { ShieldCheck } from 'lucide-react'

export default function MM6Page() {
  return (
    <LockedWorkspace
      mmNumber={6}
      name="Prepare"
      StageIcon={ShieldCheck}
      description="Before you search for a single home, your entire support team is assembled and ready. Your Market Director coordinates every vendor you'll need — title company, home inspector, insurance, movers, and more. You'll receive a Move Readiness Certification when every position is filled. No scrambling during the transaction."
      features={[
        'Pre-qualification verification',
        'Community and budget confirmation',
        'Full vendor team assembly — title, inspector, insurance, movers',
        'Move Readiness Certification issued',
        'Every role filled before home search begins',
      ]}
      unlockCondition="When Move Blueprint is complete and pre-qualification letter received"
    />
  )
}

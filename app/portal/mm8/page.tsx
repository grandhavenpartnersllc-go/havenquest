import LockedWorkspace from '../components/LockedWorkspace'
import { FileText } from 'lucide-react'

export default function MM8Page() {
  return (
    <LockedWorkspace
      mmNumber={8}
      name="Engage"
      StageIcon={FileText}
      description="From offer to clear to close — every step is managed. Your Select Agent leads the transaction and your Market Director monitors every stage. Offer, negotiation, contract, inspection, appraisal, financing — nothing falls through the cracks. If a deal doesn't work out before clear to close, you return to active search immediately with full momentum."
      features={[
        'Offer package preparation and submission',
        'Negotiation tracking',
        'Contract and timeline management',
        'Inspection issue tracking',
        'Appraisal review',
        'Financing and clear-to-close monitoring',
      ]}
      unlockCondition="When Select Agent and client mutually confirm a property for offer"
    />
  )
}

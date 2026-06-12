import LockedWorkspace from '../components/LockedWorkspace'
import { Home } from 'lucide-react'

export default function MM10Page() {
  return (
    <LockedWorkspace
      mmNumber={10}
      name="Home"
      StageIcon={Home}
      description="The journey ends. The relationship doesn't. Your Journey Recap — a permanent record of everything you accomplished — is generated and saved in your portal forever. Check-ins at 7, 30, 90, and 365 days keep HavenQuest connected to your new life. And through HavenQuest Home, you'll have access to a curated network of vetted local service providers for years to come."
      features={[
        'Journey Recap — AI-generated summary of your full journey, saved permanently',
        'Welcome Home Portfolio',
        'Community connection resources',
        'Check-ins at 7, 30, 90, and 365 days',
        'HavenQuest Home — exclusive vetted vendor and service network',
        'Referral program',
      ]}
      unlockCondition="When keys are received at closing"
    />
  )
}

import type { Metadata } from 'next'
import InvestorPage from './InvestorPage'

// Private, unlinked route (Stage 1). Reachable by direct URL only — not in any nav or sitemap,
// and still behind the app-wide BetaGate. noindex/nofollow so it never surfaces in search.
export const metadata: Metadata = {
  title: 'HavenQuest — Investor Overview',
  description: 'HavenQuest investor overview — the opportunity, the model, the team, and the raise.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <InvestorPage />
}

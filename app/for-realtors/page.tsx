import type { Metadata } from 'next'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ForRealtorsClient from '../../components/for-realtors/ForRealtorsClient'

export const metadata: Metadata = {
  title: 'For Texas Realtors — HavenQuest Select Agent Network',
  description: 'HavenQuest Select Agents are the most prepared real estate professionals in Texas. We don\'t send leads. We make introductions — to clients who are ready, guided, and committed.',
  openGraph: {
    title: 'For Texas Realtors — HavenQuest Select Agent Network',
    description: 'HavenQuest Select Agents are the most prepared real estate professionals in Texas. We don\'t send leads. We make introductions.',
    url: 'https://havenquest.co/for-realtors',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Texas Realtors — HavenQuest Select Agent Network',
    description: 'HavenQuest Select Agents receive prepared, committed clients — not cold leads.',
  },
}

export default function ForRealtorsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <ForRealtorsClient />
      </main>
      <Footer />
    </>
  )
}

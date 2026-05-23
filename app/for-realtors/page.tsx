import type { Metadata } from 'next'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ForRealtorsClient from '../../components/for-realtors/ForRealtorsClient'

export const metadata: Metadata = {
  title: 'For Texas Realtors — Join HavenQuest | Pre-Qualified Relocation Leads',
  description: 'Join the HavenQuest realtor network. Receive pre-qualified Texas relocation leads with income, budget, lifestyle priorities, and timeline already documented.',
  openGraph: {
    title: 'HavenQuest for Texas Realtors',
    description: 'The most qualified relocation leads in Texas — income verified, priorities documented, city confirmed.',
    url: 'https://havenquest.co/for-realtors',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest for Texas Realtors',
    description: 'Pre-qualified relocation leads for top Texas realtors.',
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

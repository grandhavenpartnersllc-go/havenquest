import type { Metadata } from 'next'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ForRealtorsClient from '../../components/for-realtors/ForRealtorsClient'

export const metadata: Metadata = {
  title: 'For Texas Realtors — Join HavenQuest | Earn Introductions',
  description: 'HavenQuest partners with the best realtors in Texas to serve Future Texans — people making one of the biggest decisions of their lives. No lead chasing. One introduction. One trusted partner per market.',
  openGraph: {
    title: 'HavenQuest for Texas Realtors',
    description: 'The best realtors don\'t chase leads. They earn introductions. Join the HavenQuest partner network in Texas.',
    url: 'https://havenquest.co/for-realtors',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest for Texas Realtors',
    description: 'The best realtors don\'t chase leads. They earn introductions. Join the HavenQuest partner network in Texas.',
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

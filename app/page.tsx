import type { Metadata } from 'next'
import { getCitiesByMetro } from '../services/locationService'
import HomeHeader from '../components/home/HomeHeader'
import Hero from '../components/home/Hero'
import Challenge from '../components/home/Challenge'
import HowItWorks from '../components/home/HowItWorks'
import Communities, { type CityCard } from '../components/home/Communities'
import HomeFooter from '../components/home/HomeFooter'
import type { MetroKey } from '../components/home/TexasMap'
import { HQ } from '../components/home/theme'

export const metadata: Metadata = {
  title: 'HavenQuest — Finding Your Texas Shouldn’t Be Left to Chance',
  description:
    'Intelligent technology and personal guidance for relocating to Texas. Match your life to the right community across Austin, Dallas–Fort Worth, Houston, and San Antonio — one trusted relationship from discovery to home.',
  openGraph: {
    title: 'HavenQuest — Finding Your Texas',
    description: 'Intelligent technology. Personal guidance. One trusted relationship from discovery to home.',
    url: 'https://havenquest.co',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest — Finding Your Texas',
    description: 'Match your life to the right Texas community — Austin, DFW, Houston, San Antonio.',
  },
}

const METRO_KEYS: MetroKey[] = ['dallas', 'austin', 'houston', 'sanAntonio']

// One-line teaser from the record's existing copy — the punchy first clause of the
// description (before the em dash), truncated at a word boundary. Never the full text.
function teaserOf(desc: string): string {
  if (!desc) return ''
  const clause = desc.split('—')[0].trim()
  const base = clause.length >= 30 ? clause : (desc.split(/\.\s/)[0] || desc).trim()
  if (base.length <= 96) return base
  const cut = base.slice(0, 96)
  return cut.slice(0, cut.lastIndexOf(' ')).trim() + '…'
}

export default function HomePage() {
  // Reuse the existing city data through getCitiesByMetro — first ~6 per metro.
  const cities = Object.fromEntries(
    METRO_KEYS.map((key) => [
      key,
      getCitiesByMetro(key)
        .slice(0, 6)
        .map((c): CityCard => ({ id: c.id, name: c.name, county: c.county, teaser: teaserOf(c.description) })),
    ]),
  ) as Record<MetroKey, CityCard[]>

  return (
    <div style={{ background: HQ.navy }}>
      <HomeHeader />
      <main>
        <Hero />
        <Challenge />
        <HowItWorks />
        <Communities cities={cities} />
      </main>
      <HomeFooter />
    </div>
  )
}

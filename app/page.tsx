import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'

export const metadata: Metadata = {
  title: 'HavenQuest — Find Where Your Life Fits in Texas',
  description: 'Match your income and lifestyle to the right Texas city or neighborhood. Free relocation intelligence platform — best cities to live in Texas, cost of living, school data, and top realtors.',
  openGraph: {
    title: 'HavenQuest — Find Where Your Life Fits in Texas',
    description: 'Moving to Texas? Find the city that fits your income, household, and lifestyle priorities — then connect with top realtors.',
    url: 'https://havenquest.co',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest — Texas Relocation Intelligence',
    description: 'Find where your income and lifestyle actually fit in Texas.',
  },
}

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    origin: 'Relocating from Chicago, IL',
    quote: "I had no idea where to even start with Texas. HavenQuest narrowed it down to three communities that actually fit our life. We're under contract in Round Rock and couldn't be happier.",
  },
  {
    name: 'David & Karen T.',
    origin: 'Relocating from Denver, CO',
    quote: "Our Market Director was with us every step of the way. From our first city match to closing day, we never felt lost or overwhelmed. This is how moving should work.",
  },
  {
    name: 'Marcus R.',
    origin: 'Relocating from Atlanta, GA',
    quote: "I was skeptical that an online platform could really understand what I was looking for. HavenQuest proved me wrong. Plano checked every box.",
  },
]

const NAVY = '#0A1E3D'
const GOLD = '#C5B783'
const BORDER = 'rgba(0,0,0,0.08)'
const MUTED = '#6B7280'

const SNAPSHOT_METROS = [
  { label: 'Austin median', value: '$460,000', sub: "Buyer's market · -16% from peak" },
  { label: 'DFW median', value: '$375,000', sub: '#1 market to watch nationally' },
  { label: 'Houston median', value: '$270,000', sub: 'Most affordable major metro' },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        <HeroSection />
        <HowItWorks />

        {/* Texas Market Snapshot Strip */}
        <div style={{
          margin: '0 32px 28px',
          border: `0.5px solid ${BORDER}`,
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {/* Header bar */}
          <div style={{
            background: NAVY,
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#fff' }}>
              Texas market snapshot · Q2 2026
            </span>
            <Link
              href="/texas/texas-insider"
              style={{ fontSize: '11px', color: GOLD, textDecoration: 'none' }}
            >
              Full Texas Insider →
            </Link>
          </div>
          {/* Data row */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {SNAPSHOT_METROS.map((metro, i) => (
              <div
                key={metro.label}
                style={{
                  padding: '12px 16px',
                  borderRight: i < 2 ? `0.5px solid ${BORDER}` : 'none',
                  borderBottom: `0.5px solid ${BORDER}`,
                }}
                className="md:border-b-0"
              >
                <p style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '4px' }}>
                  {metro.label}
                </p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: NAVY, marginBottom: '2px' }}>
                  {metro.value}
                </p>
                <p style={{ fontSize: '11px', color: MUTED }}>
                  {metro.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        {/* TODO: Replace sample reviews with real beta feedback */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-xs font-bold uppercase mb-4"
                style={{ color: '#C5B783', letterSpacing: '0.18em' }}
              >
                Trusted by People Relocating to Texas
              </p>
              <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#0A1E3D' }}>
                Built for anyone ready to make Texas home.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl p-8 flex flex-col relative"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                    border: '1px solid #F0EDE6',
                  }}
                >
                  <div className="flex gap-0.5 mb-4" aria-label="5 stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ color: '#C5B783', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.origin}</p>
                  </div>
                  <span
                    className="absolute bottom-4 right-5 text-xs text-gray-400"
                    style={{ opacity: 0.4 }}
                  >
                    Sample review
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="py-24 px-4"
          style={{ backgroundColor: '#FDFCFA', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
        >
          <div className="max-w-xl mx-auto text-center">
            <h2
              className="font-bold tracking-tight mb-4 text-gray-900"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              Your Lone Star Lifestyle starts here.
            </h2>
            <p className="text-lg mb-8 text-gray-500">
              Two paths into Texas. One guided experience. Begin when you&apos;re ready.
            </p>
            <p className="text-xs mb-6 mx-auto max-w-sm leading-relaxed text-gray-400">
              No cost to you. HavenQuest is compensated through our Select Agent
              network — only when you close.
            </p>
            <Link
              href="/begin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#60B8FF', color: '#08101C', boxShadow: '0 0 0 1px rgba(96,184,255,0.3), 0 8px 24px rgba(96,184,255,0.25)' }}
            >
              Begin My Journey →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

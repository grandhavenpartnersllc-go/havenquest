import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2, UserCheck, ShieldCheck, Lock } from 'lucide-react'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import HeroSection from '../components/landing/HeroSection'

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

const NAVY = '#0A1E3D'
const BLUE = '#0076B6'
const GOLD = '#C5B783'
const MUTED = '#6B7280'

const CONTAINER = { maxWidth: '1080px', margin: '0 auto', padding: '0 40px' } as const

const PROMISE_ITEMS = [
  { Icon: BarChart2, label: 'Matched to your life', desc: 'Verified data across 12 lifestyle categories — not just home prices.' },
  { Icon: UserCheck, label: 'A real guide at your side', desc: 'Your Market Director steps in personally at MileMarker 4.' },
  { Icon: ShieldCheck, label: 'Vetted local experts', desc: 'Hand-picked Select Agents who specialize in your target market.' },
  { Icon: Lock, label: 'Your data stays yours', desc: 'Nothing sold, nothing shared without your consent. Ever.' },
]

const HOW_STEPS = [
  {
    num: '01',
    title: 'Tell us about your life',
    desc: 'Income, household size, and the lifestyle priorities that matter most — from schools and safety to walkability and outdoor access.',
    link: 'Takes about 4 minutes →',
  },
  {
    num: '02',
    title: 'Get your Texas matches',
    desc: 'We rank 101 Texas communities against your priorities and budget. Your top matches are waiting — with full reports inside your portal.',
    link: null,
  },
  {
    num: '03',
    title: 'Explore and refine',
    desc: 'Adjust your financial picture, shift your priorities, and watch your rankings respond in real time. No pressure — just clarity.',
    link: null,
  },
  {
    num: '04',
    title: 'Meet your Market Director',
    desc: 'A real person steps in — reviews your full profile, answers your questions, and introduces you to a vetted Select Agent who knows your market.',
    link: null,
  },
]

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

const SNAPSHOT_CITIES = [
  {
    city: 'Austin',
    price: '$460,000',
    sub: 'Most corrected major market · -16% from peak',
    badge: "Buyer's market",
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
  },
  {
    city: 'Dallas-Fort Worth',
    price: '$375,000',
    sub: '#1 market to watch nationally · PwC/ULI',
    badge: 'Rebalancing',
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
  },
  {
    city: 'Houston',
    price: '$270,000',
    sub: 'Most affordable major Texas metro',
    badge: "Buyer's market",
    badgeColor: '#3B6D11',
    badgeBg: '#EAF3DE',
  },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        <HeroSection />

        {/* Gold Strip */}
        <div style={{ height: '3px', background: GOLD, width: '100%' }} />

        {/* Statement — 2-col contained */}
        <section style={{ background: '#fff', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ ...CONTAINER, padding: '56px 40px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '60px', alignItems: 'start' }}>
              {/* Left column */}
              <div>
                <div style={{ width: '36px', height: '2px', background: GOLD, marginBottom: '20px' }} />
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: NAVY, lineHeight: 1.3, margin: 0 }}>
                  Texas is big.<br />
                  Finding your place in it<br />
                  shouldn&apos;t be a guessing game.
                </h2>
              </div>
              {/* Right column */}
              <div>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.85, marginBottom: '24px' }}>
                  You&apos;ve made the decision. Now the real question is: which Texas is yours?
                  Whether you&apos;re drawn to the energy of a growing suburb, the charm of a historic small town,
                  or the pulse of a major city — HavenQuest helps you find the community where your life
                  actually fits. Not just the zip code with the right price tag.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {PROMISE_ITEMS.map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#F3F5F8',
                        border: '0.5px solid var(--color-border-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <item.Icon size={15} color={BLUE} />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: NAVY, margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: '12px', color: MUTED, margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — editorial, contained */}
        <section style={{ background: '#fff', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ ...CONTAINER, padding: '52px 40px' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, margin: 0, whiteSpace: 'nowrap' }}>
                HOW IT WORKS
              </p>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border-tertiary)' }} />
            </div>
            {/* Steps — desktop: 4-col open flex */}
            <div className="hidden md:flex">
              {HOW_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  style={{
                    flex: 1,
                    paddingRight: i < 3 ? '28px' : '0',
                    borderRight: i < 3 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    marginRight: i < 3 ? '28px' : '0',
                  }}
                >
                  <p style={{ fontSize: '32px', fontWeight: 700, color: '#F3F5F8', lineHeight: 1, marginBottom: '10px' }}>{step.num}</p>
                  <div style={{ width: '24px', height: '2px', background: BLUE, marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: NAVY, marginBottom: '8px', lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: '12.5px', color: MUTED, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  {step.link && (
                    <Link href="/begin" style={{ display: 'inline-block', fontSize: '12px', color: BLUE, textDecoration: 'none', marginTop: '10px' }}>
                      {step.link}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            {/* Steps — mobile: 2×2 grid */}
            <div className="grid grid-cols-2 gap-6 md:hidden">
              {HOW_STEPS.map((step) => (
                <div key={step.num}>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: '#F3F5F8', lineHeight: 1, marginBottom: '10px' }}>{step.num}</p>
                  <div style={{ width: '24px', height: '2px', background: BLUE, marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: NAVY, marginBottom: '8px', lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: '12.5px', color: MUTED, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  {step.link && (
                    <Link href="/begin" style={{ display: 'inline-block', fontSize: '12px', color: BLUE, textDecoration: 'none', marginTop: '10px' }}>
                      {step.link}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof — contained */}
        {/* TODO: Replace sample reviews with real beta feedback */}
        <section style={{ background: '#F3F5F8', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ ...CONTAINER, padding: '52px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, margin: 0, whiteSpace: 'nowrap' }}>
                WHAT PEOPLE ARE SAYING
              </p>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border-tertiary)' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 500, color: NAVY, marginBottom: '28px' }}>
              Built for anyone ready to make Texas home.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: '#fff',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderTop: `2px solid ${GOLD}`,
                    borderRadius: '8px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <p style={{ fontSize: '13px', color: GOLD, letterSpacing: '3px', marginBottom: '14px' }}>★★★★★</p>
                  <p style={{ fontSize: '13px', color: MUTED, fontStyle: 'italic', lineHeight: 1.75, marginBottom: '18px', flex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: NAVY, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '11px', color: MUTED, marginTop: '2px' }}>{t.origin}</p>
                  </div>
                  <span style={{ position: 'absolute', bottom: '16px', right: '16px', fontSize: '10px', color: MUTED, opacity: 0.4 }}>
                    Sample review
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Snapshot — contained */}
        <section style={{ background: '#fff' }}>
          <div style={{ ...CONTAINER, padding: '0 40px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '36px 0 20px', borderBottom: '0.5px solid var(--color-border-tertiary)', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, margin: 0, whiteSpace: 'nowrap' }}>
                TEXAS MARKET SNAPSHOT · Q2 2026
              </p>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border-tertiary)' }} />
              <Link href="/texas/texas-insider" style={{ fontSize: '12px', color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Full Texas Insider →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
              {SNAPSHOT_CITIES.map((metro) => (
                <div
                  key={metro.city}
                  style={{
                    padding: '20px',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: '8px',
                    background: '#F3F5F8',
                  }}
                >
                  <p style={{ fontSize: '13px', fontWeight: 500, color: NAVY, marginBottom: '6px' }}>{metro.city}</p>
                  <p style={{ fontSize: '24px', fontWeight: 500, color: NAVY, marginBottom: '4px' }}>{metro.price}</p>
                  <p style={{ fontSize: '12px', color: MUTED, lineHeight: 1.4, margin: 0 }}>{metro.sub}</p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `0.5px solid ${metro.badgeColor}`,
                    color: metro.badgeColor,
                    background: metro.badgeBg,
                  }}>
                    {metro.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

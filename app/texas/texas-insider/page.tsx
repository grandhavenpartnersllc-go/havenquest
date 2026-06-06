import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Texas Insider | HavenQuest',
  description: 'Your inside look at Texas — the markets, the communities, and the Lone Star lifestyle. Real data and honest assessments on Texas real estate, homeowner laws, and what life here actually looks like.',
}

const GOLD = '#C9A84C'
const DARK = '#1A1A1A'
const WARM_GRAY = '#6B6560'
const BORDER = '#D4C5A9'

const metroCards = [
  {
    href: '/texas/texas-insider/austin',
    image: '/images/cities/austin-tx.jpg',
    title: 'Austin',
    desc: 'Tech · Hill Country · The city that reset',
    price: '$460,000 median',
  },
  {
    href: '/texas/texas-insider/dfw',
    image: '/images/cities/dallas-tx.jpg',
    title: 'Dallas-Fort Worth',
    desc: 'Corporate · Suburbs · #1 market to watch nationally',
    price: '$375,000 median',
  },
  {
    href: '/texas/texas-insider/houston',
    image: '/images/cities/houston-tx.jpg',
    title: 'Houston',
    desc: 'Energy · Medical · Most affordable major Texas metro',
    price: '$270,000 median',
  },
  {
    href: '/texas/texas-insider/san-antonio',
    image: '/images/cities/san-antonio-tx.jpg',
    title: 'San Antonio',
    desc: "Military · Value · Texas's most underrated market",
    price: '$260,000 median',
  },
]

export default function TexasMarketProfilesHub() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />

      <main>
        {/* Hero */}
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '64px 24px 32px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '18px' }}>
            Texas Insider
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 500, color: DARK, lineHeight: 1.25, marginBottom: '20px', maxWidth: '680px' }}>
            Your inside look at Texas — the markets, the communities, and the Lone Star lifestyle.
          </h1>
          <p style={{ fontSize: '16px', color: WARM_GRAY, lineHeight: 1.8, maxWidth: '600px', marginBottom: '36px' }}>
            Real data. Honest assessments. The intelligence you need to understand Texas markets, communities, and what life here actually looks like — before you commit to anything.
          </p>
          <div style={{ height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '52px' }} />
        </div>

        {/* Card grid */}
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 64px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Featured state card */}
            <Link href="/texas/texas-insider/state" style={{ textDecoration: 'none', display: 'flex' }}>
              <div style={{
                border: `1px solid ${GOLD}`,
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#FDFAF4',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <Image src="/images/texas-intel/hub-texas-state.jpg" alt="Texas statewide guide" fill className="object-cover" />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: GOLD, borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: DARK }}>
                    Start here
                  </div>
                </div>
                <div style={{ padding: '28px', flex: 1 }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '10px' }}>
                    Texas Statewide
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 500, color: DARK, lineHeight: 1.4, marginBottom: '14px' }}>
                    Laws, taxes, homeowner rights, economy, and the full picture on what it means to own a home in Texas
                  </h2>
                  <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75 }}>
                    No state income tax. A $140,000 homestead exemption. New foreign buyer restrictions. The 2025–2026 Texas legislature passed the most significant package of homeowner protections in state history. Before you choose a metro, read this.
                  </p>
                </div>
              </div>
            </Link>

            {/* 2×2 metro cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {metroCards.map(card => (
                <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    border: `0.5px solid ${BORDER}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ position: 'relative', height: '120px', background: '#DDD8CF', flexShrink: 0 }}>
                      <Image
                        src={card.image}
                        alt={`${card.title}, Texas`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div style={{ padding: '18px', flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '17px', fontWeight: 500, color: DARK, marginBottom: '5px' }}>
                        {card.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: WARM_GRAY, lineHeight: 1.55, marginBottom: '10px' }}>
                        {card.desc}
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>
                        {card.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9A8E82' }}>
            Data updated quarterly · Q2 2026 · Sources: TRERC, Redfin, Zillow, Dallas Fed, U.S. Census Bureau
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

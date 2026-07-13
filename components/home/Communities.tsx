'use client'

import Image from 'next/image'
import Link from 'next/link'
import TexasMap, { type MetroKey } from './TexasMap'
import { HQ, SANS, SERIF, FIND_MY_TEXAS_HREF } from './theme'

export type CityCard = { id: string; name: string; county: string; teaser: string }

// Static metro meta (copy is fixed by the brief; only the city cards come from real data).
const METRO_META: Record<MetroKey, { name: string; countyLine: string; summary: string }> = {
  dallas: {
    name: 'Dallas–Fort Worth',
    countyLine: 'Dallas · Tarrant · Collin · Denton Counties',
    summary:
      'The Metroplex — a constellation of thriving suburbs around Dallas and Fort Worth, known for strong job markets, top-rated schools, and room to grow.',
  },
  austin: {
    name: 'Austin',
    countyLine: 'Central Texas · Hill Country',
    summary:
      'The Live Music Capital and a tech-and-culture magnet — Hill Country landscapes, lake life, and some of the fastest job growth in the country.',
  },
  houston: {
    name: 'Houston',
    countyLine: 'Gulf Coast',
    summary:
      'The Bayou City — a vast, diverse metro with global industry, world-class food, and room to spread out at a lower cost.',
  },
  sanAntonio: {
    name: 'San Antonio',
    countyLine: 'South Texas',
    summary:
      'Deep Texas heritage and a genuinely lower cost of living — a big city that still feels like a neighborhood.',
  },
}

// Phase A: static default. Interactivity (hover/tap swapping) is wired in Phase B.
const SELECTED: MetroKey = 'dallas'

export default function Communities({ cities }: { cities: Record<MetroKey, CityCard[]> }) {
  const meta = METRO_META[SELECTED]
  const cards = cities[SELECTED] ?? []

  return (
    <section id="communities" style={{ background: HQ.cream, padding: '96px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Heading */}
        <p style={{ fontFamily: SANS, fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: HQ.goldMuted, margin: '0 0 16px', fontWeight: 600 }}>
          Communities
        </p>
        <h2 className="hq-serif" style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.8vw, 42px)', fontWeight: 500, lineHeight: 1.18, margin: 0, maxWidth: '760px' }}>
          <span style={{ color: HQ.navy }}>Find the metro that fits — </span>
          <span style={{ color: HQ.goldMuted, fontStyle: 'italic' }}>then the community within it.</span>
        </h2>

        {/* Split */}
        <div
          className="hq-communities-grid"
          style={{ display: 'grid', rowGap: '40px', alignItems: 'center', marginTop: '48px' }}
        >
          {/* Map */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="hq-tx-wrap">
              <TexasMap selected={SELECTED} onSelect={() => {}} />
            </div>
          </div>

          {/* Selected metro panel */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase', color: HQ.goldMuted, margin: '0 0 8px', fontWeight: 600 }}>
              Selected Metro
            </p>
            <h3 className="hq-serif" style={{ fontFamily: SERIF, fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 500, color: HQ.navy, margin: 0 }}>
              {meta.name}
            </h3>
            <p style={{ fontFamily: SANS, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: HQ.slate2, margin: '8px 0 0', fontWeight: 500 }}>
              {meta.countyLine}
            </p>
            <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 300, color: '#3a4658', lineHeight: 1.7, margin: '16px 0 0', maxWidth: '560px' }}>
              {meta.summary}
            </p>

            {/* 2×3 city cards */}
            <div className="grid grid-cols-2" style={{ gap: '16px', marginTop: '28px' }}>
              {cards.slice(0, 6).map((c) => (
                <div key={c.id} className="hq-city-card" style={{ background: HQ.white, borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '124px', background: `linear-gradient(150deg, ${HQ.navy4}, ${HQ.navy})` }}>
                    <Image
                      src={`/images/cities/${c.id}.jpg`}
                      alt={c.name}
                      fill
                      sizes="(max-width: 1080px) 45vw, 260px"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div style={{ padding: '13px 14px 15px' }}>
                    <div style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 600, color: HQ.navy, lineHeight: 1.2 }}>{c.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: HQ.goldMuted, margin: '4px 0 7px', fontWeight: 600 }}>
                      {c.county} County
                    </div>
                    <p style={{ fontFamily: SANS, fontSize: '12.5px', fontWeight: 300, color: HQ.slate2, lineHeight: 1.5, margin: 0 }}>{c.teaser}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={FIND_MY_TEXAS_HREF}
              className="hq-btn-gold"
              style={{ display: 'inline-block', marginTop: '28px', borderRadius: '9px', padding: '13px 26px', textDecoration: 'none', fontFamily: SANS, fontSize: '14px', fontWeight: 600 }}
            >
              Find My Texas &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

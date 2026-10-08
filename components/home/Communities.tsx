'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TexasMap, { type MetroKey } from './TexasMap'
import { HQ, SANS, FIND_MY_TEXAS_HREF } from './theme'

export type CityCard = { id: string; name: string; county: string; teaser: string }

// SiteLight-B1-CP7. Stone background (was cream #FBF3DF), Poppins headline (was Playfair),
// metro pills added on the left, city cards moved to a 3-column grid below the split.
// All existing data and behaviour are unchanged — only presentation moved.
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

// Pill order matches the map's reading order.
const METRO_ORDER: MetroKey[] = ['dallas', 'austin', 'houston', 'sanAntonio']

// Desktop-only map presence (≥1000px). Gated by matchMedia, not a CSS media query, so it
// reliably turns OFF where the section stacks and the map is full-width.
const MAP_TRANSFORM = 'perspective(1600px) rotateY(10deg) scale(1.04)'

export default function Communities({ cities }: { cities: Record<MetroKey, CityCard[]> }) {
  const [selected, setSelected] = useState<MetroKey>('dallas')

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1000px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const meta = METRO_META[selected]
  const cards = cities[selected] ?? []

  return (
    <section id="communities" style={{ background: HQ.stone, padding: '84px 24px 96px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Heading */}
        <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: HQ.goldLabel, margin: '0 0 14px' }}>
          Communities
        </p>
        <h2 style={{ fontFamily: SANS, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.18, letterSpacing: '-0.015em', margin: 0, color: HQ.navy, maxWidth: '20ch' }}>
          <span style={{ fontWeight: 600 }}>Find the metro that fits &mdash; </span>
          <span style={{ fontWeight: 400 }}>then the community within it.</span>
        </h2>

        {/* Split: pills + metro card on the left, map on the right */}
        <div className="hq-communities-grid" style={{ display: 'grid', rowGap: '40px', alignItems: 'center', marginTop: '44px' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Metro pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', marginBottom: '22px' }}>
              {METRO_ORDER.map((k) => {
                const active = selected === k
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelected(k)}
                    aria-pressed={active}
                    className="hq-focus"
                    style={{
                      fontFamily: SANS, fontSize: '15px', fontWeight: active ? 600 : 400,
                      background: active ? HQ.navy : HQ.white,
                      color: active ? HQ.white : HQ.navy,
                      border: `1px solid ${active ? HQ.navy : HQ.cardBorder}`,
                      borderRadius: '999px', padding: '9px 18px', cursor: 'pointer',
                      transition: 'background-color 0.18s, color 0.18s, border-color 0.18s',
                    }}
                  >
                    {METRO_META[k].name}
                  </button>
                )
              })}
            </div>

            {/* Selected metro card */}
            <div className="hq-card" style={{ padding: '26px 28px' }}>
              <h3 style={{ fontFamily: SANS, fontSize: '24px', fontWeight: 600, color: HQ.navy, margin: 0, letterSpacing: '-0.01em' }}>
                {meta.name}
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 400, color: HQ.muted, margin: '7px 0 0' }}>
                {meta.countyLine}
              </p>
              <p style={{ fontFamily: SANS, fontSize: '17px', fontWeight: 400, color: HQ.ink, lineHeight: 1.6, margin: '16px 0 0', maxWidth: '46ch' }}>
                {meta.summary}
              </p>
              <Link
                href={FIND_MY_TEXAS_HREF}
                className="hq-pill-btn hq-btn-gold hq-focus"
                style={{ marginTop: '22px', fontFamily: SANS }}
              >
                Find My Texas &rarr;
              </Link>
            </div>
          </div>

          {/* Map */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              className="hq-tx-wrap"
              style={{ transformOrigin: 'center center', transform: isDesktop ? MAP_TRANSFORM : undefined }}
            >
              <TexasMap selected={selected} onSelect={setSelected} />
            </div>
          </div>
        </div>

        {/* City cards — 3 / 2 / 1 column grid */}
        <div className="hq-city-grid" style={{ marginTop: '44px' }}>
          {cards.slice(0, 6).map((c) => (
            <div key={c.id} className="hq-card hq-city-card" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '140px', background: HQ.stone }}>
                <Image
                  src={`/images/cities/${c.id}.jpg`}
                  alt={c.name}
                  fill
                  sizes="(max-width: 760px) 92vw, (max-width: 1000px) 45vw, 380px"
                  style={{ objectFit: 'cover' }}
                  // Pre-existing behaviour, retained: a missing city photo hides itself and
                  // the stone block behind it shows through, rather than a broken-image icon.
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div style={{ padding: '15px 17px 18px' }}>
                <div style={{ fontFamily: SANS, fontSize: '17px', fontWeight: 600, color: HQ.navy, lineHeight: 1.25 }}>{c.name}</div>
                <div style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 400, color: HQ.muted, margin: '4px 0 8px' }}>
                  {c.county} County
                </div>
                <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 400, color: HQ.ink, lineHeight: 1.55, margin: 0 }}>{c.teaser}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

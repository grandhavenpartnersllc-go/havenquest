import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const GOLD = '#C5B783'
const BLUE = '#0076B6'

const TRUST_STATS = [
  { num: '101', label: 'Texas communities' },
  { num: '4', label: 'Major metros' },
  { num: '12', label: 'Lifestyle categories' },
  { num: 'Free', label: 'To start' },
]

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
      {/* Background image */}
      <Image
        src="/images/relocation-couple.png"
        alt="Couple with confident smiles surrounded by moving boxes — ready for their Texas move"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
      />

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 30, 61, 0.55)', zIndex: 1 }} />

      {/* Content layer */}
      <div
        className="absolute inset-0 flex flex-col justify-center px-6 py-10 md:px-16 md:py-20"
        style={{ zIndex: 2 }}
      >
        <div style={{ maxWidth: '680px' }}>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontSize: '26px', fontWeight: 400, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
            So, you&apos;re
          </p>

          {/* H1 */}
          <h1
            className="text-[48px] md:text-[72px]"
            style={{ fontWeight: 700, lineHeight: 1.05, color: '#fff', marginBottom: '24px' }}
          >
            Choosin&apos; <span style={{ color: GOLD }}>Texas.</span>
          </h1>

          {/* Subhead */}
          <p
            className="text-[15px] md:text-[18px]"
            style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '560px', marginBottom: '36px' }}
          >
            Great choice. Now let&apos;s make sure you land in exactly the right community — the one that fits your life, your budget, and the way you want to live. That&apos;s what HavenQuest is here for.
          </p>

          {/* CTA */}
          <Link
            href="/begin"
            style={{
              display: 'inline-block',
              background: BLUE,
              color: '#fff',
              fontSize: '15px',
              fontWeight: 500,
              padding: '14px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              marginBottom: '48px',
            }}
          >
            Begin My Journey →
          </Link>

          {/* Trust stats — desktop: flex row with explicit centered dividers */}
          <div className="hidden md:flex" style={{ alignItems: 'center' }}>
            {TRUST_STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.25)', alignSelf: 'center', flexShrink: 0 }} />
                )}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: i === 0 ? '0 24px 0 0' : i === TRUST_STATS.length - 1 ? '0 0 0 24px' : '0 24px',
                }}>
                  <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{stat.num}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Trust stats — mobile: 2×2 grid */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{stat.num}</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pill badge */}
      <div
        className="absolute bottom-4 right-4 md:bottom-6 md:right-8"
        style={{
          zIndex: 3,
          background: 'rgba(10,30,61,0.3)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: '#fff' }}>4 metros · 101 cities · Updated June 2026</span>
      </div>
    </div>
  )
}

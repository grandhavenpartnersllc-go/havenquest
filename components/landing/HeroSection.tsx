import Link from 'next/link'
import Image from 'next/image'
import { BarChart2, UserCheck, ShieldCheck, Lock } from 'lucide-react'

const NAVY = '#0A1E3D'
const BLUE = '#0076B6'
const GOLD = '#C5B783'
const MUTED = '#6B7280'

const PROOF_ITEMS = [
  { Icon: BarChart2, label: 'Matched to your life', desc: 'Verified data across 12 lifestyle categories' },
  { Icon: UserCheck, label: 'A real guide at your side', desc: 'Your Market Director steps in at MileMarker 4' },
  { Icon: ShieldCheck, label: 'Vetted local experts', desc: 'Hand-picked Select Agents who know your market' },
  { Icon: Lock, label: 'Your data stays yours', desc: 'Nothing sold, nothing shared without consent' },
]

const TRUST_STATS = [
  { num: '101', label: 'Texas communities' },
  { num: '4', label: 'Major metros' },
  { num: '12', label: 'Lifestyle categories' },
  { num: 'Free', label: 'To start' },
]

export default function HeroSection() {
  return (
    <>
      {/* Hero — full-bleed overlay */}
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
            {/* Italic intro */}
            <p style={{ fontSize: '20px', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
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

            {/* Trust stats */}
            <div className="grid grid-cols-2 gap-4 md:flex md:items-start md:gap-0">
              {TRUST_STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col${i > 0 ? ' md:pl-8 md:border-l md:border-white/20' : ''}`}
                >
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

      {/* Gold strip */}
      <div style={{ height: '3px', background: GOLD }} />

      {/* Promise strip */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ background: '#F3F5F8', borderBottom: '0.5px solid var(--color-border-tertiary)' }}
      >
        {PROOF_ITEMS.map((item, i) => (
          <div
            key={item.label}
            style={{
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              borderRight: i < 3 ? '0.5px solid var(--color-border-tertiary)' : 'none',
            }}
          >
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: NAVY,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <item.Icon size={15} color={GOLD} />
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: NAVY, margin: '0 0 2px' }}>{item.label}</p>
              <p style={{ fontSize: '11px', color: MUTED, lineHeight: 1.45, margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Blue rule */}
      <div style={{ height: '2px', background: BLUE }} />
    </>
  )
}

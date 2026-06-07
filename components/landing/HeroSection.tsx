import Link from 'next/link'
import Image from 'next/image'
import { BarChart2, UserCheck, ShieldCheck, Lock, Map } from 'lucide-react'

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
      {/* Hero — split layout */}
      <div
        className="flex flex-col-reverse md:grid"
        style={{ gridTemplateColumns: '54% 46%', minHeight: '420px' }}
      >
        {/* Left panel */}
        <div
          className="hero-left"
          style={{ background: '#fff', padding: '52px 48px 52px 32px' }}
        >
          {/* Italic intro */}
          <p style={{ fontSize: '17px', color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '4px' }}>
            So, you&apos;re
          </p>

          {/* Headline */}
          <h1 style={{
            fontSize: '46px',
            fontWeight: 500,
            lineHeight: 1.1,
            color: NAVY,
            marginBottom: '22px',
          }}>
            Choosin&apos; <span style={{ color: BLUE }}>Texas.</span>
          </h1>

          {/* Subhead */}
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.85, maxWidth: '400px', marginBottom: '28px' }}>
            Great choice. Now let&apos;s make sure you land in exactly the right community — the one that fits your life, your budget, and the way you want to live. That&apos;s what HavenQuest is here for.
          </p>

          {/* CTA row */}
          <div className="flex flex-col md:flex-row md:items-center" style={{ gap: '16px', marginBottom: '32px' }}>
            <Link
              href="/begin"
              className="w-full md:w-auto text-center"
              style={{
                background: BLUE,
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                padding: '13px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Begin My Journey →
            </Link>
            <Link
              href="/texas/texas-insider"
              className="flex items-center justify-center md:justify-start"
              style={{
                color: NAVY,
                opacity: 0.7,
                fontSize: '13px',
                textDecoration: 'none',
                gap: '4px',
              }}
            >
              <Map size={13} />
              Explore Texas markets
            </Link>
          </div>

          {/* Trust stats */}
          <div
            className="grid grid-cols-2 md:flex"
            style={{ paddingTop: '22px', borderTop: '0.5px solid var(--color-border-tertiary)' }}
          >
            {TRUST_STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: i > 0 ? '20px' : '0',
                  paddingRight: '20px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderLeft: i > 0 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 500, color: NAVY }}>{stat.num}</span>
                <span style={{ fontSize: '11px', color: MUTED }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — image */}
        <div
          className="relative h-[220px] md:h-auto"
          style={{ borderLeft: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden' }}
        >
          {/* TODO: Replace with final relocation-couple.jpg asset */}
          <Image
            src="/images/relocation-couple.jpg"
            alt="Couple with confident smiles surrounded by moving boxes — ready for their Texas move"
            fill
            className="object-cover"
            priority
          />
          {/* Bottom gradient */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '110px',
            background: 'linear-gradient(transparent, rgba(10,30,61,0.55))',
            zIndex: 1,
          }} />
          {/* Pill badge */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 2,
            background: 'rgba(10,30,61,0.18)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '20px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#fff' }}>4 metros · 101 cities · Updated June 2026</span>
          </div>
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

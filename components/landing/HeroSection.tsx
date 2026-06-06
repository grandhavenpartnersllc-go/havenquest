import Link from 'next/link'
import Image from 'next/image'
import { BarChart2, UserCheck, ShieldCheck, Lock, Map } from 'lucide-react'

const NAVY = '#002868'
const RED = '#BF0A30'
const GOLD = '#C9A84C'
const MUTED = '#6B7280'
const BORDER = 'rgba(0,0,0,0.08)'

const PROOF_ITEMS = [
  { Icon: BarChart2, label: 'Data-driven matching', desc: 'Verified data across 12 lifestyle categories' },
  { Icon: UserCheck, label: 'A real person guides you', desc: 'Your Market Director steps in at MileMarker 4' },
  { Icon: ShieldCheck, label: 'Vetted Select Agents', desc: 'Hand-picked realtors who know your market' },
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
        style={{ gridTemplateColumns: '55% 45%', minHeight: '400px' }}
      >
        {/* Left panel */}
        <div
          className="hero-left"
          style={{ background: '#fff', padding: '52px 44px 52px 32px' }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div style={{ width: '28px', height: '1.5px', background: RED, flexShrink: 0 }} />
            <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: RED, margin: 0 }}>
              Texas Relocation Intelligence
            </p>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '34px',
            fontWeight: 500,
            lineHeight: 1.25,
            color: NAVY,
            marginBottom: '16px',
          }}>
            Find your place<br />
            in the <span style={{ color: RED }}>Lone Star State.</span>
          </h1>

          {/* Subhead */}
          <p style={{ fontSize: '13.5px', color: MUTED, lineHeight: 1.8, maxWidth: '400px', marginBottom: '28px' }}>
            HavenQuest matches you to the right Texas community based on your income, priorities, and lifestyle — then guides you every step of the way to your front door.
          </p>

          {/* CTA row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4" style={{ marginBottom: '32px' }}>
            <Link
              href="/begin"
              className="w-full md:w-auto text-center"
              style={{
                background: NAVY,
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Begin My Journey →
            </Link>
            <Link
              href="/texas/texas-insider"
              className="text-center md:text-left"
              style={{
                color: NAVY,
                borderBottom: `1px solid ${NAVY}`,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
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
            style={{ paddingTop: '24px', borderTop: `0.5px solid ${BORDER}` }}
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
                  borderLeft: i > 0 ? `0.5px solid ${BORDER}` : 'none',
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
          style={{ borderLeft: `0.5px solid ${BORDER}`, overflow: 'hidden' }}
        >
          <Image
            src="/images/texas-intel/state-hero.jpg"
            alt="Texas lifestyle — community life in the Lone Star State"
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
            height: '120px',
            background: 'linear-gradient(transparent, rgba(0,40,104,0.55))',
            zIndex: 1,
          }} />
          {/* Badge */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 2,
            background: 'rgba(0,40,104,0.15)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '20px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: RED, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#fff' }}>4 metros · 101 cities · Updated June 2026</span>
          </div>
        </div>
      </div>

      {/* Texas flag stripe */}
      <div style={{ display: 'flex', height: '4px' }}>
        <div style={{ flex: 1, background: RED }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderTop: `0.5px solid ${BORDER}`, borderBottom: `0.5px solid ${BORDER}` }} />
        <div style={{ flex: 1, background: NAVY }} />
      </div>

      {/* Proof strip */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ background: NAVY }}
      >
        {PROOF_ITEMS.map((item, i) => (
          <div
            key={item.label}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              borderRight: i % 2 === 0 ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
            }}
            className="md:[&:not(:last-child)]:border-r md:border-r-[rgba(255,255,255,0.1)]"
          >
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <item.Icon size={15} color={GOLD} />
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#fff', margin: '0 0 2px' }}>{item.label}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Red rule */}
      <div style={{ height: '2px', background: RED }} />
    </>
  )
}

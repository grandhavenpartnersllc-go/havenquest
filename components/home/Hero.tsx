import Link from 'next/link'
import { MapPin, UserCheck, Route, ShieldCheck } from 'lucide-react'
import { HQ, SANS, SERIF, FIND_MY_TEXAS_HREF } from './theme'

const TRUST = [
  { Icon: MapPin, label: 'Texas Focused', sub: '4 major metros' },
  { Icon: UserCheck, label: 'Personal Guidance', sub: 'Human + technology' },
  { Icon: Route, label: 'Proven Process', sub: 'From start to home' },
  { Icon: ShieldCheck, label: 'Vetted Network', sub: 'Trusted local experts' },
]

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        // Base navy under the photo so the section reads intentionally even before the
        // hero image is dropped in at public/images/home/hero-austin-skyline.jpg.
        background: `
          linear-gradient(to right, rgba(8,20,38,0.94) 0%, rgba(8,20,38,0.62) 42%, rgba(8,20,38,0.30) 100%),
          linear-gradient(to bottom, rgba(8,20,38,0.25) 0%, rgba(8,20,38,0) 45%, rgba(8,20,38,0.85) 100%),
          url('/images/home/hero-austin-skyline.jpg'),
          radial-gradient(120% 120% at 20% 20%, ${HQ.navy3} 0%, ${HQ.navy} 70%)
        `,
        backgroundSize: 'cover, cover, cover, cover',
        backgroundPosition: 'center, center, center 30%, center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          margin: '0 auto',
          // padding-top clears the fixed header (same token drives the header's own
          // height, so they can't drift); bottom is 0 so justify-content:center yields
          // equal space above the headline and below the trust bar at any viewport height.
          padding: 'var(--hq-header-h) 48px 0',
          boxSizing: 'border-box',
        }}
        className="hq-hero-inner"
      >
        <h1
          className="hq-serif"
          style={{ fontFamily: SERIF, fontSize: 'clamp(38px, 6vw, 70px)', lineHeight: 1.08, fontWeight: 500, margin: 0, maxWidth: '860px' }}
        >
          <span style={{ color: HQ.offwhite }}>Finding your Texas</span>
          <br />
          <span style={{ color: HQ.gold, fontStyle: 'italic' }}>shouldn&rsquo;t be left to chance.</span>
        </h1>

        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(15px, 1.7vw, 19px)',
            fontWeight: 300,
            color: HQ.slate3,
            lineHeight: 1.65,
            margin: '26px 0 0',
            maxWidth: '600px',
          }}
        >
          Intelligent technology. Personal guidance. One trusted relationship from discovery to home.
        </p>

        {/* CTAs — spine grid (col1 + shared gap) via .hq-cta-row; stacks on mobile */}
        <div className="hq-cta-row" style={{ marginTop: '34px' }}>
          <Link
            href={FIND_MY_TEXAS_HREF}
            className="hq-btn-gold"
            style={{ borderRadius: '9px', padding: '15px 30px', textDecoration: 'none', fontFamily: SANS, fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Find My Texas &rarr;
          </Link>
          <a
            href="#"
            className="hq-btn-outline"
            style={{ borderRadius: '9px', padding: '15px 30px', textDecoration: 'none', fontFamily: SANS, fontSize: '15px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap' }}
          >
            <span
              aria-hidden
              style={{
                width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${HQ.gold}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: HQ.gold,
              }}
            >
              &#9654;
            </span>
            Watch Our Story
          </a>
        </div>

        {/* Trust row — spine grid (col1 + shared gap) via .hq-trust-row; col 2 sizes to
            content so "Personal Guidance"/"Vetted Network" share the CTA's left edge */}
        <div
          className="hq-trust-row"
          style={{ marginTop: '64px' }}
        >
          {TRUST.map(({ Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  border: '1px solid rgba(201,169,97,0.4)', background: 'rgba(201,169,97,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={18} color={HQ.gold} strokeWidth={1.5} />
              </span>
              <div style={{ fontFamily: SANS, lineHeight: 1.25 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: HQ.offwhite }}>{label}</div>
                <div style={{ fontSize: '12px', fontWeight: 300, color: HQ.slate }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

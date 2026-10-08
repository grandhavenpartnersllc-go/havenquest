import Link from 'next/link'
import { MapPin, UserCheck, Route, ShieldCheck } from 'lucide-react'
import { HQ, SANS, FIND_MY_TEXAS_HREF } from './theme'
import WatchStoryModal from './WatchStoryModal'

// SiteLight-B1-CP4. The four stacked dark layers are gone (a 0.94-opacity navy scrim, a
// 0.85 bottom scrim, the photo and a navy radial). One light fade remains, left-to-right,
// so the headline sits on near-solid stone while the right side of the photo stays open.
// Playfair is gone — Poppins only, per CP2.
const TRUST = [
  { Icon: MapPin, label: 'Texas Focused', sub: '4 major metros' },
  { Icon: UserCheck, label: 'Personal Guidance', sub: 'Human + technology' },
  { Icon: Route, label: 'Proven Process', sub: 'From start to home' },
  { Icon: ShieldCheck, label: 'Vetted Network', sub: 'Trusted local experts' },
]

const HERO_IMG = "url('/images/home/hero-kitchen.jpg')"
const LIGHT_FADE = `linear-gradient(90deg, rgba(${HQ.heroFade},.97) 0%, rgba(${HQ.heroFade},.9) 30%, rgba(${HQ.heroFade},.35) 50%, rgba(${HQ.heroFade},0) 62%)`

export default function Hero() {
  return (
    <>
      <section
        className="hq-hero"
        style={{
          // ≥760px this element carries the photo + fade (see .hq-hero in globals.css).
          // <760px it is a plain column and .hq-hero-photo below carries the photo.
          backgroundImage: `${LIGHT_FADE}, ${HERO_IMG}`,
          marginTop: 'var(--hq-header-h)',
        }}
      >
        {/* Mobile-only photo block — 260px, no fade (CP4) */}
        <div className="hq-hero-photo" style={{ backgroundImage: HERO_IMG }} />

        <div className="hq-hero-body">
          <div style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '600px' }}>
              <h1
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(34px, 4vw, 54px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.018em',
                  margin: 0,
                  color: HQ.navy,
                }}
              >
                <span style={{ fontWeight: 600 }}>Finding your Texas</span>
                <br />
                <span style={{ fontWeight: 400 }}>shouldn&rsquo;t be left to chance.</span>
              </h1>

              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(17px, 1.6vw, 19px)',
                  fontWeight: 400,
                  color: HQ.ink,
                  lineHeight: 1.6,
                  margin: '22px 0 0',
                  maxWidth: '40ch',
                }}
              >
                Intelligent technology. Personal guidance. One trusted relationship from discovery to home.
              </p>

              <div className="hq-hero-cta" style={{ marginTop: '30px' }}>
                <Link
                  href={FIND_MY_TEXAS_HREF}
                  className="hq-pill-btn hq-btn-gold hq-focus"
                  style={{ fontFamily: SANS }}
                >
                  Find My Texas &rarr;
                </Link>
                <WatchStoryModal />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — white band directly below the hero (CP4) */}
      <div style={{ background: HQ.white, borderTop: `1px solid ${HQ.cardBorder}` }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '26px 24px' }}>
          <div className="hq-trust-strip">
            {TRUST.map(({ Icon, label, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                <Icon size={28} color={HQ.navy} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                <div style={{ fontFamily: SANS, lineHeight: 1.3 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: HQ.navy }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 400, color: HQ.muted }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

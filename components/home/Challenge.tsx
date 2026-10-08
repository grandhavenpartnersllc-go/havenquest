import { Check } from 'lucide-react'
import { HQ, SANS } from './theme'

// SiteLight-B1-CP5. Stone section. Two-column intro (label + headline left, body right),
// then ONE card split into two equal halves with a navy circle straddling the divide.
// Playfair removed — Poppins only. The chip tilts are fixed per-index values, not random,
// so SSR and the client render identically.
const SOURCES = [
  'Google', 'Reddit', 'Zillow', 'Facebook groups', 'School ratings', 'Crime maps',
  'Mortgage calculators', 'Realtor.com', 'TikTok', 'Nextdoor', 'HOA forums',
  'Cost-of-living tools', "Relatives' opinions", '50 open tabs',
]

// Deterministic tilts between −4° and +2° (brief CP5).
const TILTS = [-3, 1, -2, 2, -4, 0, -1, 2, -3, 1, -2, -4, 2, -1]

const CLARITY = [
  'Personalized matching',
  'Dedicated guidance',
  'Vetted local network',
  'End-to-end coordination',
]

export default function Challenge() {
  return (
    <section style={{ background: HQ.stone, padding: '84px 24px 96px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Intro — label + headline left, body right */}
        <div className="hq-split-intro">
          <div>
            <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: HQ.goldLabel, margin: '0 0 14px' }}>
              The Challenge
            </p>
            <h2 style={{ fontFamily: SANS, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.18, letterSpacing: '-0.015em', margin: 0, color: HQ.navy }}>
              <span style={{ fontWeight: 600 }}>The move is complicated. </span>
              <span style={{ fontWeight: 400 }}>We make it simple.</span>
            </h2>
          </div>

          <div>
            <p style={{ fontFamily: SANS, fontSize: '18px', fontWeight: 400, color: HQ.ink, lineHeight: 1.65, margin: 0, maxWidth: '46ch' }}>
              Most people relocating rely on scattered information, endless open tabs, and a lot of
              guesswork. The answers live in a dozen different places &mdash; and none of them know you.
            </p>
            <a href="#how-it-works" className="hq-underline-link hq-focus" style={{ display: 'inline-block', marginTop: '20px', fontFamily: SANS, fontSize: '16px', fontWeight: 500 }}>
              See the difference &rarr;
            </a>
          </div>
        </div>

        {/* One card, two halves, circle on the divide */}
        <div className="hq-card hq-split" style={{ overflow: 'hidden', marginTop: '52px' }}>
          {/* Left half — the chaos */}
          <div style={{ background: HQ.chaosBg, padding: '32px 30px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
              {SOURCES.map((s, i) => (
                <span
                  key={s}
                  style={{
                    fontFamily: SANS, fontSize: '14px', fontWeight: 400, color: HQ.chipText,
                    background: HQ.chipBg, border: `1px solid ${HQ.cardBorder}`,
                    borderRadius: '999px', padding: '6px 13px', whiteSpace: 'nowrap',
                    transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 400, color: HQ.muted, margin: '24px 0 0' }}>
              Scattered. Overwhelming. Uncertain.
            </p>
          </div>

          {/* Right half — the clarity */}
          <div style={{ background: HQ.white, padding: '32px 30px' }}>
            <p style={{ fontFamily: SANS, fontSize: '19px', fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 20px' }}>
              <span style={{ color: HQ.navy }}>Haven</span>
              <span style={{ color: HQ.goldWordmark }}>Quest</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {CLARITY.map((c) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: HQ.goldBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color={HQ.navy} strokeWidth={2.5} />
                  </span>
                  <span style={{ fontFamily: SANS, fontSize: '17px', color: HQ.ink, fontWeight: 400 }}>{c}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 500, color: HQ.navy, margin: '24px 0 0' }}>
              Clear. Confident. Connected.
            </p>
          </div>

          {/* Navy circle on the dividing line — rotates to point down when the halves stack */}
          <div className="hq-split-badge" aria-hidden>
            <span className="hq-split-badge__glyph">&raquo;</span>
          </div>
        </div>
      </div>
    </section>
  )
}

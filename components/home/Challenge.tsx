import { Check } from 'lucide-react'
import { HQ, SANS, SERIF } from './theme'

const SOURCES = [
  'Google', 'Reddit', 'Zillow', 'Facebook groups', 'School ratings', 'Crime maps',
  'Mortgage calculators', 'Realtor.com', 'TikTok', 'Nextdoor', 'HOA forums',
  'Cost-of-living tools', "Relatives' opinions", '50 open tabs',
]

const CLARITY = [
  'Personalized matching',
  'Dedicated guidance',
  'Vetted local network',
  'End-to-end coordination',
]

export default function Challenge() {
  return (
    <section style={{ background: HQ.navy, padding: '96px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontFamily: SANS, fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: HQ.gold, margin: '0 0 16px', fontWeight: 500 }}>
          The Challenge
        </p>
        <h2 style={{ fontFamily: SANS, fontSize: 'clamp(26px, 3.4vw, 34px)', fontWeight: 700, lineHeight: 1.2, margin: 0, maxWidth: '720px' }}>
          <span style={{ color: HQ.offwhite }}>The move is complicated. </span>
          <span style={{ color: HQ.gold }}>We make it simple.</span>
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', marginTop: '48px' }}>
          {/* Intro */}
          <div style={{ flex: '1 1 280px', minWidth: '260px' }}>
            <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 300, color: HQ.slate3, lineHeight: 1.75, margin: 0 }}>
              Most people relocating rely on scattered information, endless open tabs, and a lot of
              guesswork. The answers live in a dozen different places &mdash; and none of them know
              your family.
            </p>
            <a href="#how-it-works" style={{ display: 'inline-block', marginTop: '20px', fontFamily: SANS, fontSize: '14px', fontWeight: 500, color: HQ.gold, textDecoration: 'none' }}>
              See the difference &rarr;
            </a>
          </div>

          {/* Chaos → clarity */}
          <div style={{ flex: '2 1 560px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
            {/* Chaos cluster */}
            <div style={{ flex: '1 1 250px', minWidth: '240px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SOURCES.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: SANS, fontSize: '12px', fontWeight: 300, color: HQ.slate,
                      background: HQ.navy4, border: '1px solid rgba(147,164,188,0.14)',
                      borderRadius: '999px', padding: '5px 11px', whiteSpace: 'nowrap',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p style={{ fontFamily: SANS, fontSize: '10.5px', letterSpacing: '2px', textTransform: 'uppercase', color: HQ.slate2, margin: '16px 0 0', fontWeight: 500 }}>
                Scattered. Overwhelming. Uncertain.
              </p>
            </div>

            {/* Double-chevron */}
            <div
              aria-hidden
              className="hq-glow"
              style={{
                flexShrink: 0, fontSize: '52px', lineHeight: 1, color: HQ.gold, fontWeight: 700,
                textShadow: `0 0 24px rgba(232,200,119,0.55)`, textAlign: 'center',
              }}
            >
              &raquo;
            </div>

            {/* Clarity card */}
            <div
              style={{
                flex: '1 1 230px', minWidth: '230px',
                background: `linear-gradient(160deg, ${HQ.navy3}, ${HQ.navy2})`,
                border: '1px solid rgba(201,169,97,0.28)', borderRadius: '14px', padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
              }}
            >
              <p style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: HQ.gold, margin: '0 0 16px', fontWeight: 600 }}>
                HavenQuest
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CLARITY.map((c) => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(201,169,97,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={12} color={HQ.gold} strokeWidth={2.5} />
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: '14px', color: HQ.offwhite, fontWeight: 400 }}>{c}</span>
                  </div>
                ))}
              </div>
              <p className="hq-serif" style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '17px', color: HQ.gold, margin: '20px 0 0' }}>
                Clear. Confident. Connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

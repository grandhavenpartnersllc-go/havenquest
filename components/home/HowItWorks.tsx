import { HQ, SANS, SERIF } from './theme'

const STEPS = [
  {
    num: '01', key: 'explore', name: 'EXPLORE',
    title: 'Find Your Texas',
    body: 'Answer a few questions and watch the map narrow to the places that fit your money and your life. Explore as long as you want. Nobody calls you until you ask.',
    accent: 'Have fun exploring.',
  },
  {
    num: '02', key: 'connect', name: 'CONNECT',
    title: 'Meet your Market Director.',
    body: 'A dedicated guide becomes your partner for the whole journey — learning your family, your priorities, and your worries.',
    accent: 'Now you have a partner.',
  },
  {
    num: '03', key: 'navigate', name: 'NAVIGATE',
    title: 'The whole move, handled.',
    body: 'Your guide steers the real work — the home purchase, financing, vendors, schools, and the move itself — so nothing falls through the cracks.',
    accent: 'We help carry the load.',
  },
  {
    num: '04', key: 'breathe', name: 'BELONG',
    title: 'Home, Texan.',
    body: 'Settled, rooted, and part of the place — not just a closed transaction, but a life that fits.',
    accent: "You're home.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: HQ.navy2, padding: '84px 24px 96px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontFamily: SANS, fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: HQ.gold, margin: '0 0 16px', fontWeight: 500 }}>
          How It Works
        </p>
        <h2 style={{ fontFamily: SANS, fontSize: 'clamp(26px, 3.4vw, 34px)', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
          <span style={{ color: HQ.offwhite }}>One relationship, </span>
          <span style={{ color: HQ.gold }}>four steps.</span>
        </h2>
        <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 300, color: HQ.slate3, lineHeight: 1.7, margin: '14px 0 0', maxWidth: '640px' }}>
          From first curiosity to truly home &mdash; a single continuous journey, not a series of handoffs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '22px', marginTop: '48px' }}>
          {STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                background: HQ.navy3,
                border: '1px solid rgba(147,164,188,0.12)',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image (falls back to a navy gradient until the asset is added) */}
              <div
                style={{
                  position: 'relative',
                  height: '176px',
                  backgroundImage: `linear-gradient(180deg, rgba(8,20,38,0.10), rgba(8,20,38,0.65)), url('/images/home/${s.key}.jpg'), linear-gradient(150deg, ${HQ.navy5}, ${HQ.navy})`,
                  backgroundSize: 'cover, cover, cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Number badge removed — the step number now lives in the eyebrow below */}

              {/* Content */}
              <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontFamily: SANS, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', color: HQ.gold, margin: '0 0 8px', fontWeight: 600 }}>
                  {s.num} &mdash; {s.name}
                </p>
                <h3 style={{ fontFamily: SANS, fontSize: '18px', fontWeight: 600, color: HQ.offwhite, margin: '0 0 10px', lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13.5px', fontWeight: 300, color: HQ.slate3, lineHeight: 1.7, margin: 0 }}>
                  {s.body}
                </p>
                {s.accent && (
                  <p className="hq-serif" style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '14px', color: HQ.gold, marginTop: 'auto', paddingTop: '14px' }}>
                    {s.accent}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

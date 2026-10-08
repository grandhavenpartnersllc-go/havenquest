import { HQ, SANS } from './theme'

// SiteLight-B1-CP6. White section with a top border. Numbered navy circles above the
// cards, joined by a gold connector line (hidden below 1000px). The dark gradient over
// each card photo is gone — the photos now read as photos. Playfair removed.
const STEPS = [
  {
    num: '1', key: 'explore', name: 'Explore',
    title: 'Find Your Texas',
    body: 'Answer a few questions and watch the map narrow to the places that fit your money and your life. Explore as long as you want. Nobody calls you until you ask.',
    accent: 'Have fun exploring.',
  },
  {
    num: '2', key: 'connect', name: 'Connect',
    title: 'Meet your Market Director.',
    body: 'A dedicated guide becomes your partner for the whole journey — getting to know you, your priorities, and your worries.',
    accent: 'Now you have a partner.',
  },
  {
    num: '3', key: 'navigate', name: 'Navigate',
    title: 'The whole move, handled.',
    body: 'Your guide steers the real work — the home purchase, financing, vendors, schools, and the move itself — so nothing falls through the cracks.',
    accent: 'We help carry the load.',
  },
  {
    // The label reads "Belong"; the image file is breathe.jpg (pre-existing asset name).
    num: '4', key: 'breathe', name: 'Belong',
    title: 'Home, Texan.',
    body: 'Settled, rooted, and part of the place — not just a closed transaction, but a life that fits.',
    accent: "You're home.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: HQ.white, borderTop: `1px solid ${HQ.cardBorder}`, padding: '84px 24px 96px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: HQ.goldLabel, margin: '0 0 14px' }}>
          How It Works
        </p>
        <h2 style={{ fontFamily: SANS, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.18, letterSpacing: '-0.015em', margin: 0, color: HQ.navy }}>
          <span style={{ fontWeight: 600 }}>One relationship, </span>
          <span style={{ fontWeight: 400 }}>four steps.</span>
        </h2>
        <p style={{ fontFamily: SANS, fontSize: '18px', fontWeight: 400, color: HQ.ink, lineHeight: 1.65, margin: '14px 0 0', maxWidth: '46ch' }}>
          From first curiosity to truly home &mdash; a single continuous journey, not a series of handoffs.
        </p>

        {/* Numbered circles + gold connector line */}
        <div style={{ position: 'relative', marginTop: '52px' }}>
          <div
            className="hq-step-line"
            aria-hidden
            style={{
              position: 'absolute', top: '17px', left: '12.5%', right: '12.5%',
              height: '2px', background: HQ.gold, zIndex: 0,
            }}
          />
          <div className="hq-steps" style={{ position: 'relative', zIndex: 1 }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Step circle */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span
                    style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      background: HQ.navy, color: HQ.white,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: SANS, fontSize: '15px', fontWeight: 600, lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </span>
                </div>

                {/* Card */}
                <div className="hq-card" style={{ marginTop: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Photo — no dark gradient (CP6) */}
                  <div
                    style={{
                      height: '150px',
                      backgroundImage: `url('/images/home/${s.key}.jpg')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: HQ.stone,
                    }}
                  />
                  <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 600, color: HQ.goldLabel, margin: '0 0 8px' }}>
                      {s.name}
                    </p>
                    <h3 style={{ fontFamily: SANS, fontSize: '20px', fontWeight: 600, color: HQ.navy, margin: '0 0 10px', lineHeight: 1.25 }}>
                      {s.title}
                    </h3>
                    <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 400, color: HQ.ink, lineHeight: 1.6, margin: 0 }}>
                      {s.body}
                    </p>
                    <p style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: HQ.navy, marginTop: 'auto', paddingTop: '16px', marginBottom: 0 }}>
                      {s.accent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { HQ, SANS, FIND_MY_TEXAS_HREF } from './theme'
import { InvestorAccessButton } from '../investor/InvestorAccessProvider'

// SiteLight-B1-CP8. Navy footer, Poppins only (Playfair removed). Every dead `#` anchor
// is gone: Resources, Contact, Our Story, Our Team, Careers, Terms, Site Map and the four
// placeholder social icons were all removed per the brief, which takes the footer from 11
// dead links to zero. Texas Insider uses /texas/texas-insider, the same href the shared
// Header already serves (components/shared/Header.tsx:38).
const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Communities', href: '#communities' },
      { label: 'About', href: '/about' },
      { label: 'Texas Insider', href: '/texas/texas-insider' },
    ],
  },
  {
    title: 'Metros',
    links: [
      { label: 'Austin', href: '#communities' },
      { label: 'Dallas–Fort Worth', href: '#communities' },
      { label: 'Houston', href: '#communities' },
      { label: 'San Antonio', href: '#communities' },
    ],
  },
]

export default function HomeFooter() {
  return (
    <footer style={{ background: HQ.navy, borderTop: `1px solid ${HQ.gold}2e` }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '72px 24px 32px' }}>
        {/* Top: headline + CTA card */}
        <div className="hq-footer-top">
          <h2 style={{ fontFamily: SANS, fontSize: 'clamp(28px, 3.4vw, 40px)', lineHeight: 1.18, letterSpacing: '-0.015em', margin: 0, maxWidth: '20ch' }}>
            <span style={{ color: HQ.white, fontWeight: 600 }}>Your Lone Star lifestyle </span>
            <span style={{ color: HQ.gold, fontWeight: 400 }}>awaits.</span>
          </h2>

          <div
            style={{
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(197,183,131,.35)',
              borderRadius: '16px',
              padding: '28px 30px',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '18px',
            }}
          >
            <div>
              <p style={{ fontFamily: SANS, fontSize: '18px', fontWeight: 600, color: HQ.white, margin: '0 0 4px' }}>Ready to get started?</p>
              <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Your first matches are minutes away.</p>
            </div>
            <Link
              href={FIND_MY_TEXAS_HREF}
              className="hq-pill-btn hq-btn-gold hq-focus"
              style={{ fontFamily: SANS }}
            >
              Find My Texas &rarr;
            </Link>
          </div>
        </div>

        {/* Link columns */}
        <div
          className="hq-footer-cols"
          style={{ marginTop: '56px', paddingTop: '48px', borderTop: '1px solid rgba(255,255,255,0.14)' }}
        >
          {/* Brand blurb */}
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '21px', letterSpacing: '-0.01em', lineHeight: 1 }}>
              <span style={{ color: HQ.white }}>Haven</span>
              <span style={{ color: HQ.gold }}>Quest</span>
            </div>
            <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, margin: '14px 0 0', maxWidth: '34ch' }}>
              Intelligent technology and personal guidance &mdash; one trusted relationship from discovery to home.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: HQ.gold, margin: '0 0 16px' }}>
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('#') ? (
                      <a href={l.href} className="hq-link hq-focus" style={{ fontFamily: SANS, fontSize: '16px' }}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hq-link hq-focus" style={{ fontFamily: SANS, fontSize: '16px' }}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Your account */}
          <div>
            <p style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: HQ.gold, margin: '0 0 16px' }}>
              Your account
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/portal" className="hq-link hq-focus" style={{ fontFamily: SANS, fontSize: '16px' }}>
                  My Navigator
                </Link>
              </li>
              <li>
                <InvestorAccessButton
                  className="hq-link hq-focus"
                  style={{ fontFamily: SANS, fontSize: '16px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  Investor Access
                </InvestorAccessButton>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <p style={{ fontFamily: SANS, fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            &copy; 2026 HavenQuest. All rights reserved.
          </p>
          <Link href="/privacy-policy" className="hq-link hq-focus" style={{ fontFamily: SANS, fontSize: '16px' }}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

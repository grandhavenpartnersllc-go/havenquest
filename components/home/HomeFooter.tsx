import Link from 'next/link'
// lucide-react@1.16 no longer ships brand logos (Facebook/Instagram/etc.), so the social
// row uses generic glyphs as placeholders — real brand SVGs can swap in later.
import { Lock, Globe, AtSign, Mail, MessageCircle } from 'lucide-react'
import { HQ, SANS, SERIF, FIND_MY_TEXAS_HREF } from './theme'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Communities', href: '#communities' },
      { label: 'Resources', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Stories', href: '#' },
      { label: 'Contact', href: '#' },
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
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '#' },
      { label: 'Our Team', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
]

const SOCIALS = [Globe, AtSign, Mail, MessageCircle]

export default function HomeFooter() {
  return (
    <footer style={{ background: HQ.navy, borderTop: '1px solid rgba(201,169,97,0.18)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '72px 24px 32px' }}>
        {/* Top: headline + CTA card */}
        <div className="hq-footer-top" style={{ display: 'grid', rowGap: '32px', alignItems: 'center' }}>
          <h2 className="hq-serif" style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, lineHeight: 1.15, margin: 0, maxWidth: '440px' }}>
            <span style={{ color: HQ.offwhite }}>Your Lone Star lifestyle </span>
            <span style={{ color: HQ.gold, fontStyle: 'italic' }}>awaits.</span>
          </h2>

          <div
            style={{
              background: `linear-gradient(160deg, ${HQ.navy3}, ${HQ.navy2})`,
              border: '1px solid rgba(201,169,97,0.28)', borderRadius: '16px', padding: '28px 30px',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '18px',
            }}
          >
            <div>
              <p style={{ fontFamily: SANS, fontSize: '18px', fontWeight: 600, color: HQ.offwhite, margin: '0 0 4px' }}>Ready to get started?</p>
              <p style={{ fontFamily: SANS, fontSize: '13px', fontWeight: 300, color: HQ.slate, margin: 0 }}>Your first matches are minutes away.</p>
            </div>
            <Link
              href={FIND_MY_TEXAS_HREF}
              className="hq-btn-gold"
              style={{ borderRadius: '9px', padding: '13px 26px', textDecoration: 'none', fontFamily: SANS, fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Find My Texas &rarr;
            </Link>
          </div>
        </div>

        {/* Link columns */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: '32px', marginTop: '56px', paddingTop: '48px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Brand blurb */}
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '20px', letterSpacing: '-0.01em', lineHeight: 1 }}>
              <span style={{ color: HQ.offwhite }}>Haven</span>
              <span style={{ color: HQ.gold }}>Quest</span>
            </div>
            <p style={{ fontFamily: SANS, fontSize: '12.5px', fontWeight: 300, color: HQ.slate, lineHeight: 1.7, margin: '14px 0 0', maxWidth: '240px' }}>
              Intelligent technology and personal guidance — one trusted relationship from discovery to home.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: HQ.gold, margin: '0 0 16px', fontWeight: 600 }}>
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hq-link" style={{ fontFamily: SANS, fontSize: '13.5px' }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="hq-footer-bottom"
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p style={{ fontFamily: SANS, fontSize: '12px', fontWeight: 300, color: HQ.slate2, margin: 0 }}>
            © 2026 HavenQuest. All rights reserved.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
            <Link href="/privacy-policy" className="hq-link" style={{ fontFamily: SANS, fontSize: '12.5px' }}>Privacy Policy</Link>
            <a href="#" className="hq-link" style={{ fontFamily: SANS, fontSize: '12.5px' }}>Terms</a>
            <a href="#" className="hq-link" style={{ fontFamily: SANS, fontSize: '12.5px' }}>Site Map</a>
            <a href="#" className="hq-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: SANS, fontSize: '12.5px' }}>
              <Lock size={12} /> Investor Access
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {SOCIALS.map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="hq-link" style={{ display: 'flex' }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

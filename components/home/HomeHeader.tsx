'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Compass, Lock, Menu, X } from 'lucide-react'
import { HQ, SANS, FIND_MY_TEXAS_HREF } from './theme'
import { useInvestorAccess } from '../investor/InvestorAccessProvider'

// SiteLight-B1-CP3. Solid navy bar at all times — the scroll-aware transparent-over-hero
// behaviour is gone, along with the scrim, the blur and the `scrolled` state, because the
// hero is now a light photo and a transparent bar had nothing dark to sit on.
// Resources and Contact are removed (both were dead `#` anchors); About now points at the
// real /about route the shared Header already serves.
const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Communities', href: '#communities' },
  { label: 'About', href: '/about' },
]

const HEADER_H = '64px'

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { open: openInvestorAccess } = useInvestorAccess()

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      <div
        style={{
          background: HQ.navy,
          borderBottom: `1px solid ${HQ.cardBorder}22`,
        }}
      >
        <div
          className="hq-header-inner"
          style={{
            position: 'relative',
            maxWidth: '1240px',
            margin: '0 auto',
            height: HEADER_H,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {/* Wordmark — tagline removed (B1-CP3) */}
          <Link href="/" className="hq-focus" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '21px', letterSpacing: '-0.01em', lineHeight: 1 }}>
              <span style={{ color: HQ.white }}>Haven</span>
              <span style={{ color: HQ.gold }}>Quest</span>
            </div>
          </Link>

          {/* Left links — hidden below 1000px via .hq-nav-links */}
          <nav className="hq-nav-links" style={{ alignItems: 'center', gap: '28px', fontFamily: SANS, fontSize: '14.5px', fontWeight: 400 }}>
            {NAV_LINKS.map((l) =>
              l.href.startsWith('#') ? (
                <a key={l.label} href={l.href} className="hq-link hq-focus">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className="hq-link hq-focus">
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Desktop right cluster */}
          <div className="hq-nav-right" style={{ alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={openInvestorAccess}
              aria-haspopup="dialog"
              className="hq-link hq-focus"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: SANS, fontSize: '13px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <Lock size={13} />
              Investor Access
            </button>
            <Link
              href="/portal"
              className="hq-focus"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: SANS, fontSize: '13px', fontWeight: 600, color: HQ.gold, border: `1px solid ${HQ.gold}99`, borderRadius: '999px', padding: '9px 16px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <Compass size={14} />
              My Navigator
            </Link>
            <Link
              href={FIND_MY_TEXAS_HREF}
              className="hq-pill-btn hq-btn-gold hq-focus"
              style={{ fontFamily: SANS, fontSize: '15px', padding: '11px 22px' }}
            >
              Find My Texas →
            </Link>
          </div>

          {/* Mobile cluster: compact CTA + hamburger — shown below 760px */}
          <div className="hq-nav-mobile" style={{ alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <Link
              href={FIND_MY_TEXAS_HREF}
              className="hq-pill-btn hq-btn-gold hq-focus"
              style={{ fontFamily: SANS, fontSize: '14px', padding: '10px 18px' }}
            >
              Find My Texas
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="hq-focus"
              style={{ background: 'transparent', border: 'none', color: HQ.white, padding: '4px', cursor: 'pointer', display: 'flex' }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown — same link set as desktop */}
      {menuOpen && (
        <div
          className="hq-nav-mobile-panel"
          style={{
            background: HQ.navy,
            borderBottom: `1px solid ${HQ.gold}3d`,
            padding: '8px 24px 24px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: SANS, fontSize: '16px' }}>
            <Link
              href="/portal"
              onClick={() => setMenuOpen(false)}
              className="hq-focus"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', fontFamily: SANS, fontSize: '16px', fontWeight: 600, color: HQ.gold, border: `1px solid ${HQ.gold}99`, borderRadius: '999px', padding: '10px 18px', textDecoration: 'none', margin: '4px 0 8px' }}
            >
              <Compass size={16} />
              My Navigator
            </Link>
            {NAV_LINKS.map((l) =>
              l.href.startsWith('#') ? (
                <a
                  key={l.label}
                  href={l.href}
                  className="hq-link hq-focus"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="hq-link hq-focus"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {l.label}
                </Link>
              ),
            )}
            <button
              type="button"
              className="hq-link hq-focus"
              aria-haspopup="dialog"
              onClick={() => {
                setMenuOpen(false)
                openInvestorAccess()
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 0 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: SANS, fontSize: '16px' }}
            >
              <Lock size={14} />
              Investor Access
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Compass, Lock, Menu, X } from 'lucide-react'
import { HQ, SANS, FIND_MY_TEXAS_HREF } from './theme'
import { useInvestorAccess } from '../investor/InvestorAccessProvider'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Communities', href: '#communities' },
  { label: 'Resources', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
]

export default function HomeHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { open: openInvestorAccess } = useInvestorAccess()

  useEffect(() => {
    const onScroll = () => {
      // Solid bar fades in once we've scrolled roughly past the (full-height) hero.
      setScrolled(window.scrollY > window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      {/* Top scrim for legibility while transparent over the hero */}
      {!scrolled && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(8,20,38,0.82) 0%, rgba(8,20,38,0.30) 55%, rgba(8,20,38,0) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          background: scrolled ? 'rgba(8,20,38,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(201,169,97,0.28)' : 'transparent'}`,
          transition: 'background-color 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div
          className="hq-header-inner"
          style={{
            position: 'relative',
            maxWidth: '1360px',
            margin: '0 auto',
            height: 'var(--hq-header-h)',
            padding: '0 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Logo wordmark (a real logo image swaps in here later — single spot) */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '23px', letterSpacing: '-0.01em', lineHeight: 1 }}>
              <span style={{ color: HQ.offwhite }}>Haven</span>
              <span style={{ color: HQ.gold }}>Quest</span>
            </div>
            <div
              className="hidden nav:block"
              style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: HQ.slate, marginTop: '5px', fontFamily: SANS }}
            >
              Clarity. Confidence. Peace of Mind.
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden nav:flex" style={{ alignItems: 'center', gap: '30px', fontFamily: SANS, fontSize: '14px', fontWeight: 400 }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hq-link">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop right cluster */}
          <div className="hidden nav:flex" style={{ alignItems: 'center', gap: '22px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={openInvestorAccess}
              aria-haspopup="dialog"
              className="hq-link"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: SANS, fontSize: '13px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <Lock size={13} />
              Investor Access
            </button>
            {/* My Navigator — Option 2 gold-outline door, left of the Find My Texas CTA. Points at /portal (auth-gates + resumes). */}
            <Link
              href="/portal"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: SANS, fontSize: '13px', fontWeight: 600, color: '#C9A961', border: '1px solid rgba(201,169,97,0.6)', borderRadius: '8px', padding: '9px 16px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <Compass size={14} />
              My Navigator
            </Link>
            <FindMyTexasCTA />
          </div>

          {/* Mobile cluster: compact CTA + hamburger */}
          <div className="flex nav:hidden" style={{ alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <Link
              href={FIND_MY_TEXAS_HREF}
              className="hq-btn-gold"
              style={{ borderRadius: '8px', padding: '9px 14px', textDecoration: 'none', fontFamily: SANS, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Find My Texas
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{ background: 'transparent', border: 'none', color: HQ.offwhite, padding: '4px', cursor: 'pointer', display: 'flex' }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="nav:hidden"
          style={{
            background: 'rgba(8,20,38,0.98)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(201,169,97,0.28)',
            padding: '8px 32px 24px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: SANS, fontSize: '15px' }}>
            {/* My Navigator — top of the mobile menu (per approved placement). Same gold-outline door → /portal. */}
            <Link
              href="/portal"
              onClick={() => setMenuOpen(false)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', fontFamily: SANS, fontSize: '15px', fontWeight: 600, color: '#C9A961', border: '1px solid rgba(201,169,97,0.6)', borderRadius: '8px', padding: '10px 16px', textDecoration: 'none', margin: '4px 0 8px' }}
            >
              <Compass size={16} />
              My Navigator
            </Link>
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hq-link"
                onClick={() => setMenuOpen(false)}
                style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              className="hq-link"
              aria-haspopup="dialog"
              onClick={() => {
                setMenuOpen(false)
                openInvestorAccess()
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 0 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: SANS, fontSize: '15px' }}
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

function FindMyTexasCTA() {
  return (
    <Link
      href={FIND_MY_TEXAS_HREF}
      className="hq-btn-gold"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '8px',
        padding: '8px 20px',
        textDecoration: 'none',
        fontFamily: SANS,
        lineHeight: 1.15,
      }}
    >
      <span style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, opacity: 0.65 }}>Start Here</span>
      <span style={{ fontSize: '14px', fontWeight: 600 }}>Find My Texas →</span>
    </Link>
  )
}

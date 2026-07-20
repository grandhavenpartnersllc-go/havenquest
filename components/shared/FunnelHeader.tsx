'use client'

import Link from 'next/link'
import { HQ, SANS } from '../home/theme'

// Shared funnel header — intake + results. Deliberately NOT the shared 20-route Header,
// and NOT the homepage's scroll-aware HomeHeader (which is fixed, carries homepage-only
// nav, and sits over a hero the funnel does not have). A solid navy bar that reuses the
// homepage brand tokens/wordmark so the brand reads identically, with no scroll logic
// and no exit links — the logo (→ /) is the only control across every funnel screen.
export default function FunnelHeader() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: HQ.navy,
        borderBottom: '1px solid rgba(201,169,97,0.22)',
      }}
    >
      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          height: '68px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '21px', letterSpacing: '-0.01em', lineHeight: 1 }}>
            <span style={{ color: HQ.offwhite }}>Haven</span>
            <span style={{ color: HQ.gold }}>Quest</span>
          </div>
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: HQ.slate,
              marginTop: '5px',
              fontFamily: SANS,
              fontWeight: 500,
            }}
          >
            Clarity. Confidence. Peace of Mind.
          </div>
        </Link>
      </div>
    </header>
  )
}

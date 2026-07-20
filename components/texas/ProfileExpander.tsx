'use client'

import { useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface ProfileExpanderProps {
  cityName: string
  teaser: string
  children: React.ReactNode
}

export default function ProfileExpander({ cityName, teaser, children }: ProfileExpanderProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  function collapse() {
    setOpen(false)
    setTimeout(() => triggerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <div>
      {/* Section B — Expand trigger */}
      <div ref={triggerRef}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%',
            background: '#FDFAF4',
            border: '1px solid #C9A84C',
            borderRadius: '12px',
            padding: '24px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>
              Full Profile
            </p>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '10px' }}>
              The complete {cityName} story — market analysis, neighborhoods, schools, and what homeownership really costs here
            </h3>
            <p style={{ fontSize: '14px', color: '#6B6560', lineHeight: 1.65 }}>{teaser}</p>
          </div>
          <ChevronDown
            size={22}
            style={{
              color: '#C9A84C',
              flexShrink: 0,
              marginTop: '4px',
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </div>

      {/* Section C — Full article, hidden by default */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '20000px' : '0px',
          transition: 'max-height 0.6s ease',
        }}
      >
        <div style={{ paddingTop: '40px' }}>
          {children}

          {/* Collapse button */}
          <div style={{ textAlign: 'center', marginTop: '56px', paddingTop: '32px', borderTop: '1px solid #D4C5A9' }}>
            <button
              onClick={collapse}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: '1px solid #D4C5A9',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '13px',
                color: '#6B6560',
                cursor: 'pointer',
              }}
            >
              <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} />
              Collapse full profile
            </button>
          </div>

          {/* Footer strip */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #D4C5A9' }}>
            <p style={{ fontSize: '11px', color: '#9A8E82', marginBottom: '12px' }}>
              Sources: TRERC · Redfin · Zillow · Dallas Fed · U.S. Census · Texas.gov · Updated Q2 2026
            </p>
            <Link href="/begin" style={{ fontSize: '13px', fontWeight: 600, color: '#C9A84C', textDecoration: 'none' }}>
              Find My Texas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
